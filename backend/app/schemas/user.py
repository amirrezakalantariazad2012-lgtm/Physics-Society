from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field

class UserBase(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: Optional[str] = None
    full_name: str = Field(..., min_length=2, max_length=100)
    display_name: Optional[str] = None
    role: str = "student"

class UserCreate(UserBase):
    password: str = Field(..., min_length=6, max_length=100)
    grade_id: Optional[int] = None
    student_number: Optional[str] = None

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(UserBase):
    id: int
    is_active: bool
    must_change_password: bool = False
    created_at: datetime
    grade_id: Optional[int] = None
    grade_title_fa: Optional[str] = None
    total_xp: Optional[int] = 0
    current_level: Optional[int] = 1
    current_streak: Optional[int] = 0
    avatar_url: Optional[str] = None

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class PasswordChangeRequest(BaseModel):
    current_password: str = Field(..., min_length=1, description="رمز عبور فعلی")
    new_password: str = Field(..., min_length=8, max_length=128, description="رمز عبور جدید (حداقل ۸ کاراکتر)")
    confirm_password: str = Field(..., min_length=8, max_length=128, description="تکرار رمز عبور جدید")

class StudentProfileUpdate(BaseModel):
    display_name: Optional[str] = None
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    grade_id: Optional[int] = None
