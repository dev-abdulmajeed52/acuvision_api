// utils/generateToken.js
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/config');

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    jwtSecret,
    { expiresIn: '1d' }
  );
};

module.exports = generateToken;