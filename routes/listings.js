const express = require('express');
const listingsController = require('../controllers/listingsController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// GET /api/listings - Get all listings (with filters)
router.get('/', listingsController.getAllListings);

// `GET /api/listings/:id` - Get listing by ID
router.get('/:id', listingsController.getListingsById);

// `GET /api/listings/user/:userId` - Get user's listings
router.get('/user/:userId', authMiddleware, listingsController.getUserListings);

// GET /api/listings/:listingId/similar - Get similar listings
router.get('/:listingId/similar', listingsController.getSimilarListings);

// `POST /api/listings` - Create listing (protected)
router.post('/', authMiddleware, listingsController.createListing);

// `PUT /api/listings/:id` - Update listing (protected)
router.put('/:id', authMiddleware, listingsController.updateListing);

// `DELETE /api/listings/:id` - Delete listing (protected)
router.delete('/:id', authMiddleware, listingsController.deleteListing);


module.exports = router;