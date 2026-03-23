const db = require('../config/db'); 

const getBookingsBySpotId = (spotId, callback) => {
    const query = `SELECT start_date, end_date, session, booking_status FROM bookings WHERE spot_id = ?`;
    
    //  callback 
    db.query(query, [spotId], (err, rows) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, rows);
    });
};

module.exports = { getBookingsBySpotId };