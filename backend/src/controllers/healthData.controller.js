/**
 * Health Data Controller
 * 
 * Handles batch upload and retrieval of health data from mobile devices.
 * Includes validation, sanitization, and error handling.
 */

import { logger } from '../utils/logger.js';
import HealthData from '../models/HealthData.js';

const transformHealthEntry = (entry, userId) => {
  return {
    userId,
    timestamp: new Date(entry.timestamp),
    heartRate: entry.heartRate !== null && entry.heartRate !== undefined ? Number(entry.heartRate) : null,
    stepsCount: entry.stepsCount !== null && entry.stepsCount !== undefined ? Number(entry.stepsCount) : null,
    deviceInfo: String(entry.deviceInfo).substring(0, 100),
  };
};

export const batchUploadHealthData = async (req, res) => {
  const userId = req.userId;
  const { data } = req.body;

  try {
    const healthEntries = data.map(entry => transformHealthEntry(entry, userId));

    const result = await HealthData.insertMany(healthEntries, { 
      ordered: false,
    });

    logger.info('Health data uploaded', { userId, count: result.length });

    return res.status(201).json({
      success: true,
      message: 'Health data uploaded successfully',
      data: { inserted: result.length }
    });

  } catch (error) {
    if (error.code === 11000) {
      const insertedCount = error.result?.nInserted || 0;
      
      logger.warn('Duplicates skipped', { 
        userId, 
        inserted: insertedCount,
        duplicates: data.length - insertedCount 
      });

      return res.status(201).json({
        success: true,
        message: 'Health data uploaded with duplicates skipped',
        data: {
          inserted: insertedCount,
          duplicates: data.length - insertedCount
        }
      });
    }

    logger.error('Upload failed', { userId, error: error.message });

    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getUserHealthData = async (req, res) => {
  const userId = req.userId;
  const { startDate, endDate, limit = 100, page = 1 } = req.query;

  try {
    const query = { userId };
    const limitValue = parseInt(limit);
    const pageValue = parseInt(page);

    if (startDate || endDate) {
      query.timestamp = {};
      
      if (startDate) {
        query.timestamp.$gte = new Date(startDate);
      }
      
      if (endDate) {
        query.timestamp.$lte = new Date(endDate);
      }
    }

    const skip = (pageValue - 1) * limitValue;

    const [entries, total] = await Promise.all([
      HealthData.find(query)
        .sort({ timestamp: -1 })
        .limit(limitValue)
        .skip(skip)
        .lean(),
      HealthData.countDocuments(query)
    ]);

    return res.status(200).json({
      success: true,
      data: {
        entries,
        pagination: {
          total,
          page: pageValue,
          limit: limitValue,
          pages: Math.ceil(total / limitValue)
        }
      }
    });

  } catch (error) {
    logger.error('Get health data failed', { userId, error: error.message });

    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};
