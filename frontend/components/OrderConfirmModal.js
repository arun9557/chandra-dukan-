// OrderConfirmModal Component - Premium order confirmation with tracking

class OrderConfirmModal {
  constructor() {
    this.isOpen = false;
  }

  // Initialize order confirm modal
  init() {
    this.render();
    this.setupEventListeners();
  }

  // Render order confirm modal HTML
  render() {
    const confirmHTML = `
      <div class="modal hidden" id="orderConfirmModal">
        <div class="modal-content">
          <div class="modal-header">
            <h3>🎉 Order Confirmed!</h3>
          </div>
          <div class="modal-body">
            <div class="order-success">
              <div class="success-icon">✅</div>
              <div class="success-message">
                <h3>Thank You!</h3>
                <p>Your order has been successfully placed.</p>
                <p>Order ID: <strong><span id="orderId"></span></strong></p>
                <p>Estimated Delivery: <strong>30-60 minutes</strong></p>
                <p>Payment Method: <span id="paymentMethod"></span></p>
              </div>
              <div class="order-tracking">
                <h4>Order Status</h4>
                <div class="tracking-steps">
                  <div class="tracking-step active" id="step-0">
                    <div class="step-icon">✅</div>
                    <div class="step-text">Order Placed</div>
                  </div>
                  <div class="tracking-step" id="step-1">
                    <div class="step-icon">📦</div>
                    <div class="step-text">Packing</div>
                  </div>
                  <div class="tracking-step" id="step-2">
                    <div class="step-icon">🚚</div>
                    <div class="step-text">Out for Delivery</div>
                  </div>
                  <div class="tracking-step" id="step-3">
                    <div class="step-icon">🏠</div>
                    <div class="step-text">Delivered</div>
                  </div>
                </div>
              </div>
              <div class="order-actions">
                <button class="btn btn--primary" id="trackOrderBtn">
                  Track Order
                </button>
                <button class="btn btn--outline" id="shareOrderBtn">
                  Share Order
                </button>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn--secondary" id="closeOrderConfirmBtn">
              Continue Shopping
            </button>
            <a href="tel:+919876543210" class="btn btn--primary">
              📞 Call Store
            </a>
          </div>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', confirmHTML);
  }

  // Setup event listeners
  setupEventListeners() {
    const closeBtn = document.getElementById('closeOrderConfirmBtn');
    const trackBtn = document.getElementById('trackOrderBtn');
    const shareBtn = document.getElementById('shareOrderBtn');

    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.close());
    }

    // Close modal when clicking outside
    document.addEventListener('click', (e) => {
      const modal = document.getElementById('orderConfirmModal');
      if (this.isOpen && modal && e.target === modal) {
        this.close();
      }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
      if (this.isOpen && e.key === 'Escape') {
        this.close();
      }
    });

    if (trackBtn) {
      trackBtn.addEventListener('click', () => this.trackOrder());
    }

    if (shareBtn) {
      shareBtn.addEventListener('click', () => this.shareOrder());
    }
  }

  // Show order confirmation
  show(orderData) {
    const modal = document.getElementById('orderConfirmModal');
    if (modal) {
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      this.isOpen = true;
      
      // Update order details
      this.updateOrderDetails(orderData);
      
      // Start order tracking simulation
      this.startOrderTracking();
    }
  }

  // Close order confirm modal
  close() {
    const modal = document.getElementById('orderConfirmModal');
    if (modal) {
      modal.classList.add('hidden');
      document.body.style.overflow = 'auto';
      this.isOpen = false;
    }
  }

  // Update order details
  updateOrderDetails(orderData) {
    const orderIdEl = document.getElementById('orderId');
    const paymentMethodEl = document.getElementById('paymentMethod');
    
    if (orderIdEl) {
      orderIdEl.textContent = orderData.id;
    }
    
    if (paymentMethodEl) {
      const paymentMethods = {
        'cod': 'Cash on Delivery',
        'upi': 'UPI Payment',
        'phonepe': 'PhonePe',
        'gpay': 'Google Pay'
      };
      paymentMethodEl.textContent = paymentMethods[orderData.payment] || orderData.payment;
    }
  }

  // Start order tracking
  startOrderTracking() {
    // Reset all steps
    document.querySelectorAll('.tracking-step').forEach((step, index) => {
      if (index === 0) {
        step.classList.add('active');
      } else {
        step.classList.remove('active');
      }
    });

    // Simulate order progress
    setTimeout(() => this.updateOrderStatus(1), 3000);
    setTimeout(() => this.updateOrderStatus(2), 8000);
    setTimeout(() => this.updateOrderStatus(3), 15000);
  }

  // Update order status
  updateOrderStatus(step) {
    const steps = document.querySelectorAll('.tracking-step');
    if (steps[step]) {
      steps[step].classList.add('active');
      
      // Add notification for status change
      const statusMessages = [
        'Order Placed',
        'Packing Started',
        'Out for Delivery',
        'Delivered'
      ];
      
      if (window.Notification && Notification.permission === 'granted') {
        new Notification(`Order Update: ${statusMessages[step]}`, {
          body: 'Your order status has been updated',
          icon: '/favicon.ico'
        });
      }
    }
  }

  // Track order
  trackOrder() {
    const orderId = document.getElementById('orderId')?.textContent;
    if (orderId) {
      // In a real app, this would open a tracking page
      alert(`Tracking Order: ${orderId}\n\nCurrent Status: Order Placed\nEstimated Delivery: 30-60 minutes`);
    }
  }

  // Share order
  shareOrder() {
    const orderId = document.getElementById('orderId')?.textContent;
    if (orderId && navigator.share) {
      navigator.share({
        title: 'My Order from Chandra Dukan',
        text: `Order ID: ${orderId}\nEstimated Delivery: 30-60 minutes`,
        url: window.location.href
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      const shareText = `Order ID: ${orderId}\nEstimated Delivery: 30-60 minutes\nFrom Chandra Dukan`;
      navigator.clipboard.writeText(shareText).then(() => {
        alert('Order details copied to clipboard!');
      });
    }
  }
}

// Export for use in main app
window.OrderConfirmModal = OrderConfirmModal;