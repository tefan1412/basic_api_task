const HttpStatusCode = require('./httpStatusCode.js');
const AppError = require('./appError.js');

const sendErrorDev = (err, res) => {
    err.statusCode = err.statusCode || HttpStatusCode.INTERNAL_SERVER_ERROR;
    err.status = err.status || 'error';
    
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        error: err,
        stackTrack: err.stack
    })
}

const sendErrorProd = (err, res) => {
    if (err.isOperational) {
        err.statusCode = err.statusCode || HttpStatusCode.INTERNAL_SERVER_ERROR;
        err.status = err.status || 'error';

        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        })
    } else {
        res.status(err.statusCode).json({
            status: 'error',
            message: 'Something went wrong!'
        })
    }
}

const globalErrorHandler = (err, req, res, next) => {
    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV === 'production') {
        if (err.name === 'CastError') err = handleCastError(err);

        sendErrorProd(err, res);
    } else {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        })
    }
}

const handleCastError = (err) => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, HttpStatusCode.BAD_REQUEST);
}

module.exports = globalErrorHandler;