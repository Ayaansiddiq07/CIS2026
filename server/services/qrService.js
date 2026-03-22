/**
 * QR code service — generates unique QR codes for registrations.
 * Each QR encodes the registration ID for fast check-in scanning.
 */

const QRCode = require("qrcode");

/**
 * Generate a QR code as a data URL (PNG base64).
 * Encodes: CIS-<registrationId> for uniqueness.
 *
 * @param {string} registrationId - MongoDB document _id
 * @returns {Promise<string>} - data:image/png;base64,... string
 */
async function generateQR(registrationId) {
  const payload = `CIS-${registrationId}`;

  const dataUrl = await QRCode.toDataURL(payload, {
    errorCorrectionLevel: "M",
    type: "image/png",
    width: 300,
    margin: 2,
    color: {
      dark: "#0a2540",
      light: "#ffffff",
    },
  });

  return dataUrl;
}

module.exports = { generateQR };
