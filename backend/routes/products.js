// Products API Routes - Products के लिए API routes
// Product management endpoints

const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');

const store = require('../utils/jsonStore');

// Load from JSON store
let products = store.read('products', [
  {
    id: 1,
    category_id: 1,
    name: "Coca Cola 600ml",
    price: 40,
    stock: 25,
    image: "https://via.placeholder.com/200x200?text=Coca+Cola",
    description: "Refreshing cold drink",
    unit: "bottle",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    category_id: 1,
    name: "Pepsi 600ml",
    price: 40,
    stock: 20,
    image: "https://via.placeholder.com/200x200?text=Pepsi",
    description: "Refreshing cold drink",
    unit: "bottle",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 3,
    category_id: 2,
    name: "Lays Chips Classic",
    price: 20,
    stock: 40,
    image: "https://via.placeholder.com/200x200?text=Lays+Chips",
    description: "Crispy potato chips",
    unit: "packet",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]);

let categories = store.read('categories', [
  { id: 1, name: "Cold Drinks & Beverages", hindi_name: "Cold Drink aur Juice", icon: "🥤" },
  { id: 2, name: "Namkeen & Snacks", hindi_name: "Namkeen aur Biscuit", icon: "🍪" },
  { id: 3, name: "Daily Essentials", hindi_name: "Rojana Saman", icon: "🛒" },
  { id: 4, name: "Dairy Products", hindi_name: "Milk aur Eggs", icon: "🥛" },
  { id: 5, name: "Gas Cylinder", hindi_name: "Cooking Gas", icon: "🔥" },
  { id: 6, name: "Jan Seva Kendra", hindi_name: "Sarkari Services", icon: "📋" }
]);

// Multer storage for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), 'public', 'uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Get all products - सभी products get करना
router.get('/', (req, res) => {
  try {
    const { category_id, search, sort, limit = 50, offset = 0 } = req.query;
    
    let filteredProducts = [...products];
    
    // Filter by category
    if (category_id) {
      filteredProducts = filteredProducts.filter(p => p.category_id == category_id);
    }
    
    // Search by name
    if (search) {
      const searchTerm = search.toLowerCase();
      filteredProducts = filteredProducts.filter(p => 
        p.name.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm)
      );
    }
    
    // Sort products
    if (sort) {
      switch(sort) {
        case 'price-low':
          filteredProducts.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          filteredProducts.sort((a, b) => b.price - a.price);
          break;
        case 'name':
          filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'stock':
          filteredProducts.sort((a, b) => b.stock - a.stock);
          break;
        default:
          filteredProducts.sort((a, b) => a.id - b.id);
      }
    }
    
    // Pagination
    const paginatedProducts = filteredProducts.slice(offset, offset + parseInt(limit));
    
    res.json({
      success: true,
      data: paginatedProducts,
      total: filteredProducts.length,
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

// Get product by ID - Product को ID से get करना
router.get('/:id', (req, res) => {
  try {
    const product = products.find(p => p.id == req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    
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

// Create new product - नया product create करना
router.post('/', [
  body('name').notEmpty().withMessage('Product name is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('category_id').isNumeric().withMessage('Category ID is required'),
  body('stock').isNumeric().withMessage('Stock must be a number')
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }
    
    const {
      name,
      price,
      category_id,
      stock,
      description,
      image,
      unit
    } = req.body;
    
    const newProduct = {
      id: Math.max(...products.map(p => p.id)) + 1,
      name,
      price: parseFloat(price),
      category_id: parseInt(category_id),
      stock: parseInt(stock),
      description: description || '',
      image: image || 'https://via.placeholder.com/200x200?text=Product',
      unit: unit || 'piece',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    products.push(newProduct);
    store.write('products', products);
    
    res.status(201).json({
      success: true,
      data: newProduct,
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

// Upload product image - Product image upload करना
router.post('/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    res.status(201).json({ success: true, data: { url: fileUrl }, message: 'Image uploaded successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to upload image', message: error.message });
  }
});

// Update product - Product update करना
router.put('/:id', [
  body('name').optional().notEmpty().withMessage('Product name cannot be empty'),
  body('price').optional().isNumeric().withMessage('Price must be a number'),
  body('stock').optional().isNumeric().withMessage('Stock must be a number')
], (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }
    
    const productIndex = products.findIndex(p => p.id == req.params.id);
    
    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    
    const updatedProduct = {
      ...products[productIndex],
      ...req.body,
      updated_at: new Date().toISOString()
    };
    
    products[productIndex] = updatedProduct;
    store.write('products', products);
    
    res.json({
      success: true,
      data: updatedProduct,
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

// Update product stock - Product stock update करना
router.patch('/:id/stock', [
  body('stock').isNumeric().withMessage('Stock must be a number'),
  body('operation').optional().isIn(['add', 'subtract', 'set']).withMessage('Invalid operation')
], (req, res) => {
  try {
    const { stock, operation = 'set' } = req.body;
    const productIndex = products.findIndex(p => p.id == req.params.id);
    
    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    
    let newStock = products[productIndex].stock;
    
    switch(operation) {
      case 'add':
        newStock += parseInt(stock);
        break;
      case 'subtract':
        newStock -= parseInt(stock);
        break;
      case 'set':
      default:
        newStock = parseInt(stock);
        break;
    }
    
    if (newStock < 0) {
      return res.status(400).json({
        success: false,
        error: 'Stock cannot be negative'
      });
    }
    
    products[productIndex].stock = newStock;
    products[productIndex].updated_at = new Date().toISOString();
    
    res.json({
      success: true,
      data: products[productIndex],
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

// Delete product - Product delete करना
router.delete('/:id', (req, res) => {
  try {
    const productIndex = products.findIndex(p => p.id == req.params.id);
    
    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    
    products.splice(productIndex, 1);
    store.write('products', products);
    
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

// Get categories - Categories get करना
router.get('/categories/all', (req, res) => {
  try {
    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch categories',
      message: error.message
    });
  }
});

// Get low stock products - Low stock products get करना
router.get('/inventory/low-stock', (req, res) => {
  try {
    const { threshold = 10 } = req.query;
    
    const lowStockProducts = products.filter(p => p.stock <= parseInt(threshold));
    
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

module.exports = router;
