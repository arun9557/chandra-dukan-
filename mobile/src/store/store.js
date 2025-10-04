// Redux Store Configuration - Redux store का configuration
// State management for Chandra Dukan mobile app

import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from '@reduxjs/toolkit';

// Reducers
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import productReducer from './slices/productSlice';
import orderReducer from './slices/orderSlice';
import notificationReducer from './slices/notificationSlice';
import locationReducer from './slices/locationSlice';
import dashboardReducer from './slices/dashboardSlice';

// Persist configuration - Persist configuration
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'cart', 'location'], // Only persist these reducers
  blacklist: ['notifications'], // Don't persist notifications
};

// Root reducer - Root reducer
const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  products: productReducer,
  orders: orderReducer,
  notifications: notificationReducer,
  location: locationReducer,
  dashboard: dashboardReducer,
});

// Persisted reducer - Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store - Store configure करना
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: __DEV__,
});

// Persistor - Persistor
export const persistor = persistStore(store);

export default store;
