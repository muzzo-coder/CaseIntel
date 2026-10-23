"""Pydantic schemas for case and workspace management."""

from datetime import datetime
from typing import Any, Dict, List, Optional, Union
from pydantic import BaseModel, ConfigDict, Field, field_validator
from app.models.case import CaseStatus, CaseType


class CaseBase(BaseModel):
    """Base schema for case attributes."""
    title: str = Field(..., min_length=2, max_length=255, description="Case title or matter name")
    case_number: Optional[str] = Field(None, max_length=100, description="Court docket or reference number")
    case_type: Optional[str] = Field(default=CaseType.CIVIL.value, description="Legal matter category")
    court: Optional[str] = Field(None, max_length=255, description="Court jurisdiction or forum")
    judge: Optional[str] = Field(None, max_length=255, description="Assigned judge or magistrate")
    parties: Optional[Union[Dict[str, Any], List[Any]]] = Field(None, description="Parties involved in the matter")
    description: Optional[str] = Field(None, description="Summary or background notes of the case")
    notes: Optional[str] = Field(None, description="Internal legal strategy or notes")

    @field_validator("title")
    @classmethod
    def sanitize_title(cls, v: str) -> str:
        clean = v.strip()
        if not clean:
            raise ValueError("Title cannot be blank.")
        return clean


class CaseCreate(CaseBase):
    """Payload for creating a new case."""
    pass


class CaseUpdate(BaseModel):
    """Payload for updating an existing case."""
    title: Optional[str] = Field(None, min_length=2, max_length=255)
    case_number: Optional[str] = Field(None, max_length=100)
    case_type: Optional[str] = Field(None)
    court: Optional[str] = Field(None, max_length=255)
    judge: Optional[str] = Field(None, max_length=255)
    parties: Optional[Union[Dict[str, Any], List[Any]]] = None
    description: Optional[str] = None
    status: Optional[str] = None
    is_archived: Optional[bool] = None
    notes: Optional[str] = None

    @field_validator("title")
    @classmethod
    def sanitize_title(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            clean = v.strip()
            if not clean:
                raise ValueError("Title cannot be blank.")
            return clean
        return v


class CaseResponse(BaseModel):
    """Case representation returned in API responses."""
    model_config = ConfigDict(from_attributes=True)

    id: str
    user_id: str
    title: str
    case_number: Optional[str] = None
    case_type: str
    court: Optional[str] = None
    judge: Optional[str] = None
    parties: Optional[Any] = None
    description: Optional[str] = None
    status: str
    is_archived: bool
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime


class CaseListResponse(BaseModel):
    """Paginated response envelope for case listings."""
    items: List[CaseResponse]
    total: int
    page: int
    page_size: int


class CaseStatistics(BaseModel):
    """Aggregated case statistics for the user workspace."""
    total_cases: int
    active_cases: int
    completed_cases: int
    archived_cases: int
