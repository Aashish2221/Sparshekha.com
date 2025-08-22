const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { errorHandler } = require('../utils/errorHandler');

const register = async (req, res) => {
 try {
  const { name, email, password, mobile } = req.body;

  // Validate required fields
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Check for existing user
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Generate JWT token
  const token = jwt.sign({ userId: User._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

  // Create new user with token
  const user = new User({
    name,
    email,
    mobile,
    password: hashedPassword,
    tokens: token , // Store token in an array
  });

  // Save user to database
  await user.save();

  // Return response with token and user details
  res.status(201).json({ user: { id: user._id, name, email, token } });
} catch (error) {
  errorHandler(res, error);
}
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ user: { id: user._id, name: user.name, email, token: user.tokens } });
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports = { register, login };