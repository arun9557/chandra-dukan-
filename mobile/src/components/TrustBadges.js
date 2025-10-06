// TrustBadges.js - Trust badges component
// ट्रस्ट बैज - विश्वास बैज कंपोनेंट

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZES } from '../utils/theme';

const TrustBadges = ({ badges }) => {
  return (
    <View style={styles.container}>
      {badges.map((badge, index) => (
        <View key={index} style={styles.badge}>
          <Text style={styles.icon}>{badge.icon}</Text>
          <Text style={styles.text}>{badge.text}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: SPACING.md,
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    borderRadius: 12,
  },
  badge: {
    alignItems: 'center',
  },
  icon: {
    fontSize: 24,
    color: COLORS.success,
    marginBottom: SPACING.xs,
  },
  text: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray,
    fontWeight: '600',
  },
});

export default TrustBadges;
