// CustomTabBar.js - Custom bottom tab bar
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CustomTabBar = ({ state, descriptors, navigation }) => {
  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel || route.name;
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        // Icon mapping
        const iconName = {
          Home: 'home',
          Products: 'grid',
          Cart: 'basket',
          Dashboard: 'analytics',
          Profile: 'person',
        }[route.name] || 'home';

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={styles.tab}
          >
            <Ionicons 
              name={isFocused ? iconName : `${iconName}-outline`}
              size={24} 
              color={isFocused ? '#16a34a' : '#6b7280'} 
            />
            <Text style={[styles.label, isFocused && styles.labelFocused]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingBottom: 8,
  },
  tab: {
    flex: 1,
    paddingTop: 12,
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  labelFocused: {
    color: '#16a34a',
    fontWeight: 'bold',
  },
});

export default CustomTabBar;
