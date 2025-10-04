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
          <div class="product-badge-container">
            ${this.product.stock <= 5 && this.product.stock > 0 ? 
              '<div class="stock-badge stock-low-badge"><span>कम Stock</span></div>' : ''}
            ${this.product.stock === 0 ? 
              '<div class="stock-badge stock-out-badge"><span>Out of Stock</span></div>' : ''}
          </div>
          <img src="${this.product.image}" alt="${this.product.name}" 
               class="product-image" 
               onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
          <div class="product-image-placeholder" style="display:none;">
            📦
          </div>
        </div>
        <div class="product-info">
          <div class="product-header">
            <h4 class="product-name">${this.product.name}</h4>
            <div class="product-price">₹${this.product.price}</div>
          </div>
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
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="cart-icon">
          <path d="M8 12L8 8C8 5.79086 9.79086 4 12 4V4C14.2091 4 16 5.79086 16 8L16 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <path d="M3.69435 12.6678C3.83942 10.9269 3.91196 10.0565 4.48605 9.52824C5.06013 9 5.9336 9 7.68053 9H16.3195C18.0664 9 18.9399 9 19.514 9.52824C20.088 10.0565 20.1606 10.9269 20.3057 12.6678L20.8195 18.8339C20.904 19.8474 20.9462 20.3542 20.6491 20.6771C20.352 21 19.8435 21 18.8264 21H5.1736C4.15655 21 3.64802 21 3.35092 20.6771C3.05382 20.3542 3.09605 19.8474 3.18051 18.8339L3.69435 12.6678Z" stroke="currentColor" stroke-width="2"/>
        </svg>
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
