// Order Model - ऑर्डर मॉडल
// MongoDB schema for orders

const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  image: {
    type: String,
    default: ''
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0
  }
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema],
  customerDetails: {
    name: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      match: [/^[6-9]\d{9}$/, 'Please provide a valid phone number']
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, default: '' },
      pincode: { type: String, required: true },
      landmark: { type: String, default: '' }
    }
  },
  pricing: {
    subtotal: {
      type: Number,
      required: true,
      min: 0
    },
    deliveryCharge: {
      type: Number,
      default: 0,
      min: 0
    },
    discount: {
      type: Number,
      default: 0,
      min: 0
    },
    tax: {
      type: Number,
      default: 0,
      min: 0
    },
    total: {
      type: Number,
      required: true,
      min: 0
    }
  },
  paymentMethod: {
    type: String,
    enum: ['cod', 'upi', 'phonepe', 'razorpay', 'card', 'wallet'],
    default: 'cod'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentDetails: {
    transactionId: { type: String, default: '' },
    paidAt: { type: Date, default: null }
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned'],
    default: 'pending'
  },
  statusHistory: [{
    status: String,
    timestamp: { type: Date, default: Date.now },
    note: String
  }],
  deliveryDate: {
    type: Date,
    default: null
  },
  deliverySlot: {
    type: String,
    default: ''
  },
  notes: {
    type: String,
    maxlength: 500,
    default: ''
  },
  cancelReason: {
    type: String,
    default: ''
  },
  rating: {
    value: { type: Number, min: 1, max: 5 },
    comment: { type: String, maxlength: 500 },
    ratedAt: { type: Date }
  }
}, {
  timestamps: true
});

// Indexes
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ user: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ paymentStatus: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ 'customerDetails.phone': 1 });

// Generate order number before saving
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    // Find the last order of the day
    const lastOrder = await this.constructor.findOne({
      orderNumber: new RegExp(`^ORD${year}${month}${day}`)
    }).sort({ orderNumber: -1 });
    
    let sequence = 1;
    if (lastOrder) {
      const lastSequence = parseInt(lastOrder.orderNumber.slice(-4));
      sequence = lastSequence + 1;
    }
    
    this.orderNumber = `ORD${year}${month}${day}${sequence.toString().padStart(4, '0')}`;
  }
  next();
});

// Add status to history before saving
orderSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date(),
      note: ''
    });
  }
  next();
});

// Method to update order status
orderSchema.methods.updateStatus = async function(newStatus, note = '') {
  this.status = newStatus;
  this.statusHistory.push({
    status: newStatus,
    timestamp: new Date(),
    note
  });
  
  if (newStatus === 'delivered') {
    this.deliveryDate = new Date();
    this.paymentStatus = 'paid';
  }
  
  return await this.save();
};

// Method to cancel order
orderSchema.methods.cancelOrder = async function(reason) {
  this.status = 'cancelled';
  this.cancelReason = reason;
  this.statusHistory.push({
    status: 'cancelled',
    timestamp: new Date(),
    note: reason
  });
  
  // Restore product stock
  const Product = mongoose.model('Product');
  for (const item of this.items) {
    await Product.findByIdAndUpdate(item.product, {
      $inc: { stock: item.quantity, sold: -item.quantity }
    });
  }
  
  return await this.save();
};

// Method to calculate total
orderSchema.methods.calculateTotal = function() {
  const subtotal = this.items.reduce((sum, item) => sum + item.subtotal, 0);
  this.pricing.subtotal = subtotal;
  this.pricing.total = subtotal + this.pricing.deliveryCharge - this.pricing.discount + this.pricing.tax;
  return this.pricing.total;
};

// Static method to find by order number
orderSchema.statics.findByOrderNumber = function(orderNumber) {
  return this.findOne({ orderNumber }).populate('user items.product');
};

// Static method to find user orders
orderSchema.statics.findUserOrders = function(userId, limit = 10) {
  return this.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('items.product');
};

// Static method to get today's orders
orderSchema.statics.getTodayOrders = function() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return this.find({
    createdAt: { $gte: today }
  }).sort({ createdAt: -1 });
};

// Static method to get revenue stats
orderSchema.statics.getRevenueStats = async function(startDate, endDate) {
  const stats = await this.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate },
        status: { $nin: ['cancelled', 'returned'] }
      }
    },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: '$pricing.total' },
        avgOrderValue: { $avg: '$pricing.total' }
      }
    }
  ]);
  
  return stats[0] || { totalOrders: 0, totalRevenue: 0, avgOrderValue: 0 };
};

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
