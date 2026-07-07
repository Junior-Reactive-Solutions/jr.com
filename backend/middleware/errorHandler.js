const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
    logger.error({ err }, 'Unhandled request error');

    let error = { ...err };
    error.message = err.message;

    if (err.name === 'ConnectionError' || err.name === 'RequestError') {
        error.message = 'Database error occurred';
        error.statusCode = 500;
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error'
    });
};

module.exports = errorHandler;