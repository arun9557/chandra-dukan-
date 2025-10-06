// Chandra Dukan Mobile App - Main App Component
// चंद्रा दुकान मोबाइल ऐप - मुख्य ऐप कंपोनेंट

import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Alert } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { PaperProvider } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import * as Notifications from 'expo-notifications';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';

// Store and Persistence
import { store, persistor } from './src/store/store';

// Screens
import SplashScreen from './src/screens/SplashScreen';
import HomeScreen from './src/screens/HomeScreen';
import HomeScreenUpgraded from './src/screens/HomeScreenUpgraded';
import ProductsScreen from './src/screens/ProductsScreen';
import ProductDetailScreen from './src/screens/ProductDetailScreen';
import CartScreen from './src/screens/CartScreen';
import CheckoutScreen from './src/screens/CheckoutScreen';
import OrderConfirmationScreen from './src/screens/OrderConfirmationScreen';
import OrderTrackingScreen from './src/screens/OrderTrackingScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';

// Jan Seva Screens
import JanSevaHomeScreen from './src/screens/JanSeva/JanSevaHomeScreen';
import JanSevaFormScreen from './src/screens/JanSeva/JanSevaFormScreen';
import JanSevaConfirmationScreen from './src/screens/JanSeva/JanSevaConfirmationScreen';

// Components
import CustomDrawerContent from './src/components/CustomDrawerContent';
import CustomTabBar from './src/components/CustomTabBar';

// Services
import NotificationService from './src/services/NotificationService';
import LocationService from './src/services/LocationService';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

// Main Tab Navigator - मुख्य टैब नेविगेटर
function TabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreenUpgraded}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Products" 
        component={ProductsScreen}
        options={{
          tabBarLabel: 'Products',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="grid-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Cart" 
        component={CartScreen}
        options={{
          tabBarLabel: 'Cart',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="basket-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="analytics-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Main Stack Navigator - मुख्य स्टैक नेविगेटर
function StackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Main" component={TabNavigator} />
      <Stack.Screen 
        name="ProductDetail" 
        component={ProductDetailScreen}
        options={{
          headerShown: true,
          title: 'Product Details',
          headerStyle: {
            backgroundColor: '#ff6b35',
          },
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen 
        name="Checkout" 
        component={CheckoutScreen}
        options={{
          headerShown: true,
          title: 'Checkout',
          headerStyle: {
            backgroundColor: '#ff6b35',
          },
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen 
        name="OrderConfirmation" 
        component={OrderConfirmationScreen}
        options={{
          headerShown: true,
          title: 'Order Confirmed',
          headerStyle: {
            backgroundColor: '#ff6b35',
          },
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen 
        name="OrderTracking" 
        component={OrderTrackingScreen}
        options={{
          headerShown: true,
          title: 'Track Order',
          headerStyle: {
            backgroundColor: '#ff6b35',
          },
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          headerShown: true,
          title: 'Settings',
          headerStyle: {
            backgroundColor: '#ff6b35',
          },
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen 
        name="JanSeva" 
        component={JanSevaHomeScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="JanSevaDetail" 
        component={JanSevaFormScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="JanSevaConfirmation" 
        component={JanSevaConfirmationScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

// Main App Component - मुख्य ऐप कंपोनेंट
export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [locationPermission, setLocationPermission] = useState(false);

  useEffect(() => {
    initializeApp();
  }, []);

  // Initialize app - ऐप को initialize करना
  const initializeApp = async () => {
    try {
      // Request notification permissions
      await NotificationService.requestPermissions();
      
      // Request location permissions
      const locationPermission = await LocationService.requestPermissions();
      setLocationPermission(locationPermission);
      
      // Initialize location service
      if (locationPermission) {
        await LocationService.initialize();
      }
      
      // Set up notification listeners
      NotificationService.setupListeners();
      
      // Simulate loading time
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
      
    } catch (error) {
      console.error('App initialization error:', error);
      Alert.alert('Error', 'Failed to initialize app. Some features may not work properly.');
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <Provider store={store}>
      <PersistGate loading={<SplashScreen />} persistor={persistor}>
        <PaperProvider>
          <NavigationContainer>
            <View style={styles.container}>
              <StackNavigator />
              <StatusBar style="light" backgroundColor="#ff6b35" />
              <Toast />
            </View>
          </NavigationContainer>
        </PaperProvider>
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
