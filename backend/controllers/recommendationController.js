const recommendationModel = require('../models/recommendationModel');

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
                category
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
        // 1. Check if booking exists
        const [rows] = await db.query(
            `SELECT booking_id, is_recommended FROM bookings WHERE booking_id = ?`,
            [bookingId]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        // 2. Prevent duplicate recommendation
        if (rows[0].is_recommended === 1) {
            return res.status(400).json({
                message: "Already recommended"
            });
        }

        // 3. Update booking
        await db.query(
            `UPDATE bookings SET is_recommended = 1 WHERE booking_id = ?`,
            [bookingId]
        );

        res.status(200).json({
            message: "Booking marked as recommended successfully"
        });

    } catch (err) {
        console.error("Mark Recommendation Error:", err);
        res.status(500).json({
            message: "Database error: " + err.message
        });
    }
};