// Chandra Dukan Backend Server
// Express.js API server for grocery delivery app

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');
require('dotenv').config();

// Security middleware import - Security features ke liye
const { 
  helmetConfig, 
  sanitizeInput, 
  mongoSanitize, 
  xss,
  apiLimiter
} = require('./middleware/security');

// Import database connection
const { connectDB } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;
// Connect to MongoDB
connectDB();

// Security Middleware - Security middleware setup करना
app.use(helmetConfig); // Secure HTTP headers
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8000',
  credentials: true
}));
app.use(mongoSanitize()); // Prevent NoSQL injection
app.use(xss()); // Prevent XSS attacks
app.use(sanitizeInput); // Custom input sanitization
app.use('/api/', apiLimiter); // Rate limiting for all APIs

// Logging - Logging setup करना
app.use(morgan('combined'));

// Body parsing - Body parsing setup करना
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files - Static files serve करना
app.use(express.static('public'));
app.use('/uploads', express.static('public/uploads'));
app.use('/assets', express.static('assets'));

// Routes - API routes setup करना
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/customers', require('./routes/customers'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/janseva', require('./routes/janseva'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/faq', require('./routes/faq'));
app.use('/api/users', require('./routes/users'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/notifications', require('./routes/notifications-email-sms'));
app.use('/api/returns', require('./routes/returns'));

// Health check - Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0'
  });
});
// Root - Helpful message for browser/root requests
app.get('/', (req, res) => {
  res.json({
    message: 'Chandra Dukan API - visit /api/health for status, available routes under /api/*',
    routes: ['/api/health', '/api/products', '/api/orders', '/api/auth']
  });
});
// Error handling - Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler - 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Start server - Server start करना (bind to 0.0.0.0 to ensure IPv4 accessibility)
const HOST = process.env.HOST || '0.0.0.0';
app.listen(PORT, HOST, () => {
  console.log(`🚀 Chandra Dukan Backend running on ${HOST}:${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
});

module.exports = app;
