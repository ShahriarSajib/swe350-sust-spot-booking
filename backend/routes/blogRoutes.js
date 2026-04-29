const express = require('express');
const router = express.Router(); // <--- THIS WAS MISSING
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const blogController = require('../controllers/blogController');

// 1. Path Setup
const uploadDir = path.resolve(__dirname, '../uploads');

// 2. Ensure folder exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// 3. Multer Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// 4. Routes
// Now that 'router' is defined above, this will work perfectly!
router.post('/create', upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'galleryImages', maxCount: 4 }
]), blogController.createEventBlog);

router.get('/all', blogController.getPublishedBlogs);
router.get('/user/:userId', blogController.getUserPublishedBlogs);

module.exports = router;