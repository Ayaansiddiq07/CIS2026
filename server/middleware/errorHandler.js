/**
 * Global error handler — catches all unhandled errors.
 * Returns sanitized JSON. Logs full error for debugging.
 * Handles known error types: Zod, Mongoose, JWT, CORS.
 */

const logger = require("../config/logger");

function errorHandler(err, req, res, _next) {
  // Log full error context
  logger.error({
    err,
    url: req.originalUrl,
    method: req.method,
  });

  // Zod validation error
  if (err.name === "ZodError" && Array.isArray(err.issues)) {
    const errors = err.issues.map((issue) => ({
      field: issue.path.join("."),
      message: issue.message,
    }));
    return res.status(400).json({ error: "Validation failed", details: errors });
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    return res.status(400).json({ error: "Validation failed", details: errors });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "field";
    const friendlyFields = {
      email: "email address",
      phone: "phone number",
      razorpay_payment_id: "payment",
      razorpay_order_id: "order",
    };
    const label = friendlyFields[field] || field;
    return res
      .status(409)
      .json({ error: `A record with this ${label} already exists.` });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    return res.status(401).json({ error: "Authentication failed" });
  }

  // CORS error
  if (err.message && err.message.includes("not allowed by CORS")) {
    return res.status(403).json({ error: "CORS policy violation" });
  }

  // Default: internal server error — never leak internals
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error:
      statusCode === 500
        ? "Internal server error"
        : err.message || "Something went wrong",
  });
}

module.exports = { errorHandler };
