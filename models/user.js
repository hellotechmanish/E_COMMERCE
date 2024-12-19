const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Define the user schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,  // Username is required
        unique: true,    // Ensures no duplicate usernames
        trim: true,      // Removes spaces from start and end
    },
    email: {
        type: String,
        required: true,  // Email is required
        unique: true,    // Ensures no duplicate emails
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address.'], // Validates email format
    },
    password: {
        type: String,
        required: true,  // Password is required
        minlength: [6, 'Password should be at least 6 characters long'],  // Password length validation
    },
    createdAt: {
        type: Date,
        default: Date.now,  // Set creation date by default
    },
});

// Hash password before saving to the database
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next(); // Only hash if password is modified
    this.password = await bcrypt.hash(this.password, 10);  // Salt and hash the password
    next();
});

// Method to compare entered password with hashed password
userSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
};

// Method to generate a JWT token
userSchema.methods.generateAuthToken = function () {
    const payload = { userId: this._id, username: this.username };  // Payload data for the token
    const secretKey = process.env.JWT_SECRET || 'your_secret_key'; // Secret key for encoding the token
    const options = { expiresIn: '1h' };  // Token expiration time
    return jwt.sign(payload, secretKey, options);  // Generate and return the token
};

const isTokenBlacklisted = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (blacklist.has(token)) {
        return res.status(401).json({ message: 'Unauthorized: Token has been invalidated' });
    }
    next();
};


// Create the model and export it
module.exports = mongoose.model('User', userSchema);
