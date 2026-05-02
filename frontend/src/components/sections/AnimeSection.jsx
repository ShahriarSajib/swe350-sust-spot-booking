import { useState } from "react";
import animeImg from "../../assets/anime.png";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import axios from "axios";
import { useEffect } from "react";

const AnimeSection = () => {
    const navigate = useNavigate();

    const userType = localStorage.getItem("userType");

    // UI Toggle States
    const [category, setCategory] = useState("auditorium");
    const [isMultiple, setIsMultiple] = useState(false);

    // Form Data States
    const [selectedSpot, setSelectedSpot] = useState("Central Auditorium");
    const [searchDate, setSearchDate] = useState("");
    const [searchEndDate, setSearchEndDate] = useState("");
    const [searchSession, setSearchSession] = useState("Day");
    // NEW: States to store fetched spot data
    const [spotData, setSpotData] = useState({ id: null, max_booking: 0 });

    const [validationError, setValidationError] = useState("");
    // NEW: Fetch spot details whenever the selected name changes
    useEffect(() => {
        const fetchSpotId = async () => {
            try {
                // Use encodeURIComponent for names with spaces
                const response = await axios.get(`http://localhost:5000/api/spots/details/${encodeURIComponent(selectedSpot)}`);
                if (response.data.success) {
                    setSpotData({
                        id: response.data.data.id,
                        max_booking: response.data.data.max_booking
                    });
                }
            } catch (err) {
                console.error("Error fetching spot details:", err);
            }
        };

        fetchSpotId();
    }, [selectedSpot]);

    // Dynamic spots logic
    const spots = category === "auditorium"
        ? (userType === "external" ? ["Central Auditorium"] : ["Central Auditorium", "Mini Auditorium"])
        : (userType === "external" ? [] : ["Central Field", "Handball Ground", "Basketball Ground"]);


    // Calculate the difference in days
    const dayDifference = (searchDate && searchEndDate)
        ? (new Date(searchEndDate) - new Date(searchDate)) / (1000 * 60 * 60 * 24) + 1
        : 0;

    const isLimitExceeded = isMultiple && dayDifference > (spotData.max_booking || 5);
    // const isDateInvalid = isMultiple && dayDifference <= 0 && searchEndDate !== "";

    // Navigation Handler
    const handleNavigation = () => {

        // Clear previous errors first
        setValidationError("");

        // NEW: External user restriction check
        if (userType === "external" && selectedSpot !== "Central Auditorium") {
            setValidationError("External users are only allowed to book the Central Auditorium.");
            return;
        }

        if (!searchDate) {
            setValidationError("Please select a date first");
            return;
        }

        if (!searchDate) {
            setValidationError("Please select a date first");
            return;
        }
        // Only navigate if at least the start date is selected
        if (isLimitExceeded) return;

        navigate(`/spot/${spotData.id}`, {
            state: {
                selectedSpot: selectedSpot,
                date: searchDate,          // String "YYYY-MM-DD"
                endDate: searchEndDate,    // String "YYYY-MM-DD"
                session: searchSession,
                isMultiple: isMultiple
            }
        });
    };
    console.log("Selected Spot:", selectedSpot);


    return (
        <section className="w-full font-sans">
            {/* 1. Hero Image Section */}
            <div
                className="w-full h-[50vh] bg-cover bg-center relative"
                style={{ backgroundImage: `url(${animeImg})` }}
            >
                <div className="absolute inset-0 bg-black/10"></div>
            </div>

            <div className="relative w-full">
                {/* 2. PRO SEARCH BOX */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[15%] w-11/12 lg:w-[80%] z-30">
                    <div className="bg-white/10 backdrop-blur-2xl p-1 rounded-3xl border border-white/30 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]">
                        <div className="bg-white/80 backdrop-blur-md rounded-[22px] p-6 lg:p-8">

                            {/* Toggle Row */}
                            <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
                                <div className="inline-block text-xl font-black text-blue-900">
                                    Search for booking
                                </div>
                                <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200">
                                    <button
                                        onClick={() => { setCategory("auditorium"); setSelectedSpot("Central Auditorium"); }}
                                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${category === 'auditorium' ? 'bg-white text-blue-900 shadow-sm' : 'text-slate-500 hover:text-blue-700'}`}
                                    >
                                        Auditorium
                                    </button>

                                    <button
                                        disabled={userType === "external"} // Disable button for external
                                        onClick={() => { setCategory("field"); setSelectedSpot("Central Field"); }}
                                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${category === 'field' ? 'bg-white text-blue-900 shadow-sm' : 'text-slate-500 hover:text-blue-700'
                                            } ${userType === "external" ? 'opacity-50 cursor-not-allowed' : ''}`} // Add styling
                                    >
                                        Field
                                    </button>
                                </div>


                                <div className="flex gap-8 items-center text-slate-600 font-semibold text-sm">
                                    <label className="flex items-center gap-2 cursor-pointer hover:text-blue-700 transition-colors">
                                        <input
                                            type="radio"
                                            name="days"
                                            checked={!isMultiple}
                                            onChange={() => setIsMultiple(false)}
                                            className="w-4 h-4 accent-green-600"
                                        />
                                        Single Day
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer hover:text-blue-700 transition-colors">
                                        <input
                                            type="radio"
                                            name="days"
                                            checked={isMultiple}
                                            onChange={() => setIsMultiple(true)}
                                            className="w-4 h-4 accent-green-600"
                                        />
                                        {/* Dynamic Label based on backend data */}
                                        Multiple Days (Max {spotData.max_booking || 5} days)
                                    </label>
                                </div>
                                {validationError && (
                                    <p className="text-red-500 text-sm font-bold animate-bounce">
                                        ⚠️ {validationError}
                                    </p>
                                )}

                                {/* Error message area */}
                                <div className="min-h-[20px]"> {/* Fixed height prevents layout jump */}
                                    {(validationError || (userType === "external" && category === "field")) && (
                                        <p className="text-red-500 text-sm font-bold animate-pulse">
                                            ⚠️ {validationError || "Fields are not available for external bookings."}
                                        </p>
                                    )}
                                </div>

                                {/* ERROR MESSAGE DISPLAY */}
                                {isLimitExceeded && (
                                    <span className="text-red-500 text-[15px] font-bold uppercase mt-2">
                                        ⚠️ Max {spotData.max_booking} days allowed (Selected: {dayDifference} days)
                                    </span>
                                )}

                            </div>

                            {/* Input Grid */}
                            <div className="flex flex-col lg:flex-row items-stretch gap-0 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                                <div className="flex-1 p-4 border-b lg:border-b-0 lg:border-r border-slate-100 hover:bg-slate-50 transition-colors">
                                    <label className="block text-[10px] font-black text-blue-900 uppercase tracking-widest mb-1">Select Spot</label>
                                    <select
                                        value={selectedSpot}
                                        onChange={(e) => setSelectedSpot(e.target.value)}
                                        className="w-full outline-none bg-transparent text-slate-700 font-bold text-lg appearance-none cursor-pointer"
                                    >
                                        {spots.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>

                                <div className="flex-[1.5] flex flex-col md:flex-row border-b lg:border-b-0 lg:border-r border-slate-100">
                                    <div className="flex-1 p-4 border-b md:border-b-0 md:border-r border-slate-100 hover:bg-slate-50 transition-colors">
                                        <label className="block text-[10px] font-black text-blue-900 uppercase tracking-widest mb-1">{isMultiple ? "Start Date" : "Date"}</label>
                                        {/* <input 
                                            type="date" 
                                            value={searchDate}
                                            onChange={(e) => setSearchDate(e.target.value)}
                                            className="w-full outline-none bg-transparent text-slate-700 font-bold" 
                                        /> */}
                                        <div className="flex items-center justify-between">
                                            <input
                                                type="date"
                                                value={searchDate}
                                                onChange={(e) => setSearchDate(e.target.value)}
                                                className="w-full outline-none bg-transparent text-slate-700 font-bold"
                                            />
                                            {searchDate && (
                                                <X
                                                    size={16}
                                                    className="text-slate-400 hover:text-red-500 cursor-pointer"
                                                    onClick={() => setSearchDate("")}
                                                />
                                            )}
                                        </div>
                                    </div>
                                    {isMultiple && (
                                        <div className="flex-1 p-4 hover:bg-slate-50 transition-colors">
                                            <label className="block text-[10px] font-black text-blue-900 uppercase tracking-widest mb-1">End Date</label>
                                            <div className="flex items-center justify-between">
                                                <input
                                                    type="date"
                                                    value={searchEndDate}
                                                    onChange={(e) => setSearchEndDate(e.target.value)}
                                                    className="w-full outline-none bg-transparent text-slate-700 font-bold"
                                                />
                                                {searchEndDate && (
                                                    <X
                                                        size={16}
                                                        className="text-slate-400 hover:text-red-500 cursor-pointer"
                                                        onClick={() => setSearchEndDate("")}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 p-4 border-b lg:border-b-0 lg:border-r border-slate-100 hover:bg-slate-50 transition-colors">
                                    <label className="block text-[10px] font-black text-blue-900 uppercase tracking-widest mb-1">Session</label>
                                    <select
                                        value={searchSession}
                                        onChange={(e) => setSearchSession(e.target.value)}
                                        className="w-full outline-none bg-transparent text-slate-700 font-bold appearance-none cursor-pointer"
                                    >
                                        <option value="Day">Day</option>
                                        <option value="Night">Night</option>
                                        <option value="Full Day + Night">Full Day + Night</option>
                                    </select>
                                </div>

                                <button
                                    onClick={handleNavigation}
                                    className="bg-[#00a651] hover:bg-green-700 text-white px-12 py-5 font-black text-sm uppercase tracking-[0.2em] transition-all active:scale-95"
                                >
                                    Search
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. PROFESSIONAL WELCOME SECTION */}
                <div className="bg-[#0a192f] w-full pt-64 pb-24 px-4 overflow-hidden relative">
                    <div className="max-w-4xl mx-auto text-center relative z-10">
                        <div className="inline-block px-4 py-1.5 mb-6 rounded-full border border-blue-400/30 bg-blue-500/10">
                            <span className="text-blue-400 text-[10px] font-bold uppercase tracking-[0.3em]">Official SUST Spot Management</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
                            A Smarter Way to <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">Reserve Your Space.</span>
                        </h1>
                        <p className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
                            Experience a seamless booking process for SUST events. Secure the best auditoriums and fields with real-time availability tracking.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AnimeSection;