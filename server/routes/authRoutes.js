/**
 * Auth routes — login, token refresh, logout.
 */

const express = require("express");
const { z } = require("zod");
const { validate } = require("../middleware/validate");
const { authLimiter } = require("../middleware/rateLimiter");
const { login, refreshToken, logout } = require("../controllers/authController");

const router = express.Router();

// ── Zod Schemas ──

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

const logoutSchema = z.object({
  refreshToken: z.string().optional(),
});

// ── Routes ──

router.post("/login", authLimiter, validate(loginSchema), login);
router.post("/refresh", authLimiter, validate(refreshSchema), refreshToken);
router.post("/logout", validate(logoutSchema), logout);

module.exports = router;
