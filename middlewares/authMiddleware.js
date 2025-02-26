const jwt = require('jsonwebtoken');
const blacklist = new Set();  // Token blacklist



// authMiddleware - Token validation
exports.authMiddleware = (req, res, next) => {
    const authHeader = req.header('Authorization'); //header se token lana h

    // Check if Authorization header is missing
    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header missing. Please log in.' });
    }

    // Handle Bearer token correctly
    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Token not found in Authorization header' });
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid or expired token' });
    }

};

// ye check karege ki token expire toh nhi 
exports.isTokenBlacklisted = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (blacklist.has(token)) {
        return res.status(401).json({ message: 'Unauthorized: Token has been invalidated' });
    }
    next();
};


// rolecheck - Role-based access control
exports.rolecheck = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized. Please log in.' });  // Agar user nahi hai, toh Unauthorized
        }

        // Agar user ka role required roles mein nahi hai
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
        }

        next();  // Role valid hai, toh next middleware ko call karna
    };
};



// Blacklist ko export karna (logout ke liye)
exports.blacklist = blacklist;