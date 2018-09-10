const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({
    item: {type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true},
    createdDate: {type: Date, default: Date.now},
    quantity: {type: Number, default: 0, required: true},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}
});

module.exports = mongoose.model('Cart', cartSchema);