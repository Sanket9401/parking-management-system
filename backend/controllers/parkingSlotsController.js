const ParkingSlot = require('../models/parkingSlot')
const allocateSlot = require("../services/slotAllocationMethods")


module.exports.requestSlots = async (req, res) => {
    const { vehicle_number, vehicle_type, customer_type } = req.body;

    // Check required fields
    if (!vehicle_number || !vehicle_type || !customer_type) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        const result = await allocateSlot({ vehicle_number, vehicle_type, customer_type });

        if (result.success) {
            res.status(200).json({
                message: "Slot allocated successfully",
                slot: result
            });
        } else {
            res.status(400).json({ message: result.message });
        }
    } catch (err) {
        console.error("Allocation error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}


module.exports.exitSlot = async (req, res) => {
    const { vehicle_number } = req.body;

    if (!vehicle_number) {
        return res.status(400).json({ message: "Vehicle number is required." });
    }

    try {
        // Find the slot where the vehicle is currently parked
        const slot = await ParkingSlot.findOne({ vehicle_number, is_occupied: true });

        if (!slot) {
            return res.status(404).json({ message: "No active parking slot found for this vehicle." });
        }

        // Vacate the slot
        slot.is_occupied = false;
        slot.vehicle_number = null;
        await slot.save();

        res.status(200).json({
            message: `Vehicle ${vehicle_number} exited. Slot ${slot.slot_id} is now free.`,
            slot_id: slot.slot_id
        });
    } catch (err) {
        console.error("Exit error:", err);
        res.status(500).json({ message: "Internal server error." });
    }
};