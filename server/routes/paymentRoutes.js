/**
 * Payment routes — order creation and Razorpay webhook.
 * Webhook route uses raw body parser for HMAC verification.
 */

const express = require("express");
const { z } = require("zod");
const { validate } = require("../middleware/validate");
const { paymentLimiter, webhookLimiter } = require("../middleware/rateLimiter");
const { createOrder, handleWebhook } = require("../controllers/paymentController");

const router = express.Router();

// ── Zod Schemas ──

const createOrderSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().toLowerCase().email("Invalid email"),
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Invalid Indian phone number"),
  ticketType: z.enum(["gold", "diamond", "bulk", "stall"], {
    errorMap: () => ({ message: "Ticket type must be gold, diamond, bulk, or stall" }),
  }),
});

// ── Routes ──

// Create Razorpay order
router.post(
  "/create-order",
  paymentLimiter,
  validate(createOrderSchema),
  createOrder
);

// Razorpay webhook (raw body parsed in server.js for HMAC)
router.post(
  "/webhook",
  webhookLimiter,
  handleWebhook
);

module.exports = router;
