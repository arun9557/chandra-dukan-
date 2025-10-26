// Returns/Refunds Routes - Returns aur refunds ka API
// Return request, status tracking, admin approval

const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Return = require('../models/Return');
const Order = require('../models/Order');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const emailService = require('../services/emailService');
const smsService = require('../services/smsService');

// Configure multer for memory storage (for serverless compatibility)
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 5 }, // 5MB, max 5 images
  fileFilter: function (req, file, cb) {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files allowed!'), false);
    }
    cb(null, true);
  }
});

// Configure Cloudinary
const cloudinary = require('cloudinary').v2;
if (process.env.CLOUDINARY_CLOUD_NAME && 
    process.env.CLOUDINARY_API_KEY && 
    process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

// Helper function to upload files to Cloudinary
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { 
        folder: 'returns',
        resource_type: 'auto',
        transformation: [
          { width: 1200, crop: 'limit', quality: 'auto' },
          { fetch_format: 'auto' }
        ]
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
};

// Create return request - Return request create karna (Auth required)
router.post('/orders/:orderId/returns', authenticateToken, upload.array('images', 5), [
  body('reason').notEmpty().withMessage('Reason is required'),
  body('items').isArray({ min: 1 }).withMessage('At least one item required'),
  body('refundAmount').isNumeric().withMessage('Refund amount must be a number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // No need to delete files as they're in memory and not saved yet
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { orderId } = req.params;
    const { reason, items, refundAmount, comment, refundMethod } = req.body;
    const userId = req.user.userId;

    // Check if order exists and belongs to user - Order check karna
    const order = await Order.findById(orderId).populate('user');
    
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    if (order.user._id.toString() !== userId) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    // Check if order is eligible for return - Delivered orders only
    if (order.status !== 'delivered') {
      return res.status(400).json({
        success: false,
        error: 'Only delivered orders can be returned'
      });
    }

    // Check if already returned - Pehle se return request hai?
    const existingReturn = await Return.findOne({ order: orderId, user: userId });

    if (existingReturn) {
      return res.status(409).json({
        success: false,
        error: 'Return request already exists for this order'
      });
    }

    // Handle file uploads if any
    let proofImages = [];
    if (req.files && req.files.length > 0) {
      // Upload all files to Cloudinary in parallel
      const uploadPromises = req.files.map(file => 
        uploadToCloudinary(file.buffer)
          .then(result => ({
            url: result.secure_url,
            public_id: result.public_id
          }))
          .catch(err => {
            console.error('Error uploading file to Cloudinary:', err);
            return null;
          })
      );
      
      // Wait for all uploads to complete
      const results = await Promise.all(uploadPromises);
      proofImages = results.filter(img => img !== null);
    }

    // Create return request
    const returnRequest = new Return({
      order: orderId,
      user: userId,
      items: JSON.parse(items), // Parse items from JSON string
      reason,
      comment,
      images,
      refundAmount: parseFloat(refundAmount),
      refundMethod: refundMethod || 'original_payment',
      statusHistory: [{
        status: 'requested',
        comment: 'Return request created',
        updatedBy: userId,
        timestamp: new Date()
      }]
    });

    await returnRequest.save();

    // Populate data for response
    await returnRequest.populate('order user');

    // Send notification to user - User ko email/SMS bhejna
    if (order.user.notificationPreferences?.email) {
      await emailService.sendEmail(
        order.user.email,
        'Return Request Received',
        `<div style="padding: 20px;">
          <h2>Return Request Submitted</h2>
          <p>Your return request #${returnRequest.returnNumber} has been received.</p>
          <p>Order: ${order.orderNumber}</p>
          <p>We will review your request within 24 hours.</p>
        </div>`
      );
    }

    if (order.user.notificationPreferences?.sms) {
      await smsService.sendSMS(
        order.user.phone,
        `Return request #${returnRequest.returnNumber} received for order ${order.orderNumber}. We'll review within 24 hours.\n\nChandra Dukan`
      );
    }

    res.status(201).json({
      success: true,
      message: 'Return request created successfully',
      data: returnRequest
    });
  } catch (error) {
    console.error('Create return error:', error);
    
    // Note: No need to delete files as they were never saved to disk
    
    res.status(500).json({
      success: false,
      error: 'Failed to create return request',
      message: error.message
    });
  }
});

// Get user's returns - User ke sab returns get karna
router.get('/users/:userId/returns', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Check if requesting own returns or admin
    if (req.user.userId !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    const returns = await Return.getUserReturns(userId);

    res.json({
      success: true,
      count: returns.length,
      data: returns
    });
  } catch (error) {
    console.error('Get user returns error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch returns',
      message: error.message
    });
  }
});

// Get return by ID - Specific return details
router.get('/:returnId', authenticateToken, async (req, res) => {
  try {
    const returnRequest = await Return.findById(req.params.returnId)
      .populate('order user');

    if (!returnRequest) {
      return res.status(404).json({
        success: false,
        error: 'Return request not found'
      });
    }

    // Check access - Own return or admin
    if (returnRequest.user._id.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: returnRequest
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch return',
      message: error.message
    });
  }
});

// Admin: Get all returns - Sab returns (Admin only)
router.get('/admin/all', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;
    
    let query = {};
    if (status) {
      query.status = status;
    }

    const returns = await Return.find(query)
      .populate('order', 'orderNumber total items')
      .populate('user', 'name email phone')
      .sort('-createdAt')
      .limit(parseInt(limit))
      .skip(parseInt(offset));

    const total = await Return.countDocuments(query);

    res.json({
      success: true,
      data: returns,
      total
    });
  } catch (error) {
    console.error('Get all returns error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch returns',
      message: error.message
    });
  }
});

// Admin: Update return status - Status update karna (Admin only)
router.put('/:returnId/status', authenticateToken, requireAdmin, [
  body('status').isIn(['requested', 'approved', 'in_process', 'completed', 'rejected']).withMessage('Invalid status'),
  body('comment').optional().trim()
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

    const { returnId } = req.params;
    const { status, comment, adminNotes, rejectionReason, refundTransactionId } = req.body;

    const returnRequest = await Return.findById(returnId).populate('order user');

    if (!returnRequest) {
      return res.status(404).json({
        success: false,
        error: 'Return request not found'
      });
    }

    // Update status using method
    await returnRequest.updateStatus(status, comment, req.user.userId);

    // Update additional fields if provided
    if (adminNotes) returnRequest.adminNotes = adminNotes;
    if (rejectionReason && status === 'rejected') returnRequest.rejectionReason = rejectionReason;
    if (refundTransactionId && status === 'completed') returnRequest.refundTransactionId = refundTransactionId;

    await returnRequest.save();

    // Send notification to user - Status change par user ko notify karna
    const statusMessages = {
      'approved': 'Your return request has been approved! We will schedule pickup soon.',
      'in_process': 'Your return is being processed. Pickup scheduled.',
      'completed': `Your refund of ₹${returnRequest.refundAmount} has been processed.`,
      'rejected': `Your return request has been rejected. ${rejectionReason || ''}`
    };

    if (statusMessages[status]) {
      // Email notification
      if (returnRequest.user.notificationPreferences?.email) {
        await emailService.sendEmail(
          returnRequest.user.email,
          `Return ${status.toUpperCase()} - #${returnRequest.returnNumber}`,
          `<div style="padding: 20px;">
            <h2>Return Status Updated</h2>
            <p>${statusMessages[status]}</p>
            <p>Return #: ${returnRequest.returnNumber}</p>
            <p>Order #: ${returnRequest.order.orderNumber}</p>
          </div>`
        );
      }

      // SMS notification
      if (returnRequest.user.notificationPreferences?.sms) {
        await smsService.sendSMS(
          returnRequest.user.phone,
          `Return #${returnRequest.returnNumber}: ${statusMessages[status]}\n\nChandra Dukan`
        );
      }
    }

    res.json({
      success: true,
      message: 'Return status updated successfully',
      data: returnRequest
    });
  } catch (error) {
    console.error('Update return status error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update return status',
      message: error.message
    });
  }
});

module.exports = router;
