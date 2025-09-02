const mongoose = require('mongoose');

     const customerInfoSchema = new mongoose.Schema({
       userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
       name: { type: String, required: true },
       emailId: { type: String, required: true }, // No unique index
       mobNo: { type: String, required: true },
       city: { type: String, required: true },
       pincode: { type: String, required: true },
       state: { type: String, required: true },
       profilePhoto: { type: String },
       address: { type: String, required: true },
       createdAt: { type: Date, default: Date.now },
       updatedAt: { type: Date, default: Date.now }
     });

     customerInfoSchema.index({ userId: 1 }, { unique: true }); // Only userId is unique

     module.exports = mongoose.model('CustomerInfo', customerInfoSchema);