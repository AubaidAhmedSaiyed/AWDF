/**
 * Task ID Validation Middleware
 * Supplementary problem: Validates that task id is an integer > 0 before reaching controller
 */
const validateTaskId = (req, res, next) => {
  const { id } = req.params;
  const parsedId = parseInt(id, 10);

  if (isNaN(parsedId) || parsedId <= 0 || String(parsedId) !== id.trim()) {
    return res.status(400).json({
      success: false,
      error: 'InvalidTaskId',
      message: `Task ID '${id}' is invalid. ID must be a positive integer.`
    });
  }

  req.parsedTaskId = parsedId;
  next();
};

module.exports = validateTaskId;
