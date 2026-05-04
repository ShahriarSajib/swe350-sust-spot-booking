const db = require('../config/db');
const recommendationModel = require('../models/recommendationModel');
const notificationService = require("../services/notificationService");
const { sendEmail } = require("../services/emailService");
exports.getUserRecommendations = async (req, res) => {
    const userId = req.params.id;

    try {
        const recommendations = await recommendationModel.getUserRecommendations(userId);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const formatted = recommendations.map(item => {
            const startDate = new Date(item.start_date);

            let category = "";

            if (item.booking_status === "pending") {
                category = "pending";
            } else if (item.booking_status === "approved") {
                category = startDate >= today ? "upcoming" : "past";
            } else {
                category = item.booking_status;
            }

            return {
                ...item,
                title: item.title,
                category: category,

                // SAME STRUCTURE AS getUserEvents
                recommender: {
                    name: item.recommender_name,
                    designation: item.recommender_designation,
                    email: item.recommender_email,
                    signature: item.recommender_signature
                }
            };
        });

        res.status(200).json(formatted);

    } catch (err) {
        console.error("Recommendation Fetch Error:", err);
        res.status(500).json({
            message: "Database error: " + err.message
        });
    }
};

exports.markAsRecommended = async (req, res) => {
  const bookingId = req.params.bookingId;

  try {
    if (!bookingId || isNaN(bookingId)) {
      return res.status(400).json({ message: "Invalid bookingId" });
    }

    // 1. Get booking + user_type + spot info
    const [rows] = await db.query(
      `SELECT b.booking_id, b.is_recommended, b.user_id, b.spot_id,
              u.user_type
       FROM bookings b
       JOIN users u ON b.user_id = u.id
       WHERE b.booking_id = ?`,
      [bookingId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const booking = rows[0];

    if (booking.is_recommended === 1) {
      return res.status(400).json({ message: "Already recommended" });
    }

    // 2. Get correct approval order based on user type
    const [spotRows] = await db.query(
      `SELECT approval_order, external_approval_order
       FROM spots
       WHERE spot_id = ?`,
      [booking.spot_id]
    );

    if (!spotRows.length) {
      return res.status(404).json({ message: "Spot not found" });
    }

    const spot = spotRows[0];

    const rawOrder =
      booking.user_type === "external"
        ? spot.external_approval_order
        : spot.approval_order;

    let approverList = [];

    try {
      approverList =
        typeof rawOrder === "string" ? JSON.parse(rawOrder) : rawOrder;
    } catch (err) {
      approverList = [];
    }

    if (!Array.isArray(approverList) || approverList.length === 0) {
      return res.status(400).json({
        message: "No approval flow configured for this user type",
      });
    }

    const firstApproverId = approverList[0];

    // 3. Update booking
    await db.query(
      `UPDATE bookings 
       SET is_recommended = 1,
           current_approval_point = 0
       WHERE booking_id = ?`,
      [bookingId]
    );

    // 4. Get full booking info for notifications
    const [[fullBooking]] = await db.query(
      `SELECT b.booking_id, b.user_id, s.name AS spot_name
       FROM bookings b
       JOIN spots s ON b.spot_id = s.spot_id
       WHERE b.booking_id = ?`,
      [bookingId]
    );

    // =========================
    // NOTIFICATIONS
    // =========================

    await notificationService.createNotification({
      user_id: fullBooking.user_id,
      booking_id: bookingId,
      title: "Booking Recommended",
      message: `Your booking for ${fullBooking.spot_name} has been recommended.`,
    });

    await notificationService.createNotification({
      approver_id: firstApproverId,
      booking_id: bookingId,
      title: "Approval Required",
      message: `A booking request for ${fullBooking.spot_name} requires your approval.`,
    });

    // =========================
    //  EMAILS
    // =========================

    const [[user]] = await db.query(
      `SELECT email FROM users WHERE id = ?`,
      [fullBooking.user_id]
    );

    const [[approver]] = await db.query(
      `SELECT approver_email FROM approver WHERE approver_id = ?`,
      [firstApproverId]
    );

    sendEmail({
      to: user.email,
      subject: "Booking Recommended",
      text: `Your booking for ${fullBooking.spot_name} has been recommended.`,
    });

    sendEmail({
      to: approver.approver_email,
      subject: "Approval Required",
      text: `A booking request for ${fullBooking.spot_name} requires your approval.`,
    });

    return res.status(200).json({
      message: "Booking marked as recommended successfully",
    });

  } catch (err) {
    console.error(" Mark Recommendation Error:", err);
    return res.status(500).json({
      message: "Database error: " + err.message,
    });
  }
};