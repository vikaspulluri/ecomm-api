const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    name: {type: String, required: true, unique: true, default: 'general'},
    description: {type: String, required: true},
    creator: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    createdDate: {type: Date, default: Date.now},
    slugname: {type: String, required: false},
    parentCategory: {type: mongoose.Schema.Types.ObjectId, ref: 'Category'},
    lastUpdated: {type: Date, default: Date.now},
    lastUpdatedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

categorySchema.index({slugName: 1});

module.exports = mongoose.model('Category', categorySchema);