const { sendMail } = require('../utils/mailer');

async function notifyUsers({ recipients, customerName, orderId, items, totalAmount }) {
  try {
    // Validate required fields
    if (!recipients || !Array.isArray(recipients) || recipients.length === 0 || !customerName || !orderId || !items || !totalAmount) {
      return false;
    }

    // Build HTML email template
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; }
          .header { background-color: #f4f4f4; padding: 10px; text-align: center; }
          .content { padding: 20px; }
          .footer { text-align: center; font-size: 12px; color: #777; margin-top: 20px; }
          .order-details { margin: 20px 0; }
          .order-details p { margin: 5px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>Order Confirmation</h2>
          </div>
          <div class="content">
            <p>Dear ${customerName},</p>
            <p>Thank you for your order! Here are the details:</p>
            <div class="order-details">
              <p><strong>Order ID:</strong> ${orderId}</p>
              <p><strong>Items:</strong> ${items.join(', ')}</p>
              <p><strong>Total Amount:</strong> ${totalAmount}</p>
            </div>
            <p>We will process your order shortly. You will receive a shipping confirmation soon.</p>
            <p>If you have any questions, feel free to contact us at <a href="mailto:patilaashish2221@gmail.com">patilaashish2221@gmail.com</a>.</p>
          </div>
          <div class="footer">
            <p>&copy; 2025 Sparshekha Team. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Build plain text fallback
    const text = `
      Dear ${customerName},

      Thank you for your order! Here are the details:

      Order ID: ${orderId}
      Items: ${items.join(', ')}
      Total Amount: $${totalAmount}

      We will process your order shortly. You will receive a shipping confirmation soon.

      If you have any questions, feel free to contact us at patilaashish2221@gmail.com.

      Best regards,
      Sparshekha Team
    `;

    // Send email with HTML
    await sendMail(recipients, `Order Confirmation - #${orderId}`, text, html);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
}

module.exports = { notifyUsers };
