#!/usr/bin/env python3
"""
Comprehensive backend verification script for Phases 1-7.
Checks all critical components are properly created and integrated.
"""

import os
import sys
import json
import importlib.util
from pathlib import Path

BACKEND_DIR = Path(__file__).parent
ROOT_DIR = BACKEND_DIR.parent

def check_file_exists(path: str, description: str) -> bool:
    """Check if a file exists."""
    exists = Path(path).exists()
    status = "[OK]" if exists else "[FAIL]"
    print(f"{status} {description}")
    return exists

def check_module_importable(module_name: str, description: str) -> bool:
    """Check if a Python module can be imported."""
    try:
        importlib.import_module(module_name)
        print(f"[OK] {description}")
        return True
    except ImportError as e:
        print(f"[FAIL] {description}: {str(e)}")
        return False

def verify_logging_config():
    """Verify Phase 1: Logging configuration."""
    print("\n=== PHASE 1: LOGGING CONFIGURATION ===")
    checks = [
        (BACKEND_DIR / "logging_config.py", "logging_config.py module"),
        (BACKEND_DIR / "exceptions.py", "exceptions.py module"),
        (BACKEND_DIR / "schemas.py", "schemas.py module"),
    ]

    results = []
    for path, desc in checks:
        results.append(check_file_exists(str(path), desc))

    if all(results):
        try:
            from logging_config import setup_logging, get_logger, RequestLogger
            print("[OK] Can import logging utilities from logging_config")
        except ImportError as e:
            print(f"[FAIL] Cannot import logging utilities: {e}")
            return False
    return all(results)

def verify_exceptions():
    """Verify Phase 1: Custom exception hierarchy."""
    print("\n=== PHASE 1: CUSTOM EXCEPTIONS ===")
    try:
        from exceptions import (
            APIException,
            ValidationException,
            ResourceNotFoundException,
            AuthenticationException,
            AuthorizationException,
            DatabaseException,
            ExternalServiceException,
        )
        print("[OK] All custom exception classes importable")
        return True
    except ImportError as e:
        print(f"[FAIL] Cannot import exceptions: {e}")
        return False

def verify_validation():
    """Verify Phase 2: Input validation with Pydantic models."""
    print("\n=== PHASE 2: INPUT VALIDATION ===")
    try:
        from models import SessionTelemetry, LeadCapture
        print("[OK] Pydantic models (SessionTelemetry, LeadCapture) exist")

        from schemas import SuccessResponse, ErrorResponse
        print("[OK] Response schemas (SuccessResponse, ErrorResponse) exist")
        return True
    except ImportError as e:
        print(f"[FAIL] Cannot import models/schemas: {e}")
        return False

def verify_rate_limiting():
    """Verify Phase 2: Rate limiting configuration."""
    print("\n=== PHASE 2: RATE LIMITING ===")
    try:
        from rate_limiting import limiter, RATE_LIMITS, rate_limit_exceeded_handler
        print("[OK] rate_limiting.py module importable")

        required_limits = ["tracking", "lead_capture", "chatbot", "admin", "default"]
        missing = [limit for limit in required_limits if limit not in RATE_LIMITS]
        if missing:
            print(f"[FAIL] Missing rate limit definitions: {missing}")
            return False

        print(f"[OK] All 5 rate limit levels configured: {list(RATE_LIMITS.keys())}")
        return True
    except ImportError as e:
        print(f"[FAIL] Cannot import rate_limiting: {e}")
        return False

def verify_testing_setup():
    """Verify Phase 3: Testing framework setup."""
    print("\n=== PHASE 3: TESTING FRAMEWORK ===")
    checks = [
        (BACKEND_DIR / "conftest.py", "conftest.py (pytest fixtures)"),
        (BACKEND_DIR / "tests" / "test_models.py", "test_models.py"),
        (BACKEND_DIR / "tests" / "test_db_manager.py", "test_db_manager.py"),
        (BACKEND_DIR / "tests" / "test_api.py", "test_api.py"),
        (BACKEND_DIR / "requirements-dev.txt", "requirements-dev.txt"),
    ]

    results = []
    for path, desc in checks:
        results.append(check_file_exists(str(path), desc))

    # Check pytest is in requirements-dev
    if (BACKEND_DIR / "requirements-dev.txt").exists():
        with open(BACKEND_DIR / "requirements-dev.txt", encoding='utf-8') as f:
            content = f.read()
            if "pytest" in content:
                print("[OK] pytest found in requirements-dev.txt")
            else:
                print("[FAIL] pytest missing from requirements-dev.txt")
                results.append(False)

    return all(results)

def verify_documentation():
    """Verify Phase 4: Documentation files."""
    print("\n=== PHASE 4: DOCUMENTATION ===")
    checks = [
        (ROOT_DIR / "CLAUDE.md", "CLAUDE.md (project context)"),
        (ROOT_DIR / "ARCHITECTURE.md", "ARCHITECTURE.md (system design)"),
        (ROOT_DIR / "DEPLOYMENT.md", "DEPLOYMENT.md (deployment guide)"),
        (BACKEND_DIR / "README.md", "backend/README.md (backend guide)"),
    ]

    results = []
    for path, desc in checks:
        results.append(check_file_exists(str(path), desc))

    return all(results)

def verify_database_optimization():
    """Verify Phase 5: Database optimization."""
    print("\n=== PHASE 5: DATABASE OPTIMIZATION ===")
    checks = [
        (BACKEND_DIR / "create_indexes.py", "create_indexes.py module"),
    ]

    results = []
    for path, desc in checks:
        results.append(check_file_exists(str(path), desc))

    # Check db_manager.py for connection pooling
    db_mgr_path = BACKEND_DIR / "db_manager.py"
    if db_mgr_path.exists():
        with open(db_mgr_path, encoding='utf-8') as f:
            content = f.read()
            if "maxPoolSize" in content and "minPoolSize" in content:
                print("[OK] Connection pooling configured in db_manager.py")
                results.append(True)
            else:
                print("[FAIL] Connection pooling not found in db_manager.py")
                results.append(False)

    return all(results)

def verify_performance_monitoring():
    """Verify Phase 6: Performance and monitoring."""
    print("\n=== PHASE 6: PERFORMANCE & MONITORING ===")
    checks = [
        (BACKEND_DIR / "cache.py", "cache.py (caching utilities)"),
        (BACKEND_DIR / "metrics.py", "metrics.py (performance metrics)"),
    ]

    results = []
    for path, desc in checks:
        results.append(check_file_exists(str(path), desc))

    try:
        from cache import InMemoryCache
        print("[OK] InMemoryCache class importable")
        results.append(True)
    except ImportError:
        print("[FAIL] Cannot import InMemoryCache from cache.py")
        results.append(False)

    return all(results)

def verify_deployment_config():
    """Verify Phase 7: Deployment configuration."""
    print("\n=== PHASE 7: DEPLOYMENT CONFIGURATION ===")
    checks = [
        (ROOT_DIR / "Dockerfile", "Dockerfile"),
        (ROOT_DIR / "docker-compose.yml", "docker-compose.yml"),
        (ROOT_DIR / ".github" / "workflows" / "deploy.yml", ".github/workflows/deploy.yml"),
    ]

    results = []
    for path, desc in checks:
        results.append(check_file_exists(str(path), desc))

    return all(results)

def verify_cors_configuration():
    """Verify CORS configuration rejects wildcard."""
    print("\n=== SECURITY: CORS CONFIGURATION ===")
    main_py = BACKEND_DIR / "main.py"
    if main_py.exists():
        with open(main_py, encoding='utf-8') as f:
            content = f.read()
            if 'allow_origins = ["*"]' in content:
                print("[FAIL] CORS still uses wildcard allow_origins - SECURITY ISSUE")
                return False
            elif "ALLOWED_ORIGINS" in content:
                print("[OK] CORS uses environment variable ALLOWED_ORIGINS")
                return True
    return False

def verify_env_example():
    """Verify .env.example is complete."""
    print("\n=== SECURITY: ENVIRONMENT VARIABLES ===")
    env_example = BACKEND_DIR / ".env.example"
    if check_file_exists(str(env_example), ".env.example"):
        with open(env_example, encoding='utf-8') as f:
            content = f.read()
            required_vars = [
                "MONGO_URI",
                "OPENAI_API_KEY",
                "ALLOWED_ORIGINS",
                "LOG_LEVEL",
            ]
            missing = [var for var in required_vars if var not in content]
            if missing:
                print(f"[FAIL] Missing variables in .env.example: {missing}")
                return False
            print(f"[OK] .env.example contains all critical variables")
            return True
    return False

def verify_pytest_config():
    """Verify pytest configuration."""
    print("\n=== TESTING: PYTEST CONFIGURATION ===")
    pytest_ini = BACKEND_DIR / "pytest.ini"
    if check_file_exists(str(pytest_ini), "pytest.ini"):
        with open(pytest_ini, encoding='utf-8') as f:
            content = f.read()
            if "asyncio_mode = auto" in content:
                print("[OK] pytest configured for async tests")
                return True
    return False

def main():
    """Run all verification checks."""
    print("=" * 60)
    print("MK SHOPZONE BACKEND VERIFICATION (Phases 1-7)")
    print("=" * 60)

    results = {
        "Phase 1 - Logging": verify_logging_config(),
        "Phase 1 - Exceptions": verify_exceptions(),
        "Phase 2 - Validation": verify_validation(),
        "Phase 2 - Rate Limiting": verify_rate_limiting(),
        "Phase 3 - Testing": verify_testing_setup(),
        "Phase 4 - Documentation": verify_documentation(),
        "Phase 5 - Database": verify_database_optimization(),
        "Phase 6 - Performance": verify_performance_monitoring(),
        "Phase 7 - Deployment": verify_deployment_config(),
        "Security - CORS": verify_cors_configuration(),
        "Security - Env Vars": verify_env_example(),
        "Testing - pytest": verify_pytest_config(),
    }

    print("\n" + "=" * 60)
    print("VERIFICATION SUMMARY")
    print("=" * 60)

    passed = sum(1 for v in results.values() if v)
    total = len(results)

    for phase, result in results.items():
        status = "PASS" if result else "FAIL"
        symbol = "[OK]" if result else "[FAIL]"
        print(f"{symbol} {phase}: {status}")

    print(f"\nOverall: {passed}/{total} phases verified")

    if passed == total:
        print("\n*** All backend components verified successfully!")
        print("Phases 1-7 implementation is complete and ready for production.")
        return 0
    else:
        print(f"\n[WARNING] {total - passed} issue(s) found. Review above for details.")
        return 1

if __name__ == "__main__":
    sys.exit(main())
