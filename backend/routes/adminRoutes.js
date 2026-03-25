const express = require("express");
const router = express.Router();

const adminAuth = require("../middlewares/adminAuth");
const { uploadSpotImages, uploadSignature } = require("../middlewares/uploadSpots");
const {
  loginAdmin,
  logoutAdmin,
  changePassword,
  getProfile,
  updateProfile,
  updateSignature,
  dashboard,
  getAllBookings,
  getSingleBooking,
  approveBooking,
  rejectBooking,
  reserveSpotByAdmin,
  getSpots,
  getSingleSpot,
  createSpot,
  updateSpot,
  deleteSpot,
  getSpotRecipients,
  updateSpotRecipients,
  getBlogs,
  publishBlog,
  rejectBlog,
  deleteBlog,
  getFeedbacks,
  getReport,
  getNotifications,
  markAllNotificationsRead,
  checkSpotAvailability,
} = require("../controllers/adminController");

// ── PUBLIC (no auth needed) ───────────────────────────────────────────────────
router.post("/login", loginAdmin);

// ── PROTECTED (require adminAuth) ─────────────────────────────────────────────
router.use(adminAuth);

// Auth
router.post("/logout", logoutAdmin);
router.put("/change-password", changePassword);

// Profile
router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.put("/profile/signature", uploadSignature, updateSignature);

// Dashboard
router.get("/dashboard", dashboard);

// Bookings
router.get("/bookings", getAllBookings);
router.get("/bookings/:id", getSingleBooking);
router.post("/bookings/:id/approve", approveBooking);
router.post("/bookings/:id/reject", rejectBooking);
router.post("/bookings/reserve", reserveSpotByAdmin);

// Spots
router.get("/spots", getSpots);
router.get("/spots/:id", getSingleSpot);
router.post("/spots", uploadSpotImages, createSpot);
router.put("/spots/:id", uploadSpotImages, updateSpot);
router.delete("/spots/:id", deleteSpot);

// Spot Recipients
router.get("/spots/:id/recipients", getSpotRecipients);
router.put("/spots/:id/recipients", updateSpotRecipients);

// Blog Moderation
router.get("/blogs", getBlogs);
router.post("/blogs/:id/publish", publishBlog);
router.post("/blogs/:id/reject", rejectBlog);
router.delete("/blogs/:id", deleteBlog);

// Feedbacks
router.get("/feedbacks", getFeedbacks);

// Reports
router.get("/report", getReport);

// Notifications
router.get("/notifications", getNotifications);
router.put("/notifications/read-all", markAllNotificationsRead);
 
// Spot availability check
router.get("/spots/:id/availability", checkSpotAvailability);

module.exports = router;