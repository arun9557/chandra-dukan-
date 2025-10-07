// SplashScreen.js - Splash screen with logo
// स्प्लैश स्क्रीन - लोगो के साथ

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    // Auto navigate to Main after 2 seconds
    const timer = setTimeout(() => {
      navigation.replace('Main');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient
      colors={['#16a34a', '#15803d']}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.logo}>🏪</Text>
        <Text style={styles.title}>Chandra Dukan</Text>
        <Text style={styles.subtitle}>चंद्रा दुकान</Text>
        <Text style={styles.tagline}>Fresh Groceries Delivered Fast</Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logo: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 20,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 20,
  },
  tagline: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
  },
});

export default SplashScreen;
