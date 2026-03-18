/**
 * App Entry Point
 * 
 * Main application component that initializes the auth store and sets up navigation.
 * Triggers the boot flow on mount to determine the initial navigation state.
 */

import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './navigation/RootNavigator';
import { useAuthStore } from './store/authStore';
import { initializeHealthDataWorker, stopHealthDataWorker } from './workers/healthDataWorker';
import { registerFcmToken,listenFcmTokenRefresh  } from './services/fcmService';

const App = () => {
  const { bootApp, bootStatus } = useAuthStore();


  useEffect(() => {
    setTimeout(() => {
      bootApp();
    }, 2000);
  }, [bootApp]);

  useEffect(() => {
  if (bootStatus === "authenticated") {
    registerFcmToken();
    const unsubscribe = listenFcmTokenRefresh();

    return unsubscribe;
  }
}, [bootStatus]);


  useEffect(() => {
    if (bootStatus === 'authenticated') {
      initializeHealthDataWorker().catch((error) => {
        if (__DEV__) {
          console.warn('[App] Failed to initialize health data worker:', error);
        }
      });
    } else {
      stopHealthDataWorker().catch((error) => {
        if (__DEV__) {
          console.warn('[App] Failed to stop health data worker:', error);
        }
      });
    }
  }, [bootStatus]);

  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
};

export default App;
