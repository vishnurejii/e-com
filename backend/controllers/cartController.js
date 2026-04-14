const Cart = require('../models/Cart');

const getCart = async (req, res) => {
    try {
        const { cart_id, user_id } = req.query;
        let query = {};
        if (user_id) query.user = user_id;
        else if (cart_id) query.cart_id = cart_id;

        const cart = await Cart.findOne(query).populate('items.product');
        res.json(cart || { items: [] });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addToCart = async (req, res) => {
    const { product_id, quantity, user_id, cart_id } = req.body;
    try {
        let query = {};
        if (user_id) query.user = user_id;
        else if (cart_id) query.cart_id = cart_id;

        let cart = await Cart.findOne(query);

        if (!cart) {
            cart = new Cart({ user: user_id, cart_id: cart_id, items: [] });
        }

        const itemIndex = cart.items.findIndex(p => p.product.toString() === product_id);
        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity || 1;
        } else {
            cart.items.push({ product: product_id, quantity: quantity || 1 });
        }

        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const removeFromCart = async (req, res) => {
    const { product_id, user_id, cart_id } = req.body;
    try {
        let query = {};
        if (user_id) query.user = user_id;
        else if (cart_id) query.cart_id = cart_id;

        let cart = await Cart.findOne(query);
        if (!cart) return res.status(404).json({ message: 'Cart not found' });

        cart.items = cart.items.filter(p => p.product.toString() !== product_id);
        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getCart, addToCart, removeFromCart };
