import React from 'react';
import { DayPicker } from "react-day-picker";
import { Calendar as CalendarIcon } from "lucide-react";
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
        
        bookingData
}) {

    // ক্যালেন্ডারের বর্তমান স্ট্যাটাস বের করা
    const status = getStatus(selectedDate);
    const isFull = status === "full";
    const isPending = status === "pending";
    const isOnlyDay = status === "onlyDay";
    const isOnlyNight = status === "onlyNight";
    const isAvailable = status === "available";

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
                            {isOnlyDay && <div className="bg-teal-50 p-3 rounded">🌞 Only Day Session available</div>}
                            {isOnlyNight && <div className="bg-teal-50 p-3 rounded">🌙 Only Night Session available</div>}
                            {isAvailable && <div className="bg-green-50 p-3 rounded">✅ Fully available</div>}
                        </div>
                    )}

                    {/* Session Selection Radios */}
                    {(!isFull || bookingType === "multiple") && (
                        <div className="space-y-2">
                            {[
                                { id: "day", label: "Day", disabled: bookingType === "single" && isOnlyNight },
                                { id: "night", label: "Night", disabled: bookingType === "single" && isOnlyDay },
                                { id: "day+night", label: "Full Day", disabled: bookingType === "single" && (isOnlyDay || isOnlyNight) },
                            ].map((o) => (
                                <label
                                    key={o.id}
                                    className={`block border p-3 rounded cursor-pointer transition-colors ${o.disabled ? "opacity-30 cursor-not-allowed bg-gray-50" : "hover:bg-gray-50"
                                        } ${session === o.id ? "border-teal-500 bg-teal-50" : "border-gray-200"}`}
                                >
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
                                        className="mr-2 accent-teal-600"
                                    />
                                    <span className={`text-sm ${session === o.id ? "font-bold text-teal-700" : "text-gray-700"}`}>
                                        {o.label}
                                    </span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>
            )}
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