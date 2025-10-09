// SearchComponent - Search UI aur interactions handle karna
// Realtime search with dropdown suggestions aur full page results

class SearchComponent {
  constructor() {
    this.searchInput = null;
    this.searchDropdown = null;
    this.searchOverlay = null;
    this.isSearchActive = false;
    this.currentQuery = '';
    
    this.init();
  }

  // Initialize search component
  init() {
    this.setupSearchElements();
    this.attachEventListeners();
  }

  // Setup search DOM elements - HTML elements setup karna
  setupSearchElements() {
    this.searchInput = document.getElementById('headerSearchInput');
    
    if (!this.searchInput) {
      console.warn('Search input not found');
      return;
    }

    // Search dropdown container banao (agar nahi hai to)
    if (!document.getElementById('searchDropdown')) {
      this.createSearchDropdown();
    }
    
    this.searchDropdown = document.getElementById('searchDropdown');
    this.searchOverlay = document.getElementById('searchOverlay');
  }

  // Create search dropdown HTML
  createSearchDropdown() {
    const dropdownHTML = `
      <!-- Search Overlay - Background click ke liye -->
      <div id="searchOverlay" class="search-overlay" style="display: none;"></div>
      
      <!-- Search Dropdown - Results dikhane ke liye -->
      <div id="searchDropdown" class="search-dropdown" style="display: none;">
        <!-- Loading state -->
        <div class="search-loading" id="searchLoading" style="display: none;">
          <div class="loading-spinner"></div>
          <p>Searching products...</p>
        </div>
        
        <!-- Error state -->
        <div class="search-error" id="searchError" style="display: none;">
          <span class="error-icon">⚠️</span>
          <p>Search failed. Please try again.</p>
        </div>
        
        <!-- Results container -->
        <div class="search-results-container" id="searchResultsContainer">
          <!-- Recent searches -->
          <div class="search-recent" id="searchRecent" style="display: none;">
            <div class="search-section-header">
              <h4>Recent Searches</h4>
              <button class="clear-history-btn" onclick="window.SearchComponent.clearHistory()">Clear</button>
            </div>
            <div id="recentSearchList"></div>
          </div>
          
          <!-- Search results -->
          <div class="search-results" id="searchResults"></div>
          
          <!-- No results -->
          <div class="search-no-results" id="searchNoResults" style="display: none;">
            <span class="no-results-icon">🔍</span>
            <h4>No products found</h4>
            <p>Try searching with different keywords</p>
          </div>
        </div>
        
        <!-- View all results link -->
        <div class="search-footer" id="searchFooter" style="display: none;">
          <button class="view-all-btn" onclick="window.SearchComponent.viewAllResults()">
            View all results →
          </button>
        </div>
      </div>
    `;

    // Header ke baad insert karo
    const header = document.querySelector('.modern-header');
    if (header) {
      header.insertAdjacentHTML('afterend', dropdownHTML);
    }
  }

  // Attach event listeners
  attachEventListeners() {
    if (!this.searchInput) return;

    // Search input pe typing
    this.searchInput.addEventListener('input', (e) => {
      this.handleSearchInput(e.target.value);
    });

    // Search input focus - Recent searches dikhao
    this.searchInput.addEventListener('focus', () => {
      this.handleSearchFocus();
    });

    // Search button click
    const searchBtn = document.querySelector('.search-btn');
    if (searchBtn) {
      searchBtn.addEventListener('click', () => {
        this.performSearch();
      });
    }

    // Enter key press
    this.searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.performSearch();
      }
    });

    // Overlay click - Search close karo
    if (this.searchOverlay) {
      this.searchOverlay.addEventListener('click', () => {
        this.closeSearch();
      });
    }

    // Document click - Outside click pe close karo
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.header-search') && !e.target.closest('#searchDropdown')) {
        this.closeSearch();
      }
    });

    // Escape key - Search close karo
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isSearchActive) {
        this.closeSearch();
      }
    });
  }

  // Handle search input - User typing ke time call hoga
  handleSearchInput(query) {
    this.currentQuery = query;

    // Agar empty hai to recent searches dikhao
    if (!query || query.trim() === '') {
      this.showRecentSearches();
      return;
    }

    // Loading state dikhao
    this.showLoading();

    // Debounced search call karo
    window.SearchService.debouncedSearch(
      query,
      (results) => this.displaySearchResults(results),
      (error) => this.showError(error)
    );
  }

  // Handle search focus - Input focus hone pe call hoga
  handleSearchFocus() {
    if (!this.currentQuery || this.currentQuery.trim() === '') {
      this.showRecentSearches();
    }
    this.openSearch();
  }

  // Perform search - Enter ya search button click pe
  performSearch() {
    const query = this.searchInput.value.trim();
    
    if (!query) {
      return;
    }

    // Track search
    window.SearchService.trackSearch(query);

    // Full page results ke liye redirect (optional - baad me implement kar sakte hain)
    // window.location.href = `/search.html?q=${encodeURIComponent(query)}`;
    
    // Ya fir current page pe hi filtered products dikhao
    this.showFullSearchResults(query);
  }

  // Display search results in dropdown
  displaySearchResults(results) {
    this.hideLoading();
    this.hideError();

    const resultsContainer = document.getElementById('searchResults');
    const noResults = document.getElementById('searchNoResults');
    const footer = document.getElementById('searchFooter');
    const recentSection = document.getElementById('searchRecent');

    // Recent searches hide karo
    if (recentSection) {
      recentSection.style.display = 'none';
    }

    // Agar koi result nahi hai
    if (!results || results.length === 0) {
      resultsContainer.innerHTML = '';
      noResults.style.display = 'flex';
      footer.style.display = 'none';
      this.openSearch();
      return;
    }

    // Results hai to render karo
    noResults.style.display = 'none';
    footer.style.display = 'block';

    // Maximum 8 products dropdown me dikhao
    const displayResults = results.slice(0, 8);

    resultsContainer.innerHTML = displayResults.map(product => this.renderSearchResultItem(product)).join('');

    this.openSearch();
  }

  // Render single search result item
  renderSearchResultItem(product) {
    const categoryName = product.category?.name || 'General';
    const categoryIcon = product.category?.icon || '📦';
    const price = typeof product.price === 'number' ? product.price.toFixed(2) : '0.00';
    const stock = product.stock || 0;
    const stockStatus = stock > 0 ? 'In Stock' : 'Out of Stock';
    const stockClass = stock > 0 ? 'in-stock' : 'out-of-stock';
    
    // Search term highlight karna
    const highlightedName = window.SearchService.highlightMatch(product.name, this.currentQuery);
    
    return `
      <div class="search-result-item" onclick="window.SearchComponent.selectProduct('${product._id}')">
        <div class="search-item-image">
          <img src="${product.image || 'https://via.placeholder.com/60x60?text=Product'}" 
               alt="${product.name}"
               onerror="this.src='https://via.placeholder.com/60x60?text=Product'">
        </div>
        <div class="search-item-details">
          <h4 class="search-item-name">${highlightedName}</h4>
          <div class="search-item-meta">
            <span class="search-item-category">${categoryIcon} ${categoryName}</span>
            <span class="search-item-stock ${stockClass}">${stockStatus}</span>
          </div>
        </div>
        <div class="search-item-price">
          ₹${price}
        </div>
      </div>
    `;
  }

  // Select product - Product click karne pe
  selectProduct(productId) {
    console.log('Selected product:', productId);
    
    // Track search
    if (this.currentQuery) {
      window.SearchService.trackSearch(this.currentQuery);
    }

    // Product detail page pe redirect (ya modal open karo)
    // window.location.href = `/product.html?id=${productId}`;
    
    // Ya fir product ko cart me add karo
    this.addProductToCart(productId);
    
    this.closeSearch();
  }

  // Add product to cart - Search se directly cart me add karna
  async addProductToCart(productId) {
    try {
      // Product fetch karo
      const products = await window.SearchService.searchProducts(this.currentQuery);
      const product = products.find(p => p._id === productId);
      
      if (!product) {
        console.error('Product not found');
        return;
      }

      // Cart service use karo
      if (window.CartService) {
        window.CartService.addToCart(product);
        
        // Success notification
        if (window.NotificationService) {
          window.NotificationService.show(`${product.name} added to cart!`, 'success');
        }
      }
    } catch (error) {
      console.error('Failed to add product to cart:', error);
      if (window.NotificationService) {
        window.NotificationService.show('Failed to add product', 'error');
      }
    }
  }

  // Show recent searches
  showRecentSearches() {
    const recentSection = document.getElementById('searchRecent');
    const recentList = document.getElementById('recentSearchList');
    const resultsContainer = document.getElementById('searchResults');
    const noResults = document.getElementById('searchNoResults');
    const footer = document.getElementById('searchFooter');

    // Hide other sections
    resultsContainer.innerHTML = '';
    noResults.style.display = 'none';
    footer.style.display = 'none';

    // Get recent searches
    const recentSearches = window.SearchService.getRecentSearches(5);

    if (recentSearches.length === 0) {
      recentSection.style.display = 'none';
      return;
    }

    // Render recent searches
    recentList.innerHTML = recentSearches.map(search => `
      <div class="recent-search-item" onclick="window.SearchComponent.searchFromHistory('${search.query}')">
        <span class="recent-icon">🕐</span>
        <span class="recent-query">${search.query}</span>
      </div>
    `).join('');

    recentSection.style.display = 'block';
    this.openSearch();
  }

  // Search from history - Recent search pe click karne pe
  searchFromHistory(query) {
    this.searchInput.value = query;
    this.handleSearchInput(query);
  }

  // Clear search history
  clearHistory() {
    window.SearchService.clearSearchHistory();
    const recentSection = document.getElementById('searchRecent');
    if (recentSection) {
      recentSection.style.display = 'none';
    }
    
    if (window.NotificationService) {
      window.NotificationService.show('Search history cleared', 'success');
    }
  }

  // Show full search results - All results view
  showFullSearchResults(query) {
    // Full page search results pe redirect karo
    window.location.href = `search-results.html?q=${encodeURIComponent(query)}`;
  }

  // View all results button click
  viewAllResults() {
    if (this.currentQuery && this.currentQuery.trim() !== '') {
      this.showFullSearchResults(this.currentQuery);
    }
  }

  // Show loading state
  showLoading() {
    const loading = document.getElementById('searchLoading');
    const resultsContainer = document.getElementById('searchResultsContainer');
    
    if (loading) loading.style.display = 'flex';
    if (resultsContainer) resultsContainer.style.display = 'none';
  }

  // Hide loading state
  hideLoading() {
    const loading = document.getElementById('searchLoading');
    const resultsContainer = document.getElementById('searchResultsContainer');
    
    if (loading) loading.style.display = 'none';
    if (resultsContainer) resultsContainer.style.display = 'block';
  }

  // Show error state
  showError(error) {
    this.hideLoading();
    
    const errorElement = document.getElementById('searchError');
    if (errorElement) {
      errorElement.style.display = 'flex';
      setTimeout(() => {
        errorElement.style.display = 'none';
      }, 3000);
    }

    console.error('Search error:', error);
  }

  // Hide error state
  hideError() {
    const errorElement = document.getElementById('searchError');
    if (errorElement) {
      errorElement.style.display = 'none';
    }
  }

  // Open search dropdown
  openSearch() {
    if (this.searchDropdown) {
      this.searchDropdown.style.display = 'block';
    }
    if (this.searchOverlay) {
      this.searchOverlay.style.display = 'block';
    }
    this.isSearchActive = true;
  }

  // Close search dropdown
  closeSearch() {
    if (this.searchDropdown) {
      this.searchDropdown.style.display = 'none';
    }
    if (this.searchOverlay) {
      this.searchOverlay.style.display = 'none';
    }
    this.isSearchActive = false;
    
    // Cancel any ongoing search
    window.SearchService.cancelSearch();
  }

  // Clear search
  clearSearch() {
    if (this.searchInput) {
      this.searchInput.value = '';
      this.currentQuery = '';
    }
    this.closeSearch();
  }
}

// Global instance banao
window.SearchComponent = new SearchComponent();
