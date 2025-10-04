// CartModal Component - Cart modal का component
// Shopping cart with item management and checkout

class CartModal {
  constructor() {
    this.isOpen = false;
    this.cart = [];
  }

  // Initialize cart modal - Cart modal initialize करना
  init() {
    this.render();
    this.setupEventListeners();
  }

  // Render cart modal HTML - Cart modal का HTML render करना
  render() {
    const cartHTML = `
      <div class="modal hidden" id="cartModal">
        <div class="modal-backdrop" id="cartModalBackdrop"></div>
        <div class="modal-content">
          <div class="modal-header">
            <h3>आपकी Shopping Cart 🛒</h3>
            <button class="modal-close" id="closeCartModal">×</button>
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
              Shopping जारी रखें
            </button>
            <button class="btn btn--primary" id="checkoutBtn">
              Checkout करें
            </button>
          </div>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', cartHTML);
  }

  // Setup event listeners - Event listeners setup करना
  setupEventListeners() {
    const closeBtn = document.getElementById('closeCartModal');
    const backdrop = document.getElementById('cartModalBackdrop');
    const continueBtn = document.getElementById('continueShoppingBtn');
    const checkoutBtn = document.getElementById('checkoutBtn');

    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.close());
    }

    if (backdrop) {
      backdrop.addEventListener('click', () => this.close());
    }

    if (continueBtn) {
      continueBtn.addEventListener('click', () => this.close());
    }

    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => this.proceedToCheckout());
    }
  }

  // Open cart modal - Cart modal open करना
  open() {
    const modal = document.getElementById('cartModal');
    if (modal) {
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      this.isOpen = true;
      this.renderCartItems();
    }
  }

  // Close cart modal - Cart modal close करना
  close() {
    const modal = document.getElementById('cartModal');
    if (modal) {
      modal.classList.add('hidden');
      document.body.style.overflow = 'auto';
      this.isOpen = false;
    }
  }

  // Render cart items - Cart items render करना
  renderCartItems() {
    const cartItems = document.getElementById('cartItems');
    if (!cartItems) return;

    // Get cart from service
    this.cart = window.CartService?.getCart() || [];

    if (this.cart.length === 0) {
      cartItems.innerHTML = `
        <div class="empty-cart">
          <div class="empty-cart-icon">🛒</div>
          <p>आपकी cart खाली है</p>
          <p>Shopping करने के लिए products add करें</p>
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

  // Create cart item element - Cart item element create करना
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
          <button class="quantity-btn" onclick="CartModal.updateQuantity(${item.id}, -1)">−</button>
          <span class="quantity-display">${item.quantity}</span>
          <button class="quantity-btn" onclick="CartModal.updateQuantity(${item.id}, 1)">+</button>
        </div>
        <button class="remove-item" onclick="CartModal.removeItem(${item.id})">
          Remove
        </button>
      </div>
    `;
    return itemElement;
  }

  // Update cart totals - Cart totals update करना
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

  // Update checkout button - Checkout button update करना
  updateCheckoutButton(enabled) {
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
      checkoutBtn.disabled = !enabled;
      checkoutBtn.style.opacity = enabled ? '1' : '0.5';
    }
  }

  // Proceed to checkout - Checkout proceed करना
  proceedToCheckout() {
    if (this.cart.length === 0) {
      alert('आपकी cart खाली है। पहले कुछ items add करें।');
      return;
    }

    const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (total < 100) {
      alert(`Minimum order amount ₹100 होना चाहिए। Current total: ₹${total}`);
      return;
    }

    this.close();
    if (window.CheckoutModal) {
      window.CheckoutModal.open();
    }
  }

  // Update quantity - Quantity update करना
  static updateQuantity(productId, change) {
    if (window.CartService) {
      window.CartService.updateQuantity(productId, change);
      // Refresh cart display
      if (window.CartModal && window.CartModal.isOpen) {
        window.CartModal.renderCartItems();
      }
    }
  }

  // Remove item - Item remove करना
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
