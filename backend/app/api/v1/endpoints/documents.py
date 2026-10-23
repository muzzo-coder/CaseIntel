"""Case document management endpoints."""

from typing import List
from fastapi import APIRouter, Depends, File, UploadFile, status
from sqlalchemy.orm import Session
from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.common import StandardSuccessResponse
from app.schemas.document import DocumentListResponse, DocumentResponse
from app.services import document_service

router = APIRouter()


@router.post(
    "/{case_id}/documents",
    response_model=DocumentResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Upload Case Document",
    description="Uploads a PDF, DOCX, or text file to a case matter, extracting its readable text for AI analysis.",
)
def upload_document(
    case_id: str,
    file: UploadFile = File(...),
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


@router.get(
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
    )


@router.delete(
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
