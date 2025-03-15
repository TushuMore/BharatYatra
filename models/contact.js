const mongoose = require('mongoose');

const contactSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    query: {
        type: String,
        required: true,
    }
})

module.exports = mongoose.model('contact', contactSchema);