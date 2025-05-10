const jwt = require('jsonwebtoken');
const moment = require('moment');
const config = require('../config/index');

const generateToken = (userId, expires, secret = config.jwtSecret) => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
  };
  return jwt.sign(payload, secret);
};

const verifyToken = async (token) => {
  const payload = jwt.verify(token, config.jwtSecret);
  if (!payload) {
    throw new Error('Token not found');
  }
  return payload;
};

const generateAuthTokens = async (user) => {
  const accessTokenExpires = moment().add(config.jwtExpirationDays, 'days');
  const accessToken = generateToken(user.id, accessTokenExpires);
  
  return {
    token: accessToken,
    expires: accessTokenExpires.toDate(),
  };
};

module.exports = {
  generateToken,
  verifyToken,
  generateAuthTokens,
};
