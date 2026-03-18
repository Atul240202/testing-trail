/**
 * Health Data Collector Service
 * 
 * Collects heart rate and steps data from Health Connect
 */

import { Platform } from 'react-native';
import { readRecords } from 'react-native-health-connect';

export interface HealthData {
  heartRate: number | null;
  stepsCount: number | null;
}

interface TimeRangeFilter {
  operator: 'between';
  startTime: string;
  endTime: string;
}

/**
 * Get health data from Health Connect for the last 15 minutes
 */
export const getHealthData = async (): Promise<HealthData> => {
  if (Platform.OS !== 'android') {
    return {
      heartRate: null,
      stepsCount: null,
    };
  }

  try {
    const now = new Date();
    const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000);

    const timeRangeFilter: TimeRangeFilter = {
      operator: 'between',
      startTime: fifteenMinutesAgo.toISOString(),
      endTime: now.toISOString(),
    };

    const [heartRateData, stepsData] = await Promise.all([
      getHeartRate(timeRangeFilter),
      getStepsCount(timeRangeFilter),
    ]);

    return {
      heartRate: heartRateData,
      stepsCount: stepsData,
    };
  } catch (error) {
    if (__DEV__) {
      console.error('[HealthDataCollector] Error:', error);
    }
    return {
      heartRate: null,
      stepsCount: null,
    };
  }
};

/**
 * Get average heart rate for the time range
 */
const getHeartRate = async (timeRangeFilter: TimeRangeFilter): Promise<number | null> => {
  try {
    const result = await readRecords('HeartRate', {
      timeRangeFilter,
    });

    if (!result.records || result.records.length === 0) {
      return null;
    }

    const heartRates = result.records
      .map((record: any) => record.samples?.[0]?.beatsPerMinute)
      .filter((bpm: number | undefined) => bpm !== undefined && bpm > 0);

    if (heartRates.length === 0) {
      return null;
    }

    const average = heartRates.reduce((sum: number, bpm: number) => sum + bpm, 0) / heartRates.length;
    return Math.round(average);
  } catch (error) {
    if (__DEV__) {
      console.error('[HealthDataCollector] Heart rate error:', error);
    }
    return null;
  }
};

/**
 * Get total steps count for the time range
 */
const getStepsCount = async (timeRangeFilter: TimeRangeFilter): Promise<number | null> => {
  try {
    const result = await readRecords('Steps', {
      timeRangeFilter,
    });

    if (!result.records || result.records.length === 0) {
      return null;
    }

    const totalSteps = result.records.reduce((sum: number, record: any) => {
      return sum + (record.count || 0);
    }, 0);

    return totalSteps;
  } catch (error) {
    if (__DEV__) {
      console.error('[HealthDataCollector] Steps error:', error);
    }
    return null;
  }
};
