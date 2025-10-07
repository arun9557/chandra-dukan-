// CategoryStrip.js - Horizontal category strip
// कैटेगरी स्ट्रिप - क्षैतिज श्रेणी पट्टी

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, FONT_SIZES, RADIUS } from '../utils/theme';

const CategoryStrip = ({ categories, onCategoryPress }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shop by Category</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={styles.category}
            onPress={() => onCategoryPress(category)}
          >
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>{category.icon || '📦'}</Text>
            </View>
            <Text style={styles.name} numberOfLines={2}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.black,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  scroll: {
    paddingHorizontal: SPACING.md,
  },
  category: {
    width: 80,
    marginRight: SPACING.md,
    alignItems: 'center',
  },
  iconContainer: {
    width: 70,
    height: 70,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  icon: {
    fontSize: 32,
  },
  name: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.black,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default CategoryStrip;
