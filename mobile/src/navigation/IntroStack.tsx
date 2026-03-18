/**
 * Intro Stack Navigator
 * 
 * Navigation stack for intro/splash screens shown to first-time users.
 * Contains splash screens 2, 3, and 4 that introduce the app features.
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen2 from '../screens/SplashScreen2';
import SplashScreen3 from '../screens/SplashScreen3';
import SplashScreen4 from '../screens/SplashScreen4';

const Stack = createNativeStackNavigator();

export default function IntroStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash2" component={SplashScreen2} />
      <Stack.Screen name="Splash3" component={SplashScreen3} />
      <Stack.Screen name="Splash4" component={SplashScreen4} />
    </Stack.Navigator>
  );
}
