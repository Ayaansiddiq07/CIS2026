/**
 * Structured logger — Pino (5x faster than Winston).
 * JSON output in production, pretty-print in development.
 */

const pino = require("pino");

const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  transport:
    process.env.NODE_ENV === "development"
      ? { target: "pino-pretty", options: { colorize: true, translateTime: "SYS:HH:MM:ss" } }
      : undefined,
  base: { pid: process.pid },
  timestamp: pino.stdTimeFunctions.isoTime,
  serializers: {
    err: pino.stdSerializers.err,
    req: (req) => ({ method: req.method, url: req.originalUrl || req.url }),
  },
});

module.exports = logger;
