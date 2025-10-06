import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
};

const notificationSlice = createSlice({
  name: 'notifications',
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
    
    // Set notifications
    setNotifications: (state, action) => {
      state.notifications = action.payload;
      state.unreadCount = action.payload.filter(n => !n.read).length;
      state.loading = false;
      state.error = null;
    },
    
    // Add new notification
    addNotification: (state, action) => {
      state.notifications = [action.payload, ...state.notifications];
      state.unreadCount += 1;
    },
    
    // Mark as read
    markAsRead: (state, action) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    
    // Mark all as read
    markAllAsRead: (state) => {
      state.notifications = state.notifications.map(notification => ({
        ...notification,
        read: true,
      }));
      state.unreadCount = 0;
    },
    
    // Reset notification state
    resetNotificationState: () => initialState,
  },
});

export const {
  setLoading,
  setError,
  setNotifications,
  addNotification,
  markAsRead,
  markAllAsRead,
  resetNotificationState,
} = notificationSlice.actions;

export default notificationSlice.reducer;
