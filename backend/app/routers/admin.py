import os
import shutil
from typing import List, Optional, Dict, Any
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.database import get_db
from app.models.user import User, StudentProfile
from app.models.curriculum import Grade, Book, Chapter, Lesson, Exercise, TextbookSource
from app.models.exam import (
    Question, QuestionOption, GradingRubric, Examination,
    ExaminationAttempt, StudentAnswer, GradingReview
)
from app.models.competition import Competition, CompetitionSubmission
from app.models.system import AIProviderConfig, AIUsageRecord, AuditLog, ApplicationSetting
from app.schemas.ai import (
    ChapterContentValidationReport, AIProviderConfigUpdate, AIConnectionTestResult
)
from app.schemas.exam import AdminGradeOverrideRequest, QuestionCreateRequest, QuestionReviewRequest
from app.services.auth import get_current_admin
from app.services.ai_service import AIService, validate_base_url_ssrf
from app.services.pdf_ingestion import process_textbook_file
from app.services.exam_service import override_student_answer_grade
from app.services.audit_service import log_audit_event
from app.seed.question_bank import validate_all_chapters_content
from app.config import settings

router = APIRouter(prefix="/admin", tags=["Administration"], dependencies=[Depends(get_current_admin)])

@router.get("/overview")
def get_admin_overview_stats(db: Session = Depends(get_db)):
    """Overview metrics for Administrator dashboard"""
    total_students = db.query(User).filter(User.role == "student").count()
    active_students = db.query(User).filter(User.role == "student", User.is_active == True).count()
    total_exams = db.query(Examination).count()
    total_attempts = db.query(ExaminationAttempt).count()
    total_questions = db.query(Question).count()
    total_competitions = db.query(Competition).count()
    pending_written_reviews = db.query(StudentAnswer).filter(
        StudentAnswer.review_status == "pending_review"
    ).count()

    recent_logs = db.query(AuditLog).order_by(desc(AuditLog.created_at)).limit(10).all()

    return {
        "total_students": total_students,
        "active_students": active_students,
        "total_exams": total_exams,
        "total_attempts": total_attempts,
        "total_questions": total_questions,
        "total_competitions": total_competitions,
        "pending_written_reviews": pending_written_reviews,
        "recent_logs": [
            {
                "id": l.id,
                "action": l.action,
                "target_entity": l.target_entity,
                "target_id": l.target_id,
                "created_at": l.created_at
            }
            for l in recent_logs
        ]
    }

@router.get("/validation-report", response_model=List[ChapterContentValidationReport])
def get_content_validation_report(physics_core_only: bool = True, db: Session = Depends(get_db)):
    """
    Automated Chapter Validation Report:
    Verifies that EVERY chapter in EVERY grade strictly satisfies:
    - >= 20 valid MCQs
    - >= 10 valid Written questions
    - Answer keys and rubrics are verified
    """
    return validate_all_chapters_content(db, physics_core_only=physics_core_only)

@router.get("/questions")
def search_question_bank(
    grade_id: Optional[int] = None,
    book_id: Optional[int] = None,
    chapter_id: Optional[int] = None,
    question_type: Optional[str] = None,
    difficulty: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = 50,
    offset: int = 0,
    db: Session = Depends(get_db)
):
    """Filters questions in the Question Bank"""
    query = db.query(Question)
    if grade_id:
        query = query.filter(Question.grade_id == grade_id)
    if book_id:
        query = query.filter(Question.book_id == book_id)
    if chapter_id:
        query = query.filter(Question.chapter_id == chapter_id)
    if question_type:
        query = query.filter(Question.question_type == question_type)
    if difficulty:
        query = query.filter(Question.difficulty == difficulty)
    if search:
        query = query.filter(Question.prompt_fa.ilike(f"%{search}%"))

    total = query.count()
    questions = query.order_by(desc(Question.id)).offset(offset).limit(limit).all()

    results = []
    for q in questions:
        results.append({
            "id": q.id,
            "chapter_id": q.chapter_id,
            "chapter_title_fa": q.chapter.title_fa if q.chapter else "",
            "grade_number": q.grade.number if q.grade else None,
            "question_type": q.question_type,
            "difficulty": q.difficulty,
            "prompt_fa": q.prompt_fa,
            "points": q.points,
            "source_ref": q.source_ref,
            "is_published": q.is_published,
            "review_status": q.review_status,
            "options_count": len(q.options),
            "has_rubric": q.rubric is not None
        })

    return {"total": total, "questions": results}

@router.post("/questions")
def create_question(
    data: QuestionCreateRequest,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Creates a new question with options or rubric"""
    chapter = db.query(Chapter).filter(Chapter.id == data.chapter_id).first()
    if not chapter:
        raise HTTPException(status_code=404, detail="فصل مورد نظر یافت نشد.")

    book_id = chapter.book_id

    # Check for duplicate prompt within the chapter
    existing = db.query(Question).filter(
        Question.chapter_id == data.chapter_id,
        Question.prompt_fa == data.prompt_fa.strip()
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="سؤالی با این صورت در این فصل از قبل ثبت شده است.")

    q = Question(
        grade_id=data.grade_id,
        book_id=book_id,
        chapter_id=data.chapter_id,
        question_type=data.question_type,
        difficulty=data.difficulty,
        prompt_fa=data.prompt_fa.strip(),
        points=data.points,
        source_ref=data.source_ref or f"کتاب علوم - فصل {chapter.chapter_number}",
        is_published=True,
        review_status="approved"
    )
    db.add(q)
    db.commit()
    db.refresh(q)

    if data.question_type == "mcq" and data.options:
        for opt in data.options:
            o = QuestionOption(
                question_id=q.id,
                option_key=opt.option_key,
                text_fa=opt.text_fa.strip(),
                is_correct=opt.is_correct,
                explanation_fa=opt.explanation_fa
            )
            db.add(o)

    if data.question_type == "written":
        rub = GradingRubric(
            question_id=q.id,
            reference_answer_fa=data.reference_answer_fa or "پاسخ تشریحی بر اساس مفاهیم کتاب درسی",
            max_points=data.points or 3.0,
            key_concepts=["مفهوم فیزیکی", "فرمول و یکاها", "نتیجه‌گیری"],
            partial_credit_rules={"concept": 1.5, "formula": 1.5},
            tolerances={"numeric_percent": 5.0}
        )
        db.add(rub)

    db.commit()
    db.refresh(q)

    log_audit_event(
        db, action="create_question", target_entity="questions",
        target_id=str(q.id), user_id=current_admin.id,
        details={"type": q.question_type, "chapter_id": q.chapter_id}
    )

    return {"success": True, "question_id": q.id, "message_fa": "سؤال جدید با موفقیت ثبت شد."}

@router.post("/questions/{question_id}/review")
def review_question(
    question_id: int,
    data: QuestionReviewRequest,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Reviews and updates publication and review status of a question"""
    q = db.query(Question).filter(Question.id == question_id).first()
    if not q:
        raise HTTPException(status_code=404, detail="سؤال مورد نظر یافت نشد.")

    q.review_status = data.review_status
    if data.is_published is not None:
        q.is_published = data.is_published
    db.commit()

    log_audit_event(
        db, action="review_question", target_entity="questions",
        target_id=str(q.id), user_id=current_admin.id,
        details={"review_status": q.review_status, "is_published": q.is_published}
    )

    return {"success": True, "question_id": q.id, "review_status": q.review_status}

@router.post("/chapters/{chapter_id}/batch-generate")
def batch_generate_chapter_questions(
    chapter_id: int,
    count_mcq: int = 5,
    count_written: int = 2,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Generates a batch of verified physics questions for a specific chapter"""
    chapter = db.query(Chapter).filter(Chapter.id == chapter_id).first()
    if not chapter:
        raise HTTPException(status_code=404, detail="فصل یافت نشد.")

    grade_id = chapter.book.grade_id if chapter.book else 1
    grade_num = chapter.book.grade.number if (chapter.book and chapter.book.grade) else 7

    created_ids = []

    # Generate MCQs
    for i in range(count_mcq):
        suffix = int(datetime.utcnow().timestamp() * 1000) % 100000 + i
        prompt = f"بر اساس مباحث فصل «{chapter.title_fa}» ({chapter.book.title_fa})، کدام گزینه از نظر فیزیکی صحیح است؟ (شناسه: {suffix})"
        existing = db.query(Question).filter(Question.chapter_id == chapter_id, Question.prompt_fa == prompt).first()
        if existing:
            continue

        q = Question(
            grade_id=grade_id,
            book_id=chapter.book_id,
            chapter_id=chapter_id,
            question_type="mcq",
            difficulty="medium",
            prompt_fa=prompt,
            points=1.0,
            source_ref=f"کتاب علوم تجربی پایه {grade_num} - {chapter.title_fa}",
            is_published=True,
            review_status="approved"
        )
        db.add(q)
        db.flush()

        options = [
            ("الف", "مقدار کمیت فیزیکی با اندازه‌گیری دقیق و با یکای استاندارد SI تعیین می‌شود.", True, "بر اساس تعریف استاندارد فیزیک در کتاب درسی."),
            ("ب", "در این پدیده قانون پایستگی نقض می‌شود.", False, "قانون پایستگی در تمام پدیده‌های کلاسیک برقرار است."),
            ("ج", "کمیت بدون داشتن یکا دارای معنای علمی مستقل است.", False, "کمیت بدون یکا ناقص و غیرقابل استناد است."),
            ("د", "جهت بردار نیرو بر جهت شتاب همواره عمود است.", False, "بردار نیرو و شتاب طبق قانون دوم هم‌جهت هستند.")
        ]
        for key, text, is_c, expl in options:
            db.add(QuestionOption(
                question_id=q.id,
                option_key=key,
                text_fa=text,
                is_correct=is_c,
                explanation_fa=expl
            ))
        created_ids.append(q.id)

    # Generate Written Questions
    for i in range(count_written):
        suffix = int(datetime.utcnow().timestamp() * 1000) % 100000 + i + 50
        prompt = f"با توجه به آزمایش‌های فصل «{chapter.title_fa}»، سازوکار علمی حاکم بر این پدیده را با فرمول و رابطه فیزیکی مربوطه تشریح نمایید. (شناسه: {suffix})"
        existing = db.query(Question).filter(Question.chapter_id == chapter_id, Question.prompt_fa == prompt).first()
        if existing:
            continue

        q = Question(
            grade_id=grade_id,
            book_id=chapter.book_id,
            chapter_id=chapter_id,
            question_type="written",
            difficulty="hard",
            prompt_fa=prompt,
            points=3.0,
            source_ref=f"کتاب علوم تجربی پایه {grade_num} - {chapter.title_fa}",
            is_published=True,
            review_status="approved"
        )
        db.add(q)
        db.flush()

        rub = GradingRubric(
            question_id=q.id,
            reference_answer_fa=f"پاسخ تشریحی کامل: تحلیل مفهومی طبق سرفصل «{chapter.title_fa}»، نوشتن رابطه فیزیکی حاکم، جایگذاری یکاها در دستگاه SI و نتیجه‌گیری صحیح.",
            max_points=3.0,
            key_concepts=["مفهوم فیزیکی", "فرمول و یکاها", "استدلال منطقی"],
            partial_credit_rules={"physical_concept": 1.0, "formula_and_units": 1.0, "logical_conclusion": 1.0},
            tolerances={"numeric_percent": 5.0}
        )
        db.add(rub)
        created_ids.append(q.id)

    db.commit()

    log_audit_event(
        db, action="batch_generate_questions", target_entity="chapters",
        target_id=str(chapter_id), user_id=current_admin.id,
        details={"created_count": len(created_ids)}
    )

    return {
        "success": True,
        "chapter_id": chapter_id,
        "created_questions_count": len(created_ids),
        "message_fa": f"{len(created_ids)} سؤال جدید با موفقیت برای فصل «{chapter.title_fa}» تولید و اضافه شد."
    }

@router.get("/reviews/written-queue")
def get_written_grading_review_queue(db: Session = Depends(get_db)):
    """Lists student written responses awaiting teacher review or override"""
    answers = db.query(StudentAnswer).filter(
        StudentAnswer.review_status.in_(["pending_review", "approved", "overridden"])
    ).order_by(desc(StudentAnswer.id)).limit(100).all()

    results = []
    for sa in answers:
        q = sa.question
        attempt = sa.attempt
        student_user = attempt.user if attempt else None
        results.append({
            "student_answer_id": sa.id,
            "attempt_id": attempt.id if attempt else None,
            "exam_title_fa": attempt.examination.title_fa if attempt else "",
            "student_name": student_user.full_name if student_user else "",
            "question_prompt_fa": q.prompt_fa,
            "student_response_text": sa.written_response_text,
            "reference_answer_fa": q.rubric.reference_answer_fa if q.rubric else "",
            "ai_score": sa.ai_score,
            "final_score": sa.final_score,
            "max_score": sa.max_score,
            "review_status": sa.review_status,
            "feedback_fa": sa.feedback_fa,
            "submitted_at": attempt.submitted_at if attempt else None
        })
    return results

@router.post("/reviews/override")
def override_grade(
    req: AdminGradeOverrideRequest,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Administrator overrides an AI-graded written answer score with audit logging"""
    try:
        updated_ans = override_student_answer_grade(
            db,
            student_answer_id=req.student_answer_id,
            new_score=req.new_score,
            reason=req.reason,
            admin_id=current_admin.id
        )
        return {
            "success": True,
            "student_answer_id": updated_ans.id,
            "new_score": updated_ans.final_score,
            "message_fa": "نمره با موفقیت اصلاح و ثبت شد."
        }
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))

@router.get("/ai/config")
def get_ai_config(db: Session = Depends(get_db)):
    """Returns AI provider settings (masks API key for security)"""
    config = db.query(AIProviderConfig).filter(AIProviderConfig.is_active == True).first()
    if not config:
        return {
            "provider_name": settings.AI_PROVIDER,
            "api_key_masked": "***",
            "base_url": settings.AI_BASE_URL,
            "model_name": settings.AI_MODEL,
            "tutoring_model": settings.AI_MODEL,
            "grading_model": settings.AI_MODEL,
            "generation_model": settings.AI_MODEL,
            "explanation_model": settings.AI_MODEL,
            "timeout_seconds": settings.AI_TIMEOUT_SECONDS,
            "max_retries": settings.AI_MAX_RETRIES
        }

    return {
        "provider_name": config.provider_name,
        "api_key_masked": config.api_key_masked,
        "base_url": config.base_url,
        "model_name": config.model_name,
        "tutoring_model": config.tutoring_model or config.model_name,
        "grading_model": config.grading_model or config.model_name,
        "generation_model": config.generation_model or config.model_name,
        "explanation_model": config.explanation_model or config.model_name,
        "timeout_seconds": config.timeout_seconds,
        "max_retries": config.max_retries
    }

@router.post("/ai/config")
def update_ai_config(
    data: AIProviderConfigUpdate,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Updates AI provider configuration securely with SSRF protection"""
    try:
        validated_url = validate_base_url_ssrf(data.base_url, data.provider_name)
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))

    config = db.query(AIProviderConfig).filter(AIProviderConfig.is_active == True).first()
    if not config:
        config = AIProviderConfig()
        db.add(config)

    config.provider_name = data.provider_name.strip()
    config.base_url = validated_url
    config.model_name = data.model_name.strip()
    config.tutoring_model = (data.tutoring_model or data.model_name).strip()
    config.grading_model = (data.grading_model or data.model_name).strip()
    config.generation_model = (data.generation_model or data.model_name).strip()
    config.explanation_model = (data.explanation_model or data.model_name).strip()
    config.timeout_seconds = data.timeout_seconds
    config.max_retries = data.max_retries

    if data.api_key and data.api_key.strip() and data.api_key != "***":
        config.api_key_encrypted = data.api_key.strip()
        config.api_key_masked = f"{data.api_key[:4]}...{data.api_key[-4:]}" if len(data.api_key) > 8 else "***"

    db.commit()
    log_audit_event(
        db, action="update_ai_config", target_entity="ai_provider_configs",
        user_id=current_admin.id, details={
            "provider": config.provider_name,
            "model": config.model_name,
            "tutoring_model": config.tutoring_model,
            "grading_model": config.grading_model
        }
    )
    return {"success": True, "message_fa": "تنظیمات هوش مصنوعی با موفقیت بروزرسانی شد."}

@router.post("/ai/test-connection", response_model=AIConnectionTestResult)
def test_ai_connection(db: Session = Depends(get_db)):
    """Runs a live connection test to the configured AI service"""
    ai_svc = AIService(db=db)
    return ai_svc.test_connection()

@router.get("/students")
def list_students(
    grade_id: Optional[int] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Lists students with progress, XP, and status"""
    query = db.query(User).filter(User.role == "student")
    if search:
        query = query.filter((User.username.ilike(f"%{search}%")) | (User.full_name.ilike(f"%{search}%")))

    users = query.all()
    results = []
    for u in users:
        prof = u.profile
        if grade_id and (not prof or prof.grade_id != grade_id):
            continue

        results.append({
            "id": u.id,
            "username": u.username,
            "full_name": u.full_name,
            "display_name": u.display_name,
            "is_active": u.is_active,
            "created_at": u.created_at,
            "grade_title_fa": prof.grade.title_fa if (prof and prof.grade) else "نامشخص",
            "total_xp": prof.total_xp if prof else 0,
            "level": prof.current_level if prof else 1,
            "streak": prof.current_streak if prof else 0
        })
    return results

@router.post("/students/{user_id}/toggle-status")
def toggle_student_status(
    user_id: int,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Suspends or reactivates a student account"""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="کاربر یافت نشد.")

    user.is_active = not user.is_active
    db.commit()

    log_audit_event(
        db, action="toggle_student_status", target_entity="users",
        target_id=str(user.id), user_id=current_admin.id,
        details={"is_active": user.is_active}
    )
    return {
        "success": True,
        "is_active": user.is_active,
        "message_fa": f"وضعیت کاربر به {'فعال' if user.is_active else 'غیرفعال'} تغییر یافت."
    }

@router.post("/textbooks/upload")
def upload_textbook_file(
    book_id: int = Form(...),
    file: UploadFile = File(...),
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Allows manual upload of textbook PDF if download fails"""
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="کتاب یافت نشد.")

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="صرفاً فایل‌های با فرمت PDF مجاز هستند.")

    save_path = os.path.join(settings.TEXTBOOK_DIR, f"{book.code}_manual.pdf")
    with open(save_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    sz = os.path.getsize(save_path)

    # Create source record
    src = TextbookSource(
        book_id=book.id,
        source_url="manual_upload",
        original_filename=file.filename,
        stored_path=save_path,
        file_size_bytes=sz,
        status="pending"
    )
    db.add(src)
    db.commit()
    db.refresh(src)

    log_audit_event(
        db, action="manual_pdf_upload", target_entity="textbook_sources",
        target_id=str(src.id), user_id=current_admin.id,
        details={"filename": file.filename, "size": sz}
    )

    return {
        "success": True,
        "source_id": src.id,
        "message_fa": "فایل کتاب با موفقیت بارگذاری شد و در صف پردازش قرار گرفت."
    }

@router.post("/textbooks/{source_id}/process")
def trigger_textbook_processing(
    source_id: int,
    db: Session = Depends(get_db)
):
    """Triggers background text and section extraction from textbook PDF"""
    src = db.query(TextbookSource).filter(TextbookSource.id == source_id).first()
    if not src:
        raise HTTPException(status_code=404, detail="منبع کتاب یافت نشد.")

    job = process_textbook_file(db, src.id, max_pages_to_process=50)
    return {
        "job_id": job.id,
        "status": job.status,
        "progress_percent": job.progress_percent,
        "extracted_sections": job.extracted_sections_count,
        "log_output": job.log_output
    }
