import os
import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile
from sqlalchemy.orm import Session
from datetime import datetime

from app.database import get_db
from app.models.user import User
from app.models.curriculum import Grade, Book, Chapter, Lesson, Exercise, SupplementaryMaterial
from app.models.exam import Question
from app.models.gamification import StudentProgress
from app.schemas.curriculum import (
    GradeResponse, BookResponse, ChapterResponse, LessonResponse,
    ExerciseResponse, ExerciseSubmit, ExerciseSubmitResult, LessonProgressUpdate,
    SupplementaryMaterialCreate, SupplementaryMaterialResponse
)
from app.services.auth import get_current_user, get_optional_current_user
from app.services.gamification_service import award_xp, record_daily_streak

router = APIRouter(prefix="/curriculum", tags=["Curriculum"])

@router.get("/grades", response_model=List[GradeResponse])
def get_grades(db: Session = Depends(get_db)):
    """Lists all supported grades (7, 8, 9)"""
    grades = db.query(Grade).order_by(Grade.number).all()
    results = []
    for g in grades:
        results.append(GradeResponse(
            id=g.id,
            number=g.number,
            title_fa=g.title_fa,
            description_fa=g.description_fa,
            book_count=len(g.books)
        ))
    return results

@router.get("/grades/{grade_id}/books", response_model=List[BookResponse])
def get_books_by_grade(
    grade_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    """Lists books for a grade (both standard and sampad). Enforces grade scoping for students."""
    if current_user and current_user.role == "student" and current_user.profile and current_user.profile.grade_id:
        if current_user.profile.grade_id != grade_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="دسترسی غیرمجاز: شما تنها مجاز به مشاهده منابع پایه تحصیلی خود هستید."
            )

    books = db.query(Book).filter(Book.grade_id == grade_id).all()
    results = []
    for b in books:
        src = b.sources[0] if b.sources else None
        results.append(BookResponse(
            id=b.id,
            grade_id=b.grade_id,
            code=b.code,
            title_fa=b.title_fa,
            book_type=b.book_type,
            publisher_fa=b.publisher_fa,
            academic_year=b.academic_year,
            cover_image_url=b.cover_image_url,
            source_status=src.status if src else "pending",
            page_count=src.page_count if src else 0,
            chapter_count=len(b.chapters)
        ))
    return results

@router.get("/books/{book_id}/chapters", response_model=List[ChapterResponse])
def get_chapters_by_book(
    book_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    """Lists chapters for a book with question counts and user mastery progress. Enforces student grade scoping."""
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        raise HTTPException(status_code=404, detail="کتاب مورد نظر یافت نشد.")

    if current_user and current_user.role == "student" and current_user.profile and current_user.profile.grade_id:
        if current_user.profile.grade_id != book.grade_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="دسترسی غیرمجاز: این کتاب متعلق به پایه تحصیلی شما نیست."
            )

    chapters = db.query(Chapter).filter(
        Chapter.book_id == book_id,
        Chapter.is_published == True
    ).order_by(Chapter.order_index).all()

    completed_chapter_ids = set()
    if current_user:
        completed_records = db.query(StudentProgress.chapter_id).filter(
            StudentProgress.user_id == current_user.id,
            StudentProgress.is_completed == True
        ).all()
        completed_chapter_ids = {r[0] for r in completed_records}

    results = []
    for ch in chapters:
        mcq_c = db.query(Question).filter(
            Question.chapter_id == ch.id,
            Question.question_type == "mcq",
            Question.is_published == True
        ).count()
        written_c = db.query(Question).filter(
            Question.chapter_id == ch.id,
            Question.question_type == "written",
            Question.is_published == True
        ).count()

        results.append(ChapterResponse(
            id=ch.id,
            book_id=ch.book_id,
            chapter_number=ch.chapter_number,
            title_fa=ch.title_fa,
            slug=ch.slug,
            description_fa=ch.description_fa,
            estimated_minutes=ch.estimated_minutes,
            order_index=ch.order_index,
            is_published=ch.is_published,
            objectives_fa=ch.objectives_fa,
            prerequisites_fa=ch.prerequisites_fa,
            source_pages=ch.source_pages,
            lesson_count=len(ch.lessons),
            mcq_count=mcq_c,
            written_count=written_c,
            is_completed_by_user=ch.id in completed_chapter_ids,
            mastery_percent=100 if ch.id in completed_chapter_ids else 0
        ))
    return results

@router.get("/chapters/{chapter_id}")
def get_chapter_detail(
    chapter_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    """Retrieves full chapter details, lessons list, and examination ID. Enforces student grade scoping."""
    ch = db.query(Chapter).filter(Chapter.id == chapter_id).first()
    if not ch:
        raise HTTPException(status_code=404, detail="فصل مورد نظر یافت نشد.")

    if current_user and current_user.role == "student" and current_user.profile and current_user.profile.grade_id:
        if ch.book and current_user.profile.grade_id != ch.book.grade_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="دسترسی غیرمجاز: این فصل متعلق به پایه تحصیلی شما نیست."
            )

    completed_lesson_ids = set()
    if current_user:
        recs = db.query(StudentProgress.lesson_id).filter(
            StudentProgress.user_id == current_user.id,
            StudentProgress.is_completed == True
        ).all()
        completed_lesson_ids = {r[0] for r in recs}

    lessons_data = []
    for l in ch.lessons:
        lessons_data.append({
            "id": l.id,
            "title_fa": l.title_fa,
            "slug": l.slug,
            "order_index": l.order_index,
            "estimated_minutes": l.estimated_minutes,
            "xp_reward": l.xp_reward,
            "is_completed": l.id in completed_lesson_ids
        })

    exam = ch.examinations[0] if ch.examinations else None

    return {
        "id": ch.id,
        "title_fa": ch.title_fa,
        "chapter_number": ch.chapter_number,
        "description_fa": ch.description_fa,
        "objectives_fa": ch.objectives_fa,
        "prerequisites_fa": ch.prerequisites_fa,
        "source_pages": ch.source_pages,
        "grade_number": ch.book.grade.number if ch.book and ch.book.grade else None,
        "book_title_fa": ch.book.title_fa if ch.book else None,
        "lessons": lessons_data,
        "exam_id": exam.id if exam else None,
        "exam_title_fa": exam.title_fa if exam else None
    }

@router.get("/lessons/{lesson_id}", response_model=LessonResponse)
def get_lesson_detail(
    lesson_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    """Retrieves structured interactive lesson blocks and interactive exercises. Enforces student grade scoping."""
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="درس مورد نظر یافت نشد.")

    if current_user and current_user.role == "student" and current_user.profile and current_user.profile.grade_id:
        if lesson.chapter and lesson.chapter.book and current_user.profile.grade_id != lesson.chapter.book.grade_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="دسترسی غیرمجاز: این درس متعلق به پایه تحصیلی شما نیست."
            )

    is_completed = False
    if current_user:
        progress = db.query(StudentProgress).filter(
            StudentProgress.user_id == current_user.id,
            StudentProgress.lesson_id == lesson.id,
            StudentProgress.is_completed == True
        ).first()
        is_completed = (progress is not None)

    exercises_data = []
    for ex in lesson.exercises:
        exercises_data.append(ExerciseResponse(
            id=ex.id,
            lesson_id=ex.lesson_id,
            order_index=ex.order_index,
            exercise_type=ex.exercise_type,
            prompt_fa=ex.prompt_fa,
            options_json=ex.options_json,
            explanation_fa=ex.explanation_fa,
            xp_reward=ex.xp_reward
        ))

    return LessonResponse(
        id=lesson.id,
        chapter_id=lesson.chapter_id,
        topic_id=lesson.topic_id,
        title_fa=lesson.title_fa,
        slug=lesson.slug,
        order_index=lesson.order_index,
        is_published=lesson.is_published,
        estimated_minutes=lesson.estimated_minutes,
        xp_reward=lesson.xp_reward,
        content_blocks=lesson.content_blocks or {},
        summary_fa=lesson.summary_fa,
        source_pages_ref=lesson.source_pages_ref,
        exercises=exercises_data,
        is_completed=is_completed
    )

@router.post("/exercises/submit", response_model=ExerciseSubmitResult)
def submit_exercise_answer(
    submission: ExerciseSubmit,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Submits an interactive exercise response:
    - Provides instant Duolingo-style feedback and explanation
    - Awards XP for correct practice responses
    """
    ex = db.query(Exercise).filter(Exercise.id == submission.exercise_id).first()
    if not ex:
        raise HTTPException(status_code=404, detail="تمرین مورد نظر یافت نشد.")

    if current_user.role == "student" and current_user.profile and current_user.profile.grade_id:
        if ex.lesson and ex.lesson.chapter and ex.lesson.chapter.book and current_user.profile.grade_id != ex.lesson.chapter.book.grade_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="دسترسی غیرمجاز: این تمرین متعلق به پایه تحصیلی شما نیست."
            )

    sub_val = str(submission.submitted_answer).strip().lower()
    corr_val = str(ex.correct_answer_json).strip().lower()

    is_correct = (sub_val == corr_val)

    xp_earned = 0
    if is_correct:
        xp_earned = ex.xp_reward
        award_xp(
            db, current_user.id,
            amount=xp_earned,
            activity_type="exercise_practice",
            description_fa=f"پاسخ صحیح به تمرین: {ex.prompt_fa[:40]}...",
            reference_id=f"ex_{ex.id}_user_{current_user.id}"
        )
        record_daily_streak(db, current_user.id)

    return ExerciseSubmitResult(
        is_correct=is_correct,
        xp_earned=xp_earned,
        explanation_fa=ex.explanation_fa or ("آفرین! پاسخ کاملاً صحیح است." if is_correct else "پاسخ نادرست است. دوباره تلاش کنید."),
        correct_answer=ex.correct_answer_json
    )

@router.post("/lessons/{lesson_id}/complete")
def mark_lesson_complete(
    lesson_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Marks a lesson completed and awards lesson completion XP"""
    lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
    if not lesson:
        raise HTTPException(status_code=404, detail="درس مورد نظر یافت نشد.")

    if current_user.role == "student" and current_user.profile and current_user.profile.grade_id:
        if lesson.chapter and lesson.chapter.book and current_user.profile.grade_id != lesson.chapter.book.grade_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="دسترسی غیرمجاز: این درس متعلق به پایه تحصیلی شما نیست."
            )

    progress = db.query(StudentProgress).filter(
        StudentProgress.user_id == current_user.id,
        StudentProgress.lesson_id == lesson.id
    ).first()

    is_first_completion = False
    if not progress:
        progress = StudentProgress(
            user_id=current_user.id,
            lesson_id=lesson.id,
            chapter_id=lesson.chapter_id,
            is_completed=True,
            score_percent=100,
            completed_at=datetime.utcnow()
        )
        db.add(progress)
        is_first_completion = True
    else:
        if not progress.is_completed:
            progress.is_completed = True
            progress.completed_at = datetime.utcnow()
            is_first_completion = True
        progress.attempts_count += 1

    db.commit()

    record_daily_streak(db, current_user.id)

    earned_xp = 0
    if is_first_completion:
        earned_xp = lesson.xp_reward
        award_xp(
            db, current_user.id,
            amount=earned_xp,
            activity_type="lesson_completed",
            description_fa=f"تکمیل درس تعاملی: {lesson.title_fa}",
            reference_id=f"lesson_{lesson.id}"
        )

    return {
        "success": True,
        "is_first_completion": is_first_completion,
        "xp_earned": earned_xp,
        "message_fa": f"درس «{lesson.title_fa}» با موفقیت تکمیل شد!"
    }


# ==========================================
# SUPPLEMENTARY STUDY MATERIALS & PAMPHLETS
# ==========================================

@router.get("/study-materials", response_model=List[SupplementaryMaterialResponse])
def get_study_materials(
    grade_id: Optional[int] = None,
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Lists published supplementary study materials, formula sheets, and pamphlets"""
    query = db.query(SupplementaryMaterial).filter(SupplementaryMaterial.is_published == True)
    if grade_id:
        query = query.filter((SupplementaryMaterial.grade_id == grade_id) | (SupplementaryMaterial.grade_id == None))
    if category:
        query = query.filter(SupplementaryMaterial.category == category)
    items = query.order_by(SupplementaryMaterial.created_at.desc()).all()
    results = []
    for it in items:
        g_title = it.grade.title_fa if it.grade else "تمامی پایه‌ها (عمومی)"
        results.append(SupplementaryMaterialResponse(
            id=it.id,
            title_fa=it.title_fa,
            description_fa=it.description_fa,
            grade_id=it.grade_id,
            grade_title_fa=g_title,
            author_name=it.author_name or "دبیران انجمن فیزیک شهید بهشتی دو",
            category=it.category,
            file_url=it.file_url,
            original_filename=it.original_filename,
            file_size_bytes=it.file_size_bytes or 0,
            download_count=it.download_count or 0,
            is_published=it.is_published,
            created_at=it.created_at
        ))
    return results


@router.post("/study-materials", response_model=SupplementaryMaterialResponse)
def create_study_material(
    data: SupplementaryMaterialCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Creates a new supplementary study material (Admin only)"""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="دسترسی غیرمجاز: تنها مدیران و دبیران سامانه می‌توانند درسنامه متفرقه ثبت کنند."
        )

    mat = SupplementaryMaterial(
        title_fa=data.title_fa.strip(),
        description_fa=data.description_fa.strip() if data.description_fa else None,
        grade_id=data.grade_id,
        author_name=data.author_name.strip() if data.author_name else "دبیران انجمن فیزیک شهید بهشتی دو",
        category=data.category or "pamphlet",
        file_url=data.file_url.strip() if data.file_url else None,
        original_filename=data.original_filename,
        file_size_bytes=data.file_size_bytes or 0,
        is_published=True
    )
    db.add(mat)
    db.commit()
    db.refresh(mat)

    g_title = mat.grade.title_fa if mat.grade else "تمامی پایه‌ها (عمومی)"
    return SupplementaryMaterialResponse(
        id=mat.id,
        title_fa=mat.title_fa,
        description_fa=mat.description_fa,
        grade_id=mat.grade_id,
        grade_title_fa=g_title,
        author_name=mat.author_name,
        category=mat.category,
        file_url=mat.file_url,
        original_filename=mat.original_filename,
        file_size_bytes=mat.file_size_bytes or 0,
        download_count=mat.download_count or 0,
        is_published=mat.is_published,
        created_at=mat.created_at
    )


@router.post("/study-materials/upload")
async def upload_material_file(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    """Uploads a study material file (PDF, Docx, Image) and returns permanent URL"""
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="دسترسی غیرمجاز: فقط ادمین مجاز است.")

    upload_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "uploads", "materials"))
    os.makedirs(upload_dir, exist_ok=True)

    safe_name = f"{uuid.uuid4().hex[:10]}_{file.filename.replace(' ', '_')}"
    target_path = os.path.join(upload_dir, safe_name)

    content = await file.read()
    with open(target_path, "wb") as f:
        f.write(content)

    return {
        "success": True,
        "file_url": f"/uploads/materials/{safe_name}",
        "original_filename": file.filename,
        "file_size_bytes": len(content),
        "message_fa": "فایل جزوه با موفقیت در سرور ذخیره شد."
    }


@router.delete("/study-materials/{material_id}")
def delete_study_material(
    material_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Deletes a supplementary study material (Admin only)"""
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="دسترسی غیرمجاز")

    mat = db.query(SupplementaryMaterial).filter(SupplementaryMaterial.id == material_id).first()
    if not mat:
        raise HTTPException(status_code=404, detail="درسنامه یا جزوه مورد نظر یافت نشد.")

    db.delete(mat)
    db.commit()
    return {"success": True, "message_fa": "جزوه / درسنامه با موفقیت حذف گردید."}


@router.post("/study-materials/{material_id}/increment-download")
def increment_material_download(
    material_id: int,
    db: Session = Depends(get_db)
):
    """Increments the download counter for a study material"""
    mat = db.query(SupplementaryMaterial).filter(SupplementaryMaterial.id == material_id).first()
    if mat:
        mat.download_count = (mat.download_count or 0) + 1
        db.commit()
    return {"success": True}

