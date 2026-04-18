const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });
};

const registerUser = async (req, res) => {
    const { first_name, last_name, username, email, password, is_seller, shopName, shopDescription } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const user = await User.create({ first_name, last_name, username, email, password, is_seller, shopName, shopDescription });
        res.status(201).json({
            _id: user._id,
            first_name: user.first_name,
            email: user.email,
            is_seller: user.is_seller,
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                first_name: user.first_name,
                email: user.email,
                is_staff: user.is_staff,
                is_superadmin: user.is_superadmin,
                is_seller: user.is_seller,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            user.first_name = req.body.first_name || user.first_name;
            user.last_name = req.body.last_name || user.last_name;
            user.username = req.body.username || user.username;
            user.email = req.body.email || user.email;
            user.shopName = req.body.shopName || user.shopName;
            user.shopDescription = req.body.shopDescription || user.shopDescription;

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                first_name: updatedUser.first_name,
                email: updatedUser.email,
                is_seller: updatedUser.is_seller,
                shopName: updatedUser.shopName,
                shopDescription: updatedUser.shopDescription,
                token: generateToken(updatedUser._id)
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser, getUsers, updateUserProfile };
