// this is all of the imorted file...
const express = require('express');
const router = express.Router();
const { authMiddleware, isTokenBlacklisted } = require("../middlewares/authMiddleware")
const { home, getAllProducts, getProductById, profile, signup, login, logout, forgotPassword, resetPassword } = require('../controllers/userCantroller');
const { checkout, success } = require('../controllers/checkoutController');

// Import Route
const cartRoutes = require('./cartRoutes');
const wishlistRoutes = require('./wishlistRoutes');


// user Routes define yaisa karta hai 
router.get('/', home);
router.get('/products', getAllProducts);
router.get('/products/:id', getProductById);
router.get('/profile', isTokenBlacklisted, authMiddleware, profile);

//this is diff route
router.use('/cart', authMiddleware, cartRoutes)
router.use('/wishlist', authMiddleware, wishlistRoutes)

router.post('/checkout', authMiddleware, checkout);
router.get('/order/success', success)
// router.get('/profile/orders', orders)
// router.get('/profile/orders/track/:id', track)

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.post('/forgot-Password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
// Test Route
// router.get('/admin', authMiddleware, rolecheck(['admin']), (req, res) => {
//     // res.send('Welcome to admin');
//     res.status(200).json({ status: 200, message: 'Welcome to admint' });
// });

// router.get('/user', authMiddleware, rolecheck(['user']), (req, res) => {
//     // res.send('Welcome to user');
//     res.status(200).json({ status: 200, message: 'Welcome to user  ' });
// });

module.exports = router;