const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  lastName: { type: String },
  firstName: { type: String },
  mobNo: { type: String },
  phone: { type: String },
  city: { type: String },
  pincode: { type: String },
  state: { type: String },
  profilePhoto: { type: String },
  address: { type: String },
  token: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CustomerInfo', userSchema);