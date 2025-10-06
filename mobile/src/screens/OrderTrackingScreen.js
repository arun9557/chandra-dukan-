// OrderTrackingScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import OrderService from '../services/OrderService';

const OrderTrackingScreen = ({ route }) => {
  // Route se orderId ya order object aayega - Web parity (Hinglish)
  const passedOrder = route?.params?.order || null;
  const passedOrderId = route?.params?.orderId || passedOrder?.id || null;

  const [order, setOrder] = useState(passedOrder || null);
  const [loading, setLoading] = useState(!passedOrder);
  const [refreshing, setRefreshing] = useState(false);

  const loadOrder = async () => {
    if (!passedOrderId) return;
    try {
      setLoading(true);
      const data = await OrderService.getOrderById(passedOrderId);
      setOrder(data);
    } catch (e) {
      // Silent fail UI mein simple message dikhayenge
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!order) {
      loadOrder();
    }
  }, [passedOrderId]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOrder();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}> 
        <View style={styles.center}> 
          <ActivityIndicator size="large" color="#16a34a" />
          <Text style={styles.muted}>Order load ho raha hai...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!order) {
    return (
      <SafeAreaView style={styles.container}> 
        <View style={styles.center}> 
          <Text style={styles.title}>Track Order</Text>
          <Text style={styles.muted}>Order nahi mila. Kripya wapas try karein.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}> 
        <Text style={styles.title}>Track Order #{order.id}</Text>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Status</Text>
          <Text style={styles.status}>{order.status?.toUpperCase?.() || 'PLACED'}</Text>
          <Text style={styles.muted}>Estimated Delivery: {new Date(order.estimated_delivery || Date.now()).toLocaleTimeString()}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Customer</Text>
          <Text>{order.customer?.name}</Text>
          <Text style={styles.muted}>{order.customer?.phone}</Text>
          <Text style={styles.muted}>{order.customer?.address}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Items</Text>
          {order.items?.map((it) => (
            <View key={`${it.id}-${it.name}`} style={styles.rowBetween}>
              <Text>{it.name} × {it.quantity}</Text>
              <Text>₹{it.price * it.quantity}</Text>
            </View>
          ))}
          <View style={[styles.rowBetween, styles.totalRow]}>
            <Text style={styles.bold}>Total</Text>
            <Text style={styles.bold}>₹{order.final_amount}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  content: { padding: 16 },
  section: { backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  status: { fontSize: 16, fontWeight: '600', color: '#16a34a', marginBottom: 4 },
  muted: { color: '#6b7280' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  totalRow: { borderTopWidth: 1, borderTopColor: '#e5e7eb', paddingTop: 8, marginTop: 8 },
  bold: { fontWeight: 'bold' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});

export default OrderTrackingScreen;
