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
    console.log('Updating customer info for userId:', userId); // Debug log
    console.log('Received updates:', req.body); // Log the request body

    let customerInfo = await CustomerInfo.findOne({ userId });
    if (!customerInfo) {
      customerInfo = new CustomerInfo({ userId, ...req.body });
      console.log('Creating new customer info:', customerInfo);
    } else {
      customerInfo = await CustomerInfo.findOneAndUpdate(
        { userId },
        { ...req.body, updatedAt: Date.now() },
        { new: true, runValidators: true, select: '-__v' }
      );
      console.log('Updated customer info:', customerInfo);
    }

    if (!customerInfo) {
      return res.status(500).json({ message: 'Failed to save customer info' });
    }

    await customerInfo.save(); // Ensure save is called for new documents
    res.json(customerInfo);
  } catch (error) {
    console.error('Error updating customer info:', error); // Debug error
    errorHandler(res, error);
  }
};

module.exports = { getCustomerInfo, updateCustomerInfo };