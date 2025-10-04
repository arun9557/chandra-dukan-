// CheckoutModal Component - Premium order placement with customer details and payment options

class CheckoutModal {
  constructor() {
    this.isOpen = false;
    this.cart = [];
  }

  // Initialize checkout modal
  init() {
    this.render();
    this.setupEventListeners();
  }

  // Render checkout modal HTML
  render() {
    const checkoutHTML = `
      <div class="modal hidden" id="checkoutModal">
        <div class="modal-content">
          <div class="modal-header">
            <h3>Order Details</h3>
            <button class="modal-close" id="closeCheckoutModal" aria-label="Close checkout">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <form id="checkoutForm">
              <div class="form-group">
                <label class="form-label">Your Name *</label>
                <input type="text" class="form-control" id="customerName" required>
              </div>
              <div class="form-group">
                <label class="form-label">Phone Number *</label>
                <input type="tel" class="form-control" id="customerPhone" 
                       pattern="[0-9]{10}" required>
              </div>
              <div class="form-group">
                <label class="form-label">Full Address *</label>
                <textarea class="form-control" id="customerAddress" rows="3" required></textarea>
              </div>
              <div class="form-group">
                <label class="form-label">Delivery Area *</label>
                <select class="form-control" id="deliveryArea" required>
                  <option value="">Select Area</option>
                  <option value="Main Market Area">Main Market Area</option>
                  <option value="Station Road">Station Road</option>
                  <option value="School Para">School Para</option>
                  <option value="Hospital Chowk">Hospital Chowk</option>
                  <option value="Old Town">Old Town</option>
                  <option value="New Colony">New Colony</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Payment Method *</label>
                <div class="payment-options">
                  <label class="payment-option">
                    <input type="radio" name="payment" value="cod" checked>
                    <span>💵 Cash on Delivery (COD)</span>
                  </label>
                  <label class="payment-option">
                    <input type="radio" name="payment" value="upi">
                    <span>📱 UPI Payment</span>
                  </label>
                  <label class="payment-option">
                    <input type="radio" name="payment" value="phonepe">
                    <span>📲 PhonePe</span>
                  </label>
                  <label class="payment-option">
                    <input type="radio" name="payment" value="gpay">
                    <span>💳 Google Pay</span>
                  </label>
                </div>
              </div>
              <div class="order-summary">
                <h4>Order Summary</h4>
                <div id="checkoutItemsList"></div>
                <div class="summary-row">
                  <span>Subtotal:</span>
                  <span>₹<span id="checkoutSubtotal">0</span></span>
                </div>
                <div class="summary-row">
                  <span>Delivery Charges:</span>
                  <span id="deliveryCharges">Free</span>
                </div>
                <div class="summary-row total">
                  <span><strong>Total Amount:</strong></span>
                  <span><strong>₹<span id="checkoutTotal">0</span></strong></span>
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button class="btn btn--secondary" id="backToCartBtn">
              Back to Cart
            </button>
            <button class="btn btn--primary" id="placeOrderBtn">
              Place Order
            </button>
          </div>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', checkoutHTML);
  }

  // Setup event listeners
  setupEventListeners() {
    const closeBtn = document.getElementById('closeCheckoutModal');
    const backBtn = document.getElementById('backToCartBtn');
    const placeOrderBtn = document.getElementById('placeOrderBtn');

    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.close());
    }

    // Close modal when clicking outside
    document.addEventListener('click', (e) => {
      const modal = document.getElementById('checkoutModal');
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

    if (backBtn) {
      backBtn.addEventListener('click', () => this.backToCart());
    }

    if (placeOrderBtn) {
      placeOrderBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.placeOrder();
      });
    }
  }

  // Open checkout modal
  open() {
    const modal = document.getElementById('checkoutModal');
    if (modal) {
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      this.isOpen = true;
      this.renderCheckoutItems();
      this.updateCheckoutTotals();
    }
  }

  // Close checkout modal
  close() {
    const modal = document.getElementById('checkoutModal');
    if (modal) {
      modal.classList.add('hidden');
      document.body.style.overflow = 'auto';
      this.isOpen = false;
    }
  }

  // Back to cart
  backToCart() {
    this.close();
    if (window.CartModal) {
      window.CartModal.open();
    }
  }

  // Render checkout items
  renderCheckoutItems() {
    const checkoutItemsList = document.getElementById('checkoutItemsList');
    if (!checkoutItemsList) return;

    // Get cart from service
    this.cart = window.CartService?.getCart() || [];
    
    checkoutItemsList.innerHTML = '';
    
    this.cart.forEach(item => {
      const itemElement = document.createElement('div');
      itemElement.className = 'summary-row';
      itemElement.innerHTML = `
        <span>${item.name} × ${item.quantity}</span>
        <span>₹${item.price * item.quantity}</span>
      `;
      checkoutItemsList.appendChild(itemElement);
    });
  }

  // Update checkout totals
  updateCheckoutTotals() {
    const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryCharges = subtotal >= 200 ? 0 : 30;
    const total = subtotal + deliveryCharges;

    const subtotalEl = document.getElementById('checkoutSubtotal');
    const deliveryEl = document.getElementById('deliveryCharges');
    const totalEl = document.getElementById('checkoutTotal');

    if (subtotalEl) subtotalEl.textContent = subtotal;
    if (deliveryEl) deliveryEl.textContent = deliveryCharges === 0 ? 'Free' : `₹${deliveryCharges}`;
    if (totalEl) totalEl.textContent = total;
  }

  // Place order
  placeOrder() {
    const form = document.getElementById('checkoutForm');
    if (!form || !form.checkValidity()) {
      if (form) form.reportValidity();
      return;
    }

    const customerName = document.getElementById('customerName');
    const customerPhone = document.getElementById('customerPhone');
    const customerAddress = document.getElementById('customerAddress');
    const deliveryArea = document.getElementById('deliveryArea');

    if (!customerName.value || !customerPhone.value || !customerAddress.value || !deliveryArea.value) {
      alert('Please fill all required information.');
      return;
    }

    // Validate phone number
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(customerPhone.value)) {
      alert('Please enter a valid 10-digit phone number.');
      return;
    }

    const selectedPayment = document.querySelector('input[name="payment"]:checked');
    
    const orderData = {
      id: this.generateOrderId(),
      customer: {
        name: customerName.value,
        phone: customerPhone.value,
        address: customerAddress.value,
        area: deliveryArea.value
      },
      items: [...this.cart],
      payment: selectedPayment ? selectedPayment.value : 'cod',
      total: this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      status: 'placed',
      timestamp: new Date().toISOString(),
      deliveryRadius: this.checkDeliveryRadius(deliveryArea.value)
    };

    // Simulate order processing
    this.showOrderProcessing();
    
    setTimeout(() => {
      this.processOrder(orderData);
    }, 2000);
  }

  // Show order processing
  showOrderProcessing() {
    const placeOrderBtn = document.getElementById('placeOrderBtn');
    if (placeOrderBtn) {
      placeOrderBtn.disabled = true;
      placeOrderBtn.textContent = 'Processing...';
    }
  }

  // Process order
  processOrder(orderData) {
    // Send notification
    this.sendOrderNotification(orderData);
    
    // Show confirmation
    this.close();
    if (window.OrderConfirmModal) {
      window.OrderConfirmModal.show(orderData);
    }

    // Clear cart
    if (window.CartService) {
      window.CartService.clearCart();
    }

    // Reset form
    const form = document.getElementById('checkoutForm');
    if (form) form.reset();
  }

  // Generate order ID
  generateOrderId() {
    return 'CD' + Date.now().toString().slice(-6);
  }

  // Check delivery radius
  checkDeliveryRadius(area) {
    const deliveryAreas = [
      'Main Market Area', 'Station Road', 'School Para', 
      'Hospital Chowk', 'Old Town', 'New Colony'
    ];
    return deliveryAreas.includes(area);
  }

  // Send order notification
  sendOrderNotification(orderData) {
    // WhatsApp notification
    const message = `🎉 New Order Received!
    
Order ID: ${orderData.id}
Customer: ${orderData.customer.name}
Phone: ${orderData.customer.phone}
Area: ${orderData.customer.area}
Total: ₹${orderData.total}
Payment: ${orderData.payment.toUpperCase()}

Items:
${orderData.items.map(item => `• ${item.name} × ${item.quantity} = ₹${item.price * item.quantity}`).join('\n')}`;

    // Open WhatsApp with pre-filled message
    const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    // Push notification (if supported)
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Order Placed Successfully!', {
        body: `Order ID: ${orderData.id}`,
        icon: '/favicon.ico'
      });
    }
  }
}

// Export for use in main app
window.CheckoutModal = CheckoutModal;