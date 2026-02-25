const jwt = require('jsonwebtoken');
const config = require('../config');
const { AppError } = require('./errorHandler');

const auth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AppError('No token provided', 401, 401);
        }
        
        const token = authHeader.split(' ')[1];
        
        if (!token) {
            throw new AppError('No token provided', 401, 401);
        }
        
        const decoded = jwt.verify(token, config.jwt.secret);
        
        req.user = {
            userId: decoded.userId,
            phone: decoded.phone
        };
        
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return next(new AppError('Invalid token', 401, 401));
        }
        if (error.name === 'TokenExpiredError') {
            return next(new AppError('Token expired', 401, 401));
        }
        next(error);
    }
};

const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.split(' ')[1];
            if (token) {
                const decoded = jwt.verify(token, config.jwt.secret);
                req.user = {
                    userId: decoded.userId,
                    phone: decoded.phone
                };
            }
        }
        
        next();
    } catch (error) {
        next();
    }
};

const generateToken = (payload) => {
    return jwt.sign(payload, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
};

const verifyToken = (token) => {
    return jwt.verify(token, config.jwt.secret);
};

module.exports = {
    auth,
    optionalAuth,
    generateToken,
    verifyToken
};
