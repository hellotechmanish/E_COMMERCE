const express = require('express');
const router = express.Router();
const { addToWishlist } = require("../controllers/wishlistController")

router.post('/addToWishlist/:productId', addToWishlist);


module.exports = router;