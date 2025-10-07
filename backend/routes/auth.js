const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');
const { 
  generateToken, 
  generateRefreshToken, 
  generateOTP, 
  generateResetToken, 
  getTokenExpiry 
} = require('../utils/tokenUtils');

// In-memory OTP storage (use Redis in production)
const otpStore = new Map();

// Register - उपयोगकर्ता रजिस्टर करना
router.post('/register', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').matches(/^[6-9]\d{9}$/).withMessage('Valid 10-digit phone number is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
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

    const { name, email, phone, password, address } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(409).json({ 
        success: false,
        error: 'User with this email or phone already exists' 
      });
    }

    // Create new user
    const user = new User({
      name,
      email,
      phone,
      password,
      address: address || {}
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({ 
      success: true,
      message: 'User registered successfully', 
      data: {
        user: user.getPublicProfile(),
        token
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Registration failed', 
      message: error.message 
    });
  }
});

// Login - साइन इन करना
router.post('/login', [
  body('email').optional().isEmail().withMessage('Valid email is required'),
  body('phone').optional().matches(/^[6-9]\d{9}$/).withMessage('Valid phone number is required'),
  body('password').notEmpty().withMessage('Password is required')
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

    const { email, phone, password } = req.body;

    if (!email && !phone) {
      return res.status(400).json({ 
        success: false,
        error: 'Email or phone is required' 
      });
    }

    // Find user by email or phone
    const user = await User.findOne({ 
      $or: [
        { email: email?.toLowerCase() },
        { phone }
      ]
    }).select('+password');

    if (!user) {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid credentials' 
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false,
        error: 'Invalid credentials' 
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.json({ 
      success: true,
      message: 'Login successful', 
      data: {
        user: user.getPublicProfile(),
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Login failed', 
      message: error.message 
    });
  }
});

// Get current user profile
router.get('/me', async (req, res) => {
  try {
    // Extract token from header
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        error: 'No token provided' 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: 'User not found' 
      });
    }

    res.json({ 
      success: true,
      data: user.getPublicProfile()
    });
  } catch (error) {
    res.status(401).json({ 
      success: false,
      error: 'Invalid token', 
      message: error.message 
    });
  }
});

// Update user profile
router.put('/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        error: 'No token provided' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: 'User not found' 
      });
    }

    // Update allowed fields
    const { name, phone, address, avatar } = req.body;
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address) user.address = { ...user.address, ...address };
    if (avatar) user.avatar = avatar;

    await user.save();

    res.json({ 
      success: true,
      message: 'Profile updated successfully',
      data: user.getPublicProfile()
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Profile update failed', 
      message: error.message 
    });
  }
});

// Logout - लॉगआउट करना
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    // Token को blacklist में add करना (implement with Redis in production)
    res.json({ 
      success: true,
      message: 'Logged out successfully',
      message_hi: 'सफलतापूर्वक लॉगआउट हो गया'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Logout failed', 
      message: error.message 
    });
  }
});

// Send OTP - OTP भेजना
router.post('/send-otp', [
  body('phone').matches(/^[6-9]\d{9}$/).withMessage('Valid phone number required')
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

    const { phone } = req.body;
    
    // Generate OTP
    const otp = generateOTP(6);
    const expiry = getTokenExpiry(10); // 10 minutes
    
    // Store OTP (use Redis in production)
    otpStore.set(phone, { otp, expiry });
    
    // TODO: Send OTP via SMS (integrate Twilio/MSG91)
    console.log(`OTP for ${phone}: ${otp}`);
    
    res.json({ 
      success: true,
      message: 'OTP sent successfully',
      message_hi: 'OTP सफलतापूर्वक भेजा गया',
      // Remove in production
      otp: process.env.NODE_ENV === 'development' ? otp : undefined
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Failed to send OTP', 
      message: error.message 
    });
  }
});

// Verify OTP - OTP वेरीफाई करना
router.post('/verify-otp', [
  body('phone').matches(/^[6-9]\d{9}$/).withMessage('Valid phone number required'),
  body('otp').isLength({ min: 6, max: 6 }).withMessage('Valid 6-digit OTP required')
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

    const { phone, otp } = req.body;
    
    // Get stored OTP
    const stored = otpStore.get(phone);
    
    if (!stored) {
      return res.status(400).json({ 
        success: false,
        error: 'OTP not found or expired',
        message_hi: 'OTP नहीं मिला या समाप्त हो गया'
      });
    }
    
    if (new Date() > stored.expiry) {
      otpStore.delete(phone);
      return res.status(400).json({ 
        success: false,
        error: 'OTP expired',
        message_hi: 'OTP समाप्त हो गया'
      });
    }
    
    if (stored.otp !== otp) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid OTP',
        message_hi: 'गलत OTP'
      });
    }
    
    // OTP verified, delete it
    otpStore.delete(phone);
    
    res.json({ 
      success: true,
      message: 'OTP verified successfully',
      message_hi: 'OTP सफलतापूर्वक वेरीफाई हो गया'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'OTP verification failed', 
      message: error.message 
    });
  }
});

// Forgot Password - पासवर्ड भूल गए
router.post('/forgot-password', [
  body('email').isEmail().withMessage('Valid email required')
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

    const { email } = req.body;
    
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: 'User not found',
        message_hi: 'उपयोगकर्ता नहीं मिला'
      });
    }
    
    // Generate reset token
    const resetToken = generateResetToken();
    const expiry = getTokenExpiry(30); // 30 minutes
    
    // Store reset token (use Redis in production)
    otpStore.set(`reset_${email}`, { token: resetToken, expiry });
    
    // TODO: Send reset email
    console.log(`Reset token for ${email}: ${resetToken}`);
    
    res.json({ 
      success: true,
      message: 'Password reset link sent to email',
      message_hi: 'पासवर्ड रीसेट लिंक ईमेल पर भेजा गया',
      // Remove in production
      resetToken: process.env.NODE_ENV === 'development' ? resetToken : undefined
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Failed to process request', 
      message: error.message 
    });
  }
});

// Reset Password - पासवर्ड रीसेट करना
router.post('/reset-password', [
  body('email').isEmail().withMessage('Valid email required'),
  body('token').notEmpty().withMessage('Reset token required'),
  body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
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

    const { email, token, newPassword } = req.body;
    
    // Verify reset token
    const stored = otpStore.get(`reset_${email}`);
    
    if (!stored || stored.token !== token) {
      return res.status(400).json({ 
        success: false,
        error: 'Invalid or expired reset token',
        message_hi: 'अमान्य या समाप्त रीसेट टोकन'
      });
    }
    
    if (new Date() > stored.expiry) {
      otpStore.delete(`reset_${email}`);
      return res.status(400).json({ 
        success: false,
        error: 'Reset token expired',
        message_hi: 'रीसेट टोकन समाप्त हो गया'
      });
    }
    
    // Update password
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: 'User not found'
      });
    }
    
    user.password = newPassword;
    await user.save();
    
    // Delete reset token
    otpStore.delete(`reset_${email}`);
    
    res.json({ 
      success: true,
      message: 'Password reset successfully',
      message_hi: 'पासवर्ड सफलतापूर्वक रीसेट हो गया'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Password reset failed', 
      message: error.message 
    });
  }
});

// Refresh Token - टोकन रीफ्रेश करना
router.post('/refresh-token', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(400).json({ 
        success: false,
        error: 'Refresh token required'
      });
    }
    
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key');
    
    // Generate new access token
    const newToken = generateToken(decoded.id);
    
    res.json({ 
      success: true,
      data: { token: newToken }
    });
  } catch (error) {
    res.status(403).json({ 
      success: false,
      error: 'Invalid refresh token', 
      message: error.message 
    });
  }
});

module.exports = router;
