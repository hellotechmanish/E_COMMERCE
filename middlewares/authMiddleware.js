const jwt = require('jsonwebtoken');



// authMiddleware - Token validation
exports.authMiddleware = (req, res, next) => {
    const authHeader = req.header('Authorization');  // Token ko Authorization header se lena

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).send('Access Denied');  // Agar token nahi hai, toh "Access Denied"

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);  // Token verify karna
        req.user = verified;  // Verified user ka data req.user mein set karna
        next();  // Agle middleware ko call karna
    } catch (err) {
        res.status(400).send('Invalid Token');  // Agar token invalid ho, toh error dena
    }
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



