const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    firstName: {type: String, required: true, trim: true},
    lastName: {type: String, required: true, trim: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    dateOfBirth: {type: Date, required: true, default: Date.now},
    createdDate: {type: Date, default: Date.now, required: false},
    hasAdminPrevilieges: {type: Boolean, default: false},
    orders: {type: Array, default: []},
    phone: [{type: Number, required: false}],
    address: {
        street: {type: String, required: false, trim: true},
        city: {type: String, required: false, trim: true},
        state: {type: String, required: false, trim: true},
        pin: {type: Number, required: false},
        country: {type: String, required: false, trim: true}
    }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);

