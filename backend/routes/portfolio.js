const express = require('express');
const { readDb, writeDb, nextId } = require('../data/store');

const router = express.Router();

router.get('/', (_req, res) => {
  const db = readDb();
  res.json({ ok: true, data: db.portfolio });
});

router.post('/', (req, res) => {
  const db = readDb();
  const payload = req.body || {};
  const item = {
    id: nextId(db.portfolio),
    title: payload.title || '',
    description: payload.description || '',
    results: payload.results || '',
    image: payload.image || '',
    pdf: payload.pdf || '',
    created_at: new Date().toISOString()
  };
  db.portfolio.unshift(item);
  writeDb(db);
  res.status(201).json({ ok: true, data: item });
});

router.patch('/:id', (req, res) => {
  const db = readDb();
  const id = Number(req.params.id);
  const item = db.portfolio.find((entry) => Number(entry.id) === id);
  if (!item) return res.status(404).json({ ok: false, message: 'Portfolio item not found' });
  Object.assign(item, req.body || {});
  writeDb(db);
  res.json({ ok: true, data: item });
});

router.delete('/:id', (req, res) => {
  const db = readDb();
  const id = Number(req.params.id);
  db.portfolio = db.portfolio.filter((entry) => Number(entry.id) !== id);
  writeDb(db);
  res.json({ ok: true });
});

module.exports = router;
