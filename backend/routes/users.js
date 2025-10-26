// User Profile Routes - User profile management ka API
// Profile fetch, update, password change, avatar upload, account delete

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Order = require('../models/Order');
const { authenticateToken } = require('../middleware/auth');
const multer = require('multer');
const cloudinary = require('cloudinary');

// Setup multer for avatar upload - Using memory storage for serverless compatibility
const storage = multer.memoryStorage();

// File filter for avatar uploads
const fileFilter = function (req, file, cb) {
  // Accept images only
  if (!file.mimetype.match(/^image/)) {
    req.fileValidationError = 'Only image files are allowed!';
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
};

// Configure multer with memory storage
const upload = multer({ 
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter 
});

// Helper function to upload to Cloudinary
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { 
        folder: 'avatars',
        resource_type: 'auto',
        transformation: [
          { width: 200, height: 200, crop: 'thumb', gravity: 'face' },
          { fetch_format: 'auto', quality: 'auto' }
        ]
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
};

// Get user profile - User ka profile get karna
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .select('-password -refreshToken')
      .lean();
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    // Get order count - User ke orders count karna
    const orderCount = await Order.countDocuments({ user: user._id });
    
    res.json({
      success: true,
      data: {
        ...user,
        orderCount
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch profile',
      message: error.message
    });
  }
});

// Update user profile - Profile update karna
router.put('/profile', authenticateToken, [
  body('name').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('address.street').optional().trim(),
  body('address.city').optional().trim(),
  body('address.state').optional().trim(),
  body('address.pincode').optional().matches(/^[0-9]{6}$/).withMessage('Invalid pincode')
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
    
    const { name, address } = req.body;
    
    // Update user
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      {
        name,
        address: {
          street: address?.street || '',
          city: address?.city || '',
          state: address?.state || '',
          pincode: address?.pincode || '',
          landmark: address?.landmark || ''
        }
      },
      { new: true, runValidators: true }
    ).select('-password -refreshToken');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update profile',
      message: error.message
    });
  }
});

// Change password - Password change karna
router.put('/password', authenticateToken, [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
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
    
    const { currentPassword, newPassword } = req.body;
    
    // Get user with password
    const user = await User.findById(req.user.userId).select('+password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    // Verify current password
    const isPasswordValid = await user.comparePassword(currentPassword);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Current password is incorrect'
      });
    }
    
    // Update password
    user.password = newPassword;
    await user.save();
    
    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to change password',
      message: error.message
    });
  }
});

// Upload avatar - Profile photo upload karna
router.put('/avatar', authenticateToken, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    // Check for validation errors
    if (req.fileValidationError) {
      return res.status(400).json({
        success: false,
        error: req.fileValidationError
      });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Upload new avatar to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer);

    // Delete old avatar from Cloudinary if exists
    if (user.avatarPublicId) {
      try {
        await cloudinary.uploader.destroy(user.avatarPublicId);
      } catch (err) {
        console.error('Error deleting old avatar:', err);
        // Continue even if deletion fails
      }
    }

    // Update user with new avatar URL and public ID
    user.avatar = result.secure_url;
    user.avatarPublicId = result.public_id;
    await user.save();

    res.json({
      success: true,
      data: {
        avatar: user.avatar
      }
    });
  } catch (err) {
    console.error('Avatar upload error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to update avatar',
      message: process.env.NODE_ENV === 'production' 
        ? 'Avatar update failed' 
        : err.message
    });
  }
});

// Delete user account - User ka account delete karna
router.delete('/account', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Delete user's avatar from Cloudinary if exists
    if (user.avatarPublicId) {
      try {
        await cloudinary.uploader.destroy(user.avatarPublicId);
      } catch (err) {
        console.error('Error deleting avatar from Cloudinary:', err);
        // Continue even if deletion fails
      }
    }

    // Delete user
    await User.findByIdAndDelete(req.user.userId);

    res.json({
      success: true,
      message: 'User account deleted successfully'
    });
  } catch (err) {
    console.error('Account deletion error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to delete account',
      message: process.env.NODE_ENV === 'production'
        ? 'Account deletion failed'
        : err.message
    });
  }
});

// Get user by ID (Admin only) - User ko ID se get karna
router.get('/:userId', authenticateToken, async (req, res) => {
  try {
    // Check if requesting own profile or admin
    if (req.user.userId !== req.params.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }
    
    const user = await User.findById(req.params.userId)
      .select('-password -refreshToken');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user',
      message: error.message
    });
  }
});

module.exports = router;
