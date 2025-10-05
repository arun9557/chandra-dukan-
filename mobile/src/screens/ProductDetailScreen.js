// ProductDetailScreen.js - Product detail screen
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ProductDetailScreen = ({ route, navigation }) => {
  const { product } = route.params || {};

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Image source={{ uri: product?.image || 'https://via.placeholder.com/300' }} style={styles.image} />
        <View style={styles.content}>
          <Text style={styles.name}>{product?.name || 'Product Name'}</Text>
          <Text style={styles.price}>₹{product?.price || '0'}</Text>
          <Text style={styles.description}>{product?.description || 'Product description here'}</Text>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  image: { width: '100%', height: 300 },
  content: { padding: 16 },
  name: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  price: { fontSize: 24, fontWeight: 'bold', color: '#16a34a', marginBottom: 16 },
  description: { fontSize: 14, color: '#6b7280', lineHeight: 20 },
  footer: { padding: 16, borderTopWidth: 1, borderTopColor: '#e5e7eb' },
  addButton: { backgroundColor: '#16a34a', padding: 16, borderRadius: 8, alignItems: 'center' },
  addButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default ProductDetailScreen;
