# AI Automation System - Technical API Reference

## Table of Contents
1. [Behavior Tracker API](#behavior-tracker-api)
2. [AI Analytics Engine API](#ai-analytics-engine-api)
3. [Personalization Engine API](#personalization-engine-api)
4. [AI Chatbot API](#ai-chatbot-api)
5. [Lead System API](#lead-system-api)

---

## Behavior Tracker API

### Description
Real-time user behavior tracking system that monitors engagement metrics.

### Initialization
```javascript
window.behaviorTracker // Auto-initialized on page load
```

### Methods

#### `trackEvent(eventName, data)`
Track a custom event.

**Parameters:**
- `eventName` (string): Event name (e.g., 'click', 'scroll_50')
- `data` (object): Event data

**Example:**
```javascript
window.behaviorTracker.trackEvent('custom_event', {
    page: 'seo',
    user_action: 'clicked_cta'
});
```

#### `getProfile()`
Get comprehensive user profile.

**Returns:** Object with user behavior metrics
```javascript
{
  sessionId: "sess_1634567890_abc123",
  sessionDuration: 300000,
  currentPage: "seo",
  pagesVisited: ["home", "seo", "about"],
  pageData: {
    home: { page: "home", enteredAt: 1634567890, timeSpent: 45000, scrollDepth: 50 },
    seo: { page: "seo", enteredAt: 1634567935, timeSpent: 255000, scrollDepth: 87 }
  },
  totalClicks: 8,
  scrollDepth: 87,
  userIntent: "seo",
  buyingStage: "Decision",
  topClicks: [
    { element: "a", text: "See SEO Results", href: "seo.html", service: "seo" }
  ],
  eventCount: 42
}
```

#### `updateBuyingStage()`
Recalculate current buying stage.

**Returns:** String - 'Awareness', 'Consideration', or 'Decision'
```javascript
const stage = window.behaviorTracker.updateBuyingStage(); // "Decision"
```

#### `export()`
Export all session data.

**Returns:** Complete session object with events and clicks
```javascript
const data = window.behaviorTracker.export();
// Send to server/CRM
```

#### `clear()`
Clear all session data.

**Example:**
```javascript
window.behaviorTracker.clear(); // Reset tracking
```

### Properties

```javascript
window.behaviorTracker.sessionId       // Current session ID
window.behaviorTracker.events          // Array of tracked events
window.behaviorTracker.clicks          // Array of tracked clicks
window.behaviorTracker.pageData        // Object with per-page metrics
window.behaviorTracker.userIntent      // Current user intent
window.behaviorTracker.buyingStage     // Current buying stage
window.behaviorTracker.scrollDepth     // Maximum scroll depth (0-100)
```

---

## AI Analytics Engine API

### Description
Intelligent analysis system that converts behavior data into actionable insights and strategies.

### Initialization
```javascript
window.aiAnalyticsEngine // Auto-initialized on page load
```

### Methods

#### `analyzeUserBehavior(behaviorData)`
Analyze user behavior and generate complete strategy.

**Parameters:**
- `behaviorData` (object): User profile from behavior tracker

**Returns:** Comprehensive analysis object
```javascript
const profile = window.behaviorTracker.getProfile();
const analysis = window.aiAnalyticsEngine.analyzeUserBehavior(profile);

// Result:
{
  user_intent: "seo",
  buying_stage: "Decision",
  recommended_service: "Advanced SEO",
  headline: "Dominate Google Search. Get #1 Rankings in Your Industry.",
  subheading: "We engineer long-term organic dominance using proven strategies...",
  cta: "Start SEO Growth Today",
  popup_strategy: "Show immediately - strong conversion signal",
  offer: "Free SEO Audit ($5000 value)",
  conversion_signals: ["High engagement", "Ready to convert", "Decision stage detected"],
  whatsapp_message: "Hey! 👋 Saw you checking out our SEO services...",
  email_subject: "Your SEO Opportunity (We Found $XX,XXX in Lost Revenue)",
  email_message: "Hi [Name],\n\nWe analyzed your site and found...",
  retargeting_ad: "Not ranking on Google? We put 47 clients in the top 3...",
  confidence_score: 92
}
```

#### `exportAnalysis(behaviorData)`
Export complete analysis with recommendations.

**Parameters:**
- `behaviorData` (object): User profile

**Returns:** Analysis with actionable recommendations
```javascript
const report = window.aiAnalyticsEngine.exportAnalysis(profile);
// Includes timestamp, analysis, behaviors, and recommendations
```

### Properties & Intents

```javascript
// Intent categories available
window.aiAnalyticsEngine.intents = {
  seo: { keywords: [...], pages: [...], score: 0 },
  ads: { keywords: [...], pages: [...], score: 0 },
  web: { keywords: [...], pages: [...], score: 0 },
  social: { keywords: [...], pages: [...], score: 0 },
  app: { keywords: [...], pages: [...], score: 0 },
  email: { keywords: [...], pages: [...], score: 0 },
  video: { keywords: [...], pages: [...], score: 0 },
  ecommerce: { keywords: [...], pages: [...], score: 0 }
}

// Buying stages
window.aiAnalyticsEngine.buyingStages = {
  awareness: { signals: [...], timeThreshold: 30000, clickThreshold: 2 },
  consideration: { signals: [...], timeThreshold: 120000, clickThreshold: 5 },
  decision: { signals: [...], timeThreshold: 180000, clickThreshold: 8 }
}

// Service strategies with customizable content
window.aiAnalyticsEngine.serviceStrategies = {
  seo: { headlines: [...], ctas: [...], offers: [...], whatsappTemplates: [...] }
  // ... and 7 more services
}
```

---

## Personalization Engine API

### Description
Dynamically updates website content based on user behavior analysis.

### Initialization
```javascript
window.personalizationEngine // Auto-initialized on page load
```

### Methods

#### `applyDynamicContent(analysis)`
Update page content based on analysis.

**Parameters:**
- `analysis` (object): Output from AI Analytics Engine

**Updates:**
- H1 headlines
- Subheadings
- CTAs
- Form pre-population
- Automatic chatbot triggers

**Example:**
```javascript
const analysis = window.aiAnalyticsEngine.analyzeUserBehavior(profile);
window.personalizationEngine.applyDynamicContent(analysis);

// Result: Page headlines, CTAs updated in real-time
```

#### `updateProfile(profileData)`
Update internal profile data.

**Parameters:**
- `profileData` (object): User profile information

**Example:**
```javascript
window.personalizationEngine.updateProfile({
  interestedService: "seo",
  buyingStage: "Decision"
});
```

### Properties

```javascript
window.personalizationEngine.analysis // Current analysis object
```

---

## AI Chatbot API

### Description
Conversational AI assistant that understands user intent and captures leads.

### Initialization
```javascript
window.aiChatbot // Auto-initialized on page load
```

### Methods

#### `open()`
Open the chatbot widget.

**Example:**
```javascript
window.aiChatbot.open();
```

#### `close()`
Close the chatbot widget.

**Example:**
```javascript
window.aiChatbot.close();
```

#### `toggle()`
Toggle chatbot open/closed state.

**Example:**
```javascript
window.aiChatbot.toggle();
```

#### `sendMessage(text, role)`
Send a message programmatically.

**Parameters:**
- `text` (string): Message content
- `role` (string): 'bot' or 'user'

**Example:**
```javascript
window.aiChatbot.sendMessage("How can I help you grow your business?", 'bot');
```

#### `openChat()`
Alias for `open()`.

**Example:**
```javascript
window.aiChatbot.openChat();
```

#### `extractLeadInfo()`
Extract captured lead information.

**Returns:** Lead data object
```javascript
{
  name: "John Doe",
  email: "john@example.com",
  phone: "+91 7200059453",
  business: "Tech Startup",
  service: "seo",
  industry: "Technology",
  conversationHistory: [...],
  stage: "lead_sent"
}
```

#### `updateProfile(analyticsData)`
Update chatbot profile from analytics.

**Parameters:**
- `analyticsData` (object): From AI Analytics Engine

**Example:**
```javascript
const analysis = window.aiAnalyticsEngine.analyzeUserBehavior(profile);
window.aiChatbot.updateProfile(analysis);
```

### Properties

```javascript
window.aiChatbot.isOpen              // Boolean - chatbot open state
window.aiChatbot.history             // Array - conversation history
window.aiChatbot.userProfile         // Object - extracted user info
window.aiChatbot.stage               // String - conversation stage
window.aiChatbot.pageCtx             // String - current page context
window.aiChatbot.msgCount            // Number - message count
window.aiChatbot.KB                  // Object - knowledge base
window.aiChatbot.templates           // Object - response templates
```

### Conversation Stages

```
'greeting'       → Initial greeting
'general'        → Open conversation
'ready_for_lead' → User ready to convert
'lead_sent'      → Lead captured
```

### Knowledge Base Structure

```javascript
window.aiChatbot.KB = {
  services: {
    seo: { label, url, keywords, pitch, questions },
    ads: { label, url, keywords, pitch, questions },
    web: { label, url, keywords, pitch, questions },
    // ... 5 more services
  },
  industries: {
    healthcare: { label, url, keywords },
    realestate: { label, url, keywords },
    education: { label, url, keywords },
    enterprise: { label, url, keywords }
  },
  faq: {
    pricing: { keywords, answer },
    timeline: { keywords, answer },
    contact: { keywords, answer },
    about: { keywords, answer },
    results: { keywords, answer },
    location: { keywords, answer }
  },
  smallTalk: {
    greetings: [...],
    thanks: [...],
    bye: [...],
    confused: [...],
    yes: [...],
    no: [...]
  }
}
```

---

## Lead System API

### Description
Lead capture, scoring, and qualification system.

### Initialization
```javascript
window.leadCaptureSystem // Auto-initialized on page load
```

### Methods

#### `recordLead(leadData)`
Record a captured lead.

**Parameters:**
- `leadData` (object): Lead information object

**Example:**
```javascript
window.leadCaptureSystem.recordLead({
  name: "John Doe",
  email: "john@example.com",
  phone: "+91 7200059453",
  business: "Tech Startup",
  service: "seo",
  source: "chatbot"
});
```

#### `scoreLeads()`
Calculate lead quality scores.

**Returns:** Array of scored leads

#### `getQualifiedLeads()`
Get high-quality leads.

**Returns:** Array of Decision-stage leads

#### `exportLeads()`
Export all captured leads.

**Returns:** Array of lead objects

### Properties

```javascript
window.leadCaptureSystem.leads         // Array - all captured leads
window.leadCaptureSystem.scoreWeights  // Object - scoring parameters
```

---

## Integration Example

### Complete User Journey Tracking

```javascript
// 1. User lands on page
// Behavior Tracker starts automatically

// 2. User engages (after 5+ minutes)
const profile = window.behaviorTracker.getProfile();
console.log('Profile:', profile);

// 3. System analyzes behavior
const analysis = window.aiAnalyticsEngine.analyzeUserBehavior(profile);
console.log('Analysis:', analysis);

// 4. Content personalizes
window.personalizationEngine.applyDynamicContent(analysis);

// 5. If Decision stage, chatbot triggers
if (analysis.buying_stage === 'Decision') {
  window.aiChatbot.open();
  window.aiChatbot.sendMessage(
    `I noticed you're very interested in ${analysis.recommended_service}. 
     Here's what we can offer: ${analysis.offer}`,
    'bot'
  );
}

// 6. User converts
const leadInfo = window.aiChatbot.extractLeadInfo();
window.leadCaptureSystem.recordLead(leadInfo);

// 7. Export data
const sessionData = window.behaviorTracker.export();
const analysisReport = window.aiAnalyticsEngine.exportAnalysis(profile);
console.log('Complete Report:', {
  sessionData,
  analysisReport,
  leadInfo
});
```

---

## Error Handling

```javascript
// Safe tracking
try {
  window.behaviorTracker?.trackEvent('click', data);
} catch (e) {
  console.warn('Tracking failed:', e);
}

// Safe analysis
const profile = window.behaviorTracker?.getProfile();
if (profile) {
  const analysis = window.aiAnalyticsEngine?.analyzeUserBehavior(profile);
  if (analysis) {
    window.personalizationEngine?.applyDynamicContent(analysis);
  }
}
```

---

## Performance Considerations

- Behavior tracking runs in background (non-blocking)
- Analysis runs every 10 seconds
- Only heavy operations on Decision-stage detection
- Chatbot auto-triggers only once per session
- All data persisted to localStorage for resilience

---

## Customization Hooks

Edit these files to customize behavior:

**Service Strategies:** `ai-analytics-engine.js` → `serviceStrategies` object
**Chatbot KB:** `ai-chatbot.js` → `this.KB` object
**Tracking Events:** `behavior-tracker.js` → `_track*()` methods
**Scoring Weights:** `lead-system.js` → `scoreWeights` object

---

**API Version:** 3.0
**Last Updated:** April 2026
**Status:** Stable

