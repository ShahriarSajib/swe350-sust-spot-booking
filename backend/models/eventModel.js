const db = require('../config/db');

const EventModel = {
    // Function 1
    getUpcoming: async () => {
        const query = `
            SELECT booking_id, title, organizer, spot_name, 
                   start_date, end_date, start_time, end_time, session 
            FROM bookings 
            WHERE booking_status = 'approved' 
            AND (start_date >= CURDATE() OR end_date >= CURDATE())
            ORDER BY start_date ASC
        `;
        try {
            const [rows] = await db.query(query);
            return rows;
        } catch (error) {
            console.error("Database query error:", error);
            throw error;
        }
    },
    // Check if feedback is already there
    checkFeedback: async (bookingId) => {
        const sql = "SELECT feedback FROM events WHERE booking_id = ?";
        try {
            const [rows] = await db.query(sql, [bookingId]);
            return rows[0]; 
        } catch (error) {
            console.error("Check Error:", error);
            throw error;
        }
    },

    // Update the feedback
    submitFeedback: async (bookingId, feedback) => {
        const sql = "UPDATE events SET feedback = ? WHERE booking_id = ?";
        try {
            const [result] = await db.query(sql, [feedback, bookingId]);
            return result;
        } catch (error) {
            console.error("Update Error:", error);
            throw error;
        }
    }
};

module.exports = EventModel;