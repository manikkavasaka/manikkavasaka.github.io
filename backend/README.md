# MK Shopzone Backend API

Production-ready FastAPI backend powering digital marketing automation.

## Quick Start

```bash
# 1. Setup environment
cp .env.example .env
# Edit .env with your API keys

# 2. Install dependencies
pip install -r requirements.txt

# 3. Run server
python run.py
```

Server: http://localhost:8000
- Docs: http://localhost:8000/docs
- Health: http://localhost:8000/api/v1/health

## API (27 Endpoints)

See `/docs` for interactive documentation.

**Health & Admin:** GET /api/v1/health, GET /admin/dashboard
**Tracking:** POST /track, POST /track/event (100/min limit)
**Leads:** POST /leads, GET /leads, GET /leads/{id} (5/min limit)
**AI:** POST /analyze, POST /personalize, POST /chatbot/lead
**Sessions:** POST /sessions, GET /sessions, GET /sessions/{id}
**Automations:** POST /whatsapp/send, POST /email/send
**Audience:** POST /audience/build, GET /audience

## Testing

```bash
pip install -r requirements-dev.txt
pytest tests/ --cov=. --cov-report=html
```

Target: >80% coverage

## Code Quality

```bash
mypy . --strict      # Type checking
black . --check      # Formatting
flake8 .            # Linting
```

## Structure

```
backend/
├── main.py           # 27 API endpoints
├── ai_engine.py      # Intent & scoring
├── automations.py    # WhatsApp/Email
├── db_manager.py     # Data layer
├── models.py         # Validation
├── config.py         # Configuration
├── logging_config.py # Logging
├── exceptions.py     # Errors
├── schemas.py        # Responses
├── rate_limiting.py  # Rate limits
├── conftest.py       # Test fixtures
└── tests/            # Test files
```

## Environment

See `.env.example`. Critical:
- MONGO_URI (optional, in-memory fallback)
- PREFERRED_AI_PROVIDER: openai|openrouter|ollama
- OPENAI_API_KEY or OPENROUTER_API_KEY
- Email service: SENDGRID_API_KEY or SMTP_*
- WhatsApp: TWILIO_* or META_ACCESS_TOKEN
- ADMIN_SECRET_KEY (change in production)
- ALLOWED_ORIGINS (CORS whitelist)

## Database

Collections: leads, sessions, communication_logs

Falls back to in-memory if MONGO_URI not set.

## Security

- CORS: Whitelist-based (not wildcard)
- Rate Limits: 100/min tracking, 5/min leads
- Validation: Pydantic on all inputs
- Errors: No stack traces in production
- Logging: JSON with correlation IDs

## Development

```bash
python run.py                              # Start
pytest tests/ --cov=.                      # Test
mypy . --strict && black . && flake8 .    # Quality
```

## Documentation

- **Architecture:** ARCHITECTURE.md
- **Testing:** TESTING.md
- **Project:** CLAUDE.md
- **API:** /docs endpoint

## Troubleshooting

**MongoDB failed:** Falls back to in-memory store automatically
**Rate limit:** Expected (configurable in rate_limiting.py)
**Import error:** export PYTHONPATH="$(pwd)"
**Test failure:** pytest tests/ -vv

Version: 4.0.0
Last Updated: April 16, 2026
