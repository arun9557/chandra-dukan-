// Categories API Routes - Categories ke liye API routes
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

const store = require('../utils/jsonStore');

let categories = store.read('categories', [
  { id: 1, name: 'Cold Drinks & Beverages', hindi_name: 'Cold Drink aur Juice', icon: '🥤' },
  { id: 2, name: 'Namkeen & Snacks', hindi_name: 'Namkeen aur Biscuit', icon: '🍪' },
  { id: 3, name: 'Daily Essentials', hindi_name: 'Rojana Saman', icon: '🛒' },
  { id: 4, name: 'Dairy Products', hindi_name: 'Milk aur Eggs', icon: '🥛' },
  { id: 5, name: 'Gas Cylinder', hindi_name: 'Cooking Gas', icon: '🔥' },
  { id: 6, name: 'Jan Seva Kendra', hindi_name: 'Sarkari Services', icon: '📋' }
]);

router.get('/', (req, res) => {
  res.json({ success: true, data: categories });
});

router.post('/', [
  body('name').notEmpty(),
  body('hindi_name').optional().isString(),
  body('icon').optional().isString()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, error: 'Validation failed', details: errors.array() });
  }
  const { name, hindi_name, icon } = req.body;
  const newCategory = { id: Math.max(...categories.map(c => c.id)) + 1, name, hindi_name: hindi_name || '', icon: icon || '🛍️' };
  categories.push(newCategory);
  store.write('categories', categories);
  res.status(201).json({ success: true, data: newCategory, message: 'Category created' });
});

router.put('/:id', [
  body('name').optional().notEmpty(),
  body('hindi_name').optional().isString(),
  body('icon').optional().isString()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, error: 'Validation failed', details: errors.array() });
  }
  const idx = categories.findIndex(c => c.id == req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, error: 'Category not found' });
  categories[idx] = { ...categories[idx], ...req.body };
  store.write('categories', categories);
  res.json({ success: true, data: categories[idx], message: 'Category updated' });
});

router.delete('/:id', (req, res) => {
  const idx = categories.findIndex(c => c.id == req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, error: 'Category not found' });
  categories.splice(idx, 1);
  store.write('categories', categories);
  res.json({ success: true, message: 'Category deleted' });
});

module.exports = router;


