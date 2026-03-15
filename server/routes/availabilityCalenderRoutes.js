// routes/bookingRoutes.js
const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/availabilityCalenderController');

router.get('/:spotId', bookingController.getSpotAvailability);

module.exports = router;