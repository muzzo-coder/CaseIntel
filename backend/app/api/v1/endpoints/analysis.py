"""Case AI Analysis endpoints for Summary, Issues, Evidence, and Timeline."""

from typing import Any, Dict, Optional
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.schemas.analysis import (
    CaseSummaryResponse,
    EvidenceAnalysisResponse,
    FullCaseAnalysisResponse,
    IssueIdentificationResponse,
    TimelineAnalysisResponse,
)
from app.services import ai_service

router = APIRouter()


@router.post(
    "/{case_id}/analysis/summary",
    response_model=CaseSummaryResponse,
    status_code=status.HTTP_200_OK,
    summary="Generate Case Summary",
    description="Generates a structured summary of key facts, parties, claims, and case status from uploaded documents and case details with traceable citations.",
)
def generate_case_summary(
    case_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> CaseSummaryResponse:
    """Generate structured summary for case workspace."""
    result = ai_service.analyze_case(db=db, user=current_user, case_id=case_id, feature="summary")
    return CaseSummaryResponse.model_validate(result)


@router.post(
    "/{case_id}/analysis/issues",
    response_model=IssueIdentificationResponse,
    status_code=status.HTTP_200_OK,
    summary="Identify Legal Issues",
    description="Identifies potential legal issues, disputed facts, and relevant legal questions based on available case materials with source references.",
)
def identify_case_issues(
    case_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> IssueIdentificationResponse:
    """Identify legal issues and disputed facts for case."""
    result = ai_service.analyze_case(db=db, user=current_user, case_id=case_id, feature="issues")
    return IssueIdentificationResponse.model_validate(result)


@router.post(
    "/{case_id}/analysis/evidence",
    response_model=EvidenceAnalysisResponse,
    status_code=status.HTTP_200_OK,
    summary="Analyze Case Evidence",
    description="Catalogs evidence, associates documents with relevant case issues, and highlights supporting or conflicting information with source references.",
)
def analyze_case_evidence(
    case_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> EvidenceAnalysisResponse:
    """Analyze and organize evidence items and issue associations."""
    result = ai_service.analyze_case(db=db, user=current_user, case_id=case_id, feature="evidence")
    return EvidenceAnalysisResponse.model_validate(result)


@router.post(
    "/{case_id}/analysis/timeline",
    response_model=TimelineAnalysisResponse,
    status_code=status.HTTP_200_OK,
    summary="Extract Case Timeline",
    description="Extracts chronological dates, events, and actors from case documents and materials with source citations.",
)
def extract_case_timeline(
    case_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> TimelineAnalysisResponse:
    """Extract chronological timeline of case events."""
    result = ai_service.analyze_case(db=db, user=current_user, case_id=case_id, feature="timeline")
    return TimelineAnalysisResponse.model_validate(result)


@router.post(
    "/{case_id}/analysis/all",
    response_model=FullCaseAnalysisResponse,
    status_code=status.HTTP_200_OK,
    summary="Execute Full AI Case Analysis",
    description="Executes all 4 AI analysis pillars (Summary, Issues, Evidence, Timeline) across case documents and metadata.",
)
def execute_full_case_analysis(
    case_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> FullCaseAnalysisResponse:
    """Execute all 4 analysis pillars."""
    result = ai_service.analyze_case(db=db, user=current_user, case_id=case_id, feature="all")
    return FullCaseAnalysisResponse.model_validate(result)


@router.get(
    "/{case_id}/analysis",
    status_code=status.HTTP_200_OK,
    summary="Get Cached Case Analysis",
    description="Retrieves existing stored analysis results for a case workspace without re-running the extraction pipeline.",
)
def get_cached_analysis(
    case_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Dict[str, Any]:
    """Retrieve existing stored analysis outputs."""
    result = ai_service.get_stored_case_analysis(db=db, user=current_user, case_id=case_id)
    if not result:
        # If no analysis stored yet, run full analysis
        result = ai_service.analyze_case(db=db, user=current_user, case_id=case_id, feature="all")
    return result
