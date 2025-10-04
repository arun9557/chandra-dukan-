// Header Component - Header का component
// Modern Indian e-commerce header with store info and cart

class Header {
  constructor() {
    this.cart = [];
    this.cartBadge = null;
  }

  // Initialize header - Header को initialize करना
  init() {
    this.render();
    this.setupEventListeners();
  }

  // Render header HTML - Header का HTML render करना
  render() {
    const headerHTML = `
      <header class="header">
        <div class="container">
          <div class="header-content">
            <div class="store-info">
              <h1 class="store-name">🏪 Chandra Dukan</h1>
              <p class="store-tagline">आपके घर तक, जल्दी और आसान</p>
            </div>
            <div class="header-actions">
              <div class="cart-icon" id="cartIcon">
                🛒 <span class="cart-badge" id="cartBadge">0</span>
              </div>
              <button class="btn btn--outline dashboard-toggle" id="dashboardToggle">
                📊 Dashboard
              </button>
            </div>
          </div>
          <div class="store-status">
            <span class="status status--success">दुकान खुली है • 7:00 AM - 10:00 PM</span>
            <span class="delivery-info">🚚 4-5 km तक Free Delivery ₹200+ के ऊपर</span>
          </div>
        </div>
      </header>
    `;
    
    // Insert header at the beginning of body
    document.body.insertAdjacentHTML('afterbegin', headerHTML);
    this.cartBadge = document.getElementById('cartBadge');
  }

  // Setup event listeners - Event listeners setup करना
  setupEventListeners() {
    const cartIcon = document.getElementById('cartIcon');
    const dashboardToggle = document.getElementById('dashboardToggle');
    
    if (cartIcon) {
      cartIcon.addEventListener('click', () => {
        window.CartModal.open();
      });
    }
    
    if (dashboardToggle) {
      dashboardToggle.addEventListener('click', () => {
        window.Dashboard.open();
      });
    }
  }

  // Update cart badge - Cart badge update करना
  updateCartBadge(count) {
    if (this.cartBadge) {
      this.cartBadge.textContent = count;
      this.cartBadge.style.display = count > 0 ? 'flex' : 'none';
    }
  }
}

// Export for use in main app
window.Header = Header;
