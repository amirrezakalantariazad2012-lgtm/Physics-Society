from datetime import datetime
from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.models.exam import (
    Examination, ExaminationQuestion, ExaminationAttempt,
    Question, QuestionOption, GradingRubric, StudentAnswer, GradingReview
)
from app.models.curriculum import Chapter
from app.models.gamification import StudentProgress
from app.services.ai_service import AIService
from app.services.gamification_service import award_xp, record_daily_streak
from app.services.audit_service import log_audit_event
from app.schemas.ai import AIGradingRequest

def start_exam_attempt(db: Session, exam_id: int, user_id: int) -> ExaminationAttempt:
    """Initializes an exam attempt session"""
    exam = db.query(Examination).filter(Examination.id == exam_id, Examination.is_active == True).first()
    if not exam:
        raise ValueError("آزمون مورد نظر یافت نشد یا غیرفعال است.")

    # Calculate attempt number
    previous_attempts = db.query(ExaminationAttempt).filter(
        ExaminationAttempt.exam_id == exam_id,
        ExaminationAttempt.user_id == user_id
    ).count()

    attempt = ExaminationAttempt(
        exam_id=exam_id,
        user_id=user_id,
        attempt_number=previous_attempts + 1,
        started_at=datetime.utcnow(),
        status="in_progress",
        total_possible_points=exam.total_points
    )
    db.add(attempt)
    db.commit()
    db.refresh(attempt)
    return attempt

def submit_exam_attempt(
    db: Session,
    attempt_id: int,
    user_id: int,
    answers_data: List[Dict[str, Any]]
) -> ExaminationAttempt:
    """
    Evaluates submitted exam answers:
    - MCQs are graded deterministically on the server.
    - Written questions are evaluated via AI rubric matching.
    - Scores and review flags are stored.
    """
    attempt = db.query(ExaminationAttempt).filter(
        ExaminationAttempt.id == attempt_id,
        ExaminationAttempt.user_id == user_id
    ).first()

    if not attempt:
        raise ValueError("شناسه آزمون نامعتبر است.")
    if attempt.status != "in_progress":
        return attempt  # Duplicate submission idempotency

    ai_svc = AIService(db=db)
    auto_score_total = 0.0
    ai_score_total = 0.0
    total_possible = 0.0
    has_written_awaiting_review = False

    # Map answers by question_id
    submitted_map = {a["question_id"]: a for a in answers_data}

    # Fetch exam questions
    exam_questions = db.query(ExaminationQuestion).filter(
        ExaminationQuestion.exam_id == attempt.exam_id
    ).all()

    for eq in exam_questions:
        q: Question = eq.question
        q_points = float(eq.points)
        total_possible += q_points

        user_ans = submitted_map.get(q.id, {})
        selected_option = user_ans.get("selected_option_key")
        written_text = user_ans.get("written_response_text", "")

        student_answer = StudentAnswer(
            attempt_id=attempt.id,
            question_id=q.id,
            max_score=q_points,
            selected_option_key=selected_option,
            written_response_text=written_text,
            final_score=0.0
        )

        if q.question_type == "mcq":
            # Deterministic server-side MCQ grading
            correct_option = db.query(QuestionOption).filter(
                QuestionOption.question_id == q.id,
                QuestionOption.is_correct == True
            ).first()

            if correct_option and selected_option == correct_option.option_key:
                student_answer.auto_score = q_points
                student_answer.final_score = q_points
                student_answer.is_correct = True
                student_answer.feedback_fa = "پاسخ صحیح است."
                auto_score_total += q_points
            else:
                student_answer.auto_score = 0.0
                student_answer.final_score = 0.0
                student_answer.is_correct = False
                exp = correct_option.explanation_fa if correct_option else ""
                student_answer.feedback_fa = f"پاسخ نادرست است. گزینه درست: {correct_option.option_key if correct_option else '-'}. {exp or ''}"
            
            student_answer.review_status = "auto"

        elif q.question_type == "written":
            # AI-assisted written answer grading
            rubric = db.query(GradingRubric).filter(GradingRubric.question_id == q.id).first()
            ref_answer = rubric.reference_answer_fa if rubric else "پاسخ مرجع موجود نیست."
            rubric_dict = {
                "key_concepts": rubric.key_concepts if rubric else [],
                "partial_credit": rubric.partial_credit_rules if rubric else {}
            }

            ai_req = AIGradingRequest(
                question_prompt=q.prompt_fa,
                reference_answer=ref_answer,
                grading_rubric=rubric_dict,
                max_score=q_points,
                student_response=written_text or ""
            )

            ai_res = ai_svc.grade_written_answer(ai_req)
            student_answer.ai_score = ai_res.score
            student_answer.final_score = ai_res.score
            student_answer.feedback_fa = ai_res.feedback_fa
            student_answer.ai_analysis_json = {
                "correct_concepts": ai_res.correct_concepts,
                "missing_concepts": ai_res.missing_concepts,
                "confidence": ai_res.confidence
            }

            ai_score_total += ai_res.score
            if ai_res.requires_review:
                student_answer.review_status = "pending_review"
                has_written_awaiting_review = True
            else:
                student_answer.review_status = "approved"

        db.add(student_answer)

    # Compute totals
    final_score = auto_score_total + ai_score_total
    percentage = (final_score / max(1.0, total_possible)) * 100.0
    exam = attempt.examination

    attempt.submitted_at = datetime.utcnow()
    attempt.auto_graded_score = round(auto_score_total, 2)
    attempt.ai_proposed_score = round(ai_score_total, 2)
    attempt.final_score = round(final_score, 2)
    attempt.total_possible_points = round(total_possible, 2)
    attempt.percentage = round(percentage, 1)
    attempt.is_passed = final_score >= exam.passing_score
    attempt.status = "reviewed" if not has_written_awaiting_review else "grading"
    attempt.feedback_fa = f"آزمون با موفقیت ثبت شد. نمره کل: {attempt.final_score} از {attempt.total_possible_points} ({attempt.percentage}٪)"

    # Server-side anti-cheat: check if submission exceeded allowed duration
    max_allowed_seconds = (attempt.examination.duration_minutes * 60) + 180  # ۳ دقیقه فرجه برای تأخیر شبکه
    elapsed_seconds = (datetime.utcnow() - attempt.started_at).total_seconds()
    if elapsed_seconds > max_allowed_seconds:
        attempt.status = "expired"
        attempt.is_passed = False
        attempt.feedback_fa = "آزمون خارج از مهلت زمانی مجاز ارسال شده است و به عنوان منقضی ثبت گردید."

    db.commit()
    db.refresh(attempt)

    # Award streak & XP
    record_daily_streak(db, user_id)
    earned_xp = int(final_score * 5) if attempt.is_passed else max(10, int(final_score * 2))
    award_xp(
        db, user_id,
        amount=earned_xp,
        activity_type="exam_passed" if attempt.is_passed else "exam_participation",
        description_fa=f"آزمون فیزیک: {exam.title_fa} (نمره: {final_score})",
        reference_id=f"exam_attempt_{attempt.id}"
    )

    return attempt

def override_student_answer_grade(
    db: Session,
    student_answer_id: int,
    new_score: float,
    reason: str,
    admin_id: int
) -> StudentAnswer:
    """Administrator overrides AI-graded or auto-graded score with audit trail"""
    ans = db.query(StudentAnswer).filter(StudentAnswer.id == student_answer_id).first()
    if not ans:
        raise ValueError("پاسخ دانش‌آموز یافت نشد.")

    new_score = max(0.0, min(float(ans.max_score), round(float(new_score), 2)))
    prev_score = float(ans.final_score)

    # Record review audit
    review_record = GradingReview(
        student_answer_id=ans.id,
        reviewer_id=admin_id,
        previous_score=prev_score,
        new_score=new_score,
        review_reason=reason
    )
    db.add(review_record)

    ans.final_score = new_score
    ans.review_status = "overridden"
    ans.feedback_fa = f"نمره توسط دبیر بازبینی و ویرایش شد: {new_score} از {ans.max_score}. علت: {reason}"

    # Recalculate attempt score
    attempt = ans.attempt
    all_answers = db.query(StudentAnswer).filter(StudentAnswer.attempt_id == attempt.id).all()
    new_total = sum(a.final_score for a in all_answers)
    attempt.final_score = round(new_total, 2)
    attempt.percentage = round((new_total / max(1.0, attempt.total_possible_points)) * 100.0, 1)
    attempt.is_passed = attempt.final_score >= attempt.examination.passing_score
    attempt.status = "reviewed"

    db.commit()
    db.refresh(ans)

    # Audit log
    log_audit_event(
        db,
        action="grade_override",
        target_entity="student_answers",
        target_id=str(ans.id),
        user_id=admin_id,
        details={"prev_score": prev_score, "new_score": new_score, "reason": reason}
    )

    return ans
