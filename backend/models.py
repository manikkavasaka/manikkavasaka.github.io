from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import List, Optional, Dict, Any
from datetime import datetime

# ════════════════════════════════════════════════════════════════
# 1. USERS COLLECTION
# ════════════════════════════════════════════════════════════════
class User(BaseModel):
    """Stores basic user session info"""
    session_id: str
    ip_address: Optional[str] = None
    device: Optional[str] = None  # mobile/desktop
    source: Optional[str] = None  # google/facebook/direct
    created_at: datetime = Field(default_factory=datetime.utcnow)

# ════════════════════════════════════════════════════════════════
# 2. USER_BEHAVIOR COLLECTION
# ════════════════════════════════════════════════════════════════
class UserBehavior(BaseModel):
    """Tracks user activity"""
    session_id: str
    page_visited: str
    time_spent: int = 0  # in seconds
    clicks: List[str] = []
    scroll_depth: int = 0  # percentage
    timestamp: datetime = Field(default_factory=datetime.utcnow)

# ════════════════════════════════════════════════════════════════
# 3. LEADS COLLECTION
# ════════════════════════════════════════════════════════════════
class Lead(BaseModel):
    """Stores captured leads"""
    name: str
    email: EmailStr
    phone: str
    business: Optional[str] = None
    interest: Optional[str] = None
    source: str = "website"
    created_at: datetime = Field(default_factory=datetime.utcnow)

# ════════════════════════════════════════════════════════════════
# 4. AI_ANALYTICS COLLECTION
# ════════════════════════════════════════════════════════════════
class AIAnalytics(BaseModel):
    """Stores AI decisions and insights"""
    session_id: str
    detected_intent: str
    buying_stage: str
    recommended_service: str
    generated_cta: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

# ════════════════════════════════════════════════════════════════
# 5. FOLLOWUPS COLLECTION
# ════════════════════════════════════════════════════════════════
class Followup(BaseModel):
    """Stores communication logs"""
    lead_id: str
    whatsapp_sent: bool = False
    email_sent: bool = False
    last_followup: Optional[datetime] = None
    next_followup: Optional[datetime] = None
    status: str = "active"

# ════════════════════════════════════════════════════════════════
# 6. RETARGETING COLLECTION
# ════════════════════════════════════════════════════════════════
class Retargeting(BaseModel):
    """Stores ad targeting data"""
    lead_id: str
    interest: str
    audience_tag: str
    ad_platform: List[str] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)

# ════════════════════════════════════════════════════════════════
# (Optional) LEGACY / API INTERFACE MODELS (Kept for backward compat)
# ════════════════════════════════════════════════════════════════
class PersonalizationPayload(BaseModel):
    intent: str
    stage: str
    score: int
    headline: str
    subheading: str
    cta: str
    offer: str
    services: List[str]
    show_popup: bool
    popup_message: Optional[str] = None

class LeadMetrics(BaseModel):
    total_leads: int
    leads_by_stage: Dict[str, int]
    leads_by_intent: Dict[str, int]
    leads_by_status: Dict[str, int]
    conversion_rate: float
    avg_lead_score: float

# ════════════════════════════════════════════════════════════════
# 7. NEW API MODELS (v4.0)
# ════════════════════════════════════════════════════════════════

class BehavioralEvent(BaseModel):
    """Single user behavior event."""

    type: str = Field(..., description="Event type (click, scroll, form_submit, etc.)")
    target: str = Field(..., description="Event target element")
    path: str = Field(..., description="Page path where event occurred")
    timestamp: str = Field(..., description="ISO format timestamp")
    metadata: Optional[Dict[str, Any]] = None

    @field_validator("type")
    @classmethod
    def validate_type(cls, v: str) -> str:
        """Validate event type."""
        valid_types = ["click", "scroll", "form_submit", "page_view", "hover", "input"]
        if v not in valid_types:
            raise ValueError(f"Event type must be one of {valid_types}")
        return v


class SessionTelemetry(BaseModel):
    """Session behavior telemetry from client."""

    sessionId: str = Field(..., min_length=10)
    userAgent: Optional[str] = Field(None, max_length=500)
    platform: Optional[str] = Field(None, pattern="^(web|mobile|tablet)$")
    scrollDepth: float = Field(0, ge=0, le=100, description="Scroll depth percentage")
    duration: int = Field(0, ge=0, description="Session duration in seconds")
    pages_visited: List[str] = Field(default_factory=list)
    events: List[BehavioralEvent] = Field(default_factory=list)

    @field_validator("scrollDepth")
    @classmethod
    def validate_scroll_depth(cls, v: float) -> float:
        """Ensure scroll depth is percentage."""
        if v < 0 or v > 100:
            raise ValueError("Scroll depth must be between 0 and 100")
        return v

class LeadCapture(BaseModel):
    """Lead capture from contact form or chatbot."""

    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    phone: str = Field(..., min_length=10, max_length=15)
    business: Optional[str] = Field(None, max_length=200)
    message: Optional[str] = Field(None, max_length=1000)
    sessionId: str
    intent: Optional[str] = Field("General", max_length=50)
    buyingStage: Optional[str] = Field("Awareness", max_length=50)
    score: Optional[int] = Field(50, ge=0, le=100)
    metadata: Optional[Dict[str, Any]] = None

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v: str) -> str:
        """Validate phone number format."""
        if not v.replace("+", "").replace(" ", "").isdigit():
            raise ValueError("Phone must contain only digits and optional + prefix")
        return v

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        """Validate name field."""
        if not v or len(v.strip()) == 0:
            raise ValueError("Name cannot be empty")
        return v.strip()

    @field_validator("intent")
    @classmethod
    def validate_intent(cls, v: Optional[str]) -> Optional[str]:
        """Validate intent field."""
        valid_intents = [
            "General",
            "SEO",
            "Paid Ads",
            "Web Design",
            "Social Media",
            "Email Marketing",
            "App Development",
        ]
        if v and v not in valid_intents:
            raise ValueError(f"Intent must be one of {valid_intents}")
        return v

class LeadUpdate(BaseModel):
    status: str
    notes: Optional[str] = None
