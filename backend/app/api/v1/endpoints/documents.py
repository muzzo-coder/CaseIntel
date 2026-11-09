"""Legal Document Management API endpoints (Module 4).

Provides endpoints for standalone and case-associated document uploads,
content verification, metadata inspection, streaming downloads, and secure deletion.
"""

from typing import Optional
from fastapi import APIRouter, Depends, File, Form, Query, UploadFile, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.common import StandardSuccessResponse
from app.schemas.document import (
    DocumentDetailResponse,
    DocumentListResponse,
    DocumentResponse,
    DocumentStatistics,
)
from app.services import document_service

# Primary router for /api/v1/documents
router = APIRouter()

# Secondary router mounted under /api/v1/cases for case-specific workspaces
case_router = APIRouter()


# ---------------------------------------------------------------------------
# Standalone Document Endpoints (/api/v1/documents)
# ---------------------------------------------------------------------------


@router.post(
    "/upload",
    response_model=DocumentResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Upload Document to Library or Case",
    description="Uploads a PDF, DOCX, DOC, TXT, MD, or RTF document, verifies magic bytes, calculates SHA-256 hash, and extracts readable text.",
)
@router.post(
    "",
    response_model=DocumentResponse,
    status_code=status.HTTP_201_CREATED,
    include_in_schema=False,
)
def upload_document(
    file: UploadFile = File(..., description="Document file to upload (PDF, DOCX, TXT, MD, RTF)"),
    case_id: Optional[str] = Form(None, description="Optional case matter ID to link document with"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> DocumentResponse:
    """Upload and process a document for the authenticated user."""
    doc = document_service.upload_document(
        db=db,
        user=current_user,
        upload_file=file,
        case_id=case_id,
    )
    return DocumentResponse.model_validate(doc)


@router.get(
    "",
    response_model=DocumentListResponse,
    status_code=status.HTTP_200_OK,
    summary="List User Documents",
    description="Retrieves paginated documents owned strictly by the authenticated user with optional searching and filters.",
)
def list_documents(
    page: int = Query(1, ge=1, description="Page number starting from 1"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
    search: Optional[str] = Query(None, description="Search term matching filename or original name"),
    status: Optional[str] = Query(None, description="Filter by status (processed, pending, failed)"),
    file_type: Optional[str] = Query(None, description="Filter by file type extension (pdf, docx, txt)"),
    case_id: Optional[str] = Query(None, description="Filter documents linked to a specific case"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> DocumentListResponse:
    """List documents with pagination and filtering."""
    docs, total = document_service.get_user_documents(
        db=db,
        user=current_user,
        page=page,
        page_size=page_size,
        search=search,
        status_filter=status,
        file_type=file_type,
        case_id=case_id,
    )
    return DocumentListResponse(
        items=[DocumentResponse.model_validate(d) for d in docs],
        total=total,
        page=page,
        page_size=page_size,
    )


@router.get(
    "/stats",
    response_model=DocumentStatistics,
    status_code=status.HTTP_200_OK,
    summary="Get Document Statistics",
    description="Computes aggregate document counts and storage usage for the authenticated user.",
)
def get_document_statistics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> DocumentStatistics:
    """Return user document metrics and storage breakdown."""
    return document_service.get_document_statistics(db=db, user=current_user)


@router.get(
    "/{document_id}",
    response_model=DocumentDetailResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Document Details",
    description="Retrieves document metadata and extracted text content for user inspection.",
)
def get_document(
    document_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> DocumentDetailResponse:
    """Fetch details and readable text of a document."""
    doc = document_service.get_document_by_id(db=db, user=current_user, document_id=document_id)
    return DocumentDetailResponse.model_validate(doc)


@router.get(
    "/{document_id}/download",
    status_code=status.HTTP_200_OK,
    summary="Download Document File",
    description="Streams the original document file with Content-Disposition attachment header.",
)
def download_document(
    document_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> FileResponse:
    """Stream document binary to client for downloading."""
    file_path, original_filename, mime_type = document_service.get_document_download(
        db=db, user=current_user, document_id=document_id
    )
    return FileResponse(
        path=str(file_path),
        filename=original_filename,
        media_type=mime_type,
        content_disposition_type="attachment",
    )


@router.delete(
    "/{document_id}",
    response_model=StandardSuccessResponse[dict],
    status_code=status.HTTP_200_OK,
    summary="Delete Document",
    description="Permanently deletes the document record and removes its underlying file from storage.",
)
def delete_document(
    document_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> StandardSuccessResponse[dict]:
    """Permanently delete a document."""
    document_service.delete_document(db=db, user=current_user, document_id=document_id)
    return StandardSuccessResponse(
        success=True,
        message=f"Document '{document_id}' was successfully deleted.",
        data={"id": document_id},
    )


# ---------------------------------------------------------------------------
# Case-Specific Document Endpoints (/api/v1/cases/{case_id}/documents)
# ---------------------------------------------------------------------------


@case_router.post(
    "/{case_id}/documents",
    response_model=DocumentResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Upload Case Document",
    description="Uploads a PDF, DOCX, or text file to a case matter, extracting readable text for AI analysis.",
)
def upload_case_document(
    case_id: str,
    file: UploadFile = File(..., description="Document file to attach to the case"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> DocumentResponse:
    """Upload and process a document for a case workspace."""
    doc = document_service.upload_case_document(
        db=db,
        user=current_user,
        case_id=case_id,
        upload_file=file,
    )
    return DocumentResponse.model_validate(doc)


@case_router.get(
    "/{case_id}/documents",
    response_model=DocumentListResponse,
    status_code=status.HTTP_200_OK,
    summary="List Case Documents",
    description="Retrieves all documents attached to a specific case workspace.",
)
def list_case_documents(
    case_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> DocumentListResponse:
    """List documents belonging to the case."""
    docs = document_service.get_case_documents(db=db, user=current_user, case_id=case_id)
    return DocumentListResponse(
        items=[DocumentResponse.model_validate(d) for d in docs],
        total=len(docs),
        page=1,
        page_size=len(docs) or 20,
    )


@case_router.delete(
    "/{case_id}/documents/{document_id}",
    response_model=StandardSuccessResponse[dict],
    status_code=status.HTTP_200_OK,
    summary="Delete Case Document",
    description="Permanently removes a document and its stored file from the workspace.",
)
def delete_case_document(
    case_id: str,
    document_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> StandardSuccessResponse[dict]:
    """Delete a document from the case."""
    document_service.delete_document(db=db, user=current_user, document_id=document_id)
    return StandardSuccessResponse(
        success=True,
        message=f"Document '{document_id}' was successfully deleted.",
        data={"id": document_id},
    )
