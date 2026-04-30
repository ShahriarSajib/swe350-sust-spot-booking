const db = require('../config/db'); 

const Event = {
    // 1. Change to an async function
    getUpcoming: async () => {
        const query = `
            SELECT 
                booking_id, 
                 title,  -- Check if your column is event_name or title
                organizer AS organizer, -- Check if your column is organizer_name
                spot_name, 
                start_date, 
                end_date, 
                start_time, 
                end_time, 
                session 
            FROM bookings 
            WHERE booking_status = 'approved' -- Check if your column is status or booking_status
            AND (start_date >= CURDATE() OR end_date >= CURDATE())
            ORDER BY start_date ASC
        `;

        try {
            // 2. Use await and destructure [rows]
            const [rows] = await db.query(query);
            return rows; 
        } catch (error) {
            console.error("Database query error:", error);
            throw error; // Let the controller handle the error
        }
    }
};

module.exports = Event;