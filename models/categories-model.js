const mongoose = require('mongoose');

const categoriesSchema = mongoose.Schema({
    categoryName: {type: String, required: true, unique: true, default: 'general'},
    description: {type: String, required: true},
    creator: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    createdDate: {type: Date, default: Date.now},
    slugName: {type: String, required: true}
});

module.exports = mongoose.model('Category', categoriesSchema);