"""Case and workspace database models."""

import enum
import uuid
from typing import Any, Dict, List, Optional
from sqlalchemy import Boolean, ForeignKey, Index, JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base, TimestampMixin


class CaseStatus(str, enum.Enum):
    """Case lifecycle statuses."""
    ACTIVE = "active"
    PENDING_ANALYSIS = "pending_analysis"
    ANALYSIS_COMPLETED = "analysis_completed"
    ARCHIVED = "archived"
    CLOSED = "closed"


class CaseType(str, enum.Enum):
    """Legal case categories."""
    CIVIL = "civil"
    CRIMINAL = "criminal"
    COMMERCIAL = "commercial"
    EMPLOYMENT = "employment"
    INTELLECTUAL_PROPERTY = "intellectual_property"
    FAMILY = "family"
    OTHER = "other"


class Case(Base, TimestampMixin):
    """Legal case workspace record belonging to a user."""

    __tablename__ = "cases"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
        index=True,
    )
    user_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    title: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        index=True,
    )
    case_number: Mapped[Optional[str]] = mapped_column(
        String(100),
        nullable=True,
        index=True,
    )
    case_type: Mapped[str] = mapped_column(
        String(50),
        default=CaseType.CIVIL.value,
        nullable=False,
        index=True,
    )
    court: Mapped[Optional[str]] = mapped_column(
        String(255),
        nullable=True,
    )
    judge: Mapped[Optional[str]] = mapped_column(
        String(255),
        nullable=True,
    )
    parties: Mapped[Optional[Dict[str, Any]]] = mapped_column(
        JSON,
        nullable=True,
    )
    description: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
    )
    status: Mapped[str] = mapped_column(
        String(50),
        default=CaseStatus.ACTIVE.value,
        nullable=False,
        index=True,
    )
    is_archived: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
        index=True,
    )
    notes: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
    )

    # Relationships
    user = relationship("User", back_populates="cases")
    documents = relationship("Document", back_populates="case", cascade="all, delete-orphan")
    analyses = relationship("CaseAnalysisResult", back_populates="case", cascade="all, delete-orphan")


    __table_args__ = (
        Index("ix_cases_user_status", "user_id", "status"),
        Index("ix_cases_user_archived", "user_id", "is_archived"),
    )

    def __repr__(self) -> str:
        return f"<Case {self.title} (ID={self.id}, UserID={self.user_id})>"
