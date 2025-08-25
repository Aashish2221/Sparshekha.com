const CustomerInfo = require('../models/CustomerInfo');
const { errorHandler } = require('../utils/errorHandler');

const getCustomerInfo = async (req, res) => {
  try {
    const userId = req.user.userId;
    const customerInfo = await CustomerInfo.findOne({ userId }).select('-__v');

    if (!customerInfo) {
      return res.status(404).json({ message: 'Customer info not found' });
    }

    res.json(customerInfo);
  } catch (error) {
    errorHandler(res, error);
  }
};

const updateCustomerInfo = async (req, res) => {
  try {
    const userId = req.user.userId;
    const updates = req.body;

    let customerInfo = await CustomerInfo.findOne({ userId });
    if (!customerInfo) {
      customerInfo = new CustomerInfo({ userId, ...updates });
    } else {
      customerInfo = await CustomerInfo.findOneAndUpdate(
        { userId },
        { ...updates, updatedAt: Date.now() },
        { new: true, runValidators: true, select: '-__v' }
      );
    }

    if (!customerInfo) {
      return res.status(500).json({ message: 'Failed to save customer info' });
    }

    res.json(customerInfo);
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports = { getCustomerInfo, updateCustomerInfo };