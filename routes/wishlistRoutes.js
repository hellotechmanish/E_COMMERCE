const express = require('express');
const router = express.Router();
const { addToWishlist, getWishlist, removeWishlist } = require("../controllers/wishlistController")

router.post('/addToWishlist/:productId', addToWishlist);
router.get('/getWishlist', getWishlist);
router.post('/removeWishlist/:productId', removeWishlist);


module.exports = router;