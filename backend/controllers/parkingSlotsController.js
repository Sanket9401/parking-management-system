const ParkingSlot = require('../models/parkingSlot')
const Vehicle = require('../models/vehicle')
const allocateSlot = require("../services/slotAllocationMethods")

//function to allocate slot for requested vehicle
module.exports.requestSlots = async (req, res) => {
    const { vehicle_number, vehicle_type, customer_type, entry_time } = req.body;

    console.log("Entry time:", entry_time)
    // Check required fields
    if (!vehicle_number || !vehicle_type || !customer_type) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {

        //saving vehcle data to vehicle schema for maintaining all records
        await Vehicle.create({
            vehicle_number: vehicle_number, vehicle_type: vehicle_type, customer_type: customer_type, entry_time: entry_time
        })

        //send data to allocate slot
        const result = await allocateSlot({ vehicle_number, vehicle_type, customer_type });

        if (result.success) {
            //when slot allocted suucessfully
            res.status(200).json({
                message: "Slot allocated successfully",
                slot: result
            });
        } else if (result.message === "No available slot found") {
            //when there is no slot for parking
            res.status(200).json(result.message);
        }
        else {
            //otherwise return the error msg in response
            res.status(400).json({ message: result.message });
        }
    } catch (err) {
        console.error("Allocation error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

//function to get all slots data
module.exports.getAllSlotsData = async (req, res) => {
    try {
        const slotsData = await ParkingSlot.find({});
        return res.status(200).json(slotsData)
    } catch (error) {
        console.log("Error while fetching all slots data:", error)
        return res.status(500).json({ error: "Internal Server Error" })
    }
}

//function to re-assign slot in case of VIP/emergency
module.exports.reAssignSlot = async (req, res) => {
    try {
        //from_slot_id: slot id of the slot which is alloted by backend
        //to_slot_id: slot id where VIP/emergency vehicle has parked the vehicle as there no rules for VIP/emergency
        const { from_slot_id, to_slot_id, vehicle_number } = req.body;

        const fromSlot = await ParkingSlot.findOne({ slot_id: from_slot_id });
        const toSlot = await ParkingSlot.findOne({ slot_id: to_slot_id });

        if (!fromSlot || !toSlot || toSlot.is_occupied) {
            return res.status(400).json({ message: "Invalid slots" });
        }

        // Free up old slot
        fromSlot.is_occupied = false;
        fromSlot.vehicle_number = null;
        fromSlot.customer_type = null;
        await fromSlot.save();

        // Occupy new slot
        toSlot.is_occupied = true;
        toSlot.vehicle_number = vehicle_number;
        toSlot.customer_type = "VIP";
        await toSlot.save();

        return res.status(200).json({ message: "Reassigned successfully" });
    } catch (error) {
        console.log("Error while reassigning slot:", error)
        return res.status(500).json({ error: "Internal Server Error" })
    }
}

//function to exit/empty slot for admin
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