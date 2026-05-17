const rateLimit = require('express-rate-limit');

const reviewLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: { success: false, message: 'Too many reviews submitted. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: { success: false, message: 'Too many contact requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { reviewLimiter, contactLimiter };
