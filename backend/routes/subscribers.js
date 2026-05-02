const express = require('express');
const { readDb, writeDb, nextId } = require('../data/store');
const { sendEmail } = require('../../mailer.cjs');
require('dotenv').config();

const router = express.Router();
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || process.env.SMTP_USER || 'mkshopzone2@gmail.com';

router.get('/', (_req, res) => {
  const db = readDb();
  res.json({ ok: true, data: db.subscribers });
});

router.post('/', async (req, res) => {
  try {
    const { email } = req.body || {};
    if (!email) return res.status(400).json({ ok: false, message: 'Email is required' });

    const db = readDb();
    const exists = db.subscribers.find((item) => item.email === email);
    if (exists) {
      return res.json({ ok: true, data: exists, message: 'Already subscribed' });
    }

    const item = { id: nextId(db.subscribers), email, subscribed_at: new Date().toISOString() };
    db.subscribers.unshift(item);
    writeDb(db);

    const adminResult = await sendEmail(
      ADMIN_EMAIL,
      `New Subscriber: ${email}`,
      `<h2>New Newsletter Subscriber - MK ShopZone</h2><p><strong>Email:</strong> ${email}</p>`
    );

    const clientResult = await sendEmail(
      email,
      'Welcome to MK ShopZone Newsletter',
      '<h1>Welcome to MK ShopZone Newsletter 🎉</h1><p>Thanks for subscribing. You will receive SEO, ads, and growth tips in your inbox soon.</p>'
    );

    if (!adminResult || !clientResult) {
      throw new Error('Newsletter email send failed');
    }

    res.status(201).json({
      ok: true,
      data: item,
      adminMessageId: adminResult.messageId,
      clientMessageId: clientResult.messageId
    });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message || 'Subscriber create failed' });
  }
});

module.exports = router;
