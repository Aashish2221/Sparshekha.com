const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    service: {
      type: String,
      required: [true, 'Service type is required'],
      enum: [
        'Bridal Makeup',
        'Party Makeup',
        'Editorial Makeup',
        'Natural/Everyday Makeup',
        'Special Effects Makeup',
        'Airbrush Makeup',
        'Other',
      ],
    },
    reviewText: {
      type: String,
      required: [true, 'Review text is required'],
      trim: true,
      minlength: [20, 'Review must be at least 20 characters'],
      maxlength: [1000, 'Review cannot exceed 1000 characters'],
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    avatar: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

reviewSchema.index({ isApproved: 1, createdAt: -1 });
reviewSchema.index({ rating: -1 });

module.exports = mongoose.model('Review', reviewSchema);
