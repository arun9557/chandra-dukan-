import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
  orderStatus: {
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  },
};

const orderSlice = createSlice({
  name: 'orders',
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
    
    // Set all orders
    setOrders: (state, action) => {
      state.orders = action.payload;
      state.loading = false;
      state.error = null;
    },
    
    // Set current order
    setCurrentOrder: (state, action) => {
      state.currentOrder = action.payload;
    },
    
    // Update order status
    updateOrderStatus: (state, action) => {
      const { orderId, status } = action.payload;
      const orderIndex = state.orders.findIndex(order => order.id === orderId);
      if (orderIndex !== -1) {
        state.orders[orderIndex].status = status;
      }
      if (state.currentOrder && state.currentOrder.id === orderId) {
        state.currentOrder.status = status;
      }
    },
    
    // Update order status counts
    updateOrderStatusCounts: (state, action) => {
      state.orderStatus = {
        ...state.orderStatus,
        ...action.payload,
      };
    },
    
    // Reset order state
    resetOrderState: () => initialState,
  },
});

export const {
  setLoading,
  setError,
  setOrders,
  setCurrentOrder,
  updateOrderStatus,
  updateOrderStatusCounts,
  resetOrderState,
} = orderSlice.actions;

export default orderSlice.reducer;
