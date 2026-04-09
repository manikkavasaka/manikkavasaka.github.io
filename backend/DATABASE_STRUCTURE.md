# 🗄️ DATABASE STRUCTURE & SCHEMA GUIDE

## Complete Database Setup for MK Shopzone

---

## 📊 OVERVIEW

This database is designed to:
- ✅ Track user behavior in real-time
- ✅ Capture and qualify leads
- ✅ Store AI insights and decisions
- ✅ Manage automated follow-ups
- ✅ Support retargeting campaigns
- ✅ Provide advanced analytics

**Supports:** MongoDB (recommended) or PostgreSQL (alternative)

---

## 🗄️ DATABASE SCHEMA

### 1. USERS COLLECTION/TABLE

**Purpose:** Track user sessions and basic info

**MongoDB Schema:**
```javascript
{
  _id: ObjectId,
  session_id: String (unique),
  ip_address: String,
  device: String,              // mobile, desktop, tablet
  source: String,              // google, facebook, direct, email
  created_at: Date,
  last_activity: Date,
  pages_visited: Array,
  total_events: Number,
  status: String               // active, inactive, blocked
}
```

**PostgreSQL Schema:**
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  session_id VARCHAR(100) UNIQUE NOT NULL,
  ip_address VARCHAR(50),
  device VARCHAR(20),
  source VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  last_activity TIMESTAMP DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'active'
);
```

**Indexes:**
- `session_id` (unique)
- `ip_address`
- `created_at`
- `status`

---

### 2. USER_BEHAVIOR COLLECTION/TABLE

**Purpose:** Log every user interaction

**MongoDB Schema:**
```javascript
{
  _id: ObjectId,
  session_id: String,
  page_visited: String,        // /seo.html, /ads.html, etc
  time_spent: Number,          // seconds
  scroll_depth: Number,        // 0-100 percentage
  clicks: Array,               // [click1, click2]
  engagement_score: Number,    // calculated field
  timestamp: Date
}
```

**PostgreSQL Schema:**
```sql
CREATE TABLE user_behavior (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  session_id VARCHAR(100),
  page_visited VARCHAR(255),
  time_spent INTEGER,
  scroll_depth FLOAT,
  clicks JSON,
  engagement_score FLOAT,
  timestamp TIMESTAMP DEFAULT NOW()
);
```

**Indexes:**
- `session_id`
- `timestamp`
- `session_id, timestamp` (composite)

**Engagement Score Calculation:**
```
Time >= 5 min:     +25
Time >= 2 min:     +15
Time >= 1 min:     +10

Scroll >= 75%:     +25
Scroll >= 50%:     +15
Scroll >= 25%:     +10

Clicks >= 5:       +20
Clicks >= 3:       +10
Clicks >= 1:       +5
```

---

### 3. LEADS COLLECTION/TABLE

**Purpose:** Store captured leads with scoring

**MongoDB Schema:**
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  phone: String,
  business: String,
  interest: String,            // SEO, Ads, Web, Social, App, General
  score: Number,               // 0-100 quality score
  source: String,              // website, email, social, etc
  status: String,              // new, contacted, qualified, converted, lost
  created_at: Date,
  last_contact: Date,
  contact_count: Number,
  whatsapp_sent: Boolean,
  email_sent: Boolean,
  notes: String
}
```

**PostgreSQL Schema:**
```sql
CREATE TABLE leads (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  business VARCHAR(255),
  interest VARCHAR(100),
  score INTEGER DEFAULT 50,
  source VARCHAR(50) DEFAULT 'website',
  status VARCHAR(50) DEFAULT 'new',
  created_at TIMESTAMP DEFAULT NOW(),
  last_contact TIMESTAMP,
  contact_count INTEGER DEFAULT 0,
  whatsapp_sent BOOLEAN DEFAULT FALSE,
  email_sent BOOLEAN DEFAULT FALSE,
  notes TEXT
);
```

**Indexes:**
- `email` (unique)
- `phone`
- `interest`
- `status`
- `created_at`
- `score` (descending for sorting high-quality leads)

**Lead Status Lifecycle:**
```
new → contacted → qualified → converted
                           ↓
                          lost
```

---

### 4. AI_ANALYTICS COLLECTION/TABLE

**Purpose:** Store AI analysis results

**MongoDB Schema:**
```javascript
{
  _id: ObjectId,
  session_id: String,
  detected_intent: String,     // SEO, Ads, Web, Social, App
  buying_stage: String,        // Awareness, Consideration, Decision
  recommended_service: String, // AI recommendation
  generated_cta: String,       // Call-to-action text
  confidence_score: Number,    // 0-100
  timestamp: Date
}
```

**PostgreSQL Schema:**
```sql
CREATE TABLE ai_analytics (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  session_id VARCHAR(100),
  detected_intent VARCHAR(100),
  buying_stage VARCHAR(50),
  recommended_service VARCHAR(255),
  generated_cta VARCHAR(255),
  generated_headline VARCHAR(500),
  generated_subheading VARCHAR(500),
  confidence_score FLOAT,
  timestamp TIMESTAMP DEFAULT NOW()
);
```

**Indexes:**
- `session_id`
- `detected_intent`
- `buying_stage`
- `timestamp`

**Buying Stage Signals:**
```
AWARENESS:
- Time: < 1 minute
- Scroll: < 50%
- Clicks: < 2

CONSIDERATION:
- Time: 2-5 minutes
- Scroll: 50-75%
- Clicks: 3-8

DECISION:
- Time: > 5 minutes
- Scroll: > 75%
- Clicks: > 8
- Form interaction: YES
```

---

### 5. FOLLOWUPS COLLECTION/TABLE

**Purpose:** Track automated follow-up sequences

**MongoDB Schema:**
```javascript
{
  _id: ObjectId,
  lead_id: ObjectId,
  whatsapp_sent: Boolean,
  email_sent: Boolean,
  last_followup: Date,
  next_followup: Date,         // when next followup should happen
  status: String,              // active, completed, cancelled
  followup_count: Number,
  created_at: Date
}
```

**PostgreSQL Schema:**
```sql
CREATE TABLE followups (
  id SERIAL PRIMARY KEY,
  lead_id INTEGER NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  whatsapp_sent BOOLEAN DEFAULT FALSE,
  email_sent BOOLEAN DEFAULT FALSE,
  last_followup TIMESTAMP,
  next_followup TIMESTAMP,
  status VARCHAR(50) DEFAULT 'active',
  followup_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Indexes:**
- `lead_id`
- `next_followup` (for scheduling)
- `status`

**Followup Schedule:**
```
Day 0: Instant confirmation (WhatsApp + Email)
Day 1: Social proof email
Day 3: Urgency + offer email (WhatsApp)
Day 7: Final personal follow-up
```

---

### 6. RETARGETING COLLECTION/TABLE

**Purpose:** Segment audiences for ad campaigns

**MongoDB Schema:**
```javascript
{
  _id: ObjectId,
  lead_id: ObjectId,
  interest: String,            // SEO, Ads, Web, Social, App
  audience_tag: String,        // high_intent, warm_lead, cold_lead
  ad_platform: Array,          // ["facebook", "google", "instagram"]
  created_at: Date,
  status: String,              // active, inactive
  impressions: Number,
  clicks: Number,
  conversions: Number
}
```

**PostgreSQL Schema:**
```sql
CREATE TABLE retargeting (
  id SERIAL PRIMARY KEY,
  lead_id INTEGER NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  interest VARCHAR(100),
  audience_tag VARCHAR(100),
  ad_platform JSON,
  status VARCHAR(50) DEFAULT 'active',
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Indexes:**
- `lead_id`
- `interest`
- `audience_tag`
- `status`

**Audience Tags:**
```
high_intent:    Score > 80, Decision stage
warm_lead:      Score 50-80, Consideration stage
cold_lead:      Score < 50, Awareness stage
```

---

### 7. CAMPAIGNS COLLECTION/TABLE

**Purpose:** Track marketing campaigns

**PostgreSQL Schema:**
```sql
CREATE TABLE campaigns (
  id SERIAL PRIMARY KEY,
  campaign_id VARCHAR(100) UNIQUE,
  name VARCHAR(255),
  campaign_type VARCHAR(50),   // email, whatsapp, retargeting
  status VARCHAR(50),
  target_interest VARCHAR(100),
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  total_recipients INTEGER,
  sent INTEGER,
  opened INTEGER,
  clicked INTEGER,
  converted INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

### 8. ANALYTICS_SUMMARY COLLECTION/TABLE

**Purpose:** Daily aggregated analytics

**PostgreSQL Schema:**
```sql
CREATE TABLE analytics_summary (
  id SERIAL PRIMARY KEY,
  date VARCHAR(10) UNIQUE,     -- YYYY-MM-DD
  total_sessions INTEGER,
  total_leads INTEGER,
  leads_converted INTEGER,
  conversion_rate FLOAT,
  avg_engagement FLOAT,
  leads_by_intent JSON,
  leads_by_stage JSON,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🔌 CONNECTION & SETUP

### MongoDB Setup

**Install:**
```bash
# Windows/Mac/Linux
mongod

# Or use MongoDB Atlas (cloud)
# https://www.mongodb.com/cloud/atlas
```

**Connection String:**
```
mongodb://localhost:27017/mkshopzone
```

**Python Connection:**
```python
from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client["mkshopzone"]

# Collections
users = db["users"]
behavior = db["user_behavior"]
leads = db["leads"]
analytics = db["ai_analytics"]
followups = db["followups"]
retargeting = db["retargeting"]
```

---

### PostgreSQL Setup

**Install:**
```bash
# macOS
brew install postgresql
brew services start postgresql

# Ubuntu
sudo apt-get install postgresql
sudo systemctl start postgresql

# Windows
# Download from https://www.postgresql.org/download/
```

**Create Database:**
```sql
CREATE DATABASE mkshopzone;
```

**Python Connection:**
```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "postgresql://user:password@localhost/mkshopzone"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)

# Create tables
from database_postgresql import Base
Base.metadata.create_all(bind=engine)
```

---

## 📝 SAMPLE DATA

### Insert Sample User

**MongoDB:**
```javascript
db.users.insertOne({
  session_id: "sess_12345",
  ip_address: "192.168.1.1",
  device: "desktop",
  source: "google",
  created_at: new Date(),
  last_activity: new Date(),
  status: "active"
})
```

**PostgreSQL:**
```python
from database_postgresql import DatabaseOps

ops = DatabaseOps()
user = ops.create_user(
  session_id="sess_12345",
  ip_address="192.168.1.1",
  device="desktop",
  source="google"
)
```

### Insert Sample Lead

**MongoDB:**
```javascript
db.leads.insertOne({
  name: "John Doe",
  email: "john@example.com",
  phone: "9876543210",
  business: "Tech Startup",
  interest: "SEO",
  score: 75,
  source: "website",
  status: "new",
  created_at: new Date(),
  contact_count: 0,
  whatsapp_sent: false,
  email_sent: false
})
```

**PostgreSQL:**
```python
ops = DatabaseOps()
lead = ops.create_lead(
  name="John Doe",
  email="john@example.com",
  phone="9876543210",
  business="Tech Startup",
  interest="SEO",
  score=75
)
```

---

## 📊 QUERIES & AGGREGATIONS

### Get Top Interests (by lead count)

**MongoDB:**
```javascript
db.leads.aggregate([
  {
    $group: {
      _id: "$interest",
      count: { $sum: 1 },
      avg_score: { $avg: "$score" }
    }
  },
  { $sort: { count: -1 } }
])
```

**PostgreSQL:**
```python
from sqlalchemy import func

ops = DatabaseOps()
results = ops.db.query(
  Lead.interest,
  func.count(Lead.id).label('count'),
  func.avg(Lead.score).label('avg_score')
).group_by(Lead.interest).order_by(func.count(Lead.id).desc()).all()
```

### Get Conversion Funnel

**MongoDB:**
```javascript
db.ai_analytics.aggregate([
  {
    $group: {
      _id: "$buying_stage",
      count: { $sum: 1 }
    }
  },
  { $sort: { _id: 1 } }
])
```

### Get Pending Follow-ups

**MongoDB:**
```javascript
db.followups.find({
  status: "active",
  next_followup: { $lte: new Date() }
})
```

**PostgreSQL:**
```python
from datetime import datetime

ops = DatabaseOps()
pending = ops.db.query(FollowUp).filter(
  FollowUp.status == "active",
  FollowUp.next_followup <= datetime.utcnow()
).all()
```

---

## 🔐 SECURITY BEST PRACTICES

### 1. Encryption
```python
# Use environment variables for passwords
from dotenv import load_dotenv
import os

DATABASE_URL = os.getenv("DATABASE_URL")
```

### 2. Backup Strategy
```bash
# MongoDB backup
mongodump --db mkshopzone --out /backup/

# PostgreSQL backup
pg_dump mkshopzone > /backup/mkshopzone.sql
```

### 3. Access Control
```sql
-- PostgreSQL: Create user with limited privileges
CREATE USER app_user WITH PASSWORD 'secure_password';
GRANT CONNECT ON DATABASE mkshopzone TO app_user;
GRANT USAGE ON SCHEMA public TO app_user;
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO app_user;
```

---

## 📈 PERFORMANCE OPTIMIZATION

### Index Strategy

**High-traffic queries:**
- `leads.find({status: "new"})` → Index on status
- `user_behavior.find({session_id: "X"})` → Index on session_id
- `followups.find({next_followup: {$lte: Date}})` → Index on next_followup

### Pagination

**MongoDB:**
```javascript
db.leads.find({}).skip(0).limit(50)
```

**PostgreSQL:**
```python
ops.db.query(Lead).offset(0).limit(50).all()
```

### Aggregation Caching

```python
# Store daily summary instead of recalculating
analytics_summary.save_daily_summary(date, metrics)
```

---

## 🚀 DEPLOYMENT CHECKLIST

- [ ] Database created and initialized
- [ ] All collections/tables created
- [ ] Indexes created
- [ ] Sample data inserted
- [ ] Backup strategy configured
- [ ] Access control set up
- [ ] Connection string in `.env`
- [ ] Database connection tested
- [ ] Performance validated

---

## 📞 TROUBLESHOOTING

### MongoDB Connection Failed

```python
# Check if MongoDB is running
mongosh  # or mongo

# Check connection string
mongodb://localhost:27017/mkshopzone
```

### PostgreSQL Connection Failed

```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Test connection
psql -U postgres -h localhost
```

### Slow Queries

```python
# Enable query logging
engine = create_engine(DATABASE_URL, echo=True)

# Check indexes
SELECT * FROM pg_stat_user_indexes;
```

---

## 📚 INTEGRATION WITH BACKEND

See `database_mongodb.py` or `database_postgresql.py` for full implementation.

**Quick Start:**
```python
# MongoDB
from database_mongodb import DatabaseOps
ops = DatabaseOps()
lead_id = ops.create_lead(name, email, phone, business, interest, session_id)

# PostgreSQL
from database_postgresql import DatabaseOps
with DatabaseOps() as ops:
    lead = ops.create_lead(name, email, phone, business, interest)
```

---

**Database Version:** 3.0  
**Last Updated:** April 8, 2026  
**Status:** Production Ready ✅

