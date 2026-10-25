from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel

class CompetitionListItem(BaseModel):
    id: int
    grade_id: Optional[int] = None
    grade_title_fa: Optional[str] = "تمامی پایه‌ها"
    title_fa: str
    description_fa: Optional[str] = None
    theme_fa: Optional[str] = None
    league_type: Optional[str] = "weekly"
    league_tier: Optional[str] = "quantum"
    duration_minutes: Optional[int] = 45
    has_negative_marking: Optional[bool] = False
    status: Optional[str] = "active"
    starts_at: datetime
    ends_at: datetime
    is_active: bool
    is_closed: bool
    solutions_published: bool
    participant_count: int = 0
    user_submitted: bool = False
    user_score: Optional[float] = None
    user_rank: Optional[int] = None

class CompetitionDetailResponse(BaseModel):
    id: int
    grade_id: Optional[int] = None
    title_fa: str
    description_fa: Optional[str] = None
    theme_fa: Optional[str] = None
    league_type: Optional[str] = "weekly"
    league_tier: Optional[str] = "quantum"
    duration_minutes: Optional[int] = 45
    has_negative_marking: Optional[bool] = False
    negative_ratio: Optional[float] = 0.33
    status: Optional[str] = "active"
    starts_at: datetime
    ends_at: datetime
    is_closed: bool
    solutions_published: bool
    official_solution_fa: Optional[str] = None
    questions: List[Dict[str, Any]] = []
    user_submission: Optional[Dict[str, Any]] = None

class CompetitionSubmitRequest(BaseModel):
    competition_id: int
    answers: Dict[str, Any]  # question_id -> answer
    time_spent_seconds: Optional[int] = 0

class CompetitionLeaderboardItem(BaseModel):
    rank: int
    user_id: int
    display_name: str
    grade_title_fa: str
    score: float
    time_spent_seconds: Optional[int] = 0
    xp_awarded: int
    submitted_at: datetime

class CompetitionCreateRequest(BaseModel):
    title_fa: str
    description_fa: Optional[str] = None
    theme_fa: Optional[str] = None
    grade_id: Optional[int] = None
    league_type: Optional[str] = "weekly"
    league_tier: Optional[str] = "quantum"
    duration_minutes: Optional[int] = 45
    has_negative_marking: Optional[bool] = False
    negative_ratio: Optional[float] = 0.33
    starts_at: Optional[datetime] = None
    ends_at: Optional[datetime] = None
    xp_first_place: Optional[int] = 150
    xp_second_place: Optional[int] = 100
    xp_third_place: Optional[int] = 70
    xp_participation: Optional[int] = 20
    question_ids: Optional[List[int]] = []
    question_count: Optional[int] = 10
    question_points: Optional[Dict[int, float]] = None

class CompetitionUpdateRequest(BaseModel):
    title_fa: Optional[str] = None
    description_fa: Optional[str] = None
    theme_fa: Optional[str] = None
    league_type: Optional[str] = None
    league_tier: Optional[str] = None
    duration_minutes: Optional[int] = None
    has_negative_marking: Optional[bool] = None
    negative_ratio: Optional[float] = None
    is_published: Optional[bool] = None
    is_closed: Optional[bool] = None
    solutions_published: Optional[bool] = None
    official_solution_fa: Optional[str] = None
    starts_at: Optional[datetime] = None
    ends_at: Optional[datetime] = None

class CompetitionSubmissionReviewRequest(BaseModel):
    score: float
    feedback_fa: Optional[str] = None
