/**
 * Authentication API
 * 
 * API calls for user authentication, registration, and profile management.
 * Handles Google OAuth integration and user session management.
 */

import apiClient from './client';

interface User {
  _id: string;
  email: string;
  name?: string;
  photoUrl?: string;
  onboardingCompleted: boolean;
}

interface GoogleAuthPayload {
  idToken: string;
}

interface AuthResponse {
  success: boolean;
  data: {
    token: string;
    user: User;
  };
}

export const googleLogin = async (payload: GoogleAuthPayload): Promise<{ token: string; user: User }> => {
  const response = await apiClient.post<AuthResponse>('/auth/google', payload);
  return response.data.data;
};

export const getMe = async (): Promise<User | null> => {
  try {
    const response = await apiClient.get<{ success: boolean; data: User }>('/me');
    return response.data.data;
  } catch (error) {
    if (__DEV__) {
      console.error('getMe error:', error);
    }
    return null;
  }
};

export const updateOnboarding = async (): Promise<void> => {
  await apiClient.put('/users/onboarding', { onboardingCompleted: true });
};

export const completeOnboardingApi = async (
  responses: any[]
): Promise<void> => {
  await apiClient.post('/onboarding/complete', { responses });
};
