// ProductCard Component - Product card का component
// Individual product display with cart functionality

class ProductCard {
  constructor(product) {
    this.product = product;
    this.cartQuantity = 0;
  }

  // Create product card HTML - Product card का HTML create करना
  create() {
    const stockStatus = this.getStockStatus();
    const stockClass = this.getStockClass();
    
    return `
      <div class="card product-card fade-in" data-product-id="${this.product.id}">
        <div class="product-image-container">
          <img src="${this.product.image}" alt="${this.product.name}" 
               class="product-image" 
               onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
          <div class="product-image-placeholder" style="display:none;">
            📦
          </div>
          ${this.product.stock <= 5 && this.product.stock > 0 ? 
            '<div class="stock-badge stock-low-badge">कम Stock</div>' : ''}
          ${this.product.stock === 0 ? 
            '<div class="stock-badge stock-out-badge">Out of Stock</div>' : ''}
        </div>
        <div class="product-info">
          <h4 class="product-name">${this.product.name}</h4>
          <div class="product-price">₹${this.product.price}</div>
          <div class="product-stock ${stockClass}">
            ${stockStatus}
          </div>
          <div class="product-actions">
            ${this.product.stock > 0 ? this.renderCartControls() : this.renderOutOfStock()}
          </div>
        </div>
      </div>
    `;
  }

  // Render cart controls - Cart controls render करना
  renderCartControls() {
    return `
      <div class="quantity-controls">
        <button class="quantity-btn" onclick="ProductCard.updateQuantity(${this.product.id}, -1)">−</button>
        <span class="quantity-display" id="quantity-${this.product.id}">${this.cartQuantity}</span>
        <button class="quantity-btn" onclick="ProductCard.updateQuantity(${this.product.id}, 1)">+</button>
      </div>
      <button class="btn btn--primary add-to-cart-btn" 
              onclick="ProductCard.addToCart(${this.product.id})">
        Cart में Add करें
      </button>
    `;
  }

  // Render out of stock - Out of stock render करना
  renderOutOfStock() {
    return `
      <button class="btn btn--secondary" disabled>
        Stock खत्म
      </button>
    `;
  }

  // Get stock status text - Stock status text get करना
  getStockStatus() {
    if (this.product.stock === 0) return 'Stock खत्म';
    if (this.product.stock <= 5) return `कम Stock (${this.product.stock} बचे)`;
    return `Stock में उपलब्ध (${this.product.stock})`;
  }

  // Get stock class - Stock class get करना
  getStockClass() {
    if (this.product.stock === 0) return 'stock-out';
    if (this.product.stock <= 5) return 'stock-low';
    return 'stock-available';
  }

  // Update quantity display - Quantity display update करना
  updateQuantityDisplay(quantity) {
    const quantityDisplay = document.getElementById(`quantity-${this.product.id}`);
    if (quantityDisplay) {
      quantityDisplay.textContent = quantity;
    }
    this.cartQuantity = quantity;
  }

  // Static method to add to cart - Cart में add करने का static method
  static addToCart(productId) {
    if (window.CartService) {
      window.CartService.addItem(productId);
    }
  }

  // Static method to update quantity - Quantity update करने का static method
  static updateQuantity(productId, change) {
    if (window.CartService) {
      window.CartService.updateQuantity(productId, change);
    }
  }
}

// Export for use in main app
window.ProductCard = ProductCard;
