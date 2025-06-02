// Standardized response middleware
// This middleware wraps the response in a consistent format:
// { success: true, data: <original response>, message: <optional message> }

function responseMiddleware(req, res, next) {
  const originalJson = res.json;
  res.json = function(data, message) {
    return originalJson.call(this, {
      success: true,
      data,
      message: message || null
    });
  };
  next();
}

module.exports = responseMiddleware; 