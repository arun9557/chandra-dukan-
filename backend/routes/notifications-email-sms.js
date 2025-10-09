// Notification Routes - Email aur SMS bhejne ke API routes
// Manual email/SMS trigger, test notifications, preferences

const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const emailService = require('../services/emailService');
const smsService = require('../services/smsService');
const User = require('../models/User');

// Send custom email (Admin only) - Custom email bhejne ka endpoint
router.post('/email', authenticateToken, requireAdmin, [
  body('to').isEmail().withMessage('Valid email is required'),
  body('subject').notEmpty().withMessage('Subject is required'),
  body('message').notEmpty().withMessage('Message is required')
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

    const { to, subject, message, html } = req.body;

    const result = await emailService.sendEmail(
      to,
      subject,
      html || `<div style="padding: 20px;"><p>${message}</p></div>`,
      message
    );

    if (result.success) {
      res.json({
        success: true,
        message: 'Email sent successfully',
        messageId: result.messageId
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to send email',
        details: result.error
      });
    }
  } catch (error) {
    console.error('Send email error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send email',
      message: error.message
    });
  }
});

// Send custom SMS (Admin only) - Custom SMS bhejne ka endpoint
router.post('/sms', authenticateToken, requireAdmin, [
  body('to').matches(/^[6-9]\d{9}$/).withMessage('Valid 10-digit phone number is required'),
  body('message').notEmpty().isLength({ max: 160 }).withMessage('Message is required (max 160 chars)')
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

    const { to, message } = req.body;

    const result = await smsService.sendSMS(to, message);

    if (result.success) {
      res.json({
        success: true,
        message: 'SMS sent successfully',
        sid: result.sid
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Failed to send SMS',
        details: result.error
      });
    }
  } catch (error) {
    console.error('Send SMS error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send SMS',
      message: error.message
    });
  }
});

// Test email service - Email service test karna
router.get('/test/email', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const testEmail = req.query.email || req.user.email;
    
    const result = await emailService.sendEmail(
      testEmail,
      'Test Email - Chandra Dukan',
      `<div style="padding: 20px;">
        <h2>Test Email</h2>
        <p>This is a test email from Chandra Dukan notification system.</p>
        <p>If you received this, your email configuration is working correctly! ✅</p>
      </div>`
    );

    res.json({
      success: result.success,
      message: result.success ? 'Test email sent successfully' : 'Failed to send test email',
      details: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Test email failed',
      message: error.message
    });
  }
});

// Test SMS service - SMS service test karna
router.get('/test/sms', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const testPhone = req.query.phone || req.user.phone;
    
    const result = await smsService.sendSMS(
      testPhone,
      'Test SMS from Chandra Dukan. Your SMS service is working! ✅'
    );

    res.json({
      success: result.success,
      message: result.success ? 'Test SMS sent successfully' : 'Failed to send test SMS',
      details: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Test SMS failed',
      message: error.message
    });
  }
});

// Get notification preferences - User ke notification preferences
router.get('/preferences', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('notificationPreferences');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user.notificationPreferences || {
        email: true,
        sms: true,
        orderUpdates: true,
        promotions: false,
        newsletter: false
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch preferences',
      message: error.message
    });
  }
});

// Update notification preferences - Preferences update karna
router.put('/preferences', authenticateToken, async (req, res) => {
  try {
    const { email, sms, orderUpdates, promotions, newsletter } = req.body;

    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    user.notificationPreferences = {
      email: email !== undefined ? email : true,
      sms: sms !== undefined ? sms : true,
      orderUpdates: orderUpdates !== undefined ? orderUpdates : true,
      promotions: promotions !== undefined ? promotions : false,
      newsletter: newsletter !== undefined ? newsletter : false
    };

    await user.save();

    res.json({
      success: true,
      message: 'Notification preferences updated',
      data: user.notificationPreferences
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update preferences',
      message: error.message
    });
  }
});

// Check notification service status - Service status check karna
router.get('/status', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const emailStatus = await emailService.verifyConnection();
    const smsStatus = await smsService.verifyConnection();

    res.json({
      success: true,
      services: {
        email: {
          configured: !!process.env.SMTP_USER,
          working: emailStatus,
          provider: process.env.SMTP_HOST || 'Not configured'
        },
        sms: {
          configured: !!process.env.TWILIO_ACCOUNT_SID,
          working: smsStatus,
          provider: 'Twilio'
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to check status',
      message: error.message
    });
  }
});

module.exports = router;
