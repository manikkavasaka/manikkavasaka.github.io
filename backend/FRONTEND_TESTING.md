# Frontend Testing Guide

Comprehensive testing strategy for MK Shopzone frontend.

## Testing Stack

### Unit Tests (Vitest)
- Fast in-memory execution
- Component logic testing
- API client testing
- Utility function testing

### E2E Tests (Playwright)
- Real browser automation
- Cross-browser testing (Chrome, Firefox, Safari)
- Mobile device testing
- User flow validation

## Setup

### Install Dependencies
```bash
npm install -D vitest @vitest/ui jsdom @testing-library/dom @testing-library/user-event
npm install -D @playwright/test
```

### Configuration Files
- `vitest.config.js` - Vitest setup
- `playwright.config.js` - Playwright setup
- `src/test/setup.js` - Test environment setup

## Unit Testing

### Run Unit Tests
```bash
# Run all unit tests
npm run test

# Watch mode (re-run on file change)
npm run test:watch

# With coverage
npm run test:coverage

# Specific test file
npm run test src/test/analytics.test.js

# UI dashboard
npm run test:ui
```

### Test Files Structure
```
src/test/
├── setup.js                  # Test environment setup
├── api-client.test.js       # API client tests
├── analytics.test.js        # Analytics engine tests
├── chatbot.test.js          # Chatbot module tests
└── forms.test.js            # Form validation tests
```

### Writing Unit Tests

Example test structure:
```javascript
import { describe, it, expect, beforeEach } from 'vitest';

describe('Module Name', () => {
  let instance;
  
  beforeEach(() => {
    instance = createModule();
  });
  
  it('should do something', () => {
    expect(instance.method()).toBe(expected);
  });
});
```

## E2E Testing

### Run E2E Tests
```bash
# Run all E2E tests
npm run test:e2e

# Specific test file
npm run test:e2e e2e/critical-flows.e2e.js

# Headed mode (see browser)
npm run test:e2e --headed

# Debug mode
npm run test:e2e --debug

# Generate report
npm run test:e2e --reporter=html
```

### Critical Test Flows

1. **Hero to Lead Capture** - CTA → Form → Success
2. **Service Exploration** - Navigate → View details → CTA
3. **Chatbot Interaction** - Open → Send message → Receive response
4. **Lead Scoring** - Fill form → Submit → Analytics tracked
5. **Notifications** - Receive email/WhatsApp confirmation
6. **Mobile Responsiveness** - Layout adapts to mobile viewport

### Writing E2E Tests

Example E2E test:
```javascript
import { test, expect } from '@playwright/test';

test('user flow: lead capture', async ({ page }) => {
  // Navigate to page
  await page.goto('/');
  
  // Interact with page
  await page.fill('input[type="email"]', 'test@example.com');
  await page.click('button:has-text("Submit")');
  
  // Assert outcomes
  const success = page.locator('text=Success');
  await expect(success).toBeVisible();
});
```

## Test Coverage

### Unit Test Coverage Goals
- API Client: >90% (all HTTP methods)
- Analytics Engine: >85% (scoring, detection)
- Chatbot: >80% (UI, handlers)
- Forms: >85% (validation, submission)
- **Overall Target: >70%**

### Coverage Report
```bash
npm run test:coverage
# Opens in: coverage/index.html
```

## Accessibility Testing

All tests verify:
- ✅ Proper heading hierarchy (h1, h2, h3)
- ✅ Form labels (explicit or placeholder)
- ✅ Color contrast (WCAG AA standard)
- ✅ Keyboard navigation
- ✅ Screen reader compatibility

## Performance Testing

E2E tests verify:
- ✅ Home page loads <3 seconds
- ✅ Images lazy load
- ✅ No layout shifts
- ✅ Smooth animations

## Debugging

### Debug Unit Tests
```bash
# View test UI
npm run test:ui

# Run specific test
npm run test -- --reporter=verbose api-client.test.js
```

### Debug E2E Tests
```bash
# Headed mode - see browser
npm run test:e2e --headed

# Debug mode - pause on each step
npm run test:e2e --debug

# Trace viewer
npx playwright show-trace trace.zip
```

## CI/CD Integration

### GitHub Actions
Tests run automatically on:
1. Push to main/develop
2. Pull requests
3. Scheduled (nightly)

```yaml
- name: Unit Tests
  run: npm run test

- name: E2E Tests
  run: npm run test:e2e

- name: Coverage
  run: npm run test:coverage
```

## Best Practices

### Unit Testing
- ✅ Mock external APIs (fetch, localStorage)
- ✅ Test edge cases (empty, null, errors)
- ✅ Use descriptive test names
- ✅ One assertion per test (preferred)
- ✅ Setup/teardown with beforeEach/afterEach

### E2E Testing
- ✅ Test user-visible outcomes
- ✅ Avoid implementation details
- ✅ Use data-testid for stable selectors
- ✅ Wait for elements (don't hardcode waits)
- ✅ Clean up after tests

### Test Data
- Use realistic test data
- Create factories for complex objects
- Mock external services
- Isolate tests (no state leaking)

## Troubleshooting

### Tests Failing

**Unit tests fail:**
```bash
# Clear cache and reinstall
rm -rf node_modules/.vite
npm test -- --clearCache
```

**E2E tests fail:**
```bash
# Check server is running
npm run dev

# Run in headed mode to see what's happening
npm run test:e2e --headed

# Check selectors changed
npx playwright inspector
```

**Flaky tests:**
- Increase timeout: `test.setTimeout(60000)`
- Use proper waits: `waitForLoadState('networkidle')`
- Don't rely on timing: avoid `sleep()`

## Performance Benchmarks

Target metrics:
- Unit test suite: <5 seconds
- E2E test suite: <2 minutes (6 browsers)
- Coverage generation: <10 seconds
- Test UI startup: <3 seconds

## Test Report

### View Results
```bash
# Unit test report
npm run test:coverage
# Opens: coverage/index.html

# E2E test report
npm run test:e2e
# Opens: playwright-report/index.html
```

## Continuous Improvement

### Metrics to Track
- Test count by category
- Coverage percentage
- Test execution time
- Flake rate
- Defect escape rate

### Regular Maintenance
- Update test data quarterly
- Review flaky tests monthly
- Refactor duplicated test code
- Archive obsolete tests

## Resources

- Vitest Docs: https://vitest.dev
- Playwright Docs: https://playwright.dev
- Testing Best Practices: https://testingjavascript.com

## Quick Reference

```bash
# Development
npm run dev              # Start dev server
npm run build           # Build for production

# Testing
npm run test            # Run unit tests
npm run test:watch     # Watch mode
npm run test:ui        # UI dashboard
npm run test:coverage  # With coverage report

# E2E Testing
npm run test:e2e       # Run E2E tests
npm run test:e2e --headed  # With browser visible
npm run test:e2e --debug   # Debug mode

# Linting & Formatting
npm run lint           # Check code style
npm run format         # Auto-format code
```

Version: 1.0
April 16, 2026
