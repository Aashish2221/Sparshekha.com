const User = require('../models/CustomerInfo');
const { errorHandler } = require('../utils/errorHandler');

const getCustomerInfo = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).select('-password -__v');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    errorHandler(res, error);
  }
};

const updateCustomerInfo = async (req, res) => {
  try {
    const userId = req.user.userId;
    const updates = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { ...updates, updatedAt: Date.now() },
      { new: true, runValidators: true, select: '-password -__v' }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports = { getCustomerInfo, updateCustomerInfo };