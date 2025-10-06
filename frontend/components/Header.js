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
    // Header removed as requested
    this.cartBadge = null;
  }

  // Setup event listeners
  setupEventListeners() {
    const cartIcon = document.getElementById('cartIcon');
    const dashboardToggle = document.getElementById('dashboardToggle');
    const loginBtn = document.getElementById('loginBtn');
    
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

    if (loginBtn) {
      loginBtn.addEventListener('click', () => {
        window.location.href = 'login.html';
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