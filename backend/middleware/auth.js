// Authentication Middleware - Authentication middleware
// JWT token verification और user authentication

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// JWT token verify करने का middleware
const authenticateToken = async (req, res, next) => {
  try {
    // Header se token extract करना
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Access denied. No token provided.',
        message: 'कृपया पहले लॉगिन करें'
      });
    }
    
    // Token verify करना
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // User ko database se fetch करना
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        message: 'उपयोगकर्ता नहीं मिला'
      });
    }
    
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        error: 'Account is deactivated',
        message: 'आपका खाता निष्क्रिय है'
      });
    }
    
    // User ko request object में add करना
    req.user = user;
    next();
    
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({
        success: false,
        error: 'Invalid token',
        message: 'अमान्य टोकन'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({
        success: false,
        error: 'Token expired',
        message: 'टोकन समाप्त हो गया है। कृपया फिर से लॉगिन करें'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Authentication failed',
      message: error.message
    });
  }
};

// Admin role check करने का middleware
const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      error: 'Access denied. Admin only.',
      message: 'केवल एडमिन के लिए'
    });
  }
};

// Customer role check करने का middleware
const requireCustomer = (req, res, next) => {
  if (req.user && (req.user.role === 'customer' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({
      success: false,
      error: 'Access denied. Customer only.',
      message: 'केवल ग्राहक के लिए'
    });
  }
};

// Optional authentication - token hai to user set karo, nahi to continue
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      const user = await User.findById(decoded.id).select('-password');
      if (user && user.isActive) {
        req.user = user;
      }
    }
    
    next();
  } catch (error) {
    // Token invalid hai to bhi continue karo
    next();
  }
};

module.exports = {
  authenticateToken,
  requireAdmin,
  requireCustomer,
  optionalAuth
};
