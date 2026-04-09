"""
PostgreSQL Database Configuration & Schema Setup
MK Shopzone - AI-Powered Digital Marketing Platform

This file contains:
1. PostgreSQL connection setup
2. SQLAlchemy models
3. Database migrations
4. CRUD operations
5. Query helpers
"""

from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Boolean, Text, ForeignKey, JSON, Index
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime, timedelta
from typing import Optional, List
import os
from dotenv import load_dotenv

load_dotenv()

# Database connection
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://user:password@localhost/mkshopzone"
)

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    echo=False  # Set to True for SQL logging
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


# ════════════════════════════════════════════════════════════════
# SQLAlchemy Models
# ════════════════════════════════════════════════════════════════

class User(Base):
    """User session tracking"""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(100), unique=True, index=True, nullable=False)
    ip_address = Column(String(50), index=True)
    device = Column(String(20))  # mobile, desktop, tablet
    source = Column(String(50))  # google, facebook, direct, email
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    last_activity = Column(DateTime, default=datetime.utcnow)
    status = Column(String(20), default="active")  # active, inactive, blocked

    # Relationships
    behaviors = relationship("UserBehavior", back_populates="user", cascade="all, delete-orphan")
    leads = relationship("Lead", back_populates="user")
    analytics = relationship("AIAnalytics", back_populates="user")

    __table_args__ = (
        Index('idx_user_created', 'created_at'),
        Index('idx_user_status', 'status'),
    )


class UserBehavior(Base):
    """User behavior tracking"""
    __tablename__ = "user_behavior"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True)
    session_id = Column(String(100), index=True)
    page_visited = Column(String(255))
    time_spent = Column(Integer)  # seconds
    scroll_depth = Column(Float, default=0)  # percentage
    clicks = Column(JSON, default=[])  # list of click events
    engagement_score = Column(Float, default=0)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)

    # Relationship
    user = relationship("User", back_populates="behaviors")

    __table_args__ = (
        Index('idx_behavior_session_time', 'session_id', 'timestamp'),
        Index('idx_behavior_timestamp', 'timestamp'),
    )


class Lead(Base):
    """Captured leads"""
    __tablename__ = "leads"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"))
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    phone = Column(String(20), index=True)
    business = Column(String(255))
    interest = Column(String(100), index=True)  # SEO, Ads, Web, Social, App, General
    score = Column(Integer, default=50, index=True)
    source = Column(String(50), default="website")
    status = Column(String(50), default="new", index=True)  # new, contacted, qualified, converted, lost
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    last_contact = Column(DateTime, nullable=True)
    contact_count = Column(Integer, default=0)
    whatsapp_sent = Column(Boolean, default=False)
    email_sent = Column(Boolean, default=False)
    notes = Column(Text, nullable=True)
    metadata = Column(JSON, default={})

    # Relationships
    user = relationship("User", back_populates="leads")
    followups = relationship("FollowUp", back_populates="lead", cascade="all, delete-orphan")
    retargeting = relationship("Retargeting", back_populates="lead")

    __table_args__ = (
        Index('idx_lead_status', 'status'),
        Index('idx_lead_interest', 'interest'),
        Index('idx_lead_created', 'created_at'),
        Index('idx_lead_score', 'score'),
    )


class AIAnalytics(Base):
    """AI analysis and insights"""
    __tablename__ = "ai_analytics"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), index=True)
    session_id = Column(String(100), index=True)
    detected_intent = Column(String(100), index=True)  # SEO, Ads, Web, Social, App, General
    buying_stage = Column(String(50), index=True)  # Awareness, Consideration, Decision
    recommended_service = Column(String(255))
    generated_cta = Column(String(255))
    generated_headline = Column(String(500))
    generated_subheading = Column(String(500))
    confidence_score = Column(Float, default=0)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    metadata = Column(JSON, default={})

    # Relationship
    user = relationship("User", back_populates="analytics")

    __table_args__ = (
        Index('idx_analytics_intent', 'detected_intent'),
        Index('idx_analytics_stage', 'buying_stage'),
        Index('idx_analytics_timestamp', 'timestamp'),
    )


class FollowUp(Base):
    """Follow-up scheduling and tracking"""
    __tablename__ = "followups"

    id = Column(Integer, primary_key=True, index=True)
    lead_id = Column(Integer, ForeignKey("leads.id", ondelete="CASCADE"), index=True)
    whatsapp_sent = Column(Boolean, default=False)
    email_sent = Column(Boolean, default=False)
    last_followup = Column(DateTime, nullable=True)
    next_followup = Column(DateTime, index=True)
    status = Column(String(50), default="active", index=True)  # active, completed, cancelled
    followup_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationship
    lead = relationship("Lead", back_populates="followups")

    __table_args__ = (
        Index('idx_followup_next', 'next_followup'),
        Index('idx_followup_status', 'status'),
    )


class Retargeting(Base):
    """Retargeting audience segments"""
    __tablename__ = "retargeting"

    id = Column(Integer, primary_key=True, index=True)
    lead_id = Column(Integer, ForeignKey("leads.id", ondelete="CASCADE"), index=True)
    interest = Column(String(100), index=True)  # SEO, Ads, Web, Social, App
    audience_tag = Column(String(100), index=True)  # high_intent, warm_lead, cold_lead
    ad_platform = Column(JSON)  # ["facebook", "google"]
    status = Column(String(50), default="active", index=True)
    impressions = Column(Integer, default=0)
    clicks = Column(Integer, default=0)
    conversions = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)

    # Relationship
    lead = relationship("Lead", back_populates="retargeting")

    __table_args__ = (
        Index('idx_retargeting_interest', 'interest'),
        Index('idx_retargeting_tag', 'audience_tag'),
    )


class Campaign(Base):
    """Marketing campaigns"""
    __tablename__ = "campaigns"

    id = Column(Integer, primary_key=True, index=True)
    campaign_id = Column(String(100), unique=True, index=True)
    name = Column(String(255))
    campaign_type = Column(String(50))  # email, whatsapp, retargeting
    status = Column(String(50), default="active")
    target_interest = Column(String(100))
    start_date = Column(DateTime, default=datetime.utcnow)
    end_date = Column(DateTime, nullable=True)
    total_recipients = Column(Integer, default=0)
    sent = Column(Integer, default=0)
    opened = Column(Integer, default=0)
    clicked = Column(Integer, default=0)
    converted = Column(Integer, default=0)
    metadata = Column(JSON, default={})
    created_at = Column(DateTime, default=datetime.utcnow)

    __table_args__ = (
        Index('idx_campaign_status', 'status'),
        Index('idx_campaign_type', 'campaign_type'),
    )


class AnalyticsSummary(Base):
    """Daily analytics summary"""
    __tablename__ = "analytics_summary"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(String(10), unique=True, index=True)  # YYYY-MM-DD
    total_sessions = Column(Integer, default=0)
    total_leads = Column(Integer, default=0)
    leads_converted = Column(Integer, default=0)
    conversion_rate = Column(Float, default=0)
    avg_engagement = Column(Float, default=0)
    leads_by_intent = Column(JSON, default={})
    leads_by_stage = Column(JSON, default={})
    created_at = Column(DateTime, default=datetime.utcnow)

    __table_args__ = (
        Index('idx_summary_date', 'date'),
    )


# ════════════════════════════════════════════════════════════════
# Database Operations
# ════════════════════════════════════════════════════════════════

class DatabaseOps:
    """CRUD operations for PostgreSQL"""

    def __init__(self):
        self.db = SessionLocal()

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.db.close()

    # ────────────────────────────────────────────────────────────
    # Users
    # ────────────────────────────────────────────────────────────

    def create_user(self, session_id: str, ip_address: str,
                   device: str, source: str) -> User:
        """Create new user"""
        user = User(
            session_id=session_id,
            ip_address=ip_address,
            device=device,
            source=source
        )
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user

    def get_user(self, session_id: str) -> Optional[User]:
        """Get user by session ID"""
        return self.db.query(User).filter(
            User.session_id == session_id
        ).first()

    # ────────────────────────────────────────────────────────────
    # User Behavior
    # ────────────────────────────────────────────────────────────

    def log_behavior(self, session_id: str, page_visited: str,
                    time_spent: int, scroll_depth: float,
                    clicks: List[str] = None) -> UserBehavior:
        """Log user behavior"""

        engagement = self._calculate_engagement(
            time_spent, scroll_depth, len(clicks or [])
        )

        behavior = UserBehavior(
            session_id=session_id,
            page_visited=page_visited,
            time_spent=time_spent,
            scroll_depth=scroll_depth,
            clicks=clicks or [],
            engagement_score=engagement
        )
        self.db.add(behavior)
        self.db.commit()
        return behavior

    def get_session_behavior(self, session_id: str) -> List[UserBehavior]:
        """Get behavior for session"""
        return self.db.query(UserBehavior).filter(
            UserBehavior.session_id == session_id
        ).order_by(UserBehavior.timestamp.desc()).all()

    @staticmethod
    def _calculate_engagement(time_spent: int, scroll_depth: float,
                             clicks_count: int) -> float:
        """Calculate engagement score"""
        score = 0

        if time_spent >= 300:
            score += 25
        elif time_spent >= 120:
            score += 15
        elif time_spent >= 60:
            score += 10

        if scroll_depth >= 75:
            score += 25
        elif scroll_depth >= 50:
            score += 15
        elif scroll_depth >= 25:
            score += 10

        if clicks_count >= 5:
            score += 20
        elif clicks_count >= 3:
            score += 10
        elif clicks_count >= 1:
            score += 5

        return min(score, 100)

    # ────────────────────────────────────────────────────────────
    # Leads
    # ────────────────────────────────────────────────────────────

    def create_lead(self, name: str, email: str, phone: str,
                   business: str, interest: str, score: int = 50) -> Lead:
        """Create new lead"""
        lead = Lead(
            name=name,
            email=email,
            phone=phone,
            business=business,
            interest=interest,
            score=score
        )
        self.db.add(lead)
        self.db.commit()
        self.db.refresh(lead)
        return lead

    def get_lead(self, lead_id: int) -> Optional[Lead]:
        """Get lead by ID"""
        return self.db.query(Lead).filter(Lead.id == lead_id).first()

    def get_leads_by_status(self, status: str, limit: int = 50) -> List[Lead]:
        """Get leads by status"""
        return self.db.query(Lead).filter(
            Lead.status == status
        ).order_by(Lead.created_at.desc()).limit(limit).all()

    def update_lead_status(self, lead_id: int, status: str, notes: str = ""):
        """Update lead status"""
        lead = self.get_lead(lead_id)
        if lead:
            lead.status = status
            lead.last_contact = datetime.utcnow()
            lead.notes = notes
            lead.contact_count += 1
            self.db.commit()

    # ────────────────────────────────────────────────────────────
    # AI Analytics
    # ────────────────────────────────────────────────────────────

    def save_ai_analysis(self, session_id: str, detected_intent: str,
                        buying_stage: str, recommended_service: str,
                        generated_cta: str, confidence_score: float) -> AIAnalytics:
        """Save AI analysis"""

        analytics = AIAnalytics(
            session_id=session_id,
            detected_intent=detected_intent,
            buying_stage=buying_stage,
            recommended_service=recommended_service,
            generated_cta=generated_cta,
            confidence_score=confidence_score
        )
        self.db.add(analytics)
        self.db.commit()
        return analytics

    # ────────────────────────────────────────────────────────────
    # Follow-ups
    # ────────────────────────────────────────────────────────────

    def create_followup(self, lead_id: int) -> FollowUp:
        """Create follow-up schedule"""

        followup = FollowUp(
            lead_id=lead_id,
            next_followup=datetime.utcnow() + timedelta(hours=1)
        )
        self.db.add(followup)
        self.db.commit()
        return followup

    def get_pending_followups(self) -> List[FollowUp]:
        """Get pending follow-ups"""

        return self.db.query(FollowUp).filter(
            FollowUp.status == "active",
            FollowUp.next_followup <= datetime.utcnow()
        ).all()

    # ────────────────────────────────────────────────────────────
    # Retargeting
    # ────────────────────────────────────────────────────────────

    def create_retargeting_audience(self, lead_id: int, interest: str,
                                   audience_tag: str,
                                   ad_platforms: List[str]) -> Retargeting:
        """Create retargeting audience"""

        retargeting = Retargeting(
            lead_id=lead_id,
            interest=interest,
            audience_tag=audience_tag,
            ad_platform=ad_platforms
        )
        self.db.add(retargeting)
        self.db.commit()
        return retargeting

    def get_retargeting_audiences(self, interest: str = None) -> List[Retargeting]:
        """Get retargeting audiences"""

        query = self.db.query(Retargeting).filter(
            Retargeting.status == "active"
        )

        if interest:
            query = query.filter(Retargeting.interest == interest)

        return query.all()

    # ────────────────────────────────────────────────────────────
    # Analytics Summary
    # ────────────────────────────────────────────────────────────

    def save_daily_summary(self, date: str, metrics: dict) -> AnalyticsSummary:
        """Save daily summary"""

        summary = AnalyticsSummary(
            date=date,
            total_sessions=metrics.get("sessions", 0),
            total_leads=metrics.get("leads", 0),
            leads_converted=metrics.get("converted", 0),
            conversion_rate=metrics.get("conversion_rate", 0),
            avg_engagement=metrics.get("avg_engagement", 0),
            leads_by_intent=metrics.get("leads_by_intent", {}),
            leads_by_stage=metrics.get("leads_by_stage", {})
        )

        self.db.add(summary)
        self.db.commit()
        return summary


# ════════════════════════════════════════════════════════════════
# Database Initialization
# ════════════════════════════════════════════════════════════════

def init_database():
    """Initialize database"""
    try:
        Base.metadata.create_all(bind=engine)
        print("✅ PostgreSQL tables created successfully")
    except Exception as e:
        print(f"❌ Database initialization failed: {e}")
        raise


def get_db():
    """Get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


if __name__ == "__main__":
    init_database()
    print("✅ Database setup complete!")

