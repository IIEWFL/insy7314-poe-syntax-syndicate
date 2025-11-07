// authenticateToken.js
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const header = req.header('Authorization') || '';
  if (!header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied, token missing!' });
  }
  const token = header.slice(7);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
}

module.exports = authenticateToken;

