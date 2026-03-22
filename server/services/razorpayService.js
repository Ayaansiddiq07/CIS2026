/**
 * Razorpay service — order creation and HMAC webhook verification.
 * ALL Razorpay API interaction is isolated here. No Razorpay logic in controllers.
 */

const Razorpay = require("razorpay");
const crypto = require("crypto");

let instance = null;

/**
 * Get or create singleton Razorpay instance.
 */
function getInstance() {
  if (!instance) {
    instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });
  }
  return instance;
}

/**
 * Create a Razorpay order.
 * @param {number}  amountInPaise  - Amount in paise (₹499 = 49900)
 * @param {string}  receipt        - Unique receipt ID (e.g. registrationId)
 * @returns {Promise<Object>}      - Razorpay order object
 */
async function createOrder(amountInPaise, receipt) {
  const rzp = getInstance();
  const order = await rzp.orders.create({
    amount: amountInPaise,
    currency: "INR",
    receipt: receipt,
  });
  return order;
}

/**
 * Verify Razorpay webhook signature using HMAC SHA256.
 * Uses crypto.timingSafeEqual to prevent timing attacks.
 *
 * @param {string|Buffer} rawBody          - Raw request body (NOT parsed JSON)
 * @param {string}        signatureHeader  - X-Razorpay-Signature header
 * @param {string}        webhookSecret    - RAZORPAY_WEBHOOK_SECRET from env
 * @returns {boolean}
 */
function verifyWebhookSignature(rawBody, signatureHeader, webhookSecret) {
  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(rawBody)
    .digest("hex");

  const expected = Buffer.from(expectedSignature, "hex");
  const received = Buffer.from(signatureHeader, "hex");

  if (expected.length !== received.length) return false;

  return crypto.timingSafeEqual(expected, received);
}

module.exports = {
  createOrder,
  verifyWebhookSignature,
};
