// Products API Routes with MongoDB - Products के लिए MongoDB API routes
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Product = require('../models/Product');
const Category = require('../models/Category');

// Get all products - सभी products get करना
router.get('/', async (req, res) => {
  try {
    const { category, search, sort, limit = 50, offset = 0, active } = req.query;
    
    let query = {};
    
    // Filter by category
    if (category) {
      query.category = category;
    }
    
    // Filter by active status
    if (active === 'true') {
      query.isActive = true;
    }
    
    // Search by name or description
    if (search) {
      query.$text = { $search: search };
    }
    
    // Build sort object
    let sortObj = {};
    switch(sort) {
      case 'price-low':
        sortObj = { price: 1 };
        break;
      case 'price-high':
        sortObj = { price: -1 };
        break;
      case 'name':
        sortObj = { name: 1 };
        break;
      case 'stock':
        sortObj = { stock: -1 };
        break;
      default:
        sortObj = { createdAt: -1 };
    }
    
    const products = await Product.find(query)
      .populate('category', 'name hindiName icon')
      .sort(sortObj)
      .limit(parseInt(limit))
      .skip(parseInt(offset));
    
    const total = await Product.countDocuments(query);
    
    res.json({
      success: true,
      data: products,
      total,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch products',
      message: error.message
    });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name hindiName icon');
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    
    // Increment views
    await product.incrementViews();
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch product',
      message: error.message
    });
  }
});

// Create new product
router.post('/', [
  body('name').notEmpty().withMessage('Product name is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('category').notEmpty().withMessage('Category is required'),
  body('stock').isNumeric().withMessage('Stock must be a number')
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
    
    const product = new Product(req.body);
    await product.save();
    
    // Update category product count
    await Category.updateProductCount(product.category);
    
    res.status(201).json({
      success: true,
      data: product,
      message: 'Product created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create product',
      message: error.message
    });
  }
});

// Update product
router.put('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('category', 'name hindiName icon');
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      data: product,
      message: 'Product updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update product',
      message: error.message
    });
  }
});

// Update product stock
router.patch('/:id/stock', [
  body('quantity').isNumeric().withMessage('Quantity must be a number'),
  body('operation').optional().isIn(['add', 'subtract', 'set']).withMessage('Invalid operation')
], async (req, res) => {
  try {
    const { quantity, operation = 'set' } = req.body;
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    
    await product.updateStock(parseInt(quantity), operation);
    
    res.json({
      success: true,
      data: product,
      message: 'Stock updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update stock',
      message: error.message
    });
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    
    // Update category product count
    await Category.updateProductCount(product.category);
    
    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete product',
      message: error.message
    });
  }
});

// Get low stock products
router.get('/inventory/low-stock', async (req, res) => {
  try {
    const { threshold = 10 } = req.query;
    
    const lowStockProducts = await Product.findLowStock(parseInt(threshold))
      .populate('category', 'name hindiName icon');
    
    res.json({
      success: true,
      data: lowStockProducts,
      threshold: parseInt(threshold)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch low stock products',
      message: error.message
    });
  }
});

// Get featured products
router.get('/featured/all', async (req, res) => {
  try {
    const featuredProducts = await Product.findFeatured()
      .populate('category', 'name hindiName icon')
      .limit(20);
    
    res.json({
      success: true,
      data: featuredProducts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch featured products',
      message: error.message
    });
  }
});

module.exports = router;
