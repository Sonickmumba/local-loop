require('dotenv').config();
const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');


// imports routes here
const authRoutes = require('./routes/auth');
const conversationsRoutes = require('./routes/conversations');
const listingsRoutes = require('./routes/listings');
const notificationsRoutes = require('./routes/notifications');
const reviewsRoutes = require('./routes/reviews');
const tradesRoutes = require('./routes/trades');
const otpRoutes = require('./routes/otp');

const app = express();
const PORT = process.env.PORT || 3000;

// middleware here
app.use(cookieParser());
app.use(
  cors({
    // origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    origin: 'http://localhost:5173',
    credentials: true,
  })
);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.urlencoded({ extended: true }));

// Request logging out so that one knows the url
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check if app running
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'LocalLoop API is running',
    timestamp: new Date().toISOString(),
  });
});

app.get('/', (req, res) => {
  res.json({
    info: 'Node.js, Express, and Postgres API Template by Sonick Mumba',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/conversations', conversationsRoutes);
app.use('/api/listings', listingsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/trades', tradesRoutes);
app.use('/api/auth/otp', otpRoutes);


// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handler (must be last)
app.use(errorHandler);
console.log('JWT_SECRET:', process.env.JWT_SECRET);

app.listen(PORT, () => {
  console.log('=================================');
  console.log(`🚀 LocalLoop API Server is running at http://localhost:${PORT}.`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('=================================');
});
