/**
 * Authentication Configuration
 * 
 * Centralized configuration for authentication providers.
 * Loads Google OAuth client IDs from environment variables.
 */

import { ENV_CONFIG } from './envConfig';

export const AUTH_CONFIG = {
  get GOOGLE_WEB_CLIENT_ID() { return ENV_CONFIG.GOOGLE_WEB_CLIENT_ID; },
  get GOOGLE_IOS_CLIENT_ID() { return ENV_CONFIG.GOOGLE_IOS_CLIENT_ID; },
  get GOOGLE_ANDROID_CLIENT_ID() { return ENV_CONFIG.GOOGLE_ANDROID_CLIENT_ID; }
};
