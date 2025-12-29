// routes/otpRoutes.js
const router = require('express').Router();
const {
  sendPhoneOtp,
  verifyPhoneOtp,
} = require('../controllers/otpController');

router.post('/send', sendPhoneOtp);
router.post('/verify', verifyPhoneOtp);

module.exports = router;
