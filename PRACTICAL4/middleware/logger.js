/**
 * Request Logging Middleware
 * Logs HTTP Method, Request URL, and Timestamp for incoming requests
 */
const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[REQUEST] ${req.method} ${req.originalUrl || req.url} - ${timestamp}`);
  next();
};

module.exports = requestLogger;
