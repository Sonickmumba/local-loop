const express = require('express');
const authMiddleware = require('../middleware/auth');


const router = express.Router();

router.use(authMiddleware);

// - `GET /api/trades` - Get user's trades (protected)
// - `GET /api/trades/:id` - Get trade by ID (protected)
// - `POST /api/trades` - Create trade proposal (protected)
// - `PATCH /api/trades/:id/status` - Update trade status (protected)



module.exports = router;