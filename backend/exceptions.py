"""
Custom exception hierarchy for MK Shopzone backend.
Provides structured error handling with HTTP status codes.
"""

from typing import Any, Dict, Optional
from fastapi import HTTPException, status


class APIException(HTTPException):
    """Base exception class for API errors."""

    status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
    error_code = "INTERNAL_ERROR"
    message = "An internal server error occurred"

    def __init__(
        self,
        message: str = None,
        error_code: str = None,
        details: Dict[str, Any] = None,
    ):
        self.message = message or self.message
        self.error_code = error_code or self.error_code
        self.details = details or {}

        super().__init__(
            status_code=self.status_code,
            detail={
                "code": self.error_code,
                "message": self.message,
                "details": self.details,
            },
        )


# ────── Client Error Exceptions (4xx) ──────


class ValidationException(APIException):
    """Raised when request validation fails."""

    status_code = status.HTTP_422_UNPROCESSABLE_ENTITY
    error_code = "VALIDATION_ERROR"
    message = "Request validation failed"


class AuthenticationException(APIException):
    """Raised when authentication fails."""

    status_code = status.HTTP_401_UNAUTHORIZED
    error_code = "AUTHENTICATION_ERROR"
    message = "Authentication required"


class AuthorizationException(APIException):
    """Raised when user lacks permission."""

    status_code = status.HTTP_403_FORBIDDEN
    error_code = "AUTHORIZATION_ERROR"
    message = "Insufficient permissions"


class ResourceNotFoundException(APIException):
    """Raised when a requested resource is not found."""

    status_code = status.HTTP_404_NOT_FOUND
    error_code = "RESOURCE_NOT_FOUND"
    message = "Requested resource not found"


class ConflictException(APIException):
    """Raised when request conflicts with existing state."""

    status_code = status.HTTP_409_CONFLICT
    error_code = "CONFLICT"
    message = "Request conflicts with existing resource"


class RateLimitException(APIException):
    """Raised when rate limit is exceeded."""

    status_code = status.HTTP_429_TOO_MANY_REQUESTS
    error_code = "RATE_LIMIT_EXCEEDED"
    message = "Too many requests, please try again later"


# ────── Server Error Exceptions (5xx) ──────


class DatabaseException(APIException):
    """Raised when database operations fail."""

    status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
    error_code = "DATABASE_ERROR"
    message = "Database operation failed"


class ExternalServiceException(APIException):
    """Raised when external service calls fail."""

    status_code = status.HTTP_503_SERVICE_UNAVAILABLE
    error_code = "SERVICE_UNAVAILABLE"
    message = "External service unavailable"


# ────── AI Engine Exceptions ──────


class AIEngineException(APIException):
    """Base exception for AI engine errors."""

    status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
    error_code = "AI_ENGINE_ERROR"
    message = "AI engine operation failed"


class ProviderUnavailableException(AIEngineException):
    """Raised when AI provider is unavailable."""

    status_code = status.HTTP_503_SERVICE_UNAVAILABLE
    error_code = "AI_PROVIDER_UNAVAILABLE"
    message = "AI provider is unavailable"


class JSONParsingException(AIEngineException):
    """Raised when AI response JSON parsing fails."""

    error_code = "JSON_PARSING_ERROR"
    message = "Failed to parse AI response"


# ────── Automation Service Exceptions ──────


class AutomationException(APIException):
    """Base exception for automation service errors."""

    status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
    error_code = "AUTOMATION_ERROR"
    message = "Automation service error"


class WhatsAppException(AutomationException):
    """Raised when WhatsApp sending fails."""

    error_code = "WHATSAPP_ERROR"
    message = "Failed to send WhatsApp message"


class EmailException(AutomationException):
    """Raised when email sending fails."""

    error_code = "EMAIL_ERROR"
    message = "Failed to send email"


class SMSException(AutomationException):
    """Raised when SMS sending fails."""

    error_code = "SMS_ERROR"
    message = "Failed to send SMS"


# ────── Validation Exceptions ──────


class InvalidEmailException(ValidationException):
    """Raised when email validation fails."""

    error_code = "INVALID_EMAIL"
    message = "Invalid email address"


class InvalidPhoneException(ValidationException):
    """Raised when phone validation fails."""

    error_code = "INVALID_PHONE"
    message = "Invalid phone number"


class MissingFieldException(ValidationException):
    """Raised when required field is missing."""

    error_code = "MISSING_FIELD"
    message = "Required field is missing"


# ────── Helper Functions ──────


def raise_validation_error(
    field: str, reason: str, actual_value: Any = None
) -> None:
    """Helper to raise validation error with context."""
    details = {"field": field, "reason": reason}
    if actual_value is not None:
        details["value"] = str(actual_value)

    raise ValidationException(
        message=f"Validation failed for field '{field}': {reason}",
        details=details,
    )


def raise_not_found_error(resource_type: str, resource_id: str) -> None:
    """Helper to raise not found error."""
    raise ResourceNotFoundException(
        message=f"{resource_type} with ID '{resource_id}' not found",
        details={"resource_type": resource_type, "resource_id": resource_id},
    )


def raise_service_error(service_name: str, error_msg: str) -> None:
    """Helper to raise external service error."""
    raise ExternalServiceException(
        message=f"{service_name} error: {error_msg}",
        details={"service": service_name},
    )
