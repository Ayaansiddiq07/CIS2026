/**
 * Rate limiting middleware — per-route configurations.
 * Prevents brute-force, DDoS, and abuse.
 */

const rateLimit = require("express-rate-limit");

/** Global limiter — applies to all routes */
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests. Please try again later." },
});

/** Auth limiter — stricter for login/register */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // 10 attempts per 15 min
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many auth attempts. Try again in 15 minutes." },
});

/** Payment limiter — moderate for order creation */
const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many payment requests. Please wait." },
});

/** Webhook limiter — lenient (Razorpay retries) */
const webhookLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 50, // Razorpay may retry
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Webhook rate limit exceeded." },
});

/** Contact form limiter — prevents spam submissions */
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 submissions per 15 min per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many contact submissions. Please wait before sending another." },
});

module.exports = {
  globalLimiter,
  authLimiter,
  paymentLimiter,
  webhookLimiter,
  contactLimiter,
};
