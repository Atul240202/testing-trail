/**
 * BottomNav Component
 *
 * Shared bottom navigation bar used across main app screens.
 * Highlights the active tab and handles navigation between Home, MyResets, and Profile.
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../theme/colors';

type ActiveTab = 'Home' | 'MyResets' | 'Profile';

interface BottomNavProps {
  navigation: any;
  activeTab: ActiveTab;
}

const NAV_ITEMS: {
  name: ActiveTab;
  label: string;
  icon: string;
  iconActive: string;
}[] = [
  { name: 'Home', label: 'Home', icon: 'home-outline', iconActive: 'home' },
  { name: 'MyResets', label: 'My Resets', icon: 'pause-circle-outline', iconActive: 'pause-circle' },
  { name: 'Profile', label: 'You', icon: 'account-outline', iconActive: 'account' },
];

const BottomNav = ({ navigation, activeTab }: BottomNavProps) => {
  return (
    <View style={styles.container}>
      {NAV_ITEMS.map((item) => {
        const isActive = activeTab === item.name;
        return (
          <TouchableOpacity
            key={item.name}
            style={[styles.navItem, isActive && styles.navItemActive]}
            onPress={() => !isActive && navigation.navigate(item.name)}
            activeOpacity={isActive ? 1 : 0.7}
          >
            <MaterialCommunityIcons
              name={isActive ? item.iconActive : item.icon}
              size={28}
              color={isActive ? colors.primaryPurple : '#999'}
            />
            <Text style={[styles.navText, isActive && styles.navTextActive]}>
              {item.label}
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
    backgroundColor: '#FFFFFF',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E5EA',
    paddingBottom: 24,
    paddingTop: 10,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navItemActive: {
    borderWidth: 1.5,
    borderColor: '#5D44A6',
    borderRadius: 12,
    marginHorizontal: 8,
    paddingVertical: 6,
  },
  navText: {
    fontSize: 12,
    fontFamily: 'Inter_28pt-Medium',
    color: '#999',
    marginTop: 4,
  },
  navTextActive: {
    color: '#5D44A6',
  },
});

export default BottomNav;