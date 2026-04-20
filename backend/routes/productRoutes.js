const express = require('express');
const router = express.Router();
console.log('[ROUTING] Product routes loaded with SELLER permissions for POST/PUT/DELETE');
const { getProducts, getProductById, createProduct, deleteProduct, updateProduct, createProductReview } = require('../controllers/productController');
const { protect, admin, seller } = require('../middleware/auth');

router.route('/').get(getProducts).post(protect, seller, createProduct);
router.route('/:id').get(getProductById).delete(protect, seller, deleteProduct).put(protect, seller, updateProduct);
router.route('/:id/reviews').post(protect, createProductReview);

module.exports = router;
