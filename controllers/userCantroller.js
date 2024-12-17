const User = require('../models/user'); // User model import
const bcrypt = require('bcryptjs'); // bcrypt for hashing passwords
const jwt = require('jsonwebtoken'); // jwt for generating tokens

exports.signup = async (req, res) => {
    const { username, email, password } = req.body;
    // console.log(username);

    // Check if user already exists (either by username or email)
    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
        return res.status(400).json({ msg: 'User already exists' });
    }

    try {
        // Hash the password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user instance with hashed password
        user = new User({ username, email, password: hashedPassword });
        await user.save();

        // Generate JWT token for user authentication
        const token = jwt.sign(
            { userId: user._id },
            'yourSecretKey', // Use environment variable for secret key
            { expiresIn: '1h' }
        );

        // Send success response with token and user data
        res.status(201).json({
            status: 200,
            message: 'User created successfully!',
            // token: token,
            user: {
                userId: user._id,
                username: user.username,
                email: user.email,
                createdAt: user.createdAt
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error', error: err.message });
    }
};


exports.login = (req, res) => {
    // Login logic
};