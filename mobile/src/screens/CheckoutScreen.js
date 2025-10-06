// CheckoutScreen.js - Checkout screen
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import OrderService from '../services/OrderService';
import { useSelector } from 'react-redux';

const CheckoutScreen = ({ navigation }) => {
  // Form state - Web checkout parity (Hinglish labels)
  const [name, setName] = useState(''); // Aapka Naam
  const [phone, setPhone] = useState(''); // Phone Number
  const [address, setAddress] = useState(''); // Pura Address
  const [area, setArea] = useState(''); // Delivery Area
  const [payment, setPayment] = useState('cod'); // Payment Method
  const [loading, setLoading] = useState(false);

  // Cart state - items aur total
  const { items } = useSelector((state) => state.cart || { items: [] });

  const computeTotals = () => {
    const subtotal = (items || []).reduce((sum, it) => sum + (it.price * it.quantity), 0);
    const delivery = subtotal >= 200 ? 0 : 30;
    const total = subtotal + delivery;
    return { subtotal, delivery, total };
  };

  const { subtotal, delivery, total } = computeTotals();

  const placeOrder = async () => {
    // Validation - Basic client validation
    if (!name.trim() || !phone.trim() || !address.trim()) {
      Alert.alert('Error', 'Kripya name, phone aur address bharien.');
      return;
    }
    if (!/^\d{10}$/.test(phone.trim())) {
      Alert.alert('Error', 'Valid 10-digit phone number daaliye.');
      return;
    }
    if (!items || items.length === 0) {
      Alert.alert('Error', 'Cart khali hai.');
      return;
    }

    const payload = {
      customer_name: name.trim(),
      customer_phone: phone.trim(),
      customer_address: address.trim(),
      customer_area: area || 'Main Market Area',
      items: items.map(it => ({ id: it.id, name: it.name, price: it.price, quantity: it.quantity })),
      payment_method: payment,
      total_amount: subtotal,
      delivery_instructions: '',
    };

    try {
      setLoading(true);
      const order = await OrderService.placeOrder(payload);
      // Success - navigate to confirmation and tracking
      navigation.replace('OrderConfirmation', { order });
    } catch (e) {
      Alert.alert('Order Failed', 'Order place karte waqt problem aayi. Baad mein try karein.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <Text style={styles.title}>Checkout</Text>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Aapka Naam *</Text>
          <TextInput style={styles.input} placeholder="Jaise: Ramesh Kumar" value={name} onChangeText={setName} />
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Phone Number *</Text>
          <TextInput style={styles.input} placeholder="10 digit" keyboardType="phone-pad" value={phone} onChangeText={setPhone} maxLength={10} />
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pura Address *</Text>
          <TextInput style={[styles.input, styles.textarea]} placeholder="Ghar ka Address" value={address} onChangeText={setAddress} multiline />
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Area</Text>
          <TextInput style={styles.input} placeholder="Main Market Area" value={area} onChangeText={setArea} />
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method *</Text>
          <View style={styles.paymentRow}>
            {['cod','upi','phonepe','gpay'].map((p) => (
              <TouchableOpacity key={p} style={[styles.payOption, payment===p && styles.payOptionActive]} onPress={() => setPayment(p)}>
                <Text style={[styles.payOptionText, payment===p && styles.payOptionTextActive]}>{p.toUpperCase()}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.row}>
            <Text>Subtotal</Text>
            <Text>₹{subtotal}</Text>
          </View>
          <View style={styles.row}>
            <Text>Delivery</Text>
            <Text>{delivery === 0 ? 'Free' : `₹${delivery}`}</Text>
          </View>
          <View style={[styles.row, styles.total]}>
            <Text style={styles.totalText}>Total</Text>
            <Text style={styles.totalText}>₹{total}</Text>
          </View>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.placeOrderButton}
          onPress={placeOrder}
          disabled={loading}
        >
          <Text style={styles.placeOrderText}>{loading ? 'Placing...' : 'Place Order'}</Text>
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
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e7eb', borderRadius: 8, padding: 12 },
  textarea: { minHeight: 80, textAlignVertical: 'top' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  total: { borderTopWidth: 1, borderTopColor: '#e5e7eb', paddingTop: 8, marginTop: 8 },
  totalText: { fontWeight: 'bold', fontSize: 16 },
  footer: { padding: 16, backgroundColor: '#fff' },
  placeOrderButton: { backgroundColor: '#16a34a', padding: 16, borderRadius: 8, alignItems: 'center' },
  placeOrderText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  paymentRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  payOption: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, backgroundColor: '#eef2ff', borderWidth: 1, borderColor: '#c7d2fe', marginRight: 8, marginBottom: 8 },
  payOptionActive: { backgroundColor: '#16a34a', borderColor: '#16a34a' },
  payOptionText: { color: '#111827', fontWeight: '600' },
  payOptionTextActive: { color: '#fff' },
});

export default CheckoutScreen;
