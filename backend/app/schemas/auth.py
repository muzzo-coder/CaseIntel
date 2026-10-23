"""Pydantic schemas for authentication and user management."""

from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator, model_validator
from app.models.user import UserRole


class UserRegisterRequest(BaseModel):
    """Payload for registering a new user."""
    name: str = Field(..., min_length=2, max_length=100, description="User's full name")
    email: EmailStr = Field(..., description="Unique email address")
    password: str = Field(..., min_length=6, max_length=128, description="Account password")
    confirm_password: str = Field(..., min_length=6, max_length=128, description="Password confirmation")
    role: Optional[UserRole] = Field(default=UserRole.LAWYER, description="Platform user role")
    phone: Optional[str] = Field(None, max_length=50, description="Optional contact phone number")

    @field_validator("email")
    @classmethod
    def normalize_email(cls, v: str) -> str:
        return v.strip().lower()

    @field_validator("name")
    @classmethod
    def sanitize_name(cls, v: str) -> str:
        return v.strip()

    @model_validator(mode="after")
    def passwords_match(self) -> "UserRegisterRequest":
        if self.password != self.confirm_password:
            raise ValueError("Passwords do not match.")
        return self


class UserLoginRequest(BaseModel):
    """Payload for user sign in."""
    email: EmailStr = Field(..., description="Registered email address")
    password: str = Field(..., min_length=1, description="Account password")

    @field_validator("email")
    @classmethod
    def normalize_email(cls, v: str) -> str:
        return v.strip().lower()


class UserResponse(BaseModel):
    """Public user profile data returned by APIs."""
    model_config = ConfigDict(from_attributes=True)

    id: str
    email: str
    full_name: str
    role: str
    phone: Optional[str] = None
    is_active: bool
    is_verified: bool = False
    created_at: datetime


class TokenResponse(BaseModel):
    """Standard Bearer token response."""
    access_token: str
    token_type: str = "bearer"
    expires_in: int = Field(..., description="Lifetime of token in seconds")
    user: UserResponse


class UserProfileUpdateRequest(BaseModel):
    """Payload for updating user profile."""
    full_name: Optional[str] = Field(None, min_length=2, max_length=100)
    phone: Optional[str] = Field(None, max_length=50)

    @field_validator("full_name")
    @classmethod
    def clean_name(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            v = v.strip()
            if not v:
                raise ValueError("Full name cannot be blank.")
        return v


class PasswordChangeRequest(BaseModel):
    """Payload for changing current password."""
    current_password: str = Field(..., min_length=1)
    new_password: str = Field(..., min_length=6, max_length=128)
    confirm_new_password: str = Field(..., min_length=6, max_length=128)

    @model_validator(mode="after")
    def validate_new_passwords(self) -> "PasswordChangeRequest":
        if self.new_password != self.confirm_new_password:
            raise ValueError("New passwords do not match.")
        if self.current_password == self.new_password:
            raise ValueError("New password must be different from current password.")
        return self


class ForgotPasswordRequest(BaseModel):
    """Payload for initiating a password reset email."""
    email: EmailStr = Field(..., description="Registered account email")

    @field_validator("email")
    @classmethod
    def normalize_email(cls, v: str) -> str:
        return v.strip().lower()


class ResetPasswordRequest(BaseModel):
    """Payload for resetting password with a reset token."""
    token: str = Field(..., min_length=1, description="Password reset verification token")
    new_password: str = Field(..., min_length=6, max_length=128, description="New account password")
    confirm_new_password: str = Field(..., min_length=6, max_length=128, description="Confirm new password")

    @model_validator(mode="after")
    def validate_reset_passwords(self) -> "ResetPasswordRequest":
        if self.new_password != self.confirm_new_password:
            raise ValueError("New passwords do not match.")
        return self


class VerifyEmailRequest(BaseModel):
    """Payload for verifying email address."""
    token: str = Field(..., min_length=1, description="Email verification token")
