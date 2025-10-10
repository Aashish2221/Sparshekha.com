const nodemailer = require('nodemailer');
const validator = require('email-validator');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'patilaashish2221@gmail.com',
    pass: 'eeou onla egzx anal',
  },
});

async function sendMail(to, subject, text, html) {
  // Validate email addresses
  if (!to.every(email => validator.validate(email))) {
    throw new Error('Invalid email address provided');
  }
  const mailOptions = {
    from: 'patilaashish2221@gmail.com',
    to: to.join(','),
    subject,
    text,
    html,
  };
  return transporter.sendMail(mailOptions);
}

module.exports = { sendMail };