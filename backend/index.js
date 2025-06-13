const express = require('express');
const cors = require('cors');
const routes = require('./routes/index')
const db = require('./db/mongooseConnection')
const ParkingLevel = require("./models/parkingLevel")
const ParkingSlot = require("./models/parkingSlot")
const ReEntryLogs = require("./models/reEntryLog")

const app = express();

const port = 8080;

app.use(cors())

app.use(express.json())

app.use("/", routes)

db.on('error', () => {
    console.log("Error while connecting to the database")
});

db.once('open', async () => {
    console.log("Successfully connected to the database")
    try {
        const levels = [
            {
                level_id: "L1",
                max_capacity: 10,
                small_slots: 4,
                medium_slots: 3,
                large_slots: 3
            },
            {
                level_id: "L2",
                max_capacity: 10,
                small_slots: 4,
                medium_slots: 3,
                large_slots: 3
            }
        ];

        await ParkingLevel.deleteMany();
        await ParkingSlot.deleteMany();
        await ReEntryLogs.deleteMany();

        for (const level of levels) {
            await ParkingLevel.create(level);

            let count = 1;

            const createSlots = async (type, qty) => {
                const slots = Array.from({ length: qty }, () => ({
                    slot_id: `${level.level_id}-${type[0].toUpperCase()}${count++}`,
                    level: level.level_id,
                    type,
                    is_occupied: false
                }));
                return ParkingSlot.insertMany(slots);
            };

            await createSlots("small", level.small_slots);
            await createSlots("medium", level.medium_slots);
            await createSlots("large", level.large_slots);
        }
        console.log("Slots created successfully")
    } catch (error) {
        console.log("Error while creating slots", error)
    }

})

app.listen(port, (err) => {
    if (err) {
        console.log("Error in starting the server");
        return;
    }
    console.log(`Server is up and running on port: ${port}`)
})