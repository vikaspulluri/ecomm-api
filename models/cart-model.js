const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({
    item: {type: String, ref: 'Product', required: true},
    createdDate: {type: Date, default: Date.now},
    activeStatus: {type: String},
    activeDuration: {type: Date},
    quantity: {type: Number, default: 0, required: true},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}
});

module.exports = mongoose.model('Cart', cartSchema);