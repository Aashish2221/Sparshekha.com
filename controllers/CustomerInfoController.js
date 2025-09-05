const CustomerInfo = require('../models/CustomerInfo');
const { errorHandler } = require('../utils/errorHandler');

const getCustomerInfo = async (req, res) => {
  try {
    const userId = req.user.userId;
    const customerInfo = await CustomerInfo.findOne({ userId }).select('-__v');

    if (!customerInfo) {
      return res.status(200).json({ message: 'Customer info not found' });
    }

    res.json(customerInfo);
  } catch (error) {
    errorHandler(res, error);
  }
};

const updateCustomerInfo = async (req, res) => {
  try {
    const userId = req.user.userId;

    let customerInfo = await CustomerInfo.findOne({ userId });
    const updates = { ...req.body, updatedAt: Date.now() };

    // Handle emailId to prevent null or empty values
    if ('emailId' in updates && !updates.emailId.trim()) {
      delete updates.emailId; // Remove emailId if empty or null
    }

    if (!customerInfo) {
      customerInfo = new CustomerInfo({ userId, ...updates });
    } else {
      customerInfo = await CustomerInfo.findOneAndUpdate(
        { userId },
        updates,
        { new: true, runValidators: true, select: '-__v' }
      );
    }

    if (!customerInfo) {
      return res.status(500).json({ message: 'Failed to save customer info' });
    }

    await customerInfo.save(); // Ensure save for new documents
    res.json(customerInfo);
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports = { getCustomerInfo, updateCustomerInfo };