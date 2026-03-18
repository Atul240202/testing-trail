/**
 * JWT Helper Utilities
 * 
 * Decode JWT token and extract user information
 */

import { secureStorage } from '../services/secureStorage';
import { decode as base64Decode } from 'base-64';

interface JWTPayload {
  userId?: string;
  _id?: string;
  id?: string;
  sub?: string;
  exp?: number;
  iat?: number;
}

/**
 * Decode JWT token without verification
 * Note: This is safe for extracting user ID as token is already verified by backend
 */
const decodeJWT = (token: string): JWTPayload | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      return null;
    }

    const payload = parts[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padding = base64.length % 4;
    const padded = padding ? base64 + '='.repeat(4 - padding) : base64;
    
    const decoded = base64Decode(padded);
    return JSON.parse(decoded);
  } catch (error) {
    if (__DEV__) {
      console.error('[JWTHelper] Decode error:', error);
    }
    return null;
  }
};

/**
 * Get user ID from stored JWT token
 */
export const getUserIdFromToken = async (): Promise<string | null> => {
  try {
    const token = await secureStorage.getToken();
    if (!token) {
      return null;
    }

    const payload = decodeJWT(token);
    if (!payload) {
      return null;
    }

    return payload.userId || payload._id || payload.id || payload.sub || null;
  } catch (error) {
    if (__DEV__) {
      console.error('[JWTHelper] Get user ID error:', error);
    }
    return null;
  }
};

/**
 * Check if token is expired
 */
export const isTokenExpired = async (): Promise<boolean> => {
  try {
    const token = await secureStorage.getToken();
    if (!token) {
      return true;
    }

    const payload = decodeJWT(token);
    if (!payload || !payload.exp) {
      return true;
    }

    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
  } catch (error) {
    if (__DEV__) {
      console.error('[JWTHelper] Token expiry check error:', error);
    }
    return true;
  }
};
