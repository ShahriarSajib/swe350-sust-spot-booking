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

                // ✅ SAME STRUCTURE AS getUserEvents
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
        // 0. Validate
        if (!bookingId || isNaN(bookingId)) {
            return res.status(400).json({ message: "Invalid bookingId" });
        }

        // 1. Check booking
        const [rows] = await db.query(
            `SELECT booking_id, is_recommended, user_id, spot_id, spot_name
             FROM bookings WHERE booking_id = ?`,
            [bookingId]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        const booking = rows[0];

        // 2. Prevent duplicate
        if (booking.is_recommended === 1) {
            return res.status(400).json({
                message: "Already recommended"
            });
        }

        // 3. Update booking
        await db.query(
            `UPDATE bookings 
             SET is_recommended = 1,
                 current_approval_point = 0
             WHERE booking_id = ?`,
            [bookingId]
        );

        // 4. Get approval order from spot
        const [spotRows] = await db.query(
            `SELECT approval_order FROM spots WHERE spot_id = ?`,
            [booking.spot_id]
        );

        let approverList = [];

        try {
            approverList = typeof spotRows[0].approval_order === "string"
                ? JSON.parse(spotRows[0].approval_order)
                : spotRows[0].approval_order;
        } catch {
            approverList = [];
        }

        if (!approverList || approverList.length === 0) {
            console.log("⚠️ No approvers configured");
        } else {
            const firstApproverId = approverList[0];

            // =========================
            // 🔔 NOTIFICATIONS
            // =========================

            // 1️⃣ Notify USER
            await notificationService.createNotification({
                user_id: booking.user_id,
                booking_id: bookingId,
                title: "Booking Recommended",
                message: `Your booking for ${booking.spot_name} has been recommended and sent for approval.`
            });

            // 2️⃣ Notify FIRST APPROVER
            await notificationService.createNotification({
                approver_id: firstApproverId,
                booking_id: bookingId,
                title: "Approval Required",
                message: `A booking request for ${booking.spot_name} requires your approval.`
            });

            console.log("✅ Notifications sent");

            // =========================
            // 📧 EMAILS (NEW)
            // =========================

            // 🔹 Get user email
            const [[user]] = await db.query(
                `SELECT email FROM users WHERE id = ?`,
                [booking.user_id]
            );

            // 🔹 Get approver email
            const [[approver]] = await db.query(
                `SELECT approver_email FROM approver WHERE approver_id = ?`,
                [firstApproverId]
            );

            // 🔹 Send email to USER
            sendEmail({
                to: user.email,
                subject: "Booking Recommended",
                text: `Your booking for ${booking.spot_name} has been recommended and sent for approval.`,
            });

            // 🔹 Send email to APPROVER
            sendEmail({
                to: approver.approver_email,
                subject: "Approval Required",
                text: `A booking request for ${booking.spot_name} requires your approval.`,
            });
        }

        res.status(200).json({
            message: "Booking marked as recommended successfully"
        });

    } catch (err) {
        console.error("❌ Mark Recommendation Error:", err);
        res.status(500).json({
            message: "Database error: " + err.message
        });
    }
};