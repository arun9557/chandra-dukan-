// Search Results Page Script - Full page search results handle karna
// URL query parameter se search query read karke results display karna

class SearchResultsPage {
  constructor() {
    this.currentQuery = '';
    this.currentResults = [];
    this.currentSort = 'relevance';
    
    this.init();
  }

  // Initialize search results page
  init() {
    // URL se query parameter get karo
    const urlParams = new URLSearchParams(window.location.search);
    this.currentQuery = urlParams.get('q') || '';

    // Search input me query set karo
    const searchInput = document.getElementById('headerSearchInput');
    if (searchInput && this.currentQuery) {
      searchInput.value = this.currentQuery;
    }

    // Sort filter setup
    this.setupSortFilter();

    // Search perform karo
    if (this.currentQuery) {
      this.performSearch(this.currentQuery);
    } else {
      this.showNoResults('Please enter a search term');
    }

    // Search input event listener
    if (searchInput) {
      searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          const newQuery = e.target.value.trim();
          if (newQuery) {
            window.location.href = `search-results.html?q=${encodeURIComponent(newQuery)}`;
          }
        }
      });
    }

    // Search button event listener
    const searchBtn = document.querySelector('.search-btn');
    if (searchBtn) {
      searchBtn.addEventListener('click', () => {
        const newQuery = searchInput.value.trim();
        if (newQuery) {
          window.location.href = `search-results.html?q=${encodeURIComponent(newQuery)}`;
        }
      });
    }
  }

  // Setup sort filter
  setupSortFilter() {
    const sortFilter = document.getElementById('sortFilter');
    if (sortFilter) {
      sortFilter.addEventListener('change', (e) => {
        this.currentSort = e.target.value;
        this.sortAndDisplayResults();
      });
    }
  }

  // Perform search - Backend se results fetch karna
  async performSearch(query) {
    try {
      // Loading state dikhao
      this.showLoading();

      // Query display update karo
      this.updateQueryDisplay(query);

      // Search service se results fetch karo
      const results = await window.SearchService.searchProducts(query);

      // Results store karo
      this.currentResults = results;

      // Track search
      window.SearchService.trackSearch(query);

      // Results display karo
      this.displayResults(results);

    } catch (error) {
      console.error('Search failed:', error);
      this.showError(error);
    }
  }

  // Display search results
  displayResults(results) {
    this.hideLoading();

    // Results summary update karo
    this.updateResultsSummary(results.length);

    // Agar koi result nahi hai
    if (!results || results.length === 0) {
      this.showNoResults(`No products found for "${this.currentQuery}"`);
      return;
    }

    // Results grid dikhao
    const grid = document.getElementById('searchResultsGrid');
    const noResults = document.getElementById('noResultsContainer');

    if (noResults) noResults.style.display = 'none';
    if (grid) {
      grid.style.display = 'grid';
      grid.innerHTML = results.map(product => this.renderProductCard(product)).join('');
    }
  }

  // Render product card - Single product card HTML banana
  renderProductCard(product) {
    const categoryName = product.category?.name || 'General';
    const categoryIcon = product.category?.icon || '📦';
    const price = typeof product.price === 'number' ? product.price.toFixed(2) : '0.00';
    const stock = product.stock || 0;
    const inStock = stock > 0;
    const discount = product.discount || 0;
    const originalPrice = product.originalPrice || 0;

    // Highlight matching text
    const highlightedName = window.SearchService.highlightMatch(product.name, this.currentQuery);

    return `
      <div class="product-card" data-product-id="${product._id}">
        ${discount > 0 ? `<div class="product-badge">-${discount}% OFF</div>` : ''}
        ${!inStock ? '<div class="product-badge out-of-stock-badge">Out of Stock</div>' : ''}
        
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
          
          <h3 class="product-name">${highlightedName}</h3>
          
          ${product.description ? `<p class="product-description">${product.description.substring(0, 60)}...</p>` : ''}
          
          <div class="product-footer">
            <div class="product-pricing">
              <span class="product-price">₹${price}</span>
              ${originalPrice > 0 ? `<span class="original-price">₹${originalPrice.toFixed(2)}</span>` : ''}
            </div>
            
            ${inStock ? `
              <button class="btn-add-cart" onclick="addToCartFromSearch('${product._id}')" ${stock === 0 ? 'disabled' : ''}>
                <span class="btn-icon">🛒</span>
                <span>Add to Cart</span>
              </button>
            ` : `
              <button class="btn-add-cart" disabled>
                <span>Out of Stock</span>
              </button>
            `}
          </div>
          
          <div class="product-stock-info">
            ${inStock ? `<span class="stock-available">✓ ${stock} in stock</span>` : '<span class="stock-unavailable">✗ Out of stock</span>'}
          </div>
        </div>
      </div>
    `;
  }

  // Sort and display results - Results ko sort karke display karna
  sortAndDisplayResults() {
    if (!this.currentResults || this.currentResults.length === 0) {
      return;
    }

    const sortedResults = window.SearchService.sortResults(this.currentResults, this.currentSort);
    this.displayResults(sortedResults);
  }

  // Update query display - Search query ko page pe display karna
  updateQueryDisplay(query) {
    const queryDisplay = document.getElementById('searchQueryDisplay');
    if (queryDisplay) {
      queryDisplay.textContent = `Showing results for "${query}"`;
    }

    // Page title bhi update karo
    document.title = `Search: ${query} - Chandra Dukan`;
  }

  // Update results summary - Kitne results mile display karna
  updateResultsSummary(count) {
    const summary = document.getElementById('resultsSummary');
    const countElement = document.getElementById('resultsCount');

    if (summary && countElement) {
      countElement.textContent = count;
      summary.style.display = count > 0 ? 'block' : 'none';
    }
  }

  // Show loading state
  showLoading() {
    const skeleton = document.getElementById('productsSkeleton');
    const grid = document.getElementById('searchResultsGrid');
    const noResults = document.getElementById('noResultsContainer');

    if (skeleton) skeleton.style.display = 'grid';
    if (grid) grid.style.display = 'none';
    if (noResults) noResults.style.display = 'none';
  }

  // Hide loading state
  hideLoading() {
    const skeleton = document.getElementById('productsSkeleton');
    if (skeleton) skeleton.style.display = 'none';
  }

  // Show no results state
  showNoResults(message) {
    this.hideLoading();

    const grid = document.getElementById('searchResultsGrid');
    const noResults = document.getElementById('noResultsContainer');
    const noResultsMessage = document.getElementById('noResultsMessage');
    const summary = document.getElementById('resultsSummary');

    if (grid) grid.style.display = 'none';
    if (summary) summary.style.display = 'none';
    if (noResults) noResults.style.display = 'flex';
    if (noResultsMessage) noResultsMessage.textContent = message;
  }

  // Show error state
  showError(error) {
    this.showNoResults('An error occurred while searching. Please try again.');
    console.error('Search error:', error);
  }
}

// Global function - Add to cart from search results
function addToCartFromSearch(productId) {
  // Search results se product find karo
  if (window.searchResultsPage && window.searchResultsPage.currentResults) {
    const product = window.searchResultsPage.currentResults.find(p => p._id === productId);
    
    if (product && window.CartService) {
      window.CartService.addToCart(product);
      
      // Success notification
      if (window.NotificationService) {
        window.NotificationService.show(`${product.name} added to cart!`, 'success');
      }
    }
  }
}

// Initialize page on load
document.addEventListener('DOMContentLoaded', () => {
  window.searchResultsPage = new SearchResultsPage();
});
