// Payment Integration - Payment processing
// Razorpay, PhonePe, और COD के लिए

const API_URL = 'http://localhost:3000/api';

class PaymentHandler {
  constructor() {
    this.razorpayLoaded = false;
  }

  // Load Razorpay script - Razorpay script load करना
  loadRazorpay() {
    return new Promise((resolve) => {
      if (this.razorpayLoaded) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        this.razorpayLoaded = true;
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  }

  // Process Razorpay payment - Razorpay payment process करना
  async processRazorpay(orderId, amount, orderDetails) {
    try {
      const token = localStorage.getItem('authToken');
      const user = JSON.parse(localStorage.getItem('userData'));

      // Load Razorpay
      const loaded = await this.loadRazorpay();
      if (!loaded) {
        throw new Error('Failed to load Razorpay');
      }

      // Create Razorpay order
      const response = await fetch(`${API_URL}/payments/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount,
          orderId
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to create payment order');
      }

      // Razorpay options
      const options = {
        key: data.data.keyId,
        amount: data.data.amount,
        currency: data.data.currency,
        name: 'Chandra Dukan',
        description: `Order #${orderDetails.orderNumber}`,
        order_id: data.data.orderId,
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone
        },
        theme: {
          color: '#6366F1'
        },
        handler: async (response) => {
          await this.verifyPayment(response, orderId);
        },
        modal: {
          ondismiss: () => {
            alert('Payment cancelled');
          }
        }
      };

      const razorpay = new Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error('Razorpay payment error:', error);
      alert('Payment failed: ' + error.message);
    }
  }

  // Verify payment - Payment verify करना
  async verifyPayment(razorpayResponse, orderId) {
    try {
      const token = localStorage.getItem('authToken');

      const response = await fetch(`${API_URL}/payments/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          razorpay_order_id: razorpayResponse.razorpay_order_id,
          razorpay_payment_id: razorpayResponse.razorpay_payment_id,
          razorpay_signature: razorpayResponse.razorpay_signature,
          orderId
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Payment successful
        window.location.href = `payment-success.html?orderId=${orderId}&paymentId=${razorpayResponse.razorpay_payment_id}`;
      } else {
        alert('Payment verification failed');
      }

    } catch (error) {
      console.error('Payment verification error:', error);
      alert('Payment verification failed');
    }
  }

  // Process PhonePe payment - PhonePe payment process करना
  async processPhonePe(orderId, amount) {
    try {
      const token = localStorage.getItem('authToken');

      const response = await fetch(`${API_URL}/payments/phonepe/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount,
          orderId
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Redirect to PhonePe
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = data.data.url;

        const payloadInput = document.createElement('input');
        payloadInput.type = 'hidden';
        payloadInput.name = 'request';
        payloadInput.value = data.data.payload;
        form.appendChild(payloadInput);

        const checksumInput = document.createElement('input');
        checksumInput.type = 'hidden';
        checksumInput.name = 'checksum';
        checksumInput.value = data.data.checksum;
        form.appendChild(checksumInput);

        document.body.appendChild(form);
        form.submit();
      } else {
        throw new Error(data.error || 'Failed to create PhonePe payment');
      }

    } catch (error) {
      console.error('PhonePe payment error:', error);
      alert('Payment failed: ' + error.message);
    }
  }

  // Process COD order - COD order process करना
  async processCOD(orderId) {
    try {
      const token = localStorage.getItem('authToken');

      const response = await fetch(`${API_URL}/payments/cod-confirm`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ orderId })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        window.location.href = `order-confirmation.html?orderId=${orderId}`;
      } else {
        throw new Error(data.error || 'Failed to confirm COD order');
      }

    } catch (error) {
      console.error('COD confirmation error:', error);
      alert('Order confirmation failed: ' + error.message);
    }
  }

  // Show payment options - Payment options show करना
  showPaymentOptions(orderId, amount, orderDetails) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
      <div class="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
        <h2 class="text-2xl font-bold mb-4">Select Payment Method</h2>
        <p class="text-gray-600 mb-6">Amount to pay: <span class="font-bold text-indigo-600">₹${amount}</span></p>
        
        <div class="space-y-3">
          <button onclick="paymentHandler.processRazorpay('${orderId}', ${amount}, ${JSON.stringify(orderDetails).replace(/"/g, '&quot;')})" 
                  class="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition">
            💳 Pay with UPI/Card/Wallet
          </button>
          
          <button onclick="paymentHandler.processPhonePe('${orderId}', ${amount})" 
                  class="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition">
            📱 Pay with PhonePe
          </button>
          
          <button onclick="paymentHandler.processCOD('${orderId}')" 
                  class="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition">
            💵 Cash on Delivery
          </button>
          
          <button onclick="this.closest('.fixed').remove()" 
                  class="w-full bg-gray-200 text-gray-800 py-3 rounded-lg hover:bg-gray-300 transition">
            Cancel
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
  }
}

// Create global instance
const paymentHandler = new PaymentHandler();
