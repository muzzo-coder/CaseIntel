"""Standard API response schemas."""

from typing import Any, Generic, List, Optional, TypeVar
from pydantic import BaseModel, Field

DataT = TypeVar("DataT")


class ErrorDetail(BaseModel):
    """Specific detail regarding a validation or field error."""
    field: Optional[str] = Field(None, description="Path or name of the field with error")
    message: str = Field(..., description="Human-readable description of the error")
    type: Optional[str] = Field(None, description="Error type identifier")


class ErrorBody(BaseModel):
    """Structured error payload."""
    code: str = Field(..., description="High-level error code identifier")
    message: str = Field(..., description="User-friendly error explanation")
    details: List[ErrorDetail] = Field(default_factory=list, description="List of granular error details")


class StandardErrorResponse(BaseModel):
    """Standardized error envelope returned by all API endpoints."""
    success: bool = Field(False, description="Always False for error responses")
    error: ErrorBody


class StandardSuccessResponse(BaseModel, Generic[DataT]):
    """Standardized success envelope wrapper."""
    success: bool = Field(True, description="Always True for success responses")
    data: DataT
    message: Optional[str] = Field(None, description="Optional informational message")
