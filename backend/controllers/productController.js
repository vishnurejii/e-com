const Product = require('../models/Product');

const getProducts = async (req, res) => {
    try {
        const { category, keyword } = req.query;
        let query = { is_available: true };

        if (category) {
            query.category = category;
        }

        if (keyword) {
            query.$or = [
                { product_name: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: 'i' } }
            ];
        }

        const products = await Product.find(query).populate('category');
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category');
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
        const product = new Product(req.body);
        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (product) {
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
            product.product_name = product_name || product.product_name;
            product.price = price || product.price;
            product.description = description || product.description;
            product.image = image || product.image;
            product.stock = stock || product.stock;
            product.category = category || product.category;
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

module.exports = { getProducts, getProductById, createProduct, deleteProduct, updateProduct };
