from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel

class XPTransactionResponse(BaseModel):
    id: int
    amount: int
    activity_type: str
    description_fa: str
    created_at: datetime

    class Config:
        from_attributes = True

class BadgeResponse(BaseModel):
    id: int
    code: str
    title_fa: str
    description_fa: str
    icon: str
    category: str
    xp_bonus: int
    is_unlocked: bool = False
    awarded_at: Optional[datetime] = None

class LeaderboardUser(BaseModel):
    rank: int
    user_id: int
    display_name: str
    grade_title_fa: Optional[str] = None
    avatar_url: Optional[str] = None
    total_xp: int
    current_level: int
    streak: int

class LeaderboardResponse(BaseModel):
    period: str  # 'weekly', 'monthly', 'all_time'
    top_students: List[LeaderboardUser]
    user_position: Optional[LeaderboardUser] = None

class LabActivityRequest(BaseModel):
    sim_type: str
    lab_title_fa: str
    action_type: Optional[str] = "experiment_run"  # 'experiment_run', 'logbook_note', 'concept_challenge', 'lab_report'
    xp_amount: Optional[int] = 20

class LabActivityResponse(BaseModel):
    success: bool
    xp_awarded: int
    already_claimed: Optional[bool] = False
    total_xp: int
    current_level: int
    action_type: Optional[str] = "experiment_run"
    message_fa: str

class LabProgressResponse(BaseModel):
    total_lab_xp: int
    completed_labs_count: int
    completed_sim_ids: List[str]
    today_claimed_actions: List[str]
    profile_total_xp: int
    current_level: int
