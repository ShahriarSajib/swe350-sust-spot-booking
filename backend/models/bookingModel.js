const db = require('../config/db');

const createBooking = (data, callback) => {
    // insert into bookings table
    const bookingQuery = `
        INSERT INTO bookings 
        (user_id, spot_id, organizer, start_date, end_date, session, title, description, spot_name, start_time, end_time, is_recommended) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const bookingValues = [
        data.userId, data.spotId, data.organizer, 
        data.startDate, data.endDate, data.session, data.title, 
        data.description, data.spotName, data.startTime, data.endTime, 0 // is_recommended = false
    ];

    db.query(bookingQuery, bookingValues, (err, result) => {
        if (err) return callback(err, null);

        const newBookingId = result.insertId;

       
        const recommenderEmail = (data.recommenderEmail || "").trim();

        if (!recommenderEmail) {
            return callback(new Error("Recommender email not provided"), null);
        }
        const findUserQuery = `SELECT id FROM users WHERE email = ?`;
        db.query(findUserQuery, [recommenderEmail], (userErr, userRows) => {
            if (userErr) return callback(userErr, null);
            if (userRows.length === 0) return callback(new Error("Recommender not found"), null);

            const recommenderUserId = userRows[0].id;

            // insert into recommendations table
            const recQuery = `INSERT INTO recommendations (booking_id, recommender_user_id, recommender_designation) VALUES (?, ?, ?)`;
            db.query(recQuery, [newBookingId, recommenderUserId, data.recommenderDesignation], (recErr, recResult) => {
                if (recErr) return callback(recErr, null);
                
                callback(null, { bookingId: newBookingId, message: "Booking and Recommendation saved" });
            });
        });
    });
};

module.exports = { createBooking };