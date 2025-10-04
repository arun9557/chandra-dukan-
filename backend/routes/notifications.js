const express = require('express');
const router = express.Router();

// Mock notifications
let notifications = [];

router.get('/', (req, res) => {
  res.json({ success: true, data: notifications });
});

router.post('/', (req, res) => {
  const { title, message, to } = req.body || {};
  if (!title || !message) return res.status(400).json({ error: 'Title and message required' });
  const note = { id: notifications.length + 1, title, message, to, created_at: new Date().toISOString() };
  notifications.push(note);
  res.status(201).json({ success: true, data: note });
});

module.exports = router;
