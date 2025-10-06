// JanSevaFormScreen.js - Application form
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, FONT_SIZES, RADIUS } from '../../utils/theme';
// Document picker temporarily disabled
const DocumentPicker = {
  getDocumentAsync: async () => ({
    type: 'cancel',
    name: 'document.pdf',
    size: 0,
    uri: '',
  }),
};

import JanSevaAPIService from '../../services/JanSevaAPIService';

const JanSevaFormScreen = ({ route, navigation }) => {
  const { service } = route.params;
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    address: '',
  });
  const [documents, setDocuments] = useState([
    // Mock document for testing
    { name: 'document1.pdf', size: 1024, type: 'application/pdf' },
    { name: 'image1.jpg', size: 2048, type: 'image/jpeg' }
  ]);
  const [paymentMethod, setPaymentMethod] = useState('COD');

  const pickDocument = async () => {
    try {
      // Simulate document picker
      Alert.alert('Info', 'Document upload functionality is temporarily disabled');
      /*
      const result = await DocumentPicker.getDocumentAsync({ type: 'application/pdf,image/*' });
      if (result.type === 'success') {
        // Backend par upload - Web parity (Hinglish)
        try {
          const uploadRes = await JanSevaAPIService.uploadDocument(result);
          setDocuments([...documents, { ...result, serverPath: uploadRes?.path }]);
          Alert.alert('Success', 'Document uploaded');
        } catch (e) {
          setDocuments([...documents, result]);
          Alert.alert('Uploaded (Local)', 'Server upload failed, local ref saved');
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.mobile) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }
    try {
      const payload = {
        service_id: service.id,
        name: formData.name,
        mobile: formData.mobile,
        email: formData.email,
        address: formData.address,
        documents: documents.map(d => ({ name: d.name, uri: d.serverPath || d.uri })),
        payment_method: paymentMethod.toLowerCase(),
      };
      const res = await JanSevaAPIService.submitApplication(payload);
      navigation.navigate('JanSevaConfirmation', { service, formData, application: res?.data || res });
    } catch (e) {
      Alert.alert('Error', 'Application submit karte waqt samasya aayi.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Application Form</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.serviceInfo}>
          <Text style={styles.serviceIcon}>{service.icon}</Text>
          <Text style={styles.serviceName}>{service.name}</Text>
          <Text style={styles.servicePrice}>Fee: ₹{service.price}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Details</Text>
          <TextInput style={styles.input} placeholder="Full Name *" value={formData.name} onChangeText={(text) => setFormData({...formData, name: text})} />
          <TextInput style={styles.input} placeholder="Mobile Number *" keyboardType="phone-pad" value={formData.mobile} onChangeText={(text) => setFormData({...formData, mobile: text})} />
          <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" value={formData.email} onChangeText={(text) => setFormData({...formData, email: text})} />
          <TextInput style={[styles.input, styles.textArea]} placeholder="Address" multiline numberOfLines={3} value={formData.address} onChangeText={(text) => setFormData({...formData, address: text})} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upload Documents</Text>
          <TouchableOpacity style={styles.uploadButton} onPress={pickDocument}>
            <Ionicons name="cloud-upload-outline" size={24} color={COLORS.primary} />
            <Text style={styles.uploadText}>Upload Document (PDF/Image)</Text>
          </TouchableOpacity>
          {documents.map((doc, index) => (
            <View key={index} style={styles.docItem}>
              <Ionicons name="document" size={20} color={COLORS.success} />
              <Text style={styles.docName}>{doc.name}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <TouchableOpacity style={[styles.paymentOption, paymentMethod === 'COD' && styles.activePayment]} onPress={() => setPaymentMethod('COD')}>
            <Ionicons name="cash-outline" size={24} color={paymentMethod === 'COD' ? COLORS.success : COLORS.gray} />
            <Text style={styles.paymentText}>Cash on Delivery</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.paymentOption, paymentMethod === 'UPI' && styles.activePayment]} onPress={() => setPaymentMethod('UPI')}>
            <Ionicons name="card-outline" size={24} color={paymentMethod === 'UPI' ? COLORS.success : COLORS.gray} />
            <Text style={styles.paymentText}>UPI Payment</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>Submit Application</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: SPACING.md, backgroundColor: COLORS.white },
  headerTitle: { fontSize: FONT_SIZES.lg, fontWeight: 'bold' },
  scrollView: { flex: 1 },
  serviceInfo: { backgroundColor: COLORS.white, padding: SPACING.lg, alignItems: 'center', marginBottom: SPACING.md },
  serviceIcon: { fontSize: 48, marginBottom: SPACING.sm },
  serviceName: { fontSize: FONT_SIZES.xl, fontWeight: 'bold', marginBottom: SPACING.xs },
  servicePrice: { fontSize: FONT_SIZES.md, color: COLORS.success, fontWeight: '600' },
  section: { backgroundColor: COLORS.white, padding: SPACING.md, marginBottom: SPACING.md },
  sectionTitle: { fontSize: FONT_SIZES.lg, fontWeight: 'bold', marginBottom: SPACING.md },
  input: { borderWidth: 1, borderColor: COLORS.lightGray, borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.md, fontSize: FONT_SIZES.md },
  textArea: { height: 80, textAlignVertical: 'top' },
  uploadButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderStyle: 'dashed', borderColor: COLORS.primary, borderRadius: RADIUS.md, padding: SPACING.lg, gap: SPACING.sm },
  uploadText: { color: COLORS.primary, fontWeight: '600' },
  docItem: { flexDirection: 'row', alignItems: 'center', padding: SPACING.sm, backgroundColor: COLORS.background, borderRadius: RADIUS.sm, marginTop: SPACING.sm, gap: SPACING.sm },
  docName: { fontSize: FONT_SIZES.sm },
  paymentOption: { flexDirection: 'row', alignItems: 'center', padding: SPACING.md, borderWidth: 1, borderColor: COLORS.lightGray, borderRadius: RADIUS.md, marginBottom: SPACING.sm, gap: SPACING.md },
  activePayment: { borderColor: COLORS.success, backgroundColor: '#f0fdf4' },
  paymentText: { fontSize: FONT_SIZES.md, fontWeight: '600' },
  footer: { padding: SPACING.md, backgroundColor: COLORS.white },
  submitButton: { backgroundColor: COLORS.success, padding: SPACING.md, borderRadius: RADIUS.lg, alignItems: 'center' },
  submitText: { color: COLORS.white, fontSize: FONT_SIZES.lg, fontWeight: 'bold' },
});

export default JanSevaFormScreen;
