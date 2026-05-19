const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Contact = require('../models/Contact');
const { contactLimiter } = require('../middleware/rateLimiter');
const { sendWhatsApp } = require('../utils/whatsapp');

const validateContact = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
  body('email').trim().isEmail().withMessage('Valid email is required'),
  body('phone').optional().trim().isMobilePhone().withMessage('Valid phone number required'),
  body('service').trim().notEmpty().withMessage('Service is required'),
  body('eventDate').optional().isISO8601().withMessage('Valid date required'),
  body('message').trim().notEmpty().withMessage('Message is required').isLength({ max: 2000 }),
];

// POST /api/contact - submit contact form
router.post('/', contactLimiter, validateContact, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { name, email, phone, service, eventDate, message } = req.body;

    const contact = new Contact({ name, email, phone, service, eventDate, message });
    await contact.save();

    console.log('New contact inquiry saved:', contact._id);

    const whatsappMessage =
      `📩 *New Booking Enquiry*\n\n` +
      `*Name:* ${name}\n` +
      `*Email:* ${email}\n` +
      `*Phone:* ${phone || 'Not provided'}\n` +
      `*Service:* ${service}\n` +
      `*Event Date:* ${eventDate ? new Date(eventDate).toDateString() : 'Not specified'}\n` +
      `*Message:* ${message}`;

    sendWhatsApp(whatsappMessage).catch((err) =>
      console.error('WhatsApp notification failed:', err.message)
    );

    res.status(201).json({
      success: true,
      message: "Thank you for reaching out! I'll get back to you within 24 hours.",
    });
  } catch (error) {
    console.error('Contact POST error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
