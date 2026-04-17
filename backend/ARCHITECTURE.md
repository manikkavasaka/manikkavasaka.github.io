# MK Shopzone - Technical Architecture

## System Design

### Layers
1. Presentation - Frontend (HTML + Vanilla JS)
2. API - FastAPI endpoints (27 routes)
3. Business Logic - AI Engine, Automations
4. Data Access - Database Manager
5. Infrastructure - MongoDB, External APIs

### Pattern
- Backend: FastAPI (async, ASGI)
- Database: MongoDB with Motor async driver
- Validation: Pydantic v2 models
- API Style: RESTful JSON

## Backend Modules

### main.py (906 lines)
Defines 27 endpoints in sections:
- Initialization & middleware (CORS, rate limiting)
- Behavior tracking (POST /api/v1/track)
- Lead capture (POST /api/v1/leads)
- AI chatbot (POST /api/v1/chatbot/lead)
- AI & admin endpoints

### ai_engine.py (389 lines)
Singleton for AI operations:
- Intent detection from events
- Lead scoring (0-10)
- Buying stage determination

### automations.py (233 lines)
Multi-channel communication:
- WhatsApp via Twilio/Meta
- Email via SendGrid/SMTP
- Follow-up scheduling

### db_manager.py (242 lines)
Data persistence (Adapter pattern):
- Production: MongoDB via Motor
- Development: In-memory dict fallback
- Collections: leads, sessions, communication_logs

## Request Flow

HTTP Request
  |
[FastAPI Router] - Route matching
  |
[Rate Limiter] - Check limits via slowapi
  |
[Pydantic Validator] - Validate request body
  |
[Endpoint Handler] - Process request
  |
[Business Logic] - AI, Automations, Database
  |
[Response Schema] - Wrap in SuccessResponse
  |
[Exception Handler] - Catch errors
  |
HTTP Response

## Security

### CORS
- Whitelist-based (NOT wildcard "*")
- Validation rejects any wildcard
- Configurable via ALLOWED_ORIGINS env

### Rate Limiting
- Tracking: 100/min per IP
- Lead capture: 5/min per IP
- Chatbot: 20/min per session
- Admin: 1000/min per user

### Validation
- Email format (EmailStr)
- Phone format checking
- Required field enforcement
- Parameterized queries (no SQL injection)

### Error Handling
- Custom exception hierarchy
- Standardized error responses
- No stack traces in production
- Correlation IDs for tracing

## Data Models

### Lead
- _id, name, email, phone, business
- intent, buyingStage, score (0-10)
- status: new|contacted|qualified|converted
- source: form|chatbot|import
- timestamps: createdAt, updatedAt

### Session
- sessionId, userId, duration (seconds)
- scrollDepth (0-100), startTime
- events: [{type, page, timestamp}]
- updatedAt

### Communication Log
- leadId, channel (whatsapp|email|sms)
- status (sent|failed|pending)
- details: string
- timestamp

## Frontend Modules

### ai-chatbot.js (919 lines)
- Chatbot UI and message handling
- Knowledge base integration
- Response generation

### ai-analytics-engine.js (629 lines)
- Session tracking and metrics
- Behavioral analysis
- Lead scoring
- Intent detection

### backend-bridge.js (493 lines)
- HTTP client for API calls
- Request/response handling
- Error management
- Retry logic

### Other Modules
- doc-tracker.js - Document engagement
- email-collector.js - Email capture
- retargeting-audience.js - Audience building
- auth-helper.js - Admin authentication
- utils.js - Shared utilities

## Database Architecture

### Indexes
- leads: email (unique), phone, status, intent
- sessions: sessionId (unique), createdAt (TTL 30 days)
- communication_logs: leadId, timestamp

### Connection
- Production: MongoDB Atlas
- Development: In-memory fallback
- Pool size: configurable (default 10-50)

## Async Design

All I/O operations are async:
- Database queries via Motor
- External API calls (OpenAI, Twilio, SendGrid)
- File operations
- Network requests

Benefits:
- High concurrency support
- Non-blocking architecture
- Efficient resource usage

## Integration Points

### External APIs
1. OpenAI/OpenRouter/Ollama - AI analysis
2. Twilio/Meta - WhatsApp messaging
3. SendGrid/SMTP - Email delivery
4. MongoDB Atlas - Data persistence

### Error Handling
- Graceful degradation when APIs fail
- Fallback to defaults or in-memory storage
- Retry logic with exponential backoff
- Detailed error logging

## Performance Targets

| Operation | Target | Notes |
|-----------|--------|-------|
| Lead capture | <200ms | Excludes external API |
| Session save | <100ms | Database write |
| AI analysis | 1-3s | Depends on provider |
| List leads | <500ms | With pagination |
| Rate limit | <1ms | In-memory check |

## Testing Architecture

### Unit Tests (conftest.py fixtures)
- Model validation (Pydantic)
- Database CRUD operations
- AI logic (no API calls)
- Exception handling

### Integration Tests
- API endpoint functionality
- Error response formats
- Rate limiting behavior
- End-to-end flows

### Mocking
- OpenAI API responses
- WhatsApp API responses
- Email sending
- External service calls

## Code Organization

```
backend/
├── main.py              # API endpoints
├── ai_engine.py         # AI logic
├── automations.py       # Communication
├── db_manager.py        # Data layer
├── models.py            # Pydantic schemas
├── config.py            # Config management
├── logging_config.py    # Logging setup
├── exceptions.py        # Error classes
├── schemas.py           # Response wrappers
├── rate_limiting.py     # Rate limiter config
├── conftest.py          # Test fixtures
├── tests/
│   ├── test_models.py       # Model validation
│   ├── test_db_manager.py   # Database tests
│   └── test_api.py          # API tests
├── requirements.txt
├── requirements-dev.txt
└── pytest.ini
```

## Key Design Decisions

1. **Async Architecture** - FastAPI + Motor + asyncio
   - Enables high concurrency
   - Non-blocking I/O operations
   - Efficient resource usage

2. **Adapter Pattern for Database** - MongoDB + in-memory fallback
   - Production reliability
   - Development flexibility
   - Zero production infrastructure requirement

3. **Pydantic Validation** - All inputs validated
   - Type-safe operations
   - Early error detection
   - Consistent API contracts

4. **Custom Exception Hierarchy** - Semantic errors
   - HTTP status mapping
   - Clear error messages
   - Structured error responses

5. **Rate Limiting** - slowapi library
   - DDoS protection
   - Spam prevention
   - Configurable per endpoint

6. **CORS Whitelist** - Explicit origins only
   - Security by default
   - Prevents CSRF attacks
   - Environment-based configuration

Last Updated: April 16, 2026 | Version: 4.0.0
