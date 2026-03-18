/**
 * Health Data Sync Service
 * 
 * Handles syncing health data from AsyncStorage to backend API
 * Features: Batch upload, retry logic, exponential backoff
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../api/client';
import { HealthDataEntry } from '../workers/healthDataWorker';
import { ENV_CONFIG, getEnvVar } from '../config/envConfig';

const STORAGE_KEY = ENV_CONFIG.HEALTH_DATA_STORAGE_KEY;
const BATCH_SIZE = parseInt(getEnvVar('HEALTH_DATA_BATCH_SIZE', '50'), 10);
const MAX_RETRIES = parseInt(getEnvVar('HEALTH_DATA_MAX_RETRIES', '3'), 10);
const RETRY_DELAY_MS = parseInt(getEnvVar('HEALTH_DATA_RETRY_DELAY', '1000'), 10);

interface SyncResult {
  success: boolean;
  synced: number;
  failed: number;
  error?: string;
}

/**
 * Sync all stored health data to backend
 */
export const syncHealthData = async (): Promise<SyncResult> => {
  try {
    const data = await getStoredData();
    
    if (data.length === 0) {
      return { success: true, synced: 0, failed: 0 };
    }

    const cleanedData = data.map(entry => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { userId, ...rest } = entry as any;
      return rest;
    });

    const batches = createBatches(cleanedData, BATCH_SIZE);
    let synced = 0;
    let failed = 0;
    const failedBatches: HealthDataEntry[] = [];

    for (const batch of batches) {
      const result = await uploadBatch(batch);
      
      if (result.success) {
        synced += batch.length;
        await removeSyncedData(batch);
      } else {
        failed += batch.length;
        failedBatches.push(...batch);
      }
      
      if (batches.length > 1) {
        await sleep(100);
      }
    }

    if (failedBatches.length > 0) {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(failedBatches));
    }

    return { success: failed === 0, synced, failed };
  } catch (error) {
    if (__DEV__) {
      console.error('[HealthSync] Sync error:', error);
    }
    return { 
      success: false, 
      synced: 0, 
      failed: 0, 
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

/**
 * Upload a batch of health data with retry logic
 */
const uploadBatch = async (
  batch: HealthDataEntry[], 
  retryCount = 0
): Promise<{ success: boolean }> => {
  try {
    await apiClient.post('/health-data/batch', { data: batch });
    
    if (__DEV__) {
      console.log(`[HealthSync] Uploaded ${batch.length} entries successfully`);
    }
    
    return { success: true };
  } catch (error: any) {
    const status = error.response?.status;
    const errorMessage = error.response?.data?.message;
    
    if (__DEV__) {
      console.error('[HealthSync] Upload error:', {
        status,
        message: errorMessage,
        batchSize: batch.length,
        attempt: retryCount + 1
      });
    }
    
    if (status === 401) {
      if (__DEV__) {
        console.error('[HealthSync] Authentication failed - token invalid or expired');
      }
      return { success: false };
    }
    
    if (status === 400) {
      if (__DEV__) {
        console.error('[HealthSync] Validation error:', errorMessage);
        console.error('[HealthSync] Sample entry:', batch[0]);
      }
      return { success: false };
    }
    
    if (retryCount < MAX_RETRIES) {
      const delay = RETRY_DELAY_MS * Math.pow(2, retryCount);
      
      if (__DEV__) {
        console.log(`[HealthSync] Retry ${retryCount + 1}/${MAX_RETRIES} in ${delay}ms`);
      }
      
      await sleep(delay);
      return uploadBatch(batch, retryCount + 1);
    }
    
    if (__DEV__) {
      console.error('[HealthSync] Upload failed after retries');
    }
    
    return { success: false };
  }
};

/**
 * Get stored health data from AsyncStorage
 */
const getStoredData = async (): Promise<HealthDataEntry[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    if (__DEV__) {
      console.error('[HealthSync] Get data error:', error);
    }
    return [];
  }
};

/**
 * Remove successfully synced data from storage
 */
const removeSyncedData = async (syncedBatch: HealthDataEntry[]): Promise<void> => {
  try {
    const allData = await getStoredData();
    const syncedTimestamps = new Set(syncedBatch.map(item => item.timestamp));
    const remaining = allData.filter(item => !syncedTimestamps.has(item.timestamp));
    
    if (remaining.length > 0) {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(remaining));
    } else {
      await AsyncStorage.removeItem(STORAGE_KEY);
    }
    
    if (__DEV__) {
      console.log(`[HealthSync] Removed ${syncedBatch.length} entries, ${remaining.length} remaining`);
    }
  } catch (error) {
    if (__DEV__) {
      console.error('[HealthSync] Remove data error:', error);
    }
  }
};

/**
 * Split data into batches
 */
const createBatches = <T>(data: T[], batchSize: number): T[][] => {
  const batches: T[][] = [];
  for (let i = 0; i < data.length; i += batchSize) {
    batches.push(data.slice(i, i + batchSize));
  }
  return batches;
};

/**
 * Sleep utility for retry delays
 */
const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Get sync statistics
 */
export const getSyncStats = async (): Promise<{
  pending: number;
  lastSync: string | null;
}> => {
  try {
    const data = await getStoredData();
    const lastSyncTime = await AsyncStorage.getItem('@pause_last_sync_time');
    
    return {
      pending: data.length,
      lastSync: lastSyncTime,
    };
  } catch (error) {
    return {
      pending: 0,
      lastSync: null,
    };
  }
};

/**
 * Update last sync timestamp
 */
export const updateLastSyncTime = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem('@pause_last_sync_time', new Date().toISOString());
  } catch (error) {
    if (__DEV__) {
      console.error('[HealthSync] Update sync time error:', error);
    }
  }
};
