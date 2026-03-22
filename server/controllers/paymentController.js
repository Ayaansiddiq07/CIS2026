/**
 * Payment controller — orchestrates order creation and webhook processing.
 * Contains NO business logic — delegates to services.
 *
 * CRITICAL: Webhook handler uses ATOMIC findOneAndUpdate for idempotency.
 * CRITICAL: Webhook ALWAYS returns 200 to prevent Razorpay retries on errors.
 */

const Registration = require("../models/Registration");
const razorpayService = require("../services/razorpayService");
const { enqueue } = require("../services/taskQueue");
const { processPostPayment } = require("../services/postPaymentWorker");
const logger = require("../config/logger");

/**
 * Ticket type → amount mapping (in rupees).
 * Single source of truth for pricing — never trust frontend amounts.
 */
const TICKET_PRICES = {
  gold: 499,
  diamond: 1499,
  bulk: 3999,
  stall: 4999,
};

/**
 * POST /api/payment/create-order
 * Creates a Razorpay order and saves a pending registration.
 * If Razorpay keys are dummy, auto-processes in test mode.
 */
async function createOrder(req, res, next) {
  try {
    const { name, email, phone, ticketType } = req.body;

    // Server determines price — NEVER trust frontend
    const amount = TICKET_PRICES[ticketType];
    if (!amount) {
      return res.status(400).json({ error: "Invalid ticket type" });
    }

    const isDummyKey =
      !process.env.RAZORPAY_KEY_ID ||
      process.env.RAZORPAY_KEY_ID === "rzp_test_xxxxxxxxxxxx";

    if (isDummyKey) {
      // ── TEST MODE: bypass Razorpay entirely ──
      const mockOrderId = `order_TEST_${Date.now()}`;
      const mockPaymentId = `pay_TEST_${Date.now()}`;

      const registration = await Registration.create({
        name,
        email,
        phone,
        ticketType,
        amount,
        razorpay_order_id: mockOrderId,
        razorpay_payment_id: mockPaymentId,
        status: "paid",
      });

      logger.info({ email, orderId: mockOrderId }, "TEST MODE: auto-processed registration");

      // Fire post-payment via queue
      enqueue(`post-payment:${registration._id}`, () =>
        processPostPayment(registration._id.toString())
      );

      return res.status(201).json({
        orderId: mockOrderId,
        amount: amount * 100,
        currency: "INR",
        registrationId: registration._id,
        testMode: true,
      });
    }

    // ── PRODUCTION MODE: real Razorpay ──
    const registration = await Registration.create({
      name,
      email,
      phone,
      ticketType,
      amount,
      razorpay_order_id: "pending",
      status: "pending",
    });

    const order = await razorpayService.createOrder(
      amount * 100,
      registration._id.toString()
    );

    registration.razorpay_order_id = order.id;
    await registration.save();

    logger.info({ orderId: order.id, email }, "Order created");

    res.status(201).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      registrationId: registration._id,
      testMode: false,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/payment/webhook
 * Razorpay webhook handler — IDEMPOTENT, ATOMIC, ALWAYS 200.
 *
 * Flow:
 * 1. Verify HMAC signature
 * 2. Atomic findOneAndUpdate (idempotency + race-condition safe)
 * 3. Enqueue post-payment tasks to background queue
 * 4. Return 200 IMMEDIATELY
 *
 * RULE: This handler NEVER returns non-200 to Razorpay (prevents infinite retries).
 */
async function handleWebhook(req, res) {
  try {
    const signature = req.headers["x-razorpay-signature"];
    if (!signature) {
      logger.warn("Webhook: missing signature header");
      return res.status(200).json({ status: "ignored", reason: "missing_signature" });
    }

    // Verify HMAC
    const isValid = razorpayService.verifyWebhookSignature(
      req.rawBody,
      signature,
      process.env.RAZORPAY_WEBHOOK_SECRET
    );

    if (!isValid) {
      logger.warn("Webhook: HMAC verification failed");
      return res.status(200).json({ status: "ignored", reason: "invalid_signature" });
    }

    const event = req.body.event;

    // Only process successful payments
    if (event !== "payment.captured") {
      logger.info({ event }, "Webhook: ignoring event");
      return res.status(200).json({ status: "ignored" });
    }

    const payment = req.body.payload.payment.entity;
    const paymentId = payment.id;
    const orderId = payment.order_id;

    // ── ATOMIC IDEMPOTENT UPDATE ──
    // findOneAndUpdate is atomic: only ONE concurrent request can successfully
    // set razorpay_payment_id. The filter ensures:
    // - The order exists
    // - It hasn't been paid yet (status: "pending")
    const updated = await Registration.findOneAndUpdate(
      {
        razorpay_order_id: orderId,
        status: "pending",
      },
      {
        $set: {
          razorpay_payment_id: paymentId,
          status: "paid",
          syncStatus: "pending",
        },
      },
      { new: true }
    );

    if (!updated) {
      // Either already processed (idempotent) or order doesn't exist.
      // Check which case it is for logging.
      const existing = await Registration.findOne({ razorpay_order_id: orderId });
      if (existing && existing.status === "paid") {
        logger.info({ paymentId, orderId }, "Webhook: duplicate payment — already processed");
      } else {
        logger.error({ paymentId, orderId }, "Webhook: no pending registration found for order");
      }
      return res.status(200).json({ status: "already_processed" });
    }

    logger.info({ paymentId, orderId, email: updated.email }, "Webhook: payment confirmed");

    // ── RESPOND FAST — enqueue post-payment tasks ──
    res.status(200).json({ status: "ok" });

    // Fire-and-forget via queue (retry + backoff built in)
    enqueue(`post-payment:${updated._id}`, () =>
      processPostPayment(updated._id.toString())
    );
  } catch (err) {
    // CRITICAL: Always return 200 to Razorpay, even on unexpected errors.
    // Log the error for investigation, but don't trigger infinite retries.
    logger.error({ err }, "Webhook: unexpected error — returning 200 to prevent retries");
    res.status(200).json({ status: "error_logged" });
  }
}

module.exports = { createOrder, handleWebhook };
