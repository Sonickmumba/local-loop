const pool = require('../config/db');



// - Create trade proposal
exports.createTrade = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { listingId, ownerId, requesterOffer, tradeDate, tradeTime, location, notes } = req.body;
    } catch (error) {
        
    }
}