// SearchService - Product search ke liye service
// Realtime search with debouncing aur API integration

class SearchService {
  constructor() {
    this.baseUrl = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? 'http://localhost:3000/api'
      : '/api';
    
    this.searchCache = new Map(); // Search results cache karne ke liye
    this.debounceTimer = null;
    this.debounceDelay = 300; // 300ms debounce
    this.currentRequest = null; // Active request track karne ke liye
  }

  // Debounced search - User typing ke time search delay karna
  debouncedSearch(query, callback, errorCallback) {
    // Purani timer clear karo
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    // Agar query empty hai to immediately empty result return karo
    if (!query || query.trim() === '') {
      callback([]);
      return;
    }

    // Naya timer set karo
    this.debounceTimer = setTimeout(async () => {
      try {
        const results = await this.searchProducts(query);
        callback(results);
      } catch (error) {
        if (errorCallback) {
          errorCallback(error);
        }
        console.error('Search error:', error);
      }
    }, this.debounceDelay);
  }

  // Search products via API
  async searchProducts(query) {
    // Query validate karo
    if (!query || query.trim() === '') {
      return [];
    }

    const searchQuery = query.trim();

    // Cache check karo - agar pehle search kiya hai to cached result return karo
    if (this.searchCache.has(searchQuery)) {
      return this.searchCache.get(searchQuery);
    }

    // Agar previous request chal raha hai to cancel karo
    if (this.currentRequest) {
      this.currentRequest.abort();
    }

    try {
      // New AbortController banao
      const controller = new AbortController();
      this.currentRequest = controller;

      const response = await fetch(
        `${this.baseUrl}/products/search/query?query=${encodeURIComponent(searchQuery)}&limit=20`,
        { signal: controller.signal }
      );

      if (!response.ok) {
        throw new Error(`Search failed: ${response.status}`);
      }

      const data = await response.json();
      const results = data.data || [];

      // Results cache me store karo
      this.searchCache.set(searchQuery, results);

      // Cache size manage karo - maximum 50 queries cache rakhenge
      if (this.searchCache.size > 50) {
        const firstKey = this.searchCache.keys().next().value;
        this.searchCache.delete(firstKey);
      }

      return results;
    } catch (error) {
      // Agar request aborted hai to ignore karo
      if (error.name === 'AbortError') {
        console.log('Search request cancelled');
        return [];
      }
      
      console.error('Search API error:', error);
      throw error;
    } finally {
      this.currentRequest = null;
    }
  }

  // Highlight matching text - Search term ko result me highlight karna
  highlightMatch(text, searchTerm) {
    if (!text || !searchTerm) return text;

    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<mark class="search-highlight">$1</mark>');
  }

  // Filter products by category - Local filtering
  filterByCategory(products, categoryId) {
    if (!categoryId) return products;
    return products.filter(p => p.category._id === categoryId || p.category === categoryId);
  }

  // Sort search results
  sortResults(products, sortBy = 'relevance') {
    const sorted = [...products];

    switch (sortBy) {
      case 'price-low':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sorted.sort((a, b) => b.price - a.price);
      case 'name':
        return sorted.sort((a, b) => a.name.localeCompare(b.name));
      case 'popular':
        return sorted.sort((a, b) => (b.views || 0) - (a.views || 0));
      case 'relevance':
      default:
        return sorted; // API se already sorted aata hai
    }
  }

  // Clear search cache
  clearCache() {
    this.searchCache.clear();
  }

  // Cancel ongoing search request
  cancelSearch() {
    if (this.currentRequest) {
      this.currentRequest.abort();
      this.currentRequest = null;
    }
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
  }

  // Get search suggestions - Popular products based on views
  async getSearchSuggestions(limit = 10) {
    try {
      const response = await fetch(`${this.baseUrl}/products?sort=views&limit=${limit}`);
      if (!response.ok) {
        throw new Error('Failed to fetch suggestions');
      }
      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Failed to get suggestions:', error);
      return [];
    }
  }

  // Track search analytics - Kaun sa term kitni baar search hua
  trackSearch(query) {
    if (!query || query.trim() === '') return;

    const searches = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    
    // New search entry banao
    const searchEntry = {
      query: query.trim(),
      timestamp: new Date().toISOString()
    };

    // History me add karo
    searches.unshift(searchEntry);

    // Maximum 50 searches save karo
    const limitedSearches = searches.slice(0, 50);
    localStorage.setItem('searchHistory', JSON.stringify(limitedSearches));
  }

  // Get recent searches - Recent search history get karna
  getRecentSearches(limit = 5) {
    const searches = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    
    // Unique queries only
    const uniqueSearches = [];
    const seen = new Set();
    
    for (const search of searches) {
      if (!seen.has(search.query)) {
        uniqueSearches.push(search);
        seen.add(search.query);
      }
      if (uniqueSearches.length >= limit) break;
    }
    
    return uniqueSearches;
  }

  // Clear search history
  clearSearchHistory() {
    localStorage.removeItem('searchHistory');
  }
}

// Global instance banao
window.SearchService = new SearchService();
