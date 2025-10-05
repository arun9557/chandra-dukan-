// PriceBreakdown.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZES, RADIUS } from '../utils/theme';

const PriceBreakdown = ({ subtotal, deliveryFee, discount, total }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bill Details</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Subtotal</Text>
        <Text style={styles.value}>₹{subtotal}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Delivery Fee</Text>
        <Text style={styles.value}>₹{deliveryFee}</Text>
      </View>
      {discount > 0 && (
        <View style={styles.row}>
          <Text style={[styles.label, { color: COLORS.success }]}>Discount</Text>
          <Text style={[styles.value, { color: COLORS.success }]}>-₹{discount}</Text>
        </View>
      )}
      <View style={[styles.row, styles.total]}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>₹{total}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: COLORS.white, padding: SPACING.md, borderRadius: RADIUS.md },
  title: { fontSize: FONT_SIZES.lg, fontWeight: 'bold', marginBottom: SPACING.md },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.sm },
  label: { fontSize: FONT_SIZES.md, color: COLORS.gray },
  value: { fontSize: FONT_SIZES.md, fontWeight: '600' },
  total: { borderTopWidth: 1, borderTopColor: COLORS.lightGray, paddingTop: SPACING.sm, marginTop: SPACING.sm },
  totalLabel: { fontSize: FONT_SIZES.lg, fontWeight: 'bold' },
  totalValue: { fontSize: FONT_SIZES.xl, fontWeight: 'bold', color: COLORS.success },
});

export default PriceBreakdown;
