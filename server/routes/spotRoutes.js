const express = require('express');
const router = express.Router();
const spotController = require('../controllers/spotController');
const multer = require('multer');
const path = require('path');

// Multer Setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // নিশ্চিত করুন আপনার প্রজেক্টে 'uploads' ফোল্ডারটি আছে
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// 'display_image' হলো Postman-এর Key এর নাম
router.post('/add', upload.single('display_image'), spotController.addNewSpot);
router.post('/add-rules', spotController.onlyAddRules);
router.get('/:id', spotController.getSpotById);

module.exports = router;