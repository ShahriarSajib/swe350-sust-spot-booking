const db = require('../config/db');

const createBooking = async (data) => {
    // 1. Insert into bookings table
    const bookingQuery = `
        INSERT INTO bookings 
        (user_id, spot_id, organizer, start_date, end_date, session, title, description, spot_name, start_time, end_time, is_recommended) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
    `;

    const bookingValues = [
        data.userId, data.spotId, data.organizer, 
        data.startDate, data.endDate, data.session, data.title, 
        data.description, data.spotName, data.startTime, data.endTime
    ];

    try {
        const [result] = await db.query(bookingQuery, bookingValues);
        const newBookingId = result.insertId;

        // 2. Handle Recommender logic
        const recommenderEmail = (data.recommenderEmail || "").trim();
        if (!recommenderEmail) {
            throw new Error("Recommender email not provided");
        }

        const [userRows] = await db.query(`SELECT id FROM users WHERE email = ?`, [recommenderEmail]);
        
        if (userRows.length === 0) {
            throw new Error("Recommender not found");
        }

        const recommenderUserId = userRows[0].id;

        // 3. Insert into recommendations table
        const recQuery = `INSERT INTO recommendations (booking_id, recommender_user_id, recommender_designation) VALUES (?, ?, ?)`;
        await db.query(recQuery, [newBookingId, recommenderUserId, data.recommenderDesignation]);

        return { bookingId: newBookingId, message: "Booking and Recommendation saved" };
    } catch (error) {
        // Log the error and pass it up
        console.error("Error in createBooking model:", error);
        throw error; 
    }
};

const getUserBookings = async (userId) => {
    const sql = `
        SELECT b.*, s.name as spot_name, 
        DATE_FORMAT(b.start_date, '%Y-%m-%d') as start_date,
        DATE_FORMAT(b.end_date, '%Y-%m-%d') as end_date
        FROM bookings b
        JOIN spots s ON b.spot_id = s.spot_id
        WHERE b.user_id = ?
        ORDER BY b.start_date DESC
    `;

    try {
        // Use await and destructure the rows
        const [rows] = await db.query(sql, [userId]);
        return rows;
    } catch (err) {
        throw err; // Send error up to the controller
    }
};
module.exports = { createBooking, getUserBookings };

