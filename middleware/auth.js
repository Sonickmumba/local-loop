const authMiddleware = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Please log in.',
      redirect: '/login', // Optional: hint for frontend
    });
  }

  req.user = { userId: req.session.userId, email: req.session.email };
  next();
};

module.exports = authMiddleware;
