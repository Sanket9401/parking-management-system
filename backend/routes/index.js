const express = require('express');
const parkingSlotsController = require('../controllers/parkingSlotsController')

const router = express.Router();

//for test
router.get('/', (req, res) => {
    return res.json("Home page")
})

//whenever request comes to this endpoint, it will execute the requestSlots function from parkingSlotsController
router.post('/request-slot', parkingSlotsController.requestSlots)

//route for fetching all slot's data
router.get('/get-all-slots', parkingSlotsController.getAllSlotsData)

//route for VPI/emergency, in case they have parked to another slot instead of alloted slot 
router.post('/reassign-slot', parkingSlotsController.reAssignSlot)

//route to exit/empty slot
router.post('/exit-slot', parkingSlotsController.exitSlot)

module.exports = router