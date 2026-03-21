const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

const { login, getProfile, logout } = require('../controllers/authController');
const authenticate = require('../middleware/authMiddleware');

// Validation middleware
const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
];

// Routes
router.post('/login', validateLogin, login);
router.get('/profile', authenticate, getProfile);
router.post('/logout', logout);

module.exports = router;
