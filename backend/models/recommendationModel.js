const db = require('../config/db');

const getUserRecommendations = async (userId) => {
    const sql = `
        SELECT 
            b.*,
            r.recommender_designation,
            r.recommended_timestamp,
            s.name AS spot_name,
            DATE_FORMAT(b.start_date, '%Y-%m-%d') AS start_date,
            DATE_FORMAT(b.end_date, '%Y-%m-%d') AS end_date
        FROM recommendations r
        JOIN bookings b ON r.booking_id = b.booking_id
        JOIN spots s ON b.spot_id = s.spot_id
        WHERE r.recommender_user_id = ?
        ORDER BY r.recommended_timestamp DESC
    `;

    const [rows] = await db.query(sql, [userId]);
    return rows;
};

module.exports = { getUserRecommendations };