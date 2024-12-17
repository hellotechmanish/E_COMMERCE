const { createOrder } = require('../models/Order');
const Product = require('../models/Product'); // For MongoDB Product

// Create Order function
exports.createOrder = (req, res) => {
    const { userId, amount, productId } = req.body;

    // Fetch product details from MongoDB
    Product.findById(productId)
        .then((product) => {
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            // Now, create the order in MySQL
            createOrder(userId, amount, (err, result) => {
                if (err) {
                    return res.status(500).json({ message: 'Order creation failed', error: err });
                }
                res.status(201).json({ message: 'Order created successfully', orderId: result.insertId });
            });
        })
        .catch((err) => {
            res.status(500).json({ message: 'Failed to fetch product', error: err });
        });
};
