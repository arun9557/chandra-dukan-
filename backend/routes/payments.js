// Payment Routes - Payment processing routes
// Payment gateway integration के लिए API routes

const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');
const paymentService = require('../services/paymentService');
const Order = require('../models/Order');

// Create Razorpay order - Razorpay order create करना
router.post('/create-order', authenticateToken, [
  body('amount').isNumeric().withMessage('Amount is required'),
  body('orderId').notEmpty().withMessage('Order ID is required')
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

    const { amount, orderId } = req.body;

    // Verify order exists and belongs to user
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    // Create Razorpay order
    const razorpayOrder = await paymentService.createRazorpayOrder(
      amount,
      'INR',
      order.orderNumber
    );

    res.json({
      success: true,
      data: {
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        keyId: paymentService.razorpayKeyId
      }
    });

  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create payment order',
      message: error.message
    });
  }
});

// Verify Razorpay payment - Razorpay payment verify करना
router.post('/verify', authenticateToken, [
  body('razorpay_order_id').notEmpty(),
  body('razorpay_payment_id').notEmpty(),
  body('razorpay_signature').notEmpty(),
  body('orderId').notEmpty()
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

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId
    } = req.body;

    // Verify signature
    const isValid = paymentService.verifyRazorpayPayment(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValid) {
      return res.status(400).json({
        success: false,
        error: 'Invalid payment signature',
        message_hi: 'अमान्य भुगतान हस्ताक्षर'
      });
    }

    // Update order payment status
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    order.paymentStatus = 'paid';
    order.paymentDetails = {
      transactionId: razorpay_payment_id,
      paidAt: new Date()
    };
    await order.save();

    res.json({
      success: true,
      message: 'Payment verified successfully',
      message_hi: 'भुगतान सफलतापूर्वक सत्यापित हो गया',
      data: {
        orderId: order._id,
        orderNumber: order.orderNumber,
        paymentId: razorpay_payment_id
      }
    });

  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      error: 'Payment verification failed',
      message: error.message
    });
  }
});

// Create PhonePe payment - PhonePe payment create करना
router.post('/phonepe/create', authenticateToken, [
  body('amount').isNumeric().withMessage('Amount is required'),
  body('orderId').notEmpty().withMessage('Order ID is required')
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

    const { amount, orderId } = req.body;

    // Verify order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    // Create PhonePe payment
    const phonePePayment = await paymentService.createPhonePePayment(
      amount,
      order.orderNumber,
      req.user.phone
    );

    res.json({
      success: true,
      data: phonePePayment
    });

  } catch (error) {
    console.error('PhonePe payment error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create PhonePe payment',
      message: error.message
    });
  }
});

// PhonePe callback - PhonePe callback handle करना
router.post('/phonepe-callback', async (req, res) => {
  try {
    const { response, checksum } = req.body;

    // Verify checksum
    const isValid = paymentService.verifyPhonePePayment(response, checksum);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        error: 'Invalid checksum'
      });
    }

    // Decode response
    const decodedResponse = JSON.parse(Buffer.from(response, 'base64').toString());

    // Update order based on payment status
    if (decodedResponse.code === 'PAYMENT_SUCCESS') {
      // Update order payment status
      console.log('PhonePe payment successful:', decodedResponse);
    }

    res.json({
      success: true,
      message: 'Callback processed'
    });

  } catch (error) {
    console.error('PhonePe callback error:', error);
    res.status(500).json({
      success: false,
      error: 'Callback processing failed'
    });
  }
});

// Process refund - Refund process करना
router.post('/refund', authenticateToken, [
  body('orderId').notEmpty().withMessage('Order ID is required'),
  body('amount').isNumeric().withMessage('Amount is required'),
  body('reason').optional().isString()
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

    const { orderId, amount, reason } = req.body;

    // Verify order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    // Check if refund is allowed
    if (order.paymentStatus !== 'paid') {
      return res.status(400).json({
        success: false,
        error: 'Order not paid yet',
        message_hi: 'ऑर्डर का भुगतान नहीं हुआ है'
      });
    }

    // Process refund
    const refund = await paymentService.processRefund(
      order.paymentDetails.transactionId,
      amount,
      reason
    );

    // Update order
    order.paymentStatus = 'refunded';
    await order.save();

    res.json({
      success: true,
      message: 'Refund processed successfully',
      message_hi: 'रिफंड सफलतापूर्वक प्रोसेस हो गया',
      data: refund
    });

  } catch (error) {
    console.error('Refund error:', error);
    res.status(500).json({
      success: false,
      error: 'Refund processing failed',
      message: error.message
    });
  }
});

// Get payment status - Payment status get करना
router.get('/status/:paymentId', authenticateToken, async (req, res) => {
  try {
    const { paymentId } = req.params;

    const status = await paymentService.getPaymentStatus(paymentId);

    res.json({
      success: true,
      data: status
    });

  } catch (error) {
    console.error('Get payment status error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get payment status',
      message: error.message
    });
  }
});

// COD order confirmation - COD order confirm करना
router.post('/cod-confirm', authenticateToken, [
  body('orderId').notEmpty().withMessage('Order ID is required')
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

    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    // Confirm COD order
    order.paymentStatus = 'pending';
    order.status = 'confirmed';
    await order.save();

    res.json({
      success: true,
      message: 'COD order confirmed',
      message_hi: 'COD ऑर्डर कन्फर्म हो गया',
      data: order
    });

  } catch (error) {
    console.error('COD confirmation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to confirm COD order',
      message: error.message
    });
  }
});

module.exports = router;
