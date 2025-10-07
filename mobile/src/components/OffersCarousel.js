// OffersCarousel.js - Offers carousel with countdown
// ऑफर्स कैरोसेल - काउंटडाउन के साथ

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, FONT_SIZES, RADIUS } from '../utils/theme';

const OffersCarousel = () => {
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const offers = [
    { title: 'First Order', discount: '20% OFF', code: 'FIRST20', colors: ['#ff6b35', '#f7931e'] },
    { title: 'Weekend Deal', discount: '₹100 OFF', code: 'WEEKEND100', colors: ['#6366F1', '#8b5cf6'] },
    { title: 'Free Delivery', discount: '₹0', code: 'Auto Applied', colors: ['#16a34a', '#22c55e'] },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🎁 Special Offers</Text>
        <View style={styles.timer}>
          <Text style={styles.timerText}>⏰ {formatTime(timeLeft)}</Text>
        </View>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {offers.map((offer, index) => (
          <LinearGradient
            key={index}
            colors={offer.colors}
            style={styles.offerCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.badge}>
              <Text style={styles.badgeText}>HOT DEAL</Text>
            </View>
            <Text style={styles.offerTitle}>{offer.title}</Text>
            <Text style={styles.discount}>{offer.discount}</Text>
            <Text style={styles.description}>On all orders</Text>
            <View style={styles.codeContainer}>
              <Text style={styles.codeLabel}>Code:</Text>
              <Text style={styles.code}>{offer.code}</Text>
            </View>
          </LinearGradient>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  timer: {
    backgroundColor: COLORS.error,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
  },
  timerText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.sm,
    fontWeight: 'bold',
  },
  scroll: {
    paddingHorizontal: SPACING.md,
  },
  offerCard: {
    width: 280,
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    marginRight: SPACING.md,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.sm,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  offerTitle: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.white,
    fontWeight: '600',
    marginBottom: SPACING.sm,
  },
  discount: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: SPACING.xs,
  },
  description: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.white,
    opacity: 0.9,
    marginBottom: SPACING.md,
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: SPACING.sm,
    borderRadius: RADIUS.sm,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: COLORS.white,
  },
  codeLabel: {
    color: COLORS.white,
    fontSize: FONT_SIZES.sm,
    marginRight: SPACING.xs,
  },
  code: {
    color: COLORS.white,
    fontSize: FONT_SIZES.md,
    fontWeight: 'bold',
  },
});

export default OffersCarousel;
