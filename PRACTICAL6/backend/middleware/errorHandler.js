/**
 * Centralized Global Error Handler Middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error('[SERVER ERROR]', err.name, ':', err.message);

  // Mongoose Validation Error (HTTP 400)
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({
      success: false,
      error: 'ValidationError',
      messages: messages
    });
  }

  // Mongoose CastError - Invalid MongoDB ObjectId (HTTP 400)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      error: 'InvalidObjectId',
      message: `Resource not found. Invalid ID format: ${err.value}`
    });
  }

  // Fallback 500
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.name || 'ServerError',
    message: err.message || 'An unexpected error occurred on the server'
  });
};

module.exports = errorHandler;
