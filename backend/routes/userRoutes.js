const express = require('express');
const router = express.Router();

const {
  registerUser,
  loginUser,
  verifyEmail,
  getUserProfile,
  updateUserProfile,
  forgotPassword,
  resetPassword,
  changePassword
} = require('../controllers/userController');


const {
  verifyToken
} = require('../middlewares/authMiddleware');

// ================= REGISTER =================
const {
  uploadSingle,
  uploadFields,
  uploadNone
} = require('../middlewares/uploadMiddleware');

router.post('/internal', uploadNone, registerUser);
router.post('/external', uploadSingle, registerUser);

// ================= AUTH =================
router.post('/login', loginUser);
router.get('/verify/:token', verifyEmail);

// ================= PROTECTED ROUTES =================
router.get('/profile/:id', verifyToken, getUserProfile);
router.put('/profile/:id', verifyToken, uploadFields, updateUserProfile);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/change-password', verifyToken, changePassword);
module.exports = router;