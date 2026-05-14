const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { readDb, writeDb, nextId } = require('../data/store');
const { sendRegistrationMessage } = require('../utils/whatsapp');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'mkshopzone_secret_2024';

router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ ok: false, message: 'All fields are required' });
    }

    const db = readDb();
    
    // Check if user already exists
    if (db.users.find(u => u.email === email)) {
      return res.status(400).json({ ok: false, message: 'User already exists' });
    }

    // 1. Password hash பண்ணு
    const hashedPassword = await bcrypt.hash(password, 10);

    // 2. DB-ல save பண்ணு
    const newUser = {
      id: nextId(db.users),
      name,
      email,
      phone,
      password_hash: hashedPassword,
      role: 'user',
      created_at: new Date().toISOString()
    };

    db.users.push(newUser);
    writeDb(db);

    // 3. WhatsApp message அனுப்பு
    await sendRegistrationMessage(name, phone);

    res.json({ 
      success: true,
      message: 'Registration successful! WhatsApp message அனுப்பினோம்!' 
    });

  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const db = readDb();
    const user = db.users.find(u => u.email === email);

    if (!user) {
      return res.status(401).json({ ok: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ ok: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      ok: true,
      message: 'Login successful',
      token,
      user: { id: user.id, email: user.email, name: user.name || 'Admin', role: user.role }
    });
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message });
  }
});

module.exports = router;
