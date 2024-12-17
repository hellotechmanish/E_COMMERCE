const express = require('express');
const router = express.Router();
const { getProducts, addProduct } = require('../controllers/productController');

router.get('/getproducts', getProducts);
router.post('/products', addProduct);

module.exports = router;
