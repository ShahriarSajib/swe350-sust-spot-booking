import { useState, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import {
  MapPin,
  Image as ImageIcon,
  Users,
  BookOpen,
  X,
  Calendar as CalendarIcon,
} from "lucide-react";
import { isSameDay, parseISO } from "date-fns";

import centralAuditorium from "../assets/central_auditorium.png";

import { useLocation } from "react-router-dom";
// import { useEffect } from "react";

import { useParams } from "react-router-dom";



import central_audi1 from "../assets/central_audi1.png";
import central_audi2 from "../assets/central_audi2.png";
import central_audi3 from "../assets/central_audi3.png";
import central_audi4 from "../assets/central_audi4.png";


export default function SpotDetails() {
  /* ---------------- MOCK SPOT DATA ---------------- */
  const { id } = useParams();

  const personalDetails = {
    name: "Sadia Nusrat",
    contactNumber: "01712345678"
  };

  const [spot, setSpot] = useState(null);
  const [rules, setRules] = useState([]);


  // const spot = {
  //   name: "Central Auditorium",
  //   mainImage: centralAuditorium,
  //   description: "Experience luxury at its finest. Our Golden Sands Resort offers a perfect blend of modern amenities and natural beauty.",
  //   capacity: "Up to 50 guests",
  //   locationText: "",
  //   rules: [
  //     "The Central Auditorium can only be used with prior written permission from the appropriate university authority.",
  //     "It is primarily allocated for academic, cultural, and official university programs. Personal or commercial use is strictly prohibited",
  //     "The organizing authority or department must clearly mention the purpose, date, time, and duration of the program while applying for permission.",
  //     "Any kind of political activity, propaganda, or unauthorized gathering is not allowed inside the auditorium.",
  //     "Users must ensure that university property, furniture, sound systems, and other equipment are handled carefully. Any damage will be the responsibility of the organizing body.",
  //     "The auditorium must be vacated on time after the scheduled program without causing disturbance to other university activities.",
  //     "Cleanliness and discipline must be maintained before, during, and after the program.",
  //     "The use of additional sound systems, decorations, or equipment requires prior approval from the authority.",
  //     "The organizing committee must follow all university rules, security guidelines, and instructions given by the auditorium administration.",
  //     "The authority reserves the right to cancel or modify permission if any rule is violated."
  //   ],
  //   gallery: [
  //     central_audi1,
  //     central_audi2,
  //     central_audi3,
  //     central_audi4,
  //   ],
  // };
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
  const onlyDay = ["2026-01-31"];
  const onlyNight = ["2026-01-28"];
  const fullBooked = ["2026-01-13"];
  const pending = ["2026-01-16"];
  const partial = [...onlyDay, ...onlyNight];

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

  // Make sure your date is "midnight" local
  const normalizeDate = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0); // reset time
    return d;
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

  // Status for the currently selected single date
  const status = getStatus(selectedDate);
  const isFull = status === "full";
  const isPending = status === "pending";
  const isOnlyDay = status === "onlyDay";
  const isOnlyNight = status === "onlyNight";
  const isAvailable = status === "available";

  /* Reset logic when toggling between Single and Multiple */
  // useEffect(() => {
  //   setSelectedDate(null);
  //   setDateRange({ from: null, to: null });
  //   setSession("");
  //   setShowForm(false);
  // }, [bookingType]);

  // Inside your BookingPage component:
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative lg:sticky lg:top-6 h-fit">
        {/* IMAGE CONTAINER */}
        <div className="relative">
          <img
            src={`http://localhost:5000/uploads/${spot.display_image}`}
            alt={spot.name}
            className="w-full h-80 object-cover"
          />

          {/* FLOATING GALLERY BUTTON: Positioned below image, on the right */}
          <button
            onClick={() => setShowGallery(true)}
            className="absolute bottom-4 right-4 flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl border border-gray-200 shadow-lg hover:bg-white transition-all group"
          >
            <span className="text-sm font-bold text-gray-800">Spot Gallery</span>
            <div className="flex -space-x-2 ml-1">
              {/* Small stacked image icon effect */}
              <ImageIcon size={16} className="text-[#0052cc]" />
            </div>
          </button>
        </div>

        {/* CONTENT AREA */}
        <div className="p-8 space-y-6">
          <h1 className="text-3xl font-bold">{spot.name}</h1>
          <p className="text-gray-500">
            {spot.description}
          </p>
        </div>

        <div className="flex gap-10">
          <div className="flex gap-3">
            <div className="flex gap-3">
              <MapPin className="text-[#0052cc] mt-1" />
              <div className="flex flex-col items-start">
                <p className="font-bold">Location</p>
                <p className="text-sm text-gray-500 mb-2">{spot.location}</p>

                {/* Updated Blue Button */}
                <button
                  onClick={() => window.open(spot.mapUrl, '_blank')}
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#0052cc] bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl border border-blue-100 transition-all active:scale-95"
                >
                  See location in Google Map
                </button>
              </div>
            </div>
          </div>
        </div>

        <h3 className="font-bold flex gap-2 items-center">
          <BookOpen size={20} className="text-[#0052cc]" /> Usage Rules
        </h3>
        <ul className="grid grid-cols-2 gap-2 text-sm text-gray-500">
          {spot.rules.map((r, i) => (
            <li key={i} className="flex items-center gap-2">
              <span className="text-[#0052cc]">•</span> {r}
            </li>
          ))}
        </ul>
      </div>

      {/* GALLERY MODAL */}
      {/* {showGallery && (
          <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 p-4 animate-in fade-in duration-300">
            <div className="bg-white p-6 rounded-3xl relative max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">Spot Gallery</h2>
                <X
                  onClick={() => setShowGallery(false)}
                  className="text-gray-500 hover:text-black cursor-pointer w-6 h-6"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {spot.gallery.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    className="rounded-2xl w-full h-64 object-cover hover:scale-[1.02] transition-transform"
                    alt="Gallery"
                  />
                ))}
              </div>
            </div>
          </div>
        )} */}
      {/* </div > */}

      {/* ================= RIGHT SECTION ================= */}
      < div className="bg-white rounded-xl shadow-sm border p-6 sticky top-6" >
        {/* Booking Type Toggle */}
        < div className="flex bg-gray-100 rounded-full p-1 mb-4" >
          {
            ["single", "multiple"].map((t) => (
              <button
                key={t}
                onClick={() => setBookingType(t)}
                className={`flex-1 py-2 rounded-full font-semibold ${bookingType === t ? "bg-white shadow text-teal-700" : "text-gray-500"
                  }`}
              >
                {t === "single" ? "Single Day" : "Multiple Days"}
              </button>
            ))
          }
        </div >

        {/* Informational Messages */}
        {
          bookingType === "single" && !selectedDate && (
            <div className="mb-4 bg-blue-50 text-blue-700 p-3 rounded-lg text-sm">
              📅 Please pick a date from the calendar
            </div>
          )
        }
        {
          bookingType === "multiple" && (
            <div className="mb-4 bg-purple-50 text-purple-700 p-3 rounded-lg text-sm">
              📆 Please select a date range for multiple-day booking (Maximum 5 days)
            </div>
          )
        }

        {/* Calendar Legend */}
        <div className="mb-4 flex flex-wrap gap-4 text-sm font-medium">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-red-500"></span>
            <span>Fully Booked</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-yellow-400"></span>
            <span>Partially Booked</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-teal-500"></span>
            <span>Pending</span>
          </div>
        </div>


        {/* Calendar */}
        <DayPicker
          mode={bookingType === "single" ? "single" : "range"}
          selected={bookingType === "single" ? selectedDate : dateRange}
          onSelect={(value) => {
            if (bookingType === "single") {
              if (!value) return;
              setSelectedDate(value);
              setSession("");
              setShowForm(false);
              setBookingData((prev) => ({
                ...prev,
                spotName: spot.name,
                date: formatLocalDate(value),
                startDate: "",
                endDate: "",
                session: "",
              }));
            } else {
              setDateError("");
              if (value?.from && value?.to) {
                const diff = Math.round((value.to - value.from) / (1000 * 60 * 60 * 24)) + 1;
                if (diff > 5) {
                  setDateError(`⚠️ You selected ${diff} days. Maximum 5 days allowed.`);
                  setDateRange({ from: value.from, to: null }); // Reset to only start date
                  return;
                }
              }
              setDateRange(value || { from: null, to: null });
              setSession("");
              setShowForm(false);
              setBookingData((prev) => ({
                ...prev,
                spotName: spot.name,
                date: "",
                startDate: value?.from ? formatLocalDate(value.from) : "",
                endDate: value?.to ? formatLocalDate(value.to) : "",
                session: "",
              }));
            }
          }}
          disabled={disableDay}
          modifiers={{
            full: (d) => isDateInList(d, fullBooked),
            partial: (d) => isDateInList(d, partial),
            pending: (d) => isDateInList(d, pending),
          }}
          modifiersClassNames={{
            full: "rdp-full",
            partial: "rdp-partial",
            pending: "rdp-pending",
          }}


        />

        {/* Date info - FIXED CONDITION HERE */}
        {
          (selectedDate || (bookingType === "multiple" && dateRange.from)) && (
            <div className="mt-6 space-y-4">
              <div className="flex gap-2 font-semibold">
                <CalendarIcon className="text-teal-600" />
                {bookingType === "single" ? (
                  <span>Selected Date: {formatLocalDate(selectedDate)}</span>
                ) : (
                  <span>
                    Selected Dates: {formatLocalDate(dateRange.from)}
                    {dateRange.to && ` → ${formatLocalDate(dateRange.to)}`}
                  </span>
                )}
              </div>

              {/* Availability Badges (Single Day Only) */}
              {/* Informational Messages */}
              {dateError && (
                <div className="mb-4 bg-red-50 text-red-700 p-3 rounded-lg text-sm font-bold  border border-red-200">
                  {dateError}
                </div>
              )}
              {bookingType === "single" && (
                <>
                  {isFull && <div className="bg-red-50 text-red-700 p-3 rounded">❌ This date is fully booked</div>}
                  {isPending && <div className="bg-yellow-50 text-yellow-800 p-3 rounded">⏳ Some booking requests are pending</div>}
                  {isOnlyDay && <div className="bg-teal-50 p-3 rounded">🌞 Only Day Session available</div>}
                  {isOnlyNight && <div className="bg-teal-50 p-3 rounded">🌙 Only Night Session available</div>}
                  {isAvailable && <div className="bg-green-50 p-3 rounded">✅ Fully available</div>}
                </>
              )}

              {/* Session Selection */}
              {(!isFull || bookingType === "multiple") && (
                <div className="space-y-2">
                  {[
                    { id: "day", label: "Day", disabled: bookingType === "single" && isOnlyNight },
                    { id: "night", label: "Night", disabled: bookingType === "single" && isOnlyDay },
                    { id: "day+night", label: "Full Day", disabled: bookingType === "single" && (isOnlyDay || isOnlyNight) },
                  ].map((o) => (
                    <label key={o.id} className={`block border p-3 rounded cursor-pointer ${o.disabled ? "opacity-30 cursor-not-allowed" : "hover:bg-gray-50"}`}>
                      <input
                        type="radio"
                        name="session"
                        value={o.id}
                        disabled={o.disabled}
                        checked={session === o.id}
                        onChange={(e) => {
                          setSession(e.target.value);
                          setBookingData((prev) => ({ ...prev, session: e.target.value }));
                        }}
                        className="mr-2"
                      />
                      {o.label}
                    </label>
                  ))}
                </div>
              )}
            </div>
          )
        }

        {/* Proceed Button */}
        {
          session && !showForm && !dateError && (
            <button
              onClick={() => setShowForm(true)}
              className="mt-6 w-full bg-teal-700 text-white py-3 rounded-xl font-bold hover:bg-teal-800 transition-colors"
            >
              Proceed to Book
            </button>
          )
        }

        {/* Booking Form */}
        {
          showForm && (
            <div className="mt-6 border-t pt-6">
              <h2 className="text-xl font-bold mb-6 text-slate-800">Booking Details</h2>
              <form className="space-y-6">

                {/* --- BASIC INFO BLOCK (Unchanged) --- */}
                <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 mb-2">Basic Info</h3>
                  <div>
                    <label className="block text-sm font-bold text-gray-700">Spot Name</label>
                    <input
                      type="text"
                      value={bookingData.spotName}
                      readOnly
                      className="w-full mt-1 p-3 border border-slate-300 rounded-xl bg-slate-100 text-slate-600 font-medium cursor-not-allowed"
                    />
                  </div>

                  {bookingType === "single" ? (
                    <div>
                      <label className="block text-sm font-bold text-gray-700">Date</label>
                      <input
                        type="text"
                        value={bookingData.date}
                        readOnly
                        className="w-full mt-1 p-3 border border-slate-300 rounded-xl bg-slate-100 text-slate-600 font-medium cursor-not-allowed"
                      />
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700">Start Date</label>
                        <input
                          type="text"
                          value={bookingData.startDate}
                          readOnly
                          className="w-full mt-1 p-3 border border-slate-300 rounded-xl bg-slate-100 text-slate-600 font-medium cursor-not-allowed"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700">End Date</label>
                        <input
                          type="text"
                          value={bookingData.endDate}
                          readOnly
                          className="w-full mt-1 p-3 border border-slate-300 rounded-xl bg-slate-100 text-slate-600 font-medium cursor-not-allowed"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-bold text-gray-700">Session</label>
                    <input
                      type="text"
                      value={bookingData.session}
                      readOnly
                      className="w-full mt-1 p-3 border border-slate-300 rounded-xl bg-slate-100 text-slate-600 font-medium cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* --- 1. PERSONAL DETAILS BLOCK (Grey/Non-Editable - Same as Basic Info) --- */}
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4 shadow-sm">
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                    Personal Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={personalDetails.name}
                        readOnly
                        className="w-full p-3 border border-slate-300 rounded-xl bg-slate-100 text-slate-600 font-medium cursor-not-allowed outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Contact Number</label>
                      <input
                        type="tel"
                        value={personalDetails.contactNumber}
                        readOnly
                        className="w-full p-3 border border-slate-300 rounded-xl bg-slate-100 text-slate-600 font-medium cursor-not-allowed outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* --- 2. DEPT / ORG DETAILS BLOCK (Blue Theme - Editable) --- */}
                <div className="bg-blue-50 p-6 rounded-2xl border-2 border-blue-100 space-y-4 shadow-sm">
                  <h3 className="text-sm font-black uppercase tracking-widest text-[#0052cc] flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#0052cc] rounded-full"></span> Dept / Organization Details
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Department / Organization Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Dept of PME or SUST Sports Club"
                        className="w-full p-3 border border-blue-200 rounded-xl bg-white shadow-sm outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                        onChange={(e) => setBookingData(prev => ({ ...prev, department: e.target.value }))}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-1">
                        <label className="block text-xs font-bold text-slate-700 mb-1">Recommender Name</label>
                        <input type="text" placeholder="Name" className="w-full p-3 border border-blue-200 rounded-xl bg-white shadow-sm outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Designation</label>
                        <input type="text" placeholder="e.g. Professor" className="w-full p-3 border border-blue-200 rounded-xl bg-white shadow-sm outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                        <input type="email" placeholder="recommender@sust.edu" className="w-full p-3 border border-blue-200 rounded-xl bg-white shadow-sm outline-none" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* --- 3. EVENT DETAILS BLOCK (Blue Theme - Editable) --- */}
                <div className="bg-blue-50 p-6 rounded-2xl border-2 border-blue-100 space-y-4 shadow-sm">
                  <h3 className="text-sm font-black uppercase tracking-widest text-[#0052cc] flex items-center gap-2">
                    <span className="w-2 h-2 bg-[#0052cc] rounded-full"></span> Event Details
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Event Title</label>
                      <input
                        type="text"
                        placeholder="Enter event name"
                        className="w-full p-3 border border-blue-200 rounded-xl bg-white shadow-sm outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                        onChange={(e) => setBookingData(prev => ({ ...prev, eventTitle: e.target.value }))}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Approx. Start Time</label>
                        <input type="text" placeholder="e.g. 10:00 AM" className="w-full p-3 border border-blue-200 rounded-xl bg-white shadow-sm outline-none" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Approx. End Time</label>
                        <input type="text" placeholder="e.g. 12:00 PM" className="w-full p-3 border border-blue-200 rounded-xl bg-white shadow-sm outline-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Event Description</label>
                      <textarea
                        rows="3"
                        placeholder="Briefly describe the purpose of your booking..."
                        className="w-full p-3 border border-blue-200 rounded-xl bg-white shadow-sm outline-none resize-none focus:ring-2 focus:ring-blue-100"
                        onChange={(e) => setBookingData(prev => ({ ...prev, eventDescription: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="w-full bg-[#0052cc] text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 hover:shadow-xl active:scale-[0.98] transition-all shadow-md mt-4"
                >
                  Confirm Booking Request
                </button>
              </form>
            </div>

          )
        }
      </div >

      {/* ================= GALLERY MODAL ================= */}
      {/* {showGallery && (
        <div className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 p-4">
          <div className="bg-white p-6 rounded-xl relative max-w-4xl w-full">
            <X onClick={() => setShowGallery(false)} className="absolute -top-10 right-0 text-white cursor-pointer w-8 h-8" />
            <div className="grid grid-cols-2 gap-4">
              {spot.gallery.map((img, i) => (
                <img key={i} src={img} className="rounded-lg w-full h-48 object-cover" alt="Gallery" />
              ))}
            </div>
          </div>
        </div>
      )} */}
    </div >
  );
}