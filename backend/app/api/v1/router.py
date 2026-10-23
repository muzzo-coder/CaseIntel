"""API v1 master router."""

from fastapi import APIRouter
from app.api.v1.endpoints import analysis, auth, cases, documents, health

api_v1_router = APIRouter()

# Health and diagnostic endpoints
api_v1_router.include_router(
    health.router,
    prefix="/health",
    tags=["Health & Diagnostics"],
)

# Authentication and user endpoints
api_v1_router.include_router(
    auth.router,
    prefix="/auth",
    tags=["Authentication & Users"],
)

# Case and workspace endpoints
api_v1_router.include_router(
    cases.router,
    prefix="/cases",
    tags=["Cases & Workspaces"],
)

# Case documents endpoints
api_v1_router.include_router(
    documents.router,
    prefix="/cases",
    tags=["Case Documents"],
)

# AI-powered Case Analysis endpoints
api_v1_router.include_router(
    analysis.router,
    prefix="/cases",
    tags=["AI Case Analysis"],
)


