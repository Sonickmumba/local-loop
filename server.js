const express = require('express');
const cors = require('cors');
require("dotenv").config;
const errorHandler = require('./middleware/errorHandler')
const bodyParser = require('body-parser');


// imports routes
const userRoutes = require('./routes/userRoutes');





const app = express();
const PORT = process.env.DB_PORT || 3000;


// middleware
app.use(bodyParser.json());
// app.use(cors());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(bodyParser.urlencoded({ extended: true }));


// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'LocalLoop API is running',
    timestamp: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.json({ info: 'Node.js, Express, and Postgres API Template by Sonick Mumba' });
});

// API Routes
app.use('/api', userRoutes);



// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});


// Error handler (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log('=================================');
  console.log(`🚀 LocalLoop API Server`);
  console.log(`🚀 Server is running at http://localhost:${PORT}.`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('=================================');
});
