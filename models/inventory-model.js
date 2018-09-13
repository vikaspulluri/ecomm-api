const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

const inventorySchema = mongoose.Schema({
    product: {type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true},
    availableQuantity: {type: Number, default: 50, required: true},
    catalogId: {type: Number, required: true, unique: true},
    inventoryStatus: {type: String, default: 'Active', required: true},
    creator: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    createdDate: {type: Date, default: Date.now},
    lastModifiedOn: {type: Date},
    lastModifiedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

inventorySchema.plugin(autoIncrement.plugin, {
    model: 'Inventory',
    field: 'catalogId',
    startAt: 1,
    incrementBy: 1
})

module.exports = mongoose.model('Inventory', inventorySchema);