import { isSameDay, parseISO } from "date-fns";
import { useEffect, useState } from "react";
import "react-day-picker/dist/style.css";
import { useLocation } from "react-router-dom";
// import { useEffect } from "react";
import { useParams } from "react-router-dom";

import BookingCalendar from "../components/SpotDetailsComponent/BookingCalender";
import GalleryModal from "../components/SpotDetailsComponent/GalleryModal";
import SpotInformation from "../components/SpotDetailsComponent/SpotInformations";

export default function SpotDetails() {
  const { id } = useParams();

  const [personalDetails, setPersonalDetails] = useState({
    name: localStorage.getItem("userName") || "",
    contact: localStorage.getItem("userContact") || "",
  });

  const [spot, setSpot] = useState(null);
  const [rules, setRules] = useState([]);

  useEffect(() => {
    const fetchSpot = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/spots/${id}`);
        const data = await res.json();

        const spotData = Array.isArray(data) ? data[0] : data;
        console.log("Fetched Spot Data:", spotData);
        setSpot(spotData);

        if (spotData && spotData.rules) {
          const rulesArray = spotData.rules
            .split("\n\n")
            .map((item) => item.trim())
            .filter((item) => item !== "");

          setRules(rulesArray);
        }
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
      // const spotId = localStorage.getItem('selectedSpotId');
      // if (!spotId) return;
      if (!id) {
        console.error("No spot ID found in URL params");
        return;
      } // we have the spot ID from URL params

      try {
        const response = await fetch(
          `http://localhost:5000/api/availability/${id}`,
        );
        const data = await response.json();

        // Merging logic for onlyDay and onlyNight to identify fullBooked dates
        let rawOnlyDay = data.onlyDay || [];
        let rawOnlyNight = data.onlyNight || [];
        let rawFullBooked = data.fullBooked || [];
        // let rawPartial = data.partial || [];

        const commonDates = rawOnlyDay.filter((date) =>
          rawOnlyNight.includes(date),
        );

        if (commonDates.length > 0) {
          rawFullBooked = [...new Set([...rawFullBooked, ...commonDates])];

          rawOnlyDay = rawOnlyDay.filter((date) => !commonDates.includes(date));
          rawOnlyNight = rawOnlyNight.filter(
            (date) => !commonDates.includes(date),
          );
        }

        const finalPartial = [...new Set([...rawOnlyDay, ...rawOnlyNight])];

        // state updates
        setOnlyDay(rawOnlyDay);
        setOnlyNight(rawOnlyNight);
        setFullBooked(rawFullBooked);
        setPartial(finalPartial);
        setPending(data.pending || []);

        console.log("data:", data);

        console.log("Merged to Red (Full):", commonDates);
      } catch (error) {
        console.error("Error fetching availability:", error);
      }
    };

    fetchAvailability();
  }, [id]); // Add 'id' as a dependency to refetch when spot ID changes

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
      const {
        date,
        endDate,
        session: searchSession,
        isMultiple,
      } = location.state;

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
          spotName: spot?.name,
          date: !isMultiple ? date : "",
          startDate: isMultiple ? date : "",
          endDate: isMultiple ? endDate : "",
          session: sessionId,
        }));
      }
    }
  }, [location.state, spot?.name]);

  // Session Conflict Logic
  const isSessionConflict = () => {
    if (!session || (!selectedDate && !dateRange.from)) return false;

    const checkDate = (dateStr, selectedSession) => {
      if (fullBooked.includes(dateStr)) return true;

      if (selectedSession === "night" && onlyNight.includes(dateStr))
        return true;

      if (selectedSession === "day" && onlyDay.includes(dateStr)) return true;

      if (
        selectedSession === "day+night" &&
        (onlyDay.includes(dateStr) || onlyNight.includes(dateStr))
      )
        return true;

      return false;
    };

    if (bookingType === "single" && selectedDate) {
      return checkDate(formatLocalDate(selectedDate), session);
    } else if (bookingType === "multiple" && dateRange.from && dateRange.to) {
      let curr = new Date(dateRange.from);
      while (curr <= dateRange.to) {
        if (checkDate(formatLocalDate(curr), session)) return true;
        curr.setDate(curr.getDate() + 1);
      }
    }
    return false;
  };
  console.log("Session Conflict:", isSessionConflict());

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
      <SpotInformation spot={spot} setShowGallery={setShowGallery} />

      {/* rendering the modal */}
      {showGallery && (
        <GalleryModal spot={spot} onClose={() => setShowGallery(false)} />
      )}

      {/* ================= RIGHT SECTION ================= */}
      {/* Right Side - Booking Section */}
      <div className="space-y-6">
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
            onlyDay={onlyDay}
            onlyNight={onlyNight}
            getStatus={getStatus}
            isDateInList={isDateInList}
            showForm={showForm}
            personalDetails={personalDetails}
            bookingData={bookingData}
            isConflict={isSessionConflict()}
            max_booking={spot?.max_booking}
          />
        </div>
      </div>
    </div>
  );
}
