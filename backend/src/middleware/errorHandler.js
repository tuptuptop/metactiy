const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);
    
    if (err.name === 'UnauthorizedError') {
        return res.error('Unauthorized access', 401, 401);
    }
    
    if (err.name === 'ValidationError') {
        return res.error(err.message, 400, 400);
    }
    
    if (err.name === 'SyntaxError' && err.status === 400 && 'body' in err) {
        return res.error('Invalid JSON format', 400, 400);
    }
    
    if (err.code === 'ER_DUP_ENTRY') {
        return res.error('Data already exists', 409, 409);
    }
    
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
        return res.error('Referenced data not found', 400, 400);
    }
    
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    const code = err.code || -1;
    
    return res.status(statusCode).json({
        code,
        message,
        data: null,
        timestamp: new Date().toISOString(),
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

class AppError extends Error {
    constructor(message, statusCode = 400, code = -1) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = errorHandler;
module.exports.AppError = AppError;
