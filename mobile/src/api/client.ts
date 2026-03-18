/**
 * API Client Configuration
 * 
 * Axios instance with base configuration, request/response interceptors,
 * and automatic token injection for authenticated requests.
 * Uses secure keychain storage for token retrieval.
 * Automatically detects platform and uses appropriate base URL.
 */

import axios from 'axios';
import { secureStorage } from '../services/secureStorage';
import { ENV_CONFIG } from '../config/envConfig';

const API_BASE_URL = ENV_CONFIG.API_BASE_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await secureStorage.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      if (__DEV__) {
        console.error('Token retrieval error:', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      try {
        await secureStorage.removeToken();
      } catch (err) {
        if (__DEV__) {
          console.error('Token removal error:', err);
        }
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
