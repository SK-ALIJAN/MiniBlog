const rateLimit = require('express-rate-limit');
const createHttpError = require('http-errors');
const httpStatus = require('http-status');
const { consoleLogger } = require('../config/log.config');

exports.sendVerificationEmailLimiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    max: 3, // Limit each IP to 3 requests per `window` (here, per 24 hours)
    message: 'You have exceeded the the limit, please try again after 24 hours', 
    keyGenerator: (req) => req.user.id,
    handler: (req, res, next) => {
      console.log('Rate limit exceeded'); // Log when the rate limit is exceeded
      next(createHttpError(httpStatus.CONFLICT, 'You have exceeded the the attempt limit, please try again after 24 hours'));
    },
    headers: true,
  });

exports.verifyEmailLimiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    max: 5, // Limit each IP to 3 requests per `window` (here, per 24 hours)
    message: 'You have exceeded the the limit, please try again after 24 hours', 
    handler: (req, res, next) => {
      console.log('Rate limit exceeded'); // Log when the rate limit is exceeded
      next(createHttpError(httpStatus.CONFLICT, 'You have exceeded the the attempt limit, please try again after 24 hours'));
    },
    headers: true,
  });