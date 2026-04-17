# MK Shopzone — Project Context for AI Assistance

## Project Overview

**MK Shopzone** is a production-grade digital marketing automation platform combining:
- AI-powered lead scoring and personalization
- Multi-channel communication (WhatsApp, Email)
- Real-time behavioral tracking and analytics
- Smart lead capture via web forms and chatbot
- Automated follow-up sequences

**Technology Stack:**
- Backend: FastAPI (Python) with async architecture
- Frontend: HTML + Vanilla JavaScript (Vite bundled)
- Database: MongoDB (Motor async driver) + in-memory fallback
- AI Providers: OpenAI, OpenRouter, Ollama (pluggable)
- Automation: WhatsApp (Meta API/Twilio), Email (SMTP/SendGrid)
- Scheduling: APScheduler for background jobs
- Rate Limiting: slowapi for DDoS/spam protection
- Testing: pytest for backend, Vitest + Playwright for frontend

## Architecture

### Backend Structure
```
backend/
├── main.py                 # 906 lines: 27 FastAPI endpoints
├── ai_engine.py           # 389 lines: Intent detection, lead scoring
├── automations.py         # 233 lines: WhatsApp/Email sending
├── db_manager.py          # 242 lines: Data abstraction layer
├── models.py              # Pydantic v2 validation schemas
├── logging_config.py      # Structured JSON logging
├── exceptions.py          # Custom exception hierarchy
├── schemas.py             # Response wrapper schemas
├── rate_limiting.py       # slowapi rate limiting config
├── cache.py               # In-memory caching utilities
├── metrics.py             # Performance metrics collection
├── config.py              # Centralized config management
├── create_indexes.py      # Database index creation
├── requirements.txt       # Python dependencies
├── requirements-dev.txt   # Dev/test dependencies
├── pytest.ini             # Test configuration
├── conftest.py            # pytest fixtures and setup
└── tests/
    ├── test_models.py     # Model validation tests
    ├── test_db_manager.py # Database operation tests
    └── test_api.py        # API endpoint tests
```

### Data Flow
```
User Browser
    |
[Frontend JS] → Track behavior, capture leads, show chatbot
    |
[FastAPI Backend]
    |- POST /api/v1/track - Save session behavior
    |- POST /api/v1/leads - Capture lead data
    |- POST /api/v1/chatbot/lead - Chatbot submissions
    |- GET /api/v1/personalize - AI-personalized content
    |
[AI Engine]
    |- Analyze intent
    |- Score lead (0-10)
    |- Determine buying stage
    |
[Automations]
    |- Send WhatsApp confirmation
    |- Send welcome email
    |- Schedule follow-ups
    |
[MongoDB] - Persist data
```

## Running Locally

### Backend
```
cd backend
pip install -r requirements.txt
python run.py
# http://localhost:8000
# Docs: http://localhost:8000/docs
```

### Frontend
```
npm install
npm run dev
# http://localhost:5173
```

### Tests
```
cd backend
pip install -r requirements-dev.txt
pytest tests/ --cov=. --cov-report=html
```

## API Endpoints (27 total)

### Health & Admin (3)
- GET /api/v1/health - System health check
- GET /api/v1/admin/dashboard - Analytics dashboard
- GET /api/v1/admin/leads - Lead management

### Tracking (2)
- POST /api/v1/track - Save session behavior
- POST /api/v1/track/event - Log single event

### Lead Capture (3)
- POST /api/v1/leads - Capture from contact form
- GET /api/v1/leads/{id} - Retrieve lead details
- PATCH /api/v1/leads/{id}/status - Update lead status

### AI & Personalization (4)
- POST /api/v1/analyze - Analyze session behavior
- POST /api/v1/personalize - Get personalized content
- POST /api/v1/chatbot/lead - Chatbot lead submission
- POST /api/v1/score-lead - AI lead scoring

### Sessions (3)
- GET /api/v1/sessions/{id} - Get session details
- GET /api/v1/sessions - List all sessions
- POST /api/v1/sessions - Create new session

## Security Features

### CORS
- Whitelist-based (not wildcard "*")
- Configurable via ALLOWED_ORIGINS env var
- Rejects any wildcard origins at startup

### Rate Limiting (slowapi)
- Public tracking: 100/min per IP
- Lead capture: 5/min per IP (prevent spam)
- Chatbot: 20/min per session
- Admin: 1000/min per authenticated user
- Default: 60/min per IP

### Input Validation
- All endpoints use Pydantic models
- Email validated with EmailStr
- Phone format validated
- Business name length limited

### Logging
- Structured JSON logging to console and files
- Rotating file handlers (10MB limit, 5 backups)
- Correlation IDs for request tracing
- Separate error.log for warnings and above

### Error Handling
- Custom exception hierarchy
- Standardized error responses
- No stack traces in production
- Correlation IDs for tracing

## Environment Variables

Critical ones (see .env.example for full list):
- MONGO_URI - MongoDB Atlas connection
- MONGO_DB - Database name
- PREFERRED_AI_PROVIDER - openai | openrouter | ollama
- OPENAI_API_KEY - For OpenAI
- SENDGRID_API_KEY - For email
- TWILIO_ACCOUNT_SID - For WhatsApp
- ADMIN_SECRET_KEY - For admin endpoints
- ALLOWED_ORIGINS - CORS whitelist
- LOG_LEVEL - Logging level (DEBUG, INFO, WARNING, ERROR)
- LOG_DIR - Logging directory (default: logs/)

## Code Style

**Python:**
- Formatter: Black
- Linter: flake8 + pylint
- Type Checker: mypy --strict
- All I/O is async (FastAPI + Motor)

**JavaScript:**
- Vanilla JS (no framework)
- Module pattern (self-contained files)
- camelCase naming
- JSDoc for public APIs

## Common Tasks

### Add New Endpoint
1. Define Pydantic model in models.py
2. Add handler in main.py with docstring
3. Add rate limiting decorator if public
4. Add tests in tests/test_api.py

### Modify AI Logic
1. Edit AIEngine class in ai_engine.py
2. Update intent templates if needed
3. Add test in tests/test_ai_engine.py

### Add Automation
1. Add send function in automations.py
2. Update AutomationService
3. Add error handling
4. Add tests with mocks

## Testing

```
pytest tests/ --cov=. --cov-report=html  # All tests with coverage
pytest tests/test_models.py -v            # Only model validation
pytest tests/test_db_manager.py -v        # Only database tests
pytest tests/test_api.py -v               # Only API endpoint tests
```

Target Coverage: >80% (backend), >70% (frontend)

## Troubleshooting

**MongoDB connection failed**
→ Falls back to in-memory store automatically
→ Check logs for details

**Rate limit exceeded**
→ Normal on public endpoints (expected behavior)
→ Increase limits in rate_limiting.py if needed

**Import error for models**
→ Ensure PYTHONPATH includes backend directory
→ Run from backend/: export PYTHONPATH="$(pwd)"

**Tests failing**
→ Run: pytest tests/ -vv
→ Ensure no .env file (tests use in-memory DB)
→ Ensure requirements-dev.txt installed

## File Ownership

| File | Lines | Purpose |
|------|-------|---------|
| main.py | 906 | All 27 API endpoints |
| ai_engine.py | 389 | Intent detection, scoring |
| automations.py | 233 | WhatsApp/Email sending |
| db_manager.py | 242 | Data CRUD + MongoDB/memory |
| conftest.py | 200+ | Test fixtures |
| index.html | 800+ | Frontend UI and forms |

## Production Deployment

See DEPLOYMENT.md for complete deployment guide including:
- Docker containerization
- Docker Compose setup
- Kubernetes deployment
- CI/CD pipeline configuration
- Health checks and monitoring
- Scaling considerations

## References

- FastAPI: https://fastapi.tiangolo.com
- Motor: https://motor.readthedocs.io
- Pydantic: https://docs.pydantic.dev
- pytest: https://docs.pytest.org
- slowapi: https://slowapi.readthedocs.io

Last Updated: April 16, 2026 | Version: 4.0.0
