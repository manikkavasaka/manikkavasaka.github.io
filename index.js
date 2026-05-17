import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import path from 'path';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const express = require('express');
const cors = require('cors');
const { verifyConnection } = require('./mailer.cjs');
require('dotenv').config();

// Import Routes
const authRoutes = require('./backend/routes/auth');
const leadRoutes = require('./backend/routes/leads');
const blogRoutes = require('./backend/routes/blog-posts');
const portfolioRoutes = require('./backend/routes/portfolio');
const testimonialRoutes = require('./backend/routes/testimonials');
const subscriberRoutes = require('./backend/routes/subscribers');
const paymentRoutes = require('./backend/routes/payments');
const registerRoutes = require('./backend/routes/register.js');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// API Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/register', registerRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/contact', leadRoutes);
app.use('/api/blog-posts', blogRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/subscribers', subscriberRoutes);
app.use('/api/newsletter', subscriberRoutes);
app.use('/api/payments', paymentRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'MK ShopZone Unified Server' });
});

// Serve static files from the Vite build directory
app.use(express.static(path.join(__dirname, 'dist')));

// SPA Routing: Send all other requests to index.html
app.use((req, res) => {
  if (req.url.startsWith('/api')) {
    return res.status(404).json({ ok: false, message: 'API route not found' });
  }
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start Server
(async () => {
  try {
    // Run verification in the background without blocking the port binding
    verifyConnection().then(smtpReady => {
      if (smtpReady) console.log('✅ SMTP Server Ready');
    }).catch(err => {
      console.warn('⚠️ SMTP Connection failed:', err.message || err);
    });
    
    app.listen(PORT, () => {
      console.log(`🚀 MK ShopZone Unified Server running on port ${PORT}`);
      console.log(`📡 API: http://localhost:${PORT}/api`);
      console.log(`🌐 Web: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
  }
})();
