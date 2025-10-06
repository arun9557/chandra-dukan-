import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentLocation: null,
  savedAddresses: [],
  selectedAddress: null,
  loading: false,
  error: null,
  hasLocationPermission: false,
  isLocationEnabled: false,
  nearbyStores: [],
  selectedStore: null,
};

const locationSlice = createSlice({
  name: 'location',
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
    
    // Set current location
    setCurrentLocation: (state, action) => {
      state.currentLocation = action.payload;
      state.loading = false;
      state.error = null;
    },
    
    // Set location permission status
    setLocationPermission: (state, action) => {
      state.hasLocationPermission = action.payload;
    },
    
    // Set location service status
    setLocationServiceStatus: (state, action) => {
      state.isLocationEnabled = action.payload;
    },
    
    // Add or update saved address
    saveAddress: (state, action) => {
      const addressIndex = state.savedAddresses.findIndex(
        addr => addr.id === action.payload.id
      );
      
      if (addressIndex >= 0) {
        // Update existing address
        state.savedAddresses[addressIndex] = action.payload;
      } else {
        // Add new address
        state.savedAddresses = [...state.savedAddresses, action.payload];
      }
    },
    
    // Remove saved address
    removeAddress: (state, action) => {
      state.savedAddresses = state.savedAddresses.filter(
        addr => addr.id !== action.payload
      );
    },
    
    // Set selected address
    setSelectedAddress: (state, action) => {
      state.selectedAddress = action.payload;
    },
    
    // Set nearby stores
    setNearbyStores: (state, action) => {
      state.nearbyStores = action.payload;
      state.loading = false;
    },
    
    // Set selected store
    setSelectedStore: (state, action) => {
      state.selectedStore = action.payload;
    },
    
    // Reset location state
    resetLocationState: () => initialState,
  },
});

export const {
  setLoading,
  setError,
  setCurrentLocation,
  setLocationPermission,
  setLocationServiceStatus,
  saveAddress,
  removeAddress,
  setSelectedAddress,
  setNearbyStores,
  setSelectedStore,
  resetLocationState,
} = locationSlice.actions;

export default locationSlice.reducer;
