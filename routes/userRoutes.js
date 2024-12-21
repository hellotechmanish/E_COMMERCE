// this is all of the imorted file...
const express = require('express');
const router = express.Router();
const { signup, login, logout, forgotPassword, resetPassword } = require('../controllers/userCantroller'); // Functions ko correctly import karo
const { authMiddleware, rolecheck } = require("../middlewares/authMiddleware")

// Routes define yaisa karta hai 
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.post('/forgot-Password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
// Test Route
router.get('/admin', authMiddleware, rolecheck(['admin']), (req, res) => {
    // res.send('Welcome to admin');
    res.status(200).json({ status: 200, message: 'Welcome to admint' });
});

router.get('/user', authMiddleware, rolecheck(['user']), (req, res) => {
    // res.send('Welcome to user');
    res.status(200).json({ status: 200, message: 'Welcome to user  ' });
});

module.exports = router;