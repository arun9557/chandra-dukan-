// CartItemCard.js
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, RADIUS } from '../utils/theme';

const CartItemCard = ({ item, onQuantityChange }) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>₹{item.price}</Text>
      </View>
      <View style={styles.controls}>
        <TouchableOpacity style={styles.btn} onPress={() => onQuantityChange(item.quantity - 1)}>
          <Ionicons name="remove" size={20} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.quantity}>{item.quantity}</Text>
        <TouchableOpacity style={styles.btn} onPress={() => onQuantityChange(item.quantity + 1)}>
          <Ionicons name="add" size={20} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { flexDirection: 'row', backgroundColor: COLORS.white, padding: SPACING.md, borderRadius: RADIUS.md, marginBottom: SPACING.md },
  image: { width: 80, height: 80, borderRadius: RADIUS.sm },
  info: { flex: 1, marginLeft: SPACING.md, justifyContent: 'center' },
  name: { fontSize: FONT_SIZES.md, fontWeight: '600', marginBottom: SPACING.xs },
  price: { fontSize: FONT_SIZES.lg, fontWeight: 'bold', color: COLORS.success },
  controls: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  btn: { backgroundColor: COLORS.success, width: 32, height: 32, borderRadius: RADIUS.sm, justifyContent: 'center', alignItems: 'center' },
  quantity: { fontSize: FONT_SIZES.lg, fontWeight: 'bold', minWidth: 30, textAlign: 'center' },
});

export default CartItemCard;
