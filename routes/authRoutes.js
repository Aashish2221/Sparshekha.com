const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const authenticateToken = require('../middleware/authMiddleware');
const { getCustomerInfo, updateCustomerInfo } = require('../controllers/CustomerInfoController');
const { getShippingInfo, updateShippingInfo } = require('../controllers/shippingController');
const { placeOrder, verifyPayment } = require('../controllers/orderController');

router.post('/register', register);
router.post('/login', login);
router.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'Protected route accessed', user: req.user });
});
router.get('/customer-info', authenticateToken, getCustomerInfo);
router.put('/customer-info', authenticateToken, updateCustomerInfo);
router.get('/shipping-info', authenticateToken, getShippingInfo);
router.put('/shipping-info', authenticateToken, updateShippingInfo);
router.post('/orders/place', authenticateToken, placeOrder);
router.post('/orders/verify', authenticateToken, verifyPayment);

module.exports = router;