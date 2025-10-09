// Orders API Routes with MongoDB - Orders के लिए MongoDB API routes
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Place new order - नया order place करना
router.post('/', authenticateToken, [
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('customerDetails.name').notEmpty().withMessage('Customer name is required'),
  body('customerDetails.phone').matches(/^[6-9]\d{9}$/).withMessage('Valid phone number required'),
  body('customerDetails.address.street').notEmpty().withMessage('Street address is required'),
  body('customerDetails.address.city').notEmpty().withMessage('City is required'),
  body('customerDetails.address.pincode').notEmpty().withMessage('Pincode is required'),
  body('paymentMethod').isIn(['cod', 'upi', 'phonepe', 'razorpay', 'card']).withMessage('Invalid payment method')
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

    const { items, customerDetails, paymentMethod, notes } = req.body;

    // Validate and prepare order items
    const orderItems = [];
    let subtotal = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId || item.product);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          error: `Product not found: ${item.productId || item.product}`
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          error: `Insufficient stock for ${product.name}. Available: ${product.stock}`
        });
      }

      const itemSubtotal = product.price * item.quantity;
      subtotal += itemSubtotal;

      orderItems.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.image,
        subtotal: itemSubtotal
      });

      // Reduce stock
      await product.updateStock(item.quantity, 'subtract');
    }

    // Calculate pricing
    const deliveryCharge = subtotal >= 500 ? 0 : 40; // Free delivery above ₹500
    const total = subtotal + deliveryCharge;

    // Create order
    const order = new Order({
      user: req.user._id,
      items: orderItems,
      customerDetails,
      pricing: {
        subtotal,
        deliveryCharge,
        discount: 0,
        tax: 0,
        total
      },
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
      notes: notes || ''
    });

    await order.save();

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      message_hi: 'ऑर्डर सफलतापूर्वक प्लेस हो गया',
      data: order
    });

  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to place order',
      message: error.message
    });
  }
});

// Get user's orders - User के orders get करना
router.get('/user/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const { status, limit = 20, offset = 0 } = req.query;

    // Check if user is accessing their own orders or is admin
    if (req.user._id.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    let query = { user: userId };
    if (status) query.status = status;

    const orders = await Order.find(query)
      .populate('items.product', 'name image')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(offset));

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      data: orders,
      total,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch orders',
      message: error.message
    });
  }
});

// Get order by ID - Order को ID से get करना
router.get('/:orderId', authenticateToken, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate('user', 'name email phone')
      .populate('items.product', 'name image category');

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    // Check if user owns this order or is admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: order
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch order',
      message: error.message
    });
  }
});

// Get order by order number - Order number से order get करना
router.get('/track/:orderNumber', async (req, res) => {
  try {
    const order = await Order.findByOrderNumber(req.params.orderNumber);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found',
        message_hi: 'ऑर्डर नहीं मिला'
      });
    }

    res.json({
      success: true,
      data: {
        orderNumber: order.orderNumber,
        status: order.status,
        statusHistory: order.statusHistory,
        items: order.items,
        total: order.pricing.total,
        deliveryDate: order.deliveryDate,
        createdAt: order.createdAt
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to track order',
      message: error.message
    });
  }
});

// Update order status - Order status update करना (Admin only)
router.put('/:orderId/status', authenticateToken, requireAdmin, [
  body('status').isIn(['pending', 'confirmed', 'processing', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled']).withMessage('Invalid status'),
  body('note').optional().isString()
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

    const { status, note } = req.body;
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    await order.updateStatus(status, note || '');

    res.json({
      success: true,
      message: 'Order status updated successfully',
      message_hi: 'ऑर्डर स्टेटस अपडेट हो गया',
      data: order
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update order status',
      message: error.message
    });
  }
});

// Cancel order - Order cancel करना
router.put('/:orderId/cancel', authenticateToken, [
  body('reason').notEmpty().withMessage('Cancellation reason is required')
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

    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    // Check if user owns this order
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    // Check if order can be cancelled
    if (['delivered', 'cancelled'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        error: 'Order cannot be cancelled',
        message_hi: 'ऑर्डर कैंसल नहीं किया जा सकता'
      });
    }

    await order.cancelOrder(req.body.reason);

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      message_hi: 'ऑर्डर कैंसल हो गया',
      data: order
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to cancel order',
      message: error.message
    });
  }
});

// Get all orders (Admin only) - सभी orders get करना
router.get('/admin/all', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status, date, customer, limit = 50, offset = 0 } = req.query;

    let query = {};
    
    if (status) query.status = status;
    
    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      query.createdAt = { $gte: startDate, $lte: endDate };
    }

    if (customer) {
      query['customerDetails.phone'] = { $regex: customer, $options: 'i' };
    }

    const orders = await Order.find(query)
      .populate('user', 'name email phone')
      .populate('items.product', 'name')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(offset));

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      data: orders,
      total,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch orders',
      message: error.message
    });
  }
});

// Get today's orders (Admin) - आज के orders get करना
router.get('/admin/today', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const orders = await Order.getTodayOrders();

    res.json({
      success: true,
      data: orders,
      count: orders.length
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch today\'s orders',
      message: error.message
    });
  }
});

// Get order analytics (Admin) - Order analytics get करना
router.get('/admin/analytics', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    const stats = await Order.getRevenueStats(start, end);

    // Get status breakdown
    const statusBreakdown = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        ...stats,
        statusBreakdown,
        period: {
          start,
          end
        }
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch analytics',
      message: error.message
    });
  }
});

module.exports = router;
