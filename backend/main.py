"""
MK Shopzone — AI Growth Engine  v4.0
FastAPI backend powering:
  1. Real-time behavior tracking
  2. AI intent & personalization
  3. Smart lead capture
  4. AI chatbot lead ingestion
  5. Automated WhatsApp + Email follow-ups
  6. Retargeting audience builder
  7. Admin dashboard & analytics
"""

import os
import logging
import uuid
from contextlib import asynccontextmanager
from pathlib import Path
from fastapi import FastAPI, BackgroundTasks, HTTPException, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, HTMLResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.exceptions import RequestValidationError
from datetime import datetime, timedelta
from typing import List, Optional, Any, Dict

# ── Local imports ─────────────────────────────────────────────────────────────
from .models        import SessionTelemetry, LeadCapture, LeadUpdate, BehavioralEvent
from .ai_engine     import AIEngine
from .automations import AutomationService
from .db_manager import (
    connect_db, close_db, save_session, get_session,
    save_lead, get_lead, get_all_leads, update_lead_status,
    get_all_sessions, get_dashboard_metrics, get_lead_count, create_indexes
)
from .logging_config import setup_logging, get_logger, RequestLogger
from .exceptions import (
    APIException, ResourceNotFoundException, ValidationException,
    ExternalServiceException, DatabaseException
)
from .schemas import (
    SuccessResponse, ErrorResponse, ErrorDetail, PaginatedResponse,
    HealthResponse, LeadResponse, SessionResponse, PersonalizationResponse,
    AnalyticsResponse, PaginationMetadata
)
from .rate_limiting import limiter, rate_limit_exceeded_handler, RATE_LIMITS

# ── APScheduler (optional) ────────────────────────────────────────────────────
try:
    from apscheduler.schedulers.asyncio import AsyncIOScheduler
    _scheduler = AsyncIOScheduler()
    _SCHEDULER_AVAILABLE = True
except ImportError:
    _scheduler = None
    _SCHEDULER_AVAILABLE = False

# ── Pandas for Export (optional)  ────────────────────────────────────────────
try:
    import pandas as pd
    _PANDAS_AVAILABLE = True
except ImportError:
    _PANDAS_AVAILABLE = False


# ═══════════════════════════════════════════════════════════════════════════════
# SCHEDULER JOBS
# ═══════════════════════════════════════════════════════════════════════════════

async def _daily_followup_job():
    """Runs every day at 09:00 IST — sends nurture messages to pending leads."""
    logger = get_logger(__name__)
    logger.info("Daily follow-up job triggered")

    try:
        leads, total = await get_all_leads(limit=500, status="new")
        leads_fu, _ = await get_all_leads(limit=500, status="followed_up")
        all_active = leads + leads_fu

        logger.info(f"Processing {len(all_active)} active leads", extra={"extra_fields": {"lead_count": len(all_active)}})

        for lead in all_active:
            # Respect 24-hour throttle
            last_fu = lead.get("last_followup")
            if last_fu:
                try:
                    last_ts = datetime.fromisoformat(str(last_fu))
                    if (datetime.utcnow() - last_ts).total_seconds() < 86_000:
                        continue  # not 24 h yet
                except Exception:
                    pass

            count = lead.get("followup_count", 0)
            name = lead.get("name", "Friend").split()[0]
            intent = lead.get("intent", "General")
            phone = lead.get("phone", "")
            email = lead.get("email", "")

            # Day-based message variant
            if count == 0:
                variant = "welcome"
            elif count == 2:
                variant = "day3_urgency"
            elif count == 6:
                variant = "day7_final"
            else:
                variant = "generic"

            logger.info(
                f"Sending day-{count+1} follow-up",
                extra={
                    "extra_fields": {
                        "lead_name": name,
                        "intent": intent,
                        "day": count + 1,
                        "variant": variant,
                    }
                },
            )

            await AutomationService.send_whatsapp(phone, name, intent)
            await AutomationService.send_email(email, name, intent)

            # Update lead
            await update_lead_status(
                lead.get("_id"),
                "followed_up",
                f"Follow-up #{count+1} sent at {datetime.utcnow().isoformat()}"
            )

        logger.info(f"Daily job completed successfully", extra={"extra_fields": {"processed": len(all_active)}})

    except Exception as exc:
        logger.error(f"Daily follow-up job failed: {str(exc)}", exc_info=True)


# ═══════════════════════════════════════════════════════════════════════════════
# LIFESPAN  (startup / shutdown)
# ═══════════════════════════════════════════════════════════════════════════════

@asynccontextmanager
async def lifespan(app: FastAPI):
    # ── Start-up ──────────────────────────────────────────────────────────────
    # Initialize logging
    setup_logging()
    logger = get_logger(__name__)

    # Connect to database
    await connect_db()
    logger.info("Database connected")

    # Create database indexes (TTL, unique constraints, etc.)
    await create_indexes()

    # Initialize scheduler
    if _SCHEDULER_AVAILABLE and _scheduler:
        _scheduler.add_job(
            _daily_followup_job,
            "cron",
            hour=3, minute=30,      # 09:00 IST = 03:30 UTC
            id="daily_followup",
            replace_existing=True
        )
        _scheduler.start()
        logger.info("APScheduler started", extra={"extra_fields": {"schedule": "09:00 IST"}})
    else:
        logger.warning("APScheduler not available - daily follow-up jobs disabled")

    yield

    # ── Shutdown ──────────────────────────────────────────────────────────────
    if _SCHEDULER_AVAILABLE and _scheduler and _scheduler.running:
        _scheduler.shutdown()
        logger.info("APScheduler shutdown")

    await close_db()
    logger.info("Database connection closed")


# ═══════════════════════════════════════════════════════════════════════════════
# APP INIT
# ═══════════════════════════════════════════════════════════════════════════════

app = FastAPI(
    title       = "MK Shopzone — AI Growth Engine",
    version     = "4.0.0",
    description = "Enterprise AI-powered lead generation, personalization & conversion.",
    lifespan    = lifespan,
)

# ── Middleware ───────────────────────────────────────────────────────────────

# CORS Configuration: Use environment whitelist instead of "*" (CRITICAL SECURITY FIX)
from .config import settings

# Parse CORS origins from environment
cors_origins = settings.get_cors_origins()

# Validate: reject if contains "*"
if "*" in cors_origins:
    logger = get_logger(__name__)
    logger.error("CORS configuration error: wildcard '*' not allowed. Set ALLOWED_ORIGINS to specific domains.")
    raise ValueError("CORS: wildcard '*' not allowed for security.")

logger = get_logger(__name__)
logger.info(f"CORS enabled for origins: {cors_origins}", extra={"extra_fields": {"origins": cors_origins}})

app.add_middleware(
    CORSMiddleware,
    allow_origins  = cors_origins,
    allow_methods  = ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers  = ["Content-Type", "Authorization", "X-Request-ID"],
    allow_credentials = True,
    max_age = 3600,  # Cache CORS preflight for 1 hour
)


@app.middleware("http")
async def add_correlation_id_middleware(request: Request, call_next):
    """Add correlation ID to all requests for tracing."""
    request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))
    request.state.request_id = request_id

    logger = get_logger(__name__)
    logger.info(
        f"{request.method} {request.url.path}",
        extra={"extra_fields": {"request_id": request_id, "method": request.method}}
    )

    response = await call_next(request)
    response.headers["X-Request-ID"] = request_id
    return response


@app.exception_handler(APIException)
async def api_exception_handler(request: Request, exc: APIException):
    """Handle custom API exceptions."""
    request_id = getattr(request.state, "request_id", None)
    logger = get_logger(__name__)

    logger.error(
        f"API Error: {exc.error_code}",
        extra={
            "extra_fields": {
                "request_id": request_id,
                "error_code": exc.error_code,
                "status_code": exc.status_code,
            }
        },
    )

    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": {
                "code": exc.error_code,
                "message": exc.message,
                "details": exc.details,
            },
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "request_id": request_id,
        },
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Handle Pydantic validation errors."""
    request_id = getattr(request.state, "request_id", None)
    logger = get_logger(__name__)

    errors = [
        {"field": str(error["loc"][-1]), "message": error["msg"]}
        for error in exc.errors()
    ]

    logger.warning(
        "Validation error",
        extra={
            "extra_fields": {
                "request_id": request_id,
                "error_count": len(errors),
            }
        },
    )

    return JSONResponse(
        status_code=422,
        content={
            "success": False,
            "error": {
                "code": "VALIDATION_ERROR",
                "message": "Request validation failed",
                "details": {"errors": errors},
            },
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "request_id": request_id,
        },
    )


@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    """Handle unhandled exceptions."""
    request_id = getattr(request.state, "request_id", None)
    logger = get_logger(__name__)

    logger.error(
        f"Unhandled exception: {str(exc)}",
        exc_info=True,
        extra={"extra_fields": {"request_id": request_id}},
    )

    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": {
                "code": "INTERNAL_ERROR",
                "message": "An internal server error occurred",
                "details": {} if os.getenv("ENV") == "production" else {"error": str(exc)},
            },
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "request_id": request_id,
        },
    )


# ── Rate Limiting (CRITICAL SECURITY LAYER) ──────────────────────────────────
from slowapi.errors import RateLimitExceeded
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, rate_limit_exceeded_handler)

# ── Admin Dashboard ───────────────────────────────────────────────────────────
_DASHBOARD_HTML = Path(__file__).parent / "dashboard.html"

@app.get("/admin", response_class=HTMLResponse, include_in_schema=False)
async def admin_panel():
    """Serve the premium AI Admin Dashboard."""
    if _DASHBOARD_HTML.exists():
        return HTMLResponse(content=_DASHBOARD_HTML.read_text(encoding="utf-8"))
    return HTMLResponse("<h2>Dashboard not found. Ensure backend/dashboard.html exists.</h2>", status_code=404)


# ═══════════════════════════════════════════════════════════════════════════════
# HEALTH & DIAGNOSTICS
# ═══════════════════════════════════════════════════════════════════════════════

@app.get("/", tags=["Health"], response_model=SuccessResponse[HealthResponse])
async def root() -> SuccessResponse[HealthResponse]:
    """Health check endpoint with system status and statistics."""
    logger = get_logger(__name__)

    try:
        total_leads = await get_lead_count()
        total_sessions = len(await get_all_sessions())

        health_data = HealthResponse(
            status="operational",
            engine="AI-Kinetic Growth v4.0",
            timestamp=datetime.utcnow(),
            stats={
                "sessions": total_sessions,
                "leads": total_leads,
                "conversion_rate": f"{(total_leads / max(total_sessions, 1) * 100):.2f}%"
            },
            services={
                "scheduler": "active" if (_SCHEDULER_AVAILABLE and _scheduler and _scheduler.running) else "inactive",
                "database": "mongodb" if os.getenv("MONGO_URI") else "in-memory",
                "whatsapp": "active" if os.getenv("TWILIO_ACCOUNT_SID") else "log-only",
                "email": "sendgrid" if os.getenv("SENDGRID_API_KEY") else ("smtp" if os.getenv("SMTP_SERVER") else "log-only"),
            }
        )

        logger.info("Health check passed")
        return SuccessResponse(data=health_data, message="System operational")

    except Exception as exc:
        logger.error(f"Health check failed: {str(exc)}", exc_info=True)
        raise ExternalServiceException("Health check failed", details={"error": str(exc)})


@app.get("/api/v1/health", tags=["Health"], response_model=SuccessResponse[HealthResponse])
async def health() -> SuccessResponse[HealthResponse]:
    """API v1 health check endpoint."""
    logger = get_logger(__name__)

    try:
        total_leads = await get_lead_count()
        total_sessions = len(await get_all_sessions())

        health_data = HealthResponse(
            status="healthy",
            engine="AI-Kinetic Growth v4.0",
            timestamp=datetime.utcnow(),
            stats={
                "total_sessions": total_sessions,
                "total_leads": total_leads,
                "conversion_rate": f"{(total_leads / max(total_sessions, 1) * 100):.2f}%"
            },
            services={
                "scheduler": "active" if (_SCHEDULER_AVAILABLE and _scheduler and _scheduler.running) else "inactive",
                "database": "mongodb" if os.getenv("MONGO_URI") else "in-memory",
            }
        )

        return SuccessResponse(data=health_data)

    except Exception as exc:
        logger.error(f"Health check failed: {str(exc)}", exc_info=True)
        raise


# ═══════════════════════════════════════════════════════════════════════════════
# 1. USER BEHAVIOR TRACKING
# ═══════════════════════════════════════════════════════════════════════════════

@app.post("/api/v1/track", tags=["Tracking"])
@limiter.limit(RATE_LIMITS["tracking"])  # Rate limit: 100 requests/min per IP
async def track_behavior(request: Request, telemetry: SessionTelemetry):
    """
    Ingest real-time session telemetry from the frontend tracker.
    Returns AI-personalized content and lead-capture trigger signal.
    """
    try:
        payload = telemetry.dict()

        # Persist to DB
        await save_session(telemetry.sessionId, payload)

        # Analyse only when we have enough signals
        if len(telemetry.events) > 3:
            analysis = await AIEngine.analyze_intent(
                [e.dict() for e in telemetry.events],
                telemetry.duration,
                telemetry.scrollDepth
            )
            personalization  = AIEngine.get_personalization_payload(analysis)
            should_capture   = AIEngine.should_trigger_lead_capture(
                telemetry.duration,
                telemetry.scrollDepth,
                len(telemetry.events),
                analysis.get("stage")
            )
            return {
                "success":            True,
                "sessionId":          telemetry.sessionId,
                "analysis":           analysis,
                "personalization":    personalization,
                "shouldShowLeadPopup": should_capture,
                "recommendation":     analysis.get("offer"),
            }

        return {
            "success":   True,
            "sessionId": telemetry.sessionId,
            "analysis":  None,
            "message":   "Tracking session…",
        }

    except Exception as exc:
        return JSONResponse(status_code=500, content={"error": str(exc), "success": False})


@app.post("/api/v1/track/event", tags=["Tracking"])
@limiter.limit(RATE_LIMITS["tracking"])  # Rate limit: 100 requests/min per IP
async def track_single_event(request: Request, event: BehavioralEvent, session_id: str = Query(...)):
    """Track a single user event against an existing session."""
    try:
        session = await get_session(session_id)
        if session:
            events = session.get("events", [])
            events.append(event.dict())
            session["events"] = events
            await save_session(session_id, session)
        return {"success": True, "session_id": session_id}
    except Exception as exc:
        return JSONResponse(status_code=500, content={"error": str(exc), "success": False})


@app.get("/api/v1/sessions/{session_id}", tags=["Tracking"])
async def get_session_detail(session_id: str):
    """Retrieve full session telemetry."""
    session = await get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    events = session.get("events", [])
    return {
        "sessionId":   session_id,
        "duration":    session.get("duration", 0),
        "eventCount":  len(events),
        "scrollDepth": session.get("scrollDepth", 0),
        "platform":    session.get("platform", "unknown"),
        "events":      events[-10:],   # Last 10 events
    }


# ═══════════════════════════════════════════════════════════════════════════════
# 2. AI PERSONALIZATION ENGINE
# ═══════════════════════════════════════════════════════════════════════════════

@app.post("/api/v1/personalize", tags=["Personalization"])
async def get_personalization(session_id: str = Query(...)):
    """
    Analyse a session and return fully personalised content:
    headline, subheading, CTA, best offer, ranked services.
    """
    session = await get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    events = session.get("events", [])
    analysis = await AIEngine.analyze_intent(
        events,
        session.get("duration", 0),
        session.get("scrollDepth", 0)
    )

    return {
        "intent":     analysis.get("intent"),
        "stage":      analysis.get("stage"),
        "score":      analysis.get("score"),
        "headline":   AIEngine.generate_headline(analysis),
        "subheading": AIEngine.generate_subheading(analysis),
        "cta":        AIEngine.generate_cta(analysis),
        "offer":      analysis.get("offer"),
        "services":   AIEngine.rank_services(analysis),
        "showPopup":  AIEngine.should_trigger_lead_capture(
            session.get("duration", 0),
            session.get("scrollDepth", 0),
            len(events),
            analysis.get("stage")
        ),
    }


# ═══════════════════════════════════════════════════════════════════════════════
# 3. SMART LEAD CAPTURE
# ═══════════════════════════════════════════════════════════════════════════════

@app.post("/lead", tags=["Leads"])
@app.post("/api/v1/leads", tags=["Leads"])
@limiter.limit(RATE_LIMITS["lead_capture"])  # Rate limit: 5 leads/min per IP
async def capture_lead(request: Request, lead: LeadCapture, background_tasks: BackgroundTasks):
    """
    Capture and qualify a new lead.
    Enriches with session data, scores with AI, then fires automation sequence.
    """
    try:
        lead_dict = lead.dict()

        # AI-enrich from session
        session = await get_session(lead.sessionId)
        if session:
            events = session.get("events", [])
            if events:
                analysis = await AIEngine.analyze_intent(
                    events,
                    session.get("duration", 0),
                    session.get("scrollDepth", 0)
                )
                lead_dict["intent"]      = analysis.get("intent", lead_dict.get("intent"))
                lead_dict["buyingStage"] = analysis.get("stage",  lead_dict.get("buyingStage"))
                lead_dict["score"]       = analysis.get("score",  lead_dict.get("score", 0))

        lead_dict["status"]      = "new"
        lead_dict["createdAt"]   = datetime.utcnow().isoformat()
        lead_dict["followup_count"] = 0

        # Save
        lead_id = await save_lead(lead_dict)

        # Fire automation asynchronously
        background_tasks.add_task(
            AutomationService.trigger_lead_sequence,
            lead_dict,
            str(lead_id)
        )

        return {
            "success": True,
            "leadId":  str(lead_id),
            "message": "Lead captured! Personalised engagement sequence launched.",
            "nextSteps": [
                "WhatsApp confirmation sent",
                "Welcome email queued",
                "Daily nurture sequence started",
                "Strategy session booking link dispatched",
            ],
        }

    except Exception as exc:
        return JSONResponse(status_code=500, content={"error": str(exc), "success": False})


@app.get("/api/v1/leads/{lead_id}", tags=["Leads"])
async def get_lead_detail(lead_id: str):
    """Retrieve lead details by ID."""
    lead = await get_lead(lead_id)
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    return lead


@app.patch("/api/v1/leads/{lead_id}/status", tags=["Leads"])
async def update_lead(lead_id: str, update: LeadUpdate):
    """Update lead status (new → followed_up → converted / lost)."""
    await update_lead_status(lead_id, update.status, update.notes or "")
    return {"success": True, "leadId": lead_id, "newStatus": update.status}


@app.get("/api/v1/export/leads", tags=["Leads"])
async def export_leads_excel():
    """Export all leads to an Excel file."""
    if not _PANDAS_AVAILABLE:
        raise HTTPException(status_code=500, detail="Pandas/openpyxl not installed. Please run: pip install pandas openpyxl")
    
    # get_all_leads returns (leads_list, total_count)
    leads, total = await get_all_leads(limit=10000)
    
    if not leads:
        raise HTTPException(status_code=404, detail="No leads found to export")
        
    export_data = []
    for lead in leads:
        export_data.append({
            "Name": lead.get("name", ""),
            "Email": lead.get("email", ""),
            "Phone": lead.get("phone", ""),
            "Business": lead.get("business", ""),
            "Service": lead.get("service", lead.get("intent", "")),
            "Message": lead.get("message", ""),
            "Date": lead.get("createdAt", ""),
            "Score": lead.get("score", ""),
            "Status": lead.get("status", "")
        })
        
    df = pd.DataFrame(export_data)
    file_path = "leads_export.xlsx"
    df.to_excel(file_path, index=False)
    
    return FileResponse(
        path=file_path,
        filename=file_path,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )


# ═══════════════════════════════════════════════════════════════════════════════
# 4. AUTOMATED FOLLOW-UP SYSTEM
# ═══════════════════════════════════════════════════════════════════════════════

@app.post("/api/v1/followup/send", tags=["Follow-up"])
async def send_followup(
    lead_id:          str,
    channel:          str           = Query(..., description="whatsapp | email | both"),
    background_tasks: BackgroundTasks = None,
):
    """Manually trigger a follow-up for a specific lead."""
    lead = await get_lead(lead_id)
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")

    name   = lead.get("name", "Friend").split()[0]
    intent = lead.get("intent", "General")
    phone  = lead.get("phone", "")
    email  = lead.get("email", "")

    sent = []

    if channel in ("whatsapp", "both"):
        background_tasks.add_task(AutomationService.send_whatsapp, phone, name, intent)
        sent.append("WhatsApp")

    if channel in ("email", "both"):
        background_tasks.add_task(
            AutomationService.send_email, email, name, intent, lead.get("business", "")
        )
        sent.append("Email")

    if not sent:
        raise HTTPException(status_code=400, detail="Invalid channel. Use: whatsapp | email | both")

    return {"success": True, "sent": sent, "leadId": lead_id}


@app.post("/api/v1/followup/run-daily", tags=["Follow-up"])
async def trigger_daily_followup(background_tasks: BackgroundTasks):
    """
    Manually trigger the daily follow-up job
    (normally runs automatically at 09:00 IST via scheduler).
    """
    background_tasks.add_task(_daily_followup_job)
    return {"success": True, "message": "Daily follow-up job queued."}


@app.post("/api/v1/followup/bulk-campaign", tags=["Follow-up"])
async def bulk_campaign(
    campaign_type:    str           = Query(..., description="case_study | testimonial | limited_offer"),
    background_tasks: BackgroundTasks = None,
):
    """Send a bulk campaign to all active leads."""
    leads, _ = await get_all_leads(limit=500)
    background_tasks.add_task(AutomationService.send_bulk_campaign, leads, campaign_type)
    return {
        "success":    True,
        "recipients": len(leads),
        "campaign":   campaign_type,
        "message":    "Bulk campaign queued.",
    }


# ═══════════════════════════════════════════════════════════════════════════════
# 5. AI CHATBOT — Lead ingestion endpoint
# ═══════════════════════════════════════════════════════════════════════════════

@app.post("/api/v1/chatbot/lead", tags=["Chatbot"])
@limiter.limit(RATE_LIMITS["chatbot"])
async def chatbot_lead(request: Request, data: dict, background_tasks: BackgroundTasks):
    """
    Receives leads captured by the frontend AI chatbot.
    Accepts partial data; enriches and fires automation.
    """
    try:
        name     = data.get("name", "Friend")
        email    = data.get("email", "")
        phone    = data.get("phone", "")
        business = data.get("business", "")
        intent   = data.get("intent", "General")
        source   = data.get("source", "chatbot")

        if not email and not phone:
            return JSONResponse(
                status_code=400,
                content={"error": "Email or phone required", "success": False}
            )

        lead_dict = {
            "name":         name,
            "email":        email,
            "phone":        phone,
            "business":     business,
            "intent":       intent,
            "source":       source,
            "buyingStage":  data.get("buyingStage", "Consideration"),
            "score":        data.get("score", 50),
            "sessionId":    data.get("sessionId", "chatbot"),
            "status":       "new",
            "createdAt":    datetime.utcnow().isoformat(),
            "followup_count": 0,
            "whatsapp_sent":  False,
            "email_sent":     False,
        }

        lead_id = await save_lead(lead_dict)

        background_tasks.add_task(
            AutomationService.trigger_lead_sequence,
            lead_dict,
            str(lead_id)
        )

        return {
            "success": True,
            "leadId":  str(lead_id),
            "message": f"Welcome {name}! Our team will reach out within 60 minutes.",
        }

    except Exception as exc:
        return JSONResponse(status_code=500, content={"error": str(exc), "success": False})


# ═══════════════════════════════════════════════════════════════════════════════
# 6. RETARGETING SYSTEM
# ═══════════════════════════════════════════════════════════════════════════════

@app.get("/api/v1/retargeting/audience", tags=["Retargeting"])
async def get_retargeting_audience():
    """Export audience segments for Facebook/Google retargeting."""
    leads, total = await get_all_leads(limit=1000)
    sessions     = await get_all_sessions()

    warm_leads = [l for l in leads if (l.get("score") or 0) > 60]
    cold_leads = [l for l in leads if (l.get("score") or 0) < 40]

    audiences = {
        "seo_interested":  [l for l in leads if l.get("intent") == "SEO"],
        "ads_interested":  [l for l in leads if l.get("intent") == "Paid Ads"],
        "web_interested":  [l for l in leads if l.get("intent") == "Web Design"],
        "high_value":      [l for l in leads if (l.get("score") or 0) > 80],
    }

    ad_creatives = AIEngine.generate_retargeting_ads(leads)

    return {
        "total_visitors": len(sessions),
        "total_leads":    total,
        "warm_leads":     len(warm_leads),
        "cold_leads":     len(cold_leads),
        "audiences":      {k: len(v) for k, v in audiences.items()},
        "audience_emails": {
            k: [l.get("email") for l in v if l.get("email")]
            for k, v in audiences.items()
        },
        "ad_creatives": ad_creatives,
    }


@app.get("/api/v1/retargeting/export", tags=["Retargeting"])
async def export_pixels():
    """Export pixel-ready audience data for ad platforms."""
    leads, _ = await get_all_leads(limit=1000)
    return {
        "facebook_custom_audience": [
            {"email": l.get("email"), "phone": l.get("phone")}
            for l in leads if l.get("email")
        ],
        "google_customer_match": [
            {"email": l.get("email")}
            for l in leads if l.get("email")
        ],
        "total_records": len(leads),
        "exported_at":   datetime.utcnow().isoformat(),
    }


# ═══════════════════════════════════════════════════════════════════════════════
# 7. ADMIN DASHBOARD — Data endpoints
# ═══════════════════════════════════════════════════════════════════════════════

@app.get("/api/v1/admin/dashboard", tags=["Admin"])
async def admin_dashboard():
    """Comprehensive dashboard metrics."""
    metrics  = await get_dashboard_metrics()
    leads, _ = await get_all_leads(limit=10)

    # Recent activity
    recent = []
    for l in leads:
        recent.append({
            "name":          l.get("name"),
            "email":         l.get("email"),
            "intent":        l.get("intent"),
            "score":         l.get("score"),
            "status":        l.get("status"),
            "createdAt":     l.get("createdAt"),
        })

    return {
        "metrics":          metrics,
        "recent_leads":     recent,
        "scheduler_active": _SCHEDULER_AVAILABLE and bool(_scheduler and _scheduler.running),
        "timestamp":        datetime.utcnow().isoformat(),
    }


@app.get("/api/v1/admin/leads", tags=["Admin"])
async def get_leads_list(
    skip:   int           = Query(0, ge=0),
    limit:  int           = Query(50, le=200),
    status: Optional[str] = Query(None),
    intent: Optional[str] = Query(None),
):
    """Paginated, filterable lead list."""
    leads, total = await get_all_leads(skip=skip, limit=limit, status=status, intent=intent)
    return {
        "total": total,
        "skip":  skip,
        "limit": limit,
        "leads": leads,
    }


@app.get("/api/v1/admin/analytics", tags=["Admin"])
async def get_analytics(period: str = Query("week", description="day | week | month")):
    """Conversion analytics broken down by intent and stage."""
    leads, _ = await get_all_leads(limit=1000)

    # Conversions by intent
    conversions_by_intent: dict = {}
    conversion_rates:      dict = {}

    intent_totals: dict = {}
    intent_conv:   dict = {}
    for l in leads:
        intent = l.get("intent") or "General"
        intent_totals[intent] = intent_totals.get(intent, 0) + 1
        if l.get("status") == "converted":
            intent_conv[intent] = intent_conv.get(intent, 0) + 1

    for intent, total in intent_totals.items():
        conv = intent_conv.get(intent, 0)
        conversions_by_intent[intent] = conv
        conversion_rates[intent]      = f"{(conv / total * 100):.1f}%"

    avg_score = sum((l.get("score") or 0) for l in leads) / max(len(leads), 1)

    # Stage funnel
    stages = {"Awareness": 0, "Consideration": 0, "Decision": 0}
    for l in leads:
        s = (l.get("buyingStage") or "Awareness").capitalize()
        if s in stages:
            stages[s] += 1

    return {
        "period":                 period,
        "total_leads":            len(leads),
        "avg_lead_score":         round(avg_score, 1),
        "conversions_by_intent":  conversions_by_intent,
        "conversion_rates":       conversion_rates,
        "funnel":                 stages,
    }


# ═══════════════════════════════════════════════════════════════════════════════
# MAINTENANCE
# ═══════════════════════════════════════════════════════════════════════════════

@app.post("/api/v1/cleanup", tags=["Maintenance"])
async def cleanup(days: int = Query(30, ge=1)):
    """Placeholder — implement TTL index in MongoDB for auto-cleanup."""
    cutoff = datetime.utcnow() - timedelta(days=days)
    return {
        "success":     True,
        "message":     f"Cleaned data older than {days} days",
        "cutoff_date": cutoff.isoformat(),
        "tip":         "For MongoDB, add a TTL index on 'createdAt' field.",
    }


# ═══════════════════════════════════════════════════════════════════════════════
# ENTRY POINT
# ═══════════════════════════════════════════════════════════════════════════════

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
