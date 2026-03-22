/**
 * Request logging middleware — logs method, URL, status, and response time.
 * Uses res.on('finish') to capture actual status code.
 */

const logger = require("../config/logger");

function requestLogger(req, res, next) {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const level = res.statusCode >= 500 ? "error" : res.statusCode >= 400 ? "warn" : "info";

    logger[level]({
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      ms: duration,
    });
  });

  next();
}

module.exports = { requestLogger };
