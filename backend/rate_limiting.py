"""
Rate limiting configuration for MK Shopzone API endpoints.
Prevents abuse on public endpoints (lead capture, tracking).
"""

from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi import Request
from fastapi.responses import JSONResponse
from datetime import datetime
from typing import Callable
import logging

logger = logging.getLogger(__name__)

# Initialize limiter with remote address as key
limiter = Limiter(key_func=get_remote_address)


def rate_limit_exceeded_handler(request: Request, exc: RateLimitExceeded) -> JSONResponse:
    """Custom rate limit exceeded handler."""
    logger.warning(
        f"Rate limit exceeded for {request.client.host}",
        extra={
            "extra_fields": {
                "client_ip": request.client.host,
                "endpoint": request.url.path,
                "method": request.method,
            }
        },
    )

    return JSONResponse(
        status_code=429,
        content={
            "success": False,
            "error": {
                "code": "RATE_LIMIT_EXCEEDED",
                "message": "Too many requests. Please try again later.",
                "details": {
                    "retry_after": exc.detail if hasattr(exc, "detail") else "60"
                },
            },
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "request_id": getattr(request.state, "request_id", None),
        },
    )


# Rate limit definitions (per minute, per IP/session)
RATE_LIMITS = {
    # Public tracking endpoints (high volume)
    "tracking": "100/minute",  # 100 requests per minute per IP

    # Lead capture (prevent spam)
    "lead_capture": "5/minute",  # 5 leads per minute per IP

    # Chatbot (prevent abuse)
    "chatbot": "20/minute",  # 20 messages per minute per session

    # Admin dashboard (if authenticated)
    "admin": "1000/minute",  # 1000 requests per minute per authenticated user

    # General API (default)
    "default": "60/minute",  # 60 requests per minute per IP
}
