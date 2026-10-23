"""Pydantic schemas for case documents."""

from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict


class DocumentResponse(BaseModel):
    """Document representation in API responses."""
    model_config = ConfigDict(from_attributes=True)

    id: str
    case_id: Optional[str] = None
    user_id: str
    filename: str
    file_size: int
    mime_type: str
    file_type: str
    page_count: int
    status: str
    error_message: Optional[str] = None
    created_at: datetime
    updated_at: datetime


class DocumentListResponse(BaseModel):
    """Envelope for document lists."""
    items: List[DocumentResponse]
    total: int
