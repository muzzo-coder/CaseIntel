"""Comprehensive automated tests for Module 2: Authentication and Authorization."""

from datetime import timedelta
import pytest
from fastapi import APIRouter, Depends, status
from app.api.deps import get_current_user, require_roles, require_superuser
from app.core.security import (
    create_access_token,
    create_email_verification_token,
    create_password_reset_token,
)
from app.main import create_app
from app.models.user import UserRole


@pytest.fixture
def registered_user(client):
    """Fixture providing a registered user and their token."""
    payload = {
        "name": "Sidra Shaikh",
        "email": "sidra.shaikh@example.com",
        "password": "SecurePassword123!",
        "confirm_password": "SecurePassword123!",
        "role": "lawyer",
        "phone": "+1234567890",
    }
    response = client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    return {
        "token": data["access_token"],
        "user": data["user"],
        "password": "SecurePassword123!",
    }


def test_register_success(client):
    """Test successful user registration returns token and user data."""
    payload = {
        "name": "Alice Advocate",
        "email": "alice.advocate@example.com",
        "password": "ValidPassword123",
        "confirm_password": "ValidPassword123",
        "role": "student",
    }
    response = client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["expires_in"] > 0
    assert data["user"]["email"] == "alice.advocate@example.com"
    assert data["user"]["full_name"] == "Alice Advocate"
    assert data["user"]["role"] == "student"
    assert data["user"]["is_active"] is True


def test_register_duplicate_email_fails(client, registered_user):
    """Test duplicate registration returns 409 conflict error."""
    payload = {
        "name": "Another User",
        "email": "sidra.shaikh@example.com",  # Duplicate
        "password": "Password123456",
        "confirm_password": "Password123456",
    }
    response = client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == status.HTTP_409_CONFLICT
    data = response.json()
    assert data["success"] is False
    assert data["error"]["code"] == "USER_ALREADY_EXISTS"


def test_register_password_mismatch_fails(client):
    """Test mismatched passwords return 422 validation error."""
    payload = {
        "name": "Test User",
        "email": "mismatch@example.com",
        "password": "Password123",
        "confirm_password": "DifferentPassword123",
    }
    response = client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    data = response.json()
    assert data["success"] is False
    assert data["error"]["code"] == "VALIDATION_ERROR"


def test_register_short_password_fails(client):
    """Test password under 6 characters fails validation."""
    payload = {
        "name": "Short Password",
        "email": "short@example.com",
        "password": "123",
        "confirm_password": "123",
    }
    response = client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    data = response.json()
    assert data["success"] is False
    assert data["error"]["code"] == "VALIDATION_ERROR"


def test_login_success(client, registered_user):
    """Test JSON login with correct credentials."""
    payload = {
        "email": "sidra.shaikh@example.com",
        "password": registered_user["password"],
    }
    response = client.post("/api/v1/auth/login", json=payload)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["email"] == "sidra.shaikh@example.com"


def test_login_invalid_password(client, registered_user):
    """Test login with wrong password returns 401."""
    payload = {
        "email": "sidra.shaikh@example.com",
        "password": "WrongPassword999!",
    }
    response = client.post("/api/v1/auth/login", json=payload)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    data = response.json()
    assert data["success"] is False
    assert data["error"]["code"] == "INVALID_CREDENTIALS"


def test_login_nonexistent_email(client):
    """Test login with non-existent email returns 401."""
    payload = {
        "email": "nonexistent@example.com",
        "password": "AnyPassword123!",
    }
    response = client.post("/api/v1/auth/login", json=payload)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    data = response.json()
    assert data["success"] is False
    assert data["error"]["code"] == "INVALID_CREDENTIALS"


def test_login_oauth2_form(client, registered_user):
    """Test login via OAuth2 specification form."""
    form_data = {
        "username": "sidra.shaikh@example.com",
        "password": registered_user["password"],
    }
    response = client.post("/api/v1/auth/login/form", data=form_data)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert "access_token" in data


def test_get_current_user_profile(client, registered_user):
    """Test GET /api/v1/auth/me returns profile for authenticated user."""
    headers = {"Authorization": f"Bearer {registered_user['token']}"}
    response = client.get("/api/v1/auth/me", headers=headers)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["email"] == "sidra.shaikh@example.com"
    assert data["full_name"] == "Sidra Shaikh"


def test_get_current_user_missing_token_fails(client):
    """Test GET /api/v1/auth/me without token returns 401."""
    response = client.get("/api/v1/auth/me")
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    data = response.json()
    assert data["success"] is False
    assert data["error"]["code"] == "NOT_AUTHENTICATED"


def test_get_current_user_invalid_token_fails(client):
    """Test GET /api/v1/auth/me with bogus token returns 401."""
    headers = {"Authorization": "Bearer invalid.token.payload"}
    response = client.get("/api/v1/auth/me", headers=headers)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    data = response.json()
    assert data["success"] is False
    assert data["error"]["code"] == "INVALID_TOKEN"


def test_get_current_user_expired_token_fails(client, registered_user):
    """Test GET /api/v1/auth/me with expired token returns 401."""
    expired_token = create_access_token(
        subject=registered_user["user"]["id"],
        expires_delta=timedelta(seconds=-10),  # In the past
    )
    headers = {"Authorization": f"Bearer {expired_token}"}
    response = client.get("/api/v1/auth/me", headers=headers)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
    data = response.json()
    assert data["success"] is False
    assert data["error"]["code"] == "TOKEN_EXPIRED"


def test_update_profile(client, registered_user):
    """Test PUT /api/v1/auth/me updates personal information."""
    headers = {"Authorization": f"Bearer {registered_user['token']}"}
    payload = {
        "full_name": "Advocate Sidra Shaikh",
        "phone": "+91 98765 43210",
    }
    response = client.put("/api/v1/auth/me", json=payload, headers=headers)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["full_name"] == "Advocate Sidra Shaikh"
    assert data["phone"] == "+91 98765 43210"


def test_change_password_flow(client, registered_user):
    """Test password change and verify login with new password."""
    headers = {"Authorization": f"Bearer {registered_user['token']}"}
    payload = {
        "current_password": registered_user["password"],
        "new_password": "NewBrandPassword456!",
        "confirm_new_password": "NewBrandPassword456!",
    }
    response = client.post("/api/v1/auth/change-password", json=payload, headers=headers)
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["success"] is True

    # Old password should no longer work
    old_login = client.post(
        "/api/v1/auth/login",
        json={"email": registered_user["user"]["email"], "password": registered_user["password"]},
    )
    assert old_login.status_code == status.HTTP_401_UNAUTHORIZED

    # New password should work
    new_login = client.post(
        "/api/v1/auth/login",
        json={"email": registered_user["user"]["email"], "password": "NewBrandPassword456!"},
    )
    assert new_login.status_code == status.HTTP_200_OK


def test_logout_revokes_token(client, registered_user):
    """Test logout blacklists the token and prevents subsequent usage."""
    headers = {"Authorization": f"Bearer {registered_user['token']}"}

    # Verify token works before logout
    check_before = client.get("/api/v1/auth/me", headers=headers)
    assert check_before.status_code == status.HTTP_200_OK

    # Logout
    logout_res = client.post("/api/v1/auth/logout", headers=headers)
    assert logout_res.status_code == status.HTTP_200_OK
    assert logout_res.json()["success"] is True

    # Verify token is now rejected as revoked
    check_after = client.get("/api/v1/auth/me", headers=headers)
    assert check_after.status_code == status.HTTP_401_UNAUTHORIZED
    data = check_after.json()
    assert data["error"]["code"] == "TOKEN_REVOKED"


def test_role_based_access_control():
    """Verify require_roles dependency restricts access based on user role."""
    app = create_app()
    test_router = APIRouter()

    @test_router.get("/admin-only")
    def admin_endpoint(user=Depends(require_roles("admin"))):
        return {"authorized": True}

    app.include_router(test_router)
    from fastapi.testclient import TestClient

    with TestClient(app) as test_client:
        # Register a regular lawyer
        reg = test_client.post(
            "/api/v1/auth/register",
            json={
                "name": "Lawyer User",
                "email": "lawyer.rbac@example.com",
                "password": "Password123!",
                "confirm_password": "Password123!",
                "role": "lawyer",
            },
        )
        lawyer_token = reg.json()["access_token"]

        # Register an admin
        reg_admin = test_client.post(
            "/api/v1/auth/register",
            json={
                "name": "Admin User",
                "email": "admin.rbac@example.com",
                "password": "Password123!",
                "confirm_password": "Password123!",
                "role": "admin",
            },
        )
        admin_token = reg_admin.json()["access_token"]

        # Regular lawyer accessing admin-only should receive 403 FORBIDDEN
        res_forbidden = test_client.get(
            "/admin-only",
            headers={"Authorization": f"Bearer {lawyer_token}"},
        )
        assert res_forbidden.status_code == status.HTTP_403_FORBIDDEN
        assert res_forbidden.json()["error"]["code"] == "FORBIDDEN_ROLE"

        # Admin accessing should receive 200 OK
        res_ok = test_client.get(
            "/admin-only",
            headers={"Authorization": f"Bearer {admin_token}"},
        )
        assert res_ok.status_code == status.HTTP_200_OK
        assert res_ok.json()["authorized"] is True


def test_forgot_password_initiates_reset(client, registered_user):
    """Test /forgot-password with valid email returns 200 without error."""
    payload = {"email": registered_user["user"]["email"]}
    response = client.post("/api/v1/auth/forgot-password", json=payload)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["success"] is True
    assert "instructions have been sent" in data["message"]


def test_forgot_password_nonexistent_email_does_not_fail(client):
    """Test /forgot-password with non-existent email does not leak user absence."""
    payload = {"email": "nobody@example.com"}
    response = client.post("/api/v1/auth/forgot-password", json=payload)
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["success"] is True


def test_reset_password_with_valid_token(client, registered_user):
    """Test resetting password using a valid reset token."""
    email = registered_user["user"]["email"]
    token = create_password_reset_token(email)

    payload = {
        "token": token,
        "new_password": "NewResetPassword789!",
        "confirm_new_password": "NewResetPassword789!",
    }
    response = client.post("/api/v1/auth/reset-password", json=payload)
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["success"] is True

    # Confirm login succeeds with new password
    login_res = client.post(
        "/api/v1/auth/login",
        json={"email": email, "password": "NewResetPassword789!"},
    )
    assert login_res.status_code == status.HTTP_200_OK


def test_reset_password_with_invalid_token(client):
    """Test resetting password with invalid token returns 400."""
    payload = {
        "token": "completely.bogus.token",
        "new_password": "ValidPassword123!",
        "confirm_new_password": "ValidPassword123!",
    }
    response = client.post("/api/v1/auth/reset-password", json=payload)
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    data = response.json()
    assert data["success"] is False
    assert data["error"]["code"] == "INVALID_RESET_TOKEN"


def test_verify_email_flow(client, registered_user):
    """Test email verification flow updates user is_verified status."""
    email = registered_user["user"]["email"]
    token = create_email_verification_token(email)

    payload = {"token": token}
    response = client.post("/api/v1/auth/verify-email", json=payload)
    assert response.status_code == status.HTTP_200_OK
    assert response.json()["success"] is True

    # Verify profile now reflects is_verified=True
    headers = {"Authorization": f"Bearer {registered_user['token']}"}
    me_res = client.get("/api/v1/auth/me", headers=headers)
    assert me_res.status_code == status.HTTP_200_OK
    assert me_res.json()["is_verified"] is True


def test_verify_email_invalid_token(client):
    """Test email verification with invalid token returns 400."""
    payload = {"token": "invalid.verification.token"}
    response = client.post("/api/v1/auth/verify-email", json=payload)
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    data = response.json()
    assert data["success"] is False
    assert data["error"]["code"] == "INVALID_VERIFICATION_TOKEN"
