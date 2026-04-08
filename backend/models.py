from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

# ════════════════════════════════════════════════════════════════
# USER BEHAVIOR & TRACKING
# ════════════════════════════════════════════════════════════════

class BehavioralEvent(BaseModel):
    """Individual user interaction event"""
    type: str  # click, scroll, form_input, page_view, etc.
    target: Optional[str] = None  # Element ID or name
    path: str  # Page path
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    metadata: Dict[str, Any] = {}  # Additional data

class SessionTelemetry(BaseModel):
    """Complete session tracking data"""
    sessionId: str
    userId: Optional[str] = None
    userAgent: str
    platform: str  # mobile, desktop, tablet
    events: List[BehavioralEvent]
    scrollDepth: float = 0  # 0-100%
    duration: int = 0  # seconds
    pages_visited: Optional[List[str]] = []
    lastUpdated: datetime = Field(default_factory=datetime.utcnow)

# ════════════════════════════════════════════════════════════════
# LEAD CAPTURE & MANAGEMENT
# ════════════════════════════════════════════════════════════════

class LeadCapture(BaseModel):
    """Lead information and metadata"""
    name: str
    email: EmailStr
    phone: str
    business: Optional[str] = None
    message: Optional[str] = None

    # AI-generated fields
    intent: Optional[str] = "general"  # seo, ads, web, social, etc.
    buyingStage: Optional[str] = "awareness"  # awareness, consideration, decision
    score: int = 0  # Lead quality score (0-100)

    # Session info
    sessionId: str
    metadata: Dict[str, Any] = {}

    # Lead lifecycle
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    status: str = "new"  # new, followed_up, converted, lost

    # Follow-up tracking
    whatsapp_sent: bool = False
    email_sent: bool = False
    followup_count: int = 0

class LeadUpdate(BaseModel):
    """Update lead status"""
    leadId: int
    status: str  # new, followed_up, converted, lost
    notes: Optional[str] = None

# ════════════════════════════════════════════════════════════════
# PERSONALIZATION DATA
# ════════════════════════════════════════════════════════════════

class PersonalizationPayload(BaseModel):
    """Personalized content for frontend"""
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

# ════════════════════════════════════════════════════════════════
# AUTOMATION & FOLLOW-UP
# ════════════════════════════════════════════════════════════════

class WhatsAppMessage(BaseModel):
    """WhatsApp follow-up message"""
    to: str  # Phone number
    message: str
    leadId: int
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class EmailMessage(BaseModel):
    """Email follow-up message"""
    to: str  # Email address
    subject: str
    body: str
    leadId: int
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class FollowUpSequence(BaseModel):
    """Automated follow-up sequence"""
    leadId: int
    messages: List[Dict[str, Any]]  # Sequence of messages
    interval_hours: int = 24
    max_attempts: int = 5
    last_sent: Optional[datetime] = None
    attempt_count: int = 0

# ════════════════════════════════════════════════════════════════
# ANALYTICS & REPORTING
# ════════════════════════════════════════════════════════════════

class LeadMetrics(BaseModel):
    """Lead performance metrics"""
    total_leads: int
    leads_by_stage: Dict[str, int]
    leads_by_intent: Dict[str, int]
    leads_by_status: Dict[str, int]
    conversion_rate: float
    avg_lead_score: float

class CampaignAnalytics(BaseModel):
    """Campaign performance data"""
    campaign_name: str
    total_visits: int
    total_leads: int
    conversion_rate: float
    avg_session_duration: int
    avg_scroll_depth: float
    top_intent: str
