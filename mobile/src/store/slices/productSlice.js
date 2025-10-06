import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [],
  featuredProducts: [],
  categories: [],
  loading: false,
  error: null,
  selectedProduct: null,
  searchResults: [],
  filters: {
    category: null,
    priceRange: null,
    sortBy: 'latest',
  },
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    // Set loading state
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    
    // Set error
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    
    // Set all products
    setProducts: (state, action) => {
      state.products = action.payload;
      state.loading = false;
      state.error = null;
    },
    
    // Set featured products
    setFeaturedProducts: (state, action) => {
      state.featuredProducts = action.payload;
    },
    
    // Set categories
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    
    // Set selected product
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },
    
    // Update product quantity
    updateProductQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const product = state.products.find(p => p.id === productId);
      if (product) {
        product.quantity = quantity;
      }
    },
    
    // Set search results
    setSearchResults: (state, action) => {
      state.searchResults = action.payload;
    },
    
    // Update filters
    updateFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
    },
    
    // Reset product state
    resetProductState: () => initialState,
  },
});

export const {
  setLoading,
  setError,
  setProducts,
  setFeaturedProducts,
  setCategories,
  setSelectedProduct,
  updateProductQuantity,
  setSearchResults,
  updateFilters,
  resetProductState,
} = productSlice.actions;

export default productSlice.reducer;
