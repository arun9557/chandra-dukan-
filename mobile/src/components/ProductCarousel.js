// ProductCarousel.js
import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';

const ProductCarousel = ({ products = [], onProductPress }) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {products.map((product, index) => (
        <TouchableOpacity
          key={product.id || index}
          style={styles.product}
          onPress={() => onProductPress && onProductPress(product)}
        >
          <Image 
            source={{ uri: product.image || 'https://via.placeholder.com/150' }} 
            style={styles.image} 
          />
          <Text style={styles.name} numberOfLines={2}>{product.name}</Text>
          <Text style={styles.price}>₹{product.price}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  product: {
    width: 150,
    marginRight: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
  },
  image: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  name: {
    fontSize: 14,
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#16a34a',
  },
});

export default ProductCarousel;
