const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      productId: { type: Number, required: true }, // Changed to Number
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  shippingInfo: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    phone: { type: String, required: false }, // Changed to optional
  },
  totalAmount: { type: Number, required: true },
  razorpayOrderId: { type: String, required: true },
  status: { type: String, default: 'pending' },
  paymentId: { type: String },
});

module.exports = mongoose.model('Order', orderSchema);