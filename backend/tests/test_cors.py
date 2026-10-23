"""Tests for CORS configuration matching frontend origins."""

from fastapi import status


def test_cors_preflight_allowed_origin(client):
    """Verify CORS preflight request allows frontend origin http://localhost:5173."""
    headers = {
        "Origin": "http://localhost:5173",
        "Access-Control-Request-Method": "GET",
        "Access-Control-Request-Headers": "Content-Type",
    }
    response = client.options("/api/v1/health/health", headers=headers)
    assert response.status_code == status.HTTP_200_OK
    assert response.headers.get("access-control-allow-origin") == "http://localhost:5173"
    assert "GET" in response.headers.get("access-control-allow-methods", "")


def test_cors_preflight_alternate_allowed_origin(client):
    """Verify CORS preflight request allows alternate frontend origin http://127.0.0.1:5173."""
    headers = {
        "Origin": "http://127.0.0.1:5173",
        "Access-Control-Request-Method": "GET",
    }
    response = client.options("/healthz", headers=headers)
    assert response.status_code == status.HTTP_200_OK
    assert response.headers.get("access-control-allow-origin") == "http://127.0.0.1:5173"


def test_cors_disallowed_origin(client):
    """Verify origin not configured in CORS_ORIGINS is not granted allow header."""
    headers = {
        "Origin": "http://malicious-site.example.com",
        "Access-Control-Request-Method": "GET",
    }
    response = client.options("/healthz", headers=headers)
    # Disallowed origins do not receive the Access-Control-Allow-Origin header
    assert response.headers.get("access-control-allow-origin") is None
