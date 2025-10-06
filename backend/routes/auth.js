const express = require('express');
const router = express.Router();

// Simple in-memory demo users (for development/demo only)
const users = [];

// Register - उपयोगकर्ता रजिस्टर करना
router.post('/register', (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email and password are required' });
  }

  const exists = users.find(u => u.email === email);
  if (exists) {
    return res.status(409).json({ error: 'User already exists' });
  }

  const user = { id: users.length + 1, name, email };
  // NOTE: Never store plaintext passwords in production. This is a demo placeholder.
  users.push({ ...user, password });

  res.status(201).json({ message: 'User registered', user });
});

// Login - साइन इन करना
router.post('/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Return a fake token for demo purposes
  const token = `demo-token-${user.id}-${Date.now()}`;
  res.json({ message: 'Login successful', user: { id: user.id, name: user.name, email: user.email }, token });
});

module.exports = router;
