const db = require('../db');

const Spot = {
    create: (data, callback) => {
        // এখানে display_image এখন শুধু একটা VARCHAR (ফাইলের নাম)
        const sql = "INSERT INTO spots (name, description, location, display_image, approval_copy_recipient) VALUES (?, ?, ?, ?, ?)";
        db.query(sql, [data.name, data.description, data.location, data.display_image, data.approval_copy_recipient], callback);
    },

    addRules: (spotId, rules, callback) => {
        const sql = "INSERT INTO spot_rules (spot_id, rules) VALUES ?";
        const values = rules.map(rule => [spotId, rule]);
        db.query(sql, [values], callback);
    },

    getAllSpots: (callback) => {
        const sql = "SELECT * FROM spots";
        db.query(sql, callback);
    },
    getSpotDetails: (id, callback) => {
        // SQL JOIN ব্যবহার করে স্পট এবং রুলস একসাথে আনা হচ্ছে
        // আমরা এখানে GROUP_CONCAT ব্যবহার করছি যাতে সব রুলস একটি স্ট্রিং বা অ্যারে হিসেবে পাওয়া যায়
        const sql = `
            SELECT s.spot_id, s.name, s.description, s.location, s.display_image, 
            GROUP_CONCAT(r.rules SEPARATOR '||') as rules
            FROM spots s
            LEFT JOIN spot_rules r ON s.spot_id = r.spot_id
            WHERE s.spot_id = ?
            GROUP BY s.spot_id
        `;
        db.query(sql, [id], callback);
    }
};

module.exports = Spot;