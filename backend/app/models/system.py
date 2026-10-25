from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, Float, JSON
from sqlalchemy.orm import relationship
from app.database import Base

class AIProviderConfig(Base):
    __tablename__ = "ai_provider_configs"

    id = Column(Integer, primary_key=True, index=True)
    provider_name = Column(String(32), default="openai", nullable=False)  # 'openai', 'openrouter', 'deepseek', 'ollama', 'mock'
    api_key_masked = Column(String(128), default="***", nullable=False)
    api_key_encrypted = Column(Text, nullable=True)
    base_url = Column(String(256), default="https://api.openai.com/v1", nullable=False)
    model_name = Column(String(64), default="gpt-4o-mini", nullable=False)
    tutoring_model = Column(String(64), default="gpt-4o-mini", nullable=True)
    grading_model = Column(String(64), default="gpt-4o-mini", nullable=True)
    generation_model = Column(String(64), default="gpt-4o-mini", nullable=True)
    explanation_model = Column(String(64), default="gpt-4o-mini", nullable=True)
    timeout_seconds = Column(Integer, default=45)
    max_retries = Column(Integer, default=2)
    is_active = Column(Boolean, default=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class AIUsageRecord(Base):
    __tablename__ = "ai_usage_records"

    id = Column(Integer, primary_key=True, index=True)
    operation_type = Column(String(64), nullable=False, index=True)  # 'written_grading', 'lesson_gen', 'question_gen', 'content_assist'
    prompt_tokens = Column(Integer, default=0)
    completion_tokens = Column(Integer, default=0)
    total_tokens = Column(Integer, default=0)
    estimated_cost_usd = Column(Float, default=0.0)
    status = Column(String(32), default="success", index=True)  # 'success', 'failed', 'rate_limited'
    error_message = Column(Text, nullable=True)
    latency_ms = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)


class BackgroundJob(Base):
    __tablename__ = "background_jobs"

    id = Column(Integer, primary_key=True, index=True)
    job_type = Column(String(64), nullable=False, index=True)  # 'pdf_extraction', 'ai_question_gen', 'batch_grading'
    target_id = Column(String(64), nullable=True)
    status = Column(String(32), default="pending", index=True)  # 'pending', 'running', 'completed', 'failed'
    progress_percent = Column(Float, default=0.0)
    error_message = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    action = Column(String(64), nullable=False, index=True)  # 'grade_override', 'lesson_published', 'admin_created', 'login', etc.
    target_entity = Column(String(64), nullable=False)
    target_id = Column(String(64), nullable=True)
    details_json = Column(JSON, default=dict)
    ip_address = Column(String(45), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)

    # Relationships
    user = relationship("User", back_populates="audit_logs")


class ApplicationSetting(Base):
    __tablename__ = "application_settings"

    id = Column(Integer, primary_key=True, index=True)
    key = Column(String(64), unique=True, nullable=False, index=True)
    value_json = Column(JSON, nullable=False)
    description_fa = Column(Text, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title_fa = Column(String(128), nullable=False)
    message_fa = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False, index=True)
    notification_type = Column(String(32), default="system")  # 'system', 'competition', 'badge', 'exam'
    link_url = Column(String(256), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)

    # Relationships
    user = relationship("User", back_populates="notifications")
