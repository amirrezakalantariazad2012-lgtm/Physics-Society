from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel

class GradeResponse(BaseModel):
    id: int
    number: int
    title_fa: str
    description_fa: Optional[str] = None
    book_count: Optional[int] = 0

    class Config:
        from_attributes = True

class BookResponse(BaseModel):
    id: int
    grade_id: int
    code: str
    title_fa: str
    book_type: str
    publisher_fa: str
    academic_year: str
    cover_image_url: Optional[str] = None
    source_status: Optional[str] = "pending"
    page_count: Optional[int] = 0
    chapter_count: Optional[int] = 0

    class Config:
        from_attributes = True

class ChapterResponse(BaseModel):
    id: int
    book_id: int
    chapter_number: int
    title_fa: str
    slug: str
    description_fa: Optional[str] = None
    estimated_minutes: int
    order_index: int
    is_published: bool
    objectives_fa: Optional[str] = None
    prerequisites_fa: Optional[str] = None
    source_pages: Optional[str] = None
    lesson_count: Optional[int] = 0
    mcq_count: Optional[int] = 0
    written_count: Optional[int] = 0
    is_completed_by_user: Optional[bool] = False
    mastery_percent: Optional[int] = 0

    class Config:
        from_attributes = True

class ExerciseResponse(BaseModel):
    id: int
    lesson_id: int
    order_index: int
    exercise_type: str
    prompt_fa: str
    options_json: Optional[Any] = None
    explanation_fa: Optional[str] = None
    xp_reward: int

    class Config:
        from_attributes = True

class ExerciseSubmit(BaseModel):
    exercise_id: int
    submitted_answer: Any

class ExerciseSubmitResult(BaseModel):
    is_correct: bool
    xp_earned: int
    explanation_fa: str
    correct_answer: Any

class LessonResponse(BaseModel):
    id: int
    chapter_id: int
    topic_id: Optional[int] = None
    title_fa: str
    slug: str
    order_index: int
    is_published: bool
    estimated_minutes: int
    xp_reward: int
    content_blocks: Dict[str, Any]
    summary_fa: Optional[str] = None
    source_pages_ref: Optional[str] = None
    exercises: List[ExerciseResponse] = []
    is_completed: Optional[bool] = False

    class Config:
        from_attributes = True

class LessonProgressUpdate(BaseModel):
    lesson_id: int
    score_percent: int = 100


class SupplementaryMaterialCreate(BaseModel):
    title_fa: str
    description_fa: Optional[str] = None
    grade_id: Optional[int] = None
    author_name: Optional[str] = "دبیران انجمن فیزیک شهید بهشتی دو"
    category: str = "pamphlet"  # pamphlet, summary, formula_sheet, sample_questions
    file_url: Optional[str] = None
    original_filename: Optional[str] = None
    file_size_bytes: Optional[int] = 0


class SupplementaryMaterialResponse(BaseModel):
    id: int
    title_fa: str
    description_fa: Optional[str] = None
    grade_id: Optional[int] = None
    grade_title_fa: Optional[str] = None
    author_name: Optional[str] = None
    category: str
    file_url: Optional[str] = None
    original_filename: Optional[str] = None
    file_size_bytes: int = 0
    download_count: int = 0
    is_published: bool = True
    created_at: datetime

    class Config:
        from_attributes = True

