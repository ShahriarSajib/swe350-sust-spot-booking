const Event = require('../models/eventModel');

const getUpcomingEvents = (req, res) => {
    Event.getUpcoming((err, results) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Failed to fetch events" });
        }
        res.status(200).json(results);
    });
};

module.exports = {
    getUpcomingEvents
};