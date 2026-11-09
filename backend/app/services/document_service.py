"""Document service handling file upload, content validation, text extraction, safe storage, and retrieval."""

import hashlib
import logging
import os
import re
import shutil
import uuid
from pathlib import Path
from typing import List, Optional, Tuple
from fastapi import UploadFile
from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session
from app.core.config import settings
from app.core.errors import AppException, NotFoundException
from app.models.case import Case
from app.models.document import Document, DocumentStatus
from app.models.user import User
from app.schemas.document import DocumentStatistics
from app.services.case_service import get_case_by_id

logger = logging.getLogger("caseintel.services.document")

ALLOWED_EXTENSIONS = {".pdf", ".docx", ".doc", ".txt", ".md", ".rtf"}
MIME_MAP = {
    ".pdf": "application/pdf",
    ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ".doc": "application/msword",
    ".txt": "text/plain",
    ".md": "text/markdown",
    ".rtf": "application/rtf",
}


def get_upload_dir() -> Path:
    """Ensure and return the base upload directory."""
    base_dir = Path(settings.UPLOAD_DIR)
    if not base_dir.is_absolute():
        base_dir = Path(__file__).resolve().parent.parent.parent / settings.UPLOAD_DIR
    base_dir.mkdir(parents=True, exist_ok=True)
    return base_dir


def sanitize_filename(filename: str) -> str:
    """Sanitize filename to prevent directory traversal or shell injection attacks."""
    # Strip path components and null bytes
    clean = os.path.basename(filename.replace("\\", "/")).replace("\0", "").strip()
    # Remove any dangerous characters, keep alphanumerics, dots, hyphens, underscores, spaces
    clean = re.sub(r"[^\w\s\.-]", "_", clean)
    if not clean or clean.startswith("."):
        clean = f"document_{uuid.uuid4().hex[:8]}" + Path(filename).suffix.lower()
    return clean[:200]


def validate_file_content(file_bytes: bytes, ext: str) -> None:
    """Inspect magic bytes and content integrity to prevent disguised files."""
    if len(file_bytes) == 0:
        raise AppException(
            message="Uploaded file is empty (0 bytes). Please upload a valid document.",
            status_code=400,
            error_code="EMPTY_FILE",
            details=[{"field": "file", "message": "File cannot be empty."}],
        )

    # Magic byte verification
    if ext == ".pdf":
        if not file_bytes.startswith(b"%PDF"):
            raise AppException(
                message="Invalid PDF file. The file content does not match the PDF standard header.",
                status_code=400,
                error_code="INVALID_FILE_CONTENT",
                details=[{"field": "file", "message": "File must start with standard %PDF signature."}],
            )
    elif ext == ".docx":
        # DOCX is an OpenXML ZIP archive starting with PK\x03\x04
        if not file_bytes.startswith(b"PK\x03\x04"):
            raise AppException(
                message="Invalid DOCX file. The file content is not a valid OpenXML Word document.",
                status_code=400,
                error_code="INVALID_FILE_CONTENT",
                details=[{"field": "file", "message": "DOCX file must be a valid zip package."}],
            )
    elif ext == ".doc":
        # Legacy binary Word doc
        if not file_bytes.startswith(b"\xd0\xcf\x11\xe0\xa1\xb1\x1a\xe1"):
            raise AppException(
                message="Invalid DOC file. The file content does not match binary Word document format.",
                status_code=400,
                error_code="INVALID_FILE_CONTENT",
            )
    elif ext in [".txt", ".md"]:
        # Verify text file does not contain excessive binary null bytes
        null_count = file_bytes.count(b"\x00")
        if null_count > 10:
            raise AppException(
                message="Invalid text document. Binary content detected.",
                status_code=400,
                error_code="INVALID_FILE_CONTENT",
            )


def calculate_sha256(file_bytes: bytes) -> str:
    """Calculate SHA-256 checksum for document verification and deduplication."""
    return hashlib.sha256(file_bytes).hexdigest()


def extract_text_from_file(file_path: Path, ext: str) -> Tuple[str, int]:
    """Extract readable text and calculate page count from supported document formats."""
    text_parts: List[str] = []
    page_count = 1

    try:
        if ext == ".pdf":
            from pypdf import PdfReader
            reader = PdfReader(str(file_path))
            page_count = max(len(reader.pages), 1)
            for idx, page in enumerate(reader.pages):
                extracted = page.extract_text()
                if extracted:
                    text_parts.append(f"[Page {idx + 1}]\n{extracted.strip()}")

        elif ext == ".docx":
            import docx
            doc = docx.Document(str(file_path))
            paragraphs = [p.text.strip() for p in doc.paragraphs if p.text.strip()]
            for table in doc.tables:
                for row in table.rows:
                    row_text = " | ".join(cell.text.strip() for cell in row.cells if cell.text.strip())
                    if row_text:
                        paragraphs.append(row_text)
            text_parts = paragraphs
            total_words = sum(len(p.split()) for p in paragraphs)
            page_count = max(1, (total_words // 400) + 1)

        else:  # Text, Markdown, plain files
            try:
                content = file_path.read_text(encoding="utf-8")
            except UnicodeDecodeError:
                content = file_path.read_text(encoding="latin-1", errors="replace")
            text_parts = [content.strip()]
            total_words = len(content.split())
            page_count = max(1, (total_words // 400) + 1)

    except Exception as e:
        logger.error(f"Text extraction failed for {file_path.name}: {e}")
        return f"[Text extraction failed: {str(e)}]", 1

    extracted_text = "\n\n".join(text_parts).strip()
    return extracted_text, page_count


def upload_document(
    db: Session,
    user: User,
    upload_file: UploadFile,
    case_id: Optional[str] = None,
) -> Document:
    """Validate, store, extract text, and register a new document for user library or case workspace."""
    # If case_id is specified, verify case ownership
    case = None
    if case_id:
        case = get_case_by_id(db, case_id, user)

    raw_filename = upload_file.filename or "uploaded_document.txt"
    ext = Path(raw_filename).suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise AppException(
            message=f"Unsupported file format '{ext}'. Allowed: {', '.join(sorted(ALLOWED_EXTENSIONS))}",
            status_code=400,
            error_code="UNSUPPORTED_FILE_TYPE",
            details=[{"field": "file", "message": f"Must be one of {sorted(ALLOWED_EXTENSIONS)}"}],
        )

    # Read file bytes to validate size, content, and calculate checksum
    upload_file.file.seek(0)
    file_bytes = upload_file.file.read()
    file_size = len(file_bytes)

    # Validate size limits
    max_bytes = settings.MAX_FILE_SIZE_MB * 1024 * 1024
    if file_size > max_bytes:
        raise AppException(
            message=f"File exceeds maximum allowed size of {settings.MAX_FILE_SIZE_MB}MB.",
            status_code=400,
            error_code="FILE_TOO_LARGE",
            details=[{"field": "file", "message": f"Max size is {settings.MAX_FILE_SIZE_MB}MB."}],
        )

    # Validate content and magic bytes
    validate_file_content(file_bytes, ext)

    # Calculate sha256 checksum
    file_hash = calculate_sha256(file_bytes)

    # Generate isolated storage path
    doc_id = str(uuid.uuid4())
    safe_name = sanitize_filename(raw_filename)

    if case:
        target_dir = get_upload_dir() / "users" / user.id / "cases" / case.id
    else:
        target_dir = get_upload_dir() / "users" / user.id / "library"

    target_dir.mkdir(parents=True, exist_ok=True)
    stored_filename = f"{doc_id}_{safe_name}"
    dest_path = target_dir / stored_filename

    # Save to disk
    dest_path.write_bytes(file_bytes)

    # Extract text content and calculate page count
    extracted_text, page_count = extract_text_from_file(dest_path, ext)
    is_failed = extracted_text.startswith("[Text extraction failed:")

    document = Document(
        id=doc_id,
        case_id=case.id if case else None,
        user_id=user.id,
        filename=safe_name,
        original_filename=raw_filename,
        file_path=str(dest_path),
        file_size=file_size,
        file_hash=file_hash,
        mime_type=MIME_MAP.get(ext, upload_file.content_type or "application/octet-stream"),
        file_type=ext.lstrip("."),
        extracted_text=extracted_text,
        page_count=page_count,
        status=DocumentStatus.FAILED.value if is_failed else DocumentStatus.PROCESSED.value,
        error_message=extracted_text if is_failed else None,
    )
    db.add(document)
    db.commit()
    db.refresh(document)

    logger.info(
        f"Uploaded document ID={doc_id} ('{safe_name}', size={file_size}B) for user ID={user.id}"
        + (f" on case ID={case.id}" if case else " (Library)")
    )
    return document


def get_user_documents(
    db: Session,
    user: User,
    page: int = 1,
    page_size: int = 20,
    search: Optional[str] = None,
    status_filter: Optional[str] = None,
    file_type: Optional[str] = None,
    case_id: Optional[str] = None,
) -> Tuple[List[Document], int]:
    """Retrieve paginated documents strictly owned by user with filters and search."""
    conditions = [Document.user_id == user.id]

    if case_id:
        conditions.append(Document.case_id == case_id)

    if status_filter:
        conditions.append(Document.status == status_filter)

    if file_type:
        conditions.append(Document.file_type == file_type.lower().strip("."))

    if search:
        search_pattern = f"%{search.strip().lower()}%"
        conditions.append(
            or_(
                func.lower(Document.filename).like(search_pattern),
                func.lower(Document.original_filename).like(search_pattern),
            )
        )

    # Count total
    count_stmt = select(func.count()).select_from(Document).where(*conditions)
    total = db.scalar(count_stmt) or 0

    # Paginate
    offset = (max(page, 1) - 1) * page_size
    query_stmt = (
        select(Document)
        .where(*conditions)
        .order_by(Document.created_at.desc())
        .offset(offset)
        .limit(page_size)
    )
    items = list(db.scalars(query_stmt).all())

    return items, total


def get_document_by_id(db: Session, user: User, document_id: str) -> Document:
    """Retrieve a single document owned by user."""
    stmt = select(Document).where(Document.id == document_id, Document.user_id == user.id)
    doc = db.scalars(stmt).first()
    if not doc:
        logger.warning(f"Document lookup failed for ID={document_id} by user ID={user.id}")
        raise NotFoundException(message=f"Document with ID '{document_id}' was not found.")
    return doc


def get_document_download(db: Session, user: User, document_id: str) -> Tuple[Path, str, str]:
    """Verify document ownership and return file path, download filename, and MIME type."""
    doc = get_document_by_id(db, user, document_id)
    file_path = Path(doc.file_path)
    if not file_path.exists():
        raise NotFoundException(message=f"The underlying file for document '{doc.filename}' could not be located on disk.")
    return file_path, doc.original_filename or doc.filename, doc.mime_type


def get_document_statistics(db: Session, user: User) -> DocumentStatistics:
    """Calculate aggregate document metrics for authenticated user."""
    total_docs = db.scalar(
        select(func.count()).select_from(Document).where(Document.user_id == user.id)
    ) or 0

    processed_docs = db.scalar(
        select(func.count()).select_from(Document).where(
            Document.user_id == user.id, Document.status == DocumentStatus.PROCESSED.value
        )
    ) or 0

    processing_docs = db.scalar(
        select(func.count()).select_from(Document).where(
            Document.user_id == user.id, Document.status.in_([DocumentStatus.PENDING.value, DocumentStatus.PROCESSING.value])
        )
    ) or 0

    failed_docs = db.scalar(
        select(func.count()).select_from(Document).where(
            Document.user_id == user.id, Document.status == DocumentStatus.FAILED.value
        )
    ) or 0

    total_bytes = db.scalar(
        select(func.coalesce(func.sum(Document.file_size), 0)).where(Document.user_id == user.id)
    ) or 0

    return DocumentStatistics(
        total_documents=total_docs,
        processed_documents=processed_docs,
        processing_documents=processing_docs,
        failed_documents=failed_docs,
        total_storage_bytes=total_bytes,
    )


def delete_document(db: Session, user: User, document_id: str) -> None:
    """Permanently delete a document file from storage and database record."""
    doc = get_document_by_id(db, user, document_id)

    # Safe deletion from storage
    file_path = Path(doc.file_path)
    if file_path.exists():
        try:
            file_path.unlink()
        except Exception as e:
            logger.warning(f"Failed to delete file from disk {doc.file_path}: {e}")

    db.delete(doc)
    db.commit()
    logger.info(f"Deleted document ID={document_id} ('{doc.filename}') by user ID={user.id}")


# Backward-compatible wrapper for case-specific upload
def upload_case_document(
    db: Session,
    user: User,
    case_id: str,
    upload_file: UploadFile,
) -> Document:
    """Case-specific wrapper delegating to upload_document."""
    return upload_document(db=db, user=user, upload_file=upload_file, case_id=case_id)


def get_case_documents(db: Session, user: User, case_id: str) -> List[Document]:
    """Retrieve all documents belonging to a case workspace."""
    docs, _ = get_user_documents(db=db, user=user, case_id=case_id, page_size=100)
    return docs
