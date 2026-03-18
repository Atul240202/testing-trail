/**
 * Logger Utility
 * 
 * Centralized logging with environment-based control.
 * In production, only errors are logged.
 */

const isDevelopment = process.env.NODE_ENV === 'development';

export const logger = {
  info: (message, ...args) => {
    if (isDevelopment) {
      console.log(`[INFO] ${message}`, ...args);
    }
  },

  error: (message, ...args) => {
    console.error(`[ERROR] ${message}`, ...args);
  },

  warn: (message, ...args) => {
    if (isDevelopment) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  },

  debug: (message, ...args) => {
    if (isDevelopment) {
      console.log(`[DEBUG] ${message}`, ...args);
    }
  },
};
