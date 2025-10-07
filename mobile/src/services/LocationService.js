// LocationService.js - Location service
import * as Location from 'expo-location';

const LocationService = {
  // Request permissions
  requestPermissions: async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting location permissions:', error);
      return false;
    }
  },

  // Initialize location service
  initialize: async () => {
    try {
      const location = await Location.getCurrentPositionAsync({});
      return location;
    } catch (error) {
      console.error('Error getting location:', error);
      return null;
    }
  },

  // Get current location
  getCurrentLocation: async () => {
    try {
      const location = await Location.getCurrentPositionAsync({});
      return location;
    } catch (error) {
      console.error('Error getting current location:', error);
      return null;
    }
  },
};

export default LocationService;
