/**
 * Admin routes — all protected by JWT + admin role.
 */

const express = require("express");
const { authMiddleware } = require("../middleware/auth");
const { requireRole } = require("../middleware/rbac");
const {
  getDashboard,
  getSiteContent,
  updateSiteContent,
  listSpeakers,
  createSpeaker,
  updateSpeaker,
  deleteSpeaker,
  listSponsors,
  createSponsor,
  updateSponsor,
  deleteSponsor,
  listRegistrations,
  listContacts,
  resetDatabase,
} = require("../controllers/adminController");

const router = express.Router();

// All admin routes require auth + admin role
router.use(authMiddleware);
router.use(requireRole("admin"));

// Dashboard
router.get("/dashboard", getDashboard);

// Site Content
router.get("/site-content", getSiteContent);
router.put("/site-content", updateSiteContent);

// Speakers
router.get("/speakers", listSpeakers);
router.post("/speakers", createSpeaker);
router.put("/speakers/:id", updateSpeaker);
router.delete("/speakers/:id", deleteSpeaker);

// Sponsors
router.get("/sponsors", listSponsors);
router.post("/sponsors", createSponsor);
router.put("/sponsors/:id", updateSponsor);
router.delete("/sponsors/:id", deleteSponsor);

// Registrations (read-only)
router.get("/registrations", listRegistrations);

// Contacts (read-only)
router.get("/contacts", listContacts);

// Database Reset (with Excel backup download)
router.post("/reset-database", resetDatabase);

module.exports = router;
