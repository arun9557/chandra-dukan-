// Category Model - श्रेणी मॉडल
// MongoDB schema for product categories

const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    unique: true,
    trim: true,
    minlength: [2, 'Category name must be at least 2 characters'],
    maxlength: [100, 'Category name cannot exceed 100 characters']
  },
  hindiName: {
    type: String,
    trim: true,
    default: ''
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters'],
    default: ''
  },
  icon: {
    type: String,
    default: '📦'
  },
  image: {
    type: String,
    default: ''
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  displayOrder: {
    type: Number,
    default: 0
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  productCount: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

// Indexes
categorySchema.index({ name: 1 });
categorySchema.index({ slug: 1 });
categorySchema.index({ isActive: 1 });
categorySchema.index({ displayOrder: 1 });

// Generate slug from name before saving
categorySchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  next();
});

// Virtual for subcategories
categorySchema.virtual('subcategories', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parent'
});

// Method to get category with products
categorySchema.methods.getWithProducts = async function() {
  const Product = mongoose.model('Product');
  const products = await Product.find({ 
    category: this._id, 
    isActive: true 
  }).limit(10);
  
  return {
    ...this.toObject(),
    products
  };
};

// Static method to find active categories
categorySchema.statics.findActive = function() {
  return this.find({ isActive: true }).sort({ displayOrder: 1, name: 1 });
};

// Static method to find top-level categories
categorySchema.statics.findTopLevel = function() {
  return this.find({ parent: null, isActive: true }).sort({ displayOrder: 1 });
};

// Static method to update product count
categorySchema.statics.updateProductCount = async function(categoryId) {
  const Product = mongoose.model('Product');
  const count = await Product.countDocuments({ category: categoryId, isActive: true });
  await this.findByIdAndUpdate(categoryId, { productCount: count });
  return count;
};

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
