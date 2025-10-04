// Cart Slice - Cart का Redux slice
// Shopping cart state management

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import CartService from '../../services/CartService';

// Initial state - Initial state
const initialState = {
  items: [],
  total: 0,
  itemCount: 0,
  deliveryCharges: 0,
  finalTotal: 0,
  isLoading: false,
  error: null,
};

// Async thunks - Async thunks
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity = 1 }, { rejectWithValue }) => {
    try {
      const result = await CartService.addItem(productId, quantity);
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const result = await CartService.updateQuantity(productId, quantity);
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (productId, { rejectWithValue }) => {
    try {
      const result = await CartService.removeItem(productId);
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      const result = await CartService.clearCart();
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const loadCart = createAsyncThunk(
  'cart/loadCart',
  async (_, { rejectWithValue }) => {
    try {
      const result = await CartService.getCart();
      return result;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Cart slice - Cart slice
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Calculate totals - Totals calculate करना
    calculateTotals: (state) => {
      const subtotal = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const deliveryCharges = subtotal >= 200 ? 0 : 30;
      const finalTotal = subtotal + deliveryCharges;
      
      state.total = subtotal;
      state.deliveryCharges = deliveryCharges;
      state.finalTotal = finalTotal;
      state.itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);
    },
    
    // Set loading - Loading set करना
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    
    // Clear error - Error clear करना
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Add to cart - Cart में add करना
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        const { product, quantity } = action.payload;
        
        const existingItem = state.items.find(item => item.id === product.id);
        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          state.items.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: quantity,
            image: product.image,
            category_id: product.category_id,
          });
        }
        
        // Recalculate totals
        cartSlice.caseReducers.calculateTotals(state);
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Update cart item - Cart item update करना
      .addCase(updateCartItem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.isLoading = false;
        const { productId, quantity } = action.payload;
        
        const item = state.items.find(item => item.id === productId);
        if (item) {
          if (quantity <= 0) {
            state.items = state.items.filter(item => item.id !== productId);
          } else {
            item.quantity = quantity;
          }
        }
        
        // Recalculate totals
        cartSlice.caseReducers.calculateTotals(state);
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Remove from cart - Cart से remove करना
      .addCase(removeFromCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.isLoading = false;
        const { productId } = action.payload;
        
        state.items = state.items.filter(item => item.id !== productId);
        
        // Recalculate totals
        cartSlice.caseReducers.calculateTotals(state);
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Clear cart - Cart clear करना
      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
        state.total = 0;
        state.itemCount = 0;
        state.deliveryCharges = 0;
        state.finalTotal = 0;
        state.error = null;
      })
      
      // Load cart - Cart load करना
      .addCase(loadCart.fulfilled, (state, action) => {
        state.items = action.payload.items || [];
        state.total = action.payload.total || 0;
        state.itemCount = action.payload.itemCount || 0;
        state.deliveryCharges = action.payload.deliveryCharges || 0;
        state.finalTotal = action.payload.finalTotal || 0;
      });
  },
});

export const { calculateTotals, setLoading, clearError } = cartSlice.actions;
export default cartSlice.reducer;
