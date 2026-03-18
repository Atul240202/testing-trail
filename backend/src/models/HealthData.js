/**
 * Health Data Model
 * 
 * MongoDB schema for storing health data collected from devices
 */

import mongoose from 'mongoose';

const healthDataSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    timestamp: {
      type: Date,
      required: true,
      index: true
    },
    heartRate: {
      type: Number,
      default: null,
      min: 0,
      max: 300
    },
    stepsCount: {
      type: Number,
      default: null,
      min: 0,
      max: 100000
    },
    deviceInfo: {
      type: String,
      required: true
    }
  },
  { 
    timestamps: true,
    collection: 'healthdata'
  }
);

healthDataSchema.index({ userId: 1, timestamp: 1 }, { unique: true });
healthDataSchema.index({ userId: 1, timestamp: -1 });
healthDataSchema.index({ createdAt: 1 }, { expireAfterSeconds: 31536000 });

export default mongoose.model('HealthData', healthDataSchema);
