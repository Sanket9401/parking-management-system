const mongoose = require('mongoose');

const ReEntryLogSchema = mongoose.Schema({
    vehicle_number: {
        type: String,
        required: true
    },
    last_entry_time: {
        type: Date,
    },
    level: {
        type: String,
    },
    slot_id: {
        type: String,
    },
    customer_type: {
        type: String
    }
})

const ReEntryLog = mongoose.model("ReEntryLog", ReEntryLogSchema)

module.exports = ReEntryLog;