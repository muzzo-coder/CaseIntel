"""Case and workspace business logic layer."""

import logging
from typing import List, Optional, Tuple
from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session
from app.core.errors import NotFoundException
from app.models.case import Case, CaseStatus
from app.models.user import User
from app.schemas.case import CaseCreate, CaseStatistics, CaseUpdate

logger = logging.getLogger("caseintel.services.case")


def create_case(db: Session, user: User, case_in: CaseCreate) -> Case:
    """Create a new case workspace owned by the authenticated user."""
    case = Case(
        user_id=user.id,
        title=case_in.title.strip(),
        case_number=case_in.case_number.strip() if case_in.case_number else None,
        case_type=case_in.case_type or "civil",
        court=case_in.court.strip() if case_in.court else None,
        judge=case_in.judge.strip() if case_in.judge else None,
        parties=case_in.parties,
        description=case_in.description.strip() if case_in.description else None,
        notes=case_in.notes.strip() if case_in.notes else None,
        status=CaseStatus.ACTIVE.value,
        is_archived=False,
    )
    db.add(case)
    db.commit()
    db.refresh(case)
    logger.info(f"Created case ID={case.id} '{case.title}' for user ID={user.id}")
    return case


def get_user_cases(
    db: Session,
    user: User,
    page: int = 1,
    page_size: int = 20,
    search: Optional[str] = None,
    status_filter: Optional[str] = None,
    case_type: Optional[str] = None,
    include_archived: bool = False,
) -> Tuple[List[Case], int]:
    """Retrieve paginated cases belonging strictly to the user with optional search and filters."""
    # Base filter for ownership
    base_conditions = [Case.user_id == user.id]

    if not include_archived:
        base_conditions.append(Case.is_archived == False)

    if status_filter:
        base_conditions.append(Case.status == status_filter)

    if case_type:
        base_conditions.append(Case.case_type == case_type)

    if search:
        search_pattern = f"%{search.strip().lower()}%"
        base_conditions.append(
            or_(
                func.lower(Case.title).like(search_pattern),
                func.lower(Case.case_number).like(search_pattern),
                func.lower(Case.court).like(search_pattern),
            )
        )

    # Count total matching
    count_stmt = select(func.count()).select_from(Case).where(*base_conditions)
    total = db.scalar(count_stmt) or 0

    # Paginated select ordered by newest first
    offset = (max(page, 1) - 1) * page_size
    query_stmt = (
        select(Case)
        .where(*base_conditions)
        .order_by(Case.created_at.desc())
        .offset(offset)
        .limit(page_size)
    )
    items = list(db.scalars(query_stmt).all())

    return items, total


def get_case_by_id(db: Session, case_id: str, user: User) -> Case:
    """Retrieve a single case ensuring the authenticated user owns it."""
    stmt = select(Case).where(Case.id == case_id, Case.user_id == user.id)
    case = db.scalars(stmt).first()
    if not case:
        logger.warning(f"Case lookup failed for ID={case_id} by user ID={user.id}")
        raise NotFoundException(
            message=f"Case with ID '{case_id}' was not found or you do not have permission to access it."
        )
    return case


def update_case(db: Session, case_id: str, user: User, case_update: CaseUpdate) -> Case:
    """Update case fields with ownership validation."""
    case = get_case_by_id(db, case_id, user)

    update_dict = case_update.model_dump(exclude_unset=True)
    for field, value in update_dict.items():
        if value is not None and hasattr(case, field):
            setattr(case, field, value)

    db.add(case)
    db.commit()
    db.refresh(case)
    logger.info(f"Updated case ID={case.id} for user ID={user.id}")
    return case


def archive_case(db: Session, case_id: str, user: User, archive: bool = True) -> Case:
    """Archive or unarchive a case safely."""
    case = get_case_by_id(db, case_id, user)
    case.is_archived = archive
    if archive:
        case.status = CaseStatus.ARCHIVED.value
    elif case.status == CaseStatus.ARCHIVED.value:
        case.status = CaseStatus.ACTIVE.value

    db.add(case)
    db.commit()
    db.refresh(case)
    logger.info(f"Toggled archive status to {archive} for case ID={case.id}")
    return case


def delete_case(db: Session, case_id: str, user: User) -> None:
    """Delete a case permanently with user ownership validation."""
    case = get_case_by_id(db, case_id, user)
    db.delete(case)
    db.commit()
    logger.info(f"Deleted case ID={case_id} for user ID={user.id}")


def get_case_statistics(db: Session, user: User) -> CaseStatistics:
    """Calculate aggregated metrics for user's cases."""
    total_cases = db.scalar(
        select(func.count()).select_from(Case).where(Case.user_id == user.id)
    ) or 0

    active_cases = db.scalar(
        select(func.count()).select_from(Case).where(
            Case.user_id == user.id,
            Case.is_archived == False,
            Case.status.in_([CaseStatus.ACTIVE.value, CaseStatus.PENDING_ANALYSIS.value]),
        )
    ) or 0

    completed_cases = db.scalar(
        select(func.count()).select_from(Case).where(
            Case.user_id == user.id,
            Case.status == CaseStatus.ANALYSIS_COMPLETED.value,
        )
    ) or 0

    archived_cases = db.scalar(
        select(func.count()).select_from(Case).where(
            Case.user_id == user.id,
            Case.is_archived == True,
        )
    ) or 0

    return CaseStatistics(
        total_cases=total_cases,
        active_cases=active_cases,
        completed_cases=completed_cases,
        archived_cases=archived_cases,
    )
