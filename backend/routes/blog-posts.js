const express = require('express');
const { readDb, writeDb, nextId } = require('../data/store');

const router = express.Router();

router.get('/', (_req, res) => {
  const db = readDb();
  res.json({ ok: true, data: db.blog_posts });
});

router.post('/', (req, res) => {
  const db = readDb();
  const payload = req.body || {};
  const item = {
    id: nextId(db.blog_posts),
    title: payload.title || '',
    slug: payload.slug || '',
    content: payload.content || '',
    image: payload.image || '',
    category: payload.category || 'SEO',
    meta_title: payload.meta_title || '',
    meta_description: payload.meta_description || '',
    published_at: new Date().toISOString()
  };
  db.blog_posts.unshift(item);
  writeDb(db);
  res.status(201).json({ ok: true, data: item });
});

router.patch('/:id', (req, res) => {
  const db = readDb();
  const id = req.params.id;
  const item = db.blog_posts.find((entry) => String(entry.id) === String(id));
  if (!item) return res.status(404).json({ ok: false, message: 'Blog post not found' });
  Object.assign(item, req.body || {});
  writeDb(db);
  res.json({ ok: true, data: item });
});

router.delete('/:id', (req, res) => {
  const db = readDb();
  const id = req.params.id;
  const initialLength = db.blog_posts.length;
  db.blog_posts = db.blog_posts.filter((entry) => String(entry.id) !== String(id));
  
  if (db.blog_posts.length === initialLength) {
    return res.status(404).json({ ok: false, message: 'Blog post not found' });
  }
  
  writeDb(db);
  res.json({ ok: true, message: 'Blog post deleted' });
});

module.exports = router;
