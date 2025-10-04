// Home Screen - Home screen component
// Main dashboard with categories and featured products

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Card, Title, Paragraph, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

// Components
import CategoryGrid from '../components/CategoryGrid';
import ProductCarousel from '../components/ProductCarousel';
import SearchBar from '../components/SearchBar';
import StoreStatus from '../components/StoreStatus';
import QuickActions from '../components/QuickActions';

// Services
import ProductService from '../services/ProductService';
import CartService from '../services/CartService';

// Actions
import { loadCart } from '../store/slices/cartSlice';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { items: cartItems, itemCount } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  
  const [refreshing, setRefreshing] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [storeInfo, setStoreInfo] = useState(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  // Load initial data - Initial data load करना
  const loadInitialData = async () => {
    try {
      await Promise.all([
        loadCategories(),
        loadFeaturedProducts(),
        loadStoreInfo(),
        dispatch(loadCart()),
      ]);
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  };

  // Load categories - Categories load करना
  const loadCategories = async () => {
    try {
      const categoriesData = await ProductService.getCategories();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  // Load featured products - Featured products load करना
  const loadFeaturedProducts = async () => {
    try {
      const products = await ProductService.getFeaturedProducts();
      setFeaturedProducts(products);
    } catch (error) {
      console.error('Error loading featured products:', error);
    }
  };

  // Load store info - Store info load करना
  const loadStoreInfo = async () => {
    try {
      const info = await ProductService.getStoreInfo();
      setStoreInfo(info);
    } catch (error) {
      console.error('Error loading store info:', error);
    }
  };

  // Handle refresh - Refresh handle करना
  const onRefresh = async () => {
    setRefreshing(true);
    await loadInitialData();
    setRefreshing(false);
  };

  // Navigate to products - Products पर navigate करना
  const navigateToProducts = (categoryId = null) => {
    navigation.navigate('Products', { categoryId });
  };

  // Navigate to cart - Cart पर navigate करना
  const navigateToCart = () => {
    navigation.navigate('Cart');
  };

  // Navigate to dashboard - Dashboard पर navigate करना
  const navigateToDashboard = () => {
    navigation.navigate('Dashboard');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section - Header section */}
        <LinearGradient
          colors={['#ff6b35', '#fdcb6e']}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <View style={styles.storeInfo}>
              <Text style={styles.storeName}>🏪 Chandra Dukan</Text>
              <Text style={styles.storeTagline}>आपके घर तक, जल्दी और आसान</Text>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.cartButton} onPress={navigateToCart}>
                <Ionicons name="basket-outline" size={24} color="#fff" />
                {itemCount > 0 && (
                  <View style={styles.cartBadge}>
                    <Text style={styles.cartBadgeText}>{itemCount}</Text>
                  </View>
                )}
              </TouchableOpacity>
              <TouchableOpacity style={styles.dashboardButton} onPress={navigateToDashboard}>
                <Ionicons name="analytics-outline" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Store Status - Store status */}
          <StoreStatus storeInfo={storeInfo} />
        </LinearGradient>

        {/* Search Bar - Search bar */}
        <View style={styles.searchContainer}>
          <SearchBar onSearch={(query) => navigation.navigate('Products', { search: query })} />
        </View>

        {/* Quick Actions - Quick actions */}
        <QuickActions navigation={navigation} />

        {/* Categories Section - Categories section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories - श्रेणियां</Text>
          <CategoryGrid
            categories={categories}
            onCategoryPress={navigateToProducts}
          />
        </View>

        {/* Featured Products - Featured products */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Products</Text>
            <TouchableOpacity onPress={() => navigateToProducts()}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <ProductCarousel
            products={featuredProducts}
            onProductPress={(product) => navigation.navigate('ProductDetail', { product })}
          />
        </View>

        {/* Store Info Card - Store info card */}
        {storeInfo && (
          <Card style={styles.storeCard}>
            <Card.Content>
              <Title>Store Information</Title>
              <Paragraph>Phone: {storeInfo.phone}</Paragraph>
              <Paragraph>Address: {storeInfo.address}</Paragraph>
              <Paragraph>Hours: {storeInfo.operating_hours}</Paragraph>
              <Paragraph>Delivery: {storeInfo.delivery_radius}</Paragraph>
            </Card.Content>
            <Card.Actions>
              <Button
                mode="contained"
                onPress={() => navigation.navigate('Profile')}
                style={styles.contactButton}
              >
                Contact Store
              </Button>
            </Card.Actions>
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  storeInfo: {
    flex: 1,
  },
  storeName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  storeTagline: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  cartButton: {
    position: 'relative',
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
  },
  cartBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#d63031',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  dashboardButton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
  },
  searchContainer: {
    padding: 15,
    backgroundColor: '#fff',
  },
  section: {
    padding: 15,
    backgroundColor: '#fff',
    marginTop: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  seeAllText: {
    color: '#ff6b35',
    fontWeight: '600',
  },
  storeCard: {
    margin: 15,
    elevation: 2,
  },
  contactButton: {
    backgroundColor: '#ff6b35',
  },
});

export default HomeScreen;
