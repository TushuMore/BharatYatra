const mongoose = require('mongoose');

const postCardSchema = mongoose.Schema({
    cardName: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
})

module.exports = mongoose.model('cards', postCardSchema);