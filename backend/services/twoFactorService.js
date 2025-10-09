// Two-Factor Authentication Service - 2FA implementation
// Email/OTP based 2FA for critical accounts

const crypto = require('crypto');
const emailService = require('./emailService');
const smsService = require('./smsService');

class TwoFactorService {
  constructor() {
    // In-memory storage for 2FA codes (use Redis in production)
    this.codes = new Map();
  }

  // Generate 2FA code - 2FA code generate karna
  generate2FACode() {
    return crypto.randomInt(100000, 999999).toString(); // 6-digit code
  }

  // Send 2FA code via email - Email se 2FA code bhejna
  async send2FAEmail(user) {
    try {
      const code = this.generate2FACode();
      const expiresAt = Date.now() + (10 * 60 * 1000); // 10 minutes

      // Store code
      this.codes.set(`email_${user._id}`, {
        code,
        expiresAt,
        attempts: 0
      });

      // Send email
      const subject = '2FA Verification Code - Chandra Dukan';
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #6366f1; padding: 30px; text-align: center; color: white;">
            <h1 style="margin: 0;">🔐 Two-Factor Authentication</h1>
          </div>
          <div style="padding: 30px; background: #f9fafb;">
            <p style="color: #4b5563;">Hi ${user.name},</p>
            <p style="color: #4b5563;">
              Your 2FA verification code is:
            </p>
            <div style="background: white; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
              <h2 style="color: #6366f1; font-size: 36px; letter-spacing: 8px; margin: 0;">${code}</h2>
            </div>
            <p style="color: #4b5563;">
              This code will expire in 10 minutes.
              <br>
              <strong>यह code 10 मिनट में expire हो जाएगा।</strong>
            </p>
            <p style="color: #ef4444; font-size: 14px;">
              ⚠️ Never share this code with anyone. Chandra Dukan will never ask for this code.
            </p>
          </div>
        </div>
      `;

      await emailService.sendEmail(user.email, subject, html);

      return { success: true, message: '2FA code sent to email' };
    } catch (error) {
      console.error('Send 2FA email error:', error);
      return { success: false, error: error.message };
    }
  }

  // Send 2FA code via SMS - SMS se 2FA code bhejna
  async send2FASMS(user) {
    try {
      const code = this.generate2FACode();
      const expiresAt = Date.now() + (10 * 60 * 1000); // 10 minutes

      // Store code
      this.codes.set(`sms_${user._id}`, {
        code,
        expiresAt,
        attempts: 0
      });

      // Send SMS
      const message = `Your Chandra Dukan 2FA code is: ${code}\n\nValid for 10 minutes. Do not share.\n\nआपका 2FA code: ${code}`;
      await smsService.sendSMS(user.phone, message);

      return { success: true, message: '2FA code sent to phone' };
    } catch (error) {
      console.error('Send 2FA SMS error:', error);
      return { success: false, error: error.message };
    }
  }

  // Verify 2FA code - 2FA code verify karna
  verify2FACode(userId, code, method = 'email') {
    const key = `${method}_${userId}`;
    const stored = this.codes.get(key);

    if (!stored) {
      return {
        success: false,
        error: '2FA code not found or expired',
        error_hi: '2FA code नहीं मिला या expire हो गया'
      };
    }

    // Check expiry
    if (Date.now() > stored.expiresAt) {
      this.codes.delete(key);
      return {
        success: false,
        error: '2FA code expired',
        error_hi: '2FA code expire हो गया'
      };
    }

    // Check attempts (max 3)
    if (stored.attempts >= 3) {
      this.codes.delete(key);
      return {
        success: false,
        error: 'Too many attempts. Request a new code.',
        error_hi: 'बहुत attempts, नया code request करें'
      };
    }

    // Verify code
    if (stored.code === code) {
      this.codes.delete(key);
      return {
        success: true,
        message: '2FA verified successfully'
      };
    } else {
      stored.attempts += 1;
      return {
        success: false,
        error: 'Invalid 2FA code',
        error_hi: 'गलत 2FA code',
        attemptsLeft: 3 - stored.attempts
      };
    }
  }

  // Check if 2FA is enabled for user - User ke liye 2FA enabled hai ya nahi
  is2FAEnabled(user) {
    return user.twoFactorEnabled || false;
  }

  // Enable 2FA for user - User ke liye 2FA enable karna
  async enable2FA(user, method = 'email') {
    user.twoFactorEnabled = true;
    user.twoFactorMethod = method;
    await user.save();
    return { success: true, message: '2FA enabled successfully' };
  }

  // Disable 2FA for user - User ke liye 2FA disable karna
  async disable2FA(user) {
    user.twoFactorEnabled = false;
    user.twoFactorMethod = null;
    await user.save();
    return { success: true, message: '2FA disabled successfully' };
  }

  // Clean expired codes - Expire ho chuke codes delete karna
  cleanExpiredCodes() {
    const now = Date.now();
    for (const [key, value] of this.codes.entries()) {
      if (now > value.expiresAt) {
        this.codes.delete(key);
      }
    }
  }
}

// Clean expired codes every 5 minutes
const twoFactorService = new TwoFactorService();
setInterval(() => {
  twoFactorService.cleanExpiredCodes();
}, 5 * 60 * 1000);

module.exports = twoFactorService;
