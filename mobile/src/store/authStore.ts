/**
 * Authentication Store
 * 
 * Global state management for authentication and app boot flow using Zustand.
 * Manages user session, token persistence, and navigation state based on authentication status.
 * Uses secure keychain storage for JWT tokens.
 * 
 * Boot Flow:
 * 1. loading -> Check intro seen
 * 2. intro -> Show splash screens (first time users)
 * 3. unauthenticated -> Show login screen
 * 4. onboarding -> Show onboarding (if not completed)
 * 5. authenticated -> Show main app
 */

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getMe, completeOnboardingApi } from '../api/auth';
import { secureStorage } from '../services/secureStorage';

export type BootStatus =
  | 'loading'
  | 'intro'
  | 'unauthenticated'
  | 'onboarding'
  | 'authenticated';

interface User {
  _id: string;
  email: string;
  name?: string;
  photoUrl?: string;
  onboardingCompleted: boolean;
}

interface AuthStore {
  bootStatus: BootStatus;
  user: User | null;
  token: string | null;

  setBootStatus: (status: BootStatus) => void;
  bootApp: () => Promise<void>;
  loginSuccess: (data: { token: string; user: User }) => Promise<void>;
  completeOnboarding: (responses?: any[]) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  bootStatus: 'loading',
  user: null,
  token: null,

  setBootStatus: (status) => set({ bootStatus: status }),

  bootApp: async () => {
    try {
      set({ bootStatus: 'loading' });

      const introSeen = await AsyncStorage.getItem('hasSeenIntro');

      if (!introSeen) {
        set({ bootStatus: 'intro' });
        return;
      }

      const token = await secureStorage.getToken();

      if (!token) {
        set({ bootStatus: 'unauthenticated', token: null, user: null });
        return;
      }

      const user = await getMe();

      if (!user) {
        await secureStorage.removeToken();
        set({ bootStatus: 'unauthenticated', token: null, user: null });
        return;
      }

      if (!user.onboardingCompleted) {
        set({ bootStatus: 'onboarding', token, user });
      } else {
        set({ bootStatus: 'authenticated', token, user });
      }
    } catch (err) {
      if (__DEV__) {
        console.error('Boot error:', err);
      }
      await secureStorage.removeToken();
      set({ bootStatus: 'unauthenticated', token: null, user: null });
    }
  },

  loginSuccess: async ({ token, user }) => {
    await secureStorage.setToken(token);

    if (!user.onboardingCompleted) {
      set({
        token,
        user,
        bootStatus: 'onboarding',
      });
    } else {
      set({
        token,
        user,
        bootStatus: 'authenticated',
      });
    }
  },

  completeOnboarding: async (responses?: any[]) => {
    const currentUser = get().user;
    if (!currentUser || !responses) return;
  
    try {
      await completeOnboardingApi(responses);
  
      set({
        user: { ...currentUser, onboardingCompleted: true },
        bootStatus: "authenticated",
      });
  
    } catch (error) {
      console.log("Onboarding error:", error);
    }
  },

  logout: async () => {
    await secureStorage.removeToken();

    set({
      token: null,
      user: null,
      bootStatus: 'unauthenticated',
    });
  },
}));
