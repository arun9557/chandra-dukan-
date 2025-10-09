// Modern Cart Manager - Upgraded cart ka JavaScript
// Cart items display, update, calculations aur checkout

class ModernCartManager {
  constructor() {
    this.cart = [];
    this.subtotal = 0;
    this.discount = 0;
    this.deliveryCharge = 40; // Default delivery charge
    this.freeDeliveryThreshold = 500; // Free delivery above ₹500
    this.gstRate = 0.05; // 5% GST
    this.appliedCoupon = null;
    
    this.init();
  }

  // Initialize cart - Cart ko initialize karna
  init() {
    this.loadCart();
    this.renderCart();
    this.updateSummary();
    this.updateDeliveryProgress();
  }

  // Load cart from localStorage - LocalStorage se cart load karna
  loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        this.cart = JSON.parse(savedCart);
      } catch (error) {
        console.error('Error loading cart:', error);
        this.cart = [];
      }
    }
  }

  // Save cart to localStorage - Cart ko save karna
  saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.cart));
  }

  // Render cart items - Cart items ko display karna
  renderCart() {
    const container = document.getElementById('cartItemsContainer');
    const emptyState = document.getElementById('emptyCartState');
    const summarySection = document.getElementById('cartSummary');

    if (this.cart.length === 0) {
      container.style.display = 'none';
      emptyState.style.display = 'block';
      summarySection.style.display = 'none';
      document.getElementById('cartItemCount').textContent = '0 items';
      return;
    }

    container.style.display = 'block';
    emptyState.style.display = 'none';
    summarySection.style.display = 'block';

    container.innerHTML = this.cart.map((item, index) => this.renderCartItem(item, index)).join('');
    
    document.getElementById('cartItemCount').textContent = `${this.cart.length} ${this.cart.length === 1 ? 'item' : 'items'}`;
  }

  // Render single cart item - Ek cart item ka HTML
  renderCartItem(item, index) {
    const itemTotal = item.price * item.quantity;
    const discount = item.originalPrice ? ((item.originalPrice - item.price) / item.originalPrice * 100).toFixed(0) : 0;

    return `
      <div class="cart-item-card">
        <div class="cart-item-content">
          <!-- Product Image -->
          <div class="cart-item-image">
            <img src="${item.image || 'https://via.placeholder.com/100?text=Product'}" 
                 alt="${item.name}"
                 onerror="this.src='https://via.placeholder.com/100?text=Product'">
          </div>

          <!-- Product Details -->
          <div class="cart-item-details">
            <h3 class="item-name">${item.name}</h3>
            <p class="item-description">${item.unit || 'Unit'}</p>
            <div class="item-price-row">
              <span class="item-price">₹${item.price.toFixed(2)}</span>
              ${item.originalPrice && item.originalPrice > item.price ? `
                <span class="item-original-price">₹${item.originalPrice.toFixed(2)}</span>
                <span class="item-discount">${discount}% OFF</span>
              ` : ''}
            </div>
          </div>

          <!-- Actions -->
          <div class="cart-item-actions">
            <!-- Quantity Controls -->
            <div class="quantity-controls">
              <button class="qty-btn" onclick="cartManager.updateQuantity(${index}, ${item.quantity - 1})">
                -
              </button>
              <span class="qty-display">${item.quantity}</span>
              <button class="qty-btn" onclick="cartManager.updateQuantity(${index}, ${item.quantity + 1})">
                +
              </button>
            </div>

            <!-- Remove Button -->
            <button class="remove-btn" onclick="cartManager.removeItem(${index})">
              <span>🗑️</span>
              <span>Remove</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // Update quantity - Quantity update karna
  updateQuantity(index, newQuantity) {
    if (newQuantity < 1) {
      this.removeItem(index);
      return;
    }

    if (newQuantity > 99) {
      this.showToast('Maximum quantity is 99', 'error');
      return;
    }

    this.cart[index].quantity = newQuantity;
    this.saveCart();
    this.renderCart();
    this.updateSummary();
    this.updateDeliveryProgress();
    this.showToast('Quantity updated', 'success');
  }

  // Remove item - Item remove karna
  removeItem(index) {
    const item = this.cart[index];
    this.cart.splice(index, 1);
    this.saveCart();
    this.renderCart();
    this.updateSummary();
    this.updateDeliveryProgress();
    this.showToast(`${item.name} removed from cart`, 'success');
  }

  // Calculate subtotal - Subtotal calculate karna
  calculateSubtotal() {
    return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  // Update summary - Cart summary update karna
  updateSummary() {
    this.subtotal = this.calculateSubtotal();
    
    // Calculate delivery charge
    const deliveryCharge = this.subtotal >= this.freeDeliveryThreshold ? 0 : this.deliveryCharge;
    
    // Calculate GST
    const gst = this.subtotal * this.gstRate;
    
    // Calculate total
    const total = this.subtotal + deliveryCharge - this.discount + gst;

    // Update UI
    document.getElementById('summaryItemCount').textContent = this.cart.length;
    document.getElementById('subtotalAmount').textContent = `₹${this.subtotal.toFixed(2)}`;
    
    if (deliveryCharge === 0) {
      document.getElementById('deliveryCharges').innerHTML = '<span style="color: #10B981;">FREE 🎉</span>';
    } else {
      document.getElementById('deliveryCharges').textContent = `₹${deliveryCharge.toFixed(2)}`;
    }
    
    document.getElementById('gstAmount').textContent = `₹${gst.toFixed(2)}`;
    document.getElementById('totalAmount').textContent = `₹${total.toFixed(2)}`;

    // Show/hide discount row
    if (this.discount > 0) {
      document.getElementById('discountRow').style.display = 'flex';
      document.getElementById('discountAmount').textContent = `-₹${this.discount.toFixed(2)}`;
    } else {
      document.getElementById('discountRow').style.display = 'none';
    }
  }

  // Update delivery progress - Free delivery progress bar
  updateDeliveryProgress() {
    const remaining = this.freeDeliveryThreshold - this.subtotal;
    const progress = Math.min((this.subtotal / this.freeDeliveryThreshold) * 100, 100);
    
    const progressBar = document.getElementById('deliveryProgress');
    const messageEl = document.getElementById('deliveryMessage');
    const remainingEl = document.getElementById('remainingAmount');

    progressBar.style.width = `${progress}%`;

    if (this.subtotal >= this.freeDeliveryThreshold) {
      messageEl.innerHTML = 'Yay! You get FREE delivery! 🎉';
    } else {
      remainingEl.textContent = remaining.toFixed(0);
      messageEl.innerHTML = `Add ₹<span id="remainingAmount">${remaining.toFixed(0)}</span> more for FREE delivery! 🚚`;
    }
  }

  // Apply coupon - Coupon apply karna
  applyCoupon(code) {
    // Sample coupons - Real implementation me backend se validate karo
    const coupons = {
      'FIRST20': { discount: 20, minOrder: 200, type: 'percentage' },
      'SAVE50': { discount: 50, minOrder: 300, type: 'fixed' },
      'WELCOME10': { discount: 10, minOrder: 100, type: 'percentage' }
    };

    const coupon = coupons[code.toUpperCase()];

    if (!coupon) {
      this.showToast('Invalid coupon code', 'error');
      return false;
    }

    if (this.subtotal < coupon.minOrder) {
      this.showToast(`Minimum order of ₹${coupon.minOrder} required`, 'error');
      return false;
    }

    if (coupon.type === 'percentage') {
      this.discount = (this.subtotal * coupon.discount) / 100;
    } else {
      this.discount = coupon.discount;
    }

    this.appliedCoupon = code;
    this.updateSummary();
    this.showToast(`Coupon ${code} applied! You saved ₹${this.discount.toFixed(2)}`, 'success');
    return true;
  }

  // Show toast notification - Toast message dikhana
  showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `cart-toast ${type}`;
    toast.innerHTML = `
      <span>${type === 'success' ? '✅' : '❌'}</span>
      <span>${message}</span>
    `;
    
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
}

// Initialize cart manager - Cart manager ko initialize karna
let cartManager;

document.addEventListener('DOMContentLoaded', () => {
  cartManager = new ModernCartManager();
});

// Apply coupon function - Coupon apply karne ka function
function applyCoupon() {
  const couponInput = document.getElementById('couponInput');
  const code = couponInput.value.trim();
  
  if (!code) {
    cartManager.showToast('Please enter a coupon code', 'error');
    return;
  }

  if (cartManager.applyCoupon(code)) {
    couponInput.value = '';
  }
}

// Proceed to checkout - Checkout pe jane ka function
function proceedToCheckout() {
  if (cartManager.cart.length === 0) {
    cartManager.showToast('Your cart is empty', 'error');
    return;
  }

  // Check if user is logged in
  const token = localStorage.getItem('authToken');
  if (!token) {
    cartManager.showToast('Please login to continue', 'error');
    setTimeout(() => {
      window.location.href = 'login.html?redirect=checkout.html';
    }, 1000);
    return;
  }

  // Redirect to checkout
  window.location.href = 'checkout.html';
}

// Add CSS for slideOut animation
const style = document.createElement('style');
style.textContent = `
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);
