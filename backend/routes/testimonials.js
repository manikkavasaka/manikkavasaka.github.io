const express = require('express');
const { readDb, writeDb, nextId } = require('../data/store');

const router = express.Router();

router.get('/', (_req, res) => {
  const db = readDb();
  res.json({ ok: true, data: db.testimonials });
});

router.post('/', (req, res) => {
  const db = readDb();
  const payload = req.body || {};
  const item = {
    id: nextId(db.testimonials),
    client_name: payload.client_name || '',
    company: payload.company || '',
    review: payload.review || '',
    rating: Number(payload.rating || 5),
    approved: Boolean(payload.approved),
    created_at: new Date().toISOString()
  };
  db.testimonials.unshift(item);
  writeDb(db);
  res.status(201).json({ ok: true, data: item });
});

router.patch('/:id/approve', (req, res) => {
  const db = readDb();
  const id = req.params.id;
  const item = db.testimonials.find((entry) => String(entry.id) === String(id));
  if (!item) return res.status(404).json({ ok: false, message: 'Testimonial not found' });
  item.approved = req.body?.approved ?? true;
  writeDb(db);
  res.json({ ok: true, data: item });
});

router.delete('/:id', (req, res) => {
  const db = readDb();
  const id = req.params.id;
  const initialLength = db.testimonials.length;
  db.testimonials = db.testimonials.filter((entry) => String(entry.id) !== String(id));
  
  if (db.testimonials.length === initialLength) {
    return res.status(404).json({ ok: false, message: 'Testimonial not found' });
  }
  
  writeDb(db);
  res.json({ ok: true, message: 'Testimonial deleted' });
});

module.exports = router;
