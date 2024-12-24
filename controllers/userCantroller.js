const User = require('../models/user'); // User model import
const Product = require('../models/Product');
const randomstring = require('randomstring');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


exports.home = async (req, res) => {
    res.json({
        "message": "this is home page"
    });
};

exports.getAllProducts = async (req, res) => {
    try {
        // Fetch all products from the database
        const products = await Product.find();

        // Check if products exist
        if (products.length === 0) {
            return res.status(404).json({
                status: 404,       // HTTP Status code in the response body
                message: "No products found"
            });
        }

        // Send a success response with the fetched products
        res.status(200).json({
            status: 200,       // HTTP Status code
            message: "Products fetched successfully",
            data: {
                products: products // List of products fetched
            }
        });

    } catch (err) {
        console.error("Error fetching products:", err.message);

        // Handle server error
        res.status(500).json({
            status: 500,
            message: "Server Error",
            error: err.message
        });
    }
};

exports.getProductById = async (req, res) => {
    const productId = req.params.id;
    console.log(productId);
    try {
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({
            message: 'Product fetched successfully',
            data: product
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

exports.signup = async (req, res) => {
    const { username, email, password, role } = req.body;

    try {
        // Check if user already exists
        let user = await User.findOne({ $or: [{ email }, { username }] });
        if (user) return res.status(400).json({ msg: 'User already exists' });

        // Create and save new user (password will be hashed by middleware)
        user = new User({ username, email, password, role: role || 'user' });
        await user.save();

        // Send success response with user data
        res.status(201).json({
            status: 200,
            message: 'User created successfully!',
            user: {
                userId: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
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
            token: token,
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
    // Decode the token to get user information
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (token) {
        blacklist.add(token); // yaha token ko distroy kar raha  hai  taki user ka information khatam jaye "logout" 
    }
    res.status(200).json({
        status: 200,
        message: "Logged out successfully!",
        user: {
            id: decoded.id,
            username: decoded.username
        }

    });
};

// Step 1: Send Password Reset Email
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ status: 404, message: 'User not found' });
        // Generate reset token using randomstring
        const resetToken = randomstring.generate(32); // Generate a random string of 32 characters
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        // Set reset token and expiry time
        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // Token valid for 15 minutes
        await user.save();

        // Send reset email
        const resetUrl = `${req.protocol}://${req.get('host')}/user/reset-password/${resetToken}`;
        await sendEmail(user.email, 'Password Reset Request', `Reset your password: ${resetUrl}`);

        res.status(200).json({ status: 200, message: 'Password reset email sent' });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: 500,
            message: 'Server error',
            error: err.message
        });
    }
};

// Helper function for sending emails
const sendEmail = async (to, subject, text) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail', // Replace with your email provider
        auth: {
            user: process.env.EMAIL_USER, // Add your email to env
            pass: process.env.EMAIL_PASS, // Add your email password to env
        },
    });
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
    });
};

// Step 2: Reset Password
exports.resetPassword = async (req, res) => {
    const { token } = req.params; // Token from the URL
    const { password } = req.body;

    try {
        // Hash the reset token and find the user
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }, // Check if token is still valid
        });

        if (!user) {
            return res.status(400).json({
                status: 400,
                message: 'Invalid or expired reset token',
            });
        }

        // Hash and update the password
        user.password = await bcrypt.hash(password, 10);
        user.resetPasswordToken = undefined; // Clear reset token
        user.resetPasswordExpires = undefined; // Clear token expiry
        await user.save();

        res.status(200).json({
            status: 200,
            message: 'Password reset successful',
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
exports.profile = async (req, res) => {
    const userId = req.user.userId;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'user not found' });
        }

        res.status(200).json({
            message: 'Welcome to your profile',
            user: {
                username: user.username,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });


    }



};


