const express = require('express');
const router = express.Router();

const recommendationController = require('../controllers/recommendationController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.get('/user/:id', verifyToken, recommendationController.getUserRecommendations);
router.put('/mark/:bookingId', verifyToken, recommendationController.markAsRecommended);
module.exports = router;