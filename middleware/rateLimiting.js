const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');

// General API rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Auth endpoints rate limiting (stricter)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 auth attempts per windowMs
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// OTP rate limiting
const otpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 3, // limit each IP to 3 OTP requests per windowMs
  message: {
    success: false,
    message: 'Too many OTP requests, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Progressive delay for failed auth attempts
const authSpeedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 2, // allow 2 requests per window without delay
  delayMs: (used, req) => {
    // Add 500ms delay per request after delayAfter
    const delay = (used - 2) * 500;
    return Math.min(delay, 5000); // Cap at 5 seconds
  },
});

module.exports = {
  apiLimiter,
  authLimiter,
  otpLimiter,
  authSpeedLimiter,
};