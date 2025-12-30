const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    // Get token from header
    // const token = req.headers.authorization?.split(' ')[1]; // Bearer TOKEN
    const token = req.cookies.access_token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { userId, email }
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired.'
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Invalid token.'
    });
  }
};




// const jwt = require('jsonwebtoken');

// module.exports = (req, res, next) => {
//   const token = req.cookies.access_token;

//   if (!token) {
//     return res.status(401).json({ message: 'Not authenticated' });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch {
//     return res.status(401).json({ message: 'Invalid token' });
//   }
// };


module.exports = authMiddleware;