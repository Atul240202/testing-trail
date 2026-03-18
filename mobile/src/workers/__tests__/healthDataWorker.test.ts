/**
 * Health Data Worker Tests
 */

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);
jest.mock('../../services/healthConnect');
jest.mock('../../services/healthDataCollector');
jest.mock('../../config/envConfig', () => ({
  ENV_CONFIG: {
    BACKGROUND_TASK_ID: 'com.pause.healthdata.fetch',
    HEALTH_DATA_STORAGE_KEY: '@pause_health_data_queue',
    HEALTH_DATA_FETCH_INTERVAL: 15,
  },
  getEnvVar: jest.fn((key: string, defaultValue: string) => defaultValue),
}));

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  collectAndStoreHealthData,
  getStoredHealthData,
  clearStoredHealthData,
  HealthDataEntry,
} from '../healthDataWorker';

describe('Health Data Worker', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
  });

  describe('collectAndStoreHealthData', () => {
    it('should collect and store health data when connected', async () => {
      const { isHealthConnectConnected } = require('../../services/healthConnect');
      const { getHealthData } = require('../../services/healthDataCollector');

      isHealthConnectConnected.mockResolvedValue(true);
      getHealthData.mockResolvedValue({
        heartRate: 72,
        stepsCount: 150,
      });

      await collectAndStoreHealthData();

      const data = await getStoredHealthData();
      expect(data.length).toBe(1);
      expect(data[0].heartRate).toBe(72);
      expect(data[0].stepsCount).toBe(150);
    });

    it('should not store data when Health Connect is not connected', async () => {
      const { isHealthConnectConnected } = require('../../services/healthConnect');
      isHealthConnectConnected.mockResolvedValue(false);

      await collectAndStoreHealthData();

      const data = await getStoredHealthData();
      expect(data.length).toBe(0);
    });
  });

  describe('getStoredHealthData', () => {
    it('should return empty array when no data exists', async () => {
      const data = await getStoredHealthData();
      expect(data).toEqual([]);
    });

    it('should return stored data', async () => {
      const mockData: HealthDataEntry[] = [
        {
          timestamp: new Date().toISOString(),
          heartRate: 72,
          stepsCount: 150,
          deviceInfo: 'android 13',
        },
      ];

      await AsyncStorage.setItem(
        '@pause_health_data_queue',
        JSON.stringify(mockData)
      );

      const data = await getStoredHealthData();
      expect(data).toEqual(mockData);
    });
  });

  describe('clearStoredHealthData', () => {
    it('should clear all stored data', async () => {
      const mockData: HealthDataEntry[] = [
        {
          timestamp: new Date().toISOString(),
          heartRate: 72,
          stepsCount: 150,
          deviceInfo: 'android 13',
        },
      ];

      await AsyncStorage.setItem(
        '@pause_health_data_queue',
        JSON.stringify(mockData)
      );

      await clearStoredHealthData();

      const data = await getStoredHealthData();
      expect(data).toEqual([]);
    });
  });
});
