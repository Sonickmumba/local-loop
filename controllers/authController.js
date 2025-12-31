const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const pool = require('../config/db');
const { generateId } = require('../utils/helpers');

// register user
exports.register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, password, phone, neighborhood, interests } = req.body;

    // check if the user already exists
    const existingUsers = await pool.query(
      `SELECT FROM users WHERE email = $1 OR phone = $2`,
      [email, phone]
    );

    const users = existingUsers.rows;

    if (users.length > 0) {
      return res
        .status(400)
        .send('User with this email or phone already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // create user in the database
    const userId = generateId();
    await pool.query(
      `INSERT INTO users (id, name, email, password_hash, phone, neighborhood) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [userId, name, email, passwordHash, phone, neighborhood]
    );

    // Add user interests if provided
    if (interests && interests.length > 0) {
      const interestValues = interests.map((interestId) => [
        userId,
        interestId,
      ]);
      console.log(interestValues);
      await pool.query(
        `INSERT INTO user_interests (user_id, interest_id) VALUES ($1)`,
        [interestValues]
      );
    }

    // Generate JWT token
    const token = jwt.sign({ userId, email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        userId,
        name,
        email,
        token,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error registering user.');
  }
};

// Login user
exports.login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;

    // Find user
    const result = await pool.query(
      'SELECT id, name, email, password_hash FROM users WHERE email = $1',
      [email]
    );

    if (result.rowCount === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const user = result.rows[0];

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // Set token in HTTP-only cookie just addded here
    res.cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        userId: user.id,
        name: user.name,
        email: user.email,
        // removed token from response body
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get user by ID
exports.getUserById = async (req, res, next) => {
  try {
    const userId = req.params.userId;

    // Fetch user
    const userResult = await pool.query(
      `SELECT id, name, email, phone, neighborhood, location_lat, location_lng,
              profile_image_url, rating, total_ratings, completed_trades, created_at
       FROM users
       WHERE id = $1`,
      [userId]
    );

    if (userResult.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const user = userResult.rows[0];

    // Fetch user interests
    const interestsResult = await pool.query(
      `SELECT i.id, i.name, i.emoji
       FROM interests i
       JOIN user_interests ui ON i.id = ui.interest_id
       WHERE ui.user_id = $1`,
      [userId]
    );

    user.interests = interestsResult.rows;

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// Get current user
exports.getCurrentUser = async (req, res, next) => {
  try {
    // Fetch user
    const userResult = await pool.query(
      `SELECT id, name, email, phone, neighborhood, location_lat, location_lng,
              profile_image_url, rating, total_ratings, completed_trades, created_at
       FROM users
       WHERE id = $1`,
      [req.user.userId]
    );

    if (userResult.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const user = userResult.rows[0];

    // Fetch user interests
    const interestsResult = await pool.query(
      `SELECT i.id, i.name, i.emoji
       FROM interests i
       JOIN user_interests ui ON i.id = ui.interest_id
       WHERE ui.user_id = $1`,
      [req.user.userId]
    );

    user.interests = interestsResult.rows;

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

exports.logout = (req, res) => {
  res.clearCookie('access_token', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });

  res.json({ success: true, message: 'Logged out' });
};

