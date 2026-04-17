"""
Pytest configuration and shared fixtures for MK Shopzone backend tests.
Provides database, API client, and mocking fixtures for all test modules.
"""

import pytest
import asyncio
from typing import Generator, AsyncGenerator
from fastapi.testclient import TestClient
from unittest.mock import AsyncMock, MagicMock, patch
import json
from datetime import datetime, timedelta

# Import app and dependencies
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from main import app
from db_manager import _mem_sessions, _mem_leads, _mem_followups
from models import SessionTelemetry, LeadCapture


# ────────────────────────────────────────────────────────────────────────────
# Pytest Configuration
# ────────────────────────────────────────────────────────────────────────────

pytest_plugins = ("pytest_asyncio",)


def pytest_configure(config):
    """Configure pytest and set up test environment."""
    # Set test environment variables
    os.environ["ENV"] = "test"
    os.environ["LOG_LEVEL"] = "DEBUG"
    os.environ["PREFERRED_AI_PROVIDER"] = "ollama"  # Use local Ollama for tests
    # Don't require external services in test environment
    os.environ["SENDGRID_API_KEY"] = "test-key"
    os.environ["TWILIO_ACCOUNT_SID"] = "test-sid"
    os.environ["MONGO_URI"] = ""  # Force in-memory fallback


# ────────────────────────────────────────────────────────────────────────────
# Fixtures: API Client
# ────────────────────────────────────────────────────────────────────────────

@pytest.fixture(scope="session")
def event_loop():
    """Create event loop for async tests."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture
def client():
    """Provide FastAPI test client."""
    return TestClient(app)


# ────────────────────────────────────────────────────────────────────────────
# Fixtures: Database (In-Memory Fallback)
# ────────────────────────────────────────────────────────────────────────────

@pytest.fixture(autouse=True)
def clear_memory_db():
    """Clear in-memory database before each test."""
    _mem_sessions.clear()
    _mem_leads.clear()
    _mem_followups.clear()
    yield
    # Cleanup after test
    _mem_sessions.clear()
    _mem_leads.clear()
    _mem_followups.clear()


@pytest.fixture
def sample_session_data():
    """Sample session data for testing."""
    return {
        "sessionId": "test-session-123",
        "userId": "user-456",
        "startTime": datetime.utcnow().isoformat(),
        "duration": 300,  # 5 minutes
        "scrollDepth": 75,
        "events": [
            {
                "type": "page_view",
                "page": "/services",
                "timestamp": datetime.utcnow().isoformat(),
            },
            {
                "type": "click",
                "element": "CTA Button",
                "timestamp": datetime.utcnow().isoformat(),
            },
        ],
    }


@pytest.fixture
def sample_lead_data():
    """Sample lead data for testing."""
    return {
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+1234567890",
        "business": "Acme Corp",
        "intent": "General Inquiry",
        "buyingStage": "awareness",
        "source": "website",
        "sessionId": "test-session-123",
    }


@pytest.fixture
def sample_lead_minimal():
    """Minimal valid lead data (only email required)."""
    return {
        "email": "test@example.com",
        "name": "Test User",
    }


# ────────────────────────────────────────────────────────────────────────────
# Fixtures: Mocking External Services
# ────────────────────────────────────────────────────────────────────────────

@pytest.fixture
def mock_openai():
    """Mock OpenAI API responses."""
    with patch("ai_engine.openai_client") as mock:
        mock.chat.completions.create = AsyncMock(
            return_value=MagicMock(
                choices=[
                    MagicMock(
                        message=MagicMock(
                            content=json.dumps({
                                "intent": "service_inquiry",
                                "confidence": 0.95,
                            })
                        )
                    )
                ]
            )
        )
        yield mock


@pytest.fixture
def mock_whatsapp():
    """Mock WhatsApp API responses."""
    with patch("automations.send_whatsapp_message") as mock:
        mock.return_value = {"status": "sent", "message_id": "wm-123"}
        yield mock


@pytest.fixture
def mock_email():
    """Mock email sending."""
    with patch("automations.send_email") as mock:
        mock.return_value = {"status": "sent", "message_id": "em-123"}
        yield mock


@pytest.fixture
def mock_ai_engine():
    """Mock AI engine for lead scoring."""
    with patch("ai_engine.AIEngine") as mock:
        mock.analyze_intent.return_value = {
            "intent": "service_inquiry",
            "stage": "consideration",
            "score": 8.5,
        }
        mock.score_lead.return_value = 8.5
        yield mock


# ────────────────────────────────────────────────────────────────────────────
# Fixtures: Test Data Validation
# ────────────────────────────────────────────────────────────────────────────

@pytest.fixture
def valid_session_telemetry():
    """Valid SessionTelemetry model instance."""
    return SessionTelemetry(
        sessionId="test-123",
        userId="user-123",
        duration=300,
        scrollDepth=75,
        events=[
            {
                "type": "page_view",
                "page": "/services",
                "timestamp": datetime.utcnow().isoformat(),
            }
        ],
    )


@pytest.fixture
def valid_lead_capture():
    """Valid LeadCapture model instance."""
    return LeadCapture(
        name="John Doe",
        email="john@example.com",
        phone="+1234567890",
        business="Acme Corp",
        intent="Service Inquiry",
        sessionId="test-session-123",
    )


# ────────────────────────────────────────────────────────────────────────────
# Fixtures: HTTP Response Assertions
# ────────────────────────────────────────────────────────────────────────────

@pytest.fixture
def assert_success_response():
    """Helper to assert success response format."""
    def _assert(response, expected_status=200):
        assert response.status_code == expected_status
        data = response.json()
        assert data["success"] is True
        assert "data" in data or "leadId" in data  # Either wrapped data or lead ID
        assert "timestamp" in data
        assert "request_id" in data or "requestId" in data
        return data
    return _assert


@pytest.fixture
def assert_error_response():
    """Helper to assert error response format."""
    def _assert(response, expected_status, expected_code=None):
        assert response.status_code == expected_status
        data = response.json()
        assert data["success"] is False
        assert "error" in data
        assert "code" in data["error"]
        assert "message" in data["error"]
        if expected_code:
            assert data["error"]["code"] == expected_code
        return data
    return _assert
