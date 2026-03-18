/**
 * Health Data Validation Schemas
 *
 * Joi validation schemas for health data endpoints
 */

import Joi from "joi";

export const batchUploadSchema = Joi.object({
  data: Joi.array()
    .items(
      Joi.object({
        user_id: Joi.string().required(),
        timestamp: Joi.string().required(),
        rr_interval_ms: Joi.number().allow(null).optional().default(0),
        accel_x: Joi.number().allow(null).optional().default(0),
        accel_y: Joi.number().allow(null).optional().default(0),
        accel_z: Joi.number().allow(null).optional().default(0),
        step_count: Joi.number()
          .integer()
          .min(0)
          .allow(null)
          .optional()
          .default(0),
        cadence_spm: Joi.number()
          .integer()
          .min(0)
          .allow(null)
          .optional()
          .default(0),
        activity_intensity: Joi.string()
          .valid("rest", "light", "moderate", "vigorous")
          .optional()
          .default("rest"),
      }),
    )
    .min(1)
    .max(100)
    .required(),
});

export const getHealthDataSchema = Joi.object({
  startDate: Joi.date().iso().optional(),
  endDate: Joi.date().iso().optional(),
  limit: Joi.number().integer().min(1).max(1000).optional(),
  page: Joi.number().integer().min(1).optional(),
});

export const validateBatchUpload = (req, res, next) => {
  const { error } = batchUploadSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  next();
};

export const validateGetHealthData = (req, res, next) => {
  const { error } = getHealthDataSchema.validate(req.query);

  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }

  next();
};
