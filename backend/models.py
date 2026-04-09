from pydantic import BaseModel, EmailStr, Field
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

