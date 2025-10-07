// Chandra Dukan App - Main Application File
// Modern modular grocery delivery app

class ChandraDukanApp {
    this.components = {};
    this.services = {};
    this.isInitialized = false;
  }

  // Initialize app - App initialize करना
  async init() {
    if (this.isInitialized) return;

    try {
      // Check authentication status
      this.checkAuthStatus();
      
      // Initialize services first
      await this.initializeServices();
      
      // Initialize components
      await this.initializeComponents();
      
      // Setup event listeners
      this.setupEventListeners();
      
      // Load initial data
      this.loadInitialData();
      
      this.isInitialized = true;
      console.log('Chandra Dukan App initialized successfully!');
      
    } catch (error) {
      console.error('Error initializing app:', error);
    }
  }

  // Check authentication status - Authentication check करना
  checkAuthStatus() {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      const user = JSON.parse(userData);
      // Show user menu
      const guestMenu = document.getElementById('guestMenu');
      const userMenu = document.getElementById('userMenu');
      const userMenuName = document.getElementById('userMenuName');
      
      if (guestMenu) guestMenu.style.display = 'none';
      if (userMenu) userMenu.style.display = 'block';
      if (userMenuName) userMenuName.textContent = user.name;
    }
  }

  // Initialize services - Services initialize करना
  async initializeServices() {
    // Services are already initialized when imported
    this.services = {
      cart: window.CartService,
      notification: window.NotificationService,
      data: window.DataService
    };
  }

  // Initialize components - Components initialize करना
  async initializeComponents() {
    // Initialize all components
    this.components.header = new window.Header();
    this.components.searchBar = new window.SearchBar();
    this.components.cartModal = new window.CartModal();
    this.components.checkoutModal = new window.CheckoutModal();
    this.components.orderConfirmModal = new window.OrderConfirmModal();
    this.components.dashboard = new window.Dashboard();

    // Initialize each component
    Object.values(this.components).forEach(component => {
      if (component.init) {
        component.init();
      }
    });
  }

  // Setup event listeners - Event listeners setup करना
  setupEventListeners() {
    // Product update event
    document.addEventListener('productUpdate', (e) => {
      this.handleProductUpdate(e.detail);
    });

    // Data change event
    document.addEventListener('dataChanged', (e) => {
      this.handleDataChange(e.detail);
    });

    // Cart update event
    this.services.cart.addListener((cartData) => {
      this.handleCartUpdate(cartData);
    });

    // Online/offline status
    window.addEventListener('online', () => {
      this.showNotification('You are back online!', 'success');
    });

    window.addEventListener('offline', () => {
      this.showNotification('You are offline. Some features may not work.', 'warning');
    });
  }

  // Load initial data - Initial data load करना
  loadInitialData() {
    // Render categories
    this.renderCategories();
    this.renderCategoryStrip();
    
    // Render products
    this.renderProducts();
    
    // Update cart badge
    this.updateCartBadge();
  }

  // Render category strip (horizontal) like Blinkit
  renderCategoryStrip() {
    const strip = document.getElementById('categoryStrip');
    if (!strip) return;
    const categories = this.services.data.getCategories();
    strip.innerHTML = '';
    categories.forEach(category => {
      const chip = document.createElement('button');
      chip.className = 'category-chip';
      chip.innerHTML = `
        <span class="category-chip__icon">${category.icon}</span>
        <span class="category-chip__text">${category.name}</span>
      `;
      chip.addEventListener('click', () => {
        this.filterByCategory(category.id);
        const categoriesTitle = document.getElementById('productsTitle');
        if (categoriesTitle) categoriesTitle.textContent = category.name;
      });
      strip.appendChild(chip);
    });
  }

  // Handle product update - Product update handle करना
  handleProductUpdate(detail) {
    this.renderProducts(detail);
  }

  // Handle data change - Data change handle करना
  handleDataChange(detail) {
    // Re-render components that depend on data
    this.renderCategories();
    this.renderProducts();
  }

  // Handle cart update - Cart update handle करना
  handleCartUpdate(cartData) {
    this.updateCartBadge(cartData.count);
    
    // Update product quantity displays
    this.updateProductQuantityDisplays();
  }

  // Render categories - Categories render करना
  renderCategories() {
    const categoriesGrid = document.getElementById('categoriesGrid');
    if (!categoriesGrid) return;

    const categories = this.services.data.getCategories();
    categoriesGrid.innerHTML = '';

    categories.forEach(category => {
      const categoryCard = this.createCategoryCard(category);
      categoriesGrid.appendChild(categoryCard);
    });
  }

  // Create category card - Category card create करना
  createCategoryCard(category) {
    const card = document.createElement('div');
    card.className = 'category-card fade-in';
    card.innerHTML = `
      <div class="category-icon">${category.icon}</div>
      <div class="category-name">${category.name}</div>
      <div class="category-hindi">${category.hindi_name}</div>
    `;
    
    card.addEventListener('click', () => {
      this.filterByCategory(category.id);
    });
    
    return card;
  }

  // Filter by category - Category से filter करना
  filterByCategory(categoryId) {
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
      categoryFilter.value = categoryId;
    }
    
    // Trigger product update
    const event = new CustomEvent('productUpdate', {
      detail: { category: categoryId.toString() }
    });
    document.dispatchEvent(event);
  }

  // Render products - Products render करना
  renderProducts(filters = {}) {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;

    const normalized = {
      search: filters.search,
      sort: filters.sort,
      category: filters.category || filters.filter
    };
    const products = this.services.data.getProducts(normalized);
    productsGrid.innerHTML = '';

    if (products.length === 0) {
      productsGrid.innerHTML = `
        <div class="no-products">
          <div style="font-size: var(--font-size-4xl); margin-bottom: var(--space-16);">📦</div>
          <p>कोई product नहीं मिला</p>
        </div>
      `;
      return;
    }

    products.forEach(product => {
      const productCard = new window.ProductCard(product);
      const cardElement = productCard.create();
      productsGrid.insertAdjacentHTML('beforeend', cardElement);
    });

    // Update quantity displays
    this.updateProductQuantityDisplays();
  }

  // Update product quantity displays - Product quantity displays update करना
  updateProductQuantityDisplays() {
    const cart = this.services.cart.getCart();
    
    cart.forEach(cartItem => {
      const quantityDisplay = document.getElementById(`quantity-${cartItem.id}`);
      if (quantityDisplay) {
        quantityDisplay.textContent = cartItem.quantity;
      }
    });
  }

  // Update cart badge - Cart badge update करना
  updateCartBadge(count) {
    if (this.components.header) {
      this.components.header.updateCartBadge(count);
    }
  }

  // Show notification - Notification show करना
  showNotification(message, type = 'info') {
    if (this.services.notification) {
      this.services.notification.sendPushNotification('Chandra Dukan', message);
    }
  }

  // Get app state - App state get करना
  getAppState() {
    return {
      cart: this.services.cart.getCart(),
      cartTotal: this.services.cart.getCartTotal(),
      cartCount: this.services.cart.getCartItemCount(),
      products: this.services.data.getProducts(),
      categories: this.services.data.getCategories(),
      orders: this.services.data.getOrders()
    };
  }

  // Export app data - App data export करना
  exportAppData() {
    this.services.data.exportData();
  }

  // Import app data - App data import करना
  importAppData(file) {
    this.services.data.importData(file);
  }

  // Clear app data - App data clear करना
  clearAppData() {
    this.services.data.clearAllData();
  }

  // Test notification - Test notification भेजना
  testNotification() {
    if (this.services.notification) {
      this.services.notification.testNotification();
    }
  }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
  // Create global app instance
  window.ChandraDukanApp = new ChandraDukanApp();
  
  // Initialize the app
  await window.ChandraDukanApp.init();
});

// Make app globally available
window.app = window.ChandraDukanApp;