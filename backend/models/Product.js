// Product Model - उत्पाद मॉडल
// MongoDB schema for products

const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    minlength: [2, 'Product name must be at least 2 characters'],
    maxlength: [200, 'Product name cannot exceed 200 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters'],
    default: ''
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
    validate: {
      validator: function(value) {
        return value >= 0;
      },
      message: 'Price must be a positive number'
    }
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative'],
    default: 0
  },
  discount: {
    type: Number,
    min: [0, 'Discount cannot be negative'],
    max: [100, 'Discount cannot exceed 100%'],
    default: 0
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required']
  },
  stock: {
    type: Number,
    required: [true, 'Stock is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  unit: {
    type: String,
    enum: ['piece', 'kg', 'gram', 'liter', 'ml', 'packet', 'bottle', 'box', 'dozen', 'pack', 'bag', 'tray', 'cup', 'cylinder'],
    default: 'piece'
  },
  image: {
    type: String,
    default: 'https://via.placeholder.com/200x200?text=Product'
  },
  images: [{
    type: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true
  }],
  ratings: {
    average: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    },
    count: {
      type: Number,
      min: 0,
      default: 0
    }
  },
  sold: {
    type: Number,
    min: 0,
    default: 0
  },
  views: {
    type: Number,
    min: 0,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes for better performance
productSchema.index({ name: 'text', description: 'text' }); // Text search
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ stock: 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ createdAt: -1 });

// Virtual for checking if product is in stock
productSchema.virtual('inStock').get(function() {
  return this.stock > 0;
});

// Virtual for checking if product is low stock
productSchema.virtual('isLowStock').get(function() {
  return this.stock > 0 && this.stock <= 10;
});

// Method to update stock
productSchema.methods.updateStock = async function(quantity, operation = 'subtract') {
  if (operation === 'subtract') {
    this.stock -= quantity;
    this.sold += quantity;
  } else if (operation === 'add') {
    this.stock += quantity;
  } else if (operation === 'set') {
    this.stock = quantity;
  }
  
  if (this.stock < 0) {
    throw new Error('Insufficient stock');
  }
  
  return await this.save();
};

// Method to increment views
productSchema.methods.incrementViews = async function() {
  this.views += 1;
  return await this.save();
};

// Static method to find low stock products
productSchema.statics.findLowStock = function(threshold = 10) {
  return this.find({ 
    stock: { $gt: 0, $lte: threshold },
    isActive: true 
  });
};

// Static method to find featured products
productSchema.statics.findFeatured = function() {
  return this.find({ isFeatured: true, isActive: true });
};

// Static method to search products
productSchema.statics.searchProducts = function(searchTerm) {
  return this.find({
    $text: { $search: searchTerm },
    isActive: true
  }).sort({ score: { $meta: 'textScore' } });
};

// Pre-save hook to calculate discount
productSchema.pre('save', function(next) {
  if (this.originalPrice && this.price) {
    this.discount = Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
