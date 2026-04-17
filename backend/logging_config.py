"""
Structured logging configuration for MK Shopzone backend.
Provides JSON-formatted logs, correlation IDs, and multiple handlers.
"""

import logging
import logging.handlers
import json
import os
from datetime import datetime
from typing import Any, Dict
from pathlib import Path


class JSONFormatter(logging.Formatter):
    """Custom JSON formatter for structured logging."""

    def format(self, record: logging.LogRecord) -> str:
        log_obj: Dict[str, Any] = {
            "timestamp": datetime.utcfromtimestamp(record.created).isoformat() + "Z",
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
            "module": record.module,
            "function": record.funcName,
            "line": record.lineno,
        }

        # Add exception info if present
        if record.exc_info:
            log_obj["exception"] = {
                "type": record.exc_info[0].__name__,
                "message": str(record.exc_info[1]),
                "traceback": self.formatException(record.exc_info),
            }

        # Add correlation ID if available
        if hasattr(record, "request_id") and record.request_id:
            log_obj["request_id"] = record.request_id

        # Add extra fields if provided
        if hasattr(record, "extra_fields"):
            log_obj.update(record.extra_fields)

        return json.dumps(log_obj)


class CorrelationIDFilter(logging.Filter):
    """Add correlation ID to all log records."""

    def filter(self, record: logging.LogRecord) -> bool:
        if not hasattr(record, "request_id"):
            record.request_id = None
        return True


def setup_logging(log_level: str = "INFO", log_dir: str = "logs") -> None:
    """
    Configure structured logging for the application.

    Args:
        log_level: Logging level (DEBUG, INFO, WARNING, ERROR, CRITICAL)
        log_dir: Directory for log files

    Environment Variables:
        LOG_LEVEL: Override log level
        LOG_DIR: Override log directory
    """
    # Get configuration from environment
    log_level = os.getenv("LOG_LEVEL", log_level).upper()
    log_dir = os.getenv("LOG_DIR", log_dir)

    # Create logs directory if it doesn't exist
    Path(log_dir).mkdir(exist_ok=True)

    # Get root logger
    root_logger = logging.getLogger()
    root_logger.setLevel(getattr(logging, log_level))

    # Remove existing handlers to avoid duplicates
    for handler in root_logger.handlers[:]:
        root_logger.removeHandler(handler)

    # Add correlation ID filter
    root_logger.addFilter(CorrelationIDFilter())

    # Console handler (always use JSON formatter)
    console_handler = logging.StreamHandler()
    console_handler.setFormatter(JSONFormatter())
    console_handler.setLevel(getattr(logging, log_level))
    root_logger.addHandler(console_handler)

    # File handler (rotating)
    log_file = os.path.join(log_dir, "app.log")
    file_handler = logging.handlers.RotatingFileHandler(
        log_file,
        maxBytes=10_485_760,  # 10 MB
        backupCount=5,  # Keep 5 backup files
    )
    file_handler.setFormatter(JSONFormatter())
    file_handler.setLevel(getattr(logging, log_level))
    root_logger.addHandler(file_handler)

    # Error file handler (always at WARNING level)
    error_log_file = os.path.join(log_dir, "error.log")
    error_handler = logging.handlers.RotatingFileHandler(
        error_log_file,
        maxBytes=10_485_760,
        backupCount=5,
    )
    error_handler.setFormatter(JSONFormatter())
    error_handler.setLevel(logging.WARNING)
    root_logger.addHandler(error_handler)

    # Log startup message
    root_logger.info(
        "Logging configured",
        extra={"extra_fields": {"level": log_level, "log_dir": log_dir}},
    )


def get_logger(name: str) -> logging.LoggerAdapter:
    """
    Get a logger instance with the given name.

    Args:
        name: Logger name (usually __name__)

    Returns:
        LoggerAdapter for structured logging
    """
    logger = logging.getLogger(name)
    return logger


class RequestLogger:
    """Helper for logging requests with correlation IDs."""

    @staticmethod
    def add_request_id(logger: logging.Logger, request_id: str) -> None:
        """Add request ID to logger context."""
        for handler in logger.handlers:
            for filter_obj in handler.filters:
                if isinstance(filter_obj, CorrelationIDFilter):
                    # This is a simple approach; for production, consider using contextvars
                    pass

    @staticmethod
    def log_request(
        logger: logging.Logger,
        method: str,
        path: str,
        status_code: int,
        duration_ms: float,
        request_id: str = None,
    ) -> None:
        """Log HTTP request with standardized format."""
        logger.info(
            f"{method} {path}",
            extra={
                "extra_fields": {
                    "http_method": method,
                    "http_path": path,
                    "http_status": status_code,
                    "duration_ms": duration_ms,
                    "request_id": request_id,
                }
            },
        )

    @staticmethod
    def log_error(
        logger: logging.Logger,
        error_msg: str,
        error_type: str = None,
        request_id: str = None,
        **kwargs: Any,
    ) -> None:
        """Log error with context."""
        extra_fields = {"error_type": error_type, "request_id": request_id}
        extra_fields.update(kwargs)
        logger.error(error_msg, extra={"extra_fields": extra_fields})
