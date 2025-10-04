const express = require('express');
const router = express.Router();

// Minimal analytics placeholder
router.get('/', (req, res) => {
  res.json({ success: true, data: { total_orders: 0, total_revenue: 0 } });
});

module.exports = router;
