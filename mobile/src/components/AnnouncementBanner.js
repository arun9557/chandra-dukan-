// AnnouncementBanner.js - Top announcement banner
// घोषणा बैनर - शीर्ष घोषणा बैनर

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES } from '../utils/theme';

const AnnouncementBanner = ({ text }) => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>🎉</Text>
      <Text style={styles.text} numberOfLines={1}>{text}</Text>
      <TouchableOpacity onPress={() => setVisible(false)} style={styles.closeBtn}>
        <Ionicons name="close" size={20} color={COLORS.white} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
    padding: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  icon: {
    fontSize: 16,
    marginRight: SPACING.sm,
  },
  text: {
    flex: 1,
    color: COLORS.white,
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
  },
  closeBtn: {
    padding: SPACING.xs,
  },
});

export default AnnouncementBanner;
