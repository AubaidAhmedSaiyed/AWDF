const jwt = require('jsonwebtoken');

/**
 * Authentication Middleware
 * Step 5: Verifies JWT token from Authorization header (Bearer <token>)
 */
const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Authorization denied: No token provided'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'supersecret_jwt_key_charusat_itue301_2026'
    );
    req.user = decoded; // { id: user._id, email: user.email }
    next();
  } catch (err) {
    return res.status(401).json({
      error: 'Token is invalid or expired'
    });
  }
};

module.exports = auth;
