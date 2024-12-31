// this is all of the imorted file...
const express = require('express');
const router = express.Router();
const { addCart, getcart, deletecartitem } = require('../controllers/cartController')



router.post('/addcart', addCart);
router.get('/getcart', getcart);
router.delete('/deletecartitem/:productId', deletecartitem);


module.exports = router;