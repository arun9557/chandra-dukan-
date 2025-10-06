// DashboardScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import OrderService from '../services/OrderService';

const DashboardScreen = () => {
  // Analytics state - Web dashboard parity (Hinglish)
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const data = await OrderService.getAnalyticsSummary();
      setSummary(data);
    } catch (e) {
      // Simple silent fail; UI default zero dikhayega
      setSummary(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAnalytics();
    setRefreshing(false);
  };

  const totalOrders = summary?.total_orders || 0;
  const totalRevenue = summary?.total_revenue || 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}> 
        <Text style={styles.title}>Dashboard</Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Total Orders</Text>
          <Text style={styles.cardValue}>{loading ? '...' : totalOrders}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Total Revenue</Text>
          <Text style={styles.cardValue}>₹{loading ? '...' : totalRevenue}</Text>
        </View>
        {summary?.orders_by_status && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Orders by Status</Text>
            {Object.entries(summary.orders_by_status).map(([k,v]) => (
              <View key={k} style={styles.rowBetween}><Text>{k.replaceAll('_',' ')}</Text><Text>{v}</Text></View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  content: { padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 8, marginBottom: 16 },
  cardTitle: { fontSize: 14, color: '#6b7280', marginBottom: 8 },
  cardValue: { fontSize: 32, fontWeight: 'bold', color: '#16a34a' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between' },
});

export default DashboardScreen;
