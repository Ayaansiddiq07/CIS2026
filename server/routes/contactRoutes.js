/**
 * Contact routes — public contact form submission.
 */

const express = require("express");
const { z } = require("zod");
const { validate } = require("../middleware/validate");
const { contactLimiter } = require("../middleware/rateLimiter");
const { submit } = require("../controllers/contactController");

const router = express.Router();

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().toLowerCase().email("Invalid email"),
  subject: z.string().trim().min(1, "Subject is required").max(200),
  message: z.string().trim().min(1, "Message is required").max(2000),
});

// contactLimiter: 5 submissions per 15 min per IP (on top of globalLimiter)
router.post("/", contactLimiter, validate(contactSchema), submit);

module.exports = router;
