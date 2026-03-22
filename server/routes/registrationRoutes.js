/**
 * Registration routes — admin-only endpoints.
 * All routes require JWT authentication + admin role.
 */

const express = require("express");
const { authMiddleware } = require("../middleware/auth");
const { requireRole } = require("../middleware/rbac");
const { getAll, getById } = require("../controllers/registrationController");

const router = express.Router();

// All routes protected: JWT + admin role
router.use(authMiddleware);
router.use(requireRole("admin"));

router.get("/", getAll);
router.get("/:id", getById);

module.exports = router;
