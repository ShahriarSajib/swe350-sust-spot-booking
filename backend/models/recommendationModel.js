const db = require('../config/db');

const getUserRecommendations = async (userId) => {
    const sql = `
        SELECT 
            b.*,
            s.name AS spot_name,

            DATE_FORMAT(b.start_date, '%Y-%m-%d') AS start_date,
            DATE_FORMAT(b.end_date, '%Y-%m-%d') AS end_date,

            r.recommender_designation,
            r.recommended_timestamp,

            u.full_name AS recommender_name,
            u.email AS recommender_email,
            u.signature AS recommender_signature

        FROM recommendations r

        JOIN bookings b ON r.booking_id = b.booking_id
        JOIN spots s ON b.spot_id = s.spot_id
        JOIN users u ON r.recommender_user_id = u.id

        WHERE r.recommender_user_id = ?

        ORDER BY r.recommended_timestamp DESC
    `;

    const [rows] = await db.query(sql, [userId]);
    return rows;
};

module.exports = { getUserRecommendations };