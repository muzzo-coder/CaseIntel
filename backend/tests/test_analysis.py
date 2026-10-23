"""Automated tests for AI-powered Case Analysis features and Document Management."""

import io
import pytest
from fastapi import status
from fastapi.testclient import TestClient


def register_user(client: TestClient, email: str, full_name: str) -> str:
    """Register user and return bearer token."""
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": email,
            "name": full_name,
            "password": "SecurePassword123!",
            "confirm_password": "SecurePassword123!",
            "role": "lawyer",
        },
    )
    assert response.status_code == status.HTTP_201_CREATED, response.text
    return response.json()["access_token"]


def create_sample_case(client: TestClient, token: str) -> str:
    """Helper to create a populated case for analysis testing."""
    headers = {"Authorization": f"Bearer {token}"}
    case_res = client.post(
        "/api/v1/cases",
        json={
            "title": "NovaTech Solutions v. Apex Dynamics Inc.",
            "case_number": "CV-2026-4401",
            "case_type": "commercial",
            "court": "Delaware Court of Chancery",
            "judge": "Chancellor Kathaleen McCormick",
            "parties": {
                "plaintiff": "NovaTech Solutions LLC",
                "defendant": "Apex Dynamics Inc.",
            },
            "description": "Action for breach of contract and intellectual property misappropriation. On March 15, 2025, NovaTech entered into a Master Software Development Agreement with Apex. Apex failed to deliver milestone 3 deliverables on August 10, 2025, and subsequently deployed proprietary codebase in competitor product on November 20, 2025. NovaTech seeks $4,500,000 in damages.",
            "notes": "Defendant filed motion to dismiss claiming arbitration clause applies. Review email exhibits.",
        },
        headers=headers,
    )
    assert case_res.status_code == status.HTTP_201_CREATED
    return case_res.json()["id"]


def test_document_upload_and_text_extraction(client: TestClient):
    """Verify document upload, text extraction, listing, and deletion."""
    token = register_user(client, "attorney_docs@caseintel.com", "Sarah Jenkins")
    headers = {"Authorization": f"Bearer {token}"}
    case_id = create_sample_case(client, token)

    # 1. Upload a plain text document
    sample_text = """MASTER SOFTWARE DEVELOPMENT AGREEMENT
Dated: March 15, 2025
Parties: NovaTech Solutions LLC ("Client") and Apex Dynamics Inc. ("Developer").

Section 4.1 Deliverables:
Developer agrees to deliver Phase 1 software by June 1, 2025.
Developer agrees to deliver Phase 3 production build on or before August 10, 2025.

Section 8.2 Confidentiality and Proprietary Rights:
Developer acknowledges all developed software architecture constitutes proprietary trade secrets of Client.

Notice of Default:
On October 5, 2025, Client issued formal notice of default to Developer regarding non-delivery."""

    file_bytes = io.BytesIO(sample_text.encode("utf-8"))
    upload_res = client.post(
        f"/api/v1/cases/{case_id}/documents",
        files={"file": ("Contract_Agreement.txt", file_bytes, "text/plain")},
        headers=headers,
    )
    assert upload_res.status_code == status.HTTP_201_CREATED
    doc_data = upload_res.json()
    assert doc_data["filename"] == "Contract_Agreement.txt"
    assert doc_data["file_type"] == "txt"
    doc_id = doc_data["id"]

    # 2. List documents
    list_res = client.get(f"/api/v1/cases/{case_id}/documents", headers=headers)
    assert list_res.status_code == status.HTTP_200_OK
    assert list_res.json()["total"] == 1
    assert list_res.json()["items"][0]["id"] == doc_id

    # 3. Delete document
    del_res = client.delete(f"/api/v1/cases/{case_id}/documents/{doc_id}", headers=headers)
    assert del_res.status_code == status.HTTP_200_OK
    assert del_res.json()["success"] is True

    # Ensure list is empty
    assert client.get(f"/api/v1/cases/{case_id}/documents", headers=headers).json()["total"] == 0


def test_ai_case_summary_feature(client: TestClient):
    """Test Feature 1: Structured Case Summary generation with genuine citations."""
    token = register_user(client, "summary_user@caseintel.com", "David Clark")
    headers = {"Authorization": f"Bearer {token}"}
    case_id = create_sample_case(client, token)

    # Attach sample contract
    contract_text = "Master Agreement signed on March 15, 2025 by NovaTech and Apex Dynamics. Breach occurred when delivery failed."
    client.post(
        f"/api/v1/cases/{case_id}/documents",
        files={"file": ("Exhibit_A.txt", io.BytesIO(contract_text.encode("utf-8")), "text/plain")},
        headers=headers,
    )

    summary_res = client.post(f"/api/v1/cases/{case_id}/analysis/summary", headers=headers)
    assert summary_res.status_code == status.HTTP_200_OK
    summary = summary_res.json()

    assert len(summary["key_facts"]) > 0
    assert len(summary["parties"]) >= 2
    assert any("NovaTech" in p["name"] for p in summary["parties"])
    assert any("Apex" in p["name"] for p in summary["parties"])
    assert len(summary["claims"]) > 0
    assert "procedural_status" in summary
    assert "case_context" in summary
    assert len(summary["source_citations"]) > 0
    for cit in summary["source_citations"]:
        assert "document_name" in cit
        assert "excerpt" in cit


def test_ai_issue_identification_feature(client: TestClient):
    """Test Feature 2: Issue Identification with legal issues, disputed facts, and questions."""
    token = register_user(client, "issues_user@caseintel.com", "Emily Watson")
    headers = {"Authorization": f"Bearer {token}"}
    case_id = create_sample_case(client, token)

    issues_res = client.post(f"/api/v1/cases/{case_id}/analysis/issues", headers=headers)
    assert issues_res.status_code == status.HTTP_200_OK
    data = issues_res.json()

    assert len(data["legal_issues"]) > 0
    issue = data["legal_issues"][0]
    assert "title" in issue
    assert "category" in issue
    assert "priority" in issue
    assert "description" in issue

    assert len(data["disputed_facts"]) > 0
    fact = data["disputed_facts"][0]
    assert "fact" in fact
    assert "party_a_position" in fact
    assert "party_b_position" in fact

    assert len(data["legal_questions"]) > 0
    assert len(data["source_citations"]) >= 0


def test_ai_evidence_analysis_feature(client: TestClient):
    """Test Feature 3: Evidence Analysis with catalog, issue mapping, and supporting/conflicting highlights."""
    token = register_user(client, "evidence_user@caseintel.com", "Marcus Vance")
    headers = {"Authorization": f"Bearer {token}"}
    case_id = create_sample_case(client, token)

    # Attach document
    doc_text = "Exhibit B: Email correspondence dated October 5, 2025. Client demanded immediate cure. Apex denied any intentional breach."
    client.post(
        f"/api/v1/cases/{case_id}/documents",
        files={"file": ("Exhibit_B.txt", io.BytesIO(doc_text.encode("utf-8")), "text/plain")},
        headers=headers,
    )

    evid_res = client.post(f"/api/v1/cases/{case_id}/analysis/evidence", headers=headers)
    assert evid_res.status_code == status.HTTP_200_OK
    evid = evid_res.json()

    assert len(evid["evidence_items"]) > 0
    assert any(e["evidence_type"] == "documentary" for e in evid["evidence_items"])

    assert len(evid["issue_associations"]) > 0
    assoc = evid["issue_associations"][0]
    assert "issue_id" in assoc
    assert len(assoc["associated_evidence"]) > 0

    assert len(evid["supporting_evidence"]) > 0
    assert len(evid["conflicting_evidence"]) > 0


def test_ai_timeline_analysis_feature(client: TestClient):
    """Test Feature 4: Timeline Analysis with chronological date extraction and traceable citations."""
    token = register_user(client, "timeline_user@caseintel.com", "Rachel Zane")
    headers = {"Authorization": f"Bearer {token}"}
    case_id = create_sample_case(client, token)

    # Upload document with specific dates
    doc_text = """CHRONOLOGY OF DISPUTE
On January 10, 2025, preliminary negotiations commenced between parties.
On March 15, 2025, Master Software Development Agreement was executed.
On August 10, 2025, Apex failed to deliver Phase 3 milestones.
On October 5, 2025, NovaTech delivered formal Notice of Default.
On November 20, 2025, Apex launched competing software module."""

    client.post(
        f"/api/v1/cases/{case_id}/documents",
        files={"file": ("Chronology_Exhibits.txt", io.BytesIO(doc_text.encode("utf-8")), "text/plain")},
        headers=headers,
    )

    timeline_res = client.post(f"/api/v1/cases/{case_id}/analysis/timeline", headers=headers)
    assert timeline_res.status_code == status.HTTP_200_OK
    timeline = timeline_res.json()

    assert timeline["total_events"] >= 4
    assert len(timeline["events"]) >= 4

    # Ensure events contain citations and dates
    assert any(e["citation"] and "Chronology_Exhibits.txt" in e["citation"]["document_name"] for e in timeline["events"])
    assert any(e["citation"] and "Matter Record" in e["citation"]["document_name"] for e in timeline["events"])



def test_full_analysis_and_cache(client: TestClient):
    """Test combined full analysis and cached retrieval endpoint."""
    token = register_user(client, "full_user@caseintel.com", "Harvey Specter")
    headers = {"Authorization": f"Bearer {token}"}
    case_id = create_sample_case(client, token)

    # Run full analysis
    full_res = client.post(f"/api/v1/cases/{case_id}/analysis/all", headers=headers)
    assert full_res.status_code == status.HTTP_200_OK
    full_data = full_res.json()

    assert "summary" in full_data
    assert "issues" in full_data
    assert "evidence" in full_data
    assert "timeline" in full_data

    # Fetch cached analysis (GET)
    get_res = client.get(f"/api/v1/cases/{case_id}/analysis", headers=headers)
    assert get_res.status_code == status.HTTP_200_OK
    cached_data = get_res.json()
    assert cached_data["case_id"] == case_id
    assert cached_data["summary"] is not None


def test_strict_user_isolation_on_analysis_and_documents(client: TestClient):
    """User B cannot view or analyze User A's case or documents."""
    user_a_token = register_user(client, "attorney_a@caseintel.com", "Attorney A")
    user_b_token = register_user(client, "attorney_b@caseintel.com", "Attorney B")

    headers_a = {"Authorization": f"Bearer {user_a_token}"}
    headers_b = {"Authorization": f"Bearer {user_b_token}"}

    case_a_id = create_sample_case(client, user_a_token)

    # User B attempts to upload document to User A's case -> 404
    up_res = client.post(
        f"/api/v1/cases/{case_a_id}/documents",
        files={"file": ("hack.txt", io.BytesIO(b"malicious"), "text/plain")},
        headers=headers_b,
    )
    assert up_res.status_code == status.HTTP_404_NOT_FOUND

    # User B attempts to run analysis on User A's case -> 404
    analysis_res = client.post(f"/api/v1/cases/{case_a_id}/analysis/summary", headers=headers_b)
    assert analysis_res.status_code == status.HTTP_404_NOT_FOUND
