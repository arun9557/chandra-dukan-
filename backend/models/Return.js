// Return/Refund Model - Returns aur refunds ka MongoDB schema
// Order returns, refunds, aur status tracking ke liye

const mongoose = require('mongoose');

const returnSchema = new mongoose.Schema({
  // Order reference - Kis order ka return hai
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: [true, 'Order is required']
  },
  
  // User reference - Kon user ne return request kiya
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  
  // Return number - Unique return tracking number
  returnNumber: {
    type: String,
    unique: true,
    required: true
  },
  
  // Items being returned - Kon se items return ho rahe hain
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    name: String,
    price: Number,
    quantity: Number,
    subtotal: Number
  }],
  
  // Reason for return - Return ki reason
  reason: {
    type: String,
    required: [true, 'Reason is required'],
    enum: [
      'damaged',
      'wrong_item',
      'quality_issue',
      'not_as_described',
      'size_issue',
      'changed_mind',
      'expired',
      'other'
    ]
  },
  
  // Detailed comment - User ka detailed comment
  comment: {
    type: String,
    trim: true,
    maxlength: [1000, 'Comment cannot exceed 1000 characters']
  },
  
  // Proof images - Damage/proof ke images
  images: [{
    type: String
  }],
  
  // Refund amount - Kitna amount refund hoga
  refundAmount: {
    type: Number,
    required: true
  },
  
  // Refund method - Kaise refund hoga
  refundMethod: {
    type: String,
    enum: ['original_payment', 'bank_transfer', 'wallet', 'cash'],
    default: 'original_payment'
  },
  
  // Status - Current status of return
  status: {
    type: String,
    enum: ['requested', 'approved', 'in_process', 'completed', 'rejected'],
    default: 'requested'
  },
  
  // Status history - Status changes ka history
  statusHistory: [{
    status: String,
    comment: String,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Admin notes - Admin ka internal notes
  adminNotes: {
    type: String,
    trim: true
  },
  
  // Rejection reason - Agar reject hua to reason
  rejectionReason: {
    type: String,
    trim: true
  },
  
  // Pickup scheduled - Pickup ka date
  pickupScheduled: {
    type: Date
  },
  
  // Pickup completed - Pickup ho gaya
  pickupCompleted: {
    type: Date
  },
  
  // Refund processed date - Refund kab process hua
  refundProcessedDate: {
    type: Date
  },
  
  // Refund transaction ID - Bank/payment gateway transaction ID
  refundTransactionId: {
    type: String
  }
}, {
  timestamps: true
});

// Indexes for better performance
returnSchema.index({ order: 1 });
returnSchema.index({ user: 1 });
returnSchema.index({ returnNumber: 1 });
returnSchema.index({ status: 1 });
returnSchema.index({ createdAt: -1 });

// Generate return number - Unique return number generate karna
returnSchema.pre('save', async function(next) {
  if (!this.returnNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    
    this.returnNumber = `RET${year}${month}${day}${random}`;
  }
  next();
});

// Method to update status - Status update karne ka method
returnSchema.methods.updateStatus = function(newStatus, comment, updatedBy) {
  this.status = newStatus;
  
  this.statusHistory.push({
    status: newStatus,
    comment: comment || '',
    updatedBy: updatedBy,
    timestamp: new Date()
  });
  
  // Update specific dates based on status
  if (newStatus === 'completed') {
    this.refundProcessedDate = new Date();
  } else if (newStatus === 'in_process' && !this.pickupScheduled) {
    this.pickupScheduled = new Date();
  }
  
  return this.save();
};

// Static method to get user returns - User ke returns fetch karna
returnSchema.statics.getUserReturns = function(userId) {
  return this.find({ user: userId })
    .populate('order', 'orderNumber total items')
    .populate('user', 'name email phone')
    .sort('-createdAt');
};

// Static method to get order returns - Order ke returns fetch karna
returnSchema.statics.getOrderReturns = function(orderId) {
  return this.find({ order: orderId })
    .populate('user', 'name email phone')
    .sort('-createdAt');
};

const Return = mongoose.model('Return', returnSchema);

module.exports = Return;
