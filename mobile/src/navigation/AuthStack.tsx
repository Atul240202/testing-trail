/**
 * Auth Stack Navigator
 * 
 * Navigation stack for authentication screens.
 * Currently contains Google authentication screen for user login.
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import GoogleAuthScreen from '../screens/GoogleAuthScreen';

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="GoogleAuth" component={GoogleAuthScreen} />
    </Stack.Navigator>
  );
}
