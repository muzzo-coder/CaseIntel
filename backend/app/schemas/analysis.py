"""Pydantic schemas for AI-powered Case Analysis features."""

from datetime import datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class SourceCitation(BaseModel):
    """Traceable citation to an actual document and excerpt."""
    document_name: str = Field(..., description="Original filename or matter source")
    document_id: Optional[str] = Field(None, description="Document UUID if applicable")
    excerpt: str = Field(..., description="Direct verbatim or contextual excerpt from the source text")
    page_number: Optional[int] = Field(None, description="Page number where available")
    relevance: Optional[str] = Field(None, description="Why this excerpt supports the assertion")


class PartyDetail(BaseModel):
    """Identified case party with role and context."""
    name: str = Field(..., description="Name of party, entity, or individual")
    role: str = Field(..., description="Role in dispute: Plaintiff, Defendant, Judge, Witness, Counsel, etc.")
    counsel: Optional[str] = Field(None, description="Legal representation if documented")
    description: Optional[str] = Field(None, description="Contextual involvement or capacity")


class ClaimDetail(BaseModel):
    """Asserted legal claim, charge, or cause of action."""
    claim: str = Field(..., description="The cause of action or legal allegation")
    asserted_by: str = Field(..., description="Party asserting the claim")
    legal_basis: Optional[str] = Field(None, description="Statutory provision, rule, or contract clause")
    relief_sought: Optional[str] = Field(None, description="Remedy, damages, or declaration demanded")


class CaseSummaryResponse(BaseModel):
    """Structured case summary output."""
    key_facts: List[str] = Field(default_factory=list, description="Material facts established from case materials")
    parties: List[PartyDetail] = Field(default_factory=list, description="All parties involved in the matter")
    claims: List[ClaimDetail] = Field(default_factory=list, description="Active claims and legal theories")
    procedural_status: str = Field(..., description="Current procedural posture and case stage")
    case_context: str = Field(..., description="Narrative overview synthesizing facts and disputes")
    source_citations: List[SourceCitation] = Field(default_factory=list, description="Traceable citations supporting summary")
    generated_at: datetime = Field(default_factory=datetime.utcnow)
    model_used: str = "caseintel-nlp-engine"


class LegalIssue(BaseModel):
    """Identified legal controversy or issue."""
    id: str = Field(..., description="Issue identifier (e.g. ISSUE-1)")
    title: str = Field(..., description="Concise statement of legal issue")
    category: str = Field(..., description="Category: procedural, substantive, constitutional, evidentiary, contractual")
    priority: str = Field("medium", description="Priority level: high, medium, low")
    description: str = Field(..., description="Detailed explanation of the issue and relevant rules")
    applicable_law_or_rule: Optional[str] = Field(None, description="Relevant statutory or precedent framework")


class DisputedFact(BaseModel):
    """Material fact in dispute between opposing parties."""
    fact: str = Field(..., description="The factual proposition in controversy")
    party_a_position: str = Field(..., description="First party's stance or allegation")
    party_b_position: str = Field(..., description="Opposing party's rebuttal or denial")
    relevance: str = Field(..., description="Why this disputed fact affects legal outcome")


class LegalQuestion(BaseModel):
    """Core question for judicial or arbiter determination."""
    question: str = Field(..., description="The legal question presented")
    context: str = Field(..., description="Factual and legal background framing the question")
    importance: str = Field(..., description="Significance to case resolution")


class IssueIdentificationResponse(BaseModel):
    """Issue identification analysis output."""
    legal_issues: List[LegalIssue] = Field(default_factory=list, description="Identified legal issues")
    disputed_facts: List[DisputedFact] = Field(default_factory=list, description="Key disputed factual matters")
    legal_questions: List[LegalQuestion] = Field(default_factory=list, description="Judicial questions to be decided")
    source_citations: List[SourceCitation] = Field(default_factory=list, description="Traceable citations")
    generated_at: datetime = Field(default_factory=datetime.utcnow)
    model_used: str = "caseintel-nlp-engine"


class EvidenceItem(BaseModel):
    """Discovered piece of evidence from case materials."""
    id: str = Field(..., description="Evidence identifier (e.g. EVID-1)")
    title: str = Field(..., description="Short name of evidence item")
    evidence_type: str = Field(..., description="Type: documentary, testimonial, physical, digital")
    description: str = Field(..., description="Detailed content of the evidence")
    proponent: Optional[str] = Field(None, description="Party relying on this evidence")
    relevance_score: float = Field(1.0, description="Calculated relevance weight (0.0 to 1.0)")
    citation: Optional[SourceCitation] = None


class EvidenceAssociation(BaseModel):
    """Association of evidence to a specific legal issue."""
    issue_id: str = Field(..., description="Referenced issue ID")
    issue_title: str = Field(..., description="Issue title")
    associated_evidence: List[str] = Field(default_factory=list, description="List of evidence item IDs")
    analysis: str = Field(..., description="How the evidence bears on this issue")


class EvidenceHighlight(BaseModel):
    """Supporting or conflicting evidence highlight."""
    point: str = Field(..., description="The factual or evidentiary point")
    impact: str = Field(..., description="favorable, adverse, or neutral")
    party: str = Field(..., description="Party affected")
    source: SourceCitation


class EvidenceAnalysisResponse(BaseModel):
    """Evidence analysis output."""
    evidence_items: List[EvidenceItem] = Field(default_factory=list, description="Catalog of evidence items")
    issue_associations: List[EvidenceAssociation] = Field(default_factory=list, description="Evidence to issue mapping")
    supporting_evidence: List[EvidenceHighlight] = Field(default_factory=list, description="Favorable evidentiary points")
    conflicting_evidence: List[EvidenceHighlight] = Field(default_factory=list, description="Contradictory or adverse points")
    source_citations: List[SourceCitation] = Field(default_factory=list, description="Traceable citations")
    generated_at: datetime = Field(default_factory=datetime.utcnow)
    model_used: str = "caseintel-nlp-engine"


class TimelineEvent(BaseModel):
    """Chronological event extracted from case materials."""
    id: str = Field(..., description="Event identifier (e.g. EVT-1)")
    date: str = Field(..., description="Normalized display date (e.g. 2026-03-15 or March 15, 2026)")
    raw_date: Optional[str] = Field(None, description="Original date string found in text")
    title: str = Field(..., description="Concise event summary")
    description: str = Field(..., description="Factual description of what transpired")
    actors: List[str] = Field(default_factory=list, description="Parties or witnesses involved")
    significance: str = Field("moderate", description="Significance: critical, moderate, background")
    citation: Optional[SourceCitation] = None


class TimelineAnalysisResponse(BaseModel):
    """Timeline analysis output."""
    events: List[TimelineEvent] = Field(default_factory=list, description="Chronologically sorted events")
    date_range: Optional[str] = Field(None, description="Span from earliest to latest event")
    total_events: int = Field(0, description="Total events extracted")
    source_citations: List[SourceCitation] = Field(default_factory=list, description="Traceable citations")
    generated_at: datetime = Field(default_factory=datetime.utcnow)
    model_used: str = "caseintel-nlp-engine"


class FullCaseAnalysisResponse(BaseModel):
    """Master response encompassing all 4 analysis pillars."""
    case_id: str
    case_title: str
    summary: CaseSummaryResponse
    issues: IssueIdentificationResponse
    evidence: EvidenceAnalysisResponse
    timeline: TimelineAnalysisResponse
    model_used: str
    updated_at: datetime
