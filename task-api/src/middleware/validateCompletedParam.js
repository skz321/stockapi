// Middleware layer: validates the completed query parameter

function validateCompletedParam(req, res, next) {
  const { completed } = req.query;

  // If not provided, skip validation — all tasks will be returned
  if (completed === undefined) {
    return next();
  }

  // Must be exactly "true" or "false"
  if (completed !== "true" && completed !== "false") {
    return res.status(400).json({
      errors: ["completed must be 'true' or 'false'"],
    });
  }

  next();
}

module.exports = { validateCompletedParam };
