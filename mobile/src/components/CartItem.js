import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Card, IconButton, useTheme } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { updateCartItem, removeFromCart } from '../store/slices/cartSlice';

const CartItem = ({ item }) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1) {
      dispatch(updateCartItem({
        id: item.id,
        quantity: newQuantity
      }));
    }
  };

  const handleRemove = () => {
    dispatch(removeFromCart(item.id));
  };

  return (
    <Card style={styles.card}>
      <Card.Content style={styles.container}>
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: item.image || 'https://via.placeholder.com/100' }} 
            style={styles.image}
            resizeMode="contain"
          />
        </View>
        
        <View style={styles.details}>
          <Text style={styles.name} numberOfLines={2} ellipsizeMode="tail">
            {item.name}
          </Text>
          
          <Text style={styles.price}>
            ₹{item.price.toFixed(2)}
          </Text>
          
          {item.originalPrice && item.originalPrice > item.price && (
            <View style={styles.discountContainer}>
              <Text style={styles.originalPrice}>
                ₹{item.originalPrice.toFixed(2)}
              </Text>
              <Text style={styles.discount}>
                {Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}% OFF
              </Text>
            </View>
          )}
          
          <View style={styles.quantityContainer}>
            <TouchableOpacity 
              onPress={() => handleQuantityChange(item.quantity - 1)}
              style={styles.quantityButton}
            >
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            
            <Text style={styles.quantity}>{item.quantity}</Text>
            
            <TouchableOpacity 
              onPress={() => handleQuantityChange(item.quantity + 1)}
              style={styles.quantityButton}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.actions}>
          <IconButton
            icon="delete"
            size={20}
            onPress={handleRemove}
            color={theme.colors.error}
            style={styles.deleteButton}
          />
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 5,
    marginHorizontal: 8,
    elevation: 2,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  container: {
    flexDirection: 'row',
    padding: 8,
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '80%',
    height: '80%',
  },
  details: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 2,
  },
  discountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  originalPrice: {
    fontSize: 12,
    color: '#999',
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  discount: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '500',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  quantity: {
    marginHorizontal: 12,
    fontSize: 14,
    fontWeight: '500',
    minWidth: 20,
    textAlign: 'center',
  },
  actions: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  deleteButton: {
    margin: 0,
    padding: 0,
    width: 32,
    height: 32,
  },
});

export default CartItem;
