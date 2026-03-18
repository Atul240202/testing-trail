/**
 * Profile Screen
 *
 * Displays user profile information, Pause settings, support links, and sign out.
 * Matches the "You" tab design with sections for Profile, Pause Settings, and Support.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  SafeAreaView,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors } from '../theme/colors';
import { useAuthStore } from '../store/authStore';

const ProfileScreen = ({ navigation }: any) => {
  const { user, logout, setBootStatus } = useAuthStore();
  const userName = user?.name || 'Sara';
  const userEmail = user?.email || 'sara@example.com';
  const userInitial = userName.charAt(0).toUpperCase();

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => logout(),
      },
    ]);
  };

  const handleRowPress = (label: string) => {
    if (label === 'Terms of Service') {
      navigation.navigate('TermsOfService');
      return;
    }
  
    if (label === 'Privacy Policy') {
      navigation.navigate('PrivacyPolicy');
      return;
    }
  
    if (label === 'Restart Onboarding') {
      Alert.alert(
        'Restart Onboarding',
        'This will restart the onboarding setup. Continue?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Restart',
            onPress: () => setBootStatus('onboarding'),
          },
        ]
      );
      return;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>

        {/* Page Title */}
        <Text style={styles.pageTitle}>You</Text>

        {/* Avatar Card */}
        <View style={styles.avatarCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{userInitial}</Text>
          </View>
          <Text style={styles.nameText}>{userName}</Text>
          <Text style={styles.emailText}>{userEmail}</Text>
        </View>

        {/* Profile Section */}
        <Text style={styles.sectionLabel}>PROFILE</Text>
        <View style={styles.section}>
          <SettingsRow
            icon="account-outline"
            label="Name"
            value={userName}
            onPress={() => handleRowPress('Name')}
          />
          <Divider />
          <SettingsRow
            icon="email-outline"
            label="Email"
            value={userEmail}
            onPress={() => handleRowPress('Email')}
          />
        </View>

        {/* Pause Settings Section */}
        <Text style={styles.sectionLabel}>PAUSE SETTINGS</Text>
        <View style={styles.section}>
          <SettingsRow
            icon="watch-outline"
            label="Connected Devices"
            value="Paired"
            onPress={() => handleRowPress('Connected Devices')}
          />
          <Divider />
          <SettingsRow
            icon="timer-outline"
            label="Reset Duration"
            value="10 minutes"
            onPress={() => handleRowPress('Reset Duration')}
          />
          <Divider />
          <SettingsRow
            icon="clock-outline"
            label="Work Hours"
            value="9:00 AM – 6:00 PM"
            onPress={() => handleRowPress('Work Hours')}
          />
        </View>

        {/* Support Section */}
        <Text style={styles.sectionLabel}>SUPPORT</Text>
        <View style={styles.section}>
          <SettingsRow
            icon="help-circle-outline"
            label="Help & Support"
            onPress={() => handleRowPress('Help & Support')}
          />
          <Divider />
          <SettingsRow
            icon="refresh"
            label="Restart Onboarding"
            onPress={() => handleRowPress('Restart Onboarding')}
          />
          <Divider />
          <SettingsRow
            icon="shield-outline"
            label="Privacy Policy"
            onPress={() => handleRowPress('Privacy Policy')}
          />
          <Divider />
          <SettingsRow
            icon="file-document-outline"
            label="Terms of Service"
            onPress={() => handleRowPress('Terms of Service')}
          />
        </View>

        {/* Sign Out */}
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <MaterialCommunityIcons name="logout" size={20} color="#E53935" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        {/* Version */}
        <Text style={styles.version}>Pause v1.0.0</Text>

      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('Home')}
        >
          <MaterialCommunityIcons name="home-outline" size={28} color="#999" />
          <Text style={styles.navText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('MyResets')}
        >
          <MaterialCommunityIcons name="pause-circle-outline" size={28} color="#999" />
          <Text style={styles.navText}>My Resets</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <MaterialCommunityIcons name="account" size={28} color={colors.primaryPurple} />
          <Text style={[styles.navText, styles.navTextActive]}>You</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

/* ─── Sub-components ─────────────────────────────────────────── */

const SettingsRow = ({
  icon,
  label,
  value,
  onPress,
}: {
  icon: string;
  label: string;
  value?: string;
  onPress: () => void;
}) => (
  <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.rowLeft}>
      <View style={styles.iconWrapper}>
        <MaterialCommunityIcons name={icon} size={20} color={colors.primaryPurple} />
      </View>
      <Text style={styles.rowLabel}>{label}</Text>
    </View>
    <View style={styles.rowRight}>
      {value ? <Text style={styles.rowValue}>{value}</Text> : null}
      <MaterialCommunityIcons name="chevron-right" size={20} color="#C0C0C0" />
    </View>
  </TouchableOpacity>
);

const Divider = () => <View style={styles.divider} />;

/* ─── Styles ─────────────────────────────────────────────────── */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F4F4F8',
  },
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },

  pageTitle: {
    fontSize: 32,
    fontFamily: 'Inter_28pt-SemiBold',
    color: colors.textDark,
    marginBottom: 20,
    marginTop: 40,
  },

  // Avatar Card
  avatarCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 28,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primaryPurple,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 28,
    fontFamily: 'Inter_28pt-SemiBold',
    color: '#fff',
  },
  nameText: {
    fontSize: 18,
    fontFamily: 'Inter_28pt-SemiBold',
    color: colors.textDark,
    marginBottom: 4,
  },
  emailText: {
    fontSize: 14,
    fontFamily: 'Inter_28pt-Regular',
    color: colors.textGrey,
  },

  // Sections
  sectionLabel: {
    fontSize: 12,
    fontFamily: 'Inter_28pt-SemiBold',
    color: '#A0A0A8',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginLeft: 4,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    overflow: 'hidden',
  },

  // Row
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#EEE9FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: {
    fontSize: 15,
    fontFamily: 'Inter_28pt-Regular',
    color: colors.textDark,
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rowValue: {
    fontSize: 14,
    fontFamily: 'Inter_28pt-Regular',
    color: colors.textGrey,
    marginRight: 2,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#EBEBEB',
    marginLeft: 64,
  },

  // Sign Out
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFF0F0',
    borderRadius: 16,
    paddingVertical: 16,
    marginBottom: 16,
  },
  signOutText: {
    fontSize: 15,
    fontFamily: 'Inter_28pt-SemiBold',
    color: '#E53935',
  },
  version: {
    textAlign: 'center',
    fontSize: 13,
    fontFamily: 'Inter_28pt-Regular',
    color: '#B0B0B8',
    marginBottom: 8,
  },

  // Bottom Nav
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5E5E5',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navText: {
    fontSize: 12,
    fontFamily: 'Inter_28pt-Medium',
    color: '#999',
    marginTop: 4,
  },
  navTextActive: {
    color: colors.primaryPurple,
  },
});

export default ProfileScreen;
