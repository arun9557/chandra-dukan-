// OrderConfirmationScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const OrderConfirmationScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.icon}>✅</Text>
        <Text style={styles.title}>Order Placed!</Text>
        <Text style={styles.subtitle}>Your order has been placed successfully</Text>
        <Text style={styles.orderNumber}>Order #12345</Text>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('Main')}
        >
          <Text style={styles.buttonText}>Continue Shopping</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  icon: { fontSize: 80, marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#6b7280', marginBottom: 16, textAlign: 'center' },
  orderNumber: { fontSize: 18, fontWeight: 'bold', color: '#16a34a', marginBottom: 32 },
  button: { backgroundColor: '#16a34a', padding: 16, borderRadius: 8, width: '100%' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
});

export default OrderConfirmationScreen;
