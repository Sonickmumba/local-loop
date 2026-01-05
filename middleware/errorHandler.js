const errorHandler = (err, req, res, next) => {
  // Log full error details for debugging (server-side only)
  console.error('Error:', err);

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Don't expose database error details in production
  if (process.env.NODE_ENV === 'production') {
    // Unique violation (duplicate key)
    if (err.code === '23505') {
      statusCode = 409;
      message = 'Resource already exists';
    }

    // Foreign key violation
    if (err.code === '23503') {
      statusCode = 404;
      message = 'Referenced resource not found';
    }

    // Not-null violation
    if (err.code === '23502') {
      statusCode = 400;
      message = 'Missing required field';
    }

    // Check constraint violation
    if (err.code === '23514') {
      statusCode = 400;
      message = 'Invalid data provided';
    }

    // Invalid input syntax (e.g. bad UUID)
    if (err.code === '22P02') {
      statusCode = 400;
      message = 'Invalid input format';
    }

    // For any other database errors, return generic message
    if (err.code && err.code.startsWith('23')) {
      statusCode = 400;
      message = 'Invalid request data';
    }
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;

module.exports = errorHandler;