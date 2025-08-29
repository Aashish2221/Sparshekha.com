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
    console.log('Updating shipping info for userId:', userId); // Debug log
    console.log('Received updates:', req.body); // Log the request body

    let shippingInfo = await ShippingInfo.findOne({ userId });
    if (!shippingInfo) {
      shippingInfo = new ShippingInfo({ userId, ...req.body });
      console.log('Creating new shipping info:', shippingInfo);
    } else {
      shippingInfo = await ShippingInfo.findOneAndUpdate(
        { userId },
        { ...req.body, updatedAt: Date.now() },
        { new: true, runValidators: true, select: '-__v' }
      );
      console.log('Updated shipping info:', shippingInfo);
    }

    if (!shippingInfo) {
      return res.status(500).json({ message: 'Failed to save shipping info' });
    }

    await shippingInfo.save(); // Ensure save is called for new documents
    res.json(shippingInfo);
  } catch (error) {
    console.error('Error updating shipping info:', error); // Debug error
    errorHandler(res, error);
  }
};

module.exports = { getShippingInfo, updateShippingInfo };