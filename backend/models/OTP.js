// OTP Model - OTP verification ke liye MongoDB schema
// Email aur phone verification ke liye OTP store karna

const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  identifier: {
    type: String,  // Email ya phone number
    required: true,
    trim: true
  },
  otp: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['email', 'phone', 'both'],
    default: 'email'
  },
  purpose: {
    type: String,
    enum: ['registration', 'login', 'password-reset'],
    default: 'registration'
  },
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
  },
  isUsed: {
    type: Boolean,
    default: false
  },
  attempts: {
    type: Number,
    default: 0
  },
  maxAttempts: {
    type: Number,
    default: 3
  }
}, {
  timestamps: true
});

// Index for faster queries
otpSchema.index({ identifier: 1, purpose: 1 });
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // Auto-delete expired OTPs

// Generate random 6-digit OTP
otpSchema.statics.generateOTP = function() {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Create new OTP
otpSchema.statics.createOTP = async function(identifier, type = 'email', purpose = 'registration') {
  // Delete any existing unused OTPs for this identifier
  await this.deleteMany({ identifier, purpose, isUsed: false });
  
  // Generate new OTP
  const otp = this.generateOTP();
  
  // Create OTP document
  const otpDoc = await this.create({
    identifier,
    otp,
    type,
    purpose
  });
  
  return otpDoc;
};

// Verify OTP
otpSchema.statics.verifyOTP = async function(identifier, otp, purpose = 'registration') {
  const otpDoc = await this.findOne({
    identifier,
    otp,
    purpose,
    isUsed: false,
    expiresAt: { $gt: new Date() }
  });
  
  if (!otpDoc) {
    return { success: false, message: 'Invalid or expired OTP' };
  }
  
  // Check max attempts
  if (otpDoc.attempts >= otpDoc.maxAttempts) {
    return { success: false, message: 'Maximum OTP verification attempts exceeded' };
  }
  
  // Increment attempts
  otpDoc.attempts += 1;
  
  // Mark as used
  otpDoc.isUsed = true;
  await otpDoc.save();
  
  return { success: true, message: 'OTP verified successfully' };
};

// Check if OTP exists and is valid
otpSchema.statics.checkOTP = async function(identifier, purpose = 'registration') {
  const otpDoc = await this.findOne({
    identifier,
    purpose,
    isUsed: false,
    expiresAt: { $gt: new Date() }
  });
  
  return !!otpDoc;
};

const OTP = mongoose.model('OTP', otpSchema);

module.exports = OTP;
