// TestimonialsSection.js - Customer testimonials
// टेस्टिमोनियल्स सेक्शन - ग्राहक समीक्षाएं

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { COLORS, SPACING, FONT_SIZES, RADIUS } from '../utils/theme';

const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'Rajesh Kumar',
      location: 'Nawalpur',
      rating: 5,
      text: 'Best grocery delivery service in Nawalpur! Always fresh products and super fast delivery.',
      avatar: 'R',
    },
    {
      name: 'Priya Sharma',
      location: 'Beyora',
      rating: 5,
      text: 'Very convenient and reliable. The Jan Seva service is also very helpful!',
      avatar: 'P',
    },
    {
      name: 'Amit Singh',
      location: 'Nawalpur',
      rating: 5,
      text: 'Great prices and excellent customer service. Highly recommended!',
      avatar: 'A',
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⭐ What Our Customers Say</Text>
      <Text style={styles.subtitle}>Real reviews from real customers</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {testimonials.map((testimonial, index) => (
          <View key={index} style={styles.card}>
            <View style={styles.rating}>
              {[...Array(testimonial.rating)].map((_, i) => (
                <Text key={i} style={styles.star}>⭐</Text>
              ))}
            </View>
            <Text style={styles.text}>{testimonial.text}</Text>
            <View style={styles.author}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{testimonial.avatar}</Text>
              </View>
              <View>
                <Text style={styles.name}>{testimonial.name}</Text>
                <Text style={styles.location}>{testimonial.location}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.lg,
    paddingHorizontal: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.black,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray,
    marginBottom: SPACING.md,
  },
  scroll: {
    paddingRight: SPACING.md,
  },
  card: {
    width: 280,
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    borderRadius: RADIUS.md,
    marginRight: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  rating: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
  },
  star: {
    fontSize: 16,
    marginRight: 2,
  },
  text: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray,
    lineHeight: 20,
    marginBottom: SPACING.md,
  },
  author: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  avatarText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
  },
  name: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.black,
  },
  location: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray,
  },
});

export default TestimonialsSection;
