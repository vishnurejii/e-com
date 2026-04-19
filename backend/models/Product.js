const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    fit: { type: String }, // e.g., 'Small', 'True to size', 'Large'
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

const productSchema = new mongoose.Schema({
    product_name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    image: { type: String },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    sizes: { type: [String], default: [] }, // e.g., ['S', 'M', 'L']
    is_available: { type: Boolean, default: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reviews: [reviewSchema],
    numReviews: { type: Number, required: true, default: 0 },
    rating: { type: Number, required: true, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
