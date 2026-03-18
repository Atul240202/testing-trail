/**
 * Main Express Application
 * Configures Express with middleware (CORS, JSON parsing, logging), routes, and error handlers.
 * Sets up API endpoints.
 */


import express from "express";
import cors from "cors";
import morgan from "morgan";
import { logger } from "./utils/logger.js";

import resetRoutes from "./routes/resetRoutes.js";
import userRoutes from "./routes/user.routes.js";
import authRoutes from './routes/auth.routes.js';
import userSettingsRoutes from "./routes/userSettings.routes.js";
import appConstantRoutes from './routes/appConstant.routes.js';
import healthDataRoutes from './routes/healthData.routes.js';
import { checkHeartRateAndNotify } from "./services/pushNotification.js";

const app = express();

const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.ALLOWED_ORIGINS?.split(',') || []
    : '*',
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(morgan("dev"));

// Health Route
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Test Route for Push Notifications
app.get("/run-check", (req, res) => {
  checkHeartRateAndNotify();
  res.send("Heart rate check executed");
});

app.use('/api/v1', authRoutes);
app.use("/api/v1", userRoutes);
app.use("/api/v1", appConstantRoutes);
app.use("/api/v1/health-data", healthDataRoutes);
app.use("/api/v1/reset-sessions", resetRoutes);
app.use("/api/v1/user-settings", userSettingsRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  logger.error("Error:", err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Something went wrong",
  });
});

export default app;
