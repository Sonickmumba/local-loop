require('dotenv').config();
const express = require('express');

const http = require('http');
const { Server } = require('socket.io');

const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const securityHeaders = require('./middleware/securityHeaders');
const { apiLimiter } = require('./middleware/rateLimiting');

// imports routes here
const authRoutes = require('./routes/auth');
const conversationsRoutes = require('./routes/conversations');
const listingsRoutes = require('./routes/listings');
const notificationsRoutes = require('./routes/notifications');
const reviewsRoutes = require('./routes/reviews');
const tradesRoutes = require('./routes/trades');
const otpRoutes = require('./routes/otp');

const app = express();
const server = http.createServer(app);
/* ======================
   SOCKET.IO SETUP
====================== */
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    credentials: true,
  },
});

// Make io available to routes if needed
app.set('io', io);

// middleware here
app.use(securityHeaders);
app.use(apiLimiter);
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
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

/* ======================
   SOCKET EVENTS
====================== */
io.on('connection', (socket) => {
  console.log('🟢 Socket connected:', socket.id);

  socket.on('join-conversation', (conversationId, ack) => {
    socket.join(conversationId);
    console.log(`Socket ${socket.id} joined conversation ${conversationId}`);
    if (ack) ack(true);
  });

  socket.on('send-message', ({ conversationId, message }) => {
    io.to(conversationId).emit('new-message', message);
  });

  socket.on('disconnect', () => {
    console.log('🔴 Socket disconnected:', socket.id);
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Error handler (must be last)
app.use(errorHandler);

/* ======================
   START SERVER
====================== */
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log('=================================');
  console.log(
    `🚀 LocalLoop API Server is running at http://localhost:${PORT}.`
  );
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('=================================');
});
