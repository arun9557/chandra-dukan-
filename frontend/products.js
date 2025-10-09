// Products Page Script - Product listing with filters aur sorting
// Filter aur sort ke saath products load karna

class ProductsPage {
  constructor() {
    this.currentProducts = [];
    this.currentPage = 0;
    this.pageSize = 20;
    this.totalProducts = 0;
    this.isLoading = false;
    
    this.init();
  }

  // Initialize products page
  async init() {
    // Cart badge update karo
    this.updateCartBadge();
    
    // Filter component ka callback set karo
    if (window.FilterComponent) {
      window.FilterComponent.setOnFilterChange(() => {
        this.loadProducts(true); // Reset to first page
      });
    }
    
    // Sort select event listener
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        window.FilterService.setSort(e.target.value);
        this.loadProducts(true); // Reset to first page
      });
    }
    
    // Load more button
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener('click', () => {
        this.loadMoreProducts();
      });
    }
    
    // Initial products load
    await this.loadProducts();
    
    // Back to top button
    this.setupBackToTop();
  }

  // Load products with current filters - Filters ke saath products load karna
  async loadProducts(resetPage = false) {
    if (this.isLoading) return;
    
    try {
      this.isLoading = true;
      
      // Agar page reset karna hai
      if (resetPage) {
        this.currentPage = 0;
        this.currentProducts = [];
      }
      
      // Show loading state
      this.showLoading();
      
      // Get current filters and sort
      const filters = window.FilterService.getCurrentFilters();
      const sort = window.FilterService.getCurrentSort();
      
      // Calculate offset for pagination
      const offset = this.currentPage * this.pageSize;
      
      // Fetch products
      const response = await window.FilterService.getFilteredProducts(
        filters,
        sort,
        this.pageSize,
        offset
      );
      
      if (response.success) {
        // Update products array
        if (resetPage) {
          this.currentProducts = response.data;
        } else {
          this.currentProducts = [...this.currentProducts, ...response.data];
        }
        
        this.totalProducts = response.total;
        
        // Display products
        this.displayProducts();
        
        // Update product count
        this.updateProductCount();
        
        // Show/hide load more button
        this.updateLoadMoreButton();
        
      } else {
        throw new Error('Failed to load products');
      }
      
    } catch (error) {
      console.error('Error loading products:', error);
      this.showError(error);
      
      // Fallback to DataService if backend fails
      if (window.DataService) {
        this.loadProductsFromDataService();
      }
    } finally {
      this.isLoading = false;
    }
  }

  // Load more products (pagination) - Aur products load karna
  async loadMoreProducts() {
    this.currentPage++;
    await this.loadProducts(false);
  }

  // Display products in grid - Products ko grid me dikhana
  displayProducts() {
    this.hideLoading();
    
    const grid = document.getElementById('productsGrid');
    const noProducts = document.getElementById('noProductsFound');
    
    // Agar koi product nahi hai
    if (!this.currentProducts || this.currentProducts.length === 0) {
      if (grid) grid.style.display = 'none';
      if (noProducts) noProducts.style.display = 'flex';
      return;
    }
    
    // Products hai to display karo
    if (noProducts) noProducts.style.display = 'none';
    if (grid) {
      grid.style.display = 'grid';
      grid.innerHTML = this.currentProducts.map(product => 
        this.renderProductCard(product)
      ).join('');
    }
  }

  // Render single product card - Ek product ka card HTML
  renderProductCard(product) {
    const categoryName = product.category?.name || 'General';
    const categoryIcon = product.category?.icon || '📦';
    const price = typeof product.price === 'number' ? product.price.toFixed(2) : '0.00';
    const originalPrice = product.originalPrice || 0;
    const discount = product.discount || 0;
    const stock = product.stock || 0;
    const inStock = stock > 0;
    const productId = product._id || product.id;

    return `
      <div class="product-card" data-product-id="${productId}">
        ${discount > 0 ? `<div class="product-badge discount-badge">-${discount}% OFF</div>` : ''}
        ${!inStock ? '<div class="product-badge out-of-stock-badge">Out of Stock</div>' : ''}
        ${product.isFeatured ? '<div class="product-badge featured-badge">Featured</div>' : ''}
        
        <div class="product-image">
          <img src="${product.image || 'https://via.placeholder.com/200x200?text=Product'}" 
               alt="${product.name}"
               onerror="this.src='https://via.placeholder.com/200x200?text=Product'">
        </div>
        
        <div class="product-details">
          <div class="product-category">
            <span class="category-icon">${categoryIcon}</span>
            <span class="category-name">${categoryName}</span>
          </div>
          
          <h3 class="product-name">${product.name}</h3>
          
          ${product.description ? `<p class="product-description">${product.description.substring(0, 80)}...</p>` : ''}
          
          <div class="product-footer">
            <div class="product-pricing">
              <span class="product-price">₹${price}</span>
              ${originalPrice > 0 && discount > 0 ? `<span class="original-price">₹${originalPrice.toFixed(2)}</span>` : ''}
            </div>
            
            ${inStock ? `
              <button class="btn-add-cart" onclick="addToCart('${productId}')" ${stock === 0 ? 'disabled' : ''}>
                <span class="btn-icon">🛒</span>
                <span>Add</span>
              </button>
            ` : `
              <button class="btn-add-cart" disabled>
                <span>Out of Stock</span>
              </button>
            `}
          </div>
          
          <div class="product-meta">
            ${inStock ? `<span class="stock-status in-stock">✓ ${stock} in stock</span>` : '<span class="stock-status out-of-stock">✗ Out of stock</span>'}
            ${product.views ? `<span class="product-views">👁 ${product.views} views</span>` : ''}
          </div>
        </div>
      </div>
    `;
  }

  // Fallback: Load products from DataService - DataService se products load karna
  loadProductsFromDataService() {
    try {
      const filters = window.FilterService.getCurrentFilters();
      let products = window.DataService.getProducts();
      
      // Apply filters manually
      if (filters.categories.length > 0) {
        products = products.filter(p => 
          filters.categories.includes(p.category_id?.toString())
        );
      }
      
      if (filters.inStock) {
        products = products.filter(p => p.stock > 0);
      }
      
      if (filters.priceRange.min !== null) {
        products = products.filter(p => p.price >= filters.priceRange.min);
      }
      
      if (filters.priceRange.max !== null) {
        products = products.filter(p => p.price <= filters.priceRange.max);
      }
      
      // Apply sort
      const sort = window.FilterService.getCurrentSort();
      switch(sort) {
        case 'price-low':
          products.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          products.sort((a, b) => b.price - a.price);
          break;
        case 'name':
          products.sort((a, b) => a.name.localeCompare(b.name));
          break;
      }
      
      this.currentProducts = products;
      this.totalProducts = products.length;
      this.displayProducts();
      this.updateProductCount();
      
    } catch (error) {
      console.error('DataService fallback failed:', error);
      this.showError(error);
    }
  }

  // Update product count display - Product count update karna
  updateProductCount() {
    const countElement = document.getElementById('productCount');
    if (countElement) {
      countElement.textContent = this.totalProducts;
    }
  }

  // Update load more button visibility - Load more button show/hide karna
  updateLoadMoreButton() {
    const container = document.getElementById('loadMoreContainer');
    if (!container) return;
    
    const hasMore = this.currentProducts.length < this.totalProducts;
    container.style.display = hasMore ? 'block' : 'none';
  }

  // Show loading state - Loading state dikhana
  showLoading() {
    const skeleton = document.getElementById('productsSkeleton');
    const grid = document.getElementById('productsGrid');
    const noProducts = document.getElementById('noProductsFound');
    
    if (skeleton) skeleton.style.display = 'grid';
    if (grid) grid.style.display = 'none';
    if (noProducts) noProducts.style.display = 'none';
  }

  // Hide loading state - Loading state hide karna
  hideLoading() {
    const skeleton = document.getElementById('productsSkeleton');
    if (skeleton) skeleton.style.display = 'none';
  }

  // Show error state - Error dikhana
  showError(error) {
    this.hideLoading();
    
    if (window.NotificationService) {
      window.NotificationService.show(
        'Failed to load products. Please try again.',
        'error'
      );
    } else {
      alert('Failed to load products: ' + error.message);
    }
  }

  // Update cart badge - Cart badge update karna
  updateCartBadge() {
    if (window.CartService) {
      const cart = window.CartService.getCart();
      const count = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
      
      const badge = document.getElementById('cartBadge');
      if (badge) badge.textContent = count;
    }
  }

  // Setup back to top button - Back to top button setup karna
  setupBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    if (!backToTopBtn) return;
    
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });
  }
}

// Global function: Add to cart - Cart me add karna
function addToCart(productId) {
  // Find product in current products
  if (window.productsPage && window.productsPage.currentProducts) {
    const product = window.productsPage.currentProducts.find(
      p => (p._id || p.id) === productId
    );
    
    if (product && window.CartService) {
      window.CartService.addToCart(product);
      window.productsPage.updateCartBadge();
      
      if (window.NotificationService) {
        window.NotificationService.show(
          `${product.name} added to cart!`,
          'success'
        );
      }
    }
  }
}

// Global function: Scroll to top - Page top pe scroll karna
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}

// Initialize page on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.productsPage = new ProductsPage();
});
