const Product = require('../models/Product');

const getProducts = async (req, res) => {
    try {
        const { category, keyword, minPrice, maxPrice, sort, sellerId } = req.query;
        let query = { is_available: true };

        if (category) {
            query.category = category;
        }

        if (sellerId) {
            query.seller = sellerId;
        }

        if (keyword) {
            query.$or = [
                { product_name: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: 'i' } }
            ];
        }

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        let apiQuery = Product.find(query).populate('category').populate('seller', 'shopName');

        if (sort) {
            const sortBy = sort.split(',').join(' ');
            apiQuery = apiQuery.sort(sortBy);
        } else {
            apiQuery = apiQuery.sort('-createdAt');
        }

        const products = await apiQuery;
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category').populate('seller', 'shopName shopDescription');
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createProduct = async (req, res) => {
    try {
        const productData = { ...req.body, seller: req.user._id };
        const product = new Product(productData);
        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            if (product.seller.toString() !== req.user._id.toString() && !req.user.is_staff && !req.user.is_superadmin && req.user.first_name !== 'Admin') {
                return res.status(401).json({ message: 'Not authorized to delete this product' });
            }
            await Product.findByIdAndDelete(req.params.id);
            res.json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { product_name, price, description, image, stock, category, is_available } = req.body;
        const product = await Product.findById(req.params.id);
        if (product) {
            if (product.seller.toString() !== req.user._id.toString() && !req.user.is_staff && !req.user.is_superadmin && req.user.first_name !== 'Admin') {
                return res.status(401).json({ message: 'Not authorized to update this product' });
            }
            product.product_name = product_name || product.product_name;
            product.price = price || product.price;
            product.description = description || product.description;
            product.image = image || product.image;
            product.stock = stock || product.stock;
            product.category = category || product.category;
            product.sizes = req.body.sizes || product.sizes;
            product.is_available = is_available !== undefined ? is_available : product.is_available;

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createProductReview = async (req, res) => {
    const { rating, comment, fit } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
        const alreadyReviewed = product.reviews.find(
            (r) => r.user.toString() === req.user._id.toString()
        );

        if (alreadyReviewed) {
            res.status(400);
            return res.json({ message: 'Product already reviewed' });
        }

        const review = {
            name: `${req.user.first_name} ${req.user.last_name}`,
            rating: Number(rating),
            comment,
            fit,
            user: req.user._id,
        };

        product.reviews.push(review);
        product.numReviews = product.reviews.length;
        product.rating =
            product.reviews.reduce((acc, item) => item.rating + acc, 0) /
            product.reviews.length;

        await product.save();
        res.status(201).json({ message: 'Review added' });
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};

module.exports = { getProducts, getProductById, createProduct, deleteProduct, updateProduct, createProductReview };
