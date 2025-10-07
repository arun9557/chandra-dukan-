// Payment Service - Payment processing service
// Razorpay, PhonePe, और अन्य payment gateways के लिए

const crypto = require('crypto');

class PaymentService {
  constructor() {
    // Razorpay configuration
    this.razorpayKeyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_key';
    this.razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET || 'rzp_test_secret';
    
    // PhonePe configuration
    this.phonePeMerchantId = process.env.PHONEPE_MERCHANT_ID || '';
    this.phonePeSaltKey = process.env.PHONEPE_SALT_KEY || '';
  }

  // Create Razorpay order - Razorpay order create करना
  async createRazorpayOrder(amount, currency = 'INR', receipt) {
    try {
      // In production, use actual Razorpay SDK
      const orderId = 'order_' + crypto.randomBytes(12).toString('hex');
      
      const order = {
        id: orderId,
        entity: 'order',
        amount: amount * 100, // Convert to paise
        amount_paid: 0,
        amount_due: amount * 100,
        currency,
        receipt,
        status: 'created',
        attempts: 0,
        created_at: Math.floor(Date.now() / 1000)
      };

      console.log('Razorpay order created:', order);
      return order;

    } catch (error) {
      console.error('Razorpay order creation failed:', error);
      throw new Error('Failed to create payment order');
    }
  }

  // Verify Razorpay payment - Razorpay payment verify करना
  verifyRazorpayPayment(orderId, paymentId, signature) {
    try {
      const text = orderId + '|' + paymentId;
      const generated_signature = crypto
        .createHmac('sha256', this.razorpayKeySecret)
        .update(text)
        .digest('hex');

      return generated_signature === signature;

    } catch (error) {
      console.error('Payment verification failed:', error);
      return false;
    }
  }

  // Create PhonePe payment - PhonePe payment create करना
  async createPhonePePayment(amount, orderId, userPhone) {
    try {
      const payload = {
        merchantId: this.phonePeMerchantId,
        merchantTransactionId: orderId,
        merchantUserId: userPhone,
        amount: amount * 100, // Convert to paise
        redirectUrl: `${process.env.FRONTEND_URL}/payment-success`,
        redirectMode: 'REDIRECT',
        callbackUrl: `${process.env.BACKEND_URL}/api/payments/phonepe-callback`,
        mobileNumber: userPhone,
        paymentInstrument: {
          type: 'PAY_PAGE'
        }
      };

      // Generate checksum
      const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');
      const checksum = crypto
        .createHash('sha256')
        .update(base64Payload + '/pg/v1/pay' + this.phonePeSaltKey)
        .digest('hex') + '###1';

      return {
        payload: base64Payload,
        checksum,
        url: 'https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay'
      };

    } catch (error) {
      console.error('PhonePe payment creation failed:', error);
      throw new Error('Failed to create PhonePe payment');
    }
  }

  // Verify PhonePe payment - PhonePe payment verify करना
  verifyPhonePePayment(response, checksum) {
    try {
      const calculatedChecksum = crypto
        .createHash('sha256')
        .update(response + this.phonePeSaltKey)
        .digest('hex') + '###1';

      return calculatedChecksum === checksum;

    } catch (error) {
      console.error('PhonePe verification failed:', error);
      return false;
    }
  }

  // Process refund - Refund process करना
  async processRefund(paymentId, amount, reason) {
    try {
      const refundId = 'rfnd_' + crypto.randomBytes(12).toString('hex');
      
      const refund = {
        id: refundId,
        entity: 'refund',
        amount: amount * 100,
        currency: 'INR',
        payment_id: paymentId,
        notes: {
          reason: reason || 'Customer request'
        },
        receipt: null,
        acquirer_data: {
          arn: null
        },
        created_at: Math.floor(Date.now() / 1000),
        batch_id: null,
        status: 'processed',
        speed_processed: 'normal'
      };

      console.log('Refund processed:', refund);
      return refund;

    } catch (error) {
      console.error('Refund processing failed:', error);
      throw new Error('Failed to process refund');
    }
  }

  // Generate payment receipt - Payment receipt generate करना
  generateReceipt(order, payment) {
    return {
      receiptNumber: `RCP${Date.now()}`,
      orderNumber: order.orderNumber,
      date: new Date().toISOString(),
      amount: payment.amount,
      paymentMethod: payment.method,
      status: payment.status,
      transactionId: payment.id
    };
  }

  // Validate payment amount - Payment amount validate करना
  validatePaymentAmount(orderAmount, paidAmount) {
    return Math.abs(orderAmount - paidAmount) < 1; // Allow 1 rupee difference
  }

  // Get payment status - Payment status get करना
  async getPaymentStatus(paymentId) {
    try {
      // In production, fetch from actual gateway
      return {
        id: paymentId,
        status: 'captured',
        amount: 0,
        method: 'upi',
        captured: true,
        created_at: Date.now()
      };

    } catch (error) {
      console.error('Failed to get payment status:', error);
      throw new Error('Failed to fetch payment status');
    }
  }
}

module.exports = new PaymentService();
