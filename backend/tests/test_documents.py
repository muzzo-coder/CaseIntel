"""Comprehensive automated tests for Legal Document Management (Module 4).

Validates file validation, magic byte checking, SHA-256 calculation,
path sanitization, text extraction, streaming downloads, user ownership isolation,
and document statistics.
"""

import io
import pytest
from fastapi.testclient import TestClient


def get_auth_headers(client: TestClient, email_prefix: str) -> dict:
    """Helper to create and log in a user, returning auth headers."""
    email = f"{email_prefix}@example.com"
    pwd = "SecurePassword123!"
    client.post(
        "/api/v1/auth/register",
        json={"name": f"User {email_prefix}", "email": email, "password": pwd, "confirm_password": pwd},
    )
    login_res = client.post("/api/v1/auth/login", json={"email": email, "password": pwd})
    token = login_res.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_upload_valid_text_document(client: TestClient):
    """Test uploading a valid text document to library without case_id."""
    headers = get_auth_headers(client, "doc_uploader")

    file_content = b"Legal Brief Summary:\nThe plaintiff alleges breach of contract under Section 4."
    file = io.BytesIO(file_content)

    res = client.post(
        "/api/v1/documents/upload",
        files={"file": ("Legal_Brief.txt", file, "text/plain")},
        headers=headers,
    )
    assert res.status_code == 201
    data = res.json()
    assert data["filename"] == "Legal_Brief.txt"
    assert data["original_filename"] == "Legal_Brief.txt"
    assert data["file_type"] == "txt"
    assert data["file_size"] == len(file_content)
    assert data["status"] == "processed"
    assert data["file_hash"] is not None
    assert len(data["file_hash"]) == 64  # SHA-256 hex string


def test_upload_valid_pdf_document(client: TestClient):
    """Test uploading a valid PDF document with %PDF magic bytes."""
    headers = get_auth_headers(client, "pdf_user")

    from pypdf import PdfWriter
    writer = PdfWriter()
    writer.add_blank_page(width=612, height=792)
    buf = io.BytesIO()
    writer.write(buf)
    pdf_content = buf.getvalue()


    res = client.post(
        "/api/v1/documents/upload",
        files={"file": ("Court_Order.pdf", io.BytesIO(pdf_content), "application/pdf")},
        headers=headers,
    )
    assert res.status_code == 201
    data = res.json()
    assert data["file_type"] == "pdf"
    assert data["status"] == "processed"
    assert data["page_count"] >= 1


def test_upload_empty_file_rejected(client: TestClient):
    """0-byte files must be rejected with 400 EMPTY_FILE."""
    headers = get_auth_headers(client, "empty_test")

    res = client.post(
        "/api/v1/documents/upload",
        files={"file": ("empty.pdf", io.BytesIO(b""), "application/pdf")},
        headers=headers,
    )
    assert res.status_code == 400
    data = res.json()
    assert data["error"]["code"] == "EMPTY_FILE"


def test_disguised_pdf_fails_magic_byte_check(client: TestClient):
    """Executable content masquerading as PDF must be rejected with 400 INVALID_FILE_CONTENT."""
    headers = get_auth_headers(client, "disguised_test")

    fake_pdf = b"MZ\x90\x00\x03\x00\x00\x00BinaryExecutableContent"
    res = client.post(
        "/api/v1/documents/upload",
        files={"file": ("malicious.pdf", io.BytesIO(fake_pdf), "application/pdf")},
        headers=headers,
    )
    assert res.status_code == 400
    data = res.json()
    assert data["error"]["code"] == "INVALID_FILE_CONTENT"


def test_unsupported_file_extension_rejected(client: TestClient):
    """Files with non-allowed extensions (e.g. .exe) must be rejected with 400 UNSUPPORTED_FILE_TYPE."""
    headers = get_auth_headers(client, "unsupported_test")

    res = client.post(
        "/api/v1/documents/upload",
        files={"file": ("installer.exe", io.BytesIO(b"MZ12345"), "application/x-msdownload")},
        headers=headers,
    )
    assert res.status_code == 400
    data = res.json()
    assert data["error"]["code"] == "UNSUPPORTED_FILE_TYPE"


def test_path_traversal_filename_sanitized(client: TestClient):
    """Directory traversal attack filenames must be safely sanitized."""
    headers = get_auth_headers(client, "traversal_user")

    traversal_name = "../../../etc/passwd.txt"
    res = client.post(
        "/api/v1/documents/upload",
        files={"file": (traversal_name, io.BytesIO(b"Safe content here"), "text/plain")},
        headers=headers,
    )
    assert res.status_code == 201
    data = res.json()
    assert "/" not in data["filename"]
    assert "\\" not in data["filename"]
    assert "passwd.txt" in data["filename"]


def test_list_documents_pagination_and_filtering(client: TestClient):
    """Test paginated document listing with filters by status and file_type."""
    headers = get_auth_headers(client, "filter_user")

    # Upload 3 documents
    for i in range(3):
        client.post(
            "/api/v1/documents/upload",
            files={"file": (f"Doc_{i}.txt", io.BytesIO(f"Document content {i}".encode("utf-8")), "text/plain")},
            headers=headers,
        )

    # 1. Total listing
    res = client.get("/api/v1/documents?page=1&page_size=2", headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert data["total"] == 3
    assert len(data["items"]) == 2
    assert data["page"] == 1
    assert data["page_size"] == 2

    # 2. Search query filter
    res_search = client.get("/api/v1/documents?search=Doc_1", headers=headers)
    assert res_search.status_code == 200
    search_data = res_search.json()
    assert search_data["total"] == 1
    assert search_data["items"][0]["original_filename"] == "Doc_1.txt"

    # 3. Status filter
    res_status = client.get("/api/v1/documents?status=processed", headers=headers)
    assert res_status.status_code == 200
    assert res_status.json()["total"] == 3


def test_get_document_detail_and_extracted_text(client: TestClient):
    """Test retrieving document detail including extracted text."""
    headers = get_auth_headers(client, "detail_user")

    secret_text = "CONFIDENTIAL: Client agrees to settlement terms of $500,000."
    upload_res = client.post(
        "/api/v1/documents/upload",
        files={"file": ("Settlement.txt", io.BytesIO(secret_text.encode("utf-8")), "text/plain")},
        headers=headers,
    )
    doc_id = upload_res.json()["id"]

    res = client.get(f"/api/v1/documents/{doc_id}", headers=headers)
    assert res.status_code == 200
    detail = res.json()
    assert detail["id"] == doc_id
    assert secret_text in detail["extracted_text"]


def test_download_document_streaming(client: TestClient):
    """Test streaming document download with Content-Disposition header."""
    headers = get_auth_headers(client, "downloader")

    original_bytes = b"This is the authentic download test file content."
    upload_res = client.post(
        "/api/v1/documents/upload",
        files={"file": ("DownloadTest.txt", io.BytesIO(original_bytes), "text/plain")},
        headers=headers,
    )
    doc_id = upload_res.json()["id"]

    download_res = client.get(f"/api/v1/documents/{doc_id}/download", headers=headers)
    assert download_res.status_code == 200
    assert download_res.content == original_bytes
    assert 'attachment; filename="DownloadTest.txt"' in download_res.headers.get("content-disposition", "")


def test_user_ownership_isolation(client: TestClient):
    """User B cannot fetch, download, or delete User A's document."""
    headers_a = get_auth_headers(client, "user_a_doc")
    headers_b = get_auth_headers(client, "user_b_doc")

    # User A uploads document
    upload_res = client.post(
        "/api/v1/documents/upload",
        files={"file": ("UserA_Secret.txt", io.BytesIO(b"User A proprietary evidence"), "text/plain")},
        headers=headers_a,
    )
    doc_id = upload_res.json()["id"]

    # User B attempts to read User A's document
    res_b_get = client.get(f"/api/v1/documents/{doc_id}", headers=headers_b)
    assert res_b_get.status_code == 404

    # User B attempts to download User A's document
    res_b_dl = client.get(f"/api/v1/documents/{doc_id}/download", headers=headers_b)
    assert res_b_dl.status_code == 404

    # User B attempts to delete User A's document
    res_b_del = client.delete(f"/api/v1/documents/{doc_id}", headers=headers_b)
    assert res_b_del.status_code == 404

    # Document still exists and is accessible by User A
    assert client.get(f"/api/v1/documents/{doc_id}", headers=headers_a).status_code == 200


def test_document_statistics(client: TestClient):
    """Test aggregate document stats endpoint for user."""
    headers = get_auth_headers(client, "stats_user")

    # Initial stats should be 0
    res_init = client.get("/api/v1/documents/stats", headers=headers)
    assert res_init.status_code == 200
    data_init = res_init.json()
    assert data_init["total_documents"] == 0
    assert data_init["total_storage_bytes"] == 0

    # Upload 2 documents
    content_1 = b"Short text file"
    content_2 = b"Another legal memorandum document for stats testing."
    client.post(
        "/api/v1/documents/upload",
        files={"file": ("Stats1.txt", io.BytesIO(content_1), "text/plain")},
        headers=headers,
    )
    client.post(
        "/api/v1/documents/upload",
        files={"file": ("Stats2.txt", io.BytesIO(content_2), "text/plain")},
        headers=headers,
    )

    res_updated = client.get("/api/v1/documents/stats", headers=headers)
    assert res_updated.status_code == 200
    data_up = res_updated.json()
    assert data_up["total_documents"] == 2
    assert data_up["processed_documents"] == 2
    assert data_up["total_storage_bytes"] == len(content_1) + len(content_2)


def test_delete_document_success(client: TestClient):
    """Test permanent deletion of document and underlying file."""
    headers = get_auth_headers(client, "delete_user")

    upload_res = client.post(
        "/api/v1/documents/upload",
        files={"file": ("ToDelete.txt", io.BytesIO(b"Will be deleted"), "text/plain")},
        headers=headers,
    )
    doc_id = upload_res.json()["id"]

    # Delete
    del_res = client.delete(f"/api/v1/documents/{doc_id}", headers=headers)
    assert del_res.status_code == 200
    assert del_res.json()["success"] is True

    # Check 404 on subsequent get
    get_res = client.get(f"/api/v1/documents/{doc_id}", headers=headers)
    assert get_res.status_code == 404
