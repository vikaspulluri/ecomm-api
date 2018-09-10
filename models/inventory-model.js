const mongoose = require('mongoose');

const inventorySchema = mongoose.Schema({
    item: {type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true},
    availability: {type: Number, default: 50, required: true},
    creator: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    createdDate: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Inventory', inventorySchema);