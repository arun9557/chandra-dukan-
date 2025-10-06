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
    // Disabled: Using header search instead
    // Old search section removed for cleaner UI
    console.log('SearchBar: Using header search, old search section disabled');
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

      searchInput.addEventListener('input', () => this.updateSuggestions());
      searchInput.addEventListener('focus', () => this.updateSuggestions());
      searchInput.addEventListener('blur', () => setTimeout(() => this.toggleSuggestions(false), 150));
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

  // Suggestions based on product names
  updateSuggestions() {
    const input = document.getElementById('searchInput');
    const box = document.getElementById('searchSuggestions');
    if (!input || !box) return;
    const q = input.value.trim().toLowerCase();
    const products = window.AppData?.products || [];
    const matches = q ? products.filter(p => p.name.toLowerCase().includes(q)).slice(0, 8) : [];
    if (matches.length === 0) { this.toggleSuggestions(false); return; }
    box.innerHTML = matches.map(m => `<div class="suggestion" role="option" data-name="${m.name}">${m.name}</div>`).join('');
    this.toggleSuggestions(true);
    box.querySelectorAll('.suggestion').forEach(el => {
      el.addEventListener('mousedown', (e) => {
        const name = e.currentTarget.getAttribute('data-name');
        input.value = name;
        this.performSearch();
        this.toggleSuggestions(false);
      });
    });
  }

  toggleSuggestions(show) {
    const box = document.getElementById('searchSuggestions');
    if (!box) return;
    box.classList.toggle('hidden', !show);
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
        category: this.currentFilter,
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
