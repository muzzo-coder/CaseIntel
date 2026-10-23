"""Pytest test fixtures and configuration."""

import os
import pytest
from fastapi.testclient import TestClient

# Ensure environment is set to testing before importing app
os.environ["ENVIRONMENT"] = "testing"
os.environ["DEBUG"] = "False"
os.environ["DATABASE_URL"] = "sqlite:///./test_caseintel.db"

from app.main import create_app
from app.db.base import Base
from app.db.session import engine
import app.models  # Ensure models are registered on Base.metadata


@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    """Create test database schema before tests and clean up afterwards."""
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)
    if os.path.exists("./test_caseintel.db"):
        os.remove("./test_caseintel.db")


@pytest.fixture(autouse=True)
def clean_tables():
    """Clear database tables between individual tests to ensure isolation."""
    yield
    with engine.begin() as conn:
        for table in reversed(Base.metadata.sorted_tables):
            conn.execute(table.delete())


@pytest.fixture
def client():
    """Provide a TestClient for testing endpoints."""
    app = create_app()
    with TestClient(app) as test_client:
        yield test_client
