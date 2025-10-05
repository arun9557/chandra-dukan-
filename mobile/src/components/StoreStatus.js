// StoreStatus.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const StoreStatus = ({ isOpen = true }) => {
  return (
    <View style={[styles.container, isOpen ? styles.open : styles.closed]}>
      <Text style={styles.text}>
        {isOpen ? '🟢 Store Open' : '🔴 Store Closed'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    borderRadius: 8,
    marginBottom: 16,
  },
  open: {
    backgroundColor: '#d1fae5',
  },
  closed: {
    backgroundColor: '#fee2e2',
  },
  text: {
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default StoreStatus;
