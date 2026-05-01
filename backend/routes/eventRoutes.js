const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

router.get('/upcoming', eventController.getUpcomingEvents);
router.post('/feedback', eventController.submitFeedback);

module.exports = router;