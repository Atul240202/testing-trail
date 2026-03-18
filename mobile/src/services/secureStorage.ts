/**
 * Secure Storage Service
 * 
 * Provides secure storage for sensitive data like JWT tokens using react-native-keychain.
 * Uses iOS Keychain and Android Keystore for hardware-backed encryption.
 * Falls back to AsyncStorage if keychain is unavailable (development/testing).
 */

import * as Keychain from 'react-native-keychain';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SERVICE_NAME = 'com.pause.app';
const FALLBACK_KEY = '@pause_auth_token';

let useKeychain = true;

export const secureStorage = {
  async setToken(token: string): Promise<void> {
    try {
      if (useKeychain) {
        try {
          await Keychain.setGenericPassword('auth_token', token, {
            service: SERVICE_NAME,
          });
          return;
        } catch (keychainError) {
          useKeychain = false;
        }
      }
      
      await AsyncStorage.setItem(FALLBACK_KEY, token);
    } catch (error) {
      throw error;
    }
  },

  async getToken(): Promise<string | null> {
    try {
      if (useKeychain) {
        try {
          const credentials = await Keychain.getGenericPassword({
            service: SERVICE_NAME,
          });
          
          if (credentials) {
            return credentials.password;
          }
          
          const fallbackToken = await AsyncStorage.getItem(FALLBACK_KEY);
          if (fallbackToken) {
            return fallbackToken;
          }
          
          return null;
        } catch (keychainError) {
          useKeychain = false;
        }
      }
      
      return await AsyncStorage.getItem(FALLBACK_KEY);
    } catch (error) {
      return null;
    }
  },

  async removeToken(): Promise<void> {
    try {
      if (useKeychain) {
        try {
          await Keychain.resetGenericPassword({
            service: SERVICE_NAME,
          });
        } catch (keychainError) {
          useKeychain = false;
        }
      }
      
      await AsyncStorage.removeItem(FALLBACK_KEY);
    } catch (error) {
      throw error;
    }
  },
};
