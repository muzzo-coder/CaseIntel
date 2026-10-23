"""Case AI Analysis result database models."""

import enum
import uuid
from typing import Any, Dict, Optional
from sqlalchemy import ForeignKey, Index, JSON, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base, TimestampMixin


class AnalysisType(str, enum.Enum):
    """Analysis category types."""
    SUMMARY = "summary"
    ISSUES = "issues"
    EVIDENCE = "evidence"
    TIMELINE = "timeline"
    ALL = "all"


class CaseAnalysisResult(Base, TimestampMixin):
    """Stores generated case analysis outputs and source citations."""

    __tablename__ = "case_analyses"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
        index=True,
    )
    case_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("cases.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    user_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    analysis_type: Mapped[str] = mapped_column(
        String(50),
        default=AnalysisType.ALL.value,
        nullable=False,
        index=True,
    )
    summary_data: Mapped[Optional[Dict[str, Any]]] = mapped_column(
        JSON,
        nullable=True,
    )
    issues_data: Mapped[Optional[Dict[str, Any]]] = mapped_column(
        JSON,
        nullable=True,
    )
    evidence_data: Mapped[Optional[Dict[str, Any]]] = mapped_column(
        JSON,
        nullable=True,
    )
    timeline_data: Mapped[Optional[Dict[str, Any]]] = mapped_column(
        JSON,
        nullable=True,
    )
    model_used: Mapped[str] = mapped_column(
        String(100),
        default="caseintel-nlp-engine",
        nullable=False,
    )

    # Relationships
    case = relationship("Case", back_populates="analyses")
    user = relationship("User")

    __table_args__ = (
        Index("ix_case_analyses_case_type", "case_id", "analysis_type"),
    )

    def __repr__(self) -> str:
        return f"<CaseAnalysisResult ID={self.id} Case={self.case_id} Type={self.analysis_type}>"
