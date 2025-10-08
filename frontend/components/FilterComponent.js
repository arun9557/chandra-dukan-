// FilterComponent - Product filters ka UI component
// Blinkit-style filters with chips, sliders, checkboxes

class FilterComponent {
  constructor() {
    this.filterContainer = null;
    this.activeFilters = [];
    this.categories = [];
    this.onFilterChange = null; // Callback function for filter changes
    
    this.init();
  }

  // Initialize filter component
  async init() {
    // Categories fetch karo
    await this.loadCategories();
    
    // Filter container create karo
    this.createFilterUI();
    
    // Event listeners attach karo
    this.attachEventListeners();
    
    // URL se filters load karo
    window.FilterService.loadFiltersFromURL();
  }

  // Load categories from API - Categories fetch karna
  async loadCategories() {
    try {
      const baseUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:3000/api'
        : '/api';
      
      const response = await fetch(`${baseUrl}/categories`);
      if (response.ok) {
        const data = await response.json();
        this.categories = data.data || [];
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
      // Fallback to DataService if available
      if (window.DataService) {
        this.categories = window.DataService.getCategories();
      }
    }
  }

  // Create filter UI - Filter UI banana
  createFilterUI() {
    const existingFilter = document.getElementById('filterSidebar');
    if (existingFilter) return; // Already exists

    const filterHTML = `
      <!-- Filter Sidebar - Desktop -->
      <aside class="filter-sidebar" id="filterSidebar">
        <div class="filter-header">
          <h3>
            <span class="filter-icon">🎯</span>
            Filters
          </h3>
          <button class="filter-close-btn" id="filterCloseBtn">✕</button>
        </div>

        <!-- Active Filter Chips -->
        <div class="active-filters-section" id="activeFiltersSection" style="display: none;">
          <div class="active-filters-header">
            <span>Active Filters (<span id="filterCount">0</span>)</span>
            <button class="clear-filters-btn" id="clearFiltersBtn">Clear All</button>
          </div>
          <div class="filter-chips-container" id="filterChipsContainer"></div>
        </div>

        <!-- Filter Sections -->
        <div class="filter-sections">
          
          <!-- Category Filter -->
          <div class="filter-section">
            <h4 class="filter-section-title">
              <span>Categories</span>
              <span class="filter-section-icon">▼</span>
            </h4>
            <div class="filter-section-content">
              <div class="filter-options" id="categoryFilterOptions">
                <!-- Categories will be loaded here -->
              </div>
            </div>
          </div>

          <!-- Price Range Filter -->
          <div class="filter-section">
            <h4 class="filter-section-title">
              <span>Price Range</span>
              <span class="filter-section-icon">▼</span>
            </h4>
            <div class="filter-section-content">
              <div class="price-range-inputs">
                <input type="number" 
                       id="minPriceInput" 
                       class="price-input" 
                       placeholder="Min" 
                       min="0">
                <span class="price-separator">to</span>
                <input type="number" 
                       id="maxPriceInput" 
                       class="price-input" 
                       placeholder="Max" 
                       min="0">
              </div>
              <button class="apply-price-btn" id="applyPriceBtn">Apply</button>
              
              <!-- Quick price range buttons -->
              <div class="quick-price-ranges">
                <button class="quick-price-btn" data-min="0" data-max="50">Under ₹50</button>
                <button class="quick-price-btn" data-min="50" data-max="100">₹50 - ₹100</button>
                <button class="quick-price-btn" data-min="100" data-max="200">₹100 - ₹200</button>
                <button class="quick-price-btn" data-min="200" data-max="500">₹200 - ₹500</button>
                <button class="quick-price-btn" data-min="500" data-max="">Above ₹500</button>
              </div>
            </div>
          </div>

          <!-- Availability Filter -->
          <div class="filter-section">
            <h4 class="filter-section-title">
              <span>Availability</span>
              <span class="filter-section-icon">▼</span>
            </h4>
            <div class="filter-section-content">
              <label class="filter-checkbox">
                <input type="checkbox" id="inStockFilter">
                <span class="checkbox-custom"></span>
                <span class="checkbox-label">In Stock Only</span>
              </label>
            </div>
          </div>

          <!-- Discount Filter -->
          <div class="filter-section">
            <h4 class="filter-section-title">
              <span>Offers & Discounts</span>
              <span class="filter-section-icon">▼</span>
            </h4>
            <div class="filter-section-content">
              <label class="filter-checkbox">
                <input type="checkbox" id="discountFilter">
                <span class="checkbox-custom"></span>
                <span class="checkbox-label">Products on Discount</span>
              </label>
              <label class="filter-checkbox">
                <input type="checkbox" id="featuredFilter">
                <span class="checkbox-custom"></span>
                <span class="checkbox-label">Featured Products</span>
              </label>
            </div>
          </div>

        </div>
      </aside>

      <!-- Mobile Filter Button -->
      <button class="mobile-filter-btn" id="mobileFilterBtn">
        <span class="filter-btn-icon">🎯</span>
        <span class="filter-btn-text">Filters</span>
        <span class="filter-btn-badge" id="mobileFilterBadge" style="display: none;">0</span>
      </button>

      <!-- Filter Overlay -->
      <div class="filter-overlay" id="filterOverlay"></div>
    `;

    // Insert into page
    const mainContent = document.querySelector('.container') || document.body;
    mainContent.insertAdjacentHTML('afterbegin', filterHTML);

    // Render categories
    this.renderCategories();
  }

  // Render category options - Category checkboxes render karna
  renderCategories() {
    const container = document.getElementById('categoryFilterOptions');
    if (!container) return;

    const currentFilters = window.FilterService.getCurrentFilters();

    container.innerHTML = this.categories.map(cat => `
      <label class="filter-checkbox category-checkbox" data-category-id="${cat._id || cat.id}">
        <input type="checkbox" 
               class="category-filter-checkbox" 
               value="${cat._id || cat.id}"
               ${currentFilters.categories.includes(cat._id || cat.id) ? 'checked' : ''}>
        <span class="checkbox-custom"></span>
        <span class="checkbox-label">
          <span class="category-icon">${cat.icon || '📦'}</span>
          ${cat.name}
        </span>
      </label>
    `).join('');
  }

  // Attach event listeners - Event listeners lagana
  attachEventListeners() {
    // Category checkboxes
    document.addEventListener('change', (e) => {
      if (e.target.classList.contains('category-filter-checkbox')) {
        const categoryId = e.target.value;
        window.FilterService.toggleCategoryFilter(categoryId);
        this.applyFilters();
      }
    });

    // In stock filter
    const inStockFilter = document.getElementById('inStockFilter');
    if (inStockFilter) {
      inStockFilter.addEventListener('change', () => {
        window.FilterService.toggleInStock();
        this.applyFilters();
      });
    }

    // Discount filter
    const discountFilter = document.getElementById('discountFilter');
    if (discountFilter) {
      discountFilter.addEventListener('change', () => {
        window.FilterService.toggleDiscount();
        this.applyFilters();
      });
    }

    // Featured filter
    const featuredFilter = document.getElementById('featuredFilter');
    if (featuredFilter) {
      featuredFilter.addEventListener('change', () => {
        window.FilterService.toggleFeatured();
        this.applyFilters();
      });
    }

    // Apply price button
    const applyPriceBtn = document.getElementById('applyPriceBtn');
    if (applyPriceBtn) {
      applyPriceBtn.addEventListener('click', () => {
        const min = document.getElementById('minPriceInput').value;
        const max = document.getElementById('maxPriceInput').value;
        window.FilterService.setPriceRange(min, max);
        this.applyFilters();
      });
    }

    // Quick price range buttons
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('quick-price-btn')) {
        const min = e.target.dataset.min;
        const max = e.target.dataset.max;
        
        // Update input fields
        document.getElementById('minPriceInput').value = min || '';
        document.getElementById('maxPriceInput').value = max || '';
        
        window.FilterService.setPriceRange(min, max);
        this.applyFilters();
      }
    });

    // Clear all filters
    const clearFiltersBtn = document.getElementById('clearFiltersBtn');
    if (clearFiltersBtn) {
      clearFiltersBtn.addEventListener('click', () => {
        this.clearAllFilters();
      });
    }

    // Mobile filter button
    const mobileFilterBtn = document.getElementById('mobileFilterBtn');
    if (mobileFilterBtn) {
      mobileFilterBtn.addEventListener('click', () => {
        this.openMobileFilter();
      });
    }

    // Close filter (mobile)
    const filterCloseBtn = document.getElementById('filterCloseBtn');
    if (filterCloseBtn) {
      filterCloseBtn.addEventListener('click', () => {
        this.closeMobileFilter();
      });
    }

    // Filter overlay (mobile)
    const filterOverlay = document.getElementById('filterOverlay');
    if (filterOverlay) {
      filterOverlay.addEventListener('click', () => {
        this.closeMobileFilter();
      });
    }

    // Filter section collapse/expand
    document.addEventListener('click', (e) => {
      if (e.target.closest('.filter-section-title')) {
        const section = e.target.closest('.filter-section');
        section.classList.toggle('collapsed');
      }
    });
  }

  // Apply filters - Filters apply karna aur products reload karna
  applyFilters() {
    // Update filter chips
    this.updateFilterChips();
    
    // Update URL
    this.updateURL();
    
    // Callback function call karo (products reload karne ke liye)
    if (this.onFilterChange && typeof this.onFilterChange === 'function') {
      this.onFilterChange();
    }
  }

  // Update filter chips display - Active filter chips dikhana
  updateFilterChips() {
    const chips = window.FilterService.getFilterChips();
    const container = document.getElementById('filterChipsContainer');
    const section = document.getElementById('activeFiltersSection');
    const countElement = document.getElementById('filterCount');
    const mobileBadge = document.getElementById('mobileFilterBadge');

    // Update count
    if (countElement) countElement.textContent = chips.length;
    if (mobileBadge) {
      mobileBadge.textContent = chips.length;
      mobileBadge.style.display = chips.length > 0 ? 'flex' : 'none';
    }

    // Show/hide section
    if (section) {
      section.style.display = chips.length > 0 ? 'block' : 'none';
    }

    // Render chips
    if (container) {
      container.innerHTML = chips.map(chip => this.renderFilterChip(chip)).join('');
      
      // Add click handlers for removing chips
      container.querySelectorAll('.filter-chip-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const chipId = e.target.closest('.filter-chip').dataset.chipId;
          const chip = chips.find(c => c.id === chipId);
          if (chip) {
            this.removeFilterChip(chip);
          }
        });
      });
    }
  }

  // Render single filter chip - Ek filter chip ka HTML
  renderFilterChip(chip) {
    return `
      <div class="filter-chip" data-chip-id="${chip.id}">
        <span class="filter-chip-label">${chip.label}</span>
        <button class="filter-chip-remove">✕</button>
      </div>
    `;
  }

  // Remove filter chip - Filter chip remove karna
  removeFilterChip(chip) {
    window.FilterService.removeFilterByChip(chip);
    
    // Update UI based on filter type
    switch (chip.type) {
      case 'category':
        const checkbox = document.querySelector(`input[value="${chip.value}"]`);
        if (checkbox) checkbox.checked = false;
        break;
      case 'price':
        document.getElementById('minPriceInput').value = '';
        document.getElementById('maxPriceInput').value = '';
        break;
      case 'inStock':
        document.getElementById('inStockFilter').checked = false;
        break;
      case 'discount':
        document.getElementById('discountFilter').checked = false;
        break;
      case 'featured':
        document.getElementById('featuredFilter').checked = false;
        break;
    }
    
    this.applyFilters();
  }

  // Clear all filters - Saare filters clear karna
  clearAllFilters() {
    window.FilterService.clearAllFilters();
    
    // Reset all UI elements
    document.querySelectorAll('.category-filter-checkbox').forEach(cb => cb.checked = false);
    document.getElementById('minPriceInput').value = '';
    document.getElementById('maxPriceInput').value = '';
    document.getElementById('inStockFilter').checked = false;
    document.getElementById('discountFilter').checked = false;
    document.getElementById('featuredFilter').checked = false;
    
    this.applyFilters();
  }

  // Update URL with filters - URL me filters add karna
  updateURL() {
    const queryString = window.FilterService.buildURLWithFilters();
    const newURL = queryString ? `${window.location.pathname}?${queryString}` : window.location.pathname;
    window.history.replaceState({}, '', newURL);
  }

  // Open mobile filter drawer - Mobile filter drawer kholna
  openMobileFilter() {
    const sidebar = document.getElementById('filterSidebar');
    const overlay = document.getElementById('filterOverlay');
    
    if (sidebar) sidebar.classList.add('open');
    if (overlay) overlay.classList.add('active');
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
  }

  // Close mobile filter drawer - Mobile filter drawer bandh karna
  closeMobileFilter() {
    const sidebar = document.getElementById('filterSidebar');
    const overlay = document.getElementById('filterOverlay');
    
    if (sidebar) sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('active');
    
    // Restore body scroll
    document.body.style.overflow = '';
  }

  // Set filter change callback - Callback function set karna
  setOnFilterChange(callback) {
    this.onFilterChange = callback;
  }

  // Get current filters - Current filters get karna
  getCurrentFilters() {
    return window.FilterService.getCurrentFilters();
  }
}

// Global instance banao
window.FilterComponent = new FilterComponent();
