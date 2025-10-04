const express = require('express');
const router = express.Router();

// Simple customers mock
let customers = [];

router.get('/', (req, res) => {
  res.json({ success: true, data: customers });
});

router.post('/', (req, res) => {
  const { name, phone, address } = req.body || {};
  if (!name || !phone) return res.status(400).json({ error: 'Name and phone required' });
  const customer = { id: customers.length + 1, name, phone, address };
  customers.push(customer);
  res.status(201).json({ success: true, data: customer });
});

module.exports = router;
