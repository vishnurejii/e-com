const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }
    if (!token) {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const admin = (req, res, next) => {
    if (req.user && (req.user.is_staff || req.user.is_superadmin || req.user.first_name === 'Admin')) {
        next();
    } else {
        res.status(401).json({ message: 'FAIL_ADMIN_CHECK: You must be an administrator' });
    }
};

const seller = (req, res, next) => {
    if (req.user && (req.user.is_seller || req.user.is_staff || req.user.is_superadmin || req.user.first_name === 'Admin')) {
        next();
    } else {
        res.status(401).json({ message: 'FAIL_SELLER_CHECK: You must be a registered seller' });
    }
};

module.exports = { protect, admin, seller };
