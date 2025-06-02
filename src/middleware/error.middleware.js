// Standardized error middleware
// This middleware formats error responses consistently:
// { success: false, error: { code: <status code>, message: <error message>, details: <optional details> } }

function errorMiddleware(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  const details = err.details || null;

  res.status(statusCode).json({
    success: false,
    error: {
      code: statusCode,
      message,
      details
    }
  });
}

module.exports = errorMiddleware; 