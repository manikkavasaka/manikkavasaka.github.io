# MK Shopzone System Architecture

## Overview

MK Shopzone is a scalable, production-ready digital marketing automation platform built with:
- **Synchronous Pattern:** Async/await throughout (FastAPI, Motor, aiosmtplib)
- **API-First Design:** RESTful API with 27 endpoints
- **Stateless Services:** Horizontally scalable
- **Event-Driven:** Webhooks for WhatsApp/Email delivery status
- **Monitoring:** Structured JSON logging with correlation IDs

## System Layers

### 1. API Layer (main.py - 906 lines)

**Responsibilities:**
- HTTP request/response handling
- Input validation via Pydantic models
- Rate limiting enforcement
- CORS policy enforcement
- Error response standardization
- Request correlation ID injection

**Key Endpoints:**
```
POST /api/v1/track              # Session telemetry capture
POST /api/v1/leads              # Lead form submission
POST /api/v1/chatbot/lead       # Chatbot interaction
GET  /api/v1/personalize        # AI-personalized content
GET  /api/v1/admin/dashboard    # Analytics aggregation
```

**Middleware Stack:**
1. RequestLogger - Adds correlation IDs
2. RateLimiter - Enforces per-endpoint limits
3. CORS - Validates origin whitelist
4. Exception Handler - Formats error responses

### 2. Business Logic Layer

#### AI Engine (ai_engine.py - 389 lines)
**Responsibilities:**
- Intent detection from text analysis
- Lead quality scoring (0-10 scale)
- Buying stage classification
- Prompt engineering for LLM calls
- Provider fallback chain (OpenAI → OpenRouter → Ollama)

**Key Functions:**
```python
analyze_intent(text: str) -> Dict  # Intent + confidence
score_lead(lead_data: Dict) -> float  # 0-10 score
determine_stage(behavior: Dict) -> str  # awareness|consideration|decision
```

**Intent Templates:**
- Demo Request
- Pricing Inquiry
- Feature Question
- Partnership
- General Inquiry

#### Automations (automations.py - 233 lines)
**Responsibilities:**
- WhatsApp message sending (Meta API/Twilio)
- Email sending (SMTP/SendGrid)
- Retry logic with exponential backoff
- Message templating
- Delivery status tracking
- Communication logging

**Key Functions:**
```python
send_whatsapp(phone: str, message: str) -> Dict
send_email(to_email: str, subject: str, html: str) -> Dict
log_communication(lead_id: str, channel: str, status: str) -> None
```

### 3. Data Layer (db_manager.py - 242 lines)

**Architecture:**
- Primary: MongoDB with async Motor driver
- Fallback: In-memory dictionaries (development)
- Automatic fallback if MONGO_URI not configured

**Collections:**
```
sessions {
  sessionId: str (unique, indexed)
  userId: str
  behaviorEvents: List[Dict]
  createdAt: datetime (TTL: 30 days)
  updatedAt: datetime
}

leads {
  _id: ObjectId (indexed)
  email: str (unique, indexed)
  phone: str (indexed)
  name: str
  business: str
  intent: str (indexed)
  status: str (indexed)
  score: float
  notes: str
  buyingStage: str (indexed)
  createdAt: datetime (TTL: 90 days, indexed)
  updatedAt: datetime
}

communication_logs {
  leadId: str (indexed)
  channel: str (whatsapp|email|sms)
  status: str (success|failed|pending)
  details: str
  timestamp: datetime (TTL: 180 days, indexed)
}
```

**Optimization:**
- Compound indexes on (status, intent)
- Connection pooling: 50 max, 10 min
- In-memory caching for dashboard queries
- TTL policies for automatic cleanup

**Data Access Pattern:**
```
API Layer → Validation (Pydantic) → Data Layer
  ↓
MongoDB/Memory Store → Format → Success/Error Response
```

### 4. Infrastructure Layer

#### Logging (logging_config.py)
**Pattern:** Structured JSON with correlation IDs

```json
{
  "timestamp": "2026-04-16T10:30:45Z",
  "level": "INFO",
  "logger": "backend.main",
  "message": "Lead captured",
  "module": "main",
  "function": "capture_lead",
  "request_id": "req-abc123xyz",
  "extra_fields": {
    "lead_id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "intent": "demo"
  }
}
```

**Handlers:**
- Console (JSON format)
- File (rotating, 10MB limit, 5 backups)
- Error File (warnings and above)

#### Exception Handling (exceptions.py)

**Hierarchy:**
```
APIException (500)
├── ValidationException (422)
├── ResourceNotFoundException (404)
├── AuthenticationException (401)
├── AuthorizationException (403)
├── ConflictException (409)
├── ExternalServiceException (503)
└── DatabaseException (500)
```

**Usage Pattern:**
```python
try:
    lead = await db_manager.get_lead(lead_id)
    if not lead:
        raise ResourceNotFoundException(f"Lead {lead_id} not found")
except Exception as e:
    logger.error(f"Lead retrieval failed: {e}")
    raise
```

#### Rate Limiting (rate_limiting.py)

**Limits by Endpoint:**
```
/api/v1/track           → 100/minute per IP
/api/v1/leads           → 5/minute per IP
/api/v1/chatbot/lead    → 20/minute per session
/api/v1/admin/*         → 1000/minute per user
Default                 → 60/minute per IP
```

**Response (429 Too Many Requests):**
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Please try again later.",
    "details": {"retry_after": "60"}
  },
  "requestId": "req-xyz789",
  "timestamp": "2026-04-16T10:30:45Z"
}
```

### 5. Validation Layer (models.py - Pydantic v2)

**Input Models:**
```python
SessionTelemetry
  - sessionId: str (required)
  - userId: Optional[str]
  - pageUrl: HttpUrl
  - behaviorData: Dict

LeadCapture
  - name: str (required)
  - email: EmailStr (required OR phone required)
  - phone: Optional[str] (pattern: ^[0-9]{10,15}$)
  - business: str (required, max 100 chars)
  - message: Optional[str]
  - intent: Optional[str]

LeadUpdate
  - status: Literal["new", "contacted", "qualified", "converted"]
  - notes: Optional[str]
```

**Response Models:**
```python
SuccessResponse[T]
  - success: bool = True
  - data: T
  - requestId: str
  - timestamp: str

ErrorResponse
  - success: bool = False
  - error:
      - code: str (e.g., VALIDATION_ERROR)
      - message: str
      - details: Optional[Dict]
  - requestId: str
  - timestamp: str
```

## Request Flow

### Lead Capture Flow
```
1. User submits form
   ↓
2. Frontend POST /api/v1/leads
   ↓
3. Rate limiter checks IP (5/min)
   ↓
4. Pydantic validates LeadCapture
   ↓
5. API Handler
   a. Save lead to DB
   b. Trigger AI scoring
   c. Trigger automations (WhatsApp + Email)
   d. Log communication
   ↓
6. Return SuccessResponse with leadId
```

### AI Analysis Flow
```
1. Chatbot sends message
   ↓
2. POST /api/v1/analyze
   ↓
3. AIEngine.analyze_intent()
   a. Clean text
   b. Call OpenAI/Router/Ollama
   c. Parse response
   d. Fall back on parse error
   ↓
4. Return intent + confidence + suggested_response
```

### Automation Flow
```
1. Lead created or status changed
   ↓
2. Automations.handle_lead_event()
   ↓
3. For each automation:
   a. Format message (template variables)
   b. Attempt send
   c. Log result
   d. Retry on failure (exponential backoff)
   ↓
4. Update communication_logs collection
```

## Database Schema

### Indexing Strategy
```sql
-- Sessions
CREATE INDEX idx_sessionId UNIQUE ON sessions(sessionId)
CREATE INDEX idx_sessions_createdAt ON sessions(createdAt) TTL(2592000)

-- Leads  
CREATE INDEX idx_leads_email UNIQUE ON leads(email) SPARSE
CREATE INDEX idx_leads_phone ON leads(phone) SPARSE
CREATE INDEX idx_leads_status ON leads(status)
CREATE INDEX idx_leads_intent ON leads(intent)
CREATE INDEX idx_leads_status_intent COMPOUND ON leads(status, intent)
CREATE INDEX idx_leads_createdAt ON leads(createdAt) TTL(7776000)

-- Communication Logs
CREATE INDEX idx_logs_leadId ON communication_logs(leadId)
CREATE INDEX idx_logs_timestamp ON communication_logs(timestamp)
CREATE INDEX idx_logs_leadId_timestamp COMPOUND ON communication_logs(leadId, timestamp)
CREATE INDEX idx_logs_timestamp_ttl ON communication_logs(timestamp) TTL(15552000)
```

**TTL Policies:**
- Sessions: 30 days (cleanup inactive sessions)
- Leads: 90 days (compliance retention)
- Logs: 180 days (audit trail)

## Caching Strategy

### In-Memory Cache
```python
# Dashboard queries (5-minute TTL)
@cached_for(seconds=300)
async def get_dashboard_metrics() -> Dict:
    # Aggregation pipeline on leads collection
    return aggregated_metrics

# Lead lookups (10-minute TTL)
@cached_for(seconds=600)
async def get_lead(lead_id: str) -> Optional[Dict]:
    # Single document fetch
    return lead_data
```

### Cache Invalidation
- Dashboard cache: Auto-expires (5 min)
- Lead cache: Invalidated on update
- Session cache: Invalidated on tracking event

## Performance Metrics

### Instrumentation
```python
# Request latency
with metrics.timer('request_latency'):
    await handle_request()

# Database queries
with metrics.timer('db_query'):
    result = await db.leads.find_one(...)

# External API calls
with metrics.timer('ai_provider_call'):
    response = await openai_client.create(...)
```

### Tracking
- Request latency (p50, p95, p99)
- Database query time
- AI provider response time
- Cache hit/miss rates
- Error rates by endpoint

## Security Model

### Authentication
- No user authentication (public API)
- Admin endpoints require ADMIN_SECRET_KEY header
- Rate limiting as primary DDoS protection

### Authorization
- Public endpoints: No auth required
- Admin endpoints: Secret key check
- No JWT/OAuth (simplified for MVP)

### Data Protection
- CORS whitelist (no wildcard)
- Input validation (Pydantic)
- No sensitive data in logs
- Connection pooling for DB
- HTTPS recommended for production

## Scalability

### Horizontal Scaling
- Stateless API servers (scale replicas)
- Centralized MongoDB (no local state)
- Load balancer in front of API servers
- Separate logging aggregation (ELK/Splunk)

### Vertical Scaling
- Connection pooling (max 50, min 10)
- Async architecture (thousands of concurrent requests)
- In-memory cache for hot queries
- Compound indexes for complex filters

## Monitoring & Observability

### Logging
- Structured JSON format
- Correlation IDs for request tracing
- Separate error log file
- Rotating file handlers

### Metrics (Future)
- Prometheus endpoint for metrics export
- Grafana dashboards
- Alert thresholds (5% error rate, >1s latency)

### Health Checks
```
GET /api/v1/health
{
  "status": "healthy",
  "database": "connected",
  "services": {
    "openai": "ready",
    "whatsapp": "ready",
    "email": "ready"
  },
  "uptime_seconds": 3600
}
```

## Deployment Architecture

```
┌─────────────────┐
│  Vite Frontend  │
│  (Static Files) │
└────────┬────────┘
         │ HTTPS
         ↓
┌─────────────────────┐
│  Nginx/Reverse Proxy│
│  (CORS, Caching)    │
└────────┬────────────┘
         │
    ┌────┴────┬────────┬────────┐
    │          │        │        │
    ↓          ↓        ↓        ↓
┌──────┐  ┌──────┐ ┌──────┐ ┌──────┐
│ API  │  │ API  │ │ API  │ │ API  │  (FastAPI replicas)
└──┬───┘  └──┬───┘ └──┬───┘ └──┬───┘
   │         │        │        │
   └─────────┼────────┼────────┘
             │        │
         ┌───┴────┬───┴──────┐
         │        │          │
         ↓        ↓          ↓
      MongoDB  Redis (optional cache)
      Atlas    Logs (ELK)
```

## Version History

- **v4.0.0** (Apr 2026): Production-ready architecture
  - Structured logging
  - Custom exception hierarchy
  - Rate limiting
  - Database optimization
  - Performance monitoring
  - Docker deployment

Last Updated: April 16, 2026
