"""User service implementing business logic for authentication and profile management."""

import logging
from datetime import datetime, timezone
from typing import Optional
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.core.errors import AppException
from app.core.security import hash_password, verify_password
from app.models.user import RevokedToken, User, UserRole
from app.schemas.auth import (
    PasswordChangeRequest,
    UserProfileUpdateRequest,
    UserRegisterRequest,
)

logger = logging.getLogger("caseintel.services.user")


def get_user_by_email(db: Session, email: str) -> Optional[User]:
    """Retrieve user by normalized email address."""
    stmt = select(User).where(User.email == email.strip().lower())
    return db.scalars(stmt).first()


def get_user_by_id(db: Session, user_id: str) -> Optional[User]:
    """Retrieve user by unique identifier."""
    stmt = select(User).where(User.id == user_id)
    return db.scalars(stmt).first()


def create_user(db: Session, user_in: UserRegisterRequest) -> User:
    """Create a new user account with hashed password."""
    normalized_email = user_in.email.strip().lower()
    existing_user = get_user_by_email(db, normalized_email)
    if existing_user:
        logger.info(f"Registration rejected: Email already registered ({normalized_email})")
        raise AppException(
            message="A user with this email address already exists.",
            status_code=409,
            error_code="USER_ALREADY_EXISTS",
            details=[{"field": "email", "message": "Email is already registered"}],
        )

    hashed_pwd = hash_password(user_in.password)
    user = User(
        email=normalized_email,
        full_name=user_in.name.strip(),
        hashed_password=hashed_pwd,
        role=user_in.role.value if user_in.role else UserRole.LAWYER.value,
        phone=user_in.phone.strip() if user_in.phone else None,
        is_active=True,
        is_superuser=False,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    logger.info(f"Successfully registered user ID={user.id} ({user.email}) with role={user.role}")
    return user


def authenticate_user(db: Session, email: str, password: str) -> Optional[User]:
    """Verify user credentials. Returns User if valid, None otherwise."""
    normalized_email = email.strip().lower()
    user = get_user_by_email(db, normalized_email)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user


def update_user_profile(
    db: Session, user: User, update_data: UserProfileUpdateRequest
) -> User:
    """Update user personal details."""
    if update_data.full_name is not None:
        user.full_name = update_data.full_name.strip()
    if update_data.phone is not None:
        user.phone = update_data.phone.strip() if update_data.phone else None

    db.add(user)
    db.commit()
    db.refresh(user)
    logger.info(f"Updated profile for user ID={user.id}")
    return user


def change_user_password(
    db: Session, user: User, req: PasswordChangeRequest
) -> None:
    """Verify current password and securely apply new password."""
    if not verify_password(req.current_password, user.hashed_password):
        raise AppException(
            message="The current password you provided is incorrect.",
            status_code=400,
            error_code="INVALID_CURRENT_PASSWORD",
            details=[{"field": "current_password", "message": "Incorrect password"}],
        )

    user.hashed_password = hash_password(req.new_password)
    db.add(user)
    db.commit()
    logger.info(f"Password changed for user ID={user.id}")


def revoke_token(db: Session, token_jti: str, expires_at: datetime) -> None:
    """Store revoked token identifier in blacklist."""
    revoked = RevokedToken(
        token_jti=token_jti,
        expires_at=expires_at,
    )
    db.add(revoked)
    db.commit()
    logger.info(f"Revoked token {token_jti[:10]}...")


def is_token_revoked(db: Session, token_jti: str) -> bool:
    """Check if token identifier has been revoked."""
    stmt = select(RevokedToken).where(RevokedToken.token_jti == token_jti)
    return db.scalars(stmt).first() is not None


def request_password_reset(db: Session, email: str) -> None:
    """Initiate password reset flow. Does not leak email existence."""
    from app.core.security import create_password_reset_token
    from app.services.email_service import send_password_reset_email

    normalized_email = email.strip().lower()
    user = get_user_by_email(db, normalized_email)
    if user and user.is_active:
        token = create_password_reset_token(user.email)
        send_password_reset_email(user.email, token)
        logger.info(f"Password reset token issued for user ID={user.id}")
    else:
        logger.info(f"Password reset requested for non-existent/inactive email: {normalized_email}")


def reset_password_with_token(db: Session, token: str, new_password: str) -> None:
    """Validate reset token and apply new password."""
    from app.core.security import verify_password_reset_token

    email = verify_password_reset_token(token)
    if not email:
        raise AppException(
            message="The password reset token is invalid or has expired.",
            status_code=400,
            error_code="INVALID_RESET_TOKEN",
        )

    user = get_user_by_email(db, email)
    if not user:
        raise AppException(
            message="User account associated with this reset token could not be found.",
            status_code=404,
            error_code="USER_NOT_FOUND",
        )

    user.hashed_password = hash_password(new_password)
    db.add(user)
    db.commit()
    logger.info(f"Password successfully reset for user ID={user.id}")


def verify_user_email(db: Session, token: str) -> User:
    """Validate verification token and mark user account as verified."""
    from app.core.security import verify_email_verification_token

    email = verify_email_verification_token(token)
    if not email:
        raise AppException(
            message="The email verification token is invalid or has expired.",
            status_code=400,
            error_code="INVALID_VERIFICATION_TOKEN",
        )

    user = get_user_by_email(db, email)
    if not user:
        raise AppException(
            message="User account could not be found.",
            status_code=404,
            error_code="USER_NOT_FOUND",
        )

    user.is_verified = True
    db.add(user)
    db.commit()
    db.refresh(user)
    logger.info(f"Email verified for user ID={user.id}")
    return user


def send_user_verification(db: Session, email: str) -> None:
    """Generate and dispatch verification email."""
    from app.core.security import create_email_verification_token
    from app.services.email_service import send_verification_email

    normalized_email = email.strip().lower()
    user = get_user_by_email(db, normalized_email)
    if user and user.is_active:
        token = create_email_verification_token(user.email)
        send_verification_email(user.email, token)
