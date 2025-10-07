// JanSevaConfirmationScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, SPACING, FONT_SIZES } from '../../utils/theme';

const JanSevaConfirmationScreen = ({ route, navigation }) => {
  const { service, application } = route.params;
  const applicationId = application?.id || ('JS' + Date.now().toString().slice(-8));

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.icon}>✅</Text>
        <Text style={styles.title}>Application Submitted!</Text>
        <Text style={styles.subtitle}>Aapki application safalta se submit ho gayi</Text>
        <View style={styles.card}>
          <Text style={styles.label}>Application ID</Text>
          <Text style={styles.appId}>{applicationId}</Text>
          <Text style={styles.label}>Service</Text>
          <Text style={styles.value}>{service?.name}</Text>
          <Text style={styles.label}>Processing Time</Text>
          <Text style={styles.value}>{service?.time || application?.processing_time || '—'}</Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.buttonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.xl },
  icon: { fontSize: 80, marginBottom: SPACING.lg },
  title: { fontSize: FONT_SIZES.xxl, fontWeight: 'bold', marginBottom: SPACING.sm },
  subtitle: { fontSize: FONT_SIZES.md, color: COLORS.gray, marginBottom: SPACING.xl, textAlign: 'center' },
  card: { backgroundColor: COLORS.background, padding: SPACING.lg, borderRadius: 12, width: '100%', marginBottom: SPACING.xl },
  label: { fontSize: FONT_SIZES.sm, color: COLORS.gray, marginBottom: 4 },
  appId: { fontSize: FONT_SIZES.xl, fontWeight: 'bold', color: COLORS.success, marginBottom: SPACING.md },
  value: { fontSize: FONT_SIZES.md, fontWeight: '600', marginBottom: SPACING.md },
  button: { backgroundColor: COLORS.success, paddingVertical: SPACING.md, paddingHorizontal: SPACING.xl, borderRadius: 12, width: '100%' },
  buttonText: { color: COLORS.white, fontSize: FONT_SIZES.lg, fontWeight: 'bold', textAlign: 'center' },
});

export default JanSevaConfirmationScreen;
