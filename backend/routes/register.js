const express = require('express');
const pool = require('../db.cjs');
const { sendWelcomeEmail, sendAdminNotification } = require('../../mailer.cjs');
const { sendWhatsApp } = require('../utils/whatsapp');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, email, phone, company, serviceInterested, message, budget } = req.body || {};

    if (!name || !email || !phone) {
      return res.status(400).json({ ok: false, message: 'Name, email, and phone are required' });
    }

    // 0. Save lead to PostgreSQL Database
    const query = `
      INSERT INTO leads (name, email, phone, business_name, service_interested, budget_range, message, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    const values = [
      name, 
      email, 
      phone, 
      company || 'Lead Magnet', 
      serviceInterested || 'Lead Magnet Download', 
      budget || '0', 
      message || 'Downloaded the 2026 Digital Growth Checklist.',
      'new'
    ];

    const result = await pool.query(query, values);
    const lead = result.rows[0];

    // 1. Send Welcome Email to User
    try {
      await sendWelcomeEmail(name, email);
    } catch (err) {
      console.error('Failed to send welcome email:', err);
    }

    // 2. Send WhatsApp Message to User
    try {
      await sendWhatsApp(`+91${phone.replace(/^\+91/, '')}`, `👋 Hi ${name}! Your free consultation is confirmed. MK ShopZone team will call you soon. 🚀`);
    } catch (err) {
      console.error('Failed to send WhatsApp message to user:', err);
    }

    // 3. 🚨 Notify ADMIN (You)
    try {
      await sendAdminNotification(lead);
      await sendWhatsApp(process.env.ADMIN_WHATSAPP || '+917200059453', `🚀 New Lead: ${name}\n📧 ${email}\n📱 ${phone}\n💼 ${lead.business_name || 'N/A'}`);
    } catch (err) {
      console.error('Failed to notify admin:', err);
    }

    res.status(200).json({ ok: true, message: 'Registration successful' });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ ok: false, message: 'Registration failed' });
  }
});

module.exports = router;
