// Review Model - Product reviews ka MongoDB schema
// Product reviews aur ratings store karne ke liye

const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  // Product reference - Kis product ka review hai
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Product is required']
  },
  
  // User reference - Kon user ne review diya
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  
  // Order reference - Kis order se related hai (optional)
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order'
  },
  
  // Rating (1-5 stars)
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  
  // Review comment
  comment: {
    type: String,
    required: [true, 'Comment is required'],
    trim: true,
    minlength: [10, 'Comment must be at least 10 characters'],
    maxlength: [1000, 'Comment cannot exceed 1000 characters']
  },
  
  // Review images (optional)
  images: [{
    type: String
  }],
  
  // Is approved by admin
  isApproved: {
    type: Boolean,
    default: true // Auto-approve by default
  },
  
  // Is verified purchase
  isVerifiedPurchase: {
    type: Boolean,
    default: false
  },
  
  // Helpful count (how many found it helpful)
  helpfulCount: {
    type: Number,
    default: 0
  },
  
  // Users who marked as helpful
  helpfulBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  // Admin response (optional)
  adminResponse: {
    type: String,
    trim: true
  },
  
  // Admin response date
  adminResponseDate: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes for better performance
reviewSchema.index({ product: 1, user: 1 }, { unique: true }); // One review per user per product
reviewSchema.index({ product: 1, isApproved: 1 });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ createdAt: -1 });

// Static method to calculate average rating - Product ka average rating calculate karna
reviewSchema.statics.calculateAverageRating = async function(productId) {
  const stats = await this.aggregate([
    {
      $match: { 
        product: productId,
        isApproved: true
      }
    },
    {
      $group: {
        _id: '$product',
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 }
      }
    }
  ]);
  
  if (stats.length > 0) {
    // Update product with new rating
    await mongoose.model('Product').findByIdAndUpdate(productId, {
      rating: Math.round(stats[0].averageRating * 10) / 10, // Round to 1 decimal
      reviewCount: stats[0].totalReviews
    });
    
    return {
      averageRating: stats[0].averageRating,
      totalReviews: stats[0].totalReviews
    };
  } else {
    // No reviews, reset product rating
    await mongoose.model('Product').findByIdAndUpdate(productId, {
      rating: 0,
      reviewCount: 0
    });
    
    return {
      averageRating: 0,
      totalReviews: 0
    };
  }
};

// Method to mark as helpful - Review ko helpful mark karna
reviewSchema.methods.markHelpful = function(userId) {
  if (!this.helpfulBy.includes(userId)) {
    this.helpfulBy.push(userId);
    this.helpfulCount += 1;
  }
  return this.save();
};

// Post save middleware to update product rating - Review save hone ke baad product rating update karna
reviewSchema.post('save', async function() {
  await this.constructor.calculateAverageRating(this.product);
});

// Post remove middleware to update product rating - Review delete hone ke baad rating update karna
reviewSchema.post('remove', async function() {
  await this.constructor.calculateAverageRating(this.product);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
