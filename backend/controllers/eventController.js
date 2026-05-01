const EventModel = require('../models/eventModel');

const getUpcomingEvents = async (req, res) => {
    try {
        // Await the results from the model
        const events = await EventModel.getUpcoming();
        res.status(200).json(events);
    } catch (err) {
        res.status(500).json({ error: "Server Error" });
    }
};

const submitFeedback = async (req, res) => {
  console.log("1. Request received for ID:", req.body.booking_id);

  try {
    const { booking_id, feedback } = req.body;

    if (!booking_id || !feedback) {
      return res.status(400).json({ error: "Missing ID or Feedback" });
    }

    const existingEntry = await EventModel.checkFeedback(booking_id);
    // console.log("2. Existing feedback found:", existingEntry?.feedback);

    if (existingEntry && existingEntry.feedback !== null && existingEntry.feedback.trim() !== "") {
    //   console.log("3. Aborting: Feedback already exists.");
      return res.status(400).json({ 
        success: false, 
        message: "Feedback already submitted!" 
      });
    }
    // console.log("4. Proceeding to save feedback...");
    const result = await EventModel.submitFeedback(booking_id, feedback);
    // console.log("5. Success! Sending response to UI.");
    return res.status(200).json({ 
      success: true, 
      message: "Feedback saved successfully!" 
    });

  } catch (err) {
    console.error("6. FATAL ERROR:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
    getUpcomingEvents,
    submitFeedback
};