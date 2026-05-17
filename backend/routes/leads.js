const express = require('express');
const { readDb, writeDb, nextId } = require('../data/store');
const { sendEmail } = require('../../mailer.cjs');
require('dotenv').config();

const router = express.Router();
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || process.env.SMTP_USER || 'mkshopzone2@gmail.com';

router.get('/', (_req, res) => {
  const db = readDb();
  res.json({ ok: true, data: db.leads });
});

router.post('/', async (req, res) => {
  try {
    const { name, email, phone, business, budget, message, service, subject } = req.body || {};
    if (!name || !email) {
      return res.status(400).json({ ok: false, message: 'Name and email are required' });
    }

    const db = readDb();
    const lead = {
      id: nextId(db.leads),
      name,
      email,
      phone: phone || '',
      business: business || '',
      budget: budget || '',
      message: message || '',
      service: service || subject || '',
      status: 'new',
      created_at: new Date().toISOString()
    };

    db.leads.unshift(lead);
    writeDb(db);

    const adminHtml = `
      <h2>New Lead - MK ShopZone</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Business:</strong> ${business || 'N/A'}</p>
      <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
      <p><strong>Budget:</strong> ${budget || 'N/A'}</p>
      <p><strong>Service:</strong> ${service || subject || 'N/A'}</p>
      <p><strong>Message:</strong> ${message || 'N/A'}</p>
    `;

    const clientHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <p>Hi ${name},</p>
        <p>Thank you for reaching out to MK ShopZone!</p>
        <p>We received your inquiry about <strong>${service || subject || 'our'}</strong> services. Our team will review your requirements and get back to you within 24 hours.</p>
        
        <p>Here's a summary of your request:</p>
        <ul>
          <li><strong>Service:</strong> ${service || subject || 'N/A'}</li>
          <li><strong>Phone:</strong> ${phone || 'N/A'}</li>
        </ul>
        
        <p>Meanwhile, feel free to WhatsApp us directly for a faster response:<br/>
        📱 <a href="https://wa.me/917200059453">+91 7200059453</a></p>
        
        <p>Best Regards,<br/>
        <strong>MK ShopZone Team</strong><br/>
        <a href="https://mkshopzone.me">mkshopzone.me</a></p>
      </div>
    `;

    const { sendWhatsApp, sendRegistrationMessage } = require('../utils/whatsapp');
    const ADMIN_WHATSAPP = process.env.ADMIN_WHATSAPP || '+918220042457';

    // Trigger all email and WhatsApp notifications asynchronously in the background
    (async () => {
      try {
        await sendEmail(email, 'Thank You for Contacting MK ShopZone! 🚀', clientHtml);
      } catch (err) {
        console.error('⚠️ Failed to send client welcome email:', err.message || err);
      }

      try {
        await sendWhatsApp(ADMIN_WHATSAPP, `🚀 New Lead on MK ShopZone!\nName: ${name}\nPhone: ${phone || 'N/A'}\nService: ${service || subject || 'N/A'}\nMessage: ${message || 'N/A'}`);
      } catch (err) {
        console.error('⚠️ Failed to send WhatsApp to Admin:', err.message || err);
      }

      try {
        if (phone) {
          await sendRegistrationMessage(name, phone);
        }
      } catch (err) {
        console.error('⚠️ Failed to send WhatsApp to Client:', err.message || err);
      }
    })();

    res.status(201).json({
      ok: true,
      data: lead
    });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message || 'Lead create failed' });
  }
});

router.patch('/:id/status', (req, res) => {
  const db = readDb();
  const id = req.params.id;
  const { status } = req.body || {};
  const lead = db.leads.find((item) => String(item.id) === String(id));

  if (!lead) {
    return res.status(404).json({ ok: false, message: 'Lead not found' });
  }

  lead.status = status || lead.status;
  writeDb(db);
  res.json({ ok: true, data: lead });
});

router.delete('/:id', (req, res) => {
  const db = readDb();
  const id = req.params.id;
  const initialLength = db.leads.length;
  db.leads = db.leads.filter((item) => String(item.id) !== String(id));

  if (db.leads.length === initialLength) {
    return res.status(404).json({ ok: false, message: 'Lead not found' });
  }

  writeDb(db);
  res.json({ ok: true, message: 'Lead deleted' });
});

module.exports = router;
