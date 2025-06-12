const mongoose = require('mongoose');

const ParkingLevelSchema = mongoose.Schema({
    level_id: {
        type: String,
        required: true
    },
    capacity: {
        type: Number,
    },
    small_slots: {
        type: Number,
    },
    medium_slots: {
        type: Number,
    },
    large_slots: {
        type: Number,
    }
})

const ParkingLevel = mongoose.model('ParkingLevel', ParkingLevelSchema)

module.exports = ParkingLevel;