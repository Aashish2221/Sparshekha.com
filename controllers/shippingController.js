const ShippingInfo = require('../models/ShippingInfo');
const { errorHandler } = require('../utils/errorHandler');

const getShippingInfo = async (req, res) => {
  try {
    const userId = req.user.userId;
    const shippingInfo = await ShippingInfo.findOne({ userId }).select('-__v');

    if (!shippingInfo) {
      return res.status(404).json({ message: 'Shipping info not found' });
    }

    res.json(shippingInfo);
  } catch (error) {
    errorHandler(res, error);
  }
};

const updateShippingInfo = async (req, res) => {
  try {
    const userId = req.user.userId;
    let shippingInfo = await ShippingInfo.findOne({ userId });
    if (!shippingInfo) {
      shippingInfo = new ShippingInfo({ userId, ...req.body });
    } else {
      shippingInfo = await ShippingInfo.findOneAndUpdate(
        { userId },
        { ...req.body, updatedAt: Date.now() },
        { new: true, runValidators: true, select: '-__v' }
      );
    }

    if (!shippingInfo) {
      return res.status(500).json({ message: 'Failed to save shipping info' });
    }

    await shippingInfo.save(); // Ensure save is called for new documents
    res.json(shippingInfo);
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports = { getShippingInfo, updateShippingInfo };