// Categories API Routes - Categories ke liye API routes
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Category = require('../models/Category');

// Get all categories - सभी categories get करना
router.get('/', async (req, res) => {
  try {
    const { active, parent } = req.query;
    
    let query = {};
    if (active === 'true') query.isActive = true;
    if (parent === 'null') query.parent = null;
    
    const categories = await Category.find(query)
      .populate('parent', 'name hindiName')
      .sort({ displayOrder: 1, name: 1 });
    
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch categories', 
      message: error.message 
    });
  }
});

// Get category by ID
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)
      .populate('parent', 'name hindiName');
    
    if (!category) {
      return res.status(404).json({ success: false, error: 'Category not found' });
    }
    
    res.json({ success: true, data: category });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch category', 
      message: error.message 
    });
  }
});

// Create new category
router.post('/', [
  body('name').notEmpty().withMessage('Category name is required'),
  body('hindiName').optional().isString(),
  body('icon').optional().isString(),
  body('description').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }
    
    const category = new Category(req.body);
    await category.save();
    
    res.status(201).json({ 
      success: true, 
      data: category, 
      message: 'Category created successfully' 
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ 
        success: false, 
        error: 'Category with this name already exists' 
      });
    }
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create category', 
      message: error.message 
    });
  }
});

// Update category
router.put('/:id', [
  body('name').optional().notEmpty(),
  body('hindiName').optional().isString(),
  body('icon').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        error: 'Validation failed', 
        details: errors.array() 
      });
    }
    
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!category) {
      return res.status(404).json({ success: false, error: 'Category not found' });
    }
    
    res.json({ 
      success: true, 
      data: category, 
      message: 'Category updated successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update category', 
      message: error.message 
    });
  }
});

// Delete category
router.delete('/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    
    if (!category) {
      return res.status(404).json({ success: false, error: 'Category not found' });
    }
    
    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete category', 
      message: error.message 
    });
  }
});

module.exports = router;


