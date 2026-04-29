const db = require('../config/db');

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
   
    const sql = `
        SELECT spot_id, name, description, location, display_image, approval_copy_recipient, rules , image1, image2, image3
        FROM spots 
        WHERE spot_id = ?
    `;
    db.query(sql, [id], callback);
}
};

module.exports = Spot;