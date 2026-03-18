/**
 * Health Data Model
 *
 * MongoDB schema for storing health data collected from devices
 */

import mongoose from "mongoose";

const healthDataSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    user_id: {
      type: String,
      required: true,
      index: true,
    },
    timestamp: {
      type: String,
      required: true,
      index: true,
    },
    rr_interval_ms: {
      type: Number,
      default: 0,
    },
    accel_x: {
      type: Number,
      default: 0,
    },
    accel_y: {
      type: Number,
      default: 0,
    },
    accel_z: {
      type: Number,
      default: 0,
    },
    step_count: {
      type: Number,
      default: 0,
      min: 0,
    },
    cadence_spm: {
      type: Number,
      default: 0,
      min: 0,
    },
    activity_intensity: {
      type: String,
      enum: ["rest", "light", "moderate", "vigorous"],
      default: "rest",
    },
  },
  {
    timestamps: true,
    collection: "healthdata",
  },
);

healthDataSchema.index({ user_id: 1, timestamp: 1 });
healthDataSchema.index({ userId: 1, timestamp: -1 });
healthDataSchema.index({ createdAt: 1 }, { expireAfterSeconds: 31536000 });

export default mongoose.model("HealthData", healthDataSchema);
