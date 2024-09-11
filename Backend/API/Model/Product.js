const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    brand: { type: String, required: true },
    price: { type: Number, required: true },
    rating: { type: Number, default: 1 },
    description: String,
    images: [String],
    availability: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

ProductSchema.index({ name: 'text', category: 'text', brand: 'text' });

const Product = mongoose.model('Product', ProductSchema);
module.exports = Product;
