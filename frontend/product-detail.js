// Product Detail Page Manager - Product details page ka JavaScript
// Complete product details display, add to cart, similar products

class ProductDetailManager {
  constructor() {
    this.baseUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? 'http://localhost:3000/api'
      : '/api';
    
    this.product = null;
    this.quantity = 1;
    this.productId = this.getProductIdFromURL();
    
    this.init();
  }

  // Initialize product detail page - Page ko initialize karna
  async init() {
    if (!this.productId) {
      this.showError();
      return;
    }
    
    await this.loadProduct();
    this.updateCartBadge();
  }

  // Get product ID from URL - URL se product ID nikalna
  getProductIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
  }

  // Load product details - Product details load karna
  async loadProduct() {
    try {
      this.showLoading();
      
      const response = await fetch(`${this.baseUrl}/products/${this.productId}`);
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        this.showError();
        return;
      }
      
      this.product = data.data;
      this.renderProduct();
      this.loadSimilarProducts();
      
    } catch (error) {
      console.error('Error loading product:', error);
      this.showError();
    }
  }

  // Render product details - Product details ko display karna
  renderProduct() {
    // Hide loading, show content
    document.getElementById('loadingState').style.display = 'none';
    document.getElementById('productContent').style.display = 'block';
    
    const product = this.product;
    
    // Update page title
    document.title = `${product.name} - Chandra Dukan`;
    
    // Update breadcrumb
    document.getElementById('breadcrumbProduct').textContent = product.name;
    
    // Calculate discount percentage
    const discount = product.originalPrice && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;
    
    // Stock status
    const inStock = product.stock > 0;
    const stockClass = inStock ? 'in-stock' : 'out-of-stock';
    const stockText = inStock ? `✅ In Stock (${product.stock} available)` : '❌ Out of Stock';
    
    // Generate rating stars
    const rating = product.rating || 4.5;
    const stars = this.generateStars(rating);
    
    // Render product HTML
    const productHTML = `
      <!-- Product Image Section -->
      <div class="product-image-section">
        <div class="main-product-image">
          <img src="${product.image || 'https://via.placeholder.com/500?text=Product'}" 
               alt="${product.name}"
               onerror="this.src='https://via.placeholder.com/500?text=Product'">
        </div>
      </div>
      
      <!-- Product Info Section -->
      <div class="product-info-section">
        <!-- Category Badge -->
        <div class="product-category">
          <span>${product.category?.icon || '📦'}</span>
          <span>${product.category?.name || 'General'}</span>
        </div>
        
        <!-- Product Title -->
        <h1 class="product-title">${product.name}</h1>
        
        <!-- Rating -->
        <div class="product-rating">
          <div class="stars">${stars}</div>
          <span class="rating-count">(${product.reviewCount || 0} reviews)</span>
        </div>
        
        <!-- Price Section -->
        <div class="product-price-section">
          <span class="product-price">₹${product.price.toFixed(2)}</span>
          ${product.originalPrice && product.originalPrice > product.price ? `
            <span class="product-original-price">₹${product.originalPrice.toFixed(2)}</span>
            <span class="product-discount">${discount}% OFF</span>
          ` : ''}
        </div>
        
        <!-- Stock Status -->
        <div class="stock-status ${stockClass}">
          ${stockText}
        </div>
        
        <!-- Description -->
        <div class="product-description">
          <h3 style="font-size: 1.125rem; font-weight: 600; margin-bottom: 0.5rem;">Description</h3>
          <p>${product.description || 'High quality product for your daily needs.'}</p>
        </div>
        
        <!-- Quantity Selector -->
        <div class="quantity-section">
          <span class="quantity-label">Quantity:</span>
          <div class="quantity-controls">
            <button class="qty-btn" onclick="productDetail.decreaseQuantity()" ${!inStock ? 'disabled' : ''}>
              -
            </button>
            <span class="qty-display" id="quantityDisplay">1</span>
            <button class="qty-btn" onclick="productDetail.increaseQuantity()" ${!inStock ? 'disabled' : ''}>
              +
            </button>
          </div>
        </div>
        
        <!-- Add to Cart Button -->
        <button class="add-to-cart-btn" onclick="productDetail.addToCart()" ${!inStock ? 'disabled' : ''}>
          <span>🛒</span>
          <span>${inStock ? 'Add to Cart' : 'Out of Stock'}</span>
        </button>
        
        <!-- Features -->
        <div class="product-features">
          <div class="feature-card">
            <span class="feature-icon">🚚</span>
            <div>
              <div class="feature-text">Fast Delivery</div>
              <div style="font-size: 0.75rem; color: #9CA3AF;">Within 30 mins</div>
            </div>
          </div>
          <div class="feature-card">
            <span class="feature-icon">↩️</span>
            <div>
              <div class="feature-text">Easy Returns</div>
              <div style="font-size: 0.75rem; color: #9CA3AF;">7 days return</div>
            </div>
          </div>
          <div class="feature-card">
            <span class="feature-icon">💳</span>
            <div>
              <div class="feature-text">Secure Payment</div>
              <div style="font-size: 0.75rem; color: #9CA3AF;">100% safe</div>
            </div>
          </div>
          <div class="feature-card">
            <span class="feature-icon">✓</span>
            <div>
              <div class="feature-text">Quality Assured</div>
              <div style="font-size: 0.75rem; color: #9CA3AF;">Fresh products</div>
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.getElementById('productDetailGrid').innerHTML = productHTML;
  }

  // Generate star rating HTML - Star rating ka HTML banana
  generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
      stars += '⭐';
    }
    if (hasHalfStar) {
      stars += '⭐';
    }
    
    return stars || '⭐⭐⭐⭐⭐';
  }

  // Load similar products - Similar products load karna
  async loadSimilarProducts() {
    try {
      const categoryId = this.product.category?._id;
      if (!categoryId) return;
      
      const response = await fetch(`${this.baseUrl}/products?category=${categoryId}&limit=4`);
      const data = await response.json();
      
      if (data.success && data.data.length > 0) {
        // Filter out current product
        const similarProducts = data.data.filter(p => p._id !== this.productId);
        this.renderSimilarProducts(similarProducts.slice(0, 4));
      }
    } catch (error) {
      console.error('Error loading similar products:', error);
    }
  }

  // Render similar products - Similar products display karna
  renderSimilarProducts(products) {
    if (products.length === 0) {
      document.querySelector('.similar-products-section').style.display = 'none';
      return;
    }
    
    const html = products.map(product => `
      <div style="background: white; border-radius: 12px; padding: 1rem; box-shadow: 0 2px 8px rgba(0,0,0,0.08); cursor: pointer;" onclick="window.location.href='product-detail.html?id=${product._id}'">
        <img src="${product.image || 'https://via.placeholder.com/250'}" 
             alt="${product.name}"
             style="width: 100%; aspect-ratio: 1; object-fit: cover; border-radius: 8px; margin-bottom: 1rem;"
             onerror="this.src='https://via.placeholder.com/250'">
        <h3 style="font-size: 1rem; font-weight: 600; margin-bottom: 0.5rem; color: #1F2937;">${product.name}</h3>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 1.25rem; font-weight: 700; color: #6366F1;">₹${product.price}</span>
          <button style="background: #6366F1; color: white; border: none; padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer; font-weight: 600;" onclick="event.stopPropagation(); productDetail.addProductToCart('${product._id}')">Add</button>
        </div>
      </div>
    `).join('');
    
    document.getElementById('similarProductsGrid').innerHTML = html;
  }

  // Increase quantity - Quantity badhana
  increaseQuantity() {
    if (this.quantity < this.product.stock) {
      this.quantity++;
      document.getElementById('quantityDisplay').textContent = this.quantity;
    }
  }

  // Decrease quantity - Quantity ghatana
  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
      document.getElementById('quantityDisplay').textContent = this.quantity;
    }
  }

  // Add to cart - Cart me add karna
  addToCart() {
    if (!this.product || this.product.stock <= 0) {
      this.showNotification('Product out of stock', 'error');
      return;
    }
    
    // Get cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Check if product already in cart
    const existingIndex = cart.findIndex(item => item._id === this.product._id);
    
    if (existingIndex >= 0) {
      // Update quantity
      cart[existingIndex].quantity += this.quantity;
    } else {
      // Add new item
      cart.push({
        _id: this.product._id,
        name: this.product.name,
        price: this.product.price,
        image: this.product.image,
        quantity: this.quantity,
        unit: this.product.unit
      });
    }
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart badge
    this.updateCartBadge();
    
    // Show success notification
    this.showNotification(`${this.product.name} added to cart!`, 'success');
    
    // Reset quantity
    this.quantity = 1;
    document.getElementById('quantityDisplay').textContent = '1';
  }

  // Add similar product to cart - Similar product ko cart me add karna
  addProductToCart(productId) {
    // Redirect to product detail page
    window.location.href = `product-detail.html?id=${productId}`;
  }

  // Update cart badge - Cart badge update karna
  updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const badge = document.getElementById('cartBadge');
    if (badge) {
      badge.textContent = totalItems;
    }
  }

  // Show loading state - Loading state dikhana
  showLoading() {
    document.getElementById('loadingState').style.display = 'flex';
    document.getElementById('errorState').style.display = 'none';
    document.getElementById('productContent').style.display = 'none';
  }

  // Show error state - Error state dikhana
  showError() {
    document.getElementById('loadingState').style.display = 'none';
    document.getElementById('errorState').style.display = 'flex';
    document.getElementById('productContent').style.display = 'none';
  }

  // Show notification - Notification dikhana
  showNotification(message, type = 'success') {
    // Create toast element
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      background: ${type === 'success' ? '#10B981' : '#EF4444'};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 1000;
      animation: slideIn 0.3s ease;
    `;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Remove after 3 seconds
    setTimeout(() => {
      toast.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
}

// Initialize product detail manager - Manager ko initialize karna
let productDetail;

document.addEventListener('DOMContentLoaded', () => {
  productDetail = new ProductDetailManager();
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(400px); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(400px); opacity: 0; }
  }
`;
document.head.appendChild(style);
