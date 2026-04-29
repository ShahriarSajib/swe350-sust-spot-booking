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

const getUserBookings = (userId, callback) => {
    const sql = `
    SELECT b.*, s.name, 
    DATE_FORMAT(b.start_date, '%Y-%m-%d') as start_date,
    DATE_FORMAT(b.end_date, '%Y-%m-%d') as end_date
    FROM bookings b
    JOIN spots s ON b.spot_id = s.spot_id
    WHERE b.user_id = ?
    ORDER BY b.start_date DESC
`;

    db.query(sql, [userId], (err, rows) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, rows);
    });
};

module.exports = { createBooking, getUserBookings };

