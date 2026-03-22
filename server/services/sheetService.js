/**
 * Google Sheets service — appends registration data as a new row.
 * Uses Google Sheets API v4 with service account authentication.
 * Error-tolerant: catches failures and returns status (never throws).
 */

const { google } = require("googleapis");
const logger = require("../config/logger");

let sheetsClient = null;

/**
 * Get or create authenticated Google Sheets client (singleton).
 */
function getClient() {
  if (!sheetsClient) {
    const auth = new google.auth.JWT(
      process.env.GOOGLE_CLIENT_EMAIL,
      null,
      process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      ["https://www.googleapis.com/auth/spreadsheets"]
    );
    sheetsClient = google.sheets({ version: "v4", auth });
  }
  return sheetsClient;
}

/**
 * Append a registration row to Google Sheets.
 * Columns: Timestamp | Name | Email | Phone | Ticket Type | Payment ID | Order ID | Amount | Status
 */
async function appendRegistration(data) {
  try {
    const sheets = getClient();
    const timestamp = new Date().toISOString();

    const row = [
      timestamp,
      data.name,
      data.email,
      data.phone,
      data.ticketType,
      data.razorpay_payment_id,
      data.razorpay_order_id,
      data.amount,
      data.status,
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "Registrations!A:I",
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values: [row],
      },
    });

    logger.info({ email: data.email }, "Google Sheets: row appended");
    return { success: true };
  } catch (err) {
    logger.error({ err, email: data.email }, "Google Sheets append failed");
    return { success: false, error: err.message };
  }
}

module.exports = { appendRegistration };
