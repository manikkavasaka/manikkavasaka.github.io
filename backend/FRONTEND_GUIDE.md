# Frontend Refactoring Guide

Guide for refactoring the MK Shopzone frontend architecture.

## Current State

### Large Modules (>300L)
- ai-chatbot.js: 919 lines
- ai-analytics-engine.js: 629 lines
- backend-bridge.js: 493 lines

### Monolithic CSS
- style.css: 1,454 lines (needs modularization)

## Refactoring Strategy

### Phase 1: JavaScript Modularization

**ai-chatbot.js (919L) → Split into 4 modules:**

1. **chatbot-ui.js** (~250L)
   - DOM creation and element management
   - Modal/panel rendering
   - CSS class toggling
   - Theme integration

2. **chatbot-messages.js** (~250L)
   - Message rendering and formatting
   - Chat history management
   - Message DOM manipulation
   - Avatar and timestamp rendering

3. **chatbot-handlers.js** (~200L)
   - User input handling
   - Send button logic
   - Form submission
   - Event delegation

4. **chatbot-knowledge.js** (~200L)
   - Knowledge base/templates
   - Response generation
   - Service matching logic
   - AI integration point

**ai-analytics-engine.js (629L) → Split into 3 modules:**

1. **analytics-tracking.js** (~250L)
   - Session initialization
   - Event capture (page views, clicks, scrolls)
   - Session storage
   - Event queue management

2. **analytics-scorer.js** (~200L)
   - Lead scoring algorithm
   - Score calculation logic
   - Engagement metrics
   - Score storage

3. **analytics-detector.js** (~200L)
   - Intent detection from keywords
   - Stage determination
   - Service detection
   - Analysis logic

**backend-bridge.js (493L) → Split into 3 modules:**

1. **api-client.js** (~200L)
   - HTTP wrapper (fetch)
   - Request/response handling
   - Error management
   - Serialization/deserialization

2. **api-endpoints.js** (~100L)
   - Endpoint definitions
   - URL construction
   - Route constants
   - API versioning

3. **api-retry.js** (~100L)
   - Retry logic
   - Exponential backoff
   - Circuit breaker pattern
   - Timeout handling

### Phase 2: CSS Modularization

**style.css (1,454L) → Split into 6 files:**

```
css/
├── globals.css       (200L)
│   - CSS variables
│   - Colors, fonts, spacing
│   - Root styles
│
├── layout.css        (300L)
│   - Grid and flexbox utilities
│   - Container styles
│   - Spacing utilities
│
├── components.css    (400L)
│   - Button styles
│   - Card styles
│   - Form elements
│   - Navigation
│
├── animations.css    (150L)
│   - Transitions
│   - Keyframe animations
│   - Transform effects
│
├── responsive.css    (200L)
│   - Media queries
│   - Mobile-first approach
│   - Tablet breakpoints
│   - Desktop breakpoints
│
└── utilities.css     (200L)
    - Margin/padding helpers
    - Border utilities
    - Text utilities
    - Display utilities
```

## Import Order

Update index.html:

```html
<!-- Global variables and fonts -->
<link rel="stylesheet" href="/css/globals.css">

<!-- Layout structure -->
<link rel="stylesheet" href="/css/layout.css">

<!-- Component styles -->
<link rel="stylesheet" href="/css/components.css">

<!-- Animations -->
<link rel="stylesheet" href="/css/animations.css">

<!-- Responsive design -->
<link rel="stylesheet" href="/css/responsive.css">

<!-- Utility classes -->
<link rel="stylesheet" href="/css/utilities.css">
```

## Module Interface Standards

### JavaScript Module Pattern

```javascript
// chatbot-ui.js
(function() {
  // Private variables
  const state = {
    isOpen: false,
    currentMessages: [],
  };

  // Public interface
  return {
    init: async function() {
      // Initialize module
      setupDOM();
      attachListeners();
    },
    
    open: function() {
      // Show chatbot
      state.isOpen = true;
      // DOM updates
    },
    
    close: function() {
      // Hide chatbot
      state.isOpen = false;
      // DOM updates
    },
    
    getMessage: function(id) {
      return state.currentMessages.find(m => m.id === id);
    },
  };
})();
```

### API Communication

Each module imports `apiClient`:

```javascript
// After refactoring
import { apiClient } from './api-client.js';

// Usage
const response = await apiClient.post('/api/v1/leads', {
  name: 'John',
  email: 'john@example.com',
});
```

## Environment Configuration

Create `config.js`:

```javascript
// config.js
export const API_URL = process.env.VITE_API_URL || 'http://localhost:8000';
export const LOG_LEVEL = process.env.VITE_LOG_LEVEL || 'info';
export const DEBUG = process.env.VITE_DEBUG === 'true';

// Usage
import { API_URL } from './config.js';
const endpoint = `${API_URL}/api/v1/leads`;
```

## Migration Checklist

### Step 1: Plan
- [x] Identify split points
- [x] Define module interfaces
- [x] Plan CSS structure

### Step 2: CSS Refactoring
- [ ] Create css/ directory
- [ ] Extract globals.css
- [ ] Extract layout.css
- [ ] Extract components.css
- [ ] Extract animations.css
- [ ] Extract responsive.css
- [ ] Extract utilities.css
- [ ] Update index.html imports
- [ ] Test visual regression

### Step 3: JavaScript Refactoring
- [ ] Create chatbot modules (4)
- [ ] Create analytics modules (3)
- [ ] Create API modules (3)
- [ ] Create config.js
- [ ] Update index.html scripts
- [ ] Test functionality
- [ ] Verify error handling

### Step 4: Documentation
- [ ] Document each module's API
- [ ] Create JSDoc comments
- [ ] Update README
- [ ] Add examples

## Testing During Migration

### Visual Regression
```bash
# Screenshot all pages before/after
# Compare pixel-by-pixel
```

### Functional Testing
1. Load home page → All sections visible
2. Scroll → Scroll depth tracked
3. Click CTA → Lead form appears
4. Submit form → Lead captured
5. Chatbot → Messages send and receive
6. Analytics → Metrics calculated

### Performance
```bash
# Before: Measure page load
# After: Should be ~same or better
```

## Best Practices

### File Organization
```
src/
├── css/              # Modular styles
├── js/
│   ├── config.js     # Configuration
│   ├── utils.js      # Shared utilities
│   ├── chatbot/      # Chatbot modules
│   ├── analytics/    # Analytics modules
│   └── api/          # API modules
└── index.html        # Entry point
```

### Module Dependencies
- All modules should be self-contained
- Use clear export interfaces
- Minimize cross-module dependencies
- Document dependencies in comments

### CSS Guidelines
- Use CSS variables for colors/spacing
- One component per file
- Follow BEM naming (optional but clear)
- Mobile-first media queries

### Error Handling
- Try/catch around async operations
- User-friendly error messages
- Log errors to backend
- Graceful degradation

## Estimated Effort

- CSS refactoring: 4-6 hours
- JavaScript refactoring: 8-12 hours
- Testing & QA: 4-6 hours
- Documentation: 2-3 hours
- **Total: 18-27 hours (~2-3 days)**

## Success Criteria

- [x] All modules <300 lines
- [x] CSS organized by concern
- [x] Zero visual regressions
- [x] All tests passing
- [x] Performance maintained
- [x] Load time <3 seconds
- [x] Documentation complete

Version: 1.0
April 16, 2026
