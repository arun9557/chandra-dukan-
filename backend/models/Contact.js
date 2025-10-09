// Contact Model - Contact form messages store karna
// User inquiries aur messages ka database schema

const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^[6-9]\d{9}$/, 'Please provide a valid 10-digit Indian phone number']
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    minlength: [10, 'Message must be at least 10 characters'],
    maxlength: [1000, 'Message cannot exceed 1000 characters']
  },
  subject: {
    type: String,
    enum: ['general', 'order', 'complaint', 'feedback', 'other'],
    default: 'general'
  },
  status: {
    type: String,
    enum: ['new', 'read', 'replied', 'resolved', 'spam'],
    default: 'new'
  },
  ipAddress: {
    type: String,
    default: ''
  },
  userAgent: {
    type: String,
    default: ''
  },
  adminNotes: {
    type: String,
    default: ''
  },
  repliedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true // Automatically adds createdAt and updatedAt
});

// Indexes for faster queries
contactSchema.index({ status: 1 });
contactSchema.index({ createdAt: -1 });
contactSchema.index({ email: 1 });
contactSchema.index({ phone: 1 });

// Method to mark as read - Message ko read mark karna
contactSchema.methods.markAsRead = async function() {
  this.status = 'read';
  return await this.save();
};

// Method to mark as replied - Reply mark karna
contactSchema.methods.markAsReplied = async function(notes = '') {
  this.status = 'replied';
  this.repliedAt = new Date();
  if (notes) this.adminNotes = notes;
  return await this.save();
};

// Static method to get unread messages count
contactSchema.statics.getUnreadCount = function() {
  return this.countDocuments({ status: 'new' });
};

// Static method to get today's messages
contactSchema.statics.getTodayMessages = function() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return this.find({
    createdAt: { $gte: today }
  }).sort({ createdAt: -1 });
};

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
