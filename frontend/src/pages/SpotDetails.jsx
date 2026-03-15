import { useState, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import {    MapPin,Image as ImageIcon,Users,BookOpen,X,Calendar as CalendarIcon,
} from "lucide-react";
import { isSameDay, parseISO } from "date-fns";
import { useLocation } from "react-router-dom";
// import { useEffect } from "react";
import { useParams } from "react-router-dom";
// import central_audi1 from "../assets/central_audi1.png";
// import central_audi2 from "../assets/central_audi2.png";
// import central_audi3 from "../assets/central_audi3.png";
// import central_audi4 from "../assets/central_audi4.png";

import SpotInformation from "../components/SpotDetailsComponent/SpotInformations";
import BookingCalendar from "../components/SpotDetailsComponent/BookingCalender";
import BookingForm from "../components/SpotDetailsComponent/BookingForm";


export default function SpotDetails() {
    /* ---------------- MOCK SPOT DATA ---------------- */
    const { id } = useParams();

    const [personalDetails, setPersonalDetails] = useState({
    name: localStorage.getItem("userName") || "",
    contact: localStorage.getItem("userContact") || ""
});

    const [spot, setSpot] = useState(null);
    const [rules, setRules] = useState([]);

    useEffect(() => {
        const fetchSpot = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/spots/${id}`);
                const data = await res.json();
                console.log("API DATA:", data);
                setSpot(data);
                setRules(data.rules);
            } catch (err) {
                console.error("Error fetching spot:", err);
            }
        };

        fetchSpot();
    }, [id]);
    console.log("Current Spot State:", spot);
    /* ---------------- BOOKING ARRAYS ---------------- */
    const [onlyDay, setOnlyDay] = useState([]);
    const [onlyNight, setOnlyNight] = useState([]);
    const [fullBooked, setFullBooked] = useState([]);
    const [pending, setPending] = useState([]);
    const [partial, setPartial] = useState([]);
    useEffect(() => {
    const fetchAvailability = async () => {
        
        const spotId = localStorage.getItem('selectedSpotId');
        
        if (!spotId) return;

        try {
            
            const response = await fetch(`http://localhost:5000/api/availability/${spotId}`);
            const data = await response.json();

           
            setOnlyDay(data.onlyDay || []);
            setOnlyNight(data.onlyNight || []);
            setFullBooked(data.fullBooked || []);
            setPending(data.pending || []);
            setPartial(data.partial || []);

            console.log("Availability data loaded:", data);
        } catch (error) {
            console.error("Error fetching availability:", error);
        }
    };

    fetchAvailability();
}, []); 

    /* ---------------- STATE ---------------- */
    const [bookingType, setBookingType] = useState("single");
    const [selectedDate, setSelectedDate] = useState(null);
    const [dateRange, setDateRange] = useState({ from: null, to: null });
    const [session, setSession] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [showGallery, setShowGallery] = useState(false);

    const [bookingData, setBookingData] = useState({
        spotName: "",
        date: "",
        startDate: "",
        endDate: "",
        session: "",
        department: "",
        eventTitle: "",
        eventDescription: "",
    });

    const [dateError, setDateError] = useState("");

    /* ---------------- HELPERS ---------------- */
    const formatLocalDate = (date) => {
        if (!date) return null;
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };



    const isDateInList = (date, list) =>
        list.some((d) => isSameDay(date, parseISO(d)));



    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const getStatus = (date) => {
        if (!date) return null;
        const localDate = formatLocalDate(date);
        if (fullBooked.includes(localDate)) return "full";
        if (pending.includes(localDate)) return "pending";
        if (onlyDay.includes(localDate)) return "onlyDay";
        if (onlyNight.includes(localDate)) return "onlyNight";
        return "available";
    };

 
    const location = useLocation();

    /* Reset logic - ONLY runs if there is no incoming location state */
    useEffect(() => {
        if (!location.state) {
            setSelectedDate(null);
            setDateRange({ from: null, to: null });
            setSession("");
            setShowForm(false);
        }
    }, [bookingType, location.state]); // Added location.state as a dependency

    const disableDay = (date) =>
        date < today || fullBooked.includes(formatLocalDate(date));





    useEffect(() => {
        if (location.state) {
            const { date, endDate, session: searchSession, isMultiple } = location.state;

            // Set the type first
            setBookingType(isMultiple ? "multiple" : "single");

            if (date) {
                // Use parseISO or split to ensure local time zone
                const start = new Date(date + "T00:00:00");

                if (isMultiple && endDate) {
                    const end = new Date(endDate + "T00:00:00");
                    setDateRange({ from: start, to: end });
                } else {
                    setSelectedDate(start);
                }
            }

            // Map Session and Sync Booking Data
            let sessionId = "";
            if (searchSession === "Day") sessionId = "day";
            else if (searchSession === "Night") sessionId = "night";
            else if (searchSession === "Full Day + Night") sessionId = "day+night";

            if (sessionId) {
                setSession(sessionId);
                setBookingData((prev) => ({
                    ...prev,
                    spotName: spot.name,
                    date: !isMultiple ? date : "",
                    startDate: isMultiple ? date : "",
                    endDate: isMultiple ? endDate : "",
                    session: sessionId,
                }));
            }
        }
    }, [location.state, spot?.name]);


    if (!spot) {
        return (
            <div className="flex justify-center items-center h-screen">
                Loading spot details...
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* ================= LEFT SECTION ================= */}
            <div className="lg:sticky lg:top-6 h-fit space-y-6">
                <SpotInformation spot={spot} setShowGallery={() => { }} />
            </div>

            {/* GALLERY MODAL */}

            {/* ================= RIGHT SECTION ================= */}
            {/* Right Side - Booking Section */}
            <div className="space-y-6">
                {/* ক্যালেন্ডার এবং বাটন স্টিকি থাকবে */}
                <div className="lg:sticky lg:top-6 z-10">
                    <BookingCalendar
                        bookingType={bookingType}
                        setBookingType={setBookingType}
                        selectedDate={selectedDate}
                        setSelectedDate={setSelectedDate}
                        dateRange={dateRange}
                        setDateRange={setDateRange}
                        session={session}
                        setSession={setSession}
                        setBookingData={setBookingData}
                        setShowForm={setShowForm}
                        dateError={dateError}
                        setDateError={setDateError}
                        spot={spot}
                        formatLocalDate={formatLocalDate}
                        disableDay={disableDay}
                        fullBooked={fullBooked}
                        partial={partial}
                        pending={pending}
                        getStatus={getStatus}
                        isDateInList={isDateInList}
                        showForm={showForm}
                        personalDetails={personalDetails}
                        bookingData={bookingData}

                    />
                </div>

                
            </div>
        </div >
    );
}