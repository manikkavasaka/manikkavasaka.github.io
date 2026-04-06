# MK Shopzone AI Automation - Complete Setup & Testing Guide

## 📋 System Overview

Your website now includes 4 core AI systems working together:

1. **AI Chatbot** - Real-time visitor engagement
2. **Behavior Tracker** - Comprehensive analytics  
3. **Personalization Engine** - Dynamic content adaptation
4. **Lead System** - Automated qualification & scoring

## 🚀 Installation & Setup

### Step 1: Install Dependencies

```bash
cd D:\mkshopzone
npm install
```

### Step 2: Configure Environment

Create `.env` file in the root directory:

```bash
# Copy example file
copy .env.example .env

# Edit with your credentials (required for production)
VITE_HUGGING_FACE_API=hf_your_token_here
GMAIL_USER=your_email@gmail.com
GMAIL_PASS=your_app_password_here
NOTIFICATION_EMAIL=team@mkshopzone.com
```

### Step 3: Start Development Server

```bash
# Terminal 1: Start Vite dev server
npm run dev

# Terminal 2: Start API backend
npm run server
```

Your website will be available at:
- **Frontend**: http://localhost:5173
- **API**: http://localhost:3001
- **Dashboard**: http://localhost:3001/dashboard

## ✅ Testing Each Feature

### Test 1: Chatbot Functionality

**Goal**: Verify AI chatbot appears and responds correctly

**Steps**:
1. Open http://localhost:5173 in your browser
2. Wait 15 seconds - chatbot widget should appear bottom-right
3. Click on the floating button if not visible
4. Try these messages:
   - "I need help with SEO"
   - "Tell me about your web design services"
   - "I'm interested in paid ads"
5. Click quick action buttons (📊 SEO, 💰 Ads, etc.)
6. Observe:
   - ✅ Chatbot opens smoothly
   - ✅ Bot responds with relevant messages
   - ✅ Quick buttons work
   - ✅ Messages scroll to bottom automatically
   - ✅ Close button works

**Expected Results**:
- Service-aware responses
- Smooth animations
- Professional styling
- Mobile responsive

---

### Test 2: Behavior Tracking

**Goal**: Verify user interactions are being tracked

**Steps**:
1. Open browser DevTools (F12)
2. Go to Console tab
3. Open website and interact:
   - Scroll down to different sections
   - Click on service cards
   - Hover over buttons
   - Watch the scroll depth change
4. Check console logs for:
   ```
   ✓ Tracked X events from session xxx
   ```

**Verification**:
```javascript
// In browser console, run:
console.log(window.behaviorTracker.getSessionSummary());

// Should output something like:
{
  sessionId: "session_xxx",
  duration: 45,
  scrollDepth: 75,
  pageViews: 1,
  services: ["seo", "web"],
  formInteractions: 2,
  exitIntent: false,
  isReturning: false
}
```

---

### Test 3: Personalization

**Goal**: Verify content personalizes based on behavior

**Steps**:
1. Open website fresh
2. Scroll and click on "SEO" service card
3. After 5+ seconds, observe:
   - Hero headline should change slightly
   - Service card might be highlighted
   - CTA button text might update
4. Try with different services

**Check in Console**:
```javascript
window.personalizationEngine.userProfile
// Should show updated interest scores

window.personalizationEngine.getTopService()
// Should return your most interacted service
```

---

### Test 4: Lead Capture & Scoring

**Goal**: Verify lead form captures data and calculates score

**Steps**:
1. Scroll to "Request Audit" section
2. Fill form with test data:
   ```
   Full Name: John Test
   Email: john@example.com
   Phone: +919876543210
   Service: Advanced SEO Optimization
   Message: I want to rank for digital marketing keywords
   ```
3. Submit form
4. Observe:
   - ✅ Success message appears
   - ✅ Form clears
   - ✅ "Next steps" modal shows
   - ✅ Confirmation email sent (check inbox)

**Check Lead Data**:
```javascript
// In browser console:
localStorage.getItem('mk_leads')
// Should show your test lead with score

// Or via API:
fetch('/api/leads').then(r => r.json()).then(console.log)
```

**Lead Quality Indicators**:
- 🔥 Hot (80-100): High intent, ready to close
- ☀️ Warm (60-79): Good engagement
- ❄️ Cool (40-59): Some interest
- ❓ Cold (0-39): Low engagement

---

### Test 5: Email Notifications

**Goal**: Verify confirmation & team notification emails

**Setup**:
1. Use Gmail app password (not regular password)
2. Add to `.env`:
   ```
   GMAIL_USER=your_email@gmail.com
   GMAIL_PASS=your_16_char_app_password
   ```
3. Restart server

**Test**:
1. Submit contact form with your email
2. Check inbox within 1 minute
3. You should receive:
   - ✅ Visitor confirmation email
   - ✅ Team notification email (to NOTIFICATION_EMAIL)

---

### Test 6: Form Auto-Population

**Goal**: Verify form fields auto-populate from chatbot data

**Steps**:
1. Open website
2. Chat with bot about a service:
   - "I'm interested in SEO services"
   - "My email is test@example.com"
3. Scroll to contact form
4. Observe:
   - ✅ Service field auto-populated
   - ✅ Email field auto-populated (if mentioned in chat)

---

### Test 7: Analytics Dashboard

**Goal**: Verify dashboard displays correct metrics

**Steps**:
1. Submit 3-5 test leads with different services
2. Go to http://localhost:3001/dashboard
3. Verify displays:
   - ✅ Total Leads count
   - ✅ Conversion Rate %
   - ✅ Lead Quality distribution (pie chart)
   - ✅ Top Services list
   - ✅ Recent leads table

---

### Test 8: Mobile Responsiveness

**Goal**: Verify all features work on mobile

**Steps**:
1. Open DevTools (F12) → Toggle Device Toolbar
2. Select iPhone 12 or similar
3. Test each feature:
   - ✅ Chatbot fits screen
   - ✅ Form is easy to use
   - ✅ Text is readable
   - ✅ Buttons are tappable (>48px)
   - ✅ No horizontal scroll

---

### Test 9: Performance

**Goal**: Verify page loads quickly

**Steps**:
1. Open DevTools → Network tab
2. Hard refresh (Ctrl+Shift+R)
3. Check:
   - ✅ Total load time < 3 seconds
   - ✅ No red (failed) requests
   - ✅ CSS and JS files loaded
   - ✅ No console errors

**Lighthouse Check**:
1. DevTools → Lighthouse
2. Click "Analyze page load"
3. Expected scores:
   - Performance: > 90
   - Accessibility: > 95
   - Best Practices: > 95

---

## 🐛 Troubleshooting

### Chatbot Not Appearing

**Check**:
```javascript
// Console
console.log(window.aiChatbot)  // Should not be undefined
console.log(document.getElementById('chatbot-widget'))  // Should exist
```

**Fix**:
- Clear browser cache (Ctrl+Shift+Del)
- Check for console errors (F12)
- Verify CSS file is loaded (`/public/chatbot.css`)

### Form Not Submitting

**Check**:
```javascript
// In console
window.leadSystem.calculateFormCompletion(
  document.getElementById('contactForm')
)
// Should return 100 if form is complete
```

**Fix**:
- Ensure all required fields are filled
- Check server is running (`npm run server`)
- Check `/api/leads` endpoint (should return 200)

### Emails Not Sending

**Check**:
```javascript
// Verify configuration
console.log(process.env.GMAIL_USER)
console.log(process.env.GMAIL_PASS)
```

**Common Issues**:
1. Gmail password is wrong (use app password)
2. Less secure apps not enabled
3. 2FA not configured
4. Account blocked due to suspicious activity

**Fix**:
1. Generate new app password: https://myaccount.google.com/apppasswords
2. Use 16-character password in `.env`
3. Restart server

### Low Lead Scores

**Reason**: Engagement metrics not yet collected

**Fix**:
- Spend more time on site (min 30 seconds)
- Click on services (interact with page)
- Fill out entire form
- These increase engagement score

---

## 📊 Key Metrics to Monitor

| Metric | Good | Excellent |
|--------|------|-----------|
| Conversion Rate | >2% | >5% |
| Avg Lead Score | 50+ | 70+ |
| Chatbot Engagement | 10% | 25% |
| Form Completion | 60% | 80% |
| Hot Leads % | 20% | 40% |
| Avg Session Duration | 1-2 min | 3-5 min |

---

## 🔧 Configuration Optimization

### Chatbot Settings
Edit `/src/ai-chatbot.js`:
```javascript
// Line ~50: Change trigger time
this.showInitialGreeting();  // Currently after 1.5s
```

### Lead Scoring Weights
Edit `/src/lead-system.js`:
```javascript
this.scoreWeights = {
    serviceInterest: 0.40,      // Adjust weight
    engagementTime: 0.30,
    formCompletion: 0.20,
    source: 0.10
};
```

### Tracking Batch Size
Edit `/src/behavior-tracker.js`:
```javascript
this.batchSize = 10;            // Upload after 10 events
this.uploadInterval = 30000;    // Or after 30 seconds
```

---

## 🚀 Deployment Checklist

- [ ] Copy `.env.example` to `.env`
- [ ] Add all required credentials
- [ ] Run `npm install`
- [ ] Test all 9 features above
- [ ] Run `npm run build`
- [ ] Deploy to production
- [ ] Update `.env` with production credentials
- [ ] Setup email notifications
- [ ] Configure webhook URLs
- [ ] Monitor dashboard daily

---

## 📈 Next Steps for Production

1. **Setup Analytics**
   - Add Google Analytics ID
   - Setup Sentry error tracking
   - Configure webhook to CRM

2. **Scale Backend**
   - Move from local storage to MongoDB
   - Setup Redis caching
   - Enable database backups

3. **Optimize AI**
   - Fine-tune chatbot responses
   - A/B test personalization
   - Analyze conversion funnel

4. **Monitoring**
   - Setup uptime monitoring
   - Email alerts for errors
   - Daily analytics review

---

## 💡 Pro Tips

1. **Test Different Scenarios**
   - New visitor vs returning
   - Mobile vs desktop
   - Different service interests

2. **Monitor Real Data**
   - Check dashboard daily
   - Track lead quality
   - Review chat conversations

3. **Optimize Continuously**
   - A/B test CTA copy
   - Refine chatbot responses
   - Adjust lead scoring weights

4. **Keep Updated**
   - Monitor error logs
   - Review user feedback
   - Update AI responses

---

## 📞 Support

- **Errors**: Check browser console (F12)
- **Server Issues**: Check terminal output
- **Email Problems**: Verify `.env` credentials
- **Performance**: Check Network tab (F12)

---

**Last Updated**: April 6, 2026
**Version**: 1.0.0
**Status**: Production Ready ✅

