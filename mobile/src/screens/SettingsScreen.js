// SettingsScreen.js
import React from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SettingsScreen = () => {
  const [notifications, setNotifications] = React.useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.setting}>
        <Text style={styles.settingText}>Notifications</Text>
        <Switch value={notifications} onValueChange={setNotifications} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', padding: 16 },
  setting: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 12 },
  settingText: { fontSize: 16 },
});

export default SettingsScreen;
