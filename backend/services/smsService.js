// SMS Service - Twilio se SMS bhejne ka service
// OTP, order updates, delivery notifications ke liye SMS

const twilio = require('twilio');

class SMSService {
  constructor() {
    // Check if Twilio credentials are configured
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      this.client = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );
      this.fromNumber = process.env.TWILIO_PHONE_NUMBER;
      this.isConfigured = true;
    } else {
      console.warn('⚠️ Twilio not configured. SMS will be skipped.');
      this.isConfigured = false;
    }
  }

  // Send SMS - SMS bhejne ka main function
  async sendSMS(to, message) {
    try {
      if (!this.isConfigured) {
        console.log('SMS (Not sent - Twilio not configured):', message);
        return { success: false, error: 'Twilio not configured' };
      }

      // Format phone number - Indian number ko format karna
      const phoneNumber = this.formatPhoneNumber(to);

      const result = await this.client.messages.create({
        body: message,
        from: this.fromNumber,
        to: phoneNumber
      });

      console.log('SMS sent:', result.sid);
      return { success: true, sid: result.sid };
    } catch (error) {
      console.error('SMS send error:', error);
      return { success: false, error: error.message };
    }
  }

  // Send OTP SMS - OTP bhejne ka function
  async sendOTP(phone, otp) {
    const message = `Your Chandra Dukan OTP is: ${otp}. Valid for 10 minutes. Do not share with anyone.\n\nआपका OTP: ${otp}`;
    return await this.sendSMS(phone, message);
  }

  // Welcome SMS - Registration par welcome message
  async sendWelcomeSMS(user) {
    const message = `Welcome to Chandra Dukan, ${user.name}! 🎉\n\nStart shopping now. Visit: chandradukan.com\n\nChandra Dukan - आपके घर तक, जल्दी और आसान`;
    return await this.sendSMS(user.phone, message);
  }

  // Order confirmation SMS - Order place hone par SMS
  async sendOrderConfirmation(order, user) {
    const message = `Order Confirmed! 🎉\n\nOrder #${order.orderNumber}\nAmount: ₹${order.total}\nDelivery to: ${order.customerDetails.address.substring(0, 50)}...\n\nTrack: chandradukan.com/orders\n\nChandra Dukan`;
    return await this.sendSMS(user.phone, message);
  }

  // Order status update SMS - Status change hone par SMS
  async sendOrderStatusUpdate(order, user, newStatus) {
    const statusMessages = {
      'confirmed': 'confirmed ✅',
      'processing': 'being prepared ⚡',
      'packed': 'packed and ready 📦',
      'shipped': 'shipped 🚚',
      'out_for_delivery': 'out for delivery 🚗',
      'delivered': 'delivered 🎉',
      'cancelled': 'cancelled ❌'
    };

    const statusText = statusMessages[newStatus] || 'updated';
    const message = `Order #${order.orderNumber} is ${statusText}\n\nTrack: chandradukan.com/orders\n\nChandra Dukan`;
    
    return await this.sendSMS(user.phone, message);
  }

  // Out for delivery SMS - Delivery ke liye nikle
  async sendOutForDeliverySMS(order, user) {
    const message = `Your order #${order.orderNumber} is out for delivery! 🚗\n\nExpected delivery: Within 30 mins\nAmount: ₹${order.total} (${order.paymentMethod.toUpperCase()})\n\nKeep ₹${order.total} ready if COD.\n\nChandra Dukan`;
    return await this.sendSMS(user.phone, message);
  }

  // Delivered SMS - Delivery complete hone par
  async sendDeliveredSMS(order, user) {
    const message = `Order #${order.orderNumber} delivered successfully! 🎉\n\nThank you for shopping with us.\nTotal paid: ₹${order.total}\n\nRate your experience: chandradukan.com/review\n\nChandra Dukan`;
    return await this.sendSMS(user.phone, message);
  }

  // Payment success SMS - Payment successful hone par
  async sendPaymentSuccessSMS(order, user) {
    const message = `Payment Received! ✅\n\nOrder #${order.orderNumber}\nAmount: ₹${order.total}\nPayment ID: ${order.paymentId || 'N/A'}\n\nYour order will be delivered soon.\n\nChandra Dukan`;
    return await this.sendSMS(user.phone, message);
  }

  // Refund initiated SMS - Refund start hone par
  async sendRefundInitiatedSMS(order, user, refundAmount) {
    const message = `Refund initiated for order #${order.orderNumber}\n\nAmount: ₹${refundAmount}\nRefund will be processed in 5-7 business days.\n\nSorry for the inconvenience.\n\nChandra Dukan`;
    return await this.sendSMS(user.phone, message);
  }

  // Password reset SMS - Password reset code bhejne ke liye
  async sendPasswordResetSMS(user, resetCode) {
    const message = `Your password reset code is: ${resetCode}\n\nValid for 15 minutes. Do not share.\n\nChandra Dukan`;
    return await this.sendSMS(user.phone, message);
  }

  // Low stock alert SMS (for admin) - Stock kam hone par admin ko alert
  async sendLowStockAlert(product) {
    const adminPhone = process.env.ADMIN_PHONE;
    if (!adminPhone) return { success: false, error: 'Admin phone not configured' };

    const message = `[ALERT] Low Stock! ⚠️\n\nProduct: ${product.name}\nCurrent stock: ${product.stock}\n\nRestock soon!\n\nChandra Dukan Admin`;
    return await this.sendSMS(adminPhone, message);
  }

  // New order alert SMS (for admin) - Naya order aane par admin ko alert
  async sendNewOrderAlert(order) {
    const adminPhone = process.env.ADMIN_PHONE;
    if (!adminPhone) return { success: false, error: 'Admin phone not configured' };

    const message = `New Order! 🎉\n\nOrder #${order.orderNumber}\nAmount: ₹${order.total}\nItems: ${order.items.length}\nPayment: ${order.paymentMethod.toUpperCase()}\n\nCheck admin panel.\n\nChandra Dukan`;
    return await this.sendSMS(adminPhone, message);
  }

  // Format phone number - Indian number ko +91 format me convert karna
  formatPhoneNumber(phone) {
    // Remove all non-digits
    let cleaned = phone.replace(/\D/g, '');
    
    // If 10 digits, add +91
    if (cleaned.length === 10) {
      return `+91${cleaned}`;
    }
    
    // If already has country code
    if (cleaned.length === 12 && cleaned.startsWith('91')) {
      return `+${cleaned}`;
    }
    
    // If has + already
    if (phone.startsWith('+')) {
      return phone;
    }
    
    return `+91${cleaned}`;
  }

  // Verify Twilio configuration - Twilio setup sahi hai ya nahi check karna
  async verifyConnection() {
    try {
      if (!this.isConfigured) {
        console.log('⚠️ Twilio not configured');
        return false;
      }

      // Try to fetch account details to verify
      const account = await this.client.api.accounts(process.env.TWILIO_ACCOUNT_SID).fetch();
      console.log('✅ SMS service is ready');
      return true;
    } catch (error) {
      console.error('❌ SMS service error:', error.message);
      return false;
    }
  }
}

module.exports = new SMSService();
