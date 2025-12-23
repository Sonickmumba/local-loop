const { validationResult } = require('express-validator');
const pool = require('../config/db');
const { generateId, calculateDistance, timeAgo } = require('../utils/helpers');

// Get all listings (with filters)
exports.getAllListings = async (req, res, next) => {
  try {
    const { type, category, status, search, lat, lng, radius } = req.query;

    let query = `
      SELECT
        l.*,
        u.name AS author_name,
        u.neighborhood,
        u.rating AS author_rating,
        u.location_lat AS author_lat,
        u.location_lng AS author_lng
      FROM listings l
      JOIN users u ON l.user_id = u.id
      WHERE 1 = 1
    `;

    const params = [];
    let idx = 1;

    if (type) {
      query += ` AND l.type = $${idx++}`;
      params.push(type);
    }

    if (category) {
      query += ` AND l.category = $${idx++}`;
      params.push(category);
    }

    if (status) {
      query += ` AND l.status = $${idx++}`;
      params.push(status);
    } else {
      query += ` AND l.status = $${idx++}`;
      params.push('active');
    }

    if (search) {
      query += `
        AND (
          l.title ILIKE $${idx}
          OR l.description ILIKE $${idx}
        )
      `;
      params.push(`%${search}%`);
      idx++;
    }

    query += ` ORDER BY l.created_at DESC`;

    const { rows: listings } = await pool.query(query, params);

    // Distance calculation (JS-based, same as original)
    if (lat && lng) {
      const userLat = parseFloat(lat);
      const userLng = parseFloat(lng);

      listings.forEach(listing => {
        if (listing.location_lat && listing.location_lng) {
          const distance = calculateDistance(
            userLat,
            userLng,
            parseFloat(listing.location_lat),
            parseFloat(listing.location_lng)
          );
          listing.distance = Number(distance.toFixed(1));
        }
      });

      if (radius) {
        const r = parseFloat(radius);
        listings = listings.filter(
          l => typeof l.distance === 'number' && l.distance <= r
        );
      }
    }

    // Time ago
    listings.forEach(listing => {
      listing.timeAgo = timeAgo(listing.created_at);
    });

    res.json({
      success: true,
      count: listings.length,
      data: listings
    });
  } catch (error) {
    next(error);
  }
};

// Get listing by ID
exports.getListingsById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const listingsResult = await pool.query(`
            SELECT l.*, u.name AS authors_name, u.neighborhood, u.rating as author_rating,
              u.completed_trades, u.location_lat, u.location_lng
              FFROM listings l JOIN users u ON l.user_id = u.id
              WHERE l.id = $1
            `, [id]);
        
         const listings = listingsResult.rows;
         
         if (listing.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Listing not found!"
            });
         }
         
         const listing = listings.rows[0];
        listing.timeAgo = timeAgo(listing.created_at);

        res.json({
            success: true,
            data: listing
        });
    } catch (error) {
        next(error);
    }
};

// Create listing
exports.createListing = async (req, res, next) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
            success: false,
            errors: errors.array()
            });
        }

        const {type, category, title, description, location_lat, location_lng, image_url} = req.body;
        userId = req.user.userId;

        const listingId = generateId();

        await pool.query(`INSERT INTO listings (id, user_id, type, category, title, description, location_lat, location_lng, image_url) VALUES ($1,$2, $3, $4, $5, $6, $7)`,[listingId, userId, type, category, title, description, location_lat, location_lng, image_url]);

        const newListingResult = await pool.query(`SELECT * FROM listings WHERE id = $1`, [listingId]); 

        res.status(201).json({
            success: true,
            message: "Listing created successfully",
            data: newListingResult.rows[0]
        });

    } catch (error) {
        next(error);
    }
}

// Update listing

exports.updateListing = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, description, status, image_url } = req.body;
        const userId = req.user.userId;

        // verify if listing already exist and belongs to the user

        const listingToUpdateResult = await pool.query(`SELECT * FROM listings WHERE id = $1 AND user_id = $2`, [id, userId]);

        listingResult = listingToUpdateResult.rows;

        if (listingResult.length === 0) {
            return res.json({
                success: false,
                message: "Listing not found or you are not authorised"
            });
        }

        const updates = [];
        const params = [];
        let idx = 1;

        if (title) {
            updates.push(`title = $${idx++}`);
            params.push(title);
        }

        if (description) {
            updates.push(`description = $${idx++}`);
            params.push(description);
        }

        if (status) {
            updates.push(`status = $${idx++}`);
            params.push(status);
        }

        if (image_url) {
            updates.push(`image_url = $${idx++}`);
            params.push(image_url);
        }

        if (updates.length > 0) {
            params.push(id);

            await pool.query(
                `UPDATE listings
                SET ${updates.join(', ')}
                WHERE id = $${idx}`,
                params
            );
        }

        const { rows } = await pool.query(
        `SELECT * FROM listings WHERE id = $1`,
        [id]
        );

        const updatedListing = rows[0];


        res.json({
            success: true,
            message: 'Listing updated successfully',
            data: updatedListing
        });
    } catch (error) {
        next(error);
    }
}

// Delete listing

exports.deleteListing = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // verify if the lisiting to delete exists
    const listingToDeleteResult = await pool.query(`SELECT * FROM listings WHERE id = $1 AND user_id = $2`, [id, userId]);

    const listingToDelete = listingToDeleteResult.rows;

    if (listingToDelete.length === 0) {
      return res.status().json({
        success: false,
        message: "Listing does not exist or  unauthorised"
      })
    }

    await pool.query(`DELETE FROM listings WHERE id = $1 AND user_id = $2`, [id, userId]);

    res.json({
      success: true,
      message: 'Listing deleted successfully'
    });

  } catch (error) {
      next(error);
  }
}


// Get user's listings
exports.getUserListings = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const userListingsResult = await pool.query(`SELECT l.*, u.name as author_name FROM listings l JOIN users u ON l.user_id = u.id WHERE l.user_id = $1 ORDER BY l.created_at DESC`, [userId]);

    const userListings = userListingsResult.rows;

    userListings.forEach(listing => {
      listing.timeAgo = timeAgo(listing.created_at);
    });

    res.json({
      success: true,
      count: listings.length,
      data: userListings
    });
  } catch (error) {
      next(error);
  }
};




