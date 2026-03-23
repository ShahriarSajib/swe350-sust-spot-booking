import React from 'react';
import { DayPicker } from "react-day-picker";
import { Calendar as CalendarIcon ,X} from "lucide-react";
// import { isSameDay, parseISO } from "date-fns";
import BookingForm from "./BookingForm";

export default function BookingCalendar({
    bookingType,
    setBookingType,
    selectedDate,
    setSelectedDate,
    dateRange,
    setDateRange,
    session,
    setSession,
    setBookingData,
    setShowForm,
    dateError,
    setDateError,
    spot,
    formatLocalDate,
    disableDay,
    fullBooked,
    partial,
    pending,
    getStatus,
    isDateInList,
    showForm,
    personalDetails,
    bookingData,
        isConflict
}) {


    const status = getStatus(selectedDate);
    const isFull = status === "full";
    const isPending = status === "pending";
    const isOnlyDay = status === "onlyDay";
    const isOnlyNight = status === "onlyNight";
    const isAvailable = status === "available";

   

    const getDetailedRangeStatus = () => {
        if (bookingType === "single") {
            if (!selectedDate) return null;
            const s = getStatus(selectedDate);
            return {

                canSelectDay: s === "available" || s === "pending" || s === "onlyNight",
                canSelectNight: s === "available" || s === "pending" || s === "onlyDay",

                canSelectFullDay: s === "available" || s === "pending",
                isSingle: true
            };
        }

        if (bookingType !== "multiple" || !dateRange.from || !dateRange.to) return null;

        let datesInRange = [];
        let tempDate = new Date(dateRange.from);
        while (tempDate <= dateRange.to) {
            datesInRange.push({
                date: formatLocalDate(new Date(tempDate)),
                status: getStatus(new Date(tempDate))
            });
            tempDate.setDate(tempDate.getDate() + 1);
        }

        const fullBookedDates = datesInRange.filter(d => d.status === "full");
        const onlyDayDates = datesInRange.filter(d => d.status === "onlyDay"); 
        const onlyNightDates = datesInRange.filter(d => d.status === "onlyNight"); 
        const hasFullBooked = fullBookedDates.length > 0;
        const hasMixedConflict = onlyDayDates.length > 0 && onlyNightDates.length > 0;

        
        const canSelectDay = !hasFullBooked && onlyDayDates.length === 0;
        const canSelectNight = !hasFullBooked && onlyNightDates.length === 0;
        const canSelectFullDay = !hasFullBooked && onlyDayDates.length === 0 && onlyNightDates.length === 0;

        return {
            fullBookedDates,
            onlyDayDates,
            onlyNightDates,
            hasFullBooked,
            hasMixedConflict,
            canSelectDay,
            canSelectNight,
            canSelectFullDay
        };
    };

    

    const rangeStatus = getDetailedRangeStatus();

    console.log("isFull:", isFull, "isPending:", isPending, "isOnlyDay:", isOnlyDay, "isOnlyNight:", isOnlyNight, "isAvailable:", isAvailable);



    return (
        <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-6">
            {/* Booking Type Toggle */}
            <div className="flex bg-gray-100 rounded-full p-1 mb-4">
                {["single", "multiple"].map((t) => (
                    <button
                        key={t}
                        onClick={() => setBookingType(t)}
                        className={`flex-1 py-2 rounded-full font-semibold transition-all ${bookingType === t ? "bg-white shadow text-teal-700" : "text-gray-500"
                            }`}
                    >
                        {t === "single" ? "Single Day" : "Multiple Days"}
                    </button>
                ))}
            </div>

            {/* Informational Messages */}
            {bookingType === "single" && !selectedDate && (
                <div className="mb-4 bg-blue-50 text-blue-700 p-3 rounded-lg text-sm">
                    📅 Please pick a date from the calendar
                </div>
            )}
            {bookingType === "multiple" && (
                <div className="mb-4 bg-purple-50 text-purple-700 p-3 rounded-lg text-sm">
                    📆 Please select a date range (Maximum 5 days)
                </div>
            )}

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
                                setDateRange({ from: value.from, to: null });
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

            {/* Date info & Session Selection */}
            {(selectedDate || (bookingType === "multiple" && dateRange.from)) && (
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

                    {dateError && (
                        <div className="mb-4 bg-red-50 text-red-700 p-3 rounded-lg text-sm font-bold border border-red-200">
                            {dateError}
                        </div>
                    )}


                    {bookingType === "single" && (
                        <div className="space-y-2">

                            {isFull && <div className="bg-red-50 text-red-700 p-3 rounded">❌ This date is fully booked</div>}
                            {isPending && <div className="bg-yellow-50 text-yellow-800 p-3 rounded">⏳ Some booking requests are pending</div>}
                            {isOnlyDay && <div className="bg-teal-50 p-3 rounded">🌙 Only Night Session available</div>}
                            {isOnlyNight && <div className="bg-teal-50 p-3 rounded">🌞 Only Day Session available</div>}
                            {isAvailable && <div className="bg-green-50 p-3 rounded">✅ Fully available</div>}
                        </div>
                    )}

                    {/* Session Selection Radios */}
                    {bookingType === "multiple" && rangeStatus && (
                        <div className="mt-4 space-y-3 text-sm">

                            {/* Type 1: Fully Booked Message */}
                            {rangeStatus.hasFullBooked && (
                                <div className="bg-red-100 text-red-700 p-3 rounded-lg border border-red-200">
                                    <strong>❌ Fully Booked:</strong> The following dates are unavailable:
                                    {rangeStatus.fullBookedDates.map(d => d.date).join(", ")}.
                                    Please choose another range.
                                </div>
                            )}

                            {/* Type 2: Mixed Conflict (Day and Night both booked in different dates) */}
                            {!rangeStatus.hasFullBooked && rangeStatus.hasMixedConflict && (
                                <div className="bg-orange-100 text-orange-700 p-3 rounded-lg border border-orange-200">
                                    <strong>⚠️ Combined Conflict:</strong>
                                    On {rangeStatus.onlyDayDates.map(d => d.date).join(", ")}, Day is booked.
                                    But on {rangeStatus.onlyNightDates.map(d => d.date).join(", ")}, Night is booked.
                                    No session is available for this entire range.
                                </div>
                            )}

                            {/* Type 3: Night is booked on some dates (Only Day possible) */}
                            {!rangeStatus.hasFullBooked && rangeStatus.onlyDayDates.length > 0 && !rangeStatus.hasMixedConflict && (
                                <div className="bg-blue-50 text-blue-700 p-3 rounded-lg border border-blue-100">
                                    <strong>🌞 Day Booked:</strong> Day session is already booked on {rangeStatus.onlyDayDates.map(d => d.date).join(", ")}.
                                    You can only select the <strong>Night Session</strong> for this range.
                                </div>
                            )}

                            {/* Type 4: Day is booked on some dates (Only Night possible) */}
                            {!rangeStatus.hasFullBooked && rangeStatus.onlyNightDates.length > 0 && !rangeStatus.hasMixedConflict && (
                                <div className="bg-indigo-50 text-indigo-700 p-3 rounded-lg border border-indigo-100">
                                    <strong>🌙 Night Booked:</strong> Night session is already booked on {rangeStatus.onlyNightDates.map(d => d.date).join(", ")}.
                                    You can only select the <strong>Day Session</strong> for this range.
                                </div>
                            )}

                            {/* Type 5: Perfectly Available */}
                            {!rangeStatus.hasFullBooked && !rangeStatus.onlyDayDates.length && !rangeStatus.onlyNightDates.length && (
                                <div className="bg-green-50 text-green-700 p-3 rounded-lg border border-green-100">
                                    ✅ All dates in this range are fully available for all sessions.
                                </div>
                            )}

                        </div>
                    )}
                </div>
            )}
            {!showForm && rangeStatus && (
                <div className="mt-6 space-y-2">
                    <p className="font-bold text-gray-700 mb-2">Select Session:</p>
                    {[
                        { id: "day", label: "Day", canSelect: rangeStatus.canSelectDay },
                        { id: "night", label: "Night", canSelect: rangeStatus.canSelectNight },
                        { id: "day+night", label: "Full Day + Night", canSelect: rangeStatus.canSelectFullDay },
                    ].map((o) => (
                        <label
                            key={o.id}
                            className={`block border p-3 rounded-xl transition-all ${!o.canSelect ? "opacity-30 cursor-not-allowed bg-gray-50" : "hover:bg-teal-50 cursor-pointer"
                                } ${session === o.id ? "border-teal-500 bg-teal-50 ring-1 ring-teal-500" : "border-gray-200"}`}
                        >
                            <input
                                type="radio"
                                name="session"
                                value={o.id}
                                disabled={!o.canSelect}
                                checked={session === o.id}
                                onChange={(e) => {
                                    const selectedValue = e.target.value;
                                    setSession(selectedValue);
                                    setBookingData((prev) => ({
                                        ...prev,
                                        session: selectedValue,
                                    }));
                                }}
                                className="mr-2 accent-teal-600"
                            />
                            <span className={`text-sm ${session === o.id ? "font-bold text-teal-700" : "text-gray-600"}`}>
                                {o.label} {!o.canSelect && "(Unavailable for range)"}
                            </span>
                        </label>
                    ))}
                </div>
            )}
            {isConflict && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 my-4">
                    <div className="flex items-center">
                        <X className="text-red-500 mr-2" size={20} />
                        <p className="text-red-700 font-bold">
                            {session.toUpperCase()} Session is already booked for one or more selected dates!
                        </p>
                    </div>
                    <p className="text-red-600 text-sm mt-1">Please choose a different session or date range.</p>
                </div>
            )}
            {
                session && !showForm && !dateError && !isConflict && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="mt-6 w-full bg-teal-700 text-white py-3 rounded-xl font-bold hover:bg-teal-800 transition-colors"
                    >
                        Proceed to Book
                    </button>
                )
            }
            {showForm && (
                <div className="mt-8 animate-in fade-in slide-in-from-top-4 duration-500">
                    <BookingForm
                        bookingData={bookingData}
                        setBookingData={setBookingData}
                        personalDetails={personalDetails}
                        bookingType={bookingType}
                    />
                </div>
            )}

        </div>

    );
}