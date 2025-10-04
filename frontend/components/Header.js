// Header Component - Premium header with store info and cart

class Header {
  constructor() {
    this.cart = [];
    this.cartBadge = null;
  }

  // Initialize header
  init() {
    this.render();
    this.setupEventListeners();
  }

  // Render header HTML
  render() {
    const headerHTML = `
      <header class="header">
        <div class="container">
          <div class="header-content">
            <div class="store-info">
              <h1 class="store-name">🏪 Chandra Dukan</h1>
              <p class="store-tagline">Premium Grocery Delivery to Your Doorstep</p>
            </div>
            <div class="header-actions">
              <div class="cart-icon" id="cartIcon" role="button" tabindex="0" aria-label="Shopping cart">
                🛒 <span class="cart-badge" id="cartBadge">0</span>
              </div>
              <button class="btn btn--outline dashboard-toggle" id="dashboardToggle">
                📊 Dashboard
              </button>
            </div>
          </div>
          <div class="store-status">
            <span class="status status--success">Open • 7:00 AM - 10:00 PM</span>
            <span class="delivery-info">🚚 Free Delivery up to 4-5 km for orders ₹200+</span>
          </div>
        </div>
      </header>
    `;
    
    // Insert header at the beginning of body
    document.body.insertAdjacentHTML('afterbegin', headerHTML);
    this.cartBadge = document.getElementById('cartBadge');
  }

  // Setup event listeners
  setupEventListeners() {
    const cartIcon = document.getElementById('cartIcon');
    const dashboardToggle = document.getElementById('dashboardToggle');
    
    if (cartIcon) {
      cartIcon.addEventListener('click', () => {
        window.CartModal.open();
      });
      
      // Add keyboard support
      cartIcon.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          window.CartModal.open();
        }
      });
    }
    
    if (dashboardToggle) {
      dashboardToggle.addEventListener('click', () => {
        window.Dashboard.open();
      });
    }
  }

  // Update cart badge
  updateCartBadge(count) {
    if (this.cartBadge) {
      this.cartBadge.textContent = count;
      this.cartBadge.style.display = count > 0 ? 'flex' : 'none';
    }
  }
}

// Export for use in main app
window.Header = Header;