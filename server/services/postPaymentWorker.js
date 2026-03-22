/**
 * Post-payment worker — processes Sheets sync, QR generation, and email
 * as background tasks via the task queue.
 *
 * Each step is independent: a Sheets failure does NOT block QR or email.
 * Called from the webhook after payment is confirmed.
 */

const Registration = require("../models/Registration");
const sheetService = require("./sheetService");
const qrService = require("./qrService");
const emailService = require("./emailService");
const logger = require("../config/logger");

/**
 * Run all post-payment tasks for a registration.
 * @param {string} registrationId - MongoDB _id of the registration
 */
async function processPostPayment(registrationId) {
  const registration = await Registration.findById(registrationId);
  if (!registration) {
    logger.error({ registrationId }, "Post-payment: registration not found");
    return;
  }

  // 1. Google Sheets sync
  try {
    const sheetResult = await sheetService.appendRegistration({
      name: registration.name,
      email: registration.email,
      phone: registration.phone,
      ticketType: registration.ticketType,
      razorpay_payment_id: registration.razorpay_payment_id,
      razorpay_order_id: registration.razorpay_order_id,
      amount: registration.amount,
      status: registration.status,
    });

    if (sheetResult.success) {
      await Registration.updateOne({ _id: registrationId }, { syncStatus: "synced" });
      logger.info({ email: registration.email }, "Sheets synced");
    } else {
      await Registration.updateOne({ _id: registrationId }, { syncStatus: "failed" });
      logger.error({ email: registration.email, error: sheetResult.error }, "Sheets sync failed");
    }
  } catch (err) {
    await Registration.updateOne({ _id: registrationId }, { syncStatus: "failed" });
    logger.error({ err, email: registration.email }, "Sheets sync error");
  }

  // 2. Generate QR code
  let qrDataUrl = null;
  try {
    qrDataUrl = await qrService.generateQR(registrationId);
    registration.qrCode = qrDataUrl;
    await registration.save();
    logger.info({ email: registration.email }, "QR generated");
  } catch (err) {
    logger.error({ err, email: registration.email }, "QR generation failed");
  }

  // 3. Send confirmation email (only if QR was generated)
  if (qrDataUrl) {
    try {
      const emailResult = await emailService.sendConfirmationEmail({
        to: registration.email,
        name: registration.name,
        ticketType: registration.ticketType,
        amount: registration.amount,
        orderId: registration.razorpay_order_id,
        paymentId: registration.razorpay_payment_id,
        qrCodeDataUrl: qrDataUrl,
      });

      if (emailResult.success) {
        logger.info({ email: registration.email }, "Confirmation email sent");
      } else {
        logger.error({ email: registration.email, error: emailResult.error }, "Email failed");
      }
    } catch (err) {
      logger.error({ err, email: registration.email }, "Email send error");
    }
  }
}

module.exports = { processPostPayment };
