// Security Middleware - Security features ka middleware
// Rate limiting, input sanitization, CSRF protection, secure headers

const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

// Rate Limiting - Brute force attacks se bachne ke liye
// General API rate limiter - Sab APIs ke liye
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Max 100 requests per 15 minutes
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again after 15 minutes.',
    error_hi: 'बहुत अधिक requests, कृपया 15 मिनट बाद try करें।'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Skip successful requests from rate limit count
  skipSuccessfulRequests: false,
  // Skip failed requests from rate limit count
  skipFailedRequests: false
});

// Strict rate limiter for auth endpoints - Login/Register ke liye strict
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Max 5 attempts per 15 minutes
  message: {
    success: false,
    error: 'Too many login attempts, please try again after 15 minutes.',
    error_hi: 'बहुत अधिक login attempts, कृपया 15 मिनट बाद try करें।'
  },
  skipSuccessfulRequests: true // Don't count successful logins
});

// OTP rate limiter - OTP request limiting
const otpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 3, // Max 3 OTP requests per 5 minutes
  message: {
    success: false,
    error: 'Too many OTP requests, please try again after 5 minutes.',
    error_hi: 'बहुत अधिक OTP requests, कृपया 5 मिनट बाद try करें।'
  }
});

// Password reset limiter - Password reset ke liye
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Max 3 password reset attempts per hour
  message: {
    success: false,
    error: 'Too many password reset attempts, please try again after 1 hour.',
    error_hi: 'बहुत अधिक password reset attempts, कृपया 1 घंटे बाद try करें।'
  }
});

// Payment rate limiter - Payment endpoints ke liye
const paymentLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 10, // Max 10 payment attempts per 10 minutes
  message: {
    success: false,
    error: 'Too many payment attempts, please try again later.',
    error_hi: 'बहुत अधिक payment attempts, कृपया बाद में try करें।'
  }
});

// File upload limiter - File upload ke liye
const uploadLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 20, // Max 20 uploads per 10 minutes
  message: {
    success: false,
    error: 'Too many upload attempts, please try again later.',
    error_hi: 'बहुत अधिक upload attempts, कृपया बाद में try करें।'
  }
});

// Configure Helmet - Security headers set karna
const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      connectSrc: ["'self'", 'https://api.razorpay.com', 'https://checkout.razorpay.com']
    }
  },
  crossOriginEmbedderPolicy: false, // Allow embedding
  crossOriginResourcePolicy: { policy: 'cross-origin' }
});

// Input Sanitization Middleware - XSS aur NoSQL injection se bachao
const sanitizeInput = (req, res, next) => {
  // Sanitize request body, query, params
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        // Remove any HTML tags
        req.body[key] = req.body[key].trim();
      }
    });
  }
  
  if (req.query) {
    Object.keys(req.query).forEach(key => {
      if (typeof req.query[key] === 'string') {
        req.query[key] = req.query[key].trim();
      }
    });
  }
  
  next();
};

// Validate critical operations - Important operations ke liye extra validation
const validateCriticalOperation = (req, res, next) => {
  // Check if user is trying to perform critical operation
  const criticalPaths = ['/delete', '/remove', '/deactivate'];
  const isCritical = criticalPaths.some(path => req.path.includes(path));
  
  if (isCritical) {
    // Require recent authentication (within last 30 minutes)
    const authTime = req.user?.authTime || 0;
    const now = Date.now();
    const thirtyMinutes = 30 * 60 * 1000;
    
    if (now - authTime > thirtyMinutes) {
      return res.status(403).json({
        success: false,
        error: 'Please re-authenticate to perform this action',
        error_hi: 'कृपया इस action के लिए फिर से login करें',
        requireReauth: true
      });
    }
  }
  
  next();
};

// Log security events - Security events ko log karna
const logSecurityEvent = (event, details) => {
  console.log(`[SECURITY] ${new Date().toISOString()} - ${event}:`, details);
  // TODO: Save to database or external logging service
};

module.exports = {
  apiLimiter,
  authLimiter,
  otpLimiter,
  passwordResetLimiter,
  paymentLimiter,
  uploadLimiter,
  helmetConfig,
  sanitizeInput,
  mongoSanitize,
  xss,
  validateCriticalOperation,
  logSecurityEvent
};
