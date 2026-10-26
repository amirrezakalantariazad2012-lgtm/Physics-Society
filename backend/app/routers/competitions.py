from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc, func

from app.database import get_db
from app.models.user import User
from app.models.curriculum import Grade
from app.models.competition import Competition, CompetitionQuestion, CompetitionSubmission
from app.models.exam import Question, QuestionOption
from app.schemas.competition import (
    CompetitionListItem,
    CompetitionDetailResponse,
    CompetitionSubmitRequest,
    CompetitionLeaderboardItem,
    CompetitionCreateRequest,
    CompetitionUpdateRequest,
    CompetitionSubmissionReviewRequest
)
from app.services.auth import get_current_user, get_optional_current_user, get_current_admin
from app.services.gamification_service import award_xp, record_daily_streak
from app.services.audit_service import log_audit_event

router = APIRouter(prefix="/competitions", tags=["Weekly Competitions & Leagues"])

@router.get("", response_model=List[CompetitionListItem])
def list_competitions(
    league_type: Optional[str] = None,
    grade_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    """Lists all published competitions and leagues with status and user participation"""
    now = datetime.utcnow()
    query = db.query(Competition).filter(Competition.is_published == True)

    if league_type:
        query = query.filter(Competition.league_type == league_type)
    if grade_id:
        query = query.filter((Competition.grade_id == grade_id) | (Competition.grade_id == None))

    competitions = query.order_by(Competition.starts_at.desc()).all()

    results = []
    for comp in competitions:
        is_active = (comp.starts_at <= now <= comp.ends_at) and not comp.is_closed
        p_count = db.query(CompetitionSubmission).filter(CompetitionSubmission.competition_id == comp.id).count()

        user_sub = None
        if current_user:
            user_sub = db.query(CompetitionSubmission).filter(
                CompetitionSubmission.competition_id == comp.id,
                CompetitionSubmission.user_id == current_user.id
            ).first()

        results.append(CompetitionListItem(
            id=comp.id,
            grade_id=comp.grade_id,
            grade_title_fa=comp.grade.title_fa if comp.grade else "تمامی پایه‌ها (عمومی)",
            title_fa=comp.title_fa,
            description_fa=comp.description_fa,
            theme_fa=comp.theme_fa,
            league_type=getattr(comp, "league_type", "weekly") or "weekly",
            league_tier=getattr(comp, "league_tier", "quantum") or "quantum",
            duration_minutes=getattr(comp, "duration_minutes", 45) or 45,
            has_negative_marking=getattr(comp, "has_negative_marking", False) or False,
            status=getattr(comp, "status", "active") or "active",
            starts_at=comp.starts_at,
            ends_at=comp.ends_at,
            is_active=is_active,
            is_closed=comp.is_closed or (now > comp.ends_at),
            solutions_published=comp.solutions_published,
            participant_count=p_count,
            user_submitted=(user_sub is not None),
            user_score=user_sub.score if user_sub else None,
            user_rank=user_sub.final_rank if user_sub else None
        ))
    return results

@router.get("/leagues/standings")
def get_league_standings(
    league_type: str = "weekly",
    grade_id: Optional[int] = None,
    limit: int = 20,
    db: Session = Depends(get_db)
):
    """
    Cumulative leaderboard across all competitions of a specific league type.
    Aggregates total scores, competition count, and XP across students.
    """
    query = db.query(
        CompetitionSubmission.user_id,
        func.sum(CompetitionSubmission.score).label("total_score"),
        func.count(CompetitionSubmission.id).label("competitions_entered"),
        func.sum(CompetitionSubmission.xp_awarded).label("total_xp_earned")
    ).join(Competition, CompetitionSubmission.competition_id == Competition.id)\
     .filter(Competition.league_type == league_type)

    if grade_id:
        query = query.filter((Competition.grade_id == grade_id) | (Competition.grade_id == None))

    grouped = query.group_by(CompetitionSubmission.user_id)\
                   .order_by(desc("total_score"), desc("total_xp_earned"))\
                   .limit(limit).all()

    standings = []
    for rank, row in enumerate(grouped, start=1):
        user = db.query(User).filter(User.id == row.user_id).first()
        if user:
            g_title = user.profile.grade.title_fa if (user.profile and user.profile.grade) else "نامشخص"
            standings.append({
                "rank": rank,
                "user_id": user.id,
                "display_name": user.display_name or user.full_name,
                "grade_title_fa": g_title,
                "total_score": round(float(row.total_score or 0.0), 2),
                "competitions_entered": row.competitions_entered,
                "total_xp_earned": int(row.total_xp_earned or 0)
            })

    return {
        "league_type": league_type,
        "grade_id": grade_id,
        "standings": standings
    }

@router.get("/{competition_id}", response_model=CompetitionDetailResponse)
def get_competition_details(
    competition_id: int,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    """
    Retrieves competition details with questions and student submission status.
    Protects solutions from early disclosure.
    """
    comp = db.query(Competition).filter(Competition.id == competition_id).first()
    if not comp:
        raise HTTPException(status_code=404, detail="مسابقه مورد نظر یافت نشد.")

    now = datetime.utcnow()
    user_sub = None
    if current_user:
        user_sub = db.query(CompetitionSubmission).filter(
            CompetitionSubmission.competition_id == comp.id,
            CompetitionSubmission.user_id == current_user.id
        ).first()

    questions_data = []
    for cq in comp.questions:
        q = cq.question
        opts = []
        for opt in q.options:
            opts.append({
                "option_key": opt.option_key,
                "text_fa": opt.text_fa
            })

        questions_data.append({
            "id": q.id,
            "question_type": q.question_type,
            "prompt_fa": q.prompt_fa,
            "points": float(cq.points),
            "options": opts
        })

    user_sub_dict = None
    if user_sub:
        user_sub_dict = {
            "submitted_at": user_sub.submitted_at,
            "score": user_sub.score,
            "time_spent_seconds": getattr(user_sub, "time_spent_seconds", 0) or 0,
            "final_rank": user_sub.final_rank,
            "status": user_sub.status,
            "feedback_fa": user_sub.feedback_fa
        }

    return CompetitionDetailResponse(
        id=comp.id,
        grade_id=comp.grade_id,
        title_fa=comp.title_fa,
        description_fa=comp.description_fa,
        theme_fa=comp.theme_fa,
        league_type=getattr(comp, "league_type", "weekly") or "weekly",
        league_tier=getattr(comp, "league_tier", "quantum") or "quantum",
        duration_minutes=getattr(comp, "duration_minutes", 45) or 45,
        has_negative_marking=getattr(comp, "has_negative_marking", False) or False,
        negative_ratio=getattr(comp, "negative_ratio", 0.33) or 0.33,
        status=getattr(comp, "status", "active") or "active",
        starts_at=comp.starts_at,
        ends_at=comp.ends_at,
        is_closed=comp.is_closed or (now > comp.ends_at),
        solutions_published=comp.solutions_published,
        official_solution_fa=comp.official_solution_fa if comp.solutions_published else None,
        questions=questions_data,
        user_submission=user_sub_dict
    )

@router.post("/{competition_id}/submit")
def submit_competition_entry(
    competition_id: int,
    req: CompetitionSubmitRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Submits student's response to weekly competition or league challenge:
    - Enforces deadline and submission limit
    - Grades objective questions immediately with negative marking support
    - Saves completion elapsed time for tie-breaking
    - Awards participation XP and increments streak
    """
    comp = db.query(Competition).filter(Competition.id == competition_id).first()
    if not comp:
        raise HTTPException(status_code=404, detail="مسابقه مورد نظر یافت نشد.")

    now = datetime.utcnow()
    if comp.is_closed or now > comp.ends_at:
        raise HTTPException(status_code=400, detail="مهلت شرکت در این مسابقه به پایان رسیده است.")
    if now < comp.starts_at:
        raise HTTPException(status_code=400, detail="این مسابقه هنوز آغاز نشده است.")

    # Check previous submission limit
    prev_sub_count = db.query(CompetitionSubmission).filter(
        CompetitionSubmission.competition_id == comp.id,
        CompetitionSubmission.user_id == current_user.id
    ).count()

    if prev_sub_count >= comp.max_submissions_per_student:
        raise HTTPException(
            status_code=400,
            detail=f"شما قبلاً پاسخ خود را ارسال کرده‌اید (حداکثر دفعات مجاز: {comp.max_submissions_per_student})."
        )

    # Grade objective items
    total_score = 0.0
    mcq_score = 0.0
    has_neg = getattr(comp, "has_negative_marking", False)
    neg_ratio = float(getattr(comp, "negative_ratio", 0.33) or 0.33)

    for cq in comp.questions:
        q = cq.question
        user_ans = req.answers.get(str(q.id))
        if q.question_type == "mcq":
            corr = db.query(QuestionOption).filter(
                QuestionOption.question_id == q.id,
                QuestionOption.is_correct == True
            ).first()
            if corr:
                if user_ans == corr.option_key:
                    total_score += float(cq.points)
                    mcq_score += float(cq.points)
                elif user_ans and has_neg:
                    penalty = float(cq.points) * neg_ratio
                    total_score -= penalty
                    mcq_score -= penalty

    # Server-side anti-cheat timing bound check
    raw_time = req.time_spent_seconds or 0
    q_count = len(comp.questions) if comp.questions else 1
    min_reasonable_seconds = max(15, q_count * 3)  # At least 3 seconds per question, min 15s total
    max_duration_seconds = (comp.duration_minutes * 60) + 180  # 3 minutes grace for network/latency
    time_spent = max(min_reasonable_seconds, min(raw_time, max_duration_seconds))
    final_score = max(0.0, round(total_score, 2))

    sub = CompetitionSubmission(
        competition_id=comp.id,
        user_id=current_user.id,
        answers_json=req.answers,
        submitted_at=now,
        time_spent_seconds=time_spent,
        mcq_score=round(mcq_score, 2),
        score=final_score,
        xp_awarded=comp.xp_participation,
        status="graded",
        feedback_fa=f"پاسخ شما با موفقیت در مسابقات انجمن فیزیک شهید بهشتی دو دوره اول ثبت شد. امتیاز کسب‌شده در سؤالات تستی: {final_score}."
    )
    db.add(sub)
    db.commit()
    db.refresh(sub)

    # Award participation XP & streak
    award_xp(
        db, current_user.id,
        amount=comp.xp_participation,
        activity_type="competition_reward",
        description_fa=f"شرکت در مسابقه و لیگ: {comp.title_fa}",
        reference_id=f"comp_{comp.id}_sub_{sub.id}"
    )
    record_daily_streak(db, current_user.id)

    log_audit_event(
        db, action="competition_submission", target_entity="competitions",
        target_id=str(comp.id), user_id=current_user.id,
        details={"score": final_score, "time_spent_seconds": time_spent}
    )

    return {
        "success": True,
        "message_fa": "پاسخ شما با موفقیت در لیگ کوانتومی ثبت شد!",
        "score": final_score,
        "time_spent_seconds": time_spent,
        "xp_earned": comp.xp_participation
    }

@router.get("/{competition_id}/leaderboard", response_model=List[CompetitionLeaderboardItem])
def get_competition_leaderboard(
    competition_id: int,
    db: Session = Depends(get_db)
):
    """
    Retrieves ranked results for a competition or league challenge.
    Tie-breaking rule: Higher score -> Lower elapsed time -> Earlier submission.
    """
    comp = db.query(Competition).filter(Competition.id == competition_id).first()
    if not comp:
        raise HTTPException(status_code=404, detail="مسابقه یافت نشد.")

    subs = db.query(CompetitionSubmission).filter(
        CompetitionSubmission.competition_id == comp.id
    ).order_by(
        desc(CompetitionSubmission.score),
        CompetitionSubmission.time_spent_seconds.asc(),
        CompetitionSubmission.submitted_at.asc()
    ).all()

    results = []
    for rank, s in enumerate(subs, start=1):
        s.final_rank = rank
        u = s.user
        g_title = u.profile.grade.title_fa if (u.profile and u.profile.grade) else "نامشخص"
        results.append(CompetitionLeaderboardItem(
            rank=rank,
            user_id=u.id,
            display_name=u.display_name or u.full_name,
            grade_title_fa=g_title,
            score=s.score,
            time_spent_seconds=getattr(s, "time_spent_seconds", 0) or 0,
            xp_awarded=s.xp_awarded,
            submitted_at=s.submitted_at
        ))
    db.commit()
    return results

# ==================== ADMIN COMPETITION MANAGEMENT ====================

@router.post("/admin/create")
def admin_create_competition(
    req: CompetitionCreateRequest,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Admin: Creates a new competition or league challenge"""
    now = datetime.utcnow()
    starts_at = req.starts_at or now
    ends_at = req.ends_at or (starts_at + timedelta(days=7))

    comp = Competition(
        title_fa=req.title_fa,
        description_fa=req.description_fa,
        theme_fa=req.theme_fa,
        grade_id=req.grade_id,
        league_type=req.league_type or "weekly",
        league_tier=req.league_tier or "quantum",
        duration_minutes=req.duration_minutes or 45,
        has_negative_marking=bool(req.has_negative_marking),
        negative_ratio=float(req.negative_ratio or 0.33),
        starts_at=starts_at,
        ends_at=ends_at,
        is_published=True,
        is_closed=False,
        xp_first_place=req.xp_first_place or 150,
        xp_second_place=req.xp_second_place or 100,
        xp_third_place=req.xp_third_place or 70,
        xp_participation=req.xp_participation or 20
    )
    db.add(comp)
    db.commit()
    db.refresh(comp)

    # Attach questions if provided, or automatically populate top matching questions
    q_ids = list(req.question_ids) if req.question_ids else []
    if not q_ids:
        q_query = db.query(Question.id)
        if req.grade_id:
            q_query = q_query.filter(Question.grade_id == req.grade_id)
        limit_count = req.question_count or 10
        q_ids = [row[0] for row in q_query.limit(limit_count).all()]

    if q_ids:
        points_map = req.question_points or {}
        for idx, qid in enumerate(q_ids, start=1):
            q_exists = db.query(Question).filter(Question.id == qid).first()
            if q_exists:
                pts = float(points_map.get(qid, points_map.get(str(qid), 10.0)))
                cq = CompetitionQuestion(
                    competition_id=comp.id,
                    question_id=qid,
                    order_index=idx,
                    points=pts
                )
                db.add(cq)
        db.commit()

    log_audit_event(
        db, action="create_competition", target_entity="competitions",
        target_id=str(comp.id), user_id=current_admin.id,
        details={"title": comp.title_fa, "league_type": comp.league_type}
    )

    return {
        "success": True,
        "message_fa": "مسابقه با موفقیت ایجاد شد.",
        "competition_id": comp.id
    }

@router.put("/admin/{competition_id}")
def admin_update_competition(
    competition_id: int,
    req: CompetitionUpdateRequest,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Admin: Updates competition settings or toggles publish/closed state"""
    comp = db.query(Competition).filter(Competition.id == competition_id).first()
    if not comp:
        raise HTTPException(status_code=404, detail="مسابقه یافت نشد.")

    if req.title_fa is not None:
        comp.title_fa = req.title_fa
    if req.description_fa is not None:
        comp.description_fa = req.description_fa
    if req.theme_fa is not None:
        comp.theme_fa = req.theme_fa
    if req.league_type is not None:
        comp.league_type = req.league_type
    if req.league_tier is not None:
        comp.league_tier = req.league_tier
    if req.duration_minutes is not None:
        comp.duration_minutes = req.duration_minutes
    if req.has_negative_marking is not None:
        comp.has_negative_marking = req.has_negative_marking
    if req.negative_ratio is not None:
        comp.negative_ratio = req.negative_ratio
    if req.is_published is not None:
        comp.is_published = req.is_published
    if req.is_closed is not None:
        comp.is_closed = req.is_closed
    if req.solutions_published is not None:
        comp.solutions_published = req.solutions_published
    if req.official_solution_fa is not None:
        comp.official_solution_fa = req.official_solution_fa
    if req.starts_at is not None:
        comp.starts_at = req.starts_at
    if req.ends_at is not None:
        comp.ends_at = req.ends_at

    db.commit()
    return {"success": True, "message_fa": "تغییرات مسابقه با موفقیت ذخیره شد."}

@router.delete("/admin/{competition_id}")
def admin_delete_competition(
    competition_id: int,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Admin: Deletes a competition"""
    comp = db.query(Competition).filter(Competition.id == competition_id).first()
    if not comp:
        raise HTTPException(status_code=404, detail="مسابقه یافت نشد.")

    db.delete(comp)
    db.commit()
    return {"success": True, "message_fa": "مسابقه با موفقیت حذف شد."}

@router.get("/admin/{competition_id}/submissions")
def admin_get_competition_submissions(
    competition_id: int,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Admin: Lists all submissions for essay grading and review"""
    comp = db.query(Competition).filter(Competition.id == competition_id).first()
    if not comp:
        raise HTTPException(status_code=404, detail="مسابقه یافت نشد.")

    subs = db.query(CompetitionSubmission).filter(
        CompetitionSubmission.competition_id == comp.id
    ).order_by(desc(CompetitionSubmission.submitted_at)).all()

    items = []
    for s in subs:
        u = s.user
        g_title = u.profile.grade.title_fa if (u.profile and u.profile.grade) else "نامشخص"
        items.append({
            "submission_id": s.id,
            "user_id": u.id,
            "full_name": u.full_name,
            "display_name": u.display_name,
            "grade_title_fa": g_title,
            "score": s.score,
            "mcq_score": getattr(s, "mcq_score", 0.0),
            "written_score": getattr(s, "written_score", 0.0),
            "time_spent_seconds": getattr(s, "time_spent_seconds", 0),
            "status": s.status,
            "submitted_at": s.submitted_at,
            "feedback_fa": s.feedback_fa,
            "answers_json": s.answers_json
        })

    return {
        "competition_id": comp.id,
        "title_fa": comp.title_fa,
        "total_submissions": len(items),
        "submissions": items
    }

@router.post("/admin/{competition_id}/submissions/{sub_id}/grade")
def admin_grade_submission(
    competition_id: int,
    sub_id: int,
    req: CompetitionSubmissionReviewRequest,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """Admin: Manual grade override and teacher feedback on essay/competition submissions"""
    sub = db.query(CompetitionSubmission).filter(
        CompetitionSubmission.id == sub_id,
        CompetitionSubmission.competition_id == competition_id
    ).first()
    if not sub:
        raise HTTPException(status_code=404, detail="پاسخ‌نامه مورد نظر یافت نشد.")

    sub.score = round(req.score, 2)
    sub.status = "reviewed"
    if req.feedback_fa:
        sub.feedback_fa = req.feedback_fa

    db.commit()
    return {
        "success": True,
        "message_fa": "نمره و بازخورد استاد با موفقیت ثبت شد.",
        "new_score": sub.score
    }
