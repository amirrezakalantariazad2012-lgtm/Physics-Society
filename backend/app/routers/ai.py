from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Optional

from app.database import get_db
from app.models.user import User
from app.models.curriculum import Chapter, Lesson
from app.models.exam import Question, QuestionOption
from app.schemas.ai import (
    AITutorRequest,
    AITutorResponse,
    AIMistakeExplanationRequest,
    AIMistakeExplanationResponse
)
from app.services.auth import get_current_user, get_optional_current_user
from app.services.ai_service import AIService

router = APIRouter(prefix="/ai", tags=["AI Educational Services"])

@router.post("/tutor", response_model=AITutorResponse)
def get_ai_tutor_guidance(
    req: AITutorRequest,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    """
    Context-aware Socratic AI tutor for students with grade scoping.
    Supports authenticated students and guest learners seamlessly.
    """
    # Enforce Grade Scoping for authenticated students
    user_grade_id = current_user.profile.grade_id if (current_user and current_user.profile) else None
    is_student = (current_user is not None) and (current_user.role == "student")

    if is_student and user_grade_id is not None and user_grade_id != req.grade_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="دسترسی به معلم هوشمند سایر پایه‌های تحصیلی مجاز نمی‌باشد."
        )

    # Fetch context details if provided
    chapter_title = None
    if req.chapter_id:
        chapter = db.query(Chapter).filter(Chapter.id == req.chapter_id).first()
        if chapter:
            if is_student and user_grade_id is not None and chapter.book.grade_id != user_grade_id:
                raise HTTPException(status_code=403, detail="دسترسی به فصول سایر پایه‌ها مجاز نیست.")
            chapter_title = f"{chapter.title_fa} ({chapter.book.title_fa})"

    lesson_title = None
    if req.lesson_id:
        lesson = db.query(Lesson).filter(Lesson.id == req.lesson_id).first()
        if lesson:
            if is_student and user_grade_id is not None and lesson.chapter.book.grade_id != user_grade_id:
                raise HTTPException(status_code=403, detail="دسترسی به درسنامه‌های سایر پایه‌ها مجاز نیست.")
            lesson_title = lesson.title_fa

    question_prompt = None
    if req.question_id:
        question = db.query(Question).filter(Question.id == req.question_id).first()
        if question:
            if is_student and user_grade_id is not None and question.grade_id != user_grade_id:
                raise HTTPException(status_code=403, detail="دسترسی به سؤالات سایر پایه‌ها مجاز نیست.")
            question_prompt = question.prompt_fa

    grade_number = 7
    if req.grade_id == 2:
        grade_number = 8
    elif req.grade_id == 3:
        grade_number = 9

    ai_svc = AIService(db=db)
    return ai_svc.provide_tutoring(
        student_query=req.student_query,
        grade_number=grade_number,
        chapter_title=chapter_title,
        lesson_title=lesson_title,
        question_prompt=question_prompt,
        page_context=req.page_context,
        history=req.history,
        preferred_model=req.preferred_model
    )

@router.post("/explain-mistake", response_model=AIMistakeExplanationResponse)
def explain_student_mistake(
    req: AIMistakeExplanationRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Analyzes student mistakes on a question and explains the conceptual misconception.
    """
    question = db.query(Question).filter(Question.id == req.question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="سؤال مورد نظر یافت نشد.")

    # Enforce Grade Scoping
    user_grade_id = current_user.profile.grade_id if current_user.profile else None
    if current_user.role == "student" and user_grade_id is not None:
        if question.grade_id != user_grade_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="عدم دسترسی به سؤالات پایه‌های دیگر."
            )

    options_info = None
    correct_text = "پاسخ صحیح مطابق کتاب درسی است."
    student_chosen_text = req.student_text or "گزینه نادرست"

    if question.rubric and question.rubric.reference_answer_fa:
        correct_text = question.rubric.reference_answer_fa

    if question.options:
        opts_summary = []
        for opt in question.options:
            marker = " (صحیح)" if opt.is_correct else ""
            opts_summary.append(f"- {opt.option_key}: {opt.text_fa}{marker}")
            if opt.is_correct:
                correct_text = opt.text_fa
                if opt.explanation_fa:
                    correct_text += f" ({opt.explanation_fa})"
            if req.selected_option_id and opt.id == req.selected_option_id:
                student_chosen_text = opt.text_fa
        options_info = "\n".join(opts_summary)

    ai_svc = AIService(db=db)
    result = ai_svc.explain_mistake(
        question_prompt=question.prompt_fa,
        correct_answer=correct_text,
        student_answer=student_chosen_text,
        options_info=options_info
    )
    result.question_id = question.id
    return result

@router.get("/models/free")
def get_free_models():
    """Returns curated free models list from Nexora OpenRouter integration"""
    from app.services.ai_service import NEXORA_FREE_MODELS
    return {
        "ok": True,
        "models": NEXORA_FREE_MODELS,
        "count": len(NEXORA_FREE_MODELS)
    }

@router.get("/models/status")
def get_model_statuses(db: Session = Depends(get_db)):
    """Returns latency tiers and health status of AI models (Nexora engine)"""
    ai_svc = AIService(db=db)
    return ai_svc.get_model_statuses()

