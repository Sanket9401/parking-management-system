const express = require('express');
const parkingSlotsController = require('../controllers/parkingSlotsController')

const router = express.Router();

router.get('/', (req, res) => {
    return res.json("Home page")
})

//whenever request comes to this endpoint, it will execite the requestSlots function from parkingSlotsController
router.post('/request-slot', parkingSlotsController.requestSlots)

router.post('/exit-slot', parkingSlotsController.exitSlot)

module.exports = router