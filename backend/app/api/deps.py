"""Shared FastAPI dependencies including authentication and role authorization."""

from datetime import datetime, timezone
from typing import Callable, List, Optional
import jwt
from fastapi import Depends, Header, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.core.config import Settings, settings
from app.core.errors import AppException
from app.core.security import decode_token, get_token_identifier
from app.db.session import get_db
from app.models.user import User, UserRole
from app.services.user_service import get_user_by_id, is_token_revoked

# OAuth2 scheme for Swagger UI and header token parsing
oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/auth/login/form",
    auto_error=False,
)


def get_settings() -> Settings:
    """Dependency that returns the current application settings."""
    return settings


def get_current_user(
    token: Optional[str] = Depends(oauth2_scheme),
    authorization: Optional[str] = Header(None),
    db: Session = Depends(get_db),
) -> User:
    """Validate Bearer token and retrieve the authenticated user."""
    raw_token = token
    if not raw_token and authorization:
        parts = authorization.split()
        if len(parts) == 2 and parts[0].lower() == "bearer":
            raw_token = parts[1]

    if not raw_token:
        raise AppException(
            message="Authentication credentials were not provided. Please include a valid Bearer token.",
            status_code=status.HTTP_401_UNAUTHORIZED,
            error_code="NOT_AUTHENTICATED",
        )

    try:
        payload = decode_token(raw_token)
    except jwt.ExpiredSignatureError:
        raise AppException(
            message="Authentication token has expired. Please log in again.",
            status_code=status.HTTP_401_UNAUTHORIZED,
            error_code="TOKEN_EXPIRED",
        )
    except jwt.InvalidTokenError:
        raise AppException(
            message="Invalid authentication token signature or payload.",
            status_code=status.HTTP_401_UNAUTHORIZED,
            error_code="INVALID_TOKEN",
        )

    user_id: Optional[str] = payload.get("sub")
    if not user_id:
        raise AppException(
            message="Malformed token: subject identifier missing.",
            status_code=status.HTTP_401_UNAUTHORIZED,
            error_code="INVALID_TOKEN",
        )

    # Check if token was explicitly revoked
    jti = get_token_identifier(raw_token, payload)
    if is_token_revoked(db, jti):
        raise AppException(
            message="Token has been revoked. Please log in again.",
            status_code=status.HTTP_401_UNAUTHORIZED,
            error_code="TOKEN_REVOKED",
        )

    user = get_user_by_id(db, user_id)
    if not user:
        raise AppException(
            message="User account associated with this token could not be found.",
            status_code=status.HTTP_401_UNAUTHORIZED,
            error_code="USER_NOT_FOUND",
        )

    if not user.is_active:
        raise AppException(
            message="This user account has been disabled. Please contact support.",
            status_code=status.HTTP_403_FORBIDDEN,
            error_code="USER_INACTIVE",
        )

    return user


def require_roles(*allowed_roles: str) -> Callable[[User], User]:
    """Factory dependency to enforce role-based access control (RBAC)."""

    def role_dependency(current_user: User = Depends(get_current_user)) -> User:
        if current_user.is_superuser:
            return current_user

        if current_user.role not in allowed_roles:
            raise AppException(
                message=f"Access denied. Required role: {', '.join(allowed_roles)}. Your role: {current_user.role}.",
                status_code=status.HTTP_403_FORBIDDEN,
                error_code="FORBIDDEN_ROLE",
                details=[{"field": "role", "message": f"Must be one of: {allowed_roles}"}],
            )
        return current_user

    return role_dependency


def require_superuser(current_user: User = Depends(get_current_user)) -> User:
    """Dependency that enforces superuser/admin privileges."""
    if not current_user.is_superuser:
        raise AppException(
            message="Administrator privileges required.",
            status_code=status.HTTP_403_FORBIDDEN,
            error_code="ADMIN_REQUIRED",
        )
    return current_user
