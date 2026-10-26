from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.database import get_db
from app.models.user import User, StudentProfile
from app.models.gamification import Badge, StudentBadge, XPTransaction, LearningStreak, StudentProgress
from app.models.exam import ExaminationAttempt
from app.models.competition import Competition
from app.schemas.gamification import (
    BadgeResponse, LeaderboardResponse, LeaderboardUser, XPTransactionResponse,
    LabActivityRequest, LabActivityResponse
)
from app.services.auth import get_current_user, get_optional_current_user
from app.services.gamification_service import get_leaderboard_data, award_xp, record_daily_streak

router = APIRouter(prefix="/gamification", tags=["Gamification & Dashboard"])

@router.get("/dashboard")
def get_student_dashboard(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Comprehensive student dashboard data:
    - Real persisted XP, level, streak, badges
    - Lessons completed, upcoming exams & competitions
    - Recent exam results and notifications
    """
    profile = current_user.profile
    if not profile:
        profile = StudentProfile(user_id=current_user.id)
        db.add(profile)
        db.commit()
        db.refresh(profile)

    # Next recommended lesson
    completed_lesson_ids = {
        sp.lesson_id for sp in db.query(StudentProgress).filter(
            StudentProgress.user_id == current_user.id,
            StudentProgress.is_completed == True
        ).all()
    }

    # Recent exam attempts
    recent_attempts = db.query(ExaminationAttempt).filter(
        ExaminationAttempt.user_id == current_user.id
    ).order_by(desc(ExaminationAttempt.started_at)).limit(5).all()

    recent_exams_data = []
    for a in recent_attempts:
        recent_exams_data.append({
            "attempt_id": a.id,
            "title_fa": a.examination.title_fa,
            "score": a.final_score,
            "total_points": a.total_possible_points,
            "percentage": a.percentage,
            "is_passed": a.is_passed,
            "date": a.started_at
        })

    # Active competition
    active_comp = db.query(Competition).filter(
        Competition.is_published == True,
        Competition.is_closed == False
    ).order_by(Competition.ends_at.asc()).first()

    # Badges count
    unlocked_badges_count = db.query(StudentBadge).filter(StudentBadge.user_id == current_user.id).count()

    # Rank
    all_profiles = db.query(StudentProfile).order_by(desc(StudentProfile.total_xp)).all()
    user_rank = 1
    for r, p in enumerate(all_profiles, start=1):
        if p.user_id == current_user.id:
            user_rank = r
            break

    # Unread notifications
    unread_notifs = [
        {"id": n.id, "title_fa": n.title_fa, "message_fa": n.message_fa, "created_at": n.created_at}
        for n in current_user.notifications if not n.is_read
    ]

    return {
        "student": {
            "id": current_user.id,
            "full_name": current_user.full_name,
            "display_name": current_user.display_name or current_user.full_name,
            "grade_id": profile.grade_id,
            "grade_title_fa": profile.grade.title_fa if profile.grade else "تعیین نشده",
            "total_xp": profile.total_xp,
            "current_level": profile.current_level,
            "current_streak": profile.current_streak,
            "max_streak": profile.max_streak,
            "rank": user_rank,
            "unlocked_badges_count": unlocked_badges_count,
            "completed_lessons_count": len(completed_lesson_ids)
        },
        "recent_exams": recent_exams_data,
        "active_competition": {
            "id": active_comp.id,
            "title_fa": active_comp.title_fa,
            "theme_fa": active_comp.theme_fa,
            "ends_at": active_comp.ends_at
        } if active_comp else None,
        "notifications": unread_notifs
    }

@router.get("/leaderboards")
def get_leaderboards(
    grade_id: Optional[int] = None,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    """Retrieves server-calculated rankings and student position"""
    leaderboard = get_leaderboard_data(db, grade_id=grade_id, limit=50)

    user_pos = None
    if current_user:
        for item in leaderboard:
            if item["user_id"] == current_user.id:
                user_pos = item
                break

    return {
        "leaderboard": leaderboard,
        "user_position": user_pos
    }

@router.get("/badges", response_model=List[BadgeResponse])
def get_badges_list(
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    """Lists all available badges with student's unlocking status"""
    all_badges = db.query(Badge).filter(Badge.is_active == True).all()
    unlocked_map = {}
    if current_user:
        unlocked_map = {
            sb.badge_id: sb.awarded_at for sb in db.query(StudentBadge).filter(
                StudentBadge.user_id == current_user.id
            ).all()
        }

    results = []
    for b in all_badges:
        is_unlocked = b.id in unlocked_map
        results.append(BadgeResponse(
            id=b.id,
            code=b.code,
            title_fa=b.title_fa,
            description_fa=b.description_fa,
            icon=b.icon,
            category=b.category,
            xp_bonus=b.xp_bonus,
            is_unlocked=is_unlocked,
            awarded_at=unlocked_map.get(b.id)
        ))
    return results

@router.get("/xp-history", response_model=List[XPTransactionResponse])
def get_xp_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieves immutable audit ledger of XP transactions for student"""
    txs = db.query(XPTransaction).filter(
        XPTransaction.user_id == current_user.id
    ).order_by(desc(XPTransaction.created_at)).limit(50).all()

    return txs
 
@router.post("/lab-activity", response_model=LabActivityResponse)
def record_lab_activity(
    data: LabActivityRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Awards XP for interactive physics laboratory experiments"""
    from datetime import datetime
    amount = min(50, max(5, data.xp_amount or 15))
    date_key = datetime.utcnow().strftime('%Y%m%d_%H')
    tx = award_xp(
        db, current_user.id,
        amount=amount,
        activity_type="lab_experiment",
        description_fa=f"آزمایشگاه مجازی: {data.lab_title_fa}",
        reference_id=f"lab_{data.sim_type}_{current_user.id}_{date_key}"
    )
    record_daily_streak(db, current_user.id)
    profile = current_user.profile
    return LabActivityResponse(
        success=True,
        xp_awarded=amount if tx else 0,
        total_xp=profile.total_xp if profile else 0,
        current_level=profile.current_level if profile else 1,
        message_fa="دستاوردهای آزمایشگاهی شما با موفقیت ثبت شد!"
    )
