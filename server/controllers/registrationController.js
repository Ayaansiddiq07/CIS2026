/**
 * Registration controller — admin endpoints for viewing registrations.
 * All routes here require JWT authentication + admin role.
 *
 * OPTIMIZATION: List query excludes qrCode field (3KB+ per doc)
 * to prevent decompressing all QR codes on every list view.
 */

const Registration = require("../models/Registration");

/**
 * GET /api/registrations
 * List all registrations with optional status filter.
 * Protected: admin only.
 */
async function getAll(req, res, next) {
  try {
    const { status, page = 1, limit = 50 } = req.query;
    const filter = {};

    if (status && ["pending", "paid", "failed"].includes(status)) {
      filter.status = status;
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    const [registrations, total] = await Promise.all([
      Registration.find(filter)
        .select("-qrCode") // ← exclude 3KB+ buffer per doc
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit, 10))
        .lean(),
      Registration.countDocuments(filter),
    ]);

    res.json({
      registrations,
      pagination: {
        total,
        page: parseInt(page, 10),
        pages: Math.ceil(total / parseInt(limit, 10)),
      },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/registrations/:id
 * Get a single registration by ID.
 * Protected: admin only.
 */
async function getById(req, res, next) {
  try {
    const registration = await Registration.findById(req.params.id).lean();

    if (!registration) {
      return res.status(404).json({ error: "Registration not found" });
    }

    res.json(registration);
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, getById };
