// CartScreenUpgraded.js - Enhanced cart screen
// कार्ट स्क्रीन अपग्रेड - बेहतर कार्ट स्क्रीन

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, RADIUS } from '../utils/theme';

// Components
import CartItemCard from '../components/CartItemCard';
import PriceBreakdown from '../components/PriceBreakdown';
import CouponInput from '../components/CouponInput';
import EmptyCart from '../components/EmptyCart';

const CartScreenUpgraded = ({ navigation }) => {
  const dispatch = useDispatch();
  const { items, itemCount, total } = useSelector((state) => state.cart);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);

  // Handle quantity change - मात्रा बदलना
  const handleQuantityChange = (item, newQuantity) => {
    if (newQuantity === 0) {
      // Remove item
      Alert.alert('Remove Item', 'Remove this item from cart?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', onPress: () => {
          // dispatch(removeFromCart(item.id));
        }},
      ]);
    } else {
      // Update quantity
      // dispatch(updateQuantity({ id: item.id, quantity: newQuantity }));
    }
  };

  // Apply coupon - कूपन लगाना
  const handleApplyCoupon = () => {
    const validCoupons = {
      'FIRST20': 20,
      'WEEKEND100': 100,
      'SAVE50': 50,
    };

    if (validCoupons[couponCode.toUpperCase()]) {
      const discountAmount = validCoupons[couponCode.toUpperCase()];
      setDiscount(discountAmount);
      Alert.alert('Success', `Coupon applied! You saved ₹${discountAmount}`);
    } else {
      Alert.alert('Error', 'Invalid coupon code');
    }
  };

  // Calculate totals - कुल गणना
  const subtotal = total || 0;
  const deliveryFee = subtotal > 199 ? 0 : 20;
  const finalTotal = subtotal + deliveryFee - discount;

  // Empty cart - खाली कार्ट
  if (itemCount === 0) {
    return <EmptyCart onStartShopping={() => navigation.navigate('Products')} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cart ({itemCount} items)</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Cart Items */}
        <View style={styles.section}>
          {items.map((item) => (
            <CartItemCard
              key={item.id}
              item={item}
              onQuantityChange={(newQty) => handleQuantityChange(item, newQty)}
            />
          ))}
        </View>

        {/* Coupon Section */}
        <View style={styles.section}>
          <CouponInput
            value={couponCode}
            onChangeText={setCouponCode}
            onApply={handleApplyCoupon}
          />
        </View>

        {/* Delivery Address Preview */}
        <View style={styles.section}>
          <View style={styles.addressCard}>
            <View style={styles.addressHeader}>
              <Ionicons name="location" size={20} color={COLORS.success} />
              <Text style={styles.addressTitle}>Delivery Address</Text>
            </View>
            <Text style={styles.addressText}>Main Market, Nawalpur Beyora</Text>
            <TouchableOpacity>
              <Text style={styles.changeAddress}>Change Address</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Price Breakdown */}
        <View style={styles.section}>
          <PriceBreakdown
            subtotal={subtotal}
            deliveryFee={deliveryFee}
            discount={discount}
            total={finalTotal}
          />
        </View>

        {/* Spacing for button */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Checkout Button (Sticky) */}
      <View style={styles.footer}>
        <View style={styles.footerContent}>
          <View>
            <Text style={styles.footerLabel}>Total Amount</Text>
            <Text style={styles.footerTotal}>₹{finalTotal}</Text>
          </View>
          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={() => navigation.navigate('Checkout')}
          >
            <Text style={styles.checkoutText}>Proceed to Checkout</Text>
            <Ionicons name="arrow-forward" size={20} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </View>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  headerTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: SPACING.md,
  },
  addressCard: {
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  addressTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.black,
    marginLeft: SPACING.sm,
  },
  addressText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray,
    marginBottom: SPACING.sm,
  },
  changeAddress: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.primary,
    fontWeight: '600',
  },
  footer: {
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    padding: SPACING.md,
  },
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray,
  },
  footerTotal: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  checkoutButton: {
    backgroundColor: COLORS.success,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.lg,
    gap: SPACING.sm,
  },
  checkoutText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md,
    fontWeight: 'bold',
  },
});

export default CartScreenUpgraded;
