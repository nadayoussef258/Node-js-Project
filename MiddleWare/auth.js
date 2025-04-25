const JWT = require('jsonwebtoken');
const User = require('../Models/User'); 

async function auth(req, res, next) {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ msg: 'Access Denied. No token provided' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = JWT.verify(token, 'PrivateKey');
    req.user = {
      _id: decoded.id,
      role: decoded.role,
      email: decoded.email
    };

    next();
  } catch (err) {
    console.error('Auth Error:', err);
    return res.status(401).json({ msg: 'Invalid or expired token' });
  }
}

module.exports = auth;