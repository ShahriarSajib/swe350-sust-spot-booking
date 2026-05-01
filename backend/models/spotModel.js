const db = require('../config/db');

const Spot = {
    create: async (data) => {
        const sql = "INSERT INTO spots (name, description, location, display_image, approval_copy_recipient) VALUES (?, ?, ?, ?, ?)";
        try {
            const [result] = await db.query(sql, [data.name, data.description, data.location, data.display_image, data.approval_copy_recipient]);
            return result;
        } catch (err) {
            throw err;
        }
    },

    addRules: async (spotId, rules) => {
        const sql = "INSERT INTO spot_rules (spot_id, rules) VALUES ?";
        const values = rules.map(rule => [spotId, rule]);
        try {
            const [result] = await db.query(sql, [values]);
            return result;
        } catch (err) {
            throw err;
        }
    },

    getAllSpots: async () => {
        const sql = "SELECT * FROM spots";
        try {
            const [rows] = await db.query(sql);
            return rows;
        } catch (err) {
            throw err;
        }
    },

    getSpotDetails: async (id) => {
        const sql = `
            SELECT spot_id, name, description, location, display_image, rules, image1, image2, image3
            FROM spots 
            WHERE spot_id = ?
        `;
        try {
            const [rows] = await db.query(sql, [id]);
            return rows;
        } catch (err) {
            throw err;
        }
    }
};

module.exports = Spot;