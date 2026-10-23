"""Health and readiness check schemas."""

from datetime import datetime
from typing import Dict, Literal
from pydantic import BaseModel, Field


class DatabaseHealth(BaseModel):
    """Database connectivity status details."""
    status: Literal["healthy", "unhealthy"] = Field(..., description="Database connection health")
    message: str = Field(..., description="Diagnostic message regarding database connectivity")


class LivenessResponse(BaseModel):
    """Simple liveness probe response."""
    status: Literal["alive"] = "alive"
    timestamp: datetime = Field(..., description="Current UTC server timestamp")


class ReadinessResponse(BaseModel):
    """Readiness probe response indicating if backend is ready to accept traffic."""
    status: Literal["ready", "not_ready"] = Field(..., description="Overall readiness status")
    database: DatabaseHealth = Field(..., description="Database connection status")
    timestamp: datetime = Field(..., description="Current UTC server timestamp")


class SystemHealthResponse(BaseModel):
    """Comprehensive system status response."""
    status: Literal["healthy", "degraded", "unhealthy"] = Field(..., description="Overall system health")
    app_name: str = Field(..., description="Application name")
    version: str = Field(..., description="Application version")
    environment: str = Field(..., description="Runtime environment")
    uptime_seconds: float = Field(..., description="Service uptime in seconds")
    timestamp: datetime = Field(..., description="Current UTC server timestamp")
    database: DatabaseHealth = Field(..., description="Database health status")
