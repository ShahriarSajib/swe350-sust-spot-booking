const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { registerUser,loginUser,getUserProfile, updateUserProfile } = require('../controllers/userController');

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/'); // Make sure this folder exists
  },
  filename: function(req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});

const upload = multer({ storage });

// Route: POST /api/users
router.post('/', upload.single('idFile'), registerUser);
router.post('/login', loginUser);
router.get('/profile/:id', getUserProfile);

// Multer setup for multiple file uploads
const uploadFields = upload.fields([
  { name: 'profile_picture', maxCount: 1 },
  { name: 'signature', maxCount: 1 }
]);

router.put('/profile/:id', uploadFields, updateUserProfile);



module.exports = router;