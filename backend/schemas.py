"""
Standardized API response schemas for MK Shopzone backend.
Ensures consistent response format across all endpoints.
"""

from typing import Generic, TypeVar, List, Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime

T = TypeVar("T")


class ErrorDetail(BaseModel):
    """Error detail with code, message, and context."""

    code: str = Field(..., description="Error code (e.g., VALIDATION_ERROR)")
    message: str = Field(..., description="Human-readable error message")
    details: Optional[Dict[str, Any]] = Field(
        default=None, description="Additional error context"
    )


class SuccessResponse(BaseModel, Generic[T]):
    """Standard success response wrapper."""

    success: bool = Field(default=True, description="Whether request succeeded")
    data: Optional[T] = Field(default=None, description="Response data")
    message: Optional[str] = Field(
        default=None, description="Optional success message"
    )
    timestamp: datetime = Field(
        default_factory=datetime.utcnow, description="Response timestamp"
    )
    request_id: Optional[str] = Field(
        default=None, description="Unique request identifier"
    )

    class Config:
        json_encoders = {datetime: lambda v: v.isoformat() + "Z"}


class ErrorResponse(BaseModel):
    """Standard error response wrapper."""

    success: bool = Field(default=False, description="Whether request succeeded")
    error: ErrorDetail = Field(..., description="Error details")
    timestamp: datetime = Field(
        default_factory=datetime.utcnow, description="Response timestamp"
    )
    request_id: Optional[str] = Field(
        default=None, description="Unique request identifier"
    )

    class Config:
        json_encoders = {datetime: lambda v: v.isoformat() + "Z"}


class PaginationMetadata(BaseModel):
    """Pagination metadata for list responses."""

    skip: int = Field(default=0, description="Number of items skipped")
    limit: int = Field(default=10, description="Maximum items returned")
    total: int = Field(..., description="Total count of items")
    has_more: bool = Field(
        ..., description="Whether more items are available"
    )


class PaginatedResponse(BaseModel, Generic[T]):
    """Paginated list response with metadata."""

    success: bool = Field(default=True, description="Whether request succeeded")
    data: List[T] = Field(default_factory=list, description="List of items")
    pagination: PaginationMetadata = Field(..., description="Pagination info")
    timestamp: datetime = Field(
        default_factory=datetime.utcnow, description="Response timestamp"
    )
    request_id: Optional[str] = Field(
        default=None, description="Unique request identifier"
    )

    class Config:
        json_encoders = {datetime: lambda v: v.isoformat() + "Z"}


# ────── Specific Response Types ──────


class HealthResponse(BaseModel):
    """Health check response."""

    status: str = Field(..., description="Service status (operational, degraded)")
    engine: str = Field(..., description="Engine/version identifier")
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    services: Dict[str, str] = Field(..., description="Status of each service")
    stats: Dict[str, Any] = Field(..., description="System statistics")


class LeadResponse(BaseModel):
    """Lead data response."""

    leadId: str = Field(..., description="Unique lead identifier")
    name: str
    email: str
    phone: str
    business: str
    intent: str
    status: str
    score: int
    createdAt: datetime
    followup_count: int = Field(default=0)


class SessionResponse(BaseModel):
    """Session data response."""

    sessionId: str
    userAgent: str
    platform: str
    duration: int
    scrollDepth: float
    pages_visited: int
    events_count: int
    createdAt: datetime
    updatedAt: datetime


class PersonalizationResponse(BaseModel):
    """Personalization engine response."""

    intent: str
    stage: str
    score: int
    headline: str
    cta: str
    offer: str
    services: List[str]
    ai_provider: str


class AnalyticsResponse(BaseModel):
    """Analytics data response."""

    total_sessions: int
    total_leads: int
    conversion_rate: float
    by_intent: Dict[str, int]
    by_stage: Dict[str, int]
    by_status: Dict[str, int]
