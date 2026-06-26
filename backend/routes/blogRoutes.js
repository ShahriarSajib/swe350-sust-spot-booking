const express = require('express');
const router = express.Router(); 
const multer = require('multer');
const { storage } = require('../config/cloudinary');
const blogController = require('../controllers/blogController');

// Multer Configuration
const upload = multer({ storage: storage });

// Routes
router.post('/create', upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'galleryImages', maxCount: 4 }
]), blogController.createEventBlog);

router.get('/all', blogController.getPublishedBlogs);
router.get('/user/:userId', blogController.getUserPublishedBlogs);

module.exports = router;