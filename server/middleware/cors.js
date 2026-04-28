/**
 * CORS middleware — strict origin allowlist.
 * No wildcard (*) — only the configured FRONTEND_URL is allowed.
 */

const cors = require("cors");

function corsMiddleware(frontendUrl) {
  const allowedOrigins = [frontendUrl];

  // In development, also allow localhost variants
  if (process.env.NODE_ENV === "development") {
    allowedOrigins.push(
      "http://localhost:5173",
      "http://localhost:3000",
      "http://127.0.0.1:5173",
      "http://127.0.0.1:3000"
    );
  }

  return cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (e.g. server-to-server, curl, Razorpay webhooks)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    maxAge: 86400, // preflight cache 24h
  });
}

module.exports = { corsMiddleware };
