const db = require('../config/db'); 

const Event = {
    getUpcoming: (callback) => {
        const query = `
            SELECT 
                booking_id, 
                title , 
                organizer, 
                spot_name , 
                start_date, 
                end_date, 
                start_time, 
                end_time, 
                session 
            FROM bookings 
            WHERE booking_status = 'approved' 
            AND (start_date >= CURDATE() OR end_date >= CURDATE())
            ORDER BY start_date ASC
        `;
        db.query(query, callback);
    }
};

module.exports = Event;