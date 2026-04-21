/**
 * Seed script — adds sample approved reviews to MongoDB
 * Run: node seed.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Review = require('./models/Review');

const sampleReviews = [
  {
    name: 'Priya Sharma',
    email: 'priya@example.com',
    rating: 5,
    service: 'Bridal Makeup',
    reviewText:
      'Poonam is an absolute magician with a brush! My bridal look was everything I dreamed of and more. She listened to every detail I shared and executed it flawlessly. My photos came out stunning and the makeup lasted the entire day. Highly recommend her to every bride!',
    isApproved: true,
    isFeatured: true,
  },
  {
    name: 'Aarti Patel',
    email: 'aarti@example.com',
    rating: 5,
    service: 'Party Makeup',
    reviewText:
      'I booked Poonam for my sister\'s sangeet and she transformed me completely! The smokey eye she created was bold yet elegant. Everyone kept asking who did my makeup. She is incredibly professional and makes you feel so comfortable throughout the session.',
    isApproved: true,
    isFeatured: true,
  },
  {
    name: 'Neha Kapoor',
    email: 'neha@example.com',
    rating: 5,
    service: 'Airbrush Makeup',
    reviewText:
      'The airbrush makeup was a game changer! My skin looked absolutely poreless and the finish was so natural yet perfectly polished. It lasted through 6 hours of dancing and celebration without any touch-ups. Worth every rupee!',
    isApproved: true,
    isFeatured: true,
  },
  {
    name: 'Sunita Mehta',
    email: 'sunita@example.com',
    rating: 4,
    service: 'Natural/Everyday Makeup',
    reviewText:
      'I wanted a fresh, dewy look for my pre-wedding shoot and Poonam nailed it! She understood exactly what I wanted — the no-makeup makeup look. My skin looked glowing and healthy in all the photos. Will definitely book again!',
    isApproved: true,
    isFeatured: false,
  },
  {
    name: 'Kavitha Reddy',
    email: 'kavitha@example.com',
    rating: 5,
    service: 'Editorial Makeup',
    reviewText:
      'Working with Poonam for our fashion campaign was a dream. She brought the creative vision to life with such precision and artistry. Her understanding of how makeup translates on camera is exceptional. Every model looked incredible.',
    isApproved: true,
    isFeatured: false,
  },
  {
    name: 'Ritu Singh',
    email: 'ritu@example.com',
    rating: 5,
    service: 'Bridal Makeup',
    reviewText:
      'I travelled from Delhi specifically to get my makeup done by Poonam and it was worth every bit of the journey! She created a traditional yet modern bridal look that perfectly matched my lehenga. My mother cried happy tears when she saw me. Thank you Poonam!',
    isApproved: true,
    isFeatured: true,
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await Review.deleteMany({});
    console.log('Cleared existing reviews');

    const inserted = await Review.insertMany(sampleReviews);
    console.log(`✅ Inserted ${inserted.length} sample reviews`);

    await mongoose.disconnect();
    console.log('Done!');
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  }
}

seed();
