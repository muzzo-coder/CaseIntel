"""CaseIntel FastAPI Application Entrypoint."""

from contextlib import asynccontextmanager
from typing import AsyncGenerator
from fastapi import FastAPI, Response, status
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.endpoints.health import get_liveness, get_readiness
from app.api.v1.router import api_v1_router
from app.core.config import settings
from app.core.errors import register_exception_handlers
from app.core.logging import get_logger, setup_logging
from app.db.session import check_database_connection, engine
from app.schemas.health import LivenessResponse, ReadinessResponse

logger = get_logger("caseintel.main")


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Lifespan event handler for startup and shutdown procedures."""
    # 1. Initialize logging
    setup_logging(
        log_level=settings.LOG_LEVEL,
        json_format=settings.LOG_JSON_FORMAT,
    )
    logger.info(
        f"Starting {settings.PROJECT_NAME} v{settings.VERSION} "
        f"[environment={settings.ENVIRONMENT}, debug={settings.DEBUG}]"
    )

    # 2. Check backing database connection
    is_healthy, msg = check_database_connection()
    if is_healthy:
        logger.info(f"Database connectivity verified: {msg}")
    else:
        logger.warning(f"Database connectivity warning at startup: {msg}")

    yield

    # 3. Shutdown: Dispose database connection pool
    logger.info("Shutting down CaseIntel backend service. Disposing database pools...")
    engine.dispose()
    logger.info("Database pools disposed successfully.")


def create_app() -> FastAPI:
    """Application factory for CaseIntel FastAPI service."""
    app = FastAPI(
        title=settings.PROJECT_NAME,
        version=settings.VERSION,
        description=(
            "Production-ready backend API for CaseIntel LegalTech Platform. "
            "Provides secure, AI-powered document intelligence and legal analysis."
        ),
        docs_url="/docs" if (settings.DEBUG or settings.ENVIRONMENT != "production") else None,
        redoc_url="/redoc" if (settings.DEBUG or settings.ENVIRONMENT != "production") else None,
        openapi_url="/openapi.json" if (settings.DEBUG or settings.ENVIRONMENT != "production") else None,
        lifespan=lifespan,
    )

    # Configure CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allow_headers=["*"],
    )

    # Register structured error handlers
    register_exception_handlers(app)

    # Standard root liveness and readiness probes (for Kubernetes / Docker / load balancers)
    app.add_api_route(
        "/healthz",
        get_liveness,
        methods=["GET"],
        response_model=LivenessResponse,
        tags=["System Probes"],
        summary="Root Liveness Probe",
    )
    app.add_api_route(
        "/readyz",
        get_readiness,
        methods=["GET"],
        response_model=ReadinessResponse,
        tags=["System Probes"],
        summary="Root Readiness Probe",
    )

    # Root information route
    @app.get(
        "/",
        tags=["Root"],
        summary="Root API Information",
    )
    def root():
        return {
            "name": settings.PROJECT_NAME,
            "version": settings.VERSION,
            "environment": settings.ENVIRONMENT,
            "status": "operational",
            "docs_url": "/docs" if (settings.DEBUG or settings.ENVIRONMENT != "production") else "disabled",
            "api_v1": settings.API_V1_STR,
        }

    # Mount API v1 router
    app.include_router(api_v1_router, prefix=settings.API_V1_STR)

    return app


# Module-level app instance for ASGI servers (Uvicorn / Gunicorn)
app = create_app()
