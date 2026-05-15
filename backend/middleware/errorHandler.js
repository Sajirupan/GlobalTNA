/**
 * Centralised error handler.
 * Maps Mongoose errors → appropriate HTTP codes so routes stay clean.
 */
function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Mongoose validation error (required, enum, custom validators)
  if (err.name === "ValidationError") {
    statusCode = 422;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join("; ");
  }

  // Mongoose bad ObjectId  ─ e.g. /api/jobs/not-an-id
  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 400;
    message = `Invalid id format: "${err.value}"`;
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || "field";
    message = `A record with that ${field} already exists`;
  }

  if (process.env.NODE_ENV !== "test") {
    console.error(`[${statusCode}] ${req.method} ${req.path} — ${message}`);
  }

  res.status(statusCode).json({ success: false, message });
}

module.exports = errorHandler;
