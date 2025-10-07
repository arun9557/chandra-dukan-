// QuickActions.js
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const QuickActions = ({ onActionPress }) => {
  const actions = [
    { id: 'offers', icon: 'gift', label: 'Offers' },
    { id: 'janseva', icon: 'document-text', label: 'Jan Seva' },
  ];

  return (
    <View style={styles.container}>
      {actions.map((action) => (
        <TouchableOpacity
          key={action.id}
          style={styles.action}
          onPress={() => onActionPress && onActionPress(action.id)}
        >
          <Ionicons name={action.icon} size={24} color="#16a34a" />
          <Text style={styles.label}>{action.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  action: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
  },
  label: {
    marginTop: 8,
    fontSize: 12,
  },
});

export default QuickActions;
