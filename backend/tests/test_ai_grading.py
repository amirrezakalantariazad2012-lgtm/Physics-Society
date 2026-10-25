import pytest
from app.services.ai_service import AIService, validate_base_url_ssrf
from app.schemas.ai import AIGradingRequest
from app.models.curriculum import Grade, Book, Chapter
from app.models.exam import Question

def test_ai_connection_test(db_session):
    svc = AIService(db=db_session)
    res = svc.test_connection()
    assert res.success is True
    assert res.provider in ["mock", "openai", "openrouter"]

def test_ai_written_answer_grading_rubric(db_session):
    svc = AIService(db=db_session)
    req = AIGradingRequest(
        question_prompt="تفاوت جرم و وزن را توضیح دهید.",
        reference_answer="جرم مقدار ماده تشکیل‌دهنده است و با کیلوگرم سنجیده می‌شود. وزن نیروی گرانش زمین است و با نیوتون سنجیده می‌شود.",
        grading_rubric={"key_concepts": ["مقدار ماده", "کیلوگرم", "نیروی گرانش", "نیوتون"]},
        max_score=5.0,
        student_response="جرم مقدار ماده است که با کیلوگرم بیان می‌شود. اما وزن نیروی جاذبه زمین بر جسم است."
    )
    result = svc.grade_written_answer(req)
    assert 0.0 <= result.score <= 5.0
    assert result.max_score == 5.0
    assert len(result.feedback_fa) > 5

def test_ai_empty_answer_handling(db_session):
    svc = AIService(db=db_session)
    req = AIGradingRequest(
        question_prompt="قانون پایستگی انرژی را بیان کنید.",
        reference_answer="انرژی نه خلق می‌شود و نه نابود.",
        max_score=5.0,
        student_response=""
    )
    result = svc.grade_written_answer(req)
    assert result.score == 0.0
    assert "ناکافی" in result.feedback_fa or "ثبت نشده" in result.feedback_fa

def test_ai_ssrf_protection():
    # Valid external URL
    assert validate_base_url_ssrf("https://api.openai.com/v1", "openai") == "https://api.openai.com/v1"
    
    # Localhost allowed for Ollama
    assert validate_base_url_ssrf("http://127.0.0.1:11434/v1", "ollama") == "http://127.0.0.1:11434/v1"
    assert validate_base_url_ssrf("http://localhost:11434/v1", "mock") == "http://localhost:11434/v1"

    # Private IP blocked for OpenAI / OpenRouter
    with pytest.raises(ValueError) as ex1:
        validate_base_url_ssrf("http://192.168.1.100/v1", "openai")
    assert "شبکه داخلی" in str(ex1.value)

    # Cloud metadata IP blocked
    with pytest.raises(ValueError) as ex2:
        validate_base_url_ssrf("http://169.254.169.254/latest", "deepseek")
    assert "شبکه داخلی" in str(ex2.value)

def test_ai_task_specific_model_routing(db_session):
    svc = AIService(db=db_session)
    svc.tutoring_model = "deepseek-chat"
    svc.grading_model = "gpt-4o-mini"
    svc.generation_model = "claude-3-5-sonnet"
    
    assert svc.get_model_for_task("tutoring") == "deepseek-chat"
    assert svc.get_model_for_task("grading") == "gpt-4o-mini"
    assert svc.get_model_for_task("generation") == "claude-3-5-sonnet"
    assert svc.get_model_for_task("unknown_task") == svc.model

def test_ai_tutor_endpoint_and_grade_scoping(client, db_session):
    # Login as student_beheshti (Grade 7, grade_id = 1)
    login_res = client.post("/api/auth/login", json={
        "username": "student_beheshti",
        "password": "Student1405!"
    })
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 1. Allowed request for Grade 7 (grade_id = 1)
    res = client.post("/api/ai/tutor", json={
        "grade_id": 1,
        "student_query": "چگالی چطور محاسبه می‌شود و یکای آن چیست؟"
    }, headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert len(data["response_fa"]) > 10
    assert len(data["key_hints"]) > 0

    # 2. Blocked request for Grade 9 (grade_id = 3) -> 403 Forbidden
    res_forbidden = client.post("/api/ai/tutor", json={
        "grade_id": 3,
        "student_query": "قانون دوم نیوتون را توضیح بده."
    }, headers=headers)
    assert res_forbidden.status_code == 403

def test_ai_explain_mistake_endpoint(client, db_session):
    # Login as student_beheshti (Grade 7)
    login_res = client.post("/api/auth/login", json={
        "username": "student_beheshti",
        "password": "Student1405!"
    })
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Find a Grade 7 question
    g7 = db_session.query(Grade).filter(Grade.number == 7).first()
    book = db_session.query(Book).filter(Book.grade_id == g7.id).first()
    ch = db_session.query(Chapter).filter(Chapter.book_id == book.id).first()
    q = db_session.query(Question).filter(Question.chapter_id == ch.id).first()

    res = client.post("/api/ai/explain-mistake", json={
        "question_id": q.id,
        "student_text": "پاسخ اشتباه دانش‌آموز"
    }, headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert data["question_id"] == q.id
    assert len(data["why_incorrect_fa"]) > 5
    assert len(data["correct_concept_fa"]) > 5
