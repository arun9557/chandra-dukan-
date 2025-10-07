// HomeScreenUpgraded.js - Complete home screen matching website
// होम स्क्रीन अपग्रेड - वेबसाइट से मेल खाती हुई

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
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

// Theme & Constants
import { COLORS, SPACING, FONT_SIZES, RADIUS } from '../utils/theme';
import { ANNOUNCEMENT_TEXT, HERO_TITLE, HERO_SUBTITLE, HERO_DESCRIPTION, TRUST_BADGES, FEATURES } from '../utils/constants';

// Components
import AnnouncementBanner from '../components/AnnouncementBanner';
import HeroSection from '../components/HeroSection';
import TrustBadges from '../components/TrustBadges';
import FeaturesGrid from '../components/FeaturesGrid';
import OffersCarousel from '../components/OffersCarousel';
import JanSevaBanner from '../components/JanSevaBanner';
import CategoryStrip from '../components/CategoryStrip';
import ProductsGrid from '../components/ProductsGrid';
import TestimonialsSection from '../components/TestimonialsSection';
import NewsletterSection from '../components/NewsletterSection';
import FloatingCartButton from '../components/FloatingCartButton';

// Services
import ProductService from '../services/ProductService';

const { width } = Dimensions.get('window');

const HomeScreenUpgraded = ({ navigation }) => {
  const dispatch = useDispatch();
  const { items: cartItems, itemCount } = useSelector((state) => state.cart);
  
  const [refreshing, setRefreshing] = useState(false);
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInitialData();
  }, []);

  // Load initial data - शुरुआती डेटा लोड करें
  const loadInitialData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadCategories(),
        loadFeaturedProducts(),
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load categories - श्रेणियां लोड करें
  const loadCategories = async () => {
    try {
      const data = await ProductService.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  // Load featured products - फीचर्ड उत्पाद लोड करें
  const loadFeaturedProducts = async () => {
    try {
      const data = await ProductService.getFeaturedProducts();
      setFeaturedProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  // Handle refresh - रिफ्रेश हैंडल करें
  const onRefresh = async () => {
    setRefreshing(true);
    await loadInitialData();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Announcement Banner */}
      <AnnouncementBanner text={ANNOUNCEMENT_TEXT} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.logo}>🏪</Text>
          <View>
            <Text style={styles.storeName}>Chandra Dukan</Text>
            <Text style={styles.storeNameHindi}>चंद्रा दुकान</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerBtn}>
            <Ionicons name="search" size={24} color={COLORS.black} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerBtn}
            onPress={() => navigation.navigate('Cart')}
          >
            <Ionicons name="basket-outline" size={24} color={COLORS.black} />
            {itemCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{itemCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
          />
        }
      >
        {/* Hero Section */}
        <HeroSection
          title={HERO_TITLE}
          subtitle={HERO_SUBTITLE}
          description={HERO_DESCRIPTION}
          onStartShopping={() => navigation.navigate('Products')}
        />

        {/* Trust Badges */}
        <TrustBadges badges={TRUST_BADGES} />

        {/* Features Grid */}
        <FeaturesGrid features={FEATURES} />

        {/* Offers Carousel */}
        <OffersCarousel />

        {/* Jan Seva Banner */}
        <JanSevaBanner
          onPress={() => navigation.navigate('JanSeva')}
        />

        {/* Category Strip */}
        <CategoryStrip
          categories={categories}
          onCategoryPress={(category) => navigation.navigate('Products', { category })}
        />

        {/* Products Grid */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>All Products</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Products')}>
              <Text style={styles.seeAll}>See All →</Text>
            </TouchableOpacity>
          </View>
          <ProductsGrid
            products={featuredProducts.slice(0, 6)}
            onProductPress={(product) => navigation.navigate('ProductDetail', { product })}
          />
        </View>

        {/* Testimonials */}
        <TestimonialsSection />

        {/* Newsletter */}
        <NewsletterSection />

        {/* Footer Spacing */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Cart Button */}
      <FloatingCartButton
        count={itemCount}
        onPress={() => navigation.navigate('Cart')}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    fontSize: 32,
    marginRight: SPACING.sm,
  },
  storeName: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  storeNameHindi: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray,
  },
  headerRight: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  headerBtn: {
    padding: SPACING.sm,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: COLORS.error,
    borderRadius: RADIUS.full,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: SPACING.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  seeAll: {
    fontSize: FONT_SIZES.md,
    color: COLORS.primary,
    fontWeight: '600',
  },
});

export default HomeScreenUpgraded;
