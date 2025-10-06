// theme.js - Theme configuration matching website
// थीम कॉन्फ़िगरेशन - वेबसाइट से मेल खाता हुआ

export const COLORS = {
  // Primary colors - मुख्य रंग
  primary: '#6366F1',        // Indigo (website primary)
  primaryDark: '#4f46e5',
  primaryLight: '#818cf8',
  
  // Secondary colors - द्वितीयक रंग
  secondary: '#ff6b35',      // Orange
  secondaryDark: '#f7931e',
  secondaryLight: '#ff8c5a',
  
  // Success/Green - सफलता/हरा
  success: '#16a34a',        // Green (Jan Seva)
  successDark: '#15803d',
  successLight: '#22c55e',
  
  // Background - पृष्ठभूमि
  background: '#f8f9fa',
  backgroundDark: '#e5e7eb',
  
  // Neutral colors - तटस्थ रंग
  white: '#ffffff',
  black: '#000000',
  gray: '#6b7280',
  grayLight: '#9ca3af',
  grayDark: '#4b5563',
  lightGray: '#e5e7eb',
  
  // Status colors - स्थिति रंग
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
  
  // Accent colors - उच्चारण रंग
  violet: '#8b5cf6',
  rose: '#f43f5e',
  emerald: '#10b981',
  amber: '#f59e0b',
};

export const FONTS = {
  // Font family - फ़ॉन्ट परिवार
  regular: 'System',
  medium: 'System',
  semiBold: 'System',
  bold: 'System',
  extraBold: 'System',
};

export const FONT_SIZES = {
  // Font sizes - फ़ॉन्ट आकार
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
};

export const SPACING = {
  // Spacing - अंतराल
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const RADIUS = {
  // Border radius - सीमा त्रिज्या
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
};

export const SHADOWS = {
  // Shadows - छाया
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
};

export default {
  COLORS,
  FONTS,
  FONT_SIZES,
  SPACING,
  RADIUS,
  SHADOWS,
};
