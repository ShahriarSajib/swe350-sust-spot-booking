const express = require("express");
const router = express.Router();

const adminAuth = require("../middleware/adminAuth");
const ctrl = require("../controllers/adminController");

// AUTH
router.post("/login", ctrl.loginAdmin);

// PROFILE
router.get("/profile", adminAuth, ctrl.getProfile);
router.put("/profile", adminAuth, ctrl.updateProfile);

// DASHBOARD (stats + pending list + recent activity + upcoming events)
router.get("/dashboard", adminAuth, ctrl.dashboard);

// BOOKINGS (history list)
router.get("/bookings", adminAuth, ctrl.getBookings);
router.get("/bookings/:id", adminAuth, ctrl.getSingleBooking);

// APPROVAL ACTIONS
router.post("/bookings/:id/approve", adminAuth, ctrl.approveBooking);
router.post("/bookings/:id/reject", adminAuth, ctrl.rejectBooking);

// SPOTS (full CRUD)
router.get("/spots", adminAuth, ctrl.getSpots);
router.get("/spots/:id", adminAuth, ctrl.getSingleSpot);
router.post("/spots", adminAuth, ctrl.createSpot);
router.put("/spots/:id", adminAuth, ctrl.updateSpot);
router.delete("/spots/:id", adminAuth, ctrl.deleteSpot);

// SPOT RECIPIENTS (get/update per spot)
router.get("/spots/:id/recipients", adminAuth, ctrl.getSpotRecipients);
router.put("/spots/:id/recipients", adminAuth, ctrl.updateSpotRecipients);

// BLOG MODERATION
router.get("/blogs", adminAuth, ctrl.getBlogs);           // ?status=pending|published|all
router.post("/blogs/:id/publish", adminAuth, ctrl.publishBlog);
router.post("/blogs/:id/reject", adminAuth, ctrl.rejectBlog);
router.delete("/blogs/:id", adminAuth, ctrl.deleteBlog);

// FEEDBACKS
router.get("/feedbacks", adminAuth, ctrl.getFeedbacks);

// REPORT
router.get("/reports", adminAuth, ctrl.getReport);

module.exports = router;