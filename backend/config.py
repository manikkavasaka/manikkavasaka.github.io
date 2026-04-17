"""
Centralized configuration management for MK Shopzone backend.
Loads and validates environment variables on startup.
"""

import os
from typing import Optional
from pydantic import BaseSettings, validator


class Settings(BaseSettings):
    """Application configuration from environment variables."""

    # ────── Database ──────
    mongo_uri: Optional[str] = None
    mongo_db: str = "mkshopzone_ai"

    # ────── AI Provider ──────
    preferred_ai_provider: str = "openai"  # openai | openrouter | ollama
    openai_api_key: Optional[str] = None
    openrouter_api_key: Optional[str] = None
    ollama_base_url: str = "http://localhost:11434"
    ollama_model: str = "codellama"
    ai_model: str = "anthropic/claude-3.5-sonnet"

    # ────── WhatsApp ──────
    twilio_account_sid: Optional[str] = None
    twilio_auth_token: Optional[str] = None
    twilio_whatsapp_number: Optional[str] = None
    meta_phone_number_id: Optional[str] = None
    meta_business_account_id: Optional[str] = None
    meta_access_token: Optional[str] = None

    # ────── Email ──────
    sendgrid_api_key: Optional[str] = None
    sendgrid_from_email: Optional[str] = None
    sendgrid_from_name: str = "MK Shopzone"
    smtp_server: Optional[str] = None
    smtp_port: int = 587
    smtp_user: Optional[str] = None
    smtp_password: Optional[str] = None

    # ────── Logging ──────
    log_level: str = "INFO"
    log_dir: str = "logs"

    # ────── Security ──────
    admin_secret_key: str = "change-in-production"
    allowed_origins: str = "http://localhost:5173,http://localhost:3001"

    # ────── Scheduler ──────
    scheduler_hour: int = 9
    scheduler_minute: int = 0

    # ────── API ──────
    api_title: str = "MK Shopzone — AI Growth Engine"
    api_version: str = "4.0.0"
    cors_credentials: bool = True
    env: str = "development"  # development | production

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False

    @validator("preferred_ai_provider")
    def validate_ai_provider(cls, v):
        """Validate AI provider choice."""
        valid_providers = ["openai", "openrouter", "ollama"]
        if v not in valid_providers:
            raise ValueError(f"PREFERRED_AI_PROVIDER must be one of {valid_providers}")
        return v

    def validate_required_env_vars(self) -> None:
        """Validate that required environment variables are set."""
        errors = []

        # At least one AI provider must be configured
        if (
            not self.openai_api_key
            and not self.openrouter_api_key
            and self.preferred_ai_provider != "ollama"
        ):
            errors.append(
                "At least one AI provider must be configured: "
                "OPENAI_API_KEY, OPENROUTER_API_KEY, or OLLAMA setup"
            )

        # If using OpenRouter, require API key
        if self.preferred_ai_provider == "openrouter" and not self.openrouter_api_key:
            errors.append("OPENROUTER_API_KEY required when PREFERRED_AI_PROVIDER=openrouter")

        # If using OpenAI, require API key
        if self.preferred_ai_provider == "openai" and not self.openai_api_key:
            errors.append("OPENAI_API_KEY required when PREFERRED_AI_PROVIDER=openai")

        if errors:
            raise ValueError(f"Missing required configuration:\n" + "\n".join(errors))

    def get_cors_origins(self) -> list:
        """Parse CORS origins from comma-separated string."""
        return [origin.strip() for origin in self.allowed_origins.split(",")]


# ────── Global Settings Instance ──────
try:
    settings = Settings()
    # Validate required environment variables
    settings.validate_required_env_vars()
except ValueError as exc:
    # Log warning but don't fail - some features can work without all config
    import logging

    logger = logging.getLogger(__name__)
    logger.warning(f"Configuration warning: {str(exc)}")
    settings = Settings()


# ────── Configuration Validators ──────


def validate_api_keys() -> dict:
    """Validate and report which external services are configured."""
    services = {
        "ai_provider": settings.preferred_ai_provider,
        "database": "mongodb" if settings.mongo_uri else "in-memory (dev)",
        "whatsapp": "enabled" if settings.twilio_account_sid else "disabled",
        "email": (
            "sendgrid"
            if settings.sendgrid_api_key
            else ("smtp" if settings.smtp_server else "disabled")
        ),
    }
    return services


def get_database_url() -> Optional[str]:
    """Get database connection URL."""
    return settings.mongo_uri if settings.mongo_uri else None


def is_production() -> bool:
    """Check if running in production mode."""
    return settings.env == "production"
