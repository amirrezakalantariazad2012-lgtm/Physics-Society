from datetime import datetime, timedelta
from typing import Optional, List, Dict, Any
import jdatetime
from sqlalchemy.orm import Session
from sqlalchemy import desc, func

from app.models.gamification import XPTransaction, Level, Badge, StudentBadge, LearningStreak, StudentProgress
from app.models.user import User, StudentProfile
from app.models.system import Notification

# Level Thresholds
LEVEL_THRESHOLDS = [
    (1, "دانش‌پژوه مقدماتی", 0),
    (2, "کاوشگر نیرو و حرکت", 100),
    (3, "پژوهشگر انرژی", 250),
    (4, "استاد الکتریسیته", 500),
    (5, "متخصص نور و امواج", 900),
    (6, "فیزیک‌دان تجربی", 1500),
    (7, "محقق ارشد فیزیک", 2300),
    (8, "استاد مکانیک کوانتوم و نسبیت", 3500),
    (9, "نخبه فیزیک کوانتوم", 5000),
]

def calculate_level_from_xp(xp: int) -> int:
    current_lvl = 1
    for lvl, title, min_xp in LEVEL_THRESHOLDS:
        if xp >= min_xp:
            current_lvl = lvl
        else:
            break
    return current_lvl

def award_xp(
    db: Session,
    user_id: int,
    amount: int,
    activity_type: str,
    description_fa: str,
    reference_id: Optional[str] = None
) -> Optional[XPTransaction]:
    """
    Idempotent XP awarding with audit ledger and level progression.
    Prevents duplicate rewards for the same reference event.
    """
    if amount <= 0:
        return None

    # Check for duplicate award
    if reference_id:
        existing = db.query(XPTransaction).filter(
            XPTransaction.user_id == user_id,
            XPTransaction.activity_type == activity_type,
            XPTransaction.reference_id == str(reference_id)
        ).first()
        if existing:
            return None  # Already awarded

    # Create transaction in ledger
    tx = XPTransaction(
        user_id=user_id,
        amount=amount,
        activity_type=activity_type,
        reference_id=str(reference_id) if reference_id else None,
        description_fa=description_fa
    )
    db.add(tx)

    # Update profile
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == user_id).first()
    if profile:
        profile.total_xp += amount
        new_level = calculate_level_from_xp(profile.total_xp)
        if new_level > profile.current_level:
            old_level = profile.current_level
            profile.current_level = new_level
            # Notification for level up
            notif = Notification(
                user_id=user_id,
                title_fa="ارتقای سطح فیزیک!",
                message_fa=f"آفرین! شما به سطح {new_level} ارتقا یافتید.",
                notification_type="badge"
            )
            db.add(notif)
    
    db.commit()
    db.refresh(tx)

    # Check badges
    check_and_unlock_badges(db, user_id)
    return tx

def get_jalali_today_str() -> str:
    """Returns today's date formatted as Jalali YYYY-MM-DD"""
    try:
        now_j = jdatetime.date.today()
        return now_j.strftime("%Y-%m-%d")
    except Exception:
        return datetime.utcnow().strftime("%Y-%m-%d")

def record_daily_streak(db: Session, user_id: int) -> int:
    """
    Tracks daily learning streaks using local Jalali calendar.
    Idempotent within the same day.
    """
    today_str = get_jalali_today_str()
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == user_id).first()
    if not profile:
        return 0

    # If already recorded today, do nothing
    existing_today = db.query(LearningStreak).filter(
        LearningStreak.user_id == user_id,
        LearningStreak.activity_date == today_str
    ).first()

    if existing_today:
        existing_today.activity_count += 1
        db.commit()
        return profile.current_streak

    # Record today's activity
    streak_record = LearningStreak(
        user_id=user_id,
        activity_date=today_str,
        activity_count=1
    )
    db.add(streak_record)

    # Calculate streak continuity
    # Get yesterday in Jalali
    try:
        yesterday_str = (jdatetime.date.today() - jdatetime.timedelta(days=1)).strftime("%Y-%m-%d")
    except Exception:
        yesterday_str = (datetime.utcnow().date() - timedelta(days=1)).strftime("%Y-%m-%d")

    had_yesterday = db.query(LearningStreak).filter(
        LearningStreak.user_id == user_id,
        LearningStreak.activity_date == yesterday_str
    ).first()

    if had_yesterday:
        profile.current_streak += 1
    else:
        profile.current_streak = 1

    if profile.current_streak > profile.max_streak:
        profile.max_streak = profile.current_streak

    profile.last_activity_date = today_str
    db.commit()

    # Milestone bonuses
    if profile.current_streak in [3, 7, 14, 30]:
        award_xp(
            db, user_id,
            amount=profile.current_streak * 10,
            activity_type="streak_bonus",
            description_fa=f"پاداش استمرار یادگیری ({profile.current_streak} روز متوالی)",
            reference_id=f"streak_{profile.current_streak}_{today_str}"
        )

    return profile.current_streak

def check_and_unlock_badges(db: Session, user_id: int):
    """Evaluates student progress and awards eligible badges"""
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == user_id).first()
    if not profile:
        return

    badges = db.query(Badge).filter(Badge.is_active == True).all()
    unlocked_badge_ids = {sb.badge_id for sb in db.query(StudentBadge).filter(StudentBadge.user_id == user_id).all()}

    for badge in badges:
        if badge.id in unlocked_badge_ids:
            continue

        eligible = False
        if badge.criteria_type == "first_lesson":
            completed_count = db.query(StudentProgress).filter(
                StudentProgress.user_id == user_id,
                StudentProgress.is_completed == True
            ).count()
            eligible = completed_count >= 1

        elif badge.criteria_type == "streak_7":
            eligible = profile.current_streak >= 7

        elif badge.criteria_type == "streak_3":
            eligible = profile.current_streak >= 3

        elif badge.criteria_type == "xp_500":
            eligible = profile.total_xp >= 500

        elif badge.criteria_type == "chapter_master":
            completed_count = db.query(StudentProgress).filter(
                StudentProgress.user_id == user_id,
                StudentProgress.is_completed == True
            ).count()
            eligible = completed_count >= 4

        if eligible:
            sb = StudentBadge(user_id=user_id, badge_id=badge.id)
            db.add(sb)
            notif = Notification(
                user_id=user_id,
                title_fa=f"مدال جدید: {badge.title_fa}",
                message_fa=f"تبریک! شما نشان «{badge.title_fa}» را دریافت کردید.",
                notification_type="badge"
            )
            db.add(notif)
            if badge.xp_bonus > 0:
                award_xp(
                    db, user_id,
                    amount=badge.xp_bonus,
                    activity_type="badge_bonus",
                    description_fa=f"پاداش دریافت نشان {badge.title_fa}",
                    reference_id=f"badge_{badge.id}"
                )
    db.commit()

def get_leaderboard_data(db: Session, grade_id: Optional[int] = None, limit: int = 50) -> List[Dict[str, Any]]:
    """Retrieves ranked students by total XP"""
    query = db.query(StudentProfile, User).join(User, StudentProfile.user_id == User.id).filter(User.is_active == True)
    if grade_id:
        query = query.filter(StudentProfile.grade_id == grade_id)

    records = query.order_by(desc(StudentProfile.total_xp)).limit(limit).all()
    results = []
    for rank, (prof, usr) in enumerate(records, start=1):
        grade_title = prof.grade.title_fa if prof.grade else "پایه نامشخص"
        results.append({
            "rank": rank,
            "user_id": usr.id,
            "display_name": usr.display_name or usr.full_name,
            "grade_title_fa": grade_title,
            "avatar_url": prof.avatar_url,
            "total_xp": prof.total_xp,
            "current_level": prof.current_level,
            "streak": prof.current_streak
        })
    return results
