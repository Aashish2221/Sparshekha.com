const nodemailer = require('nodemailer');
const validator = require('email-validator');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
console.log(process.env.EMAIL_USER, process.env.EMAIL_PASS)

async function sendMail(to, subject, text) {
  // Validate email addresses
  if (!to.every(email => validator.validate(email))) {
    throw new Error('Invalid email address provided');
  }
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: to.join(','),
    subject,
    text,
  };
  return transporter.sendMail(mailOptions);
}

module.exports = { sendMail };