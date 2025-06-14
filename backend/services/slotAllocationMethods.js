// const ParkingLevel = require("../models/parkingLevel");
const ParkingSlot = require("../models/parkingSlot");
const ReEntryLog = require("../models/reEntryLog");

//Time within regular vehicles should not enter in same slot
const REENTRY_LIMIT_MINUTES = 60; // configurable


//This function will return minutes difference between current requested time and previously parked time (for same slot)
function getDateMinutesDiff(date1, date2) {
    return (date1.getTime() - date2.getTime()) / (1000 * 60);
}

//Function to find the available slot for respective vehicle
async function findAvailableSlot(vehicleType, vehicleNumber) {
    //This means small vehicles are allowed to park in small, medium, large slot, medium vehicles are allowed in medium and large,
    // and large will be only allowed in large slots
    const allowedSlotTypes = {
        small: ["small", "medium", "large"], //configurable
        medium: ["medium", "large"], //configurable
        large: ["large"]  //configurable
    };

    //Checking the requested vehicle is in ReEntryLog or not so as to check logic which doesn't allows to renter in same slot 
    //within 1 hr (configurable)
    const recentEntry = await ReEntryLog.findOne({ vehicle_number: vehicleNumber }).sort({ last_entry_time: -1 });

    let excludedSlotId = null;

    //If vehicle found in ReEntryLogs, then checking time difference
    if (recentEntry) {
        const now = new Date();
        const exitTime = recentEntry.last_entry_time;
        const timeDiff = getDateMinutesDiff(now, new Date(exitTime));

        if (timeDiff < REENTRY_LIMIT_MINUTES && recentEntry.customer_type === "regular") {
            excludedSlotId = recentEntry.slot_id;
        }
    }

    // Step 2: Build slot query
    const query = {
        type: { $in: allowedSlotTypes[vehicleType] },
        is_occupied: false
    };

    if (excludedSlotId) {
        query.slot_id = { $ne: excludedSlotId };
    }
    //This returns the first best match
    return await ParkingSlot.findOne(query).sort({ level: 1 });
}

//This function will return boolean value whether the requested vehicle is allowed to park in that slot or not
async function isReEntryRestricted(vehicleNumber, now) {
    const recentEntry = await ReEntryLog.findOne({ vehicle_number: vehicleNumber }).sort({ last_entry_time: -1 });

    console.log("Found in Re-entry logs:", recentEntry)

    if (!recentEntry) return false;

    const timeDiff = getDateMinutesDiff(now, new Date(recentEntry.last_entry_time));

    console.log("Time Difference is:", timeDiff)

    if (timeDiff < REENTRY_LIMIT_MINUTES) {
        return true;
    }
    return false;
}

//This function allocates the slot for requested vehicle
async function allocateSlot(vehicle) {
    const now = new Date();

    console.log("Receiverd data for allocation:", vehicle)

    // Check re-entry restriction
    const restricted = await isReEntryRestricted(vehicle.vehicle_number, now);


    console.log("Restricted level:", restricted)

    // Prefer not to allocate same level
    const slot = await findAvailableSlot(vehicle.vehicle_type, vehicle.vehicle_number, restricted);

    if (!slot) {
        return { success: false, message: "No available slot found" };
    }

    // Occupy the slot
    slot.is_occupied = true;
    slot.vehicle_number = vehicle.vehicle_number;
    slot.customer_type = vehicle.customer_type
    await slot.save();

    // Update re-entry log
    if (restricted) {
        await ReEntryLog.findOneAndUpdate({ vehicle_number: vehicle.vehicle_number }, {
            $set: { slot_id: slot.slot_id, customer_type: vehicle.customer_type }
        })
    } else {
        //create fresh re-entry log
        await ReEntryLog.create({
            vehicle_number: vehicle.vehicle_number,
            last_entry_time: now,
            level: slot.level,
            slot_id: slot.slot_id,
            customer_type: vehicle.customer_type
        });
    }


    return {
        success: true,
        slot_id: slot.slot_id,
        level: slot.level,
        type: slot.type
    };
}

module.exports = allocateSlot;
