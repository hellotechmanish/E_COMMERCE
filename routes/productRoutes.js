const express = require('express');
const router = express.Router();
const { getAllProducts, addProduct, getProductById, editProduct, deleteproduct } = require('../controllers/productController');

router.get('/getAllProducts', getAllProducts);
router.get('/getProduct/:id', getProductById);
router.post('/addproduct', addProduct);
router.post('/editProduct/:id', editProduct);
router.post('/deleteproduct/:id', deleteproduct);

module.exports = router;
