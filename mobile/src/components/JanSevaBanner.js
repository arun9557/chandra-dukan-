// JanSevaBanner.js - Jan Seva Kendra banner
// जन सेवा बैनर - जन सेवा केंद्र बैनर

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, FONT_SIZES, RADIUS } from '../utils/theme';

const JanSevaBanner = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      <LinearGradient
        colors={[COLORS.success, COLORS.successDark]}
        style={styles.container}
      >
        <View style={styles.left}>
          <Text style={styles.icon}>🏛️</Text>
          <View style={styles.content}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>New Service</Text>
            </View>
            <Text style={styles.title}>Jan Seva Kendra</Text>
            <Text style={styles.subtitle}>सरकारी नागरिक सेवाएं</Text>
            <Text style={styles.description}>
              Apply for certificates, ID cards & government services online
            </Text>
            <View style={styles.features}>
              <Text style={styles.feature}>✓ 12+ Services</Text>
              <Text style={styles.feature}>✓ Online Application</Text>
              <Text style={styles.feature}>✓ Fast Processing</Text>
            </View>
          </View>
        </View>
        <View style={styles.right}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>Explore Services</Text>
            <Text style={styles.arrow}>→</Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: SPACING.md,
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  left: {
    flexDirection: 'row',
    flex: 1,
  },
  icon: {
    fontSize: 48,
    marginRight: SPACING.md,
  },
  content: {
    flex: 1,
  },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
    alignSelf: 'flex-start',
    marginBottom: SPACING.xs,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  title: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.white,
    opacity: 0.9,
    marginBottom: SPACING.sm,
  },
  description: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.white,
    opacity: 0.9,
    marginBottom: SPACING.sm,
    lineHeight: 20,
  },
  features: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  feature: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.white,
    fontWeight: '600',
  },
  right: {
    marginLeft: SPACING.md,
  },
  button: {
    backgroundColor: COLORS.white,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.lg,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.success,
    fontSize: FONT_SIZES.md,
    fontWeight: 'bold',
    marginRight: SPACING.xs,
  },
  arrow: {
    color: COLORS.success,
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
  },
});

export default JanSevaBanner;
