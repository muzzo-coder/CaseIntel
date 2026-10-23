"""Tests for health, readiness, and system status endpoints."""

from unittest.mock import patch
from fastapi import status


def test_root_endpoint(client):
    """Test root endpoint returns application metadata."""
    response = client.get("/")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["name"] == "CaseIntel API"
    assert data["environment"] == "testing"
    assert data["status"] == "operational"
    assert data["api_v1"] == "/api/v1"


def test_liveness_probe(client):
    """Test /healthz returns 200 alive."""
    response = client.get("/healthz")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["status"] == "alive"
    assert "timestamp" in data


def test_readiness_probe_healthy(client):
    """Test /readyz returns 200 ready when database connection is healthy."""
    response = client.get("/readyz")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["status"] == "ready"
    assert data["database"]["status"] == "healthy"
    assert "timestamp" in data


def test_readiness_probe_unhealthy(client):
    """Test /readyz returns 503 not_ready when database connection fails."""
    with patch("app.api.v1.endpoints.health.check_database_connection") as mock_db:
        mock_db.return_value = (False, "Simulated database connection failure")
        response = client.get("/readyz")
        assert response.status_code == status.HTTP_503_SERVICE_UNAVAILABLE
        data = response.json()
        assert data["status"] == "not_ready"
        assert data["database"]["status"] == "unhealthy"
        assert "Simulated database connection failure" in data["database"]["message"]


def test_system_health_endpoint(client):
    """Test /api/v1/health/health returns complete system health details."""
    response = client.get("/api/v1/health/health")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["status"] == "healthy"
    assert data["app_name"] == "CaseIntel API"
    assert data["environment"] == "testing"
    assert data["uptime_seconds"] >= 0
    assert data["database"]["status"] == "healthy"
    assert "timestamp" in data


def test_system_health_degraded_when_db_fails(client):
    """Test /api/v1/health/health returns 503 and degraded status when database is down."""
    with patch("app.api.v1.endpoints.health.check_database_connection") as mock_db:
        mock_db.return_value = (False, "Database down")
        response = client.get("/api/v1/health/health")
        assert response.status_code == status.HTTP_503_SERVICE_UNAVAILABLE
        data = response.json()
        assert data["status"] == "degraded"
        assert data["database"]["status"] == "unhealthy"


def test_ping_endpoint(client):
    """Test /api/v1/health/ping returns pong."""
    response = client.get("/api/v1/health/ping")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["ping"] == "pong"
    assert "timestamp" in data
