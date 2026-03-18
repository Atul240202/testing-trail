/**
 * Google Auth Hook
 * 
 * Custom React hook for managing Google authentication state.
 * Provides sign-in, sign-out functionality and tracks authentication status.
 * 
 * Note: This hook is kept for backward compatibility but new code should use
 * the Zustand auth store (useAuthStore) for state management.
 */

import { useState, useEffect } from 'react';
import GoogleAuthService, { GoogleUser } from '../auth/GoogleAuthService';

export const useGoogleAuth = () => {
  const [user, setUser] = useState<GoogleUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkSignInStatus();
  }, []);

  const checkSignInStatus = async () => {
    try {
      const isSignedIn = await GoogleAuthService.isSignedIn();
      if (isSignedIn) {
        const currentUser = await GoogleAuthService.getCurrentUser();
        setUser(currentUser);
      }
    } catch (err) {
      setError('Failed to check sign-in status');
    } finally {
      setLoading(false);
    }
  };

  const signIn = async () => {
    try {
      setLoading(true);
      setError(null);
      const userData = await GoogleAuthService.signIn();
      setUser(userData);
      return userData;
    } catch (err: any) {
      setError(err.message || 'Sign in failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);
      await GoogleAuthService.signOut();
      setUser(null);
    } catch (err: any) {
      setError(err.message || 'Sign out failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    signIn,
    signOut,
    isSignedIn: !!user,
  };
};
