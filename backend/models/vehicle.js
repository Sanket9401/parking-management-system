const mongoose = require('mongoose');

const VehicleSchema = mongoose.Schema({
    vehicle_number: {
        type: String,
        required: true
    },
    vehicle_type: {
        type: String,
        enum: ['small', 'medium', 'large'],
        required: true
    },
    customer_type: {
        type: String,
        enum: ['VIP', 'regular'],
        required: true
    },
    entry_time: {
        type: String,
    }
})

const Vehicle = mongoose.model("Vehicle", VehicleSchema)

module.exports = Vehicle;