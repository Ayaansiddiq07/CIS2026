/**
 * Environment variable validation — fail-fast on startup.
 * Uses Zod to enforce every required secret is present and well-formed.
 */

const { z } = require("zod");

const envSchema = z.object({
  PORT: z
    .string()
    .default("5000")
    .transform((v) => parseInt(v, 10)),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("production"),

  // MongoDB
  MONGO_URI: z
    .string({ required_error: "MONGO_URI is required" })
    .min(1, "MONGO_URI cannot be empty"),

  // JWT
  JWT_SECRET: z
    .string({ required_error: "JWT_SECRET is required" })
    .min(16, "JWT_SECRET must be at least 16 characters"),
  JWT_REFRESH_SECRET: z
    .string({ required_error: "JWT_REFRESH_SECRET is required" })
    .min(16, "JWT_REFRESH_SECRET must be at least 16 characters"),

  // Razorpay
  RAZORPAY_KEY_ID: z
    .string({ required_error: "RAZORPAY_KEY_ID is required" })
    .min(1),
  RAZORPAY_SECRET: z
    .string({ required_error: "RAZORPAY_SECRET is required" })
    .min(1),
  RAZORPAY_WEBHOOK_SECRET: z
    .string({ required_error: "RAZORPAY_WEBHOOK_SECRET is required" })
    .min(1),

  // Google Sheets
  GOOGLE_CLIENT_EMAIL: z
    .string({ required_error: "GOOGLE_CLIENT_EMAIL is required" })
    .email("GOOGLE_CLIENT_EMAIL must be a valid email"),
  GOOGLE_PRIVATE_KEY: z
    .string({ required_error: "GOOGLE_PRIVATE_KEY is required" })
    .min(1),
  GOOGLE_SHEET_ID: z
    .string({ required_error: "GOOGLE_SHEET_ID is required" })
    .min(1),

  // Brevo
  BREVO_API_KEY: z
    .string({ required_error: "BREVO_API_KEY is required" })
    .min(1),
  BREVO_SENDER_EMAIL: z
    .string({ required_error: "BREVO_SENDER_EMAIL is required" })
    .email(),
  BREVO_SENDER_NAME: z.string().default("Coastal Innovation Summit"),

  // Frontend
  FRONTEND_URL: z
    .string({ required_error: "FRONTEND_URL is required" })
    .url("FRONTEND_URL must be a valid URL"),
});

/**
 * Parse and validate environment variables.
 * Throws with detailed error messages if any var is missing/invalid.
 */
function validateEnv() {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error("❌ Environment validation failed:");
    for (const issue of result.error.issues) {
      console.error(`   → ${issue.path.join(".")}: ${issue.message}`);
    }
    process.exit(1);
  }

  return result.data;
}

module.exports = { validateEnv };
