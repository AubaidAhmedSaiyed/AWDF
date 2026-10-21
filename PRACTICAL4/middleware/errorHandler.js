/**
 * Centralized Global Error Handling Middleware
 * Must take exactly 4 parameters: (err, req, res, next)
 * Placed at the end of the Express pipeline to catch unhandled errors
 */
const errorHandler = (err, req, res, next) => {
  console.error('[ERROR_HANDLER]', err.stack || err.message);

  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: err.name || 'InternalServerError',
    message: err.message || 'Something went wrong on the server',
    timestamp: new Date().toISOString()
  });
};

module.exports = errorHandler;
