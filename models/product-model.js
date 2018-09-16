const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const shortId = require('shortid');

const productSchema = mongoose.Schema({
    _id: {type: String, required: true},
    name: {type: String, required: true},
    sku: {type: Number, unique: true},
    slugname: {type: String},
    price: {
        originalPrice: {type: Number, required: true},
        offerPrice: {type: Number},
        currency: {type: String}
    },
    description: {type: String, required: true},
    meta: {
        madeIn: {type: String},
        color: {type: String},
        dimensions: {type: String}
    },
    createdBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    createdDate: {type: Date, default: Date.now},
    category: {type: mongoose.Schema.Types.ObjectId, ref: 'Category'},
    lastModifiedOn: {type: Date},
    lastModifiedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

productSchema.index({sku: 1});
productSchema.plugin(autoIncrement.plugin, {
    model: 'Product',
    field: 'sku',
    startAt: 100,
    incrementBy: 1
})

module.exports = mongoose.model('Product', productSchema);