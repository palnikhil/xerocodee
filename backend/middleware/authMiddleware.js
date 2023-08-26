const jwt = require('jsonwebtoken');
const config = require('../config/config');
let authMiddleware = new Object();
JWT_SECRET = config.app.JWT_SECRET;

authMiddleware.verifyToken= (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  console.log(token)
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log(err);
      return res.status(401).json({ message: 'Invalid token' });
    }
    req.user = decoded;
    console.log(decoded);
    next();
  });
};

module.exports = authMiddleware;