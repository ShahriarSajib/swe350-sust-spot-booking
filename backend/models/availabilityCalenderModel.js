const db = require('../config/db'); 

const getBookingsBySpotId = async (spotId) => {
    const query = `SELECT start_date, end_date, session, booking_status FROM bookings WHERE spot_id = ?`;
    
    try {
        const [rows] = await db.query(query, [spotId]);
        return rows;
    } catch (err) {
        throw err;
    }
};

module.exports = { getBookingsBySpotId };