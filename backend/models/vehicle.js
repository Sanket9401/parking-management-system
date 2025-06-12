const mongoose = require('mongoose');

const VehicleSchema = mongoose.Schema({
    vehicle_number: {
        type: String,
        required: true
    },
    type: {
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
        type: Date,
        last_level: String
    }
})

const Vehicle = mongoose.model("Vehicle", VehicleSchema)

module.exports = Vehicle;