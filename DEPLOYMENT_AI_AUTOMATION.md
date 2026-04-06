# AI Automation Deployment & Implementation Guide

## 🚀 Quick Start

### 1. **Local Development Setup**

```bash
# Clone the repository
git clone https://github.com/yourusername/mkshopzone.git
cd mkshopzone

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev

# In another terminal, start the API server
node server.js
```

### 2. **Configuration**

Edit `.env` with your actual credentials:

```env
VITE_HUGGING_FACE_API=hf_your_token_here
GMAIL_USER=your_email@gmail.com
GMAIL_PASS=your_app_password_here
NOTIFICATION_EMAIL=team@mkshopzone.com
```

## 📋 AI Features Implemented

### **1. AI Chatbot** ✅
- **Location**: `/src/ai-chatbot.js`
- **Features**:
  - Real-time visitor engagement
  - Service-aware responses
  - Lead capture from conversations
  - Fallback rule-based system
  - Mobile responsive chat widget

**Trigger Points**:
- Auto-opens after 15 seconds
- Shows on exit intent
- Always available as floating button

### **2. User Behavior Tracking** ✅
- **Location**: `/src/behavior-tracker.js`
- **Tracks**:
  - Page views & scroll depth
  - Service interactions
  - Form field engagement
  - Video watch time
  - Exit intent signals
  - Session duration
  - Return visitor status

**Data Sent To**: Firebase or custom backend via `/api/track`

### **3. Personalization Engine** ✅
- **Location**: `/src/personalization.js`
- **Personalization**:
  - Dynamic hero headlines
  - Service card highlighting
  - CTA button customization
  - A/B testing support
  - User profile scoring

### **4. Lead Capture & Scoring** ✅
- **Location**: `/src/lead-system.js`
- **Scoring Factors**:
  - Service interest (40%)
  - Engagement time (30%)
  - Form completion (20%)
  - Source quality (10%)

**Lead Quality Tiers**:
- 🔥 Hot (80-100)
- ☀️ Warm (60-79)
- ❄️ Cool (40-59)
- ❓ Cold (0-39)

## 🔌 Backend API Endpoints

### Lead Management
```bash
POST /api/leads
- Capture new leads
- Trigger email notifications
- Score and qualify leads

GET /api/leads?quality=hot
- Retrieve leads by quality tier
- Filter and export
```

### Analytics
```bash
GET /api/analytics
- Conversion rates
- Engagement metrics
- Service performance
- Daily/weekly stats
```

### Tracking
```bash
POST /api/track
- Receive session data
- Store behavior events
- Aggregate analytics
```

## 🛠️ Deployment Options

### **Option 1: Vercel + Firebase (Recommended)**

1. **Deploy Frontend to Vercel**:
```bash
npm install -g vercel
vercel deploy
```

2. **Setup Firebase**:
- Create Firebase project
- Enable Firestore Database
- Create web app and get config
- Add credentials to `.env`

3. **Deploy Backend to Railway/Render**:
```bash
# Using Railway
railway init
railway up
```

### **Option 2: Netlify + AWS Lambda**

1. **Deploy to Netlify**:
```bash
npm run build
netlify deploy --prod --dir=dist
```

2. **Setup Lambda Functions**:
- Lead capture handler
- Email notification sender
- Analytics aggregator

### **Option 3: Self-Hosted (VPS)**

```bash
# SSH into your VPS
ssh root@your_server_ip

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone repository
git clone https://your-repo.git
cd mkshopzone

# Install dependencies
npm install

# Setup PM2 process manager
npm install -g pm2
pm2 start server.js --name "mk-shopzone"
pm2 save
pm2 startup

# Setup Nginx reverse proxy
sudo apt-get install nginx
# Configure /etc/nginx/sites-available/default
```

## 📧 Email Configuration

### **Gmail Setup** (Recommended for MVP)
1. Enable 2-factor authentication on your Gmail account
2. Create App Password: https://myaccount.google.com/apppasswords
3. Add to `.env`:
```env
GMAIL_USER=your_email@gmail.com
GMAIL_PASS=your_16_character_password
```

### **SendGrid** (For Production)
```env
SENDGRID_API_KEY=SG.your_key_here
SENDGRID_FROM_EMAIL=noreply@mkshopzone.com
```

## 🤖 AI Service Integration

### **Hugging Face (Free & Unlimited)**
- Best for: Cost-effective production
- Setup:
  1. Create account at huggingface.co
  2. Generate API token
  3. Add to `.env`: `VITE_HUGGING_FACE_API=hf_your_token`

### **OpenAI API** (Better Quality)
- Best for: Premium responses
- Setup:
  1. Create account at openai.com
  2. Generate API key
  3. Add to `.env`: `VITE_OPENAI_API=sk_your_key`
  4. Note: Costs apply after free trial

### **Local LLM** (Free & Private)
- Use Ollama or similar
- Run locally: `ollama run mistral`
- Point to localhost:11434

## 📊 Analytics Dashboard

Access your analytics at:
- **Local**: `http://localhost:3001/dashboard`
- **Production**: `https://yourdomain.com/dashboard`

## 🔐 Security Best Practices

1. **Environment Variables**
   - Never commit `.env` to git
   - Use `.gitignore` to exclude sensitive files
   - Rotate API keys regularly

2. **API Rate Limiting**
   - Implement on `/api/track` endpoint
   - Max 100 requests/minute per IP
   - Prevent chatbot abuse

3. **Data Privacy**
   - Get user consent for tracking
   - Include privacy policy link in chatbot
   - Encrypt PII in database
   - GDPR compliance ready

4. **Database Security**
   - Use MongoDB Atlas with IP whitelist
   - Enable encryption at rest
   - Regular backups
   - Access logs enabled

## 📈 Monitoring & Maintenance

### **Set up Error Tracking**
```bash
npm install @sentry/node
```

### **Monitor Server Health**
```bash
# Check if API is running
curl http://localhost:3001/api/health

# Monitor logs
pm2 logs mk-shopzone
```

### **Database Maintenance**
- Weekly backup of leads
- Archive old events monthly
- Monitor storage usage
- Clean up old sessions (30+ days)

## 🚦 Testing

### **Test Chatbot**
1. Open website
2. Wait 15 seconds or scroll
3. Chat widget appears
4. Click quick action buttons
5. Submit a test conversation

### **Test Lead Capture**
1. Fill contact form
2. Submit with test data
3. Check confirmation email
4. Verify lead in database
5. Check team notification email

### **Test Personalization**
1. Visit service pages
2. Check hero section updates
3. Verify service card highlighting
4. Confirm CTA text changes

## 🚀 Performance Optimization

### **Frontend**
- Lazy load AI modules
- Cache predictions (5 min)
- Use Web Workers for tracking
- Minimize bundle size

### **Backend**
- Batch event uploads
- Use connection pooling
- Cache frequent queries
- CDN for static assets

### **Database**
- Index on sessionId, email, createdAt
- Archive leads older than 1 year
- Partition events by month

## 📞 Support & Integration

### **CRM Integration**
- **Zoho**: Setup webhook to sync leads
- **Pipedrive**: Use API to create deals
- **HubSpot**: Bi-directional sync

### **SMS Alerts** (Twilio)
```env
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_FROM_NUMBER=+1234567890
```

### **Slack Notifications**
```bash
# Send lead alerts to Slack
POST https://hooks.slack.com/services/YOUR/WEBHOOK/URL
```

## 🎯 Next Steps

1. ✅ Deploy to production
2. ✅ Configure email settings
3. ✅ Set up analytics
4. ✅ Create admin dashboard
5. ✅ Setup CRM integration
6. ✅ Configure SMS alerts
7. ✅ Monitor conversions
8. ✅ Optimize based on data

## 🆘 Troubleshooting

### Chatbot not appearing?
- Check browser console for errors
- Verify scripts are loaded
- Check CSS import

### Leads not saving?
- Verify API is running
- Check database connection
- Review server logs

### Emails not sending?
- Verify Gmail credentials
- Check app-specific password
- Review email logs

### Low conversion rates?
- Review personalization logic
- A/B test different headlines
- Optimize form fields
- Test CTA copy

---

**Support Email**: support@mkshopzone.com
**Documentation**: https://docs.mkshopzone.com
**Status Page**: https://status.mkshopzone.com

