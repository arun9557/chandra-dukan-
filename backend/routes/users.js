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
const path = require('path');
const fs = require('fs');

// Setup multer for avatar upload - Avatar upload ke liye multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/avatars';
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Accept images only
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

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
    
    // Get user
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    // Delete old avatar if exists
    if (user.avatar) {
      const oldAvatarPath = path.join(__dirname, '..', user.avatar);
      if (fs.existsSync(oldAvatarPath)) {
        fs.unlinkSync(oldAvatarPath);
      }
    }
    
    // Update user avatar
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    user.avatar = avatarUrl;
    await user.save();
    
    res.json({
      success: true,
      message: 'Avatar uploaded successfully',
      data: {
        avatar: avatarUrl
      }
    });
  } catch (error) {
    console.error('Upload avatar error:', error);
    
    // Delete uploaded file if error occurs
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to upload avatar',
      message: error.message
    });
  }
});

// Delete/Deactivate account - Account delete ya deactivate karna
router.delete('/account', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    // Deactivate account instead of deleting - Delete karne ki jagah deactivate karna
    user.isActive = false;
    await user.save();
    
    // Optional: Delete user avatar
    if (user.avatar) {
      const avatarPath = path.join(__dirname, '..', user.avatar);
      if (fs.existsSync(avatarPath)) {
        fs.unlinkSync(avatarPath);
      }
    }
    
    res.json({
      success: true,
      message: 'Account deactivated successfully'
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete account',
      message: error.message
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
