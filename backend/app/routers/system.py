from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.database import get_db
from app.models.user import User
from app.models.curriculum import Grade, Book, Chapter
from app.models.exam import Question, Examination
from app.models.competition import Competition

router = APIRouter(tags=["System"])

@router.get("/health")
@router.get("/system/health")
def health_check(db: Session = Depends(get_db)):
    """Health check endpoint for Docker Compose & Nginx load balancers"""
    db_ok = False
    try:
        db.execute(text("SELECT 1"))
        db_ok = True
    except Exception:
        db_ok = False

    return {
        "status": "healthy" if db_ok else "degraded",
        "database_connected": db_ok,
        "service": "انجمن فیزیک شهید بهشتی دو دوره اول",
        "version": "2.0.0"
    }

@router.get("/system/stats")
@router.get("/system/public-stats")
@router.get("/public/stats")
def public_system_stats(db: Session = Depends(get_db)):
    """Public platform statistics for landing page"""
    students_count = db.query(User).filter(User.role == "student").count()
    grades_count = db.query(Grade).count()
    books_count = db.query(Book).count()
    chapters_count = db.query(Chapter).count()
    questions_count = db.query(Question).count()
    exams_count = db.query(Examination).count()
    competitions_count = db.query(Competition).count()

    return {
        "school_name": "انجمن فیزیک شهید بهشتی دو دوره اول",
        "association_name": "انجمن فیزیک دبیرستان شهید بهشتی ۲ دوره اول",
        "students_count": students_count,
        "grades_count": grades_count,
        "books_count": books_count,
        "chapters_count": chapters_count,
        "questions_count": questions_count,
        "exams_count": exams_count,
        "competitions_count": competitions_count
    }
