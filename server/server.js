/**
 * Coastal Innovation Summit — Express Server Entry Point
 *
 * Middleware order (STRICT):
 * 1. Request logger (timing)
 * 2. Helmet (security headers)
 * 3. CORS (strict allowlist)
 * 4. express.json (body parser, 10kb limit) + raw body capture for webhooks
 * 5. Rate limiter (global)
 * 6. Routes (JWT only on protected routes)
 * 7. 404 handler
 * 8. Global error handler
 *
 * Env validation runs FIRST — app fails fast if any secret is missing.
 * MongoDB connects BEFORE server.listen().
 * Graceful shutdown drains queue and closes connections.
 */

require("dotenv").config();

// ── 0. Validate environment FIRST (fail-fast) ──
const { validateEnv } = require("./config/env");
const env = validateEnv();

const express = require("express");
const { connectDB } = require("./config/db");
const logger = require("./config/logger");

// Middleware
const { requestLogger } = require("./middleware/requestLogger");
const { helmetMiddleware } = require("./middleware/helmet");
const { corsMiddleware } = require("./middleware/cors");
const { globalLimiter } = require("./middleware/rateLimiter");
const { errorHandler } = require("./middleware/errorHandler");

// Routes
const paymentRoutes = require("./routes/paymentRoutes");
const authRoutes = require("./routes/authRoutes");
const registrationRoutes = require("./routes/registrationRoutes");
const contactRoutes = require("./routes/contactRoutes");

// Queue
const { getStats, drain } = require("./services/taskQueue");

const app = express();

// ── 0.5. Trust first proxy (Nginx) so req.ip = real client IP ──
app.set("trust proxy", 1);

// ── 1. Request logger — response timing ──
app.use(requestLogger);

// ── 2. Helmet — security HTTP headers ──
app.use(helmetMiddleware());

// ── 3. CORS — strict origin allowlist ──
app.use(corsMiddleware(env.FRONTEND_URL));

// ── 4. Body parser with raw body capture for webhook HMAC ──
app.use(
  express.json({
    limit: "10kb",
    verify: (req, _res, buf) => {
      if (req.originalUrl === "/api/payment/webhook") {
        req.rawBody = buf.toString();
      }
    },
  })
);

// ── 5. Global rate limiter ──
app.use(globalLimiter);

// ── 6. Health check (enhanced with queue stats + memory) ──
app.get("/api/health", (_req, res) => {
  const mem = process.memoryUsage();
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
    memory: {
      rss: `${Math.round(mem.rss / 1024 / 1024)}MB`,
      heapUsed: `${Math.round(mem.heapUsed / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(mem.heapTotal / 1024 / 1024)}MB`,
    },
    queue: getStats(),
  });
});

// ── 7. Routes ──
app.use("/api/payment", paymentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/registrations", registrationRoutes);
app.use("/api/contact", contactRoutes);

// ── 8. 404 handler ──
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ── 9. Global error handler (must be last) ──
app.use(errorHandler);

// ── Start server ──
let server;

async function start() {
  await connectDB(env.MONGO_URI);

  server = app.listen(env.PORT, () => {
    logger.info({ port: env.PORT, env: env.NODE_ENV }, "Server running");
  });
}

start().catch((err) => {
  logger.fatal({ err }, "Server failed to start");
  process.exit(1);
});

// ── Graceful shutdown ──
async function gracefulShutdown(signal) {
  logger.info({ signal }, "Shutdown signal received");

  // 1. Stop accepting new connections
  if (server) {
    server.close(() => {
      logger.info("HTTP server closed — no new connections");
    });
  }

  // 2. Drain the task queue (wait for in-flight tasks)
  logger.info("Draining task queue...");
  await drain();
  logger.info("Task queue drained");

  // 3. Close MongoDB connection
  const mongoose = require("mongoose");
  await mongoose.connection.close();
  logger.info("MongoDB connection closed");

  logger.info("Graceful shutdown complete");
  process.exit(0);
}

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// Catch unhandled rejections and uncaught exceptions
process.on("unhandledRejection", (reason) => {
  logger.fatal({ reason }, "Unhandled rejection — shutting down");
  gracefulShutdown("unhandledRejection");
});

process.on("uncaughtException", (err) => {
  logger.fatal({ err }, "Uncaught exception — shutting down");
  gracefulShutdown("uncaughtException");
});
