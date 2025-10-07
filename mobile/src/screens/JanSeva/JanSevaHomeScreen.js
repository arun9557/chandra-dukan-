// JanSevaHomeScreen.js - Jan Seva Kendra home
// जन सेवा होम स्क्रीन

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, RADIUS } from '../../utils/theme';
import JanSevaAPIService from '../../services/JanSevaAPIService';

const JanSevaHomeScreen = ({ navigation }) => {
  const [services, setServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    // Backend se JanSeva services fetch karna - Web parity
    const res = await JanSevaAPIService.getServices();
    const list = res?.data || [];
    setServices(list.map(s => ({
      id: s.id,
      name: s.name,
      nameHindi: s.hindi_name || s.name,
      icon: s.icon || '📋',
      price: s.fee || s.price || 0,
      time: s.processing_time || '—',
      category: s.category || 'others',
    })));
  };

  const categories = [
    { id: 'all', name: 'All Services' },
    { id: 'certificates', name: 'Certificates' },
    { id: 'cards', name: 'ID Cards' },
    { id: 'welfare', name: 'Welfare' },
  ];

  const filteredServices = services.filter(s => 
    (activeCategory === 'all' || s.category === activeCategory) &&
    (searchQuery === '' || s.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <LinearGradient colors={[COLORS.success, COLORS.successDark]} style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>🏛️ Jan Seva Kendra</Text>
          <Text style={styles.headerSubtitle}>सरकारी नागरिक सेवाएं</Text>
        </View>
        <View style={{ width: 24 }} />
      </LinearGradient>

      {/* Stats Bar */}
      <View style={styles.statsBar}>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>50+</Text>
          <Text style={styles.statLabel}>Services</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>24/7</Text>
          <Text style={styles.statLabel}>Available</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>Fast</Text>
          <Text style={styles.statLabel}>Processing</Text>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={COLORS.gray} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search services..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Category Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabs}>
        {categories.map(cat => (
          <TouchableOpacity
            key={cat.id}
            style={[styles.tab, activeCategory === cat.id && styles.activeTab]}
            onPress={() => setActiveCategory(cat.id)}
          >
            <Text style={[styles.tabText, activeCategory === cat.id && styles.activeTabText]}>
              {cat.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Services Grid */}
      <ScrollView style={styles.scrollView}>
        <View style={styles.grid}>
          {filteredServices.map(service => (
            <TouchableOpacity
              key={service.id}
              style={styles.serviceCard}
              onPress={() => navigation.navigate('JanSevaDetail', { service })}
            >
              <Text style={styles.serviceIcon}>{service.icon}</Text>
              <Text style={styles.serviceName}>{service.name}</Text>
              <Text style={styles.serviceNameHindi}>{service.nameHindi}</Text>
              <Text style={styles.servicePrice}>₹{service.price}</Text>
              <Text style={styles.serviceTime}>{service.time}</Text>
              <TouchableOpacity style={styles.applyButton}>
                <Text style={styles.applyText}>Apply Now</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', padding: SPACING.md, justifyContent: 'space-between' },
  headerContent: { alignItems: 'center' },
  headerTitle: { fontSize: FONT_SIZES.xl, fontWeight: 'bold', color: COLORS.white },
  headerSubtitle: { fontSize: FONT_SIZES.sm, color: COLORS.white, opacity: 0.9 },
  statsBar: { flexDirection: 'row', backgroundColor: COLORS.white, padding: SPACING.md, justifyContent: 'space-around' },
  stat: { alignItems: 'center' },
  statNumber: { fontSize: FONT_SIZES.xl, fontWeight: 'bold', color: COLORS.success },
  statLabel: { fontSize: FONT_SIZES.sm, color: COLORS.gray },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, margin: SPACING.md, padding: SPACING.md, borderRadius: RADIUS.md, gap: SPACING.sm },
  searchInput: { flex: 1, fontSize: FONT_SIZES.md },
  tabs: { paddingHorizontal: SPACING.md, marginBottom: SPACING.md },
  tab: { paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm, marginRight: SPACING.sm, borderRadius: RADIUS.full, backgroundColor: COLORS.white },
  activeTab: { backgroundColor: COLORS.success },
  tabText: { fontSize: FONT_SIZES.sm, color: COLORS.gray, fontWeight: '600' },
  activeTabText: { color: COLORS.white },
  scrollView: { flex: 1 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', padding: SPACING.md, gap: SPACING.md },
  serviceCard: { width: '47%', backgroundColor: COLORS.white, padding: SPACING.md, borderRadius: RADIUS.md, alignItems: 'center' },
  serviceIcon: { fontSize: 48, marginBottom: SPACING.sm },
  serviceName: { fontSize: FONT_SIZES.sm, fontWeight: '600', textAlign: 'center', marginBottom: 4 },
  serviceNameHindi: { fontSize: FONT_SIZES.xs, color: COLORS.gray, textAlign: 'center', marginBottom: SPACING.sm },
  servicePrice: { fontSize: FONT_SIZES.lg, fontWeight: 'bold', color: COLORS.success, marginBottom: 4 },
  serviceTime: { fontSize: FONT_SIZES.xs, color: COLORS.gray, marginBottom: SPACING.sm },
  applyButton: { backgroundColor: COLORS.success, paddingVertical: SPACING.sm, paddingHorizontal: SPACING.md, borderRadius: RADIUS.sm },
  applyText: { color: COLORS.white, fontSize: FONT_SIZES.xs, fontWeight: 'bold' },
});

export default JanSevaHomeScreen;
