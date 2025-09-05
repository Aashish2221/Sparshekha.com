const Razorpay = require('razorpay');
     const crypto = require('crypto');
     const Order = require('../models/Order');
     const { errorHandler } = require('../utils/errorHandler');

     const razorpay = new Razorpay({
       key_id: "rzp_live_R7riJJKQSytYGE",
       key_secret: "IyW6B2j2bhg33Ej9M9TATGpf",
     });

     const placeOrder = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { items, shippingInfo, totalAmount } = req.body;

    // Validate inputs
    if (!items || !shippingInfo || !totalAmount) {
      return res.status(400).json({ message: 'Items, shipping info, and total amount are required' });
    }

    // Validate totalAmount
    if (typeof totalAmount !== 'number' || isNaN(totalAmount) || totalAmount <= 0) {
      return res.status(400).json({ message: 'Total amount must be a valid positive number' });
    }

    // Validate items
    for (const item of items) {
      if (!Number.isInteger(item.productId) || item.productId <= 0) {
        return res.status(400).json({ message: `Invalid productId: ${item.productId}` });
      }
      if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
        return res.status(400).json({ message: `Invalid quantity for productId: ${item.productId}` });
      }
      if (typeof item.price !== 'number' || isNaN(item.price) || item.price <= 0) {
        return res.status(400).json({ message: `Invalid price for productId: ${item.productId}` });
      }
    }

    // Sanitize and convert to paise
    const sanitizedAmount = Math.round(totalAmount * 100) / 100; // Ensure 39.98
    const amountInPaise = Math.floor(sanitizedAmount * 100); // Ensure 3998

    // Generate a shorter receipt (max 40 characters)
    const timestamp = Date.now().toString().slice(-8);
    const shortUserId = userId.slice(-6);
    const receipt = `ord_${shortUserId}_${timestamp}`;

    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: receipt,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    const order = new Order({
      userId,
      items,
      shippingInfo,
      totalAmount: sanitizedAmount,
      razorpayOrderId: razorpayOrder.id,
    });

    await order.save();

    res.json({
      success: true,
      message: 'Order created. Proceed with payment.',
      orderId: order._id,
      razorpayOrder,
    });
  } catch (error) {
    errorHandler(res, error);
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { orderId, razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    // Check for authentication (assuming middleware handles token)
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: 'Access token required' });
    }

    if (!process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({ message: 'Server configuration error' });
    }

    if (!orderId || !razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return res.status(400).json({ message: 'Missing required payment verification data' });
    }

    // Compute signature using environment variable
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest('hex');

    if (expectedSign === razorpay_signature) {
      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      order.status = 'paid';
      order.paymentId = razorpay_payment_id;
      await order.save();

      res.json({ success: true, message: 'Payment verified successfully' });
    } else {
      res.status(400).json({ message: 'Invalid payment signature' });
    }
  } catch (error) {
    errorHandler(res, error);
  }
};
     module.exports = { placeOrder, verifyPayment };