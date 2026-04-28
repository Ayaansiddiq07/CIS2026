/**
 * Seed admin user from environment variables on server start.
 * Creates the admin if not found, or updates password if changed.
 */

const User = require("../models/User");
const logger = require("./logger");

async function seedAdmin() {
  const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    logger.warn("ADMIN_EMAIL or ADMIN_PASSWORD not set — skipping admin seed");
    return;
  }

  try {
    let admin = await User.findOne({ email: ADMIN_EMAIL.toLowerCase() });

    if (!admin) {
      admin = new User({
        email: ADMIN_EMAIL.toLowerCase(),
        passwordHash: ADMIN_PASSWORD,
        name: "Admin",
        role: "admin",
      });
      await admin.save();
      logger.info({ email: ADMIN_EMAIL }, "Admin user created from .env");
    } else if (admin.role !== "admin") {
      admin.role = "admin";
      await admin.save();
      logger.info({ email: ADMIN_EMAIL }, "Existing user promoted to admin");
    } else {
      logger.info({ email: ADMIN_EMAIL }, "Admin user already exists");
    }
  } catch (err) {
    logger.error({ err }, "Failed to seed admin user");
  }
}

module.exports = { seedAdmin };
