const express = require('express');
const authMiddleware = require('../middleware/auth');
const reviewsController = require('../controllers/reviewsController');



const router = express.Router();

// - `POST /api/reviews` - Create review (protected)
router.post('/', authMiddleware, reviewsController.createReview);

// - `GET /api/reviews/user/:userId` - Get user's reviews
router.get('/user/:userId', authMiddleware,reviewsController.getUserReviews);


module.exports = router;