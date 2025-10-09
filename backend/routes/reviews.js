// Review Routes - Product reviews ka API
// Reviews add, fetch, update, delete aur moderate karne ke liye

const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Setup multer for review images - Review images upload ke liye multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/reviews';
    
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'review-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 3 * 1024 * 1024, // 3MB limit per image
    files: 3 // Max 3 images
  },
  fileFilter: function (req, file, cb) {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

// Get all reviews for a product - Product ke sab reviews get karna
router.get('/product/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const { 
      sort = '-createdAt', 
      limit = 20, 
      offset = 0,
      rating // Filter by rating
    } = req.query;
    
    let query = { 
      product: productId,
      isApproved: true 
    };
    
    // Filter by rating if provided
    if (rating) {
      query.rating = parseInt(rating);
    }
    
    const reviews = await Review.find(query)
      .populate('user', 'name avatar')
      .sort(sort)
      .limit(parseInt(limit))
      .skip(parseInt(offset))
      .lean();
    
    const total = await Review.countDocuments(query);
    
    // Get average rating
    const stats = await Review.calculateAverageRating(productId);
    
    res.json({
      success: true,
      data: reviews,
      total,
      stats: {
        averageRating: stats.averageRating,
        totalReviews: stats.totalReviews
      }
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch reviews',
      message: error.message
    });
  }
});

// Add review for a product - Product ke liye review add karna (Auth required)
router.post('/product/:productId', authenticateToken, upload.array('images', 3), [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').trim().isLength({ min: 10, max: 1000 }).withMessage('Comment must be 10-1000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Delete uploaded files if validation fails
      if (req.files) {
        req.files.forEach(file => fs.unlinkSync(file.path));
      }
      
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }
    
    const { productId } = req.params;
    const { rating, comment, orderId } = req.body;
    const userId = req.user.userId;
    
    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      if (req.files) {
        req.files.forEach(file => fs.unlinkSync(file.path));
      }
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    
    // Check if user already reviewed this product - Pehle se review diya hai?
    const existingReview = await Review.findOne({ 
      product: productId, 
      user: userId 
    });
    
    if (existingReview) {
      if (req.files) {
        req.files.forEach(file => fs.unlinkSync(file.path));
      }
      return res.status(409).json({
        success: false,
        error: 'You have already reviewed this product'
      });
    }
    
    // Check if user purchased this product (optional check)
    let isVerifiedPurchase = false;
    if (orderId) {
      const order = await Order.findOne({
        _id: orderId,
        user: userId,
        'items.product': productId,
        status: 'delivered'
      });
      isVerifiedPurchase = !!order;
    }
    
    // Get uploaded image URLs
    const images = req.files ? req.files.map(file => `/uploads/reviews/${file.filename}`) : [];
    
    // Create review
    const review = new Review({
      product: productId,
      user: userId,
      order: orderId || null,
      rating: parseInt(rating),
      comment,
      images,
      isVerifiedPurchase
    });
    
    await review.save();
    
    // Populate user data
    await review.populate('user', 'name avatar');
    
    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      data: review
    });
  } catch (error) {
    console.error('Add review error:', error);
    
    // Delete uploaded files if error occurs
    if (req.files) {
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to add review',
      message: error.message
    });
  }
});

// Update review - Review update karna (only own review)
router.put('/:reviewId', authenticateToken, [
  body('rating').optional().isInt({ min: 1, max: 5 }),
  body('comment').optional().trim().isLength({ min: 10, max: 1000 })
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
    
    const { reviewId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.userId;
    
    const review = await Review.findOne({ _id: reviewId, user: userId });
    
    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found or you do not have permission'
      });
    }
    
    if (rating) review.rating = rating;
    if (comment) review.comment = comment;
    
    await review.save();
    await review.populate('user', 'name avatar');
    
    res.json({
      success: true,
      message: 'Review updated successfully',
      data: review
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update review',
      message: error.message
    });
  }
});

// Delete review - Review delete karna (only own review)
router.delete('/:reviewId', authenticateToken, async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.userId;
    
    const review = await Review.findOne({ _id: reviewId, user: userId });
    
    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found or you do not have permission'
      });
    }
    
    // Delete review images
    if (review.images && review.images.length > 0) {
      review.images.forEach(imageUrl => {
        const imagePath = path.join(__dirname, '..', imageUrl);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      });
    }
    
    await review.remove();
    
    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete review',
      message: error.message
    });
  }
});

// Mark review as helpful - Review ko helpful mark karna
router.post('/:reviewId/helpful', authenticateToken, async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.userId;
    
    const review = await Review.findById(reviewId);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }
    
    await review.markHelpful(userId);
    
    res.json({
      success: true,
      message: 'Marked as helpful',
      data: {
        helpfulCount: review.helpfulCount
      }
    });
  } catch (error) {
    console.error('Mark helpful error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to mark as helpful',
      message: error.message
    });
  }
});

// Admin: Get all reviews (with unapproved) - Admin ke liye sab reviews
router.get('/admin/all', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { 
      status = 'all', // all, approved, pending
      limit = 50, 
      offset = 0 
    } = req.query;
    
    let query = {};
    
    if (status === 'approved') {
      query.isApproved = true;
    } else if (status === 'pending') {
      query.isApproved = false;
    }
    
    const reviews = await Review.find(query)
      .populate('user', 'name email avatar')
      .populate('product', 'name image')
      .sort('-createdAt')
      .limit(parseInt(limit))
      .skip(parseInt(offset));
    
    const total = await Review.countDocuments(query);
    
    res.json({
      success: true,
      data: reviews,
      total
    });
  } catch (error) {
    console.error('Get all reviews error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch reviews',
      message: error.message
    });
  }
});

// Admin: Approve/reject review - Review approve/reject karna
router.put('/admin/:reviewId/approve', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { isApproved } = req.body;
    
    const review = await Review.findByIdAndUpdate(
      reviewId,
      { isApproved },
      { new: true }
    ).populate('user', 'name avatar');
    
    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }
    
    res.json({
      success: true,
      message: isApproved ? 'Review approved' : 'Review rejected',
      data: review
    });
  } catch (error) {
    console.error('Approve review error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update review',
      message: error.message
    });
  }
});

module.exports = router;
