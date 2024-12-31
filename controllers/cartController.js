const Cart = require('../models/cart');
const Product = require('../models/Product');

exports.addCart = async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user.userId;
    console.log("controler consele use id :", userId);

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ status: 404, message: 'Product not found' });
        }

        // Check if cart exists
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, items: [], totalAmount: 0 });
        }

        // Check if product already in cart
        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

        if (itemIndex > -1) {
            // Product exists in cart, update quantity
            cart.items[itemIndex].quantity += quantity;
        } else {
            // Add new product to cart
            cart.items.push({ productId, productname: product.name, quantity, price: product.price });
        }

        // Calculate total amount
        cart.totalAmount = cart.items.reduce((total, item) => total + item.quantity * item.price, 0);

        await cart.save();

        res.status(200).json({
            status: 200,
            message: 'Item added to cart successfully',
            data: cart
        });

    } catch (error) {
        res.status(500).json({ status: 500, message: 'Server error', error: error.message });
    }
};

exports.getcart = async (req, res) => {
    const userId = req.user.userId;
    console.log("user id", userId);
    try {
        // Check cart exists
        let cart = await Cart.findOne({ userId });
        res.send(cart)

    } catch (error) {
        res.status(500).json({ status: 500, message: 'Server error', error: error.message });
    }

};

exports.deletecartitem = async (req, res) => {
    const userId = req.user.userId;  // Extract from token middleware
    const productId = req.params.productId;  // Product to be removed

    try {
        // Find user's cart
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({
                status: 404,
                message: "Cart not found"
            });
        }

        // Filter out the product to remove
        const updatedItems = cart.items.filter(item => item.productId.toString() !== productId);

        // Update the cart
        cart.items = updatedItems;
        cart.totalAmount = updatedItems.reduce((total, item) => total + item.price * item.quantity, 0);

        await cart.save();

        res.status(200).json({
            status: 200,
            message: "Item removed from cart",
            cart
        });


    } catch (error) {
        res.status(500).json({ status: 500, message: "server error", error: error.message })

    }
}