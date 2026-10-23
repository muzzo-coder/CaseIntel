"""Schemas module initialization."""

from app.schemas.common import (
    StandardErrorResponse,
    StandardSuccessResponse,
    ErrorBody,
    ErrorDetail,
)
from app.schemas.health import (
    LivenessResponse,
    ReadinessResponse,
    SystemHealthResponse,
    DatabaseHealth,
)
from app.schemas.auth import (
    UserRegisterRequest,
    UserLoginRequest,
    UserResponse,
    TokenResponse,
    UserProfileUpdateRequest,
    PasswordChangeRequest,
)

from app.schemas.case import (
    CaseCreate,
    CaseUpdate,
    CaseResponse,
    CaseListResponse,
    CaseStatistics,
)
from app.schemas.document import (
    DocumentResponse,
    DocumentListResponse,
)
from app.schemas.analysis import (
    SourceCitation,
    CaseSummaryResponse,
    IssueIdentificationResponse,
    EvidenceAnalysisResponse,
    TimelineAnalysisResponse,
    FullCaseAnalysisResponse,
)

__all__ = [
    "StandardErrorResponse",
    "StandardSuccessResponse",
    "ErrorBody",
    "ErrorDetail",
    "LivenessResponse",
    "ReadinessResponse",
    "SystemHealthResponse",
    "DatabaseHealth",
    "UserRegisterRequest",
    "UserLoginRequest",
    "UserResponse",
    "TokenResponse",
    "UserProfileUpdateRequest",
    "PasswordChangeRequest",
    "CaseCreate",
    "CaseUpdate",
    "CaseResponse",
    "CaseListResponse",
    "CaseStatistics",
    "DocumentResponse",
    "DocumentListResponse",
    "SourceCitation",
    "CaseSummaryResponse",
    "IssueIdentificationResponse",
    "EvidenceAnalysisResponse",
    "TimelineAnalysisResponse",
    "FullCaseAnalysisResponse",
]
