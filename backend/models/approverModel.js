const db = require('../config/db'); // Your DB connection

const Approver = {
    getById: async (id) => {
        const [rows] = await db.query('SELECT * FROM approver WHERE approver_id = ?', [id]);
        return rows[0];
    }
};
const Spot = {
    getById: async (id) => {
        const [rows] = await db.query('SELECT * FROM spots WHERE spot_id = ?', [id]);
        return rows[0];
    }
};

module.exports = { Approver, Spot };