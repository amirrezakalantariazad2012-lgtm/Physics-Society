import os
from typing import List
from pydantic_settings import BaseSettings
from pydantic import Field

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROJECT_ROOT = os.path.abspath(os.path.join(BASE_DIR, ".."))
DEFAULT_UPLOAD_DIR = os.path.join(PROJECT_ROOT, "data", "uploads")
DEFAULT_TEXTBOOK_DIR = os.path.join(PROJECT_ROOT, "data", "textbooks")

class Settings(BaseSettings):
    # Application Info
    APP_NAME: str = "انجمن فیزیک شهید بهشتی دو دوره اول"
    APP_ENV: str = "development"
    DEBUG: bool = True
    API_PREFIX: str = "/api"

    # Security & Tokens
    SECRET_KEY: str = "quantum-cut-super-secret-key-3249723984723984729384723984723894723"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

    # Database
    DATABASE_URL: str = "sqlite:///./physics_platform.db"

    # CORS
    ALLOWED_ORIGINS: str = "*"

    @property
    def cors_origins(self) -> List[str]:
        if self.ALLOWED_ORIGINS.strip() == "*":
            return ["*"]
        return [o.strip() for o in self.ALLOWED_ORIGINS.split(",") if o.strip()]

    # Initial Admin Setup
    INITIAL_ADMIN_USERNAME: str = "admin"
    INITIAL_ADMIN_EMAIL: str = "admin@physics-beheshti.ir"
    INITIAL_ADMIN_PASSWORD: str = "admin"

    # AI Service Configuration (Nexora OpenRouter Free Engine)
    AI_PROVIDER: str = "openrouter"  # 'openrouter', 'openai', 'deepseek', 'ollama', 'mock'
    AI_API_KEY: str = ""  # Set via AI_API_KEY in .env or environment variable
    AI_BASE_URL: str = "https://openrouter.ai/api/v1"
    AI_MODEL: str = "poolside/laguna-s-2.1:free"
    AI_TIMEOUT_SECONDS: int = 35
    AI_MAX_RETRIES: int = 3
    AI_TEMPERATURE: float = 0.35

    # Storage paths (anchored to project root)
    UPLOAD_DIR: str = os.getenv("UPLOAD_DIR", DEFAULT_UPLOAD_DIR)
    TEXTBOOK_DIR: str = os.getenv("TEXTBOOK_DIR", DEFAULT_TEXTBOOK_DIR)
    MAX_UPLOAD_SIZE_MB: int = 50

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()

# Ensure directories exist
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
os.makedirs(settings.TEXTBOOK_DIR, exist_ok=True)
