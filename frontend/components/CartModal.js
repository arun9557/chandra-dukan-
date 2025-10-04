// CartModal Component - Premium shopping cart with item management and checkout

class CartModal {
  constructor() {
    this.isOpen = false;
    this.cart = [];
  }

  // Initialize cart modal
  init() {
    this.render();
    this.setupEventListeners();
  }

  // Render cart modal HTML
  render() {
    const cartHTML = `
      <div class="modal hidden" id="cartModal">
        <div class="modal-content">
          <div class="modal-header">
            <h3>Your Shopping Cart 🛒</h3>
            <button class="modal-close" id="closeCartModal" aria-label="Close cart">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <div id="cartItems">
              <!-- Cart items will be loaded here -->
            </div>
            <div class="cart-summary">
              <div class="summary-row">
                <span>Subtotal:</span>
                <span>₹<span id="cartSubtotal">0</span></span>
              </div>
              <div class="summary-row">
                <span>Delivery Charges:</span>
                <span id="deliveryCharges">Free</span>
              </div>
              <div class="summary-row total">
                <span><strong>Total:</strong></span>
                <span><strong>₹<span id="cartTotal">0</span></strong></span>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn--secondary" id="continueShoppingBtn">
              Continue Shopping
            </button>
            <button class="btn btn--primary" id="checkoutBtn">
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', cartHTML);
  }

  // Setup event listeners
  setupEventListeners() {
    const closeBtn = document.getElementById('closeCartModal');
    const continueBtn = document.getElementById('continueShoppingBtn');
    const checkoutBtn = document.getElementById('checkoutBtn');

    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.close());
    }

    // Close modal when clicking outside
    document.addEventListener('click', (e) => {
      const modal = document.getElementById('cartModal');
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

    if (continueBtn) {
      continueBtn.addEventListener('click', () => this.close());
    }

    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => this.proceedToCheckout());
    }
  }

  // Open cart modal
  open() {
    const modal = document.getElementById('cartModal');
    if (modal) {
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      this.isOpen = true;
      this.renderCartItems();
    }
  }

  // Close cart modal
  close() {
    const modal = document.getElementById('cartModal');
    if (modal) {
      modal.classList.add('hidden');
      document.body.style.overflow = 'auto';
      this.isOpen = false;
    }
  }

  // Render cart items
  renderCartItems() {
    const cartItems = document.getElementById('cartItems');
    if (!cartItems) return;

    // Get cart from service
    this.cart = window.CartService?.getCart() || [];

    if (this.cart.length === 0) {
      cartItems.innerHTML = `
        <div class="empty-cart">
          <div class="empty-cart-icon">🛒</div>
          <h3>Your cart is empty</h3>
          <p>Add some products to your cart to get started</p>
        </div>
      `;
      this.updateCheckoutButton(false);
    } else {
      cartItems.innerHTML = '';
      this.cart.forEach(item => {
        const cartItemElement = this.createCartItemElement(item);
        cartItems.appendChild(cartItemElement);
      });
      this.updateCheckoutButton(true);
    }

    this.updateCartTotals();
  }

  // Create cart item element
  createCartItemElement(item) {
    const itemElement = document.createElement('div');
    itemElement.className = 'cart-item';
    itemElement.innerHTML = `
      <div class="cart-item-image">📦</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">₹${item.price} × ${item.quantity} = ₹${item.price * item.quantity}</div>
      </div>
      <div class="cart-item-controls">
        <div class="quantity-controls">
          <button class="quantity-btn" onclick="CartModal.updateQuantity(${item.id}, -1)" aria-label="Decrease quantity">−</button>
          <span class="quantity-display">${item.quantity}</span>
          <button class="quantity-btn" onclick="CartModal.updateQuantity(${item.id}, 1)" aria-label="Increase quantity">+</button>
        </div>
        <button class="remove-item" onclick="CartModal.removeItem(${item.id})">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 7L18.1327 19.1425C18.0579 20.1891 17.187 21 16.1378 21H7.86224C6.81296 21 5.94208 20.1891 5.86732 19.1425L5 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M10 11V17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M14 11V17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M15 7V4C15 3.44772 14.5523 3 14 3H10C9.44772 3 9 3.44772 9 4V7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Remove
        </button>
      </div>
    `;
    return itemElement;
  }

  // Update cart totals
  updateCartTotals() {
    const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryCharges = subtotal >= 200 ? 0 : 30;
    const total = subtotal + deliveryCharges;

    const subtotalEl = document.getElementById('cartSubtotal');
    const deliveryEl = document.getElementById('deliveryCharges');
    const totalEl = document.getElementById('cartTotal');

    if (subtotalEl) subtotalEl.textContent = subtotal;
    if (deliveryEl) deliveryEl.textContent = deliveryCharges === 0 ? 'Free' : `₹${deliveryCharges}`;
    if (totalEl) totalEl.textContent = total;
  }

  // Update checkout button
  updateCheckoutButton(enabled) {
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
      checkoutBtn.disabled = !enabled;
    }
  }

  // Proceed to checkout
  proceedToCheckout() {
    if (this.cart.length === 0) {
      alert('Your cart is empty. Please add some items first.');
      return;
    }

    const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (total < 100) {
      alert(`Minimum order amount is ₹100. Current total: ₹${total}`);
      return;
    }

    this.close();
    if (window.CheckoutModal) {
      window.CheckoutModal.open();
    }
  }

  // Update quantity
  static updateQuantity(productId, change) {
    if (window.CartService) {
      window.CartService.updateQuantity(productId, change);
      // Refresh cart display
      if (window.CartModal && window.CartModal.isOpen) {
        window.CartModal.renderCartItems();
      }
    }
  }

  // Remove item
  static removeItem(productId) {
    if (window.CartService) {
      window.CartService.removeItem(productId);
      // Refresh cart display
      if (window.CartModal && window.CartModal.isOpen) {
        window.CartModal.renderCartItems();
      }
    }
  }
}

// Export for use in main app
window.CartModal = CartModal;