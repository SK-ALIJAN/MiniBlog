const createError = require("http-errors");
const httpStatus = require("http-status");
const { verifyToken } = require("../services/token.service");

const authenticateUser = async (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            return next(
                createError(httpStatus.UNAUTHORIZED, "Authentication Failed")
            );
        }
        const token = req.headers.authorization.split(" ")[1];
        const payload = await verifyToken(token);
        if (!payload) {
            next(createError(httpStatus.UNAUTHORIZED, error.message));
        }
        req.user = payload;
        next();
    } catch (error) {
        next(createError(httpStatus.UNAUTHORIZED, error.message));
    }
};

module.exports = authenticateUser;
