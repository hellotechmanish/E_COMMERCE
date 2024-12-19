const User = require('../models/user'); // User model import
const bcrypt = require('bcryptjs'); // bcrypt for hashing passwords
const jwt = require('jsonwebtoken'); // jwt for generating tokens

exports.signup = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if user already exists
        let user = await User.findOne({ $or: [{ email }, { username }] });
        if (user) return res.status(400).json({ msg: 'User already exists' });

        // Create and save new user (password will be hashed by middleware)
        user = new User({ username, email, password });
        await user.save();

        // Send success response with user data
        res.status(201).json({
            status: 200,
            message: 'User created successfully!',
            user: {
                userId: user._id,
                username: user.username,
                email: user.email,
                createdAt: user.createdAt,
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: 500,
            message: 'Internal Server Error',
            error: err.message,
        });
    }
};



exports.login = async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password);

    try {
        // Check if the user exists in the database
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                status: 404,
                message: 'User not found',
            });
        }

        // Compare the provided password with the hashed password using the comparePassword method
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                status: 401,
                message: 'Invalid email or password',
            });
        }

        // Generate JWT token using the generateAuthToken method
        const token = user.generateAuthToken();

        // Send success response
        res.status(200).json({
            status: 200,
            message: 'Login successful',
            username: user.username,
            // token: token,
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: 500,
            message: 'Server error',
            error: err.message,
        });
    }
};

const blacklist = new Set(); // Example: You can use Redis or a database for production

exports.logout = (req, res) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (token) {
        blacklist.add(token); // Add token to the blacklist
    }
    res.status(200).json({
        status: 200,
        message: "Logged out successfully!"
    });
};


