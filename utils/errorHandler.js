const errorHandler = (res, error) => {
  console.error(error);
  res.status(500).json({ message: 'Server error', error: error.message });
};

module.exports = { errorHandler };