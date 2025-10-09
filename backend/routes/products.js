// Products API Routes with MongoDB - Products के लिए MongoDB API routes
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Product = require('../models/Product');
const Category = require('../models/Category');

// Get all products with advanced filtering - सभी products get करना with filters
router.get('/', async (req, res) => {
  try {
    const { 
      category,           // Category filter - category se filter
      search,             // Search term - search query
      sort,               // Sort option - sort type
      limit = 50,         // Results per page - page size
      offset = 0,         // Pagination offset - skip count
      active,             // Active products only - active filter
      minPrice,           // Minimum price - lowest price
      maxPrice,           // Maximum price - highest price
      inStock,            // In stock only - stock available filter
      hasDiscount,        // Has discount only - discount products
      featured,           // Featured products - featured filter
      tags                // Filter by tags - tags se filter
    } = req.query;
    
    let query = {};
    
    // Filter by category - Category se filter karna
    if (category) {
      // Multiple categories support (comma separated)
      const categories = category.split(',');
      query.category = categories.length > 1 ? { $in: categories } : category;
    }
    
    // Filter by active status - Active products only
    if (active === 'true') {
      query.isActive = true;
    }
    
    // Search by name or description - Name ya description me search
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Price range filter - Price range se filter karna
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    
    // In stock filter - Stock available filter
    if (inStock === 'true') {
      query.stock = { $gt: 0 };
    }
    
    // Has discount filter - Discount wale products
    if (hasDiscount === 'true') {
      query.discount = { $gt: 0 };
    }
    
    // Featured products filter - Featured products
    if (featured === 'true') {
      query.isFeatured = true;
    }
    
    // Filter by tags - Tags se filter karna
    if (tags) {
      const tagList = tags.split(',');
      query.tags = { $in: tagList };
    }
    
    // Build sort object - Sort order banana
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
      case 'popularity':
        sortObj = { views: -1, sold: -1 };
        break;
      case 'newest':
        sortObj = { createdAt: -1 };
        break;
      case 'top-rated':
        sortObj = { 'ratings.average': -1, 'ratings.count': -1 };
        break;
      case 'discount':
        sortObj = { discount: -1 };
        break;
      default:
        sortObj = { createdAt: -1 };
    }
    
    // Execute query with pagination - Query execute karna
    const products = await Product.find(query)
      .populate('category', 'name hindiName icon')
      .sort(sortObj)
      .limit(parseInt(limit))
      .skip(parseInt(offset));
    
    const total = await Product.countDocuments(query);
    
    // Response with filter metadata - Response me filter info bhi bhejo
    res.json({
      success: true,
      data: products,
      total,
      limit: parseInt(limit),
      offset: parseInt(offset),
      filters: {
        category: category || null,
        priceRange: {
          min: minPrice ? parseFloat(minPrice) : null,
          max: maxPrice ? parseFloat(maxPrice) : null
        },
        inStock: inStock === 'true',
        hasDiscount: hasDiscount === 'true',
        featured: featured === 'true',
        tags: tags ? tags.split(',') : []
      },
      sort: sort || 'newest'
    });
  } catch (error) {
    console.error('Products fetch error:', error);
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

// Search products - Products search करना (advanced search with multiple fields)
router.get('/search/query', async (req, res) => {
  try {
    const { query, limit = 20 } = req.query;
    
    // Agar query nahi hai to empty array return karo
    if (!query || query.trim() === '') {
      return res.json({
        success: true,
        data: [],
        total: 0,
        query: ''
      });
    }
    
    const searchTerm = query.trim();
    
    // Multiple fields me search karo - name, description, tags
    const searchQuery = {
      $and: [
        { isActive: true },
        {
          $or: [
            { name: { $regex: searchTerm, $options: 'i' } },
            { description: { $regex: searchTerm, $options: 'i' } },
            { tags: { $in: [new RegExp(searchTerm, 'i')] } }
          ]
        }
      ]
    };
    
    // Search results with category details
    const products = await Product.find(searchQuery)
      .populate('category', 'name hindiName icon')
      .sort({ views: -1, sold: -1 }) // Popular products pehle
      .limit(parseInt(limit));
    
    const total = await Product.countDocuments(searchQuery);
    
    res.json({
      success: true,
      data: products,
      total,
      query: searchTerm,
      limit: parseInt(limit)
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      error: 'Search failed',
      message: error.message
    });
  }
});

module.exports = router;
