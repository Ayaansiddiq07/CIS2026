/**
 * MongoDB connection via Mongoose.
 * Optimized pool size for 1GB VPS with 512MB Atlas.
 * Includes reconnection event logging.
 */

const mongoose = require("mongoose");
const logger = require("./logger");

async function connectDB(uri) {
  try {
    await mongoose.connect(uri, {
      // ── Pool tuning for 1 vCPU / 1GB RAM ──
      maxPoolSize: 10,    // down from default 100 — saves ~90 idle connections
      minPoolSize: 2,     // keep 2 warm for fast response
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      // Buffering: queue ops during brief disconnects
      bufferCommands: true,
    });
    logger.info("MongoDB connected");
  } catch (err) {
    logger.fatal({ err }, "MongoDB connection failed");
    process.exit(1);
  }

  mongoose.connection.on("error", (err) => {
    logger.error({ err }, "MongoDB runtime error");
  });

  mongoose.connection.on("disconnected", () => {
    logger.warn("MongoDB disconnected");
  });

  mongoose.connection.on("reconnected", () => {
    logger.info("MongoDB reconnected");
  });
}

module.exports = { connectDB };
