const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const dataDir = __dirname;
const dbPath = path.join(dataDir, 'db.json');

const seed = {
  users: [
    {
      id: 1,
      email: 'mkshopzone2@gmail.com',
      password_hash: bcrypt.hashSync('Admin@123', 10),
      role: 'admin'
    }
  ],
  leads: [],
  blog_posts: [],
  portfolio: [],
  testimonials: [],
  subscribers: [],
  payments: []
};

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, JSON.stringify(seed, null, 2));
}

const readDb = () => JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
const writeDb = (data) => fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
const nextId = (items) => items.length ? Math.max(...items.map((item) => Number(item.id) || 0)) + 1 : 1;

module.exports = { readDb, writeDb, nextId };
