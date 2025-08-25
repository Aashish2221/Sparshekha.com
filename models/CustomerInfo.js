const mongoose = require('mongoose');

const customerInfoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  lastName: { type: String },
  firstName: { type: String },
  emailId: { type: String },
  mobNo: { type: String },
  phone: { type: String },
  city: { type: String },
  pincode: { type: String },
  state: { type: String },
  profilePhoto: { type: String },
  address: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CustomerInfo', customerInfoSchema);