// CartService - Cart management service
// Cart का management service

class CartService {
  constructor() {
    this.cart = [];
    this.listeners = [];
    this.init();
  }

  // Initialize cart service - Cart service initialize करना
  init() {
    this.loadCartFromStorage();
    this.setupStorageListener();
  }

  // Load cart from localStorage - Cart को localStorage से load करना
  loadCartFromStorage() {
    const savedCart = localStorage.getItem('chandraDukanCart');
    if (savedCart) {
      this.cart = JSON.parse(savedCart);
    }
    this.notifyListeners();
  }

  // Save cart to localStorage - Cart को localStorage में save करना
  saveCartToStorage() {
    localStorage.setItem('chandraDukanCart', JSON.stringify(this.cart));
  }

  // Setup storage listener - Storage listener setup करना
  setupStorageListener() {
    window.addEventListener('storage', (e) => {
      if (e.key === 'chandraDukanCart') {
        this.loadCartFromStorage();
      }
    });
  }

  // Add item to cart - Cart में item add करना
  addItem(productId) {
    const product = this.getProductById(productId);
    if (!product || product.stock === 0) {
      this.showNotification('Product out of stock!', 'error');
      return false;
    }

    const existingItem = this.cart.find(item => item.id === productId);
    
    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        existingItem.quantity += 1;
      } else {
        this.showNotification('Maximum stock reached!', 'warning');
        return false;
      }
    } else {
      this.cart.push({
        id: productId,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image,
        category_id: product.category_id
      });
    }

    this.saveCartToStorage();
    this.notifyListeners();
    this.showNotification('Item added to cart!', 'success');
    return true;
  }

  // Update item quantity - Item quantity update करना
  updateQuantity(productId, change) {
    const cartItem = this.cart.find(item => item.id === productId);
    const product = this.getProductById(productId);
    
    if (!cartItem || !product) return;

    const newQuantity = cartItem.quantity + change;
    
    if (newQuantity <= 0) {
      this.removeItem(productId);
      return;
    }
    
    if (newQuantity > product.stock) {
      this.showNotification('Not enough stock available!', 'warning');
      return;
    }

    cartItem.quantity = newQuantity;
    this.saveCartToStorage();
    this.notifyListeners();
  }

  // Remove item from cart - Cart से item remove करना
  removeItem(productId) {
    this.cart = this.cart.filter(item => item.id !== productId);
    this.saveCartToStorage();
    this.notifyListeners();
    this.showNotification('Item removed from cart!', 'info');
  }

  // Clear cart - Cart clear करना
  clearCart() {
    this.cart = [];
    this.saveCartToStorage();
    this.notifyListeners();
  }

  // Get cart - Cart get करना
  getCart() {
    return [...this.cart];
  }

  // Get cart total - Cart total get करना
  getCartTotal() {
    return this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  // Get cart item count - Cart item count get करना
  getCartItemCount() {
    return this.cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  // Get product by ID - Product को ID से get करना
  getProductById(productId) {
    if (window.AppData && window.AppData.products) {
      return window.AppData.products.find(p => p.id === productId);
    }
    return null;
  }

  // Add listener - Listener add करना
  addListener(callback) {
    this.listeners.push(callback);
  }

  // Remove listener - Listener remove करना
  removeListener(callback) {
    this.listeners = this.listeners.filter(listener => listener !== callback);
  }

  // Notify listeners - Listeners को notify करना
  notifyListeners() {
    this.listeners.forEach(callback => {
      callback({
        cart: this.cart,
        total: this.getCartTotal(),
        count: this.getCartItemCount()
      });
    });
  }

  // Show notification - Notification show करना
  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <span class="notification-icon">
          ${type === 'success' ? '✅' : type === 'error' ? '❌' : type === 'warning' ? '⚠️' : 'ℹ️'}
        </span>
        <span class="notification-message">${message}</span>
      </div>
    `;

    // Add to page
    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => {
      notification.classList.add('notification--show');
    }, 100);

    // Remove notification
    setTimeout(() => {
      notification.classList.remove('notification--show');
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }

  // Validate cart - Cart validate करना
  validateCart() {
    const errors = [];
    
    if (this.cart.length === 0) {
      errors.push('Cart is empty');
    }

    const total = this.getCartTotal();
    if (total < 100) {
      errors.push(`Minimum order amount is ₹100. Current total: ₹${total}`);
    }

    // Check stock availability
    this.cart.forEach(item => {
      const product = this.getProductById(item.id);
      if (product && item.quantity > product.stock) {
        errors.push(`${item.name} - Only ${product.stock} available`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  // Get cart summary - Cart summary get करना
  getCartSummary() {
    return {
      items: this.cart,
      total: this.getCartTotal(),
      count: this.getCartItemCount(),
      deliveryCharges: this.getCartTotal() >= 200 ? 0 : 30,
      finalTotal: this.getCartTotal() + (this.getCartTotal() >= 200 ? 0 : 30)
    };
  }
}

// Export for use in main app
window.CartService = new CartService();
