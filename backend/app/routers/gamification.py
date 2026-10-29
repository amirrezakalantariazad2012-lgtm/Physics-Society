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
    LabActivityRequest, LabActivityResponse, LabProgressResponse
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

@router.get("/leaderboard")
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
 
@router.get("/lab-progress", response_model=LabProgressResponse)
def get_lab_progress(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Returns detailed summary of student's completed lab activities, XP, and daily claimed actions"""
    from datetime import datetime
    today_str = datetime.utcnow().strftime('%Y%m%d')
    txs = db.query(XPTransaction).filter(
        XPTransaction.user_id == current_user.id,
        XPTransaction.activity_type == "lab_experiment"
    ).all()

    total_lab_xp = sum(t.amount for t in txs)
    completed_sims = set()
    today_claimed_actions = set()

    for t in txs:
        if not t.reference_id:
            continue
        if t.reference_id.startswith("lab::"):
            parts = t.reference_id.split("::")
            # format: lab::{sim_type}::{action_type}::{user_id}::{date_key}
            if len(parts) >= 5:
                sim_id = parts[1]
                action_type = parts[2]
                date_k = parts[4]
                completed_sims.add(sim_id)
                if date_k == today_str:
                    today_claimed_actions.add(f"{sim_id}_{action_type}")
        elif t.reference_id.startswith("lab_"):
            parts = t.reference_id.split("_")
            if len(parts) >= 4:
                sim_id = parts[1]
                date_k = parts[-1]
                completed_sims.add(sim_id)
                action_type = "_".join(parts[2:-2]) if len(parts) >= 5 else "experiment_run"
                if date_k == today_str:
                    today_claimed_actions.add(f"{sim_id}_{action_type}")

    profile = current_user.profile
    return LabProgressResponse(
        total_lab_xp=total_lab_xp,
        completed_labs_count=len(completed_sims),
        completed_sim_ids=sorted(list(completed_sims)),
        today_claimed_actions=sorted(list(today_claimed_actions)),
        profile_total_xp=profile.total_xp if profile else 0,
        current_level=profile.current_level if profile else 1
    )

@router.post("/lab-activity", response_model=LabActivityResponse)
def record_lab_activity(
    data: LabActivityRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Awards XP for interactive physics laboratory experiments with precise multi-action tracking"""
    from datetime import datetime
    action_type = data.action_type or "experiment_run"

    # Action-specific base XP scaling
    action_xp_map = {
        "experiment_run": 20,
        "logbook_note": 15,
        "concept_challenge": 10,
        "lab_report": 15
    }
    action_desc_map = {
        "experiment_run": "اجرای شبیه‌ساز و بررسی آزمایش",
        "logbook_note": "ثبت مشاهدات و تحلیل علمی در دفترچه",
        "concept_challenge": "پاسخ صحیح به چالش مفهومی",
        "lab_report": "تولید و ثبت گزارش کار آزمایشگاهی"
    }

    base_xp = action_xp_map.get(action_type, 20)
    amount = min(50, max(5, data.xp_amount if data.xp_amount is not None else base_xp))
    action_title = action_desc_map.get(action_type, "فعالیت آزمایشگاهی")

    # Daily unique idempotency key per action per simulation
    date_key = datetime.utcnow().strftime('%Y%m%d')
    ref_id = f"lab::{data.sim_type}::{action_type}::{current_user.id}::{date_key}"

    tx = award_xp(
        db, current_user.id,
        amount=amount,
        activity_type="lab_experiment",
        description_fa=f"آزمایشگاه مجازی ({action_title}): {data.lab_title_fa}",
        reference_id=ref_id
    )

    if tx:
        record_daily_streak(db, current_user.id)

    profile = current_user.profile
    return LabActivityResponse(
        success=True,
        xp_awarded=amount if tx else 0,
        already_claimed=False if tx else True,
        total_xp=profile.total_xp if profile else 0,
        current_level=profile.current_level if profile else 1,
        action_type=action_type,
        message_fa=f"امتیاز علمی {amount}+ XP با موفقیت ثبت شد!" if tx else "این بخش از آزمایشگاه امروز قبلاً برای شما ثبت شده است."
    )
