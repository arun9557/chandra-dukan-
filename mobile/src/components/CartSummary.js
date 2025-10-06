import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Button, Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const CartSummary = ({ items, total, deliveryCharge, discount, onCheckout }) => {
  const navigation = useNavigation();
  
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const grandTotal = subtotal + deliveryCharge - (discount || 0);
  
  const handleCheckout = () => {
    if (typeof onCheckout === 'function') {
      onCheckout();
    } else {
      navigation.navigate('Checkout');
    }
  };

  return (
    <Card style={styles.container}>
      <Card.Content>
        <Text style={styles.title}>Order Summary</Text>
        <Divider style={styles.divider} />
        
        <View style={styles.row}>
          <Text style={styles.label}>Subtotal ({items.length} items)</Text>
          <Text style={styles.value}>₹{subtotal.toFixed(2)}</Text>
        </View>
        
        {discount > 0 && (
          <View style={styles.row}>
            <Text style={styles.label}>Discount</Text>
            <Text style={[styles.value, styles.discount]}>-₹{discount.toFixed(2)}</Text>
          </View>
        )}
        
        <View style={styles.row}>
          <Text style={styles.label}>Delivery Charge</Text>
          <Text style={styles.value}>
            {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge.toFixed(2)}`}
          </Text>
        </View>
        
        <Divider style={[styles.divider, styles.totalDivider]} />
        
        <View style={[styles.row, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalValue}>₹{grandTotal.toFixed(2)}</Text>
        </View>
        
        <Button 
          mode="contained" 
          onPress={handleCheckout}
          style={styles.checkoutButton}
          labelStyle={styles.checkoutButtonLabel}
          disabled={items.length === 0}
        >
          PROCEED TO CHECKOUT
        </Button>
        
        <Text style={styles.note}>
          {items.length === 0 
            ? 'Your cart is empty. Add some items to proceed.' 
            : 'Prices and delivery charges are final and will be calculated at checkout.'}
          }
        </Text>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 12,
    borderRadius: 8,
    elevation: 2,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginVertical: 8,
  },
  totalDivider: {
    marginTop: 12,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  label: {
    fontSize: 14,
    color: '#666',
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  discount: {
    color: '#4CAF50',
  },
  totalRow: {
    marginTop: 4,
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  checkoutButton: {
    marginTop: 8,
    borderRadius: 4,
    backgroundColor: '#FF6B6B',
    paddingVertical: 6,
  },
  checkoutButtonLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    paddingVertical: 2,
  },
  note: {
    fontSize: 12,
    color: '#999',
    marginTop: 12,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default CartSummary;
