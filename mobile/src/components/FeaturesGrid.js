// FeaturesGrid.js - Features grid component
// फीचर्स ग्रिड - सुविधाएं ग्रिड कंपोनेंट

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZES, RADIUS } from '../utils/theme';

const FeaturesGrid = ({ features }) => {
  return (
    <View style={styles.container}>
      {features.map((feature, index) => (
        <View key={index} style={styles.feature}>
          <Text style={styles.icon}>{feature.icon}</Text>
          <Text style={styles.title}>{feature.title}</Text>
          <Text style={styles.description}>{feature.description}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: SPACING.md,
    gap: SPACING.md,
  },
  feature: {
    width: '47%',
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    alignItems: 'center',
  },
  icon: {
    fontSize: 40,
    marginBottom: SPACING.sm,
  },
  title: {
    fontSize: FONT_SIZES.md,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  description: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default FeaturesGrid;
