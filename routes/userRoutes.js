// userRoutes.js mein
const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/userCantroller'); // Functions ko correctly import karo

// Routes define karo
router.post('/signup', signup);  // Yeh sahi tareeka hai
router.post('/login', login);

module.exports = router;
