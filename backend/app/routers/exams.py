from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime

from app.database import get_db
from app.models.user import User
from app.models.exam import Examination, ExaminationAttempt, ExaminationQuestion, StudentAnswer, QuestionOption
from app.schemas.exam import (
    ExamStartRequest, ExamSubmissionRequest, ExamResultResponse,
    QuestionResponse, OptionResponse, QuestionResultItem
)
from app.services.auth import get_current_user
from app.services.exam_service import start_exam_attempt, submit_exam_attempt

router = APIRouter(prefix="/exams", tags=["Examinations"])

@router.get("")
def list_examinations(
    grade_id: Optional[int] = None,
    chapter_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """Lists active examinations with question and point stats"""
    query = db.query(Examination).filter(Examination.is_active == True)
    if grade_id:
        query = query.filter(Examination.grade_id == grade_id)
    if chapter_id:
        query = query.filter(Examination.chapter_id == chapter_id)

    exams = query.all()
    results = []
    for e in exams:
        results.append({
            "id": e.id,
            "title_fa": e.title_fa,
            "description_fa": e.description_fa,
            "exam_mode": e.exam_mode,
            "duration_minutes": e.duration_minutes,
            "total_points": e.total_points,
            "passing_score": e.passing_score,
            "grade_id": e.grade_id,
            "chapter_id": e.chapter_id,
            "question_count": len(e.questions)
        })
    return results

@router.get("/{exam_id}")
def get_examination_info(exam_id: int, db: Session = Depends(get_db)):
    """Retrieves examination overview"""
    e = db.query(Examination).filter(Examination.id == exam_id).first()
    if not e:
        raise HTTPException(status_code=404, detail="آزمون مورد نظر یافت نشد.")

    return {
        "id": e.id,
        "title_fa": e.title_fa,
        "description_fa": e.description_fa,
        "exam_mode": e.exam_mode,
        "duration_minutes": e.duration_minutes,
        "total_points": e.total_points,
        "passing_score": e.passing_score,
        "question_count": len(e.questions),
        "randomize_questions": e.randomize_questions,
        "show_immediate_feedback": e.show_immediate_feedback
    }

@router.post("/{exam_id}/start")
def start_exam(
    exam_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Initializes an exam attempt session and returns questions
    CRITICAL: Does NOT return correct answer keys to the client!
    Enforces student grade scoping.
    """
    exam_record = db.query(Examination).filter(Examination.id == exam_id, Examination.is_active == True).first()
    if not exam_record:
        raise HTTPException(status_code=404, detail="آزمون مورد نظر یافت نشد یا غیرفعال است.")

    if current_user.role == "student" and current_user.profile and current_user.profile.grade_id:
        if exam_record.grade_id and current_user.profile.grade_id != exam_record.grade_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="دسترسی غیرمجاز: این آزمون متعلق به پایه تحصیلی شما نیست."
            )

    try:
        attempt = start_exam_attempt(db, exam_id, current_user.id)
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))

    exam = attempt.examination
    questions_data = []

    for eq in exam.questions:
        q = eq.question
        # Build options WITHOUT is_correct
        options_list = []
        for opt in q.options:
            options_list.append({
                "id": opt.id,
                "option_key": opt.option_key,
                "text_fa": opt.text_fa
            })

        questions_data.append({
            "id": q.id,
            "question_type": q.question_type,
            "difficulty": q.difficulty,
            "prompt_fa": q.prompt_fa,
            "points": float(eq.points),
            "time_limit_seconds": q.time_limit_seconds,
            "source_ref": q.source_ref,
            "options": options_list
        })

    return {
        "attempt_id": attempt.id,
        "exam_id": exam.id,
        "title_fa": exam.title_fa,
        "duration_minutes": exam.duration_minutes,
        "total_points": exam.total_points,
        "started_at": attempt.started_at,
        "questions": questions_data
    }

@router.post("/submit", response_model=ExamResultResponse)
def submit_exam(
    sub_data: ExamSubmissionRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Submits examination answers for server-side evaluation:
    - Deterministic MCQ grading
    - AI-assisted written evaluation with rubric matching
    - XP awarding and audit persistence
    """
    answers_dicts = [a.model_dump() for a in sub_data.answers]
    try:
        attempt = submit_exam_attempt(db, sub_data.attempt_id, current_user.id, answers_dicts)
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))

    exam = attempt.examination
    results_items = []

    for sa in attempt.answers:
        q = sa.question
        correct_opt = None
        if q.question_type == "mcq":
            corr = db.query(QuestionOption).filter(
                QuestionOption.question_id == q.id,
                QuestionOption.is_correct == True
            ).first()
            if corr:
                correct_opt = corr.option_key

        ref_ans = None
        if q.rubric:
            ref_ans = q.rubric.reference_answer_fa

        results_items.append(QuestionResultItem(
            question_id=q.id,
            question_type=q.question_type,
            prompt_fa=q.prompt_fa,
            selected_option_key=sa.selected_option_key,
            written_response_text=sa.written_response_text,
            correct_option_key=correct_opt,
            reference_answer_fa=ref_ans,
            auto_score=sa.auto_score,
            ai_score=sa.ai_score,
            final_score=sa.final_score,
            max_score=sa.max_score,
            is_correct=sa.is_correct,
            explanation_fa=sa.feedback_fa,
            feedback_fa=sa.feedback_fa,
            review_status=sa.review_status
        ))

    earned_xp = int(attempt.final_score * 5) if attempt.is_passed else 10

    return ExamResultResponse(
        attempt_id=attempt.id,
        exam_id=exam.id,
        exam_title_fa=exam.title_fa,
        started_at=attempt.started_at,
        submitted_at=attempt.submitted_at,
        auto_graded_score=attempt.auto_graded_score,
        ai_proposed_score=attempt.ai_proposed_score,
        final_score=attempt.final_score,
        total_possible_points=attempt.total_possible_points,
        percentage=attempt.percentage,
        is_passed=attempt.is_passed,
        status=attempt.status,
        xp_earned=earned_xp,
        feedback_fa=attempt.feedback_fa,
        questions=results_items
    )

@router.get("/attempts/{attempt_id}", response_model=ExamResultResponse)
def get_attempt_detail(
    attempt_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieves full details and questions result for an exam attempt"""
    attempt = db.query(ExaminationAttempt).filter(ExaminationAttempt.id == attempt_id).first()
    if not attempt:
        raise HTTPException(status_code=404, detail="نتیجه آزمون یافت نشد.")

    # Student cannot view another student's exam attempt
    if current_user.role != "admin" and attempt.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="دسترسی غیرمجاز به نتایج آزمون دیگران.")

    exam = attempt.examination
    results_items = []

    for sa in attempt.answers:
        q = sa.question
        correct_opt = None
        if q.question_type == "mcq":
            corr = db.query(QuestionOption).filter(
                QuestionOption.question_id == q.id,
                QuestionOption.is_correct == True
            ).first()
            if corr:
                correct_opt = corr.option_key

        ref_ans = q.rubric.reference_answer_fa if q.rubric else None

        results_items.append(QuestionResultItem(
            question_id=q.id,
            question_type=q.question_type,
            prompt_fa=q.prompt_fa,
            selected_option_key=sa.selected_option_key,
            written_response_text=sa.written_response_text,
            correct_option_key=correct_opt,
            reference_answer_fa=ref_ans,
            auto_score=sa.auto_score,
            ai_score=sa.ai_score,
            final_score=sa.final_score,
            max_score=sa.max_score,
            is_correct=sa.is_correct,
            explanation_fa=sa.feedback_fa,
            feedback_fa=sa.feedback_fa,
            review_status=sa.review_status
        ))

    return ExamResultResponse(
        attempt_id=attempt.id,
        exam_id=exam.id,
        exam_title_fa=exam.title_fa,
        started_at=attempt.started_at,
        submitted_at=attempt.submitted_at,
        auto_graded_score=attempt.auto_graded_score,
        ai_proposed_score=attempt.ai_proposed_score,
        final_score=attempt.final_score,
        total_possible_points=attempt.total_possible_points,
        percentage=attempt.percentage,
        is_passed=attempt.is_passed,
        status=attempt.status,
        xp_earned=0,
        feedback_fa=attempt.feedback_fa,
        questions=results_items
    )

@router.get("/my-history")
def get_my_exam_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Lists current student's completed and in-progress exams"""
    attempts = db.query(ExaminationAttempt).filter(
        ExaminationAttempt.user_id == current_user.id
    ).order_by(ExaminationAttempt.started_at.desc()).all()

    results = []
    for a in attempts:
        results.append({
            "attempt_id": a.id,
            "exam_id": a.exam_id,
            "exam_title_fa": a.examination.title_fa,
            "started_at": a.started_at,
            "submitted_at": a.submitted_at,
            "final_score": a.final_score,
            "total_points": a.total_possible_points,
            "percentage": a.percentage,
            "is_passed": a.is_passed,
            "status": a.status
        })
    return results
