from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

class AIGradingRequest(BaseModel):
    question_prompt: str
    reference_answer: str
    grading_rubric: Optional[Dict[str, Any]] = None
    max_score: float = 5.0
    student_response: str
    context_notes: Optional[str] = None

class AIGradingResponse(BaseModel):
    score: float = Field(..., ge=0.0)
    max_score: float = Field(..., ge=0.0)
    correct_concepts: List[str] = []
    missing_concepts: List[str] = []
    feedback_fa: str
    requires_review: bool = False
    confidence: float = 1.0

class AIProviderConfigUpdate(BaseModel):
    provider_name: str
    api_key: Optional[str] = None
    base_url: str
    model_name: str
    tutoring_model: Optional[str] = "gpt-4o-mini"
    grading_model: Optional[str] = "gpt-4o-mini"
    generation_model: Optional[str] = "gpt-4o-mini"
    explanation_model: Optional[str] = "gpt-4o-mini"
    timeout_seconds: int = 40
    max_retries: int = 2

class AIConnectionTestResult(BaseModel):
    success: bool
    provider: str
    model: str
    latency_ms: int
    message_fa: str
    raw_response: Optional[str] = None

class AITutorRequest(BaseModel):
    grade_id: int
    chapter_id: Optional[int] = None
    lesson_id: Optional[int] = None
    question_id: Optional[int] = None
    student_query: str = Field(..., min_length=2, max_length=1500)
    page_context: Optional[str] = None
    history: Optional[List[Dict[str, str]]] = []
    preferred_model: Optional[str] = None

class AITutorResponse(BaseModel):
    response_fa: str
    key_hints: List[str] = []
    related_formulas: List[str] = []
    suggested_followups: List[str] = []
    model_used: str

class AIMistakeExplanationRequest(BaseModel):
    question_id: int
    selected_option_id: Optional[int] = None
    student_text: Optional[str] = None

class AIMistakeExplanationResponse(BaseModel):
    question_id: int
    why_incorrect_fa: str
    correct_concept_fa: str
    remedial_tip_fa: str
    key_formula: Optional[str] = None

class ChapterContentValidationReport(BaseModel):
    chapter_id: int
    chapter_number: int
    chapter_title_fa: str
    grade_number: int
    book_code: str
    required_mcq_count: int = 20
    actual_valid_mcq_count: int
    required_written_count: int = 10
    actual_valid_written_count: int
    is_mcq_compliant: bool
    is_written_compliant: bool
    is_fully_compliant: bool
    questions_awaiting_review: int = 0
    duplicate_or_invalid_count: int = 0
    missing_categories: List[str] = []
