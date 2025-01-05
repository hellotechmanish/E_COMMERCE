const Cart = require('../models/cart');
const User = require('../models/user');

exports.checkout = async (req, res) => {
    const userId = req.user.userId;  // Logged-in user ka ID

    try {
        // User ka cart fetch karo
        const cart = await Cart.findOne({ userId }).populate('items.productId');

        // Agar cart empty hai
        if (!cart || cart.items.length === 0) {
            return res.status(404).json({
                status: 404,
                message: "Your cart is empty. Add products to continue."
            });
        }

        // User ka address fetch karo
        const user = await User.findById(userId);
        if (!user.address) {
            return res.status(400).json({
                status: 400,
                message: "Please add a shipping address before checkout."
            });
        }

        // Total amount calculate karo
        const totalAmount = cart.items.reduce((acc, item) => {
            return acc + item.productId.price * item.quantity;
        }, 0);

        res.status(200).json({
            status: 200,
            message: "Checkout summary",
            cart: cart.items,
            totalAmount: totalAmount,
            address: user.address
        });

    } catch (error) {
        res.status(500).json({
            status: 500,
            message: "Server error during checkout",
            error: error.message
        });
    }
};
