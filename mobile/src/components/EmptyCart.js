// EmptyCart.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZES } from '../utils/theme';

const EmptyCart = ({ onStartShopping }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🛒</Text>
      <Text style={styles.title}>Your cart is empty</Text>
      <Text style={styles.subtitle}>Add items to get started</Text>
      <TouchableOpacity style={styles.button} onPress={onStartShopping}>
        <Text style={styles.buttonText}>Start Shopping</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.xl },
  icon: { fontSize: 80, marginBottom: SPACING.lg },
  title: { fontSize: FONT_SIZES.xxl, fontWeight: 'bold', marginBottom: SPACING.sm },
  subtitle: { fontSize: FONT_SIZES.md, color: COLORS.gray, marginBottom: SPACING.xl },
  button: { backgroundColor: COLORS.success, paddingVertical: SPACING.md, paddingHorizontal: SPACING.xl, borderRadius: 12 },
  buttonText: { color: COLORS.white, fontSize: FONT_SIZES.lg, fontWeight: 'bold' },
});

export default EmptyCart;
