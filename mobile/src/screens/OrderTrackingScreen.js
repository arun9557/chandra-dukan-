// OrderTrackingScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const OrderTrackingScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Track Order</Text>
      <Text>Order tracking coming soon...</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
});

export default OrderTrackingScreen;
