const { validationResult } = require('express-validator');
const pool = require('../config/db');
const { generateId, calculateDistance, timeAgo } = require('../utils/helpers');
const { createNotification } = require('./notificationsController');

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
        u.location_lat,
        u.location_lng,
        COALESCE(conversation_counts.conversation_count, 0) as responses_count
      FROM listings l
      JOIN users u ON l.user_id = u.id
      LEFT JOIN (
        SELECT listing_id, COUNT(*) as conversation_count 
        FROM conversations 
        GROUP BY listing_id
      ) conversation_counts ON l.id = conversation_counts.listing_id
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

    let { rows: listings } = await pool.query(query, params);
    
    // Determine reference location (viewer context)
    let refLat = null;
    let refLng = null;

    // Search-provided reference (highest priority)
    if (lat && lng) {
      refLat = parseFloat(lat);
      refLng = parseFloat(lng);
    }
    // Fallback: authenticated user location
    else if (req.user?.location_lat && req.user?.location_lng) {
      refLat = parseFloat(req.user.location_lat);
      refLng = parseFloat(req.user.location_lng);
    }

    // Distance calculation (JS-based, same as original)

    // if (lat && lng) {
    //   const userLat = parseFloat(lat);
    //   const userLng = parseFloat(lng);

    //   listings.forEach((listing) => {
    //     if (listing.location_lat && listing.location_lng) {
    //       const distance = calculateDistance(
    //         userLat,
    //         userLng,
    //         parseFloat(listing.location_lat),
    //         parseFloat(listing.location_lng)
    //       );
    //       listing.distance = Number(distance.toFixed(1));
    //     }
    //   });

    //   if (radius) {
    //     const r = parseFloat(radius);
    //     listings = listings.filter(
    //       (l) => typeof l.distance === 'number' && l.distance <= r
    //     );
    //   }
    // }



    if (refLat !== null && refLng !== null) {
      listings.forEach((listing) => {
        if (listing.location_lat && listing.location_lng) {
          const distance = calculateDistance(
            refLat,
            refLng,
            parseFloat(listing.location_lat),
            parseFloat(listing.location_lng)
          );
          listing.distance = Number(distance.toFixed(1));
        } else {
          listing.distance = null;
        }
      });

      if (radius) {
        const r = parseFloat(radius);
        listings = listings.filter(
          (l) => typeof l.distance === 'number' && l.distance <= r
        );
      }
    }

    // Time ago
    listings.forEach((listing) => {
      listing.timeAgo = timeAgo(listing.created_at);
    });

    res.json({
      success: true,
      count: listings.length,
      data: listings,
    });
  } catch (error) {
    next(error);
  }
};

// Get listing by ID
exports.getListingsById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const listingsResult = await pool.query(
      `
            SELECT l.*, u.name AS authors_name, u.neighborhood, u.rating as author_rating,
              u.completed_trades, u.location_lat, u.location_lng,
              COALESCE(conversation_counts.conversation_count, 0) as responses_count
              FROM listings l 
              JOIN users u ON l.user_id = u.id
              LEFT JOIN (
                SELECT listing_id, COUNT(*) as conversation_count 
                FROM conversations 
                GROUP BY listing_id
              ) conversation_counts ON l.id = conversation_counts.listing_id
              WHERE l.id = $1
            `,
      [id]
    );

    const listings = listingsResult.rows;

    if (listings.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found!',
      });
    }

    const listing = listings[0];
    listing.timeAgo = timeAgo(listing.created_at);

    res.json({
      success: true,
      data: listing,
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
        errors: errors.array(),
      });
    }

    const {
      type,
      category,
      title,
      description,
      location_lat,
      location_lng,
      image_url,
    } = req.body;

    const userId = req.user.id;

    const listingId = generateId();

    await pool.query(
      `INSERT INTO listings (id, user_id, type, category, title, description, location_lat, location_lng, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        listingId,
        userId,
        type,
        category,
        title,
        description,
        location_lat,
        location_lng,
        image_url,
      ]
    );

    const newListingResult = await pool.query(
      `SELECT 
        l.*,
        u.name AS author_name,
        u.neighborhood,
        u.rating AS author_rating,
        u.location_lat,
        u.location_lng,
        COALESCE(conversation_counts.conversation_count, 0) as responses_count
      FROM listings l
      JOIN users u ON l.user_id = u.id
      LEFT JOIN (
        SELECT listing_id, COUNT(*) as conversation_count 
        FROM conversations 
        GROUP BY listing_id
      ) conversation_counts ON l.id = conversation_counts.listing_id
      WHERE l.id = $1`,
      [listingId]
    );

    const listing = newListingResult.rows[0];
    console.log('first-listing',listing)

    // Add timeAgo
    listing.timeAgo = timeAgo(listing.created_at);

    // Set default distance for newly created listings (assume nearby)
    listing.distance = 0;

    // 🔴 EMIT REAL-TIME EVENT
    const io = req.app.get('io');
    io.emit('listing:new', listing);

    // Create notifications for users in the same neighborhood
    try {
      const nearbyUsersResult = await pool.query(
        `SELECT id, name FROM users 
         WHERE neighborhood = $1 AND id != $2 
         LIMIT 10`, // Limit to prevent too many notifications
        [listing.neighborhood, userId]
      );

      const nearbyUsers = nearbyUsersResult.rows;
      for (const nearbyUser of nearbyUsers) {
        await createNotification(
          nearbyUser.id,
          'listing',
          'New listing in your area',
          `${listing.title} - ${listing.description.substring(0, 50)}...`,
          listingId
        );
      }
    } catch (notificationError) {
      console.error('Error creating notifications:', notificationError);
      // Don't fail the listing creation if notifications fail
    }

    console.log('last listing:',listing)

    res.status(201).json({
      success: true,
      message: 'Listing created successfully',
      data: listing,
    });
  } catch (error) {
    next(error);
  }
};

// Update listing

exports.updateListing = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, status, image_url } = req.body;
    const userId = req.user.id;

    // verify if listing already exist and belongs to the user

    const listingToUpdateResult = await pool.query(
      `SELECT * FROM listings WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );

    listingResult = listingToUpdateResult.rows;

    if (listingResult.length === 0) {
      return res.json({
        success: false,
        message: 'Listing not found or you are not authorised',
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

    const { rows } = await pool.query(`SELECT * FROM listings WHERE id = $1`, [
      id,
    ]);

    const updatedListing = rows[0];

    res.json({
      success: true,
      message: 'Listing updated successfully',
      data: updatedListing,
    });
  } catch (error) {
    next(error);
  }
};

// Delete listing

exports.deleteListing = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // verify if the lisiting to delete exists
    const listingToDeleteResult = await pool.query(
      `SELECT * FROM listings WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );

    const listingToDelete = listingToDeleteResult.rows;

    if (listingToDelete.length === 0) {
      return res.status().json({
        success: false,
        message: 'Listing does not exist or  unauthorised',
      });
    }

    await pool.query(`DELETE FROM listings WHERE id = $1 AND user_id = $2`, [
      id,
      userId,
    ]);

    res.json({
      success: true,
      message: 'Listing deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// Get user's listings
exports.getUserListings = async (req, res, next) => {
  try {
    let userId = req.params.userId;

    // Resolve "me"
    if (userId === 'me') {
      userId = req.user.id;
    }

    const userListingsResult = await pool.query(
      `SELECT l.*, u.name as author_name FROM listings l JOIN users u ON l.user_id = u.id WHERE l.user_id = $1 ORDER BY l.created_at DESC`,
      [userId]
    );

    const userListings = userListingsResult.rows;

    userListings.forEach((listing) => {
      listing.timeAgo = timeAgo(listing.created_at);
    });

    res.json({
      success: true,
      count: userListings.length,
      data: userListings,
    });
  } catch (error) {
    next(error);
  }
};

exports.getSimilarListings = async (req, res, next) => {
  try {
    const { listingId } = req.params;

    // Get reference listing WITH neighborhood
    const referenceResult = await pool.query(
      `
      SELECT 
        l.category,
        l.type,
        l.user_id,
        u.neighborhood
      FROM listings l
      JOIN users u ON l.user_id = u.id
      WHERE l.id = $1
      `,
      [listingId]
    );

    if (referenceResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found',
      });
    }

    const { category, type, neighborhood, user_id } = referenceResult.rows[0];

    // 2. Fetch similar listings
    const similarResult = await pool.query(
      `
      SELECT
        l.id,
        l.title,
        l.category,
        u.neighborhood
      FROM listings l
      JOIN users u ON l.user_id = u.id
      WHERE l.category = $1
        AND l.type = $2
        AND l.id <> $3
        AND l.user_id <> $4
        AND l.status = 'active'
      ORDER BY
        (u.neighborhood = $5) DESC,
        l.created_at DESC
      LIMIT 5
      `,
      [category, type, listingId, user_id, neighborhood]
    );

    res.json({
      success: true,
      data: similarResult.rows,
    });
  } catch (error) {
    next(error);
  }
};
