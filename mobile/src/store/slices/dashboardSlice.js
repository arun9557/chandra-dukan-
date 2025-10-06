import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  stats: {
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
    monthlyRevenue: [],
    topProducts: [],
    recentOrders: [],
  },
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
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
    
    // Set dashboard stats
    setDashboardStats: (state, action) => {
      state.stats = {
        ...state.stats,
        ...action.payload,
      };
      state.loading = false;
      state.error = null;
    },
    
    // Update order status in recent orders
    updateRecentOrderStatus: (state, action) => {
      const { orderId, status } = action.payload;
      const orderIndex = state.stats.recentOrders.findIndex(
        order => order.id === orderId
      );
      
      if (orderIndex !== -1) {
        state.stats.recentOrders[orderIndex].status = status;
        
        // Update counts if needed
        if (status === 'completed') {
          state.stats.completedOrders += 1;
          state.stats.pendingOrders = Math.max(0, state.stats.pendingOrders - 1);
        }
      }
    },
    
    // Reset dashboard state
    resetDashboardState: () => initialState,
  },
});

export const {
  setLoading,
  setError,
  setDashboardStats,
  updateRecentOrderStatus,
  resetDashboardState,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
