const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: {type: String, required: true},
    sku: {type: String, required: true, unique: true},
    slug: {type: String, required: true},
    price: {
        originalPrice: {type: Number, required: true},
        offerPrice: {type: Number, required: true}
    },
    description: {type: String, required: true},
    category: {type: mongoose.Schema.Types.ObjectId, ref: 'Category'}
});

module.exports = mongoose.model('Product', productSchema);