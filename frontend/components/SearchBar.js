// SearchBar Component - Search bar का component
// Modern search functionality with filters

class SearchBar {
  constructor() {
    this.currentSearch = '';
    this.currentFilter = '';
  }

  // Initialize search bar - Search bar initialize करना
  init() {
    this.render();
    this.setupEventListeners();
  }

  // Render search bar HTML - Search bar का HTML render करना
  render() {
    const searchHTML = `
      <section class="search-section">
        <div class="container">
          <div class="search-bar">
            <input type="text" id="searchInput" class="form-control" 
                   placeholder="कुछ भी Search करें... (Search anything)">
            <button class="btn btn--primary" id="searchBtn">खोजें</button>
            <button class="btn btn--outline" id="clearSearchBtn">Clear</button>
          </div>
          <div class="search-filters">
            <select class="form-control category-filter" id="categoryFilter">
              <option value="">सभी Categories (All Categories)</option>
            </select>
            <select class="form-control sort-filter" id="sortFilter">
              <option value="name">Name (नाम)</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="stock">Stock Available</option>
            </select>
          </div>
        </div>
      </section>
    `;
    
    // Insert after header
    const header = document.querySelector('.header');
    if (header) {
      header.insertAdjacentHTML('afterend', searchHTML);
    }
  }

  // Setup event listeners - Event listeners setup करना
  setupEventListeners() {
    const searchBtn = document.getElementById('searchBtn');
    const clearSearchBtn = document.getElementById('clearSearchBtn');
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const sortFilter = document.getElementById('sortFilter');

    if (searchBtn) {
      searchBtn.addEventListener('click', () => this.performSearch());
    }

    if (clearSearchBtn) {
      clearSearchBtn.addEventListener('click', () => this.clearSearch());
    }

    if (searchInput) {
      searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.performSearch();
        }
      });
    }

    if (categoryFilter) {
      categoryFilter.addEventListener('change', () => this.filterByCategory());
    }

    if (sortFilter) {
      sortFilter.addEventListener('change', () => this.sortProducts());
    }

    // Populate category filter
    this.populateCategoryFilter();
  }

  // Perform search - Search करना
  performSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      this.currentSearch = searchInput.value.trim();
      this.currentFilter = ''; // Clear category filter when searching
      
      const categoryFilter = document.getElementById('categoryFilter');
      if (categoryFilter) categoryFilter.value = '';
      
      this.triggerProductUpdate();
    }
  }

  // Clear search - Search clear करना
  clearSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.value = '';
      this.currentSearch = '';
      this.triggerProductUpdate();
    }
  }

  // Filter by category - Category से filter करना
  filterByCategory() {
    const categoryFilter = document.getElementById('categoryFilter');
    if (categoryFilter) {
      this.currentFilter = categoryFilter.value;
      this.currentSearch = ''; // Clear search when filtering by category
      
      const searchInput = document.getElementById('searchInput');
      if (searchInput) searchInput.value = '';
      
      this.triggerProductUpdate();
    }
  }

  // Sort products - Products को sort करना
  sortProducts() {
    this.triggerProductUpdate();
  }

  // Trigger product update - Product update trigger करना
  triggerProductUpdate() {
    // Dispatch custom event for product update
    const event = new CustomEvent('productUpdate', {
      detail: {
        search: this.currentSearch,
        filter: this.currentFilter,
        sort: document.getElementById('sortFilter')?.value || 'name'
      }
    });
    document.dispatchEvent(event);
  }

  // Populate category filter - Category filter populate करना
  populateCategoryFilter() {
    const categoryFilter = document.getElementById('categoryFilter');
    if (!categoryFilter) return;

    // Get categories from app data
    const categories = window.AppData?.categories || [];
    
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category.id;
      option.textContent = `${category.name} - ${category.hindi_name}`;
      categoryFilter.appendChild(option);
    });
  }

  // Get current search state - Current search state get करना
  getSearchState() {
    return {
      search: this.currentSearch,
      filter: this.currentFilter,
      sort: document.getElementById('sortFilter')?.value || 'name'
    };
  }
}

// Export for use in main app
window.SearchBar = SearchBar;
