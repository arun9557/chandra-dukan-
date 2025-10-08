// Contact API Routes - Contact form messages handle karna
// User messages save karna aur admin ko send karna

const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Contact = require('../models/Contact');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Submit contact form - Contact form submit karna
router.post('/submit', [
  body('name').trim().notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('email').optional().isEmail().withMessage('Valid email is required'),
  body('phone').matches(/^[6-9]\d{9}$/).withMessage('Valid 10-digit phone number is required'),
  body('message').trim().notEmpty().withMessage('Message is required')
    .isLength({ min: 10, max: 1000 }).withMessage('Message must be between 10 and 1000 characters'),
  body('subject').optional().isIn(['general', 'order', 'complaint', 'feedback', 'other'])
], async (req, res) => {
  try {
    // Validate request - Request validate karo
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { name, email, phone, message, subject } = req.body;

    // At least email or phone must be provided
    if (!email && !phone) {
      return res.status(400).json({
        success: false,
        error: 'Either email or phone is required'
      });
    }

    // Get IP address and User Agent - Client info collect karo
    const ipAddress = req.ip || req.connection.remoteAddress || '';
    const userAgent = req.get('user-agent') || '';

    // Create contact message - Message save karo
    const contact = new Contact({
      name,
      email: email || '',
      phone,
      message,
      subject: subject || 'general',
      ipAddress,
      userAgent
    });

    await contact.save();

    // TODO: Send email notification to admin
    // TODO: Send WhatsApp notification to admin
    console.log('New contact message received:', {
      name,
      phone,
      subject: contact.subject
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for contacting us! We will get back to you soon.',
      message_hi: 'संपर्क करने के लिए धन्यवाद! हम जल्द ही आपसे संपर्क करेंगे।',
      data: {
        id: contact._id,
        name: contact.name,
        createdAt: contact.createdAt
      }
    });

  } catch (error) {
    console.error('Contact form submission error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit contact form',
      message: error.message
    });
  }
});

// Get all contact messages (Admin only) - Sab messages get karo
router.get('/messages', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query;

    let query = {};
    if (status) query.status = status;

    const messages = await Contact.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(offset));

    const total = await Contact.countDocuments(query);
    const unreadCount = await Contact.getUnreadCount();

    res.json({
      success: true,
      data: messages,
      total,
      unreadCount,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch messages',
      message: error.message
    });
  }
});

// Get single message (Admin only) - Ek message get karo
router.get('/messages/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const message = await Contact.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        error: 'Message not found'
      });
    }

    // Mark as read if it's new - Agar naya hai to read mark karo
    if (message.status === 'new') {
      await message.markAsRead();
    }

    res.json({
      success: true,
      data: message
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch message',
      message: error.message
    });
  }
});

// Update message status (Admin only) - Message status update karo
router.put('/messages/:id/status', authenticateToken, requireAdmin, [
  body('status').isIn(['new', 'read', 'replied', 'resolved', 'spam']).withMessage('Invalid status'),
  body('notes').optional().isString()
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

    const { status, notes } = req.body;
    const message = await Contact.findById(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        error: 'Message not found'
      });
    }

    message.status = status;
    if (notes) message.adminNotes = notes;
    if (status === 'replied') message.repliedAt = new Date();

    await message.save();

    res.json({
      success: true,
      message: 'Status updated successfully',
      data: message
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update status',
      message: error.message
    });
  }
});

// Delete message (Admin only) - Message delete karo
router.delete('/messages/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const message = await Contact.findByIdAndDelete(req.params.id);

    if (!message) {
      return res.status(404).json({
        success: false,
        error: 'Message not found'
      });
    }

    res.json({
      success: true,
      message: 'Message deleted successfully'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete message',
      message: error.message
    });
  }
});

// Get today's messages (Admin only) - Aaj ke messages
router.get('/messages/today/all', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const messages = await Contact.getTodayMessages();

    res.json({
      success: true,
      data: messages,
      count: messages.length
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch today\'s messages',
      message: error.message
    });
  }
});

module.exports = router;
