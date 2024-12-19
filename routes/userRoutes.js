// this is all of the imorted file...
const express = require('express');
const router = express.Router();
const { signup, login, logout, forgotPassword, resetPassword } = require('../controllers/userCantroller'); // Functions ko correctly import karo

// Routes define yaisa karta hai 
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.post('/forgot-Password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

module.exports = router;