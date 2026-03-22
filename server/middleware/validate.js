/**
 * Zod validation middleware factory.
 * Usage: validate(schema) — validates req.body against the Zod schema.
 * Strips unknown fields, trims strings, and returns clean errors.
 */

function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      }));
      return res.status(400).json({
        error: "Validation failed",
        details: errors,
      });
    }

    // Replace body with parsed + sanitized data
    req.body = result.data;
    next();
  };
}

module.exports = { validate };
