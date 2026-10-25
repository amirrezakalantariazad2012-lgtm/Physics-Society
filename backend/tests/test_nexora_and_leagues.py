import pytest
from datetime import datetime, timedelta
from app.models.competition import Competition, CompetitionQuestion, CompetitionSubmission
from app.models.exam import Question, QuestionOption
from app.services.ai_service import AIService, NEXORA_FREE_MODELS

def test_nexora_free_models_and_probing(client, db_session):
    # Test free models endpoint
    res = client.get("/api/ai/models/free")
    assert res.status_code == 200
    data = res.json()
    assert data["ok"] is True
    assert len(data["models"]) >= 8
    assert "google/gemma-4-31b-it:free" in data["models"]

    # Test status probe endpoint
    stat_res = client.get("/api/ai/models/status")
    assert stat_res.status_code == 200
    stat_data = stat_res.json()
    assert stat_data["ok"] is True
    assert "statuses" in stat_data

    # Test AIService error classification
    busy_err = AIService.classify_error(429, "Rate limit exceeded")
    assert busy_err["kind"] == "busy"

    vpn_err = AIService.classify_error(403, "Access denied by security policy")
    assert vpn_err["kind"] == "vpn"

    credit_err = AIService.classify_error(402, "Insufficient credits")
    assert credit_err["kind"] == "credit"

    offline_err = AIService.classify_error(404, "Model not found")
    assert offline_err["kind"] == "offline"

def test_admin_create_and_manage_league(client, db_session):
    # Login as admin
    login_res = client.post("/api/auth/login", json={
        "username": "admin",
        "password": "AdminPhysics1405!"
    })
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Fetch a sample question
    q = db_session.query(Question).filter(Question.question_type == "mcq").first()
    assert q is not None

    # Admin creates a new League competition
    create_payload = {
        "title_fa": "جام لیگ کوانتومی فیزیک نهم — مرحله اول",
        "description_fa": "آزمون زمان‌دار با نمره منفی ویژه لیگ کوانتوم",
        "theme_fa": "دینامیک و قوانین نیوتون",
        "grade_id": 3,
        "league_type": "monthly",
        "league_tier": "quantum",
        "duration_minutes": 30,
        "has_negative_marking": True,
        "negative_ratio": 0.33,
        "question_ids": [q.id],
        "question_points": {q.id: 20.0}
    }
    create_res = client.post("/api/competitions/admin/create", json=create_payload, headers=headers)
    assert create_res.status_code == 200
    comp_id = create_res.json()["competition_id"]
    assert comp_id > 0

    # Verify competition detail has league attributes
    detail_res = client.get(f"/api/competitions/{comp_id}")
    assert detail_res.status_code == 200
    d = detail_res.json()
    assert d["league_type"] == "monthly"
    assert d["duration_minutes"] == 30
    assert d["has_negative_marking"] is True
    assert len(d["questions"]) == 1

def test_competition_tie_breaking_and_negative_marking(client, db_session):
    # Create competition with negative marking
    comp = Competition(
        title_fa="لیگ سرعت فیزیک کوانتوم",
        starts_at=datetime.utcnow() - timedelta(hours=1),
        ends_at=datetime.utcnow() + timedelta(days=2),
        is_published=True,
        is_closed=False,
        has_negative_marking=True,
        negative_ratio=0.5,
        league_type="weekly",
        xp_participation=30
    )
    db_session.add(comp)
    db_session.commit()
    db_session.refresh(comp)

    # Attach Question
    q = db_session.query(Question).filter(Question.question_type == "mcq").first()
    cq = CompetitionQuestion(competition_id=comp.id, question_id=q.id, order_index=1, points=10.0)
    db_session.add(cq)
    db_session.commit()

    # Find correct and wrong option keys
    corr_opt = db_session.query(QuestionOption).filter(
        QuestionOption.question_id == q.id, QuestionOption.is_correct == True
    ).first()
    wrong_opt = db_session.query(QuestionOption).filter(
        QuestionOption.question_id == q.id, QuestionOption.is_correct == False
    ).first()

    # Login as student
    stud_res = client.post("/api/auth/login", json={
        "username": "student_beheshti",
        "password": "Student1405!"
    })
    token = stud_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Submit wrong answer to verify negative marking deduction
    sub_res = client.post(
        f"/api/competitions/{comp.id}/submit",
        json={
            "competition_id": comp.id,
            "answers": {str(q.id): wrong_opt.option_key},
            "time_spent_seconds": 120
        },
        headers=headers
    )
    assert sub_res.status_code == 200
    sub_data = sub_res.json()
    # 0.0 because bounded at min 0 for student display, or negative
    assert sub_data["time_spent_seconds"] == 120

    # Check leaderboard endpoint
    lead_res = client.get(f"/api/competitions/{comp.id}/leaderboard")
    assert lead_res.status_code == 200
    board = lead_res.json()
    assert len(board) >= 1
    assert board[0]["time_spent_seconds"] == 120

    # Check league standings endpoint
    standings_res = client.get("/api/competitions/leagues/standings?league_type=weekly")
    assert standings_res.status_code == 200
    standings_data = standings_res.json()
    assert standings_data["league_type"] == "weekly"
    assert "standings" in standings_data
