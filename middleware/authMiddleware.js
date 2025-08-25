const jwt = require('jsonwebtoken');
     const User = require('../models/User');

     const authenticateToken = async (req, res, next) => {
       const authHeader = req.headers['authorization'];
       const token = authHeader && authHeader.split(' ')[1];

       if (!token) {
         return res.status(401).json({ message: 'Access token required' });
       }

       try {
         const decoded = jwt.verify(token, process.env.JWT_SECRET);
         req.user = decoded;

         const user = await User.findById(decoded.userId);
         if (!user || !user.tokens.includes(token)) {
           return res.status(403).json({ message: 'Invalid or unauthorized token' });
         }

         next();
       } catch (err) {
         if (err.name === 'TokenExpiredError') {
           return res.status(401).json({ message: 'Token has expired' });
         }
         return res.status(403).json({ message: 'Invalid token' });
       }
     };

     module.exports = authenticateToken;