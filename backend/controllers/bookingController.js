const bookingModel = require('../models/bookingModel');

exports.confirmBooking = (req, res) => {
    const bookingData = req.body;

    bookingModel.createBooking(bookingData, (err, result) => {
        if (err) {
            console.error(err);
            if (err.message === "Recommender not found") {
                return res.status(404).json({ message: "Recommender email not found in system!" });
            }
            return res.status(500).json({ message: "Database error during booking" });
        }
        res.status(201).json({ 
            message: "Booking request submitted successfully!", 
            data: result 
        });
    });
};