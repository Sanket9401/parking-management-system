const mongoose = require('mongoose');

const ParkingSlotSchema = mongoose.Schema({
    slot_id: {
        type: String,
        required: true
    },
    level: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['small', 'medium', 'large'],
        required: true
    },
    is_occupied: {
        type: Boolean,
        required: true
    },
    vehicle_number: {
        type: String,
        last_level: String
    },
    customer_type: {
        type: String,
    }
})

const ParkingSlot = mongoose.model("ParkingSlot", ParkingSlotSchema)

module.exports = ParkingSlot;