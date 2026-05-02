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
      <h1>Thanks for contacting MK ShopZone ✅</h1>
      <p>Hi ${name},</p>
      <p>We received your inquiry successfully.</p>
      <p>Our team will get back to you within 24 hours.</p>
      <ul>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Business:</strong> ${business || 'N/A'}</li>
        <li><strong>Service:</strong> ${service || subject || 'N/A'}</li>
        <li><strong>Budget:</strong> ${budget || 'N/A'}</li>
      </ul>
      <p>Regards,<br/>MK ShopZone</p>
    `;

    const { sendWhatsApp, sendRegistrationMessage } = require('../utils/whatsapp');
    const ADMIN_WHATSAPP = process.env.ADMIN_WHATSAPP || '+918220042457';

    const adminResult = await sendEmail(ADMIN_EMAIL, `New Lead: ${name}`, adminHtml);
    const clientResult = await sendEmail(email, 'We received your inquiry - MK ShopZone', clientHtml);

    // Send WhatsApp to Admin
    await sendWhatsApp(ADMIN_WHATSAPP, `🚀 New Lead on MK ShopZone!\nName: ${name}\nPhone: ${phone || 'N/A'}\nService: ${service || subject || 'N/A'}\nMessage: ${message || 'N/A'}`);

    // Send WhatsApp to Client if phone provided
    if (phone) {
      await sendRegistrationMessage(name, phone);
    }

    if (!adminResult || !clientResult) {
      throw new Error('Email send failed');
    }

    res.status(201).json({
      ok: true,
      data: lead,
      adminMessageId: adminResult.messageId,
      clientMessageId: clientResult.messageId
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
