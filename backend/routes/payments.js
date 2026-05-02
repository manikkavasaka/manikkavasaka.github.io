const express = require('express');
const { readDb, writeDb, nextId } = require('../data/store');

const router = express.Router();

router.get('/', (_req, res) => {
  const db = readDb();
  res.json({ ok: true, data: db.payments });
});

router.post('/', (req, res) => {
  const db = readDb();
  const payload = req.body || {};
  const item = {
    id: nextId(db.payments),
    lead_id: payload.lead_id || null,
    amount: Number(payload.amount || 0),
    status: payload.status || 'pending',
    gateway_ref: payload.gateway_ref || `mksz_${Date.now()}`,
    created_at: new Date().toISOString()
  };
  db.payments.unshift(item);
  writeDb(db);
  res.status(201).json({ ok: true, data: item });
});

router.patch('/:id', (req, res) => {
  const db = readDb();
  const id = Number(req.params.id);
  const item = db.payments.find((entry) => Number(entry.id) === id);
  if (!item) return res.status(404).json({ ok: false, message: 'Payment not found' });
  Object.assign(item, req.body || {});
  writeDb(db);
  res.json({ ok: true, data: item });
});

module.exports = router;
