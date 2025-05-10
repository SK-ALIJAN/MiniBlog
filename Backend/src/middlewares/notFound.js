const httpStatus = require('http-status');

const notFoundHandler = (req, res) => {
    return res.status(httpStatus.NOT_FOUND).json({success: false, message: "Invalid Url"})
}

module.exports = notFoundHandler;