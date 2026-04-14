const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    category_name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    cat_image: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);
