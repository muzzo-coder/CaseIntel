"""Authentication endpoints: register, login, logout, current user, password management."""

from datetime import datetime, timezone
from typing import Optional
from fastapi import APIRouter, Depends, Header, Response, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.api.deps import get_current_user
from app.core.config import settings
from app.core.errors import AppException
from app.core.security import create_access_token, decode_token, get_token_identifier
from app.db.session import get_db
from app.models.user import User
from app.schemas.auth import (
    ForgotPasswordRequest,
    PasswordChangeRequest,
    ResetPasswordRequest,
    TokenResponse,
    UserProfileUpdateRequest,
    UserLoginRequest,
    UserRegisterRequest,
    UserResponse,
    VerifyEmailRequest,
)
from app.schemas.common import StandardSuccessResponse
from app.services.user_service import (
    authenticate_user,
    change_user_password,
    create_user,
    request_password_reset,
    reset_password_with_token,
    revoke_token,
    send_user_verification,
    update_user_profile,
    verify_user_email,
)

router = APIRouter()


@router.post(
    "/register",
    response_model=TokenResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register New User Account",
    description="Registers a new user account with secure password hashing and returns an initial access token.",
)
def register(
    user_in: UserRegisterRequest,
    db: Session = Depends(get_db),
) -> TokenResponse:
    """Register user with name, email, password, and optional role/phone."""
    user = create_user(db=db, user_in=user_in)
    access_token = create_access_token(
        subject=user.id,
        role=user.role,
        extra_claims={"email": user.email, "name": user.full_name},
    )
    expires_in_seconds = settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60

    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        expires_in=expires_in_seconds,
        user=UserResponse.model_validate(user),
    )


@router.post(
    "/login",
    response_model=TokenResponse,
    summary="User Login (JSON)",
    description="Authenticates with email and password and returns a JWT access token and user profile.",
)
def login(
    credentials: UserLoginRequest,
    db: Session = Depends(get_db),
) -> TokenResponse:
    """JSON login endpoint for web frontend."""
    user = authenticate_user(
        db=db,
        email=credentials.email,
        password=credentials.password,
    )
    if not user:
        raise AppException(
            message="Invalid email or password.",
            status_code=status.HTTP_401_UNAUTHORIZED,
            error_code="INVALID_CREDENTIALS",
        )

    if not user.is_active:
        raise AppException(
            message="This account has been disabled. Please contact support.",
            status_code=status.HTTP_403_FORBIDDEN,
            error_code="USER_INACTIVE",
        )

    access_token = create_access_token(
        subject=user.id,
        role=user.role,
        extra_claims={"email": user.email, "name": user.full_name},
    )
    expires_in_seconds = settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60

    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        expires_in=expires_in_seconds,
        user=UserResponse.model_validate(user),
    )


@router.post(
    "/login/form",
    response_model=TokenResponse,
    summary="User Login (OAuth2 Form)",
    description="OAuth2 password form endpoint for Swagger UI authorization.",
)
def login_oauth2_form(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
) -> TokenResponse:
    """OAuth2 password specification form login."""
    user = authenticate_user(
        db=db,
        email=form_data.username,
        password=form_data.password,
    )
    if not user:
        raise AppException(
            message="Invalid username or password.",
            status_code=status.HTTP_401_UNAUTHORIZED,
            error_code="INVALID_CREDENTIALS",
        )

    if not user.is_active:
        raise AppException(
            message="This account has been disabled.",
            status_code=status.HTTP_403_FORBIDDEN,
            error_code="USER_INACTIVE",
        )

    access_token = create_access_token(
        subject=user.id,
        role=user.role,
        extra_claims={"email": user.email, "name": user.full_name},
    )
    expires_in_seconds = settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60

    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        expires_in=expires_in_seconds,
        user=UserResponse.model_validate(user),
    )


@router.get(
    "/me",
    response_model=UserResponse,
    summary="Get Current User Profile",
    description="Returns the profile of the currently authenticated user.",
)
def get_current_user_profile(
    current_user: User = Depends(get_current_user),
) -> UserResponse:
    """Protected current user endpoint."""
    return UserResponse.model_validate(current_user)


@router.put(
    "/me",
    response_model=UserResponse,
    summary="Update Current User Profile",
    description="Updates the authenticated user's name or contact phone.",
)
def update_profile(
    update_data: UserProfileUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> UserResponse:
    """Update profile details."""
    updated_user = update_user_profile(
        db=db,
        user=current_user,
        update_data=update_data,
    )
    return UserResponse.model_validate(updated_user)


@router.post(
    "/change-password",
    summary="Change Account Password",
    description="Updates password after validating current password.",
)
def change_password(
    req: PasswordChangeRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> dict:
    """Change user password."""
    change_user_password(db=db, user=current_user, req=req)
    return {
        "success": True,
        "message": "Password changed successfully.",
    }


@router.post(
    "/logout",
    summary="Logout User",
    description="Invalidates the current session token.",
)
def logout(
    authorization: Optional[str] = Header(None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> dict:
    """Explicit logout blacklisting current token."""
    if authorization:
        parts = authorization.split()
        if len(parts) == 2 and parts[0].lower() == "bearer":
            raw_token = parts[1]
            try:
                payload = decode_token(raw_token)
                exp = payload.get("exp")
                expires_at = (
                    datetime.fromtimestamp(exp, tz=timezone.utc)
                    if exp
                    else datetime.now(timezone.utc)
                )
                jti = get_token_identifier(raw_token, payload)
                revoke_token(db, jti, expires_at)
            except Exception:
                pass

    return {
        "success": True,
        "message": "Logged out successfully.",
    }


@router.post(
    "/forgot-password",
    summary="Request Password Reset Link",
    description="Initiates password reset process and sends instructions if account exists.",
)
def forgot_password(
    req: ForgotPasswordRequest,
    db: Session = Depends(get_db),
) -> dict:
    """Request password reset link."""
    request_password_reset(db=db, email=req.email)
    return {
        "success": True,
        "message": "If an account exists with this email address, password reset instructions have been sent.",
    }


@router.post(
    "/reset-password",
    summary="Reset Password With Token",
    description="Sets a new password using a valid password reset token.",
)
def reset_password(
    req: ResetPasswordRequest,
    db: Session = Depends(get_db),
) -> dict:
    """Reset password with token."""
    reset_password_with_token(db=db, token=req.token, new_password=req.new_password)
    return {
        "success": True,
        "message": "Password has been successfully reset. You may now sign in.",
    }


@router.post(
    "/verify-email",
    summary="Verify Email Address",
    description="Verifies user email using the token provided in the verification email.",
)
def verify_email(
    req: VerifyEmailRequest,
    db: Session = Depends(get_db),
) -> dict:
    """Verify email address with token."""
    verify_user_email(db=db, token=req.token)
    return {
        "success": True,
        "message": "Email address successfully verified.",
    }


@router.post(
    "/resend-verification",
    summary="Resend Email Verification Link",
    description="Dispatches a new email verification link if account is unverified.",
)
def resend_verification(
    req: ForgotPasswordRequest,
    db: Session = Depends(get_db),
) -> dict:
    """Resend email verification link."""
    send_user_verification(db=db, email=req.email)
    return {
        "success": True,
        "message": "If this account is unverified, a verification link has been sent.",
    }
