const express = require('express');
const { body } = require('express-validator');
const ensureAuth = require('../middleware/auth');
const authController = require('../controllers/authController');
const { authLimiter, authSpeedLimiter } = require('../middleware/rateLimiting');
const passport = require('passport');
require('../config/passport');

// const ensureAuth = require('../middleware/auth')


const router = express.Router();

// register user
router.post(
  '/register',
  // authLimiter,
  // authSpeedLimiter,
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage(
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      ),
    body('phone').trim().notEmpty().withMessage('Phone is required'),
  ],
  authController.register
);

// user login
router.post(
  '/login',
  // authLimiter,
  // authSpeedLimiter,
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  passport.authenticate('local'),
  authController.login
);

router.get('/user/:id', ensureAuth, authController.getUserById);

// get currrent user
router.get('/me', ensureAuth, authController.getCurrentUser);

router.post('/logout', authController.logout);

router.post(
  '/request-password-reset',
  // authLimiter,
  [body('email').isEmail().withMessage('Valid email is required')],
  authController.requestPasswordReset
);

router.post(
  '/reset-password',
  [
    body('token').notEmpty().withMessage('Reset token is required'),
    body('newPassword')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage(
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      ),
  ],
  authController.resetPassword
);

module.exports = router;
