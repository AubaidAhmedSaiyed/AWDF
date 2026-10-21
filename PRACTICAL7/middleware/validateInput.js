/**
 * Input Validation Middleware
 * Step 7: Checks that required fields exist before reaching the controller
 */
const validateTaskInput = (req, res, next) => {
  const { title } = req.body;

  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({
      error: 'Validation failed: Task title is required and cannot be empty'
    });
  }

  next();
};

const validateAuthInput = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: 'Validation failed: Email and password are both required'
    });
  }

  next();
};

module.exports = {
  validateTaskInput,
  validateAuthInput
};
