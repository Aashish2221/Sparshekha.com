const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

const validateContact = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
  body('email').trim().isEmail().withMessage('Valid email is required'),
  body('phone').optional().trim().isMobilePhone().withMessage('Valid phone number required'),
  body('service').trim().notEmpty().withMessage('Service is required'),
  body('eventDate').optional().isISO8601().withMessage('Valid date required'),
  body('message').trim().notEmpty().withMessage('Message is required').isLength({ max: 2000 }),
];

// POST /api/contact - submit contact form
router.post('/', validateContact, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    // In production: send email using nodemailer / SendGrid etc.
    const { name, email, phone, service, eventDate, message } = req.body;

    console.log('New contact inquiry:', { name, email, phone, service, eventDate, message });

    res.status(200).json({
      success: true,
      message: "Thank you for reaching out! I'll get back to you within 24 hours.",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

module.exports = router;
