const Event = require('../models/eventModel');

const getUpcomingEvents = async (req, res) => {
    try {
        // Await the results from the model
        const events = await Event.getUpcoming();
        res.status(200).json(events);
    } catch (err) {
        res.status(500).json({ error: "Server Error" });
    }
};

module.exports = {
    getUpcomingEvents
};