/**
 * Server Entry Point
 * Loads environment variables, connects to MongoDB, and starts the Express HTTP server.
 * Default port: 5000
 */

import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import connectDB from './config/database.js';
import { logger } from './utils/logger.js';
import admin from 'firebase-admin';
import serviceAccount from './config/serviceAccountKey.json' with { type: 'json' };

const PORT = process.env.PORT || 5001;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

connectDB();

app.listen(PORT, () => {
    logger.info(`Backend running on port ${PORT}`);
});
