const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

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
    message = 'Constraint violation';
  }

  // Invalid input syntax (e.g. bad UUID)
  if (err.code === '22P02') {
    statusCode = 400;
    message = 'Invalid input format';
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;