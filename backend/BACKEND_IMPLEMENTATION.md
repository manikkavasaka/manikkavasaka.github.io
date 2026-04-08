# 🚀 MK SHOPZONE - PREMIUM AI-POWERED BACKEND SYSTEM v3.0

## Complete Implementation Guide

---

## TABLE OF CONTENTS

1. [System Overview](#system-overview)
2. [Architecture](#architecture)
3. [Installation & Setup](#installation--setup)
4. [API Endpoints](#api-endpoints)
5. [Features Implementation](#features-implementation)
6. [Database Setup](#database-setup)
7. [Automation Setup](#automation-setup)
8. [Admin Dashboard](#admin-dashboard)
9. [Deployment Guide](#deployment-guide)
10. [Troubleshooting](#troubleshooting)

---

## SYSTEM OVERVIEW

### Purpose
A complete backend system that:
- ✅ Tracks user behavior in real-time
- ✅ Detects user intent using AI
- ✅ Personalizes website content dynamically
- ✅ Captures leads intelligently
- ✅ Automates follow-ups (WhatsApp + Email)
- ✅ Manages retargeting campaigns
- ✅ Provides admin analytics

### Technology Stack

**Backend:**
- FastAPI (Python) - Fast, modern, async-capable
- PostgreSQL/MongoDB - Database
- Uvicorn - ASGI server

**AI/ML:**
- OpenAI GPT-4o - Intent detection & analysis
- Custom scoring algorithms

**Automations:**
- Twilio - WhatsApp messaging
- SendGrid - Email delivery
- APScheduler - Task scheduling

**Frontend:**
- HTML/CSS/JavaScript - Admin dashboard
- React (optional) - Advanced UI

---

## ARCHITECTURE

```
┌─────────────────────────────────────────┐
│     FRONTEND (Website)                  │
│  - Behavior tracking script             │
│  - Tracking data collection             │
│  - Lead forms                           │
└──────────────────┬──────────────────────┘
                   │ HTTP/REST
┌──────────────────▼──────────────────────┐
│     FASTAPI BACKEND                     │
├─────────────────────────────────────────┤
│  1. Tracking API                        │
│     - POST /api/v1/track                │
│                                          │
│  2. Personalization API                 │
│     - POST /api/v1/personalize          │
│                                          │
│  3. Lead Capture API                    │
│     - POST /api/v1/leads                │
│                                          │
│  4. Automation API                      │
│     - POST /api/v1/followup/send        │
│                                          │
│  5. Admin API                           │
│     - GET /api/v1/admin/dashboard       │
│     - GET /api/v1/admin/leads           │
│     - GET /api/v1/admin/analytics       │
└──────────────────┬──────────────────────┘
                   │
        ┌──────────┼──────────┐
        │          │          │
        ▼          ▼          ▼
   ┌────────┐ ┌──────────┐ ┌──────────┐
   │ AI     │ │Database  │ │External  │
   │Engine  │ │(PostgreS)│ │Services  │
   │(GPT-4o)│ │(MongoDB) │ │(Twilio,  │
   │        │ │          │ │SendGrid) │
   └────────┘ └──────────┘ └──────────┘
```

---

## INSTALLATION & SETUP

### Prerequisites
```bash
# Python 3.10+
python --version

# Verify pip
pip --version
```

### Step 1: Clone & Install

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Step 2: Environment Configuration

Create `.env` file:

```env
# OpenAI
OPENAI_API_KEY=sk-your-key-here

# Twilio (WhatsApp)
TWILIO_ACCOUNT_SID=your-sid
TWILIO_AUTH_TOKEN=your-token
TWILIO_PHONE_NUMBER=+1234567890

# SendGrid (Email)
SENDGRID_API_KEY=SG.your-key-here
SENDGRID_FROM_EMAIL=noreply@mkshopzone.com

# SMTP (Alternative to SendGrid)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Database
DATABASE_URL=postgresql://user:password@localhost/mkshopzone
# OR for MongoDB:
MONGODB_URL=mongodb://localhost:27017/mkshopzone

# App
APP_ENV=development
SECRET_KEY=your-secret-key-here
```

### Step 3: Database Setup

#### PostgreSQL
```bash
# Install PostgreSQL
# Create database
createdb mkshopzone

# Run migrations (if using SQLAlchemy)
python -m alembic upgrade head
```

#### MongoDB
```bash
# Install MongoDB
# Start MongoDB service
mongod

# Database automatically created
```

### Step 4: Run Backend

```bash
# Development
python run.py
# OR
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Production
gunicorn -w 4 -b 0.0.0.0:8000 main:app
```

Backend will be running at: `http://localhost:8000`

---

## API ENDPOINTS

### 1. TRACKING ENDPOINTS

#### Track User Behavior
```
POST /api/v1/track
Content-Type: application/json

{
  "sessionId": "sess_12345",
  "userId": "user_123",
  "userAgent": "Mozilla/5.0...",
  "platform": "desktop",
  "scrollDepth": 65.5,
  "duration": 245,
  "events": [
    {
      "type": "click",
      "target": "seo-link",
      "path": "/seo.html",
      "timestamp": "2026-04-08T10:30:00Z",
      "metadata": {}
    }
  ]
}

RESPONSE:
{
  "success": true,
  "sessionId": "sess_12345",
  "analysis": {
    "intent": "SEO",
    "stage": "Consideration",
    "score": 72,
    "offer": "Free SEO Audit"
  },
  "personalization": {
    "headline": "Dominate Google Search Rankings",
    "cta": "Get Free SEO Audit",
    "services": ["SEO", "Paid Ads", "Web Design"]
  },
  "shouldShowLeadPopup": true
}
```

### 2. PERSONALIZATION ENDPOINTS

#### Get Personalized Content
```
POST /api/v1/personalize?session_id=sess_12345

RESPONSE:
{
  "intent": "SEO",
  "stage": "Consideration",
  "score": 72,
  "headline": "Dominate Google Search Rankings",
  "subheading": "Comparing options for SEO? Here's what makes us different.",
  "cta": "Get Free Audit",
  "offer": "Free SEO Audit",
  "services": ["SEO", "Paid Ads", "Web Design"],
  "showPopup": true
}
```

### 3. LEAD CAPTURE ENDPOINTS

#### Capture Lead
```
POST /api/v1/leads
Content-Type: application/json

{
  "name": "John Smith",
  "email": "john@example.com",
  "phone": "+1234567890",
  "business": "Tech Startup",
  "message": "Interested in SEO services",
  "sessionId": "sess_12345",
  "intent": "SEO",
  "buyingStage": "Consideration"
}

RESPONSE:
{
  "success": true,
  "leadId": 42,
  "message": "Lead captured! Personalized engagement sequence launched.",
  "nextSteps": [
    "WhatsApp message sent",
    "Welcome email queued",
    "Daily follow-up scheduled",
    "Strategy session booking link sent"
  ]
}
```

#### Get Lead Details
```
GET /api/v1/leads/42

RESPONSE:
{
  "name": "John Smith",
  "email": "john@example.com",
  "phone": "+1234567890",
  "business": "Tech Startup",
  "intent": "SEO",
  "buyingStage": "Consideration",
  "score": 72,
  "status": "new",
  "createdAt": "2026-04-08T10:35:00Z",
  "whatsapp_sent": true,
  "email_sent": true,
  "followup_count": 1
}
```

### 4. FOLLOW-UP ENDPOINTS

#### Send Follow-up Message
```
POST /api/v1/followup/send?lead_id=42&channel=whatsapp

RESPONSE:
{
  "success": true,
  "message": "WhatsApp sent to +1234567890"
}
```

#### Schedule Daily Follow-ups
```
POST /api/v1/followup/schedule

RESPONSE:
{
  "success": true,
  "followups_scheduled": 12,
  "message": "Daily follow-ups scheduled for 12 leads"
}
```

### 5. ADMIN DASHBOARD ENDPOINTS

#### Get Dashboard Metrics
```
GET /api/v1/admin/dashboard

RESPONSE:
{
  "metrics": {
    "total_sessions": 1250,
    "total_leads": 42,
    "conversion_rate": "3.36%",
    "avg_session_duration": "3:45",
    "timestamp": "2026-04-08T10:30:00Z"
  },
  "leads_by_stage": {
    "awareness": 18,
    "consideration": 15,
    "decision": 9
  },
  "leads_by_intent": {
    "SEO": 22,
    "Paid Ads": 12,
    "Web Design": 8
  },
  "leads_by_status": {
    "new": 8,
    "followed_up": 20,
    "converted": 12,
    "lost": 2
  },
  "recent_leads": [...]
}
```

#### Get All Leads
```
GET /api/v1/admin/leads?skip=0&limit=50&status=new&intent=SEO

RESPONSE:
{
  "total": 8,
  "skip": 0,
  "limit": 50,
  "leads": [...]
}
```

#### Get Analytics
```
GET /api/v1/admin/analytics?period=week

RESPONSE:
{
  "period": "week",
  "conversions_by_intent": {
    "SEO": 5,
    "Paid Ads": 3,
    "Web Design": 2
  },
  "conversion_rates": {
    "SEO": "22.73%",
    "Paid Ads": "25.00%",
    "Web Design": "25.00%"
  },
  "total_leads_captured": 22,
  "avg_lead_score": 68.5
}
```

### 6. RETARGETING ENDPOINTS

#### Get Retargeting Audience
```
GET /api/v1/retargeting/audience

RESPONSE:
{
  "total_audience": 1250,
  "warm_leads": 28,
  "cold_leads": 8,
  "audiences": {
    "seo_interested": 22,
    "ads_interested": 12,
    "web_interested": 8,
    "high_value": 15
  },
  "ad_creatives": {
    "SEO": {
      "headline": "Dominate Google Search Rankings",
      "cta": "Get Free SEO Audit",
      "audience_size": 22,
      "suggested_bid": "high"
    }
  }
}
```

---

## FEATURES IMPLEMENTATION

### 1. User Behavior Tracking

**How It Works:**
1. Frontend sends behavioral events to `/api/v1/track`
2. Backend stores in database
3. AI analyzes after 3+ events
4. Returns personalization payload

**Frontend Integration:**
```javascript
// In your HTML
<script>
  const sessionId = generateSessionId();
  
  document.addEventListener('click', (e) => {
    fetch('/api/v1/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: sessionId,
        userAgent: navigator.userAgent,
        platform: getPlatform(),
        events: [{
          type: 'click',
          target: e.target.id,
          path: window.location.pathname,
          timestamp: new Date().toISOString()
        }],
        scrollDepth: getScrollPercentage(),
        duration: sessionDuration
      })
    });
  });
</script>
```

### 2. AI Personalization

**Algorithm:**
- Intent Detection: Keyword matching + AI analysis
- Buying Stage: Time + Scroll + Engagement scoring
- Lead Score: Multi-factor (0-100)

**Example Scoring:**
```
Duration >= 5 min:      +25
Scroll >= 75%:          +25
Events >= 10:           +20
Decision Stage:         +20
Specific Intent:        +10
──────────────────────────────
Total:                  100 (Perfect score)
```

### 3. Smart Lead Capture

**Trigger Logic:**
```
Show popup if:
- Decision stage (naturally high engagement) OR
- Duration >= 2 min AND Scroll >= 60% AND Events >= 5
```

**Soft Registration:**
Forces completion of:
- Name
- Email
- Phone
- (Optional) Business

### 4. Automated Sequences

**Day 0 (Instant):**
- ✅ WhatsApp confirmation
- ✅ Welcome email
- ✅ Booking link

**Day 1:**
- Social proof email with case studies

**Day 3:**
- Urgency message with limited offer

**Day 7:**
- Final personal follow-up

### 5. WhatsApp Automation

**Setup:**
```python
# In .env
TWILIO_ACCOUNT_SID=ACxxxxxx
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=+1234567890

# Code sends via Twilio API
await AutomationService.send_whatsapp(
    phone="+91xxxxxxxxxx",
    name="John",
    intent="SEO"
)
```

### 6. Email Automation

**Via SendGrid:**
```python
# In .env
SENDGRID_API_KEY=SG.xxxxx
SENDGRID_FROM_EMAIL=noreply@mkshopzone.com

# Sends HTML emails with templates
await AutomationService.send_email(
    email="john@example.com",
    name="John",
    intent="SEO"
)
```

---

## DATABASE SETUP

### PostgreSQL Schema

```sql
CREATE TABLE sessions (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(100) UNIQUE,
    user_id VARCHAR(100),
    events JSONB,
    scroll_depth FLOAT,
    duration INT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE leads (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20),
    business VARCHAR(255),
    intent VARCHAR(50),
    buying_stage VARCHAR(50),
    score INT,
    status VARCHAR(20),
    session_id VARCHAR(100),
    whatsapp_sent BOOLEAN DEFAULT FALSE,
    email_sent BOOLEAN DEFAULT FALSE,
    followup_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE followup_logs (
    id SERIAL PRIMARY KEY,
    lead_id INT REFERENCES leads(id),
    channel VARCHAR(20),
    sent_at TIMESTAMP,
    opened BOOLEAN DEFAULT FALSE,
    clicked BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_intent ON leads(intent);
CREATE INDEX idx_followup_lead ON followup_logs(lead_id);
```

### MongoDB Collections

```javascript
// Sessions collection
db.sessions.insertOne({
  sessionId: "sess_12345",
  userId: "user_123",
  events: [...],
  scrollDepth: 65.5,
  duration: 245,
  createdAt: new Date()
});

// Leads collection
db.leads.insertOne({
  name: "John Smith",
  email: "john@example.com",
  phone: "+1234567890",
  business: "Tech Startup",
  intent: "SEO",
  buyingStage: "Consideration",
  score: 72,
  status: "new",
  sessionId: "sess_12345",
  whatsappSent: true,
  emailSent: true,
  followupCount: 1,
  createdAt: new Date()
});

// Create indexes
db.leads.createIndex({ email: 1 });
db.leads.createIndex({ status: 1 });
db.leads.createIndex({ intent: 1 });
```

---

## AUTOMATION SETUP

### WhatsApp (Twilio)

1. **Create Twilio Account:**
   - Go to https://www.twilio.com
   - Sign up for free trial
   - Get account SID and auth token

2. **Setup WhatsApp:**
   - Enable WhatsApp in Twilio Console
   - Get WhatsApp number

3. **Configure:**
   ```env
   TWILIO_ACCOUNT_SID=ACxxxxxx
   TWILIO_AUTH_TOKEN=your_token
   TWILIO_PHONE_NUMBER=+1234567890
   ```

### Email (SendGrid)

1. **Create SendGrid Account:**
   - Go to https://sendgrid.com
   - Sign up (free tier available)
   - Get API key

2. **Configure:**
   ```env
   SENDGRID_API_KEY=SG.xxxxx
   SENDGRID_FROM_EMAIL=noreply@mkshopzone.com
   ```

### Task Scheduling (APScheduler)

```python
# Schedule daily follow-ups
from apscheduler.schedulers.background import BackgroundScheduler

scheduler = BackgroundScheduler()

@scheduler.scheduled_job('cron', hour=9, minute=0)
async def daily_followups():
    await AutomationService.schedule_daily_followups()

scheduler.start()
```

---

## ADMIN DASHBOARD

### Access

```
http://localhost:8000/dashboard.html
```

### Features

- **Metrics Dashboard:** Real-time KPIs
- **Leads Table:** All leads with filtering
- **Analytics:** Conversion rates by intent
- **Bulk Actions:** Send campaigns, export data
- **Auto-refresh:** Every 30 seconds

### Live Data Updates

Dashboard fetches from:
```javascript
GET /api/v1/admin/dashboard       // Every 30 seconds
GET /api/v1/admin/leads          // On demand
GET /api/v1/admin/analytics      // On demand
```

---

## DEPLOYMENT GUIDE

### Production Checklist

- [ ] Environment variables set
- [ ] Database migrated
- [ ] SSL certificates ready
- [ ] OpenAI API key active
- [ ] Twilio account verified
- [ ] SendGrid authenticated
- [ ] Monitoring setup

### Deploy to Production

#### Option 1: Heroku

```bash
# Install Heroku CLI
# Login
heroku login

# Create app
heroku create mkshopzone-backend

# Set environment variables
heroku config:set OPENAI_API_KEY=sk-...
heroku config:set TWILIO_ACCOUNT_SID=AC...
# ... (add all env vars)

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

#### Option 2: AWS EC2

```bash
# SSH into instance
ssh -i key.pem ec2-user@your-ip

# Install dependencies
sudo yum update
sudo yum install python3 python3-venv postgresql

# Clone repo
git clone your-repo
cd backend

# Setup
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Create .env with production keys

# Run with Gunicorn
gunicorn -w 4 -b 0.0.0.0:8000 main:app --daemon
```

#### Option 3: Docker

```dockerfile
FROM python:3.10

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:8000", "main:app"]
```

```bash
# Build
docker build -t mkshopzone-backend .

# Run
docker run -p 8000:8000 --env-file .env mkshopzone-backend
```

---

## TROUBLESHOOTING

### Issue: "No module named 'fastapi'"

**Solution:**
```bash
pip install -r requirements.txt
```

### Issue: "OpenAI API key not found"

**Solution:**
1. Check `.env` file exists
2. Add: `OPENAI_API_KEY=sk-your-key`
3. Restart server

### Issue: "Database connection failed"

**Solution:**
```bash
# Check PostgreSQL running
psql -U postgres

# Check MongoDB running
mongo

# Check connection string in .env
DATABASE_URL=postgresql://user:password@localhost/mkshopzone
```

### Issue: "Emails not sending"

**Solution:**
1. Verify SENDGRID_API_KEY
2. Check from email is verified
3. Check spam folder
4. Enable "Less secure app access" for Gmail SMTP

### Issue: "WhatsApp not receiving messages"

**Solution:**
1. Verify Twilio credentials
2. Check phone number format: +1234567890
3. Ensure Twilio account has credit
4. Check WhatsApp is enabled in Twilio Console

---

## PERFORMANCE OPTIMIZATION

### Caching

```python
from fastapi_cache2 import FastAPICache2
from fastapi_cache2.backends.redis import RedisBackend

# Cache frequent queries
@app.get("/api/v1/admin/dashboard")
@cached(expire=300)  # 5 minutes
async def admin_dashboard():
    ...
```

### Database Optimization

```sql
-- Add indexes for frequent queries
CREATE INDEX idx_leads_created ON leads(created_at DESC);
CREATE INDEX idx_leads_score ON leads(score DESC);
CREATE INDEX idx_sessions_date ON sessions(created_at DESC);
```

### Async Processing

```python
# Use background tasks for heavy operations
@app.post("/api/v1/leads")
async def capture_lead(lead: LeadCapture, background_tasks: BackgroundTasks):
    # Immediate response
    leads_db.append(lead)
    
    # Heavy processing in background
    background_tasks.add_task(
        AutomationService.trigger_lead_sequence,
        lead.dict()
    )
    
    return {"success": True, "leadId": len(leads_db)}
```

---

## MONITORING & LOGGING

```python
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.post("/api/v1/leads")
async def capture_lead(lead: LeadCapture):
    logger.info(f"New lead: {lead.email} ({lead.intent})")
    logger.debug(f"Lead data: {lead.dict()}")
    ...
```

---

## NEXT STEPS

1. **Frontend Integration:**
   - Add tracking script to website
   - Create lead capture forms
   - Implement personalization display

2. **Testing:**
   - Test all API endpoints
   - Verify automations
   - Load testing

3. **Optimization:**
   - Monitor performance metrics
   - Optimize slow queries
   - Scale infrastructure

4. **Features:**
   - Add more personalization rules
   - Implement A/B testing
   - Add SMS channel
   - Build mobile app

---

## SUPPORT

For issues or questions:
- Check logs: `docker logs container_id`
- Test API: `curl http://localhost:8000/`
- Check dashboard: `http://localhost:8000/dashboard.html`

**Email:** support@mkshopzone.com
**Phone:** +91 7200059453

---

**Last Updated:** April 8, 2026
**Version:** 3.0
**Status:** Production Ready ✅

