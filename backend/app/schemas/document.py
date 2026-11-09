"""Pydantic schemas for Legal Document Management (Module 4)."""

from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field


class DocumentResponse(BaseModel):
    """Document metadata representation in API responses."""
    model_config = ConfigDict(from_attributes=True)

    id: str
    case_id: Optional[str] = None
    user_id: str
    filename: str
    original_filename: str
    file_size: int
    file_hash: Optional[str] = None
    mime_type: str
    file_type: str
    page_count: int
    status: str
    error_message: Optional[str] = None
    created_at: datetime
    updated_at: datetime


class DocumentListResponse(BaseModel):
    """Paginated envelope for document listings."""
    items: List[DocumentResponse]
    total: int
    page: int = 1
    page_size: int = 20


class DocumentStatistics(BaseModel):
    """Aggregated document metrics for user workspace / library."""
    total_documents: int = Field(0, description="Total documents uploaded by user")
    processed_documents: int = Field(0, description="Documents processed successfully")
    processing_documents: int = Field(0, description="Documents currently processing")
    failed_documents: int = Field(0, description="Documents that encountered errors")
    total_storage_bytes: int = Field(0, description="Total storage consumed in bytes")


class DocumentDetailResponse(DocumentResponse):
    """Detailed document representation including extracted text content."""
    extracted_text: Optional[str] = None

