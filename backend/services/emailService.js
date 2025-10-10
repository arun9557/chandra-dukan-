// Email Service - Nodemailer se emails bhejne ka service
// Registration, orders, password reset, admin alerts ke liye emails

const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    // Create transporter - Email bhejne ka transporter setup
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER, // Gmail address
        pass: process.env.SMTP_PASS  // App password (not regular password)
      }
    });
  }

  // Send email - Email bhejne ka main function
  async sendEmail(to, subject, html, text = '') {
    try {
      const mailOptions = {
        from: `"${process.env.SMTP_FROM_NAME || 'Chandra Dukan'}" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html,
        text: text || this.stripHtml(html)
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Email send error:', error);
      return { success: false, error: error.message };
    }
  }

  // Registration welcome email - Nayi registration par welcome email
  async sendWelcomeEmail(user) {
    const subject = 'Welcome to Chandra Dukan! 🎉';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0;">🏪 Welcome to Chandra Dukan!</h1>
          <p style="margin: 10px 0 0 0;">आपके घर तक, जल्दी और आसान</p>
        </div>
        <div style="padding: 30px; background: #f9fafb;">
          <h2 style="color: #1f2937;">Namaste ${user.name}! 🙏</h2>
          <p style="color: #4b5563; line-height: 1.6;">
            Welcome to Chandra Dukan family! Your account has been successfully created.
            <br><br>
            <strong>आपका खाता सफलतापूर्वक बनाया गया है।</strong>
          </p>
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #6366f1; margin-top: 0;">Your Account Details:</h3>
            <p style="margin: 5px 0;"><strong>Name:</strong> ${user.name}</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> ${user.email}</p>
            <p style="margin: 5px 0;"><strong>Phone:</strong> ${user.phone}</p>
          </div>
          <p style="color: #4b5563;">
            Start shopping now and enjoy fast delivery to your doorstep!
          </p>
          <a href="${process.env.FRONTEND_URL || 'http://localhost:8000'}/products.html" 
             style="display: inline-block; background: #6366f1; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; margin-top: 20px;">
            Browse Products
          </a>
        </div>
        <div style="background: #1f2937; padding: 20px; text-align: center; color: white; font-size: 12px;">
          <p>© 2024 Chandra Dukan. All rights reserved.</p>
          <p>Nawalpur Beyora, Saran, Bihar | +91 7465073957</p>
        </div>
      </div>
    `;

    return await this.sendEmail(user.email, subject, html);
  }

  // Order confirmation email - Order place hone par confirmation
  async sendOrderConfirmation(order, user) {
    const subject = `Order Confirmed! #${order.orderNumber} 🎉`;
    
    const itemsHtml = order.items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: right;">₹${item.price}</td>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: right;">₹${item.subtotal}</td>
      </tr>
    `).join('');

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #10b981; padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0;">✅ Order Confirmed!</h1>
          <p style="margin: 10px 0 0 0;">Order #${order.orderNumber}</p>
        </div>
        <div style="padding: 30px; background: #f9fafb;">
          <p style="color: #4b5563;">Hi ${user.name},</p>
          <p style="color: #4b5563;">
            Thank you for your order! We've received it and will start preparing it shortly.
            <br>
            <strong>आपका ऑर्डर confirm हो गया है।</strong>
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #6366f1; margin-top: 0;">Order Details:</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background: #f3f4f6;">
                  <th style="padding: 10px; text-align: left;">Item</th>
                  <th style="padding: 10px; text-align: center;">Qty</th>
                  <th style="padding: 10px; text-align: right;">Price</th>
                  <th style="padding: 10px; text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="3" style="padding: 10px; text-align: right;"><strong>Total:</strong></td>
                  <td style="padding: 10px; text-align: right;"><strong>₹${order.total}</strong></td>
                </tr>
              </tfoot>
            </table>
          </div>

          <div style="background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b;">
            <p style="margin: 0; color: #92400e;">
              <strong>Delivery Address:</strong><br>
              ${order.customerDetails.address}
            </p>
          </div>

          <a href="${process.env.FRONTEND_URL || 'http://localhost:8000'}/order-history.html" 
             style="display: inline-block; background: #6366f1; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; margin-top: 20px;">
            Track Order
          </a>
        </div>
        <div style="background: #1f2937; padding: 20px; text-align: center; color: white; font-size: 12px;">
          <p>Questions? Contact us at +91 7465073957</p>
        </div>
      </div>
    `;

    return await this.sendEmail(user.email, subject, html);
  }

  // Order status update email - Order status change hone par
  async sendOrderStatusUpdate(order, user, newStatus) {
    const statusMessages = {
      'confirmed': { title: 'Order Confirmed', emoji: '✅', color: '#10b981' },
      'processing': { title: 'Order Processing', emoji: '⚡', color: '#f59e0b' },
      'packed': { title: 'Order Packed', emoji: '📦', color: '#6366f1' },
      'shipped': { title: 'Order Shipped', emoji: '🚚', color: '#8b5cf6' },
      'out_for_delivery': { title: 'Out for Delivery', emoji: '🚗', color: '#ec4899' },
      'delivered': { title: 'Order Delivered', emoji: '🎉', color: '#10b981' },
      'cancelled': { title: 'Order Cancelled', emoji: '❌', color: '#ef4444' }
    };

    const status = statusMessages[newStatus] || statusMessages.confirmed;
    const subject = `${status.emoji} ${status.title} - Order #${order.orderNumber}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: ${status.color}; padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0;">${status.emoji} ${status.title}</h1>
          <p style="margin: 10px 0 0 0;">Order #${order.orderNumber}</p>
        </div>
        <div style="padding: 30px; background: #f9fafb;">
          <p style="color: #4b5563;">Hi ${user.name},</p>
          <p style="color: #4b5563;">
            Your order status has been updated to <strong>${status.title}</strong>.
          </p>
          <a href="${process.env.FRONTEND_URL || 'http://localhost:8000'}/order-history.html" 
             style="display: inline-block; background: #6366f1; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; margin-top: 20px;">
            Track Order
          </a>
        </div>
      </div>
    `;

    return await this.sendEmail(user.email, subject, html);
  }

  // Password reset email - Password reset link bhejne ke liye
  async sendPasswordResetEmail(user, resetToken) {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:8000'}/reset-password.html?token=${resetToken}`;
    const subject = 'Password Reset Request - Chandra Dukan';

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #6366f1; padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0;">🔐 Password Reset</h1>
        </div>
        <div style="padding: 30px; background: #f9fafb;">
          <p style="color: #4b5563;">Hi ${user.name},</p>
          <p style="color: #4b5563;">
            You requested to reset your password. Click the button below to reset it:
            <br>
            <strong>आपने password reset का request किया है।</strong>
          </p>
          <a href="${resetUrl}" 
             style="display: inline-block; background: #6366f1; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; margin-top: 20px;">
            Reset Password
          </a>
          <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
            This link will expire in 1 hour. If you didn't request this, please ignore this email.
          </p>
        </div>
      </div>
    `;

    return await this.sendEmail(user.email, subject, html);
  }

  // Admin alert email - Admin ko important notifications
  async sendAdminAlert(subject, message, data = {}) {
    const adminEmail = process.env.ADMIN_EMAIL || process.env.SMTP_USER;
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #ef4444; padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0;">⚠️ Admin Alert</h1>
        </div>
        <div style="padding: 30px; background: #f9fafb;">
          <h2 style="color: #1f2937;">${subject}</h2>
          <p style="color: #4b5563;">${message}</p>
          ${Object.keys(data).length > 0 ? `
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <pre style="margin: 0; font-size: 12px;">${JSON.stringify(data, null, 2)}</pre>
            </div>
          ` : ''}
        </div>
      </div>
    `;

    return await this.sendEmail(adminEmail, `[Admin Alert] ${subject}`, html);
  }

  // Strip HTML tags - HTML tags remove karna
  stripHtml(html) {
    return html.replace(/<[^>]*>/g, '');
  }

  // Verify connection - Email service working hai ya nahi check karna
  async verifyConnection() {
    try {
      await this.transporter.verify();
      console.log('✅ Email service is ready');
      return true;
    } catch (error) {
      console.error('❌ Email service error:', error);
      return false;
    }
  }
}

module.exports = new EmailService();
