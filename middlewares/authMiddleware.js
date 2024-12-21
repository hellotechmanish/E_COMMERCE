const jwt = require('jsonwebtoken');



exports.authMiddleware = (req, res, next) => {
    const token = req.header('Authorization');
    // console.log('Authorization Header:', token);
    if (!token) return res.status(401).send('Access Denied');

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).send('Invalid Token');
    }
};

exports.rolecheck = (roles) => {
    return (req, res, next) => {
        console.log('User from JWT:', req.user);
        try {
            // Assuming req.user is set after successful authentication (via JWT, for example)
            if (!req.user) {
                return res.status(401).json({ message: 'Unauthorized. Please log in.' });
            }

            // Check if the user's role is allowed
            if (!roles.includes(req.user.role)) {
                return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
            }

            // User role is valid, proceed to the next middleware
            next();
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Server error', error: err.message });
        }
    };
};

