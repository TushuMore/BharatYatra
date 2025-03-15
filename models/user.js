const mongoose = require('mongoose');

const userModel = mongoose.Schema({
    username: {
        type: String,
        trim: true,
        minLength: [3],
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('user', userModel);