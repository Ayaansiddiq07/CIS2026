/**
 * Contact controller — handles contact form submissions.
 */

const Contact = require("../models/Contact");
const logger = require("../config/logger");

/**
 * POST /api/contact
 * Save a contact form submission.
 */
async function submit(req, res, next) {
  try {
    const { name, email, subject, message } = req.body;

    const contact = await Contact.create({ name, email, subject, message });

    logger.info({ email }, "Contact form submitted");

    res.status(201).json({
      message: "Thank you for reaching out. We will get back to you soon.",
      id: contact._id,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { submit };
