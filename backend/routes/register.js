const express = require('express');
const { readDb, writeDb, nextId } = require('../../backend/data/store');
const { sendWelcomeEmail, sendAdminNotification } = require('../../mailer.cjs');
const { sendWhatsAppMessage } = require('../../whatsapp.cjs');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, email, phone, company, serviceInterested, message, budget } = req.body || {};

    if (!name || !email || !phone) {
      return res.status(400).json({ ok: false, message: 'Name, email, and phone are required' });
    }

    // 0. Save lead to database
    const db = readDb();
    const lead = {
      id: nextId(db.leads),
      name,
      email,
      phone,
      business: company || 'Lead Magnet',
      budget: budget || 0,
      message: message || 'Downloaded the 2026 Digital Growth Checklist.',
      service: serviceInterested || 'Lead Magnet Download',
      status: 'new',
      created_at: new Date().toISOString()
    };
    db.leads.unshift(lead);
    writeDb(db);

    // 1. Send Welcome Email to User
    try {
      await sendWelcomeEmail(name, email);
    } catch (err) {
      console.error('Failed to send welcome email:', err);
    }

    // 2. Send WhatsApp Message to User
    try {
      await sendWhatsAppMessage(phone, name);
    } catch (err) {
      console.error('Failed to send WhatsApp message to user:', err);
    }

    // 3. 🚨 Notify ADMIN (You)
    try {
      await sendAdminNotification(lead);
      await sendWhatsAppMessage(process.env.ADMIN_WHATSAPP || '+917200059453', `🚀 New Lead: ${name}\n📧 ${email}\n📱 ${phone}\n💼 ${lead.business}`);
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
