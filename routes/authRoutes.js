const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const authenticateToken = require('../middleware/authMiddleware');
const { getCustomerInfo, updateCustomerInfo } = require('../controllers/CustomerInfoController'); // Fixed path

router.post('/register', register);
router.post('/login', login);
router.get('/protected', authenticateToken, (req, res) => {
  res.json({ message: 'Protected route accessed', user: req.user });
});
router.get('/customer-info', authenticateToken, getCustomerInfo);
router.put('/customer-info', authenticateToken, updateCustomerInfo);

module.exports = router;