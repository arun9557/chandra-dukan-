// FAQ Routes - FAQ API routes
// FAQs ko manage karne ke liye routes

const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const FAQ = require('../models/FAQ');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Get all FAQs - Sab FAQs get karna (public)
router.get('/', async (req, res) => {
  try {
    const { category, search, active = 'true' } = req.query;
    
    let query = {};
    
    // Filter by active status
    if (active === 'true') {
      query.isActive = true;
    }
    
    // Filter by category
    if (category && category !== 'all') {
      query.category = category;
    }
    
    // Search in question and answer
    if (search) {
      query.$or = [
        { question: { $regex: search, $options: 'i' } },
        { answer: { $regex: search, $options: 'i' } },
        { question_hi: { $regex: search, $options: 'i' } }
      ];
    }
    
    const faqs = await FAQ.find(query)
      .sort({ displayOrder: 1, createdAt: -1 });
    
    res.json({
      success: true,
      count: faqs.length,
      data: faqs
    });
  } catch (error) {
    console.error('Get FAQs error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch FAQs',
      message: error.message
    });
  }
});

// Get single FAQ by ID
router.get('/:id', async (req, res) => {
  try {
    const faq = await FAQ.findById(req.params.id);
    
    if (!faq) {
      return res.status(404).json({
        success: false,
        error: 'FAQ not found'
      });
    }
    
    res.json({
      success: true,
      data: faq
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch FAQ',
      message: error.message
    });
  }
});

// Create new FAQ (Admin only)
router.post('/', authenticateToken, requireAdmin, [
  body('question').notEmpty().withMessage('Question is required'),
  body('answer').notEmpty().withMessage('Answer is required'),
  body('category').notEmpty().withMessage('Category is required')
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
    
    const faq = new FAQ(req.body);
    await faq.save();
    
    res.status(201).json({
      success: true,
      message: 'FAQ created successfully',
      data: faq
    });
  } catch (error) {
    console.error('Create FAQ error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create FAQ',
      message: error.message
    });
  }
});

// Update FAQ (Admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const faq = await FAQ.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!faq) {
      return res.status(404).json({
        success: false,
        error: 'FAQ not found'
      });
    }
    
    res.json({
      success: true,
      message: 'FAQ updated successfully',
      data: faq
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update FAQ',
      message: error.message
    });
  }
});

// Delete FAQ (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const faq = await FAQ.findByIdAndDelete(req.params.id);
    
    if (!faq) {
      return res.status(404).json({
        success: false,
        error: 'FAQ not found'
      });
    }
    
    res.json({
      success: true,
      message: 'FAQ deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete FAQ',
      message: error.message
    });
  }
});

// Bulk create FAQs (Admin only) - Multiple FAQs ek saath create karna
router.post('/bulk', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { faqs } = req.body;
    
    if (!Array.isArray(faqs) || faqs.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'FAQs array is required'
      });
    }
    
    const createdFAQs = await FAQ.insertMany(faqs);
    
    res.status(201).json({
      success: true,
      message: `${createdFAQs.length} FAQs created successfully`,
      data: createdFAQs
    });
  } catch (error) {
    console.error('Bulk create FAQs error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create FAQs',
      message: error.message
    });
  }
});

module.exports = router;
