// this is all of the imorted file...
const express = require('express');
const router = express.Router();
const { signup, login, logout } = require('../controllers/userCantroller'); // Functions ko correctly import karo

// Routes define yaisa karta hai 
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);

module.exports = router;