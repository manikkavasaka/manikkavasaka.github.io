const express = require('express');
const cors = require('cors');
const { verifyConnection } = require('../mailer.cjs');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const leadRoutes = require('./routes/leads');
const blogRoutes = require('./routes/blog-posts');
const portfolioRoutes = require('./routes/portfolio');
const testimonialRoutes = require('./routes/testimonials');
const subscriberRoutes = require('./routes/subscribers');
const paymentRoutes = require('./routes/payments');

const app = express();
const PORT = process.env.PORT || 4000;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || process.env.SMTP_USER || 'mkshopzone2@gmail.com';

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.get('/', (_req, res) => {
  res.json({
    ok: true,
    service: 'MK ShopZone Express REST API',
    adminEmail: ADMIN_EMAIL,
    endpoints: [
      '/api/health',
      '/api/auth/login',
      '/api/leads',
      '/api/contact',
      '/api/blog-posts',
      '/api/portfolio',
      '/api/testimonials',
      '/api/subscribers',
      '/api/newsletter',
      '/api/payments'
    ]
  });
});

app.get('/api/health', async (_req, res) => {
  const smtpReady = await verifyConnection();
  res.json({ ok: true, smtpReady, service: 'MK ShopZone Express REST API' });
});

app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/contact', leadRoutes);
app.use('/api/blog-posts', blogRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/subscribers', subscriberRoutes);
app.use('/api/newsletter', subscriberRoutes);
app.use('/api/payments', paymentRoutes);

app.use((req, res) => {
  res.status(404).json({ ok: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
});

(async () => {
  const smtpReady = await verifyConnection();
  if (!smtpReady) {
    console.log('⚠️ SMTP verify failed. API still started for debugging.');
  }
  app.listen(PORT, () => {
    console.log(`✅ MK ShopZone Express REST API running on http://localhost:${PORT}`);
  });
})();
