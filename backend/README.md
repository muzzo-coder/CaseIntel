# CaseIntel Backend - Architecture & Modules Documentation

CaseIntel is a modular, AI-powered legal document intelligence platform. This directory (`backend/`) contains the production-oriented FastAPI backend.

---

## 1. Completed Modules

### Module 1: Foundation, Health & Deployment
- **FastAPI Core Framework**: Production application factory, lifespan management, and clean routing.
- **Explicit Environment Configuration**: Managed with `pydantic-settings` to guarantee strict validation, type safety, and zero unhandled secret leaks.
- **CORS Configuration**: Pre-configured to support the CaseIntel React + Vite frontend (`http://localhost:5173`, `http://127.0.0.1:5173`).
- **Structured Logging**: Contextual structured logging supporting human-readable colorized console logs in development and JSON logs in production with automated redaction of sensitive credentials.
- **Global Error Handling**: Standardized JSON error response envelope (`success: false`, `error: {code, message, details}`) for all HTTP errors, validation failures (422), and unhandled server errors (500) that prevents internal traceback leakage.
- **Relational Database Foundation**: SQLAlchemy 2.0 connection engine with connection pooling and Alembic migration tracking. Compatible with PostgreSQL (production) and SQLite (testing/local development).
- **Comprehensive Health Checks**: Root liveness (`/healthz`) and readiness (`/readyz`) probes for container orchestrators (Kubernetes / Docker Compose), plus detailed system diagnostic endpoint (`/api/v1/health/health`).

### Module 2: Authentication & Authorization
- **User Registration (`POST /api/v1/auth/register`)**: Strong input validation, duplicate email protection (HTTP 409), and auto-login token return.
- **User Sign In (`POST /api/v1/auth/login`)**: Supports both standard JSON payloads and OAuth2 form specifications (`/login/form`) for Swagger UI integration.
- **Secure Password Hashing**: Industry-standard `bcrypt` algorithm with automated per-user salting and timing-attack resistant verification.
- **JWT Authentication**: Signed JWT Bearer access tokens with configurable expiration and role claims (`sub`, `role`, `exp`, `iat`).
- **Current User Context (`GET /api/v1/auth/me`)**: Protected endpoint verifying token integrity, expiration, revocation status, and active user flag.
- **Profile Updates (`PUT /api/v1/auth/me`)**: Validated personal profile management (full name, contact phone).
- **Password Management (`POST /api/v1/auth/change-password`)**: Validates current password before applying new credentials.
- **Password Reset (`POST /api/v1/auth/forgot-password`, `POST /api/v1/auth/reset-password`)**: Secure time-limited tokens with timing-attack and user-enumeration protection.
- **Email Verification (`POST /api/v1/auth/verify-email`, `POST /api/v1/auth/resend-verification`)**: Cryptographic email verification tokens with SMTP delivery and development logging fallback.
- **Token Revocation & Logout (`POST /api/v1/auth/logout`)**: Server-side token blacklisting ensuring logged-out tokens are immediately rendered invalid.
- **Role-Based Access Control (RBAC)**: Reusable FastAPI dependency factory `require_roles("admin", "lawyer", ...)` supporting roles: `lawyer`, `student`, `intern`, `researcher`, `admin`.
- **Frontend Integration**: Complete React + Vite integration via [src/services/api.js](file:///Users/apple/Documents/Projects/Caseintel/src/services/api.js) connecting `Register`, `Login` (with Forgot Password modal), `ProtectedRoute`, `Sidebar` (with dynamic user profile & logout), `Topbar`, `Profile` (with edit mode), and `Settings` (with Change Password modal).
- **Database Migrations**: Alembic migrations `be45f4b09518_create_users_and_revoked_tokens.py` and `136ae49da8fa_add_is_verified_to_users.py`.

### Module 3: Case & Workspace Management
- **Case Workspaces (`Case` model)**: Complete legal matter modeling with user foreign key relationship, cascade deletion, docket number, matter category, court jurisdiction, presiding judge, parties involved, description, and strategy notes.
- **Strict User Ownership Isolation**: Every query (`list`, `get`, `update`, `archive`, `delete`) filters explicitly by `user_id == current_user.id`. Any unauthorized access attempt returns HTTP 404, preventing information leakage.
- **Case Creation (`POST /api/v1/cases`)**: Validated matter creation with title sanitization, matter category normalization, and automatic default status assignment (`active`).
- **Paginated Listing & Filters (`GET /api/v1/cases`)**: High-performance paginated listing supporting `page`, `page_size`, full-text case search across title/court/docket number, category filter (`case_type`), status filter, and archived filtering.
- **Aggregated Case Metrics (`GET /api/v1/cases/stats`)**: Workspace statistics returning live counts for total cases, active matters, completed analyses, and archived cases.
- **Detailed Case Retrieval (`GET /api/v1/cases/{case_id}`)**: Single matter retrieval with ownership verification.
- **Case Update (`PUT /api/v1/cases/{case_id}`)**: Selective partial updating of matter metadata, court, judge, parties, and notes.
- **Archiving & Restoration (`PATCH /api/v1/cases/{case_id}/archive`)**: Soft-archiving toggle allowing clean workspace organization without data loss.
- **Permanent Safe Deletion (`DELETE /api/v1/cases/{case_id}`)**: Hard deletion of case workspaces with user verification.
- **Database Migrations**: Alembic migration `26830d465f4f_create_cases_table.py`.

### AI-Powered Case Analysis Features & Document Pipeline
- **Document Management (`Document` model)**: Supports uploading and parsing `.pdf` (via `pypdf`), `.docx` (via `python-docx`), `.txt`, `.md`, and `.rtf` with automated page counting and text extraction.
- **1. Case Summary (`POST /api/v1/cases/{case_id}/analysis/summary`)**: Generates structured factual summaries containing key established facts, parties with roles/representation, legal causes of action with remedies sought, procedural posture, and traceable source citations.
- **2. Issue Identification (`POST /api/v1/cases/{case_id}/analysis/issues`)**: Identifies core legal controversies categorized by type and priority (`high`, `medium`, `low`), contested factual claims comparing party positions, and critical legal questions for judicial determination.
- **3. Evidence Analysis (`POST /api/v1/cases/{case_id}/analysis/evidence`)**: Catalogs discovered evidence with relevance weights, maps exhibits to specific legal issues, and categorizes favorable points vs. conflicting/adverse points with verbatim citations.
- **4. Timeline Analysis (`POST /api/v1/cases/{case_id}/analysis/timeline`)**: Extracts chronological dates and events from case materials, identifies involved actors, ranks significance, and links every occurrence to its originating document citation.
- **Persistent Caching (`GET /api/v1/cases/{case_id}/analysis`)**: `case_analyses` table caches results for fast repeated lookups.
- **Full Frontend Workspace Integration**: [src/pages/CaseAnalysis.jsx](file:///Users/apple/Documents/Projects/Caseintel/src/pages/CaseAnalysis.jsx) includes a dedicated case workspace view with document upload drawer, interactive 4-tab analysis studio, visual chronological event timeline, and traceable citation cards.
- **Database Migrations**: Alembic migration `bb126a9ee56a_create_documents_and_analysis_tables.py`.


---

## 2. Directory Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                  # FastAPI application entrypoint & lifespan
│   ├── api/
│   │   ├── __init__.py
│   │   ├── deps.py              # Shared dependencies (db, get_current_user, require_roles)
│   │   └── v1/
│   │       ├── __init__.py
│   │       ├── router.py        # Master v1 API router
│   │       └── endpoints/
│   │           ├── __init__.py
│   │           ├── auth.py      # Registration, login, profile, password, logout
│   │           ├── cases.py     # Case CRUD, search, pagination, archive, stats
│   │           └── health.py    # Health, readiness, and ping endpoints
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py            # Pydantic Settings & environment validation
│   │   ├── errors.py            # Custom exceptions & global exception handlers
│   │   ├── logging.py           # Structured logging & redaction
│   │   └── security.py          # Bcrypt hashing & JWT encoding/decoding
│   ├── db/
│   │   ├── __init__.py
│   │   ├── base.py              # SQLAlchemy 2.0 DeclarativeBase & mixins
│   │   └── session.py           # Engine, connection pooling, & DB health check
│   ├── models/
│   │   ├── __init__.py
│   │   ├── case.py              # Case, CaseStatus, CaseType database models
│   │   └── user.py              # User and RevokedToken database models
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── auth.py              # Pydantic models for auth requests/responses
│   │   ├── case.py              # Case create, update, response, list, stats schemas
│   │   ├── common.py            # Standard response envelopes & error schemas
│   │   └── health.py            # Pydantic schemas for health/readiness
│   └── services/
│       ├── __init__.py
│       ├── case_service.py      # Business logic for cases, search, ownership, stats
│       ├── email_service.py     # Live SMTP & development email dispatcher
│       └── user_service.py      # Business logic for users, auth, & token revocation
├── tests/
│   ├── __init__.py
│   ├── conftest.py              # Pytest fixtures & test database lifecycle
│   ├── test_auth.py             # 22 tests covering registration, login, JWT, RBAC, verification
│   ├── test_cases.py            # 9 tests covering case CRUD, ownership, search, archive, stats
│   ├── test_config.py           # Settings validation & CORS parsing tests
│   ├── test_cors.py             # CORS preflight & origin restriction tests
│   ├── test_errors.py           # 404, 422, 500 error sanitization tests
│   └── test_health.py           # Liveness, readiness, and diagnostics tests
├── alembic/
│   ├── env.py                   # Alembic environment integration
│   ├── script.py.mako           # Migration template
│   └── versions/
│       ├── be45f4b09518_create_users_and_revoked_tokens.py
│       ├── 136ae49da8fa_add_is_verified_to_users.py
│       └── 26830d465f4f_create_cases_table.py
├── alembic.ini                  # Alembic CLI configuration
├── .env.example                 # Documented environment variables template
├── Dockerfile                   # Production container definition
├── docker-compose.yml           # Multi-service stack (backend + PostgreSQL)
├── pyproject.toml               # Project metadata and pytest configuration
├── requirements.txt             # Pinned backend dependencies
└── README.md                    # This documentation file
```

---

## 3. Implemented Endpoints

### System & Health Endpoints
| Method | Endpoint | Description | Status Codes |
|---|---|---|---|
| `GET` | `/` | Root API metadata & documentation pointer | `200` |
| `GET` | `/healthz` | Container liveness probe | `200` |
| `GET` | `/readyz` | Readiness probe (verifies database) | `200`, `503` |
| `GET` | `/api/v1/health/health` | Comprehensive system diagnostics | `200`, `503` |
| `GET` | `/api/v1/health/ping` | Low-latency ping test | `200` |

### Authentication & User Endpoints
| Method | Endpoint | Description | Auth Required | Status Codes |
|---|---|---|---|---|
| `POST` | `/api/v1/auth/register` | Register new user account | No | `201`, `409`, `422` |
| `POST` | `/api/v1/auth/login` | Sign in with email and password (JSON) | No | `200`, `401`, `422` |
| `POST` | `/api/v1/auth/login/form` | OAuth2 password specification login (Swagger) | No | `200`, `401`, `422` |
| `GET` | `/api/v1/auth/me` | Fetch authenticated user profile | Yes (Bearer) | `200`, `401`, `403` |
| `PUT` | `/api/v1/auth/me` | Update name and phone number | Yes (Bearer) | `200`, `401`, `422` |
| `POST` | `/api/v1/auth/change-password` | Change account password | Yes (Bearer) | `200`, `400`, `401`, `422` |
| `POST` | `/api/v1/auth/forgot-password` | Request password reset email | No | `200`, `422` |
| `POST` | `/api/v1/auth/reset-password` | Reset password using reset token | No | `200`, `400`, `422` |
| `POST` | `/api/v1/auth/verify-email` | Verify account email address | No | `200`, `400`, `422` |
| `POST` | `/api/v1/auth/resend-verification` | Resend verification email | Yes (Bearer) | `200`, `400` |
| `POST` | `/api/v1/auth/logout` | Revoke session and blacklist current token | Yes (Bearer) | `200`, `401` |

### Case & Workspace Management Endpoints (Module 3)
| Method | Endpoint | Description | Auth Required | Status Codes |
|---|---|---|---|---|
| `POST` | `/api/v1/cases` | Create a new case workspace owned by current user | Yes (Bearer) | `201`, `401`, `422` |
| `GET` | `/api/v1/cases` | List user's cases with pagination, search, category & archive filters | Yes (Bearer) | `200`, `401` |
| `GET` | `/api/v1/cases/stats` | Aggregated case statistics (total, active, completed, archived) | Yes (Bearer) | `200`, `401` |
| `GET` | `/api/v1/cases/{case_id}` | Retrieve single case details (strict ownership check) | Yes (Bearer) | `200`, `401`, `404` |
| `PUT` | `/api/v1/cases/{case_id}` | Update case matter metadata and notes | Yes (Bearer) | `200`, `401`, `404`, `422` |
| `PATCH`| `/api/v1/cases/{case_id}/archive` | Soft-archive or restore a case | Yes (Bearer) | `200`, `401`, `404` |
| `DELETE`| `/api/v1/cases/{case_id}` | Permanently delete a case workspace | Yes (Bearer) | `200`, `401`, `404` |

---

## 4. Example Requests & Responses

### Registration (`POST /api/v1/auth/register`)
**Request:**
```json
{
  "name": "Sidra Shaikh",
  "email": "sidra@legaltech.io",
  "password": "SecurePassword123!",
  "confirm_password": "SecurePassword123!",
  "role": "lawyer",
  "phone": "+91 98765 43210"
}
```

**Response (`201 Created`):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6...",
  "token_type": "bearer",
  "expires_in": 86400,
  "user": {
    "id": "e8e5efc3-a3b4-4b57-a36c-2f9547ea8d69",
    "email": "sidra@legaltech.io",
    "full_name": "Sidra Shaikh",
    "role": "lawyer",
    "phone": "+91 98765 43210",
    "is_active": true,
    "created_at": "2026-10-24T00:15:30.123456Z"
  }
}
```

### Current User Profile (`GET /api/v1/auth/me`)
**Header:** `Authorization: Bearer <token>`

**Response (`200 OK`):**
```json
{
  "id": "e8e5efc3-a3b4-4b57-a36c-2f9547ea8d69",
  "email": "sidra@legaltech.io",
  "full_name": "Sidra Shaikh",
  "role": "lawyer",
  "phone": "+91 98765 43210",
  "is_active": true,
  "created_at": "2026-10-24T00:15:30.123456Z"
}
```

---

## 5. Environment Variables

Create `.env` inside `backend/` by copying `.env.example`:

```bash
cp .env.example .env
```

| Variable | Type | Default | Description |
|---|---|---|---|
| `ENVIRONMENT` | String | `development` | `development`, `staging`, `production`, `testing` |
| `DEBUG` | Boolean | `False` | Enables Swagger docs (must be `False` in production) |
| `PROJECT_NAME` | String | `"CaseIntel API"` | Application display name |
| `VERSION` | String | `"0.1.0"` | Backend release version |
| `API_V1_STR` | String | `"/api/v1"` | URL prefix for v1 endpoints |
| `HOST` | String | `"0.0.0.0"` | Bind host |
| `PORT` | Integer | `8000` | Bind port |
| `CORS_ORIGINS` | JSON list / String | `["http://localhost:5173", ...]` | Allowed origins for React frontend |
| `DATABASE_URL` | String | `sqlite:///./caseintel.db` | PostgreSQL URL for production, SQLite allowed in dev |
| `DATABASE_POOL_SIZE` | Integer | `5` | PostgreSQL connection pool size |
| `DATABASE_MAX_OVERFLOW`| Integer | `10` | Maximum pool overflow |
| `DATABASE_POOL_TIMEOUT` | Integer | `30` | Seconds to wait before timing out pool checkout |
| `LOG_LEVEL` | String | `"INFO"` | `DEBUG`, `INFO`, `WARNING`, `ERROR`, `CRITICAL` |
| `LOG_JSON_FORMAT` | Boolean | `False` | Structured JSON log output (recommended `True` in production) |
| `SECRET_KEY` | String | dev key | Secure signing key (min 32 chars, required in production) |
| `ALGORITHM` | String | `"HS256"` | JWT signing algorithm |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Integer | `1440` | Lifetime of access tokens in minutes (24 hours) |
| `REFRESH_TOKEN_EXPIRE_DAYS` | Integer | `7` | Lifetime of refresh tokens in days |

---

## 6. Local Setup and Startup

```bash
cd backend
source .venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

## 7. Running Automated Tests

```bash
pytest -v
```
All 57 tests across AI case analysis, document extraction, case management, authentication, configuration, CORS, error handling, and health probes will execute automatically.



