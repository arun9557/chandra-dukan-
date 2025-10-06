// OrderHistoryScreen.js - Order history list (Hinglish labels)

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import OrderService from '../services/OrderService';

const OrderHistoryScreen = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await OrderService.listOrders();
      setOrders(res?.data || []);
    } catch (e) {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('OrderTracking', { orderId: item.id })}>
      <View style={styles.rowBetween}>
        <Text style={styles.id}>#{item.id}</Text>
        <Text style={[styles.status, styles[`status_${item.status}`] || {}]}>{item.status?.toUpperCase?.()}</Text>
      </View>
      <View style={styles.rowBetween}>
        <Text>{new Date(item.created_at).toLocaleString()}</Text>
        <Text style={styles.total}>₹{item.final_amount}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}> 
          <ActivityIndicator size="large" color="#16a34a" />
          <Text>Orders load ho rahe hain...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        onRefresh={loadOrders}
        refreshing={loading}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  list: { padding: 16 },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  id: { fontWeight: 'bold' },
  status: { fontWeight: '600', color: '#111827' },
  total: { fontWeight: 'bold', color: '#16a34a' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});

export default OrderHistoryScreen;


