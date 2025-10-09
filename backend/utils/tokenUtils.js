// Token Utility Functions - Token utility functions
// JWT token generation और validation के लिए helper functions

const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// JWT token generate करने का function
const generateToken = (userId, expiresIn = '30d') => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn }
  );
};

// Refresh token generate करने का function
const generateRefreshToken = (userId) => {
  return jwt.sign(
    { id: userId, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
    { expiresIn: '90d' }
  );
};

// Token verify करने का function
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
  } catch (error) {
    throw new Error('Invalid token');
  }
};

// Refresh token verify करने का function
const verifyRefreshToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key');
    if (decoded.type !== 'refresh') {
      throw new Error('Invalid refresh token');
    }
    return decoded;
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
};

// Random OTP generate करने का function
const generateOTP = (length = 6) => {
  const digits = '0123456789';
  let otp = '';
  
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  
  return otp;
};

// Email verification token generate करने का function
const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Password reset token generate करने का function
const generateResetToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Token expiry time calculate करने का function
const getTokenExpiry = (minutes = 15) => {
  return new Date(Date.now() + minutes * 60 * 1000);
};

// Token ko decode करने का function (without verification)
const decodeToken = (token) => {
  return jwt.decode(token);
};

module.exports = {
  generateToken,
  generateRefreshToken,
  verifyToken,
  verifyRefreshToken,
  generateOTP,
  generateVerificationToken,
  generateResetToken,
  getTokenExpiry,
  decodeToken
};
