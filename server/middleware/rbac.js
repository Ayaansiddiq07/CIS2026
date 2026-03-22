/**
 * Role-based access control middleware.
 * Use AFTER authMiddleware (requires req.user.role).
 *
 * Usage: requireRole('admin')
 *        requireRole('admin', 'organizer')
 */

function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ error: "Access denied — no role assigned" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "Access denied — insufficient permissions" });
    }

    next();
  };
}

module.exports = { requireRole };
