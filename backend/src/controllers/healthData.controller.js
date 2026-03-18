/**
 * Health Data Controller
 *
 * Handles batch upload and retrieval of health data from mobile devices.
 * Includes validation, sanitization, and error handling.
 */

import { logger } from "../utils/logger.js";
import HealthData from "../models/HealthData.js";

const transformHealthEntry = (entry, userId) => {
  return {
    userId,
    user_id: String(entry.user_id),
    timestamp: String(entry.timestamp),
    rr_interval_ms:
      entry.rr_interval_ms !== null && entry.rr_interval_ms !== undefined
        ? Number(entry.rr_interval_ms)
        : 0,
    accel_x:
      entry.accel_x !== null && entry.accel_x !== undefined
        ? Number(entry.accel_x)
        : 0,
    accel_y:
      entry.accel_y !== null && entry.accel_y !== undefined
        ? Number(entry.accel_y)
        : 0,
    accel_z:
      entry.accel_z !== null && entry.accel_z !== undefined
        ? Number(entry.accel_z)
        : 0,
    step_count:
      entry.step_count !== null && entry.step_count !== undefined
        ? Number(entry.step_count)
        : 0,
    cadence_spm:
      entry.cadence_spm !== null && entry.cadence_spm !== undefined
        ? Number(entry.cadence_spm)
        : 0,
    activity_intensity: entry.activity_intensity || "rest",
  };
};

export const batchUploadHealthData = async (req, res) => {
  // Get userId from request (authenticated) or from data (watch)
  const userId = req.userId || req.body.data?.[0]?.user_id || "test_watch_user";
  const { data } = req.body;

  try {
    const healthEntries = data.map((entry) =>
      transformHealthEntry(entry, userId),
    );

    const result = await HealthData.insertMany(healthEntries, {
      ordered: false,
    });

    logger.info("Health data uploaded", { userId, count: result.length });

    return res.status(201).json({
      success: true,
      message: "Health data uploaded successfully",
      data: { inserted: result.length },
    });
  } catch (error) {
    if (error.code === 11000) {
      const insertedCount = error.result?.nInserted || 0;

      logger.warn("Duplicates skipped", {
        userId,
        inserted: insertedCount,
        duplicates: data.length - insertedCount,
      });

      return res.status(201).json({
        success: true,
        message: "Health data uploaded with duplicates skipped",
        data: {
          inserted: insertedCount,
          duplicates: data.length - insertedCount,
        },
      });
    }

    logger.error("Upload failed", { userId, error: error.message });

    return res.status(500).json({
      success: false,
      message: "Internal server error",
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
      HealthData.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        entries,
        pagination: {
          total,
          page: pageValue,
          limit: limitValue,
          pages: Math.ceil(total / limitValue),
        },
      },
    });
  } catch (error) {
    logger.error("Get health data failed", { userId, error: error.message });

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
