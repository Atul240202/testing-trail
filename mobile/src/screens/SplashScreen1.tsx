/**
 * Splash Screen 1
 * 
 * Initial loading screen shown during app boot.
 * Displays app logo with gradient background while auth state is being determined.
 */

import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import PauseButton from '../components/PauseButton';
import { colors } from '../theme/colors';

const SplashScreen1 = () => {
  return (
    <LinearGradient
      colors={[colors.gradientStart, colors.gradientEnd]}
      style={styles.container}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <View style={styles.logoWrapper}>
        <PauseButton />
      </View>
    </LinearGradient>
  );
};

export default SplashScreen1;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoWrapper: {
    marginTop: -50,
  },
});