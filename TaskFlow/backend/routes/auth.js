const express = require('express');
const {
  register,
  login,
  getProfile,
  registerValidation,
  loginValidation
} = require('./controllers/authController');
const authMiddleware = require('./middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/profile', authMiddleware, getProfile);

module.exports = router;