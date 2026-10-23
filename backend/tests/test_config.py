"""Tests for configuration parsing and validation rules."""

import pytest
from pydantic import ValidationError
from app.core.config import Settings


def test_default_settings():
    """Verify default settings initialization."""
    settings = Settings(
        ENVIRONMENT="development",
        DATABASE_URL="sqlite:///./dev.db",
    )
    assert settings.PROJECT_NAME == "CaseIntel API"
    assert settings.VERSION == "0.1.0"
    assert settings.PORT == 8000
    assert "http://localhost:5173" in settings.CORS_ORIGINS


def test_cors_origins_from_comma_string():
    """Verify CORS origins parsing from comma-separated string."""
    settings = Settings(
        CORS_ORIGINS="http://localhost:5173, http://127.0.0.1:5173, https://app.caseintel.com",
        ENVIRONMENT="development",
        DATABASE_URL="sqlite:///./dev.db",
    )
    assert len(settings.CORS_ORIGINS) == 3
    assert "https://app.caseintel.com" in settings.CORS_ORIGINS
    assert "http://localhost:5173" in settings.CORS_ORIGINS


def test_cors_origins_from_json_string():
    """Verify CORS origins parsing from JSON array string."""
    settings = Settings(
        CORS_ORIGINS='["http://localhost:5173", "https://caseintel.com"]',
        ENVIRONMENT="development",
        DATABASE_URL="sqlite:///./dev.db",
    )
    assert len(settings.CORS_ORIGINS) == 2
    assert "https://caseintel.com" in settings.CORS_ORIGINS


def test_production_fails_with_sqlite():
    """Enforce Rule 10: Fail clearly when production uses SQLite."""
    with pytest.raises(ValidationError) as exc_info:
        Settings(
            ENVIRONMENT="production",
            DATABASE_URL="sqlite:///./prod.db",
            DEBUG=False,
        )
    assert "Production environment cannot use SQLite" in str(exc_info.value)


def test_production_fails_with_debug_true():
    """Enforce Rule 10: Fail clearly when production has DEBUG=True."""
    with pytest.raises(ValidationError) as exc_info:
        Settings(
            ENVIRONMENT="production",
            DATABASE_URL="postgresql+psycopg://user:pass@localhost:5432/caseintel_db",
            DEBUG=True,
        )
    assert "DEBUG must be set to False in production" in str(exc_info.value)


def test_production_valid_config():
    """Verify valid production settings succeed."""
    settings = Settings(
        ENVIRONMENT="production",
        DATABASE_URL="postgresql+psycopg://user:pass@localhost:5432/caseintel_db",
        DEBUG=False,
        SECRET_KEY="super-secure-production-secret-key-32-chars-long",
    )
    assert settings.ENVIRONMENT == "production"
    assert settings.DEBUG is False
    assert settings.DATABASE_URL.startswith("postgresql+psycopg://")
    assert len(settings.SECRET_KEY) >= 32
