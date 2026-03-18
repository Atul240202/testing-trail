/**
 * Root Navigator
 * 
 * Main navigation router that conditionally renders different navigation stacks
 * based on the current boot status from the auth store.
 * 
 * Navigation Flow:
 * - loading: Shows splash screen
 * - intro: Shows intro/splash screens for first-time users
 * - unauthenticated: Shows authentication screens
 * - onboarding: Shows onboarding flow
 * - authenticated: Shows main app screens
 */

import React from 'react';
import IntroStack from './IntroStack';
import AuthStack from './AuthStack';
import OnboardingStack from './OnboardingStack';
import MainStack from './MainStack';
import SplashScreen1 from '../screens/SplashScreen1';
import { useAuthStore } from '../store/authStore';

export default function RootNavigator() {
  const { bootStatus } = useAuthStore();

  if (bootStatus === 'loading') {
    return <SplashScreen1 />;
  }

  if (bootStatus === 'intro') {
    return <IntroStack />;
  }

  if (bootStatus === 'unauthenticated') {
    return <AuthStack />;
  }

  if (bootStatus === 'onboarding') {
    return <OnboardingStack />;
  }

  return <MainStack />;
}
