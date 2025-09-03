const Razorpay = require('razorpay');
     const crypto = require('crypto');
     const Order = require('../models/Order');
     const { errorHandler } = require('../utils/errorHandler');

     const razorpay = new Razorpay({
       key_id: "rzp_live_R7riJJKQSytYGE",
       key_secret: "IyW6B2j2bhg33Ej9M9TATGpf",
     });

     const placeOrder = async (req, res) => {
      console.log(123);
      
       try {
         const userId = req.user.userId;
         const { items, shippingInfo, totalAmount } = req.body;

         if (!items || !shippingInfo || !totalAmount) {
           return res.status(400).json({ message: 'Items, shipping info, and total amount are required' });
         }

         const options = {
           amount: totalAmount * 100, // Razorpay expects amount in paise
           currency: 'INR',
           receipt: `order_rcpt_${userId}_${Date.now()}`,
         };

         const razorpayOrder = await razorpay.orders.create(options);

         const order = new Order({
           userId,
           items,
           shippingInfo,
           totalAmount,
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

         const sign = razorpay_order_id + '|' + razorpay_payment_id;
         const expectedSign = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
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