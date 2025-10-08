// FilterService - Product filtering aur sorting ke liye service
// Backend API se filtered products fetch karna

class FilterService {
  constructor() {
    this.baseUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? 'http://localhost:3000/api'
      : '/api';
    
    this.currentFilters = {
      categories: [],      // Selected categories
      priceRange: {        // Price range
        min: null,
        max: null
      },
      inStock: false,      // In stock only
      hasDiscount: false,  // Has discount only
      featured: false,     // Featured only
      tags: []            // Selected tags
    };
    
    this.currentSort = 'newest';  // Default sort
    this.isLoading = false;
  }

  // Get filtered products - Filtered products fetch karna
  async getFilteredProducts(filters = null, sort = null, limit = 50, offset = 0) {
    try {
      this.isLoading = true;
      
      // Agar filters diye hain to use karo, nahi to current filters use karo
      const activeFilters = filters || this.currentFilters;
      const activeSort = sort || this.currentSort;
      
      // Build query parameters - Query params banana
      const params = new URLSearchParams();
      
      // Category filter
      if (activeFilters.categories && activeFilters.categories.length > 0) {
        params.append('category', activeFilters.categories.join(','));
      }
      
      // Price range filter
      if (activeFilters.priceRange.min !== null) {
        params.append('minPrice', activeFilters.priceRange.min);
      }
      if (activeFilters.priceRange.max !== null) {
        params.append('maxPrice', activeFilters.priceRange.max);
      }
      
      // In stock filter
      if (activeFilters.inStock) {
        params.append('inStock', 'true');
      }
      
      // Has discount filter
      if (activeFilters.hasDiscount) {
        params.append('hasDiscount', 'true');
      }
      
      // Featured filter
      if (activeFilters.featured) {
        params.append('featured', 'true');
      }
      
      // Tags filter
      if (activeFilters.tags && activeFilters.tags.length > 0) {
        params.append('tags', activeFilters.tags.join(','));
      }
      
      // Sort
      if (activeSort) {
        params.append('sort', activeSort);
      }
      
      // Pagination
      params.append('limit', limit);
      params.append('offset', offset);
      
      // Always get active products only
      params.append('active', 'true');
      
      // API call karo
      const response = await fetch(`${this.baseUrl}/products?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      this.isLoading = false;
      
      return data;
      
    } catch (error) {
      this.isLoading = false;
      console.error('Failed to fetch filtered products:', error);
      throw error;
    }
  }

  // Update filters - Filters update karna
  updateFilters(newFilters) {
    this.currentFilters = {
      ...this.currentFilters,
      ...newFilters
    };
  }

  // Add category filter - Category filter add karna
  addCategoryFilter(categoryId) {
    if (!this.currentFilters.categories.includes(categoryId)) {
      this.currentFilters.categories.push(categoryId);
    }
  }

  // Remove category filter - Category filter remove karna
  removeCategoryFilter(categoryId) {
    this.currentFilters.categories = this.currentFilters.categories.filter(
      id => id !== categoryId
    );
  }

  // Toggle category filter - Category filter toggle karna
  toggleCategoryFilter(categoryId) {
    if (this.currentFilters.categories.includes(categoryId)) {
      this.removeCategoryFilter(categoryId);
    } else {
      this.addCategoryFilter(categoryId);
    }
  }

  // Set price range - Price range set karna
  setPriceRange(min, max) {
    this.currentFilters.priceRange = {
      min: min !== null && min !== '' ? parseFloat(min) : null,
      max: max !== null && max !== '' ? parseFloat(max) : null
    };
  }

  // Toggle in stock filter - In stock filter toggle karna
  toggleInStock() {
    this.currentFilters.inStock = !this.currentFilters.inStock;
  }

  // Toggle discount filter - Discount filter toggle karna
  toggleDiscount() {
    this.currentFilters.hasDiscount = !this.currentFilters.hasDiscount;
  }

  // Toggle featured filter - Featured filter toggle karna
  toggleFeatured() {
    this.currentFilters.featured = !this.currentFilters.featured;
  }

  // Set sort - Sort option set karna
  setSort(sortOption) {
    this.currentSort = sortOption;
  }

  // Clear all filters - Saare filters clear karna
  clearAllFilters() {
    this.currentFilters = {
      categories: [],
      priceRange: {
        min: null,
        max: null
      },
      inStock: false,
      hasDiscount: false,
      featured: false,
      tags: []
    };
  }

  // Get active filter count - Kitne filters active hain
  getActiveFilterCount() {
    let count = 0;
    
    if (this.currentFilters.categories.length > 0) count += this.currentFilters.categories.length;
    if (this.currentFilters.priceRange.min !== null || this.currentFilters.priceRange.max !== null) count++;
    if (this.currentFilters.inStock) count++;
    if (this.currentFilters.hasDiscount) count++;
    if (this.currentFilters.featured) count++;
    if (this.currentFilters.tags.length > 0) count += this.currentFilters.tags.length;
    
    return count;
  }

  // Check if any filters active - Koi filter active hai ya nahi
  hasActiveFilters() {
    return this.getActiveFilterCount() > 0;
  }

  // Get current filters - Current filters get karna
  getCurrentFilters() {
    return { ...this.currentFilters };
  }

  // Get current sort - Current sort get karna
  getCurrentSort() {
    return this.currentSort;
  }

  // Get filter chips - Active filters ke chips/tags banana
  getFilterChips() {
    const chips = [];
    
    // Category chips
    this.currentFilters.categories.forEach(catId => {
      chips.push({
        type: 'category',
        id: catId,
        label: catId, // Category name se replace hoga
        value: catId
      });
    });
    
    // Price range chip
    if (this.currentFilters.priceRange.min !== null || this.currentFilters.priceRange.max !== null) {
      const min = this.currentFilters.priceRange.min || 0;
      const max = this.currentFilters.priceRange.max || '∞';
      chips.push({
        type: 'price',
        id: 'price-range',
        label: `₹${min} - ₹${max}`,
        value: this.currentFilters.priceRange
      });
    }
    
    // In stock chip
    if (this.currentFilters.inStock) {
      chips.push({
        type: 'inStock',
        id: 'in-stock',
        label: 'In Stock',
        value: true
      });
    }
    
    // Discount chip
    if (this.currentFilters.hasDiscount) {
      chips.push({
        type: 'discount',
        id: 'has-discount',
        label: 'On Discount',
        value: true
      });
    }
    
    // Featured chip
    if (this.currentFilters.featured) {
      chips.push({
        type: 'featured',
        id: 'featured',
        label: 'Featured',
        value: true
      });
    }
    
    // Tags chips
    this.currentFilters.tags.forEach(tag => {
      chips.push({
        type: 'tag',
        id: tag,
        label: tag,
        value: tag
      });
    });
    
    return chips;
  }

  // Remove filter by chip - Chip se filter remove karna
  removeFilterByChip(chip) {
    switch (chip.type) {
      case 'category':
        this.removeCategoryFilter(chip.value);
        break;
      case 'price':
        this.setPriceRange(null, null);
        break;
      case 'inStock':
        this.currentFilters.inStock = false;
        break;
      case 'discount':
        this.currentFilters.hasDiscount = false;
        break;
      case 'featured':
        this.currentFilters.featured = false;
        break;
      case 'tag':
        this.currentFilters.tags = this.currentFilters.tags.filter(t => t !== chip.value);
        break;
    }
  }

  // Build URL with filters - URL me filters add karna (for sharing/bookmarking)
  buildURLWithFilters() {
    const params = new URLSearchParams();
    
    if (this.currentFilters.categories.length > 0) {
      params.append('category', this.currentFilters.categories.join(','));
    }
    if (this.currentFilters.priceRange.min !== null) {
      params.append('minPrice', this.currentFilters.priceRange.min);
    }
    if (this.currentFilters.priceRange.max !== null) {
      params.append('maxPrice', this.currentFilters.priceRange.max);
    }
    if (this.currentFilters.inStock) {
      params.append('inStock', 'true');
    }
    if (this.currentFilters.hasDiscount) {
      params.append('hasDiscount', 'true');
    }
    if (this.currentFilters.featured) {
      params.append('featured', 'true');
    }
    if (this.currentSort) {
      params.append('sort', this.currentSort);
    }
    
    return params.toString();
  }

  // Load filters from URL - URL se filters load karna
  loadFiltersFromURL() {
    const params = new URLSearchParams(window.location.search);
    
    // Categories
    const category = params.get('category');
    if (category) {
      this.currentFilters.categories = category.split(',');
    }
    
    // Price range
    const minPrice = params.get('minPrice');
    const maxPrice = params.get('maxPrice');
    if (minPrice || maxPrice) {
      this.setPriceRange(minPrice, maxPrice);
    }
    
    // Boolean filters
    this.currentFilters.inStock = params.get('inStock') === 'true';
    this.currentFilters.hasDiscount = params.get('hasDiscount') === 'true';
    this.currentFilters.featured = params.get('featured') === 'true';
    
    // Sort
    const sort = params.get('sort');
    if (sort) {
      this.currentSort = sort;
    }
  }
}

// Global instance banao
window.FilterService = new FilterService();
