"""Application Settings and Environment Configuration."""

from typing import Any, List, Literal, Optional, Union
import json
from pydantic import Field, field_validator, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Central application configuration using Pydantic Settings."""

    # Project Information
    PROJECT_NAME: str = "CaseIntel API"
    VERSION: str = "0.1.0"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: Literal["development", "staging", "production", "testing"] = "development"
    DEBUG: bool = False

    # Server Configuration
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    # CORS Configuration
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

    # Database Configuration
    DATABASE_URL: str = "sqlite:///./caseintel.db"
    DATABASE_POOL_SIZE: int = 5
    DATABASE_MAX_OVERFLOW: int = 10
    DATABASE_POOL_TIMEOUT: int = 30

    # Logging Configuration
    LOG_LEVEL: Literal["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"] = "INFO"
    LOG_JSON_FORMAT: bool = False

    # Authentication & Security
    SECRET_KEY: str = "caseintel-dev-secret-key-do-not-use-in-production-min-32-bytes"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    PASSWORD_RESET_TOKEN_EXPIRE_MINUTES: int = 30
    EMAIL_VERIFICATION_TOKEN_EXPIRE_HOURS: int = 24

    # Email & Frontend Configuration
    FRONTEND_URL: str = "http://localhost:5173"
    EMAILS_ENABLED: bool = False
    SMTP_HOST: Optional[str] = None
    SMTP_PORT: int = 587
    SMTP_USER: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    SMTP_TLS: bool = True
    EMAILS_FROM_EMAIL: str = "noreply@caseintel.com"
    EMAILS_FROM_NAME: str = "CaseIntel Support"

    # AI & LLM Provider Configuration
    AI_PROVIDER: str = "auto"  # "auto", "openai", "gemini", or "local"
    OPENAI_API_KEY: Optional[str] = None
    OPENAI_MODEL: str = "gpt-4o"
    GEMINI_API_KEY: Optional[str] = None
    GEMINI_MODEL: str = "gemini-1.5-pro"

    # File Storage Configuration
    UPLOAD_DIR: str = "uploads"
    MAX_FILE_SIZE_MB: int = 25


    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        """Parse CORS origins from a comma-separated string, JSON array, or list."""
        if isinstance(v, str):
            v = v.strip()
            if not v:
                return []
            if v.startswith("[") and v.endswith("]"):
                try:
                    parsed = json.loads(v)
                    if isinstance(parsed, list):
                        return [str(item).strip() for item in parsed if str(item).strip()]
                except json.JSONDecodeError:
                    pass
            return [origin.strip() for origin in v.split(",") if origin.strip()]
        elif isinstance(v, list):
            return [str(item).strip() for item in v if str(item).strip()]
        return []

    @model_validator(mode="after")
    def validate_production_settings(self) -> "Settings":
        """Enforce strict configuration rules for production environments."""
        if self.ENVIRONMENT == "production":
            # Rule 10: Use explicit configuration and fail clearly when required production settings are missing
            if "sqlite" in self.DATABASE_URL.lower():
                raise ValueError(
                    "Production environment cannot use SQLite. "
                    "Configure a production-grade PostgreSQL DATABASE_URL."
                )
            if self.DEBUG:
                raise ValueError("DEBUG must be set to False in production.")
            if len(self.SECRET_KEY) < 32 or "dev-secret-key" in self.SECRET_KEY:
                raise ValueError(
                    "Production environment requires a secure SECRET_KEY of at least 32 characters."
                )
        return self


# Global singleton settings instance
settings = Settings()
