# Backend Testing Guide

## Setup

### Install Development Dependencies
```bash
cd backend
pip install -r requirements-dev.txt
```

### Environment Configuration
Tests automatically use in-memory database fallback. No external services required for unit tests.

## Running Tests

### All Tests
```bash
pytest tests/ -v
```

### With Coverage Report
```bash
pytest tests/ --cov=. --cov-report=html --cov-report=term
```
Coverage report opens in `htmlcov/index.html`

### Specific Test File
```bash
pytest tests/test_models.py -v
pytest tests/test_db_manager.py -v
pytest tests/test_api.py -v
```

### Specific Test Class
```bash
pytest tests/test_models.py::TestLeadCapture -v
```

### Specific Test Function
```bash
pytest tests/test_models.py::TestLeadCapture::test_valid_lead_capture_with_email -v
```

### Async Tests Only
```bash
pytest tests/test_db_manager.py -v
```

## Test Coverage Goals

| Module | Target | Current |
|--------|--------|---------|
| models.py | 90% | TBD |
| db_manager.py | 85% | TBD |
| ai_engine.py | 80% | TBD |
| automations.py | 75% | TBD |
| main.py (endpoints) | 85% | TBD |
| **Overall** | **>80%** | TBD |

## Test Structure

### Unit Tests
- `test_models.py` - Pydantic model validation (8 tests)
- `test_db_manager.py` - Database CRUD operations (12 tests)

### Integration Tests
- `test_api.py` - API endpoints and error handling (20+ tests)

### Test Fixtures (conftest.py)
- `client` - FastAPI TestClient
- `sample_session_data` - Session test data
- `sample_lead_data` - Lead test data
- `mock_openai`, `mock_whatsapp`, `mock_email` - Service mocks
- `assert_success_response`, `assert_error_response` - Assertion helpers

## Debugging Tests

### Verbose Output
```bash
pytest tests/test_api.py -vv
```

### Show Print Statements
```bash
pytest tests/ -s
```

### Drop into Debugger on Failure
```bash
pytest tests/ --pdb
```

### Stop on First Failure
```bash
pytest tests/ -x
```

## CI/CD Integration

Tests run automatically on:
1. Pre-commit (if hooks configured)
2. Pull requests (GitHub Actions)
3. Merge to main (auto-deploy only if tests pass)

## Code Quality Checks

### Type Checking
```bash
mypy . --strict
```

### Code Formatting
```bash
black tests/ --check
```

### Linting
```bash
flake8 tests/ --max-line-length=100
pylint tests/
```

## Test Philosophy

1. **Unit First** - Test components in isolation
2. **Mock External Services** - Don't call real APIs in tests
3. **In-Memory Database** - Tests use fast in-memory fallback
4. **Comprehensive Coverage** - Aim for >80% coverage
5. **Fast Execution** - Full test suite <10 seconds
6. **Clear Assertions** - Use descriptive assert messages

## Adding New Tests

1. Create test file in `tests/test_*.py`
2. Follow naming: `TestClass::test_method`
3. Use fixtures from `conftest.py`
4. Run `pytest tests/` to verify
5. Add to CI/CD pipeline in `.github/workflows/`

## Common Issues

### AsyncIO Tests Fail
Ensure `pytest-asyncio` is installed:
```bash
pip install pytest-asyncio
```

### Import Errors
Add backend directory to PYTHONPATH:
```bash
export PYTHONPATH="${PYTHONPATH}:$(pwd)"
pytest tests/
```

### Timeout Errors
Increase timeout in `pytest.ini` or via command:
```bash
pytest tests/ --timeout=30
```

### Database Tests Fail
Verify in-memory fallback is enabled (no MONGO_URI in test .env):
```bash
echo "" > .env.test  # Empty env file
pytest tests/
```
