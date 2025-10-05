// Orders API Routes - Orders के लिए API routes
// Order management endpoints

const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

const store = require('../utils/jsonStore');
let orders = store.read('orders', []);
let orderIdCounter = orders.length + 1;

// Get all orders - सभी orders get करना
router.get('/', (req, res) => {
  try {
    const { status, customer_id, limit = 50, offset = 0 } = req.query;
    
    let filteredOrders = [...orders];
    
    if (status) {
      filteredOrders = filteredOrders.filter(order => order.status === status);
    }
    
    if (customer_id) {
      filteredOrders = filteredOrders.filter(order => order.customer_id === customer_id);
    }
    
    // Pagination
    const paginatedOrders = filteredOrders.slice(offset, offset + parseInt(limit));
    
    res.json({
      success: true,
      data: paginatedOrders,
      total: filteredOrders.length,
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
router.get('/:id', (req, res) => {
  try {
    const order = orders.find(o => o.id === req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
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

// Create new order - नया order create करना
router.post('/', [
  body('customer_name').notEmpty().withMessage('Customer name is required'),
  body('customer_phone').isMobilePhone('en-IN').withMessage('Valid Indian phone number required'),
  body('customer_address').notEmpty().withMessage('Customer address is required'),
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('payment_method').isIn(['cod', 'upi', 'phonepe', 'gpay']).withMessage('Invalid payment method')
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
      customer_name,
      customer_phone,
      customer_address,
      customer_area,
      items,
      payment_method,
      total_amount,
      delivery_instructions
    } = req.body;
    
    // Calculate total if not provided
    const calculatedTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const finalTotal = total_amount || calculatedTotal;
    
    const newOrder = {
      id: `CD${Date.now().toString().slice(-6)}`,
      customer: {
        name: customer_name,
        phone: customer_phone,
        address: customer_address,
        area: customer_area || 'Main Market Area'
      },
      items: items,
      payment_method: payment_method,
      total_amount: finalTotal,
      delivery_charges: finalTotal >= 200 ? 0 : 30,
      final_amount: finalTotal + (finalTotal >= 200 ? 0 : 30),
      status: 'placed',
      delivery_instructions: delivery_instructions || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      estimated_delivery: new Date(Date.now() + 60 * 60 * 1000).toISOString() // 1 hour from now
    };
    
    orders.push(newOrder);
    store.write('orders', orders);
    
    // Send notification (mock)
    console.log(`📱 Order notification sent for order ${newOrder.id}`);
    
    res.status(201).json({
      success: true,
      data: newOrder,
      message: 'Order placed successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create order',
      message: error.message
    });
  }
});

// Update order status - Order status update करना
router.patch('/:id/status', [
  body('status').isIn(['placed', 'confirmed', 'processing', 'packed', 'out_for_delivery', 'delivered', 'cancelled']).withMessage('Invalid status')
], (req, res) => {
  try {
    const { status } = req.body;
    const orderIndex = orders.findIndex(o => o.id === req.params.id);
    
    if (orderIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }
    
    orders[orderIndex].status = status;
    orders[orderIndex].updated_at = new Date().toISOString();
    
    // Update delivery time for certain statuses
    if (status === 'out_for_delivery') {
      orders[orderIndex].out_for_delivery_at = new Date().toISOString();
    } else if (status === 'delivered') {
      orders[orderIndex].delivered_at = new Date().toISOString();
    }
    
    res.json({
      success: true,
      data: orders[orderIndex],
      message: 'Order status updated successfully'
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
router.patch('/:id/cancel', (req, res) => {
  try {
    const orderIndex = orders.findIndex(o => o.id === req.params.id);
    
    if (orderIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }
    
    if (orders[orderIndex].status === 'delivered') {
      return res.status(400).json({
        success: false,
        error: 'Cannot cancel delivered order'
      });
    }
    
    orders[orderIndex].status = 'cancelled';
    orders[orderIndex].cancelled_at = new Date().toISOString();
    orders[orderIndex].updated_at = new Date().toISOString();
    
    res.json({
      success: true,
      data: orders[orderIndex],
      message: 'Order cancelled successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to cancel order',
      message: error.message
    });
  }
});

// Get order analytics - Order analytics get करना
router.get('/analytics/summary', (req, res) => {
  try {
    const { start_date, end_date } = req.query;
    
    let filteredOrders = orders;
    
    if (start_date && end_date) {
      filteredOrders = orders.filter(order => {
        const orderDate = new Date(order.created_at);
        return orderDate >= new Date(start_date) && orderDate <= new Date(end_date);
      });
    }
    
    const analytics = {
      total_orders: filteredOrders.length,
      total_revenue: filteredOrders.reduce((sum, order) => sum + order.final_amount, 0),
      orders_by_status: {
        placed: filteredOrders.filter(o => o.status === 'placed').length,
        confirmed: filteredOrders.filter(o => o.status === 'confirmed').length,
        processing: filteredOrders.filter(o => o.status === 'processing').length,
        packed: filteredOrders.filter(o => o.status === 'packed').length,
        out_for_delivery: filteredOrders.filter(o => o.status === 'out_for_delivery').length,
        delivered: filteredOrders.filter(o => o.status === 'delivered').length,
        cancelled: filteredOrders.filter(o => o.status === 'cancelled').length
      },
      average_order_value: filteredOrders.length > 0 ? 
        filteredOrders.reduce((sum, order) => sum + order.final_amount, 0) / filteredOrders.length : 0,
      top_products: getTopProducts(filteredOrders)
    };
    
    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch analytics',
      message: error.message
    });
  }
});

// Helper function to get top products - Top products get करने का helper function
function getTopProducts(orders) {
  const productCounts = {};
  
  orders.forEach(order => {
    order.items.forEach(item => {
      if (productCounts[item.name]) {
        productCounts[item.name] += item.quantity;
      } else {
        productCounts[item.name] = item.quantity;
      }
    });
  });
  
  return Object.entries(productCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([name, count]) => ({ name, count }));
}

module.exports = router;
