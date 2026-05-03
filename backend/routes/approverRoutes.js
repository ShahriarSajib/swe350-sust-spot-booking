const express = require('express');
const router = express.Router();
const { getApprovalDetails } = require('../controllers/approverController');

// This route takes the spot_id as a parameter
// URL: /api/approver/details/1
router.get('/details/:spot_id', getApprovalDetails);

module.exports = router;