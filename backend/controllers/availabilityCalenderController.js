const bookingModel = require('../models/availabilityCalenderModel');


const getDatesInRange = (startDate, endDate) => {
    const dates = [];
    let curr = new Date(startDate);
    const last = new Date(endDate || startDate);
    while (curr <= last) {
        const yyyy = curr.getFullYear();
        const mm = String(curr.getMonth() + 1).padStart(2, '0');
        const dd = String(curr.getDate()).padStart(2, '0');
        dates.push(`${yyyy}-${mm}-${dd}`);
        curr.setDate(curr.getDate() + 1);
    }
    return dates;
};

const getSpotAvailability = (req, res) => {
    const { spotId } = req.params;

    
    bookingModel.getBookingsBySpotId(spotId, (err, bookings) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Server Error" });
        }

        const onlyDay = [];
        const onlyNight = [];
        const fullBooked = [];
        const pending = [];

        bookings.forEach(booking => {
            const dateList = getDatesInRange(booking.start_date, booking.end_date);

            dateList.forEach(date => {
                if (booking.booking_status === 'pending') {
                    if (!pending.includes(date)) pending.push(date);
                } 
                else if (booking.booking_status === 'approved') {
                    if (booking.session === 'day+night') {
                        if (!fullBooked.includes(date)) fullBooked.push(date);
                    } else if (booking.session === 'day') {
                        if (!onlyDay.includes(date)) onlyDay.push(date);
                    } else if (booking.session === 'night') {
                        if (!onlyNight.includes(date)) onlyNight.push(date);
                    }
                }
            });
        });

        res.json({
            onlyDay,
            onlyNight,
            fullBooked,
            pending,
            partial: [...onlyDay, ...onlyNight]
        });
    });
};

module.exports = { getSpotAvailability };