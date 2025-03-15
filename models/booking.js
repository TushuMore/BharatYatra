const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema({
    customerName: {
        type: String,
        required: true,
    },
    customerEmail: {
        type: String,
        required: true,
    },
    mobileNo: {
        type: Number,
        required: true,
        min: 10,
    },
    totalPerson: {
        type: String,
        required: true,
    },
    from: {
        type: String,
        required: true,
    },
    where: {
        type: String,
        required: true,
    },
})

module.exports = mongoose.model('booking', bookingSchema);