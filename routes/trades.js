const express = require('express');
const authMiddleware = require('../middleware/auth');
const tradesController = require('../controllers/tradesController');


const router = express.Router();

router.use(authMiddleware);

// - `GET /api/trades` - Get user's trades (protected)
router.get('/', tradesController.getUserTrades);

// - `GET /api/trades/:id` - Get trade by ID (protected)
router.get('/:id', tradesController.getTradeById);

// - `POST /api/trades` - Create trade proposal (protected)
router.post('/', tradesController.createTrade);

// - `PATCH /api/trades/:id/status` - Update trade status (protected)
router.patch('/:id/status', tradesController.updateTradeStatus);



module.exports = router;