/**
 * Health Data Background Worker
 * 
 * Collects health data every 15 minutes and syncs to backend every 1 hour.
 * Handles doze mode, battery optimization, and various device states.
 * Stores data in AsyncStorage for batched sync with backend.
 */

import BackgroundFetch from 'react-native-background-fetch';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { isHealthConnectConnected } from '../services/healthConnect';
import { getHealthData } from '../services/healthDataCollector';
import { syncHealthData, updateLastSyncTime } from '../services/healthDataSync';
import { ENV_CONFIG } from '../config/envConfig';

const TASK_ID = ENV_CONFIG.BACKGROUND_TASK_ID;
const STORAGE_KEY = ENV_CONFIG.HEALTH_DATA_STORAGE_KEY;
const LAST_SYNC_TIME_KEY = '@pause_last_sync_timestamp';
const FETCH_INTERVAL = ENV_CONFIG.HEALTH_DATA_FETCH_INTERVAL;
const SYNC_INTERVAL_MS = 60 * 60 * 1000; // 1 hour in milliseconds

export interface HealthDataEntry {
  timestamp: string;
  heartRate: number | null;
  stepsCount: number | null;
  deviceInfo: string;
}

/**
 * Initialize background fetch worker
 * Collects data every 15 minutes, syncs to backend every 1 hour
 */
export const initializeHealthDataWorker = async (): Promise<void> => {
  try {
    if (!BackgroundFetch || !BackgroundFetch.configure) {
      if (__DEV__) {
        console.log('[BackgroundFetch] Module not available, skipping initialization');
      }
      return;
    }
    
    const status = await BackgroundFetch.configure(
      {
        minimumFetchInterval: FETCH_INTERVAL,
        stopOnTerminate: false,
        startOnBoot: true,
        enableHeadless: true,
        requiresBatteryNotLow: false,
        requiresCharging: false,
        requiresDeviceIdle: false,
        requiresStorageNotLow: false,
        forceAlarmManager: true,
      },
      async (taskId) => {
        if (__DEV__) {
          console.log('[BackgroundFetch] Task executed:', taskId);
        }
        
        await collectAndStoreHealthData();
        await syncHealthDataIfNeeded();
        
        BackgroundFetch.finish(taskId);
      },
      async (taskId) => {
        if (__DEV__) {
          console.log('[BackgroundFetch] Task timeout:', taskId);
        }
        BackgroundFetch.finish(taskId);
      }
    );

    if (__DEV__) {
      console.log('[BackgroundFetch] Status:', status);
    }

    await BackgroundFetch.scheduleTask({
      taskId: TASK_ID,
      delay: 0,
      periodic: true,
      forceAlarmManager: true,
      stopOnTerminate: false,
      startOnBoot: true,
      enableHeadless: true,
    });

    if (__DEV__) {
      console.log('[BackgroundFetch] Task scheduled successfully');
    }
  } catch (error) {
    if (__DEV__) {
      console.error('[BackgroundFetch] Initialization error:', error);
    }
  }
};

/**
 * Collect health data and store in AsyncStorage
 */
export const collectAndStoreHealthData = async (): Promise<void> => {
  try {
    const isConnected = await isHealthConnectConnected();
    
    if (!isConnected) {
      if (__DEV__) {
        console.log('[HealthWorker] Health Connect not connected');
      }
      return;
    }

    const healthData = await getHealthData();
    
    const entry: HealthDataEntry = {
      timestamp: new Date().toISOString(),
      heartRate: healthData.heartRate,
      stepsCount: healthData.stepsCount,
      deviceInfo: `${Platform.OS} ${Platform.Version}`,
    };

    await storeHealthDataEntry(entry);

    if (__DEV__) {
      console.log('[HealthWorker] Data collected:', entry);
    }
  } catch (error) {
    if (__DEV__) {
      console.error('[HealthWorker] Collection error:', error);
    }
  }
};

/**
 * Store health data entry in AsyncStorage queue
 */
const storeHealthDataEntry = async (entry: HealthDataEntry): Promise<void> => {
  try {
    const existingData = await AsyncStorage.getItem(STORAGE_KEY);
    const queue: HealthDataEntry[] = existingData ? JSON.parse(existingData) : [];
    
    queue.push(entry);
    
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
  } catch (error) {
    if (__DEV__) {
      console.error('[HealthWorker] Storage error:', error);
    }
  }
};

/**
 * Get all stored health data entries
 */
export const getStoredHealthData = async (): Promise<HealthDataEntry[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    if (__DEV__) {
      console.error('[HealthWorker] Retrieval error:', error);
    }
    return [];
  }
};

/**
 * Clear stored health data after successful sync
 */
export const clearStoredHealthData = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    if (__DEV__) {
      console.error('[HealthWorker] Clear error:', error);
    }
  }
};

/**
 * Stop background fetch worker
 */
export const stopHealthDataWorker = async (): Promise<void> => {
  try {
    if (!BackgroundFetch || !BackgroundFetch.stop) {
      if (__DEV__) {
        console.log('[BackgroundFetch] Module not available');
      }
      return;
    }
    
    await BackgroundFetch.stop(TASK_ID);
    if (__DEV__) {
      console.log('[BackgroundFetch] Worker stopped');
    }
  } catch (error) {
    if (__DEV__) {
      console.error('[BackgroundFetch] Stop error:', error);
    }
  }
};

/**
 * Check worker status
 */
export const getWorkerStatus = async (): Promise<number> => {
  try {
    if (!BackgroundFetch || !BackgroundFetch.status) {
      return -1;
    }
    return await BackgroundFetch.status();
  } catch (error) {
    if (__DEV__) {
      console.error('[BackgroundFetch] Status error:', error);
    }
    return -1;
  }
};

/**
 * Sync health data if 1 hour has passed since last sync
 */
const syncHealthDataIfNeeded = async (): Promise<void> => {
  try {
    const lastSyncTime = await AsyncStorage.getItem(LAST_SYNC_TIME_KEY);
    const now = Date.now();
    
    const shouldSync = !lastSyncTime || (now - parseInt(lastSyncTime, 10)) >= SYNC_INTERVAL_MS;
    
    if (!shouldSync) {
      if (__DEV__) {
        const nextSyncIn = Math.round((SYNC_INTERVAL_MS - (now - parseInt(lastSyncTime, 10))) / 60000);
        console.log(`[HealthWorker] Next sync in ${nextSyncIn} minutes`);
      }
      return;
    }
    
    const result = await syncHealthData();
    
    if (result.success && result.synced > 0) {
      await AsyncStorage.setItem(LAST_SYNC_TIME_KEY, now.toString());
      await updateLastSyncTime();
      
      if (__DEV__) {
        console.log(`[HealthWorker] Synced ${result.synced} entries`);
      }
    } else if (result.failed > 0) {
      if (__DEV__) {
        console.log(`[HealthWorker] Sync failed for ${result.failed} entries`);
      }
    }
  } catch (error) {
    if (__DEV__) {
      console.error('[HealthWorker] Sync error:', error);
    }
  }
};
