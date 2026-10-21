/**
 * Content-Type JSON Validation Middleware
 * Supplementary problem: Rejects requests without Content-Type: application/json on POST/PUT
 */
const requireJsonContent = (req, res, next) => {
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    const contentType = req.headers['content-type'];
    if (!contentType || !contentType.includes('application/json')) {
      return res.status(415).json({
        success: false,
        error: 'UnsupportedMediaType',
        message: 'Requests with a payload must specify Content-Type: application/json'
      });
    }
  }
  next();
};

module.exports = requireJsonContent;
