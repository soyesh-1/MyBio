const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Optional: if you want to check if user still exists

const protect = async (req, res, next) => {
    let token;

    // Tokens are usually sent in the Authorization header, formatted as "Bearer <token>"
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header (split "Bearer <token>" and take the token part)
            token = req.headers.authorization.split(' ')[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Get user from the token's payload (we stored user.id in the payload)
            // You could also fetch the user from DB here to ensure they still exist and are active
            // For simplicity now, we'll just use the decoded payload.
            req.user = decoded.user; // Attach user information to the request object

            next(); // Move to the next middleware or route handler
        } catch (error) {
            console.error('Token verification failed:', error.message);
            res.status(401).json({ msg: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        res.status(401).json({ msg: 'Not authorized, no token' });
    }
};

// Optional: Middleware to check if the user is an admin
const adminOnly = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(403).json({ msg: 'Not authorized as an admin' }); // 403 Forbidden
    }
};


module.exports = { protect, adminOnly };