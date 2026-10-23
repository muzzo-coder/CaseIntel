"""Case and workspace API endpoints."""

from typing import Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.case import (
    CaseCreate,
    CaseListResponse,
    CaseResponse,
    CaseStatistics,
    CaseUpdate,
)
from app.schemas.common import StandardSuccessResponse
from app.services import case_service

router = APIRouter()


@router.post(
    "",
    response_model=CaseResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create Case Workspace",
    description="Creates a new legal case matter owned strictly by the authenticated user.",
)
def create_case(
    case_in: CaseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> CaseResponse:
    """Create a new case for the current user."""
    case = case_service.create_case(db=db, user=current_user, case_in=case_in)
    return CaseResponse.model_validate(case)


@router.get(
    "",
    response_model=CaseListResponse,
    status_code=status.HTTP_200_OK,
    summary="List User Cases",
    description="Retrieves paginated case matters owned by the current user with optional searching and status filters.",
)
def list_cases(
    page: int = Query(1, ge=1, description="Page number starting from 1"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
    search: Optional[str] = Query(None, description="Search term matching title, docket number, or court"),
    status: Optional[str] = Query(None, description="Filter by case status"),
    case_type: Optional[str] = Query(None, description="Filter by case category"),
    include_archived: bool = Query(False, description="Whether to include archived cases in results"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> CaseListResponse:
    """Retrieve list of cases owned by the authenticated user."""
    items, total = case_service.get_user_cases(
        db=db,
        user=current_user,
        page=page,
        page_size=page_size,
        search=search,
        status_filter=status,
        case_type=case_type,
        include_archived=include_archived,
    )
    return CaseListResponse(
        items=[CaseResponse.model_validate(item) for item in items],
        total=total,
        page=page,
        page_size=page_size,
    )


@router.get(
    "/stats",
    response_model=CaseStatistics,
    status_code=status.HTTP_200_OK,
    summary="Get Case Statistics",
    description="Returns aggregated metrics of cases (total, active, completed, archived) for the current user.",
)
def get_case_statistics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> CaseStatistics:
    """Get aggregated workspace case metrics for the authenticated user."""
    return case_service.get_case_statistics(db=db, user=current_user)


@router.get(
    "/{case_id}",
    response_model=CaseResponse,
    status_code=status.HTTP_200_OK,
    summary="Get Case Details",
    description="Retrieves a single case workspace by ID. Access is strictly forbidden if owned by another user.",
)
def get_case_details(
    case_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> CaseResponse:
    """Retrieve details for a specific case owned by current user."""
    case = case_service.get_case_by_id(db=db, case_id=case_id, user=current_user)
    return CaseResponse.model_validate(case)


@router.put(
    "/{case_id}",
    response_model=CaseResponse,
    status_code=status.HTTP_200_OK,
    summary="Update Case",
    description="Updates case matter fields. User must own the case.",
)
def update_case(
    case_id: str,
    case_in: CaseUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> CaseResponse:
    """Update attributes of a case workspace."""
    case = case_service.update_case(db=db, case_id=case_id, user=current_user, case_update=case_in)
    return CaseResponse.model_validate(case)


@router.patch(
    "/{case_id}/archive",
    response_model=CaseResponse,
    status_code=status.HTTP_200_OK,
    summary="Archive or Unarchive Case",
    description="Toggles the archived state of a case workspace.",
)
def toggle_archive_case(
    case_id: str,
    archive: bool = Query(True, description="True to archive, False to restore"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> CaseResponse:
    """Archive or unarchive a case."""
    case = case_service.archive_case(db=db, case_id=case_id, user=current_user, archive=archive)
    return CaseResponse.model_validate(case)


@router.delete(
    "/{case_id}",
    response_model=StandardSuccessResponse[dict],
    status_code=status.HTTP_200_OK,
    summary="Delete Case",
    description="Permanently deletes a case workspace and associated entities. User must own the case.",
)
def delete_case(
    case_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> StandardSuccessResponse[dict]:
    """Delete a case owned by current user."""
    case_service.delete_case(db=db, case_id=case_id, user=current_user)
    return StandardSuccessResponse(
        success=True,
        message=f"Case '{case_id}' was successfully deleted.",
        data={"id": case_id},
    )
