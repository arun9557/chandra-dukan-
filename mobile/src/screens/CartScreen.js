// Cart Screen - Cart screen component
// Shopping cart with item management and checkout

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { Card, Title, Paragraph, Button, Divider } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

// Components
import CartItem from '../components/CartItem';
import EmptyCart from '../components/EmptyCart';
import CartSummary from '../components/CartSummary';

// Actions
import { updateCartItem, removeFromCart, clearCart } from '../store/slices/cartSlice';

const { width } = Dimensions.get('window');

const CartScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { items, total, itemCount, deliveryCharges, finalTotal, isLoading } = useSelector(
    (state) => state.cart
  );

  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Handle quantity update - Quantity update handle करना
  const handleQuantityUpdate = async (productId, newQuantity) => {
    try {
      if (newQuantity <= 0) {
        await dispatch(removeFromCart(productId));
        Toast.show({
          type: 'success',
          text1: 'Item removed from cart',
          text2: 'Item has been removed from your cart',
        });
      } else {
        await dispatch(updateCartItem({ productId, quantity: newQuantity }));
        Toast.show({
          type: 'info',
          text1: 'Quantity updated',
          text2: 'Item quantity has been updated',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to update item quantity',
      });
    }
  };

  // Handle remove item - Item remove handle करना
  const handleRemoveItem = async (productId) => {
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(removeFromCart(productId));
              Toast.show({
                type: 'success',
                text1: 'Item removed',
                text2: 'Item has been removed from your cart',
              });
            } catch (error) {
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to remove item',
              });
            }
          },
        },
      ]
    );
  };

  // Handle clear cart - Cart clear handle करना
  const handleClearCart = () => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to clear all items from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await dispatch(clearCart());
              Toast.show({
                type: 'success',
                text1: 'Cart cleared',
                text2: 'All items have been removed from your cart',
              });
            } catch (error) {
              Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to clear cart',
              });
            }
          },
        },
      ]
    );
  };

  // Handle checkout - Checkout handle करना
  const handleCheckout = () => {
    if (items.length === 0) {
      Toast.show({
        type: 'error',
        text1: 'Empty Cart',
        text2: 'Please add some items to your cart first',
      });
      return;
    }

    if (total < 100) {
      Toast.show({
        type: 'error',
        text1: 'Minimum Order',
        text2: 'Minimum order amount is ₹100',
      });
      return;
    }

    navigation.navigate('Checkout');
  };

  // Handle continue shopping - Continue shopping handle करना
  const handleContinueShopping = () => {
    navigation.navigate('Products');
  };

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Shopping Cart</Text>
          <View style={styles.headerRight} />
        </View>
        <EmptyCart onContinueShopping={handleContinueShopping} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Shopping Cart ({itemCount})</Text>
        <TouchableOpacity onPress={handleClearCart}>
          <Ionicons name="trash-outline" size={24} color="#d63031" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Cart Items - Cart items */}
        <View style={styles.itemsContainer}>
          {items.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onQuantityUpdate={handleQuantityUpdate}
              onRemove={handleRemoveItem}
            />
          ))}
        </View>

        {/* Cart Summary - Cart summary */}
        <CartSummary
          total={total}
          deliveryCharges={deliveryCharges}
          finalTotal={finalTotal}
          itemCount={itemCount}
        />

        {/* Action Buttons - Action buttons */}
        <View style={styles.actionsContainer}>
          <Button
            mode="outlined"
            onPress={handleContinueShopping}
            style={styles.continueButton}
            labelStyle={styles.continueButtonText}
          >
            Continue Shopping
          </Button>
          <Button
            mode="contained"
            onPress={handleCheckout}
            style={styles.checkoutButton}
            labelStyle={styles.checkoutButtonText}
            loading={isCheckingOut}
            disabled={isLoading}
          >
            Proceed to Checkout
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  headerRight: {
    width: 24,
  },
  scrollView: {
    flex: 1,
  },
  itemsContainer: {
    padding: 15,
  },
  actionsContainer: {
    padding: 15,
    gap: 10,
  },
  continueButton: {
    borderColor: '#ff6b35',
  },
  continueButtonText: {
    color: '#ff6b35',
  },
  checkoutButton: {
    backgroundColor: '#ff6b35',
  },
  checkoutButtonText: {
    color: '#fff',
  },
});

export default CartScreen;
