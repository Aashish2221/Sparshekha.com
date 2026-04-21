const express = require('express');
const router = express.Router();
const { body, validationResult, param, query } = require('express-validator');
const Review = require('../models/Review');

// Validation middleware
const validateReview = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('service')
    .notEmpty()
    .withMessage('Service is required')
    .isIn([
      'Bridal Makeup',
      'Party Makeup',
      'Editorial Makeup',
      'Natural/Everyday Makeup',
      'Special Effects Makeup',
      'Airbrush Makeup',
      'Other',
    ])
    .withMessage('Invalid service type'),
  body('reviewText')
    .trim()
    .notEmpty()
    .withMessage('Review text is required')
    .isLength({ min: 20, max: 1000 })
    .withMessage('Review must be between 20 and 1000 characters'),
];

// GET /api/reviews - get all approved reviews
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = { isApproved: true };

    const [reviews, total] = await Promise.all([
      Review.find(filter)
        .sort({ isFeatured: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-email'),
      Review.countDocuments(filter),
    ]);

    // aggregate average rating
    const stats = await Review.aggregate([
      { $match: { isApproved: true } },
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
          fiveStar: { $sum: { $cond: [{ $eq: ['$rating', 5] }, 1, 0] } },
          fourStar: { $sum: { $cond: [{ $eq: ['$rating', 4] }, 1, 0] } },
          threeStar: { $sum: { $cond: [{ $eq: ['$rating', 3] }, 1, 0] } },
          twoStar: { $sum: { $cond: [{ $eq: ['$rating', 2] }, 1, 0] } },
          oneStar: { $sum: { $cond: [{ $eq: ['$rating', 1] }, 1, 0] } },
        },
      },
    ]);

    res.json({
      success: true,
      data: reviews,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalReviews: total,
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
      stats: stats[0] || {
        avgRating: 0,
        totalReviews: 0,
        fiveStar: 0,
        fourStar: 0,
        threeStar: 0,
        twoStar: 0,
        oneStar: 0,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// GET /api/reviews/featured - get featured reviews
router.get('/featured', async (req, res) => {
  try {
    const reviews = await Review.find({ isApproved: true, isFeatured: true })
      .sort({ createdAt: -1 })
      .limit(6)
      .select('-email');

    res.json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// POST /api/reviews - create a new review
router.post('/', validateReview, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { name, email, rating, service, reviewText } = req.body;

    const review = new Review({ name, email, rating, service, reviewText });
    await review.save();

    res.status(201).json({
      success: true,
      message: 'Thank you for your review! It will be visible after approval.',
      data: { id: review._id, name: review.name, rating: review.rating },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// PATCH /api/reviews/:id/approve - approve a review (admin)
router.patch('/:id/approve', async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    res.json({ success: true, data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// PATCH /api/reviews/:id/feature - feature/unfeature a review (admin)
router.patch('/:id/feature', async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    review.isFeatured = !review.isFeatured;
    await review.save();
    res.json({ success: true, data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

// DELETE /api/reviews/:id - delete a review (admin)
router.delete('/:id', async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    res.json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

module.exports = router;
