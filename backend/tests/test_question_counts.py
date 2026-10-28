import pytest
from app.seed.question_bank import validate_all_chapters_content

def test_chapter_question_minimums_enforced(db_session):
    """
    MASTER REQUIREMENT:
    For EVERY chapter in EVERY supported grade, provide:
    - At least 20 multiple-choice questions
    - At least 10 written-response questions
    """
    reports = validate_all_chapters_content(db_session)
    assert len(reports) == 12, "Must contain all 12 Physics chapters across Grades 7, 8, 9"

    for r in reports:
        assert r.actual_valid_mcq_count >= 20, (
            f"Chapter {r.chapter_number} ({r.chapter_title_fa}) Grade {r.grade_number} "
            f"failed MCQ minimum: has {r.actual_valid_mcq_count}, required 20"
        )
        assert r.actual_valid_written_count >= 10, (
            f"Chapter {r.chapter_number} ({r.chapter_title_fa}) Grade {r.grade_number} "
            f"failed Written minimum: has {r.actual_valid_written_count}, required 10"
        )
        assert r.is_mcq_compliant is True
        assert r.is_written_compliant is True
        assert r.is_fully_compliant is True
        assert len(r.missing_categories) == 0

def test_only_physics_chapters_exist_and_enforced(db_session):
    """
    PURGE VERIFICATION:
    Validates that only pure physics chapters exist across Grades 7, 8, and 9,
    and all 32 non-physics chapters have been cleanly removed.
    """
    reports = validate_all_chapters_content(db_session, physics_core_only=False)
    assert len(reports) == 13, "Must contain exactly the 13 pure physics and space chapters"
    physics_map = {
        7: {2, 8, 9, 10},
        8: {9, 10, 14, 15},
        9: {4, 5, 8, 9, 10}
    }
    for r in reports:
        assert r.grade_number in physics_map
        assert r.chapter_number in physics_map[r.grade_number], (
            f"Non-physics chapter found: Grade {r.grade_number} Ch {r.chapter_number}"
        )

def test_admin_validation_report_endpoint(client):
    # Login as admin
    login_res = client.post("/api/auth/login", json={
        "username": "admin",
        "password": "AdminPhysics1405!"
    })
    admin_token = login_res.json()["access_token"]

    res = client.get(
        "/api/admin/validation-report",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert res.status_code == 200
    data = res.json()
    assert len(data) == 12
    for item in data:
        assert item["actual_valid_mcq_count"] >= 20
        assert item["actual_valid_written_count"] >= 10
        assert item["is_fully_compliant"] is True

def test_admin_create_and_review_question(client):
    login_res = client.post("/api/auth/login", json={
        "username": "admin",
        "password": "AdminPhysics1405!"
    })
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 1. Create Question
    payload = {
        "grade_id": 1,
        "chapter_id": 1,
        "question_type": "mcq",
        "difficulty": "medium",
        "prompt_fa": "کدام یک از یکاهای زیر در سیستم بین‌المللی SI به عنوان یکای اصلی جرم تعریف شده است؟ (تست)",
        "points": 1.0,
        "options": [
            {"option_key": "الف", "text_fa": "کیلوگرم (kg)", "is_correct": True},
            {"option_key": "ب", "text_fa": "گرم (g)", "is_correct": False},
            {"option_key": "ج", "text_fa": "پوند (lb)", "is_correct": False},
            {"option_key": "د", "text_fa": "تن (ton)", "is_correct": False}
        ]
    }
    create_res = client.post("/api/admin/questions", json=payload, headers=headers)
    assert create_res.status_code == 200
    q_id = create_res.json()["question_id"]
    assert q_id > 0

    # 2. Duplicate detection
    dup_res = client.post("/api/admin/questions", json=payload, headers=headers)
    assert dup_res.status_code == 400
    assert "ثبت شده است" in dup_res.json()["detail"]

    # 3. Review Question
    review_res = client.post(
        f"/api/admin/questions/{q_id}/review",
        json={"review_status": "approved", "is_published": True},
        headers=headers
    )
    assert review_res.status_code == 200
    assert review_res.json()["review_status"] == "approved"

def test_admin_batch_generate_questions(client):
    login_res = client.post("/api/auth/login", json={
        "username": "admin",
        "password": "AdminPhysics1405!"
    })
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    batch_res = client.post(
        "/api/admin/chapters/1/batch-generate?count_mcq=3&count_written=1",
        headers=headers
    )
    assert batch_res.status_code == 200
    b_data = batch_res.json()
    assert b_data["success"] is True
    assert b_data["created_questions_count"] == 4
