/**
 * Environment Configuration Wrapper
 * 
 * Safe wrapper around react-native-config that handles null native module gracefully.
 * Provides fallback values when config is unavailable.
 */

import { Platform, NativeModules } from 'react-native';

let configCache: Record<string, string> | null = null;
let configLoadAttempted = false;

/**
 * Safely load react-native-config module
 */
const loadConfig = (): Record<string, string> => {
  if (configLoadAttempted) {
    return configCache || {};
  }

  configLoadAttempted = true;

  try {
    // Try to load react-native-config
    const RNConfig = require('react-native-config');
    
    if (RNConfig && RNConfig.default && typeof RNConfig.default === 'object') {
      configCache = RNConfig.default;
    } else if (RNConfig && typeof RNConfig === 'object') {
      configCache = RNConfig;
    } else {
      configCache = {};
    }
  } catch (error) {
    if (__DEV__) {
      console.warn('[EnvConfig] Failed to load react-native-config, using BuildConfig fallback:', error);
    }
    configCache = {};
  }

  // On Android, try to use BuildConfig as fallback
  if (Platform.OS === 'android' && Object.keys(configCache || {}).length === 0) {
    try {
      const BuildConfig = NativeModules.RNConfig?.BuildConfig;
      if (BuildConfig && typeof BuildConfig === 'object') {
        configCache = BuildConfig;
        if (__DEV__) {
          console.log('[EnvConfig] Using BuildConfig fallback');
        }
      }
    } catch (error) {
      if (__DEV__) {
        console.warn('[EnvConfig] BuildConfig fallback failed:', error);
      }
    }
  }

  return configCache || {};
};

/**
 * Get environment variable with fallback
 */
export const getEnvVar = (key: string, defaultValue: string = ''): string => {
  try {
    const config = loadConfig();
    return config[key] || defaultValue;
  } catch (error) {
    if (__DEV__) {
      console.warn(`[EnvConfig] Failed to read ${key}:`, error);
    }
    return defaultValue;
  }
};

/**
 * Get all environment variables
 */
export const getAllEnvVars = (): Record<string, string> => {
  return loadConfig();
};

/**
 * Check if config is loaded
 */
export const isConfigLoaded = (): boolean => {
  return configCache !== null && Object.keys(configCache).length > 0;
};

// Export commonly used config values with fallbacks
export const ENV_CONFIG = {
  // Google OAuth
  get GOOGLE_WEB_CLIENT_ID() {
    return getEnvVar('GOOGLE_WEB_CLIENT_ID', '765108637481-kdl4c8ii4jkuak6ff3vbf27g9efmn6sr.apps.googleusercontent.com');
  },
  get GOOGLE_IOS_CLIENT_ID() {
    return getEnvVar('GOOGLE_IOS_CLIENT_ID', '765108637481-mhjihk7fiiarivvidd3fvidskkererrb.apps.googleusercontent.com');
  },
  get GOOGLE_ANDROID_CLIENT_ID() {
    return getEnvVar('GOOGLE_ANDROID_CLIENT_ID', '765108637481-f4dfv7l1v2j2qr6igj3j9caaa0hled1h.apps.googleusercontent.com');
  },
  
  // API Configuration
  get API_BASE_URL() {
    const configUrl = getEnvVar('API_BASE_URL', '');
    if (configUrl && configUrl.trim() !== '') {
      return configUrl.trim();
    }
    return Platform.OS === 'android' 
      ? 'http://10.0.2.2:5001/api/v1'
      : 'http://localhost:5001/api/v1';
  },
  
  // Background Worker
  get HEALTH_DATA_FETCH_INTERVAL() {
    return parseInt(getEnvVar('HEALTH_DATA_FETCH_INTERVAL', '15'), 10);
  },
  get BACKGROUND_TASK_ID() {
    return getEnvVar('BACKGROUND_TASK_ID', 'com.pause.healthdata.fetch');
  },
  get HEALTH_DATA_STORAGE_KEY() {
    return getEnvVar('HEALTH_DATA_STORAGE_KEY', '@pause_health_data_queue');
  },
};
