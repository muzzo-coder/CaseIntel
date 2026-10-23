"""Tests for structured error handling and security response filtering."""

from fastapi import APIRouter, status
from app.core.errors import AppException, NotFoundException
from app.main import create_app


def test_404_not_found_structured_response(client):
    """Verify non-existent routes return structured JSON error instead of standard HTML."""
    response = client.get("/api/v1/non-existent-endpoint")
    assert response.status_code == status.HTTP_404_NOT_FOUND
    data = response.json()
    assert data["success"] is False
    assert data["error"]["code"] == "NOT_FOUND"
    assert "Not Found" in data["error"]["message"]


def test_custom_app_exception_handling():
    """Verify custom AppException formats correctly in response."""
    app = create_app()
    test_router = APIRouter()

    @test_router.get("/test-custom-error")
    def trigger_custom_error():
        raise AppException(
            message="Custom validation failure",
            status_code=400,
            error_code="CUSTOM_BAD_REQUEST",
            details=[{"field": "test_param", "message": "Invalid value"}],
        )

    app.include_router(test_router)
    from fastapi.testclient import TestClient

    with TestClient(app) as test_client:
        response = test_client.get("/test-custom-error")
        assert response.status_code == 400
        data = response.json()
        assert data["success"] is False
        assert data["error"]["code"] == "CUSTOM_BAD_REQUEST"
        assert data["error"]["message"] == "Custom validation failure"
        assert len(data["error"]["details"]) == 1
        assert data["error"]["details"][0]["field"] == "test_param"


def test_unhandled_exception_does_not_leak_traceback():
    """Verify unhandled 500 exceptions return opaque message and no tracebacks (Rule 9)."""
    app = create_app()
    test_router = APIRouter()

    @test_router.get("/test-internal-error")
    def trigger_internal_error():
        raise RuntimeError("Sensitive internal database password connection string")

    app.include_router(test_router)
    from fastapi.testclient import TestClient

    with TestClient(app, raise_server_exceptions=False) as test_client:
        response = test_client.get("/test-internal-error")
        assert response.status_code == status.HTTP_500_INTERNAL_SERVER_ERROR
        data = response.json()
        assert data["success"] is False
        assert data["error"]["code"] == "INTERNAL_SERVER_ERROR"
        # Must not leak the raw exception message with sensitive info
        assert "Sensitive internal database password" not in response.text
        assert "Traceback" not in response.text
