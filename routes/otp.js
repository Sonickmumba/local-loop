// routes/otpRoutes.js
const router = require('express').Router();
const {
  sendPhoneOtp,
  verifyPhoneOtp,
} = require('../controllers/otpController');
const { otpLimiter } = require('../middleware/rateLimiting');

router.post('/send', otpLimiter, sendPhoneOtp);
router.post('/verify', otpLimiter, verifyPhoneOtp);

module.exports = router;
