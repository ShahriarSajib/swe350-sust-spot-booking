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

exports.getUserEvents = (req, res) => {
    const userId = req.params.id;

    bookingModel.getUserBookings(userId, (err, bookings) => {
        if (err) {
            return res.status(500).json({ message: "Database error: " + err.message });
        }
        
        const today = new Date();
        today.setHours(0, 0, 0, 0); // আজকের দিনের শুরু

        const categorizedEvents = bookings.map(event => {
            const startDate = new Date(event.start_date);
            let category = "";

            if (event.booking_status === 'pending') {
                category = "pending";
            } else if (event.booking_status === 'approved') {
                // আজকের দিন বা তার পরের দিন হলে Upcoming, আগে হলে Past
                category = startDate >= today ? "upcoming" : "past";
            } else {
                category = event.booking_status; // rejected/cancelled
            }

            return {
                ...event,
                category: category // এই কি (key) টাই ফ্রন্টএন্ডে ফিল্টার করবে
            };
        });

        res.status(200).json(categorizedEvents);
    });
};