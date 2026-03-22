/**
 * Email service — sends transactional emails via Brevo (Sendinblue) API.
 * Sends HTML confirmation email with QR code embedded as inline image.
 */

const SibApiV3Sdk = require("sib-api-v3-sdk");
const logger = require("../config/logger");

let apiInstance = null;

/**
 * Get or create singleton Brevo API client.
 */
function getClient() {
  if (!apiInstance) {
    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    const apiKey = defaultClient.authentications["api-key"];
    apiKey.apiKey = process.env.BREVO_API_KEY;
    apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
  }
  return apiInstance;
}

/**
 * Send registration confirmation email with QR code.
 */
async function sendConfirmationEmail({
  to,
  name,
  ticketType,
  amount,
  orderId,
  paymentId,
  qrCodeDataUrl,
}) {
  try {
    const api = getClient();

    const qrBase64 = qrCodeDataUrl.split(",")[1];

    const sendSmtpEmail = {
      sender: {
        name: process.env.BREVO_SENDER_NAME,
        email: process.env.BREVO_SENDER_EMAIL,
      },
      to: [{ email: to, name: name }],
      subject: `🎉 Registration Confirmed — Coastal Innovation Summit`,
      htmlContent: buildEmailHtml({
        name,
        ticketType,
        amount,
        orderId,
        paymentId,
      }),
      attachment: [
        {
          content: qrBase64,
          name: "ticket-qr.png",
        },
      ],
    };

    await api.sendTransacEmail(sendSmtpEmail);
    logger.info({ to }, "Email sent");
    return { success: true };
  } catch (err) {
    const statusCode = err.status || err.statusCode || "N/A";
    let errorBody = "";
    try {
      errorBody = err.response?.body
        ? JSON.stringify(err.response.body)
        : err.response?.text || "";
    } catch (_) {
      errorBody = String(err.response || "");
    }
    logger.error({ to, statusCode, errorBody, err: err.message }, "Email send failed");
    return { success: false, error: `[${statusCode}] ${err.message}` };
  }
}

/**
 * Build the HTML content for the confirmation email.
 */
function buildEmailHtml({ name, ticketType, amount, orderId, paymentId }) {
  const ticketLabel = ticketType.charAt(0).toUpperCase() + ticketType.slice(1);

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <style>
      body { font-family: 'Segoe UI', Arial, sans-serif; background: #f8fafc; margin: 0; padding: 0; }
      .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
      .header { background: #0a2540; padding: 32px 24px; text-align: center; }
      .header h1 { color: #ffffff; margin: 0; font-size: 22px; letter-spacing: 1px; }
      .header p { color: #0da292; margin: 8px 0 0; font-size: 13px; text-transform: uppercase; letter-spacing: 2px; }
      .body { padding: 32px 24px; }
      .body h2 { color: #0a2540; font-size: 20px; margin-bottom: 16px; }
      .body p { color: #475569; font-size: 15px; line-height: 1.6; }
      .details { background: #f1f5f9; border-radius: 8px; padding: 20px; margin: 24px 0; }
      .details table { width: 100%; border-collapse: collapse; }
      .details td { padding: 8px 0; color: #334155; font-size: 14px; }
      .details td:first-child { font-weight: 600; color: #0a2540; }
      .qr-section { text-align: center; padding: 24px 0; }
      .qr-section p { font-size: 13px; color: #94a3b8; margin-top: 12px; }
      .footer { background: #f8fafc; padding: 24px; text-align: center; border-top: 1px solid #e2e8f0; }
      .footer p { color: #94a3b8; font-size: 12px; margin: 0; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>COASTAL INNOVATION SUMMIT</h1>
        <p>Registration Confirmed</p>
      </div>
      <div class="body">
        <h2>Welcome, ${name}! 🎉</h2>
        <p>Your registration has been confirmed and payment received successfully. Below are your booking details:</p>
        <div class="details">
          <table>
            <tr><td>Ticket Type</td><td>${ticketLabel} Pass</td></tr>
            <tr><td>Amount Paid</td><td>₹${amount}</td></tr>
            <tr><td>Order ID</td><td>${orderId}</td></tr>
            <tr><td>Payment ID</td><td>${paymentId}</td></tr>
          </table>
        </div>
        <div class="qr-section">
          <p><strong>Your entry QR code is attached to this email.</strong></p>
          <p>Present this QR code at the registration desk on event day.</p>
        </div>
        <p>If you have any questions, reply to this email or contact us at the summit website.</p>
      </div>
      <div class="footer">
        <p>© ${new Date().getFullYear()} Coastal Innovation Summit. All rights reserved.</p>
      </div>
    </div>
  </body>
  </html>
  `;
}

module.exports = { sendConfirmationEmail };
