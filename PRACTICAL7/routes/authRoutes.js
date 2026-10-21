const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { validateAuthInput } = require('../middleware/validateInput');
const auth = require('../middleware/auth');

router.post('/register', validateAuthInput, register);
router.post('/login', validateAuthInput, login);
router.get('/me', auth, getMe);

module.exports = router;
