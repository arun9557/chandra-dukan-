// CategoryGrid.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';

const CategoryGrid = ({ categories = [], onCategoryPress }) => {
  const renderCategory = ({ item }) => (
    <TouchableOpacity 
      style={styles.category}
      onPress={() => onCategoryPress && onCategoryPress(item)}
    >
      <Text style={styles.icon}>{item.icon || '📦'}</Text>
      <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={categories}
      renderItem={renderCategory}
      keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
      numColumns={4}
      scrollEnabled={false}
    />
  );
};

const styles = StyleSheet.create({
  category: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    margin: 4,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  icon: {
    fontSize: 32,
    marginBottom: 8,
  },
  name: {
    fontSize: 12,
    textAlign: 'center',
  },
});

export default CategoryGrid;
