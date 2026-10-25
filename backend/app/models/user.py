from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(64), unique=True, index=True, nullable=False)
    email = Column(String(128), unique=True, index=True, nullable=True)
    hashed_password = Column(String(256), nullable=False)
    role = Column(String(32), default="student", nullable=False)  # 'admin' or 'student'
    full_name = Column(String(128), nullable=False)
    display_name = Column(String(64), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    must_change_password = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    profile = relationship("StudentProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    exam_attempts = relationship("ExaminationAttempt", back_populates="user", cascade="all, delete-orphan")
    competition_submissions = relationship("CompetitionSubmission", back_populates="user", cascade="all, delete-orphan")
    xp_transactions = relationship("XPTransaction", back_populates="user", cascade="all, delete-orphan")
    badges = relationship("StudentBadge", back_populates="user", cascade="all, delete-orphan")
    progress = relationship("StudentProgress", back_populates="user", cascade="all, delete-orphan")
    streaks = relationship("LearningStreak", back_populates="user", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
    audit_logs = relationship("AuditLog", back_populates="user")


class StudentProfile(Base):
    __tablename__ = "student_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    grade_id = Column(Integer, ForeignKey("grades.id", ondelete="SET NULL"), nullable=True)
    student_number = Column(String(32), nullable=True)
    total_xp = Column(Integer, default=0, nullable=False, index=True)
    current_level = Column(Integer, default=1, nullable=False)
    current_streak = Column(Integer, default=0, nullable=False)
    max_streak = Column(Integer, default=0, nullable=False)
    last_activity_date = Column(String(16), nullable=True)  # YYYY-MM-DD
    bio = Column(Text, nullable=True)
    avatar_url = Column(String(256), nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="profile")
    grade = relationship("Grade", back_populates="students")
