const express = require("express");
const router = express.Router();

const adminAuth = require("../middleware/adminAuth");
const ctrl = require("../controllers/adminController");

// AUTH
//router.post("/register", ctrl.registerAdmin);
router.post("/login", ctrl.loginAdmin);

// PROFILE
router.get("/profile", adminAuth, ctrl.getProfile);
router.put("/profile", adminAuth, ctrl.updateProfile);

// DASHBOARD
router.get("/dashboard", adminAuth, ctrl.dashboard);

// BOOKINGS
router.get("/bookings", adminAuth, ctrl.getBookings);
router.get("/bookings/:id", adminAuth, ctrl.getSingleBooking);

// APPROVAL
router.post("/bookings/:id/approve", adminAuth, ctrl.approveBooking);
router.post("/bookings/:id/reject", adminAuth, ctrl.rejectBooking);

// SPOTS
router.get("/spots", adminAuth, ctrl.getSpots);
router.post("/spots", adminAuth, ctrl.createSpot);
router.put("/spots/:id", adminAuth, ctrl.updateSpot);
router.delete("/spots/:id", adminAuth, ctrl.deleteSpot);

// REPORT
router.get("/reports", adminAuth, ctrl.getReport);

module.exports = router;