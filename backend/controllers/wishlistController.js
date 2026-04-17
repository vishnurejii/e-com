const Wishlist = require('../models/Wishlist');

const getWishlist = async (req, res) => {
    const wishlist = await Wishlist.findOne({ user: req.user._id }).populate('products');
    if (wishlist) {
        res.json(wishlist);
    } else {
        res.json({ products: [] });
    }
};

const addToWishlist = async (req, res) => {
    const { productId } = req.body;
    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
        wishlist = new Wishlist({ user: req.user._id, products: [productId] });
    } else {
        if (!wishlist.products.includes(productId)) {
            wishlist.products.push(productId);
        }
    }

    await wishlist.save();
    res.status(201).json(wishlist);
};

const removeFromWishlist = async (req, res) => {
    const { productId } = req.params;
    const wishlist = await Wishlist.findOne({ user: req.user._id });

    if (wishlist) {
        wishlist.products = wishlist.products.filter(p => p.toString() !== productId);
        await wishlist.save();
        res.json(wishlist);
    } else {
        res.status(404).json({ message: 'Wishlist not found' });
    }
};

module.exports = { getWishlist, addToWishlist, removeFromWishlist };
