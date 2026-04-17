"""
run.py — Standalone entry point for the MK Shopzone AI Backend.

Usage:
    python backend/run.py                  # Production
    python backend/run.py --reload         # Dev (hot-reload)
    python backend/run.py --port 9000      # Custom port
"""

import sys
import os
import argparse
import io

# Make sure the parent directory is on sys.path so relative imports work
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Fix stdout encoding for Windows
if sys.stdout.encoding != 'utf-8':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

BANNER = """
========================================================
   MK SHOPZONE -- AI Growth Engine v4.0
   Autonomous Lead Generation & Conversion System
========================================================
Features:
   [OK] Real-time behavior tracking
   [OK] AI intent detection (OpenAI GPT-4o)
   [OK] Dynamic content personalization
   [OK] Smart lead capture & scoring
   [OK] Automated WhatsApp follow-ups (Twilio)
   [OK] Automated Email sequences (SendGrid / SMTP)
   [OK] Daily nurture scheduler (APScheduler)
   [OK] Retargeting audience builder
   [OK] Admin dashboard & analytics
========================================================
Endpoints:
   API Docs  ->  http://localhost:8000/docs
   Health    ->  http://localhost:8000/api/v1/health
   Dashboard ->  http://localhost:8000/admin
========================================================
"""

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="MK Shopzone AI Backend")
    parser.add_argument("--host",   default="127.0.0.1", help="Bind host")
    parser.add_argument("--port",   default=8000, type=int, help="Bind port")
    parser.add_argument("--reload", action="store_true",   help="Enable hot-reload")
    args = parser.parse_args()

    print(BANNER)
    print(f"  Starting on http://{args.host}:{args.port}")
    print(f"  Hot-reload: {'ON' if args.reload else 'OFF'}\n")

    import uvicorn
    uvicorn.run(
        "backend.main:app",
        host   = args.host,
        port   = args.port,
        reload = args.reload,
        log_level = "info",
    )
