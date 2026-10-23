"""Structured Logging Configuration for CaseIntel Backend."""

import json
import logging
import sys
from datetime import datetime, timezone
from typing import Any, Dict


class JSONFormatter(logging.Formatter):
    """Custom JSON formatter for structured production logging."""

    def format(self, record: logging.LogRecord) -> str:
        log_entry: Dict[str, Any] = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "module": record.module,
            "line": record.lineno,
        }

        # Include exception information safely without exposing raw memory dumps
        if record.exc_info:
            log_entry["exception"] = self.formatException(record.exc_info)

        # Include any custom extra attributes passed to logger
        if hasattr(record, "extra_data") and isinstance(record.extra_data, dict):
            # Sanitize any sensitive fields
            sanitized = self._sanitize(record.extra_data)
            log_entry["data"] = sanitized

        return json.dumps(log_entry)

    def _sanitize(self, data: Dict[str, Any]) -> Dict[str, Any]:
        sensitive_keys = {"password", "token", "secret", "authorization", "api_key", "cookie"}
        sanitized = {}
        for key, val in data.items():
            if any(s in key.lower() for s in sensitive_keys):
                sanitized[key] = "[REDACTED]"
            elif isinstance(val, dict):
                sanitized[key] = self._sanitize(val)
            else:
                sanitized[key] = val
        return sanitized


class TextFormatter(logging.Formatter):
    """Human-readable formatter with ANSI colors for local development."""

    COLORS = {
        logging.DEBUG: "\033[36m",    # Cyan
        logging.INFO: "\033[32m",     # Green
        logging.WARNING: "\033[33m",  # Yellow
        logging.ERROR: "\033[31m",    # Red
        logging.CRITICAL: "\033[35m", # Magenta
    }
    RESET = "\033[0m"

    def format(self, record: logging.LogRecord) -> str:
        color = self.COLORS.get(record.levelno, self.RESET)
        time_str = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")
        prefix = f"{color}[{time_str}] [{record.levelname:<8}] [{record.name}]{self.RESET}"
        return f"{prefix} {record.getMessage()}"


def setup_logging(log_level: str = "INFO", json_format: bool = False) -> None:
    """Configure root logger and application loggers."""
    root_logger = logging.getLogger()
    numeric_level = getattr(logging, log_level.upper(), logging.INFO)
    root_logger.setLevel(numeric_level)

    # Clear existing handlers
    root_logger.handlers.clear()

    handler = logging.StreamHandler(sys.stdout)
    handler.setLevel(numeric_level)

    if json_format:
        handler.setFormatter(JSONFormatter())
    else:
        handler.setFormatter(TextFormatter())

    root_logger.addHandler(handler)

    # Quiet overly chatty third-party loggers
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)


def get_logger(name: str) -> logging.Logger:
    """Return a configured logger for the given module name."""
    return logging.getLogger(name)
