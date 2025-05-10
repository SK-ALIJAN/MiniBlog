const jwt = require('jsonwebtoken');
const config = require('../config');
const createError = require('http-errors');
const { consoleLogger } = require('../config/log.config');
const httpStatus = require('http-status');

exports.genToken = async (payload, exp = `${config.jwtExpirationDays} days`) => {
    try {
        const token = await jwt.sign(payload, config.jwtSecret, { expiresIn: exp});
        return token;
    } catch (error) {
        throw createError(500, error.message)
    }
}

exports.verifyToken = async (token) => {
    try {
        const payload = await jwt.verify(token, config.jwtSecret);
        return payload;
    } catch (error) {
        // throw createError(401, 'Authentication Failed');
        throw createError(httpStatus.UNAUTHORIZED, 'Authentication failed')
    }
}