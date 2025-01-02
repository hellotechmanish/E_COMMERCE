const Wishlist = require('../models/wishlist');
const Product = require('../models/Product');


exports.addToWishlist = async (req, res) => {
    const userId = req.user.userId;
    const productId = req.params.productId;

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        let wishlist = await Wishlist.findOne({ userId });

        if (!wishlist) {
            wishlist = new Wishlist({ userId, items: [] });
        }
        // Check if item already exists
        const itemExists = wishlist.items.some(item => item.productId.toString() === productId);
        if (itemExists) {
            return res.status(400).json({
                status: 400,
                message: "Product already in wishlist"
            });
        }

        // Add product to wishlist
        wishlist.items.push({ productId, productname: product.name, });
        await wishlist.save();

        res.status(200).json({
            status: 200,
            message: "Product added to wishlist",
            wishlist: wishlist
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: "Server error",
            error: error.message
        });
    }
};
exports.getWishlist = async (req, res) => {
    const userId = req.user.userId;
    const productId = req.params.productId;

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        let wishlist = await Wishlist.findOne({ userId });

        if (!wishlist) {
            wishlist = new Wishlist({ userId, items: [] });
        }
        // Check if item already exists
        const itemExists = wishlist.items.some(item => item.productId.toString() === productId);
        if (itemExists) {
            return res.status(400).json({
                status: 400,
                message: "Product already in wishlist"
            });
        }

        // Add product to wishlist
        wishlist.items.push({ productId, productname: product.name, });
        await wishlist.save();

        res.status(200).json({
            status: 200,
            message: "Product added to wishlist",
            wishlist: wishlist
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: "Server error",
            error: error.message
        });
    }
};