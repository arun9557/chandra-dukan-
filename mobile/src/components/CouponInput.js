// CouponInput.js
import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZES, RADIUS } from '../utils/theme';

const CouponInput = ({ value, onChangeText, onApply }) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter coupon code"
        value={value}
        onChangeText={onChangeText}
        autoCapitalize="characters"
      />
      <TouchableOpacity style={styles.button} onPress={onApply}>
        <Text style={styles.buttonText}>Apply</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', gap: SPACING.sm },
  input: { flex: 1, borderWidth: 1, borderColor: COLORS.lightGray, borderRadius: RADIUS.md, paddingHorizontal: SPACING.md, fontSize: FONT_SIZES.md },
  button: { backgroundColor: COLORS.primary, paddingHorizontal: SPACING.lg, borderRadius: RADIUS.md, justifyContent: 'center' },
  buttonText: { color: COLORS.white, fontWeight: 'bold' },
});

export default CouponInput;
