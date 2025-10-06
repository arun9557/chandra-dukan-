// constants.js - App constants
// स्थिरांक - ऐप स्थिरांक

export const API_BASE_URL = 'http://localhost:3000/api';

export const ANNOUNCEMENT_TEXT = 'Grand Opening Offer: Get 20% OFF on your first order! Use code: FIRST20';

export const HERO_TITLE = 'Fresh Groceries';
export const HERO_SUBTITLE = 'Delivered Fast';
export const HERO_DESCRIPTION = 'Order from 1000+ products and get them delivered to your doorstep within 1 day. Fresh, affordable, and always on time.';

export const TRUST_BADGES = [
  { icon: '✓', text: '100% Fresh' },
  { icon: '✓', text: 'Best Prices' },
  { icon: '✓', text: 'Fast Delivery' },
];

export const FEATURES = [
  { icon: '⚡', title: 'Next Day Delivery', description: 'Reliable delivery to your doorstep within 1 day' },
  { icon: '💰', title: 'Best Prices', description: 'Lowest prices guaranteed on all products' },
  { icon: '🌿', title: '100% Fresh', description: 'Fresh products sourced daily' },
  { icon: '📱', title: 'Easy Ordering', description: 'Simple and quick ordering process' },
];

export const LOCATION = {
  name: 'Nawalpur Beyora',
  label: 'Deliver to',
};

export const STORE_INFO = {
  name: 'Chandra Dukan',
  nameHindi: 'चंद्रा दुकान',
  phone: '+91 7465073957',
  email: 'support@chandradukan.com',
};

export const JAN_SEVA_INFO = {
  title: 'Jan Seva Kendra',
  titleHindi: 'जन सेवा केंद्र',
  subtitle: 'सरकारी नागरिक सेवाएं',
  subtitleEnglish: 'Government Citizen Services',
  tagline: 'All Government Services at One Place',
  stats: [
    { number: '50+', label: 'Services' },
    { number: '24/7', label: 'Available' },
    { number: 'Fast', label: 'Processing' },
  ],
};

export default {
  API_BASE_URL,
  ANNOUNCEMENT_TEXT,
  HERO_TITLE,
  HERO_SUBTITLE,
  HERO_DESCRIPTION,
  TRUST_BADGES,
  FEATURES,
  LOCATION,
  STORE_INFO,
  JAN_SEVA_INFO,
};
