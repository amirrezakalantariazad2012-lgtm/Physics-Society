from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel

class OptionResponse(BaseModel):
    id: int
    option_key: str
    text_fa: str
    explanation_fa: Optional[str] = None

    class Config:
        from_attributes = True

class QuestionResponse(BaseModel):
    id: int
    grade_id: int
    book_id: int
    chapter_id: int
    question_type: str
    difficulty: str
    prompt_fa: str
    points: float
    time_limit_seconds: int
    source_ref: Optional[str] = None
    options: List[OptionResponse] = []

    class Config:
        from_attributes = True

class ExamStartRequest(BaseModel):
    exam_id: int

class AnswerSubmissionItem(BaseModel):
    question_id: int
    selected_option_key: Optional[str] = None
    written_response_text: Optional[str] = None

class ExamSubmissionRequest(BaseModel):
    attempt_id: int
    answers: List[AnswerSubmissionItem]

class QuestionResultItem(BaseModel):
    question_id: int
    question_type: str
    prompt_fa: str
    selected_option_key: Optional[str] = None
    written_response_text: Optional[str] = None
    correct_option_key: Optional[str] = None
    reference_answer_fa: Optional[str] = None
    auto_score: float
    ai_score: Optional[float] = None
    final_score: float
    max_score: float
    is_correct: Optional[bool] = None
    explanation_fa: Optional[str] = None
    feedback_fa: Optional[str] = None
    review_status: str

class ExamResultResponse(BaseModel):
    attempt_id: int
    exam_id: int
    exam_title_fa: str
    started_at: datetime
    submitted_at: Optional[datetime] = None
    auto_graded_score: float
    ai_proposed_score: float
    final_score: float
    total_possible_points: float
    percentage: float
    is_passed: bool
    status: str
    xp_earned: int
    feedback_fa: Optional[str] = None
    questions: List[QuestionResultItem] = []

class AdminGradeOverrideRequest(BaseModel):
    student_answer_id: int
    new_score: float
    reason: str

class QuestionOptionCreate(BaseModel):
    option_key: str
    text_fa: str
    is_correct: bool = False
    explanation_fa: Optional[str] = None

class QuestionCreateRequest(BaseModel):
    grade_id: int
    chapter_id: int
    question_type: str = "mcq"  # 'mcq' or 'written'
    difficulty: str = "medium"  # 'easy', 'medium', 'hard'
    prompt_fa: str
    points: float = 1.0
    source_ref: Optional[str] = None
    options: Optional[List[QuestionOptionCreate]] = []
    reference_answer_fa: Optional[str] = None
    rubric_criteria: Optional[Dict[str, Any]] = None

class QuestionReviewRequest(BaseModel):
    review_status: str  # 'approved', 'rejected', 'pending_review'
    is_published: Optional[bool] = None
