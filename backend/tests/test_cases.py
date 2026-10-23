"""Automated tests for Case and Workspace Management (Module 3)."""

import pytest
from fastapi import status
from fastapi.testclient import TestClient


def register_user(client: TestClient, email: str, full_name: str, password: str = "SecurePass123!") -> str:
    """Helper to register a user and return the bearer access token."""
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": email,
            "name": full_name,
            "password": password,
            "confirm_password": password,
            "role": "lawyer",
        },
    )
    assert response.status_code == status.HTTP_201_CREATED, response.text
    return response.json()["access_token"]


def test_create_case_success(client: TestClient):
    """User can create a case workspace successfully."""
    token = register_user(client, "lawyer1@caseintel.com", "Attorney Alpha")
    headers = {"Authorization": f"Bearer {token}"}

    payload = {
        "title": "State v. Anderson",
        "case_number": "CR-2026-9021",
        "case_type": "criminal",
        "court": "Superior Court of California",
        "judge": "Hon. Sarah Connor",
        "parties": {"plaintiff": "State of California", "defendant": "John Anderson"},
        "description": "Criminal defense matter involving alleged securities violation.",
        "notes": "Discovery review scheduled for next week.",
    }

    response = client.post("/api/v1/cases", json=payload, headers=headers)
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()

    assert data["title"] == "State v. Anderson"
    assert data["case_number"] == "CR-2026-9021"
    assert data["case_type"] == "criminal"
    assert data["court"] == "Superior Court of California"
    assert data["status"] == "active"
    assert data["is_archived"] is False
    assert "id" in data
    assert "created_at" in data
    assert "updated_at" in data


def test_create_case_validation_failure(client: TestClient):
    """Creating a case with invalid or blank title returns 422."""
    token = register_user(client, "lawyer2@caseintel.com", "Attorney Beta")
    headers = {"Authorization": f"Bearer {token}"}

    # Blank title
    response = client.post("/api/v1/cases", json={"title": "   "}, headers=headers)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY

    # Missing title
    response = client.post("/api/v1/cases", json={"case_type": "civil"}, headers=headers)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY


def test_create_case_unauthenticated(client: TestClient):
    """Unauthenticated case creation is rejected with 401."""
    response = client.post("/api/v1/cases", json={"title": "Unauthorized Case"})
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


def test_case_strict_user_ownership_isolation(client: TestClient):
    """Verify that User B cannot view, modify, or delete User A's case."""
    user_a_token = register_user(client, "alice@caseintel.com", "Alice Counsel")
    user_b_token = register_user(client, "bob@caseintel.com", "Bob Defender")

    headers_a = {"Authorization": f"Bearer {user_a_token}"}
    headers_b = {"Authorization": f"Bearer {user_b_token}"}

    # User A creates a case
    create_res = client.post(
        "/api/v1/cases",
        json={"title": "Alice Confidential Case", "case_number": "A-101"},
        headers=headers_a,
    )
    assert create_res.status_code == status.HTTP_201_CREATED
    case_id = create_res.json()["id"]

    # User B attempts to fetch User A's case -> 404
    get_res = client.get(f"/api/v1/cases/{case_id}", headers=headers_b)
    assert get_res.status_code == status.HTTP_404_NOT_FOUND

    # User B attempts to update User A's case -> 404
    update_res = client.put(
        f"/api/v1/cases/{case_id}",
        json={"title": "Hacked Title"},
        headers=headers_b,
    )
    assert update_res.status_code == status.HTTP_404_NOT_FOUND

    # User B attempts to archive User A's case -> 404
    archive_res = client.patch(
        f"/api/v1/cases/{case_id}/archive?archive=true",
        headers=headers_b,
    )
    assert archive_res.status_code == status.HTTP_404_NOT_FOUND

    # User B attempts to delete User A's case -> 404
    delete_res = client.delete(f"/api/v1/cases/{case_id}", headers=headers_b)
    assert delete_res.status_code == status.HTTP_404_NOT_FOUND

    # User B lists cases -> User A's case should not appear
    list_res = client.get("/api/v1/cases", headers=headers_b)
    assert list_res.status_code == status.HTTP_200_OK
    assert list_res.json()["total"] == 0
    assert len(list_res.json()["items"]) == 0

    # User A can still retrieve the case untouched
    get_a_res = client.get(f"/api/v1/cases/{case_id}", headers=headers_a)
    assert get_a_res.status_code == status.HTTP_200_OK
    assert get_a_res.json()["title"] == "Alice Confidential Case"


def test_list_cases_pagination_and_search(client: TestClient):
    """User can list their cases with pagination, search, and category filter."""
    token = register_user(client, "partner@caseintel.com", "Managing Partner")
    headers = {"Authorization": f"Bearer {token}"}

    # Create 3 cases
    client.post(
        "/api/v1/cases",
        json={"title": "Acme Corp v. Beta Ltd", "case_number": "COM-01", "case_type": "commercial", "court": "Delaware Chancery"},
        headers=headers,
    )
    client.post(
        "/api/v1/cases",
        json={"title": "Smith v. Jones", "case_number": "CIV-02", "case_type": "civil", "court": "District Court"},
        headers=headers,
    )
    client.post(
        "/api/v1/cases",
        json={"title": "Acme Patent Infringement", "case_number": "IP-03", "case_type": "intellectual_property", "court": "Federal Court"},
        headers=headers,
    )

    # Test pagination (page_size = 2)
    p1_res = client.get("/api/v1/cases?page=1&page_size=2", headers=headers)
    assert p1_res.status_code == status.HTTP_200_OK
    p1_data = p1_res.json()
    assert p1_data["total"] == 3
    assert len(p1_data["items"]) == 2
    assert p1_data["page"] == 1

    p2_res = client.get("/api/v1/cases?page=2&page_size=2", headers=headers)
    assert p2_res.status_code == status.HTTP_200_OK
    p2_data = p2_res.json()
    assert len(p2_data["items"]) == 1

    # Test search by title / keyword "Acme"
    search_res = client.get("/api/v1/cases?search=Acme", headers=headers)
    assert search_res.status_code == status.HTTP_200_OK
    search_data = search_res.json()
    assert search_data["total"] == 2
    for item in search_data["items"]:
        assert "Acme" in item["title"]

    # Test filter by case_type "commercial"
    type_res = client.get("/api/v1/cases?case_type=commercial", headers=headers)
    assert type_res.status_code == status.HTTP_200_OK
    type_data = type_res.json()
    assert type_data["total"] == 1
    assert type_data["items"][0]["case_number"] == "COM-01"


def test_archive_and_unarchive_flow(client: TestClient):
    """Archived cases can be toggled and filtered out from default listings."""
    token = register_user(client, "archivist@caseintel.com", "Archivist User")
    headers = {"Authorization": f"Bearer {token}"}

    create_res = client.post(
        "/api/v1/cases",
        json={"title": "Matter To Archive", "case_number": "ARC-100"},
        headers=headers,
    )
    case_id = create_res.json()["id"]

    # Archive the case
    archive_res = client.patch(f"/api/v1/cases/{case_id}/archive?archive=true", headers=headers)
    assert archive_res.status_code == status.HTTP_200_OK
    assert archive_res.json()["is_archived"] is True
    assert archive_res.json()["status"] == "archived"

    # Default list excludes archived cases
    list_res = client.get("/api/v1/cases", headers=headers)
    assert list_res.json()["total"] == 0

    # List with include_archived=true includes it
    list_archived_res = client.get("/api/v1/cases?include_archived=true", headers=headers)
    assert list_archived_res.json()["total"] == 1

    # Unarchive the case
    unarchive_res = client.patch(f"/api/v1/cases/{case_id}/archive?archive=false", headers=headers)
    assert unarchive_res.status_code == status.HTTP_200_OK
    assert unarchive_res.json()["is_archived"] is False
    assert unarchive_res.json()["status"] == "active"

    # Now it appears in default list
    assert client.get("/api/v1/cases", headers=headers).json()["total"] == 1


def test_update_case(client: TestClient):
    """Case fields can be updated with partial data."""
    token = register_user(client, "editor@caseintel.com", "Editor Counsel")
    headers = {"Authorization": f"Bearer {token}"}

    create_res = client.post(
        "/api/v1/cases",
        json={"title": "Initial Title", "case_type": "civil"},
        headers=headers,
    )
    case_id = create_res.json()["id"]

    update_payload = {
        "title": "Updated Supreme Court Appeal",
        "case_number": "SC-999",
        "court": "Supreme Court",
        "judge": "Chief Justice",
        "notes": "Brief submitted.",
    }
    update_res = client.put(f"/api/v1/cases/{case_id}", json=update_payload, headers=headers)
    assert update_res.status_code == status.HTTP_200_OK
    data = update_res.json()
    assert data["title"] == "Updated Supreme Court Appeal"
    assert data["case_number"] == "SC-999"
    assert data["court"] == "Supreme Court"
    assert data["judge"] == "Chief Justice"
    assert data["notes"] == "Brief submitted."


def test_delete_case(client: TestClient):
    """Deleting a case removes it permanently."""
    token = register_user(client, "cleaner@caseintel.com", "Cleaner Attorney")
    headers = {"Authorization": f"Bearer {token}"}

    create_res = client.post(
        "/api/v1/cases",
        json={"title": "Case to Delete"},
        headers=headers,
    )
    case_id = create_res.json()["id"]

    del_res = client.delete(f"/api/v1/cases/{case_id}", headers=headers)
    assert del_res.status_code == status.HTTP_200_OK
    assert del_res.json()["success"] is True

    # Subsequent fetch should be 404
    get_res = client.get(f"/api/v1/cases/{case_id}", headers=headers)
    assert get_res.status_code == status.HTTP_404_NOT_FOUND


def test_case_statistics(client: TestClient):
    """Workspace stats return accurate aggregated counts."""
    token = register_user(client, "stats@caseintel.com", "Metrics Officer")
    headers = {"Authorization": f"Bearer {token}"}

    # Case 1: active
    client.post("/api/v1/cases", json={"title": "Active Case 1"}, headers=headers)
    # Case 2: active
    client.post("/api/v1/cases", json={"title": "Active Case 2"}, headers=headers)
    # Case 3: archived
    c3 = client.post("/api/v1/cases", json={"title": "Archived Case"}, headers=headers).json()
    client.patch(f"/api/v1/cases/{c3['id']}/archive?archive=true", headers=headers)

    stats_res = client.get("/api/v1/cases/stats", headers=headers)
    assert stats_res.status_code == status.HTTP_200_OK
    stats = stats_res.json()
    assert stats["total_cases"] == 3
    assert stats["active_cases"] == 2
    assert stats["archived_cases"] == 1
    assert stats["completed_cases"] == 0
