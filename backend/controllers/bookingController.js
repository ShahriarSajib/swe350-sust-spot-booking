const bookingModel = require('../models/bookingModel');

exports.confirmBooking = async (req, res) => {
    const bookingData = req.body;

    try {
        // Await the entire multi-step process from the model
        const result = await bookingModel.createBooking(bookingData);
        
        res.status(201).json({ 
            message: "Booking request submitted successfully!", 
            data: result 
        });
    } catch (err) {
        console.error("Booking Controller Error:", err.message);

        // Specific error handling based on the message thrown in the model
        if (err.message === "Recommender not found") {
            return res.status(404).json({ message: "Recommender email not found in system!" });
        }
        if (err.message === "Recommender email not provided") {
            return res.status(400).json({ message: "Please provide a recommender email." });
        }

        return res.status(500).json({ message: "Database error during booking: " + err.message });
    }
};

exports.getUserEvents = async (req, res) => {
    const userId = req.params.id;

    try {
        // Await the promise from the model
        const bookings = await bookingModel.getUserBookings(userId);
        
        const today = new Date();
        today.setHours(0, 0, 0, 0); 

        const categorizedEvents = bookings.map(event => {
            const startDate = new Date(event.start_date);
            let category = "";

            // Important: Ensure event.booking_status matches your DB column name exactly
            if (event.booking_status === 'pending') {
                category = "pending";
            } else if (event.booking_status === 'approved') {
                category = startDate >= today ? "upcoming" : "past";
            } else {
                category = event.booking_status; 
            }

            return {
                ...event,
                title: event.event_name, // Map event_name to title if needed for frontend
                category: category 
            };
        });

        res.status(200).json(categorizedEvents);

    } catch (err) {
        console.error("User Events Error:", err);
        return res.status(500).json({ message: "Database error: " + err.message });
    }
};