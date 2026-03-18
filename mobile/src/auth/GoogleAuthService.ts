/**
 * Google Authentication Service
 * 
 * Singleton service for handling Google OAuth sign-in operations.
 * Provides methods for configuration, sign-in, sign-out, and token management.
 * Uses @react-native-google-signin/google-signin library.
 */

import { GoogleSignin } from '@react-native-google-signin/google-signin';

export interface GoogleUser {
  name: string;
  email: string;
}

class GoogleAuthService {
  configure(webClientId: string, iosClientId?: string) {
    GoogleSignin.configure({
      webClientId,
      iosClientId,
      offlineAccess: true,
      forceCodeForRefreshToken: true,
    });
  }

  async signIn(): Promise<GoogleUser> {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      
      return {
        name: userInfo.data?.user.name || '',
        email: userInfo.data?.user.email || '',
      };
    } catch (error) {
      throw error;
    }
  }

  async signOut(): Promise<void> {
    try {
      await GoogleSignin.signOut();
    } catch (error) {
      throw error;
    }
  }

  async isSignedIn(): Promise<boolean> {
    try {
      const isSignedIn = await GoogleSignin.getCurrentUser();
      return isSignedIn !== null;
    } catch (error) {
      return false;
    }
  }

  async getCurrentUser(): Promise<GoogleUser | null> {
    try {
      const userInfo = await GoogleSignin.signInSilently();
      
      return {
        name: userInfo.data?.user.name || '',
        email: userInfo.data?.user.email || '',
      };
    } catch (error) {
      return null;
    }
  }

  async getTokens() {
    try {
      const tokens = await GoogleSignin.getTokens();
      return tokens;
    } catch (error) {
      throw error;
    }
  }
}

export default new GoogleAuthService();
