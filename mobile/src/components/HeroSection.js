// HeroSection.js - Hero section with floating cards
// हीरो सेक्शन - फ्लोटिंग कार्ड्स के साथ

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, FONT_SIZES, RADIUS } from '../utils/theme';

const HeroSection = ({ title, subtitle, description, onStartShopping }) => {
  return (
    <LinearGradient
      colors={[COLORS.primary, COLORS.primaryDark]}
      style={styles.container}
    >
      <View style={styles.badge}>
        <Text style={styles.badgeIcon}>⚡</Text>
        <Text style={styles.badgeText}>Delivery in 1 Day</Text>
      </View>

      <Text style={styles.title}>
        {title}
        {'\n'}
        <Text style={styles.subtitle}>{subtitle}</Text>
      </Text>

      <Text style={styles.description}>{description}</Text>

      <TouchableOpacity style={styles.button} onPress={onStartShopping}>
        <Text style={styles.buttonText}>Start Shopping</Text>
        <Text style={styles.arrow}>→</Text>
      </TouchableOpacity>

      {/* Floating Cards */}
      <View style={styles.floatingCards}>
        <View style={[styles.floatingCard, styles.card1]}>
          <Text style={styles.cardIcon}>🥛</Text>
          <Text style={styles.cardText}>Fresh Dairy</Text>
        </View>
        <View style={[styles.floatingCard, styles.card2]}>
          <Text style={styles.cardIcon}>🥬</Text>
          <Text style={styles.cardText}>Vegetables</Text>
        </View>
        <View style={[styles.floatingCard, styles.card3]}>
          <Text style={styles.cardIcon}>🍞</Text>
          <Text style={styles.cardText}>Bakery</Text>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SPACING.xl,
    borderRadius: RADIUS.lg,
    margin: SPACING.md,
    position: 'relative',
    overflow: 'hidden',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    alignSelf: 'flex-start',
    marginBottom: SPACING.md,
  },
  badgeIcon: {
    fontSize: 16,
    marginRight: SPACING.xs,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
  },
  title: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: SPACING.md,
  },
  subtitle: {
    color: COLORS.amber,
  },
  description: {
    fontSize: FONT_SIZES.md,
    color: COLORS.white,
    opacity: 0.9,
    marginBottom: SPACING.lg,
    lineHeight: 24,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  buttonText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginRight: SPACING.sm,
  },
  arrow: {
    fontSize: FONT_SIZES.xl,
    color: COLORS.primary,
  },
  floatingCards: {
    position: 'absolute',
    right: 20,
    top: 60,
  },
  floatingCard: {
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.sm,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  card1: {
    transform: [{ rotate: '5deg' }],
  },
  card2: {
    transform: [{ rotate: '-3deg' }],
  },
  card3: {
    transform: [{ rotate: '8deg' }],
  },
  cardIcon: {
    fontSize: 24,
    marginRight: SPACING.sm,
  },
  cardText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.black,
  },
});

export default HeroSection;
