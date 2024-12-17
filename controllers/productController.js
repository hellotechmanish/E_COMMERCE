const Product = require('../models/Product');

// Function to get all products
exports.getProducts = async (req, res) => {
    try {
        // Fetch all products from the database
        const products = await Product.find();

        // Check if products exist
        if (products.length === 0) {
            return res.status(404).json({
                status: 404,       // HTTP Status code in the response body
                message: "No products found"
            });
        }

        // Send a success response with the fetched products
        res.status(200).json({
            status: 200,       // HTTP Status code
            message: "Products fetched successfully",
            data: {
                products: products // List of products fetched
            }
        });

    } catch (err) {
        console.error("Error fetching products:", err.message);

        // Handle server error
        res.status(500).json({
            status: 500,
            message: "Server Error",
            error: err.message
        });
    }
};

// Function to add a new product
exports.addProduct = async (req, res) => {
    const { name, price, description, stock } = req.body;
    console.log(req.body);

    // Validation (Check for missing fields)
    if (!name || !price || !description || !stock) {
        return res.status(400).json({
            status: 400,       // HTTP Status code in the response body
            message: 'Please provide all product details'
        });
    }

    try {
        // Create a new product instance
        const product = new Product({
            name,
            price,
            description,
            stock
        });

        // Save the product to the database
        await product.save();

        // Send a success response with the product details in JSON format
        res.status(201).json({
            status: 201,       // HTTP Status code in the response body
            message: 'Product added successfully',
            data: {
                product: product  // The added product details
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: 500,       // HTTP Status code in the response body
            message: 'Server Error',
            error: err.message
        });
    }
};
