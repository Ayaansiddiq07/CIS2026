/**
 * Payment controller — orchestrates order creation and webhook processing.
 * Contains NO business logic — delegates to services.
 *
 * CRITICAL: Webhook handler uses ATOMIC findOneAndUpdate for idempotency.
 * CRITICAL: Webhook ALWAYS returns 200 to prevent Razorpay retries on errors.
 */

const Registration = require("../models/Registration");
const SiteContent = require("../models/SiteContent");
const razorpayService = require("../services/razorpayService");
const { enqueue } = require("../services/taskQueue");
const { processPostPayment } = require("../services/postPaymentWorker");
const logger = require("../config/logger");

/**
 * Fallback ticket prices if SiteContent is not yet initialised.
 */
const FALLBACK_PRICES = {
  gold: 499,
  diamond: 1499,
  bulk: 3999,
  stall: 4999,
};

/**
 * Get ticket price from SiteContent (dynamic) or fallback.
 */
async function getTicketPrice(ticketType) {
  try {
    const content = await SiteContent.getSingleton();
    if (content?.pricing?.[ticketType]?.price) {
      return content.pricing[ticketType].price;
    }
  } catch { /* fall through to fallback */ }
  return FALLBACK_PRICES[ticketType] || null;
}

/**
 * POST /api/payment/create-order
 * Creates a Razorpay order and saves a pending registration.
 * If Razorpay keys are dummy, auto-processes in test mode.
 *
 * DUPLICATE GUARD: rejects if same email already has a paid/pending
 * registration for the same ticketType (within last 24h for pending).
 */
async function createOrder(req, res, next) {
  try {
    const { name, email, phone, ticketType } = req.body;

    // Server determines price — NEVER trust frontend
    const amount = await getTicketPrice(ticketType);
    if (!amount) {
      return res.status(400).json({ error: "Invalid ticket type" });
    }

    // ── DUPLICATE CHECK ──
    const existingPaid = await Registration.findOne({
      email: email.toLowerCase(),
      ticketType,
      status: "paid",
    });
    if (existingPaid) {
      return res.status(409).json({
        error: `You already have a confirmed ${ticketType} registration. Check your email for the confirmation.`,
      });
    }

    // Clean up stale pending registrations (>30 min old) for same email+ticket
    const thirtyMinAgo = new Date(Date.now() - 30 * 60 * 1000);
    await Registration.deleteMany({
      email: email.toLowerCase(),
      ticketType,
      status: "pending",
      createdAt: { $lt: thirtyMinAgo },
    });

    // Check for recent pending (within 30 min) — user might have a checkout in progress
    const recentPending = await Registration.findOne({
      email: email.toLowerCase(),
      ticketType,
      status: "pending",
      createdAt: { $gte: thirtyMinAgo },
    });
    if (recentPending) {
      return res.status(409).json({
        error: "A registration is already in progress. Please complete the payment or wait a few minutes and try again.",
      });
    }

    const isDummyKey =
      !process.env.RAZORPAY_KEY_ID ||
      process.env.RAZORPAY_KEY_ID === "rzp_test_xxxxxxxxxxxx";

    if (isDummyKey) {
      // ── TEST MODE: bypass Razorpay entirely ──
      const uid = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      const mockOrderId = `order_TEST_${uid}`;
      const mockPaymentId = `pay_TEST_${uid}`;

      let registration;
      try {
        registration = await Registration.create({
          name,
          email,
          phone,
          ticketType,
          amount,
          razorpay_order_id: mockOrderId,
          razorpay_payment_id: mockPaymentId,
          status: "paid",
        });
      } catch (createErr) {
        if (createErr.code === 11000) {
          const field = Object.keys(createErr.keyValue || {})[0] || "email";
          return res.status(409).json({
            error: `A registration with this ${field} already exists. Please check your email for confirmation.`,
          });
        }
        throw createErr;
      }

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
    let registration;
    try {
      registration = await Registration.create({
        name,
        email,
        phone,
        ticketType,
        amount,
        razorpay_order_id: "pending",
        status: "pending",
      });
    } catch (createErr) {
      if (createErr.code === 11000) {
        const field = Object.keys(createErr.keyValue || {})[0] || "email";
        return res.status(409).json({
          error: `A registration with this ${field} already exists. Please check your email for confirmation.`,
        });
      }
      throw createErr;
    }

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
 */
async function handleWebhook(req, res) {
  try {
    const signature = req.headers["x-razorpay-signature"];
    if (!signature) {
      logger.warn("Webhook: missing signature header");
      return res.status(200).json({ status: "ignored", reason: "missing_signature" });
    }

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

    if (event !== "payment.captured") {
      logger.info({ event }, "Webhook: ignoring event");
      return res.status(200).json({ status: "ignored" });
    }

    const payment = req.body.payload.payment.entity;
    const paymentId = payment.id;
    const orderId = payment.order_id;

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
      const existing = await Registration.findOne({ razorpay_order_id: orderId });
      if (existing && existing.status === "paid") {
        logger.info({ paymentId, orderId }, "Webhook: duplicate payment — already processed");
      } else {
        logger.error({ paymentId, orderId }, "Webhook: no pending registration found for order");
      }
      return res.status(200).json({ status: "already_processed" });
    }

    logger.info({ paymentId, orderId, email: updated.email }, "Webhook: payment confirmed");

    res.status(200).json({ status: "ok" });

    enqueue(`post-payment:${updated._id}`, () =>
      processPostPayment(updated._id.toString())
    );
  } catch (err) {
    logger.error({ err }, "Webhook: unexpected error — returning 200 to prevent retries");
    res.status(200).json({ status: "error_logged" });
  }
}

module.exports = { createOrder, handleWebhook };
