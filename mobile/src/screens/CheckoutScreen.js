// CheckoutScreen.js - Checkout screen
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CheckoutScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Checkout</Text>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          <Text style={styles.address}>Main Market, Nawalpur Beyora</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <Text>Cash on Delivery</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.row}>
            <Text>Subtotal</Text>
            <Text>₹299</Text>
          </View>
          <View style={styles.row}>
            <Text>Delivery</Text>
            <Text>₹20</Text>
          </View>
          <View style={[styles.row, styles.total]}>
            <Text style={styles.totalText}>Total</Text>
            <Text style={styles.totalText}>₹319</Text>
          </View>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.placeOrderButton}
          onPress={() => navigation.navigate('OrderConfirmation')}
        >
          <Text style={styles.placeOrderText}>Place Order</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  content: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  section: { backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  address: { color: '#6b7280' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  total: { borderTopWidth: 1, borderTopColor: '#e5e7eb', paddingTop: 8, marginTop: 8 },
  totalText: { fontWeight: 'bold', fontSize: 16 },
  footer: { padding: 16, backgroundColor: '#fff' },
  placeOrderButton: { backgroundColor: '#16a34a', padding: 16, borderRadius: 8, alignItems: 'center' },
  placeOrderText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default CheckoutScreen;
