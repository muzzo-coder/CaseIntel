"""Health and readiness check endpoints."""

import time
from datetime import datetime, timezone
from fastapi import APIRouter, Response, status
from app.core.config import settings
from app.db.session import check_database_connection
from app.schemas.health import (
    DatabaseHealth,
    LivenessResponse,
    ReadinessResponse,
    SystemHealthResponse,
)

router = APIRouter()

# Record startup timestamp for uptime calculation
_START_TIME = time.time()


@router.get(
    "/healthz",
    response_model=LivenessResponse,
    summary="Liveness Probe",
    description="Returns 200 if the service process is up and running.",
)
def get_liveness() -> LivenessResponse:
    """Liveness probe for container orchestrators (Kubernetes, Docker)."""
    return LivenessResponse(
        status="alive",
        timestamp=datetime.now(timezone.utc),
    )


@router.get(
    "/readyz",
    response_model=ReadinessResponse,
    responses={
        503: {
            "model": ReadinessResponse,
            "description": "Backend is not ready to serve traffic (e.g. database disconnected).",
        }
    },
    summary="Readiness Probe",
    description="Returns 200 if backend and required backing services (database) are operational, 503 otherwise.",
)
def get_readiness(response: Response) -> ReadinessResponse:
    """Readiness probe checking critical dependencies before accepting incoming traffic."""
    is_db_healthy, db_message = check_database_connection()
    current_time = datetime.now(timezone.utc)

    if not is_db_healthy:
        response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE
        return ReadinessResponse(
            status="not_ready",
            database=DatabaseHealth(
                status="unhealthy",
                message=db_message,
            ),
            timestamp=current_time,
        )

    return ReadinessResponse(
        status="ready",
        database=DatabaseHealth(
            status="healthy",
            message=db_message,
        ),
        timestamp=current_time,
    )


@router.get(
    "/health",
    response_model=SystemHealthResponse,
    summary="System Health and Status",
    description="Provides detailed status about the application runtime, database, environment, and uptime.",
)
def get_system_health(response: Response) -> SystemHealthResponse:
    """Detailed health report endpoint."""
    is_db_healthy, db_message = check_database_connection()
    uptime = time.time() - _START_TIME
    current_time = datetime.now(timezone.utc)

    system_status = "healthy" if is_db_healthy else "degraded"
    if not is_db_healthy:
        response.status_code = status.HTTP_503_SERVICE_UNAVAILABLE

    return SystemHealthResponse(
        status=system_status,
        app_name=settings.PROJECT_NAME,
        version=settings.VERSION,
        environment=settings.ENVIRONMENT,
        uptime_seconds=round(uptime, 2),
        timestamp=current_time,
        database=DatabaseHealth(
            status="healthy" if is_db_healthy else "unhealthy",
            message=db_message,
        ),
    )


@router.get(
    "/ping",
    summary="Ping Endpoint",
    description="Simple ping endpoint for fast latency and connectivity checks.",
)
def ping() -> dict:
    """Simple ping pong."""
    return {"ping": "pong", "timestamp": datetime.now(timezone.utc).isoformat()}
