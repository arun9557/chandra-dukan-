// LoginScreen.js
import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const LoginScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.logo}>🏪</Text>
        <Text style={styles.title}>Chandra Dukan</Text>
        <TextInput style={styles.input} placeholder="Mobile Number" keyboardType="phone-pad" />
        <TextInput style={styles.input} placeholder="Password" secureTextEntry />
        <TouchableOpacity style={styles.button} onPress={() => navigation.replace('Main')}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.link}>Don't have an account? Register</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flex: 1, justifyContent: 'center', padding: 32 },
  logo: { fontSize: 60, textAlign: 'center', marginBottom: 16 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 32 },
  input: { borderWidth: 1, borderColor: '#e5e7eb', padding: 16, borderRadius: 8, marginBottom: 16, fontSize: 16 },
  button: { backgroundColor: '#16a34a', padding: 16, borderRadius: 8, marginBottom: 16 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
  link: { color: '#16a34a', textAlign: 'center', fontSize: 14 },
});

export default LoginScreen;
