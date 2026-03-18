/**
 * Health Data Validation Schemas
 * 
 * Joi validation schemas for health data endpoints
 */

import Joi from 'joi';

export const batchUploadSchema = Joi.object({
  data: Joi.array()
    .items(
      Joi.object({
        timestamp: Joi.date().iso().required(),
        heartRate: Joi.number().min(0).max(300).allow(null).optional(),
        stepsCount: Joi.number().integer().min(0).max(100000).allow(null).optional(),
        deviceInfo: Joi.string().max(100).required()
      })
    )
    .min(1)
    .max(100)
    .required()
});

export const getHealthDataSchema = Joi.object({
  startDate: Joi.date().iso().optional(),
  endDate: Joi.date().iso().optional(),
  limit: Joi.number().integer().min(1).max(1000).optional(),
  page: Joi.number().integer().min(1).optional()
});

export const validateBatchUpload = (req, res, next) => {
  const { error } = batchUploadSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }
  
  next();
};

export const validateGetHealthData = (req, res, next) => {
  const { error } = getHealthDataSchema.validate(req.query);
  
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message
    });
  }
  
  next();
};
