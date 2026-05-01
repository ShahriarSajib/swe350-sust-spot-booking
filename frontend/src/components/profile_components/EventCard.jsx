import { Calendar, MapPin, PenLine, Users } from "lucide-react";
import React from "react";
import { useState } from "react";
import FeedbackModal from "./FeedbackModal";

export default function EventCard({
    event,
    eventCategory,
    onSeeDetails,
    onApprovalCopy,
    onWriteBlog,
    onRecommend,
}) {
    console.log("events: ", event);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const eventDate = new Date(event.start_date);
    const isPast = eventDate < today;

    // Inside your main component:
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
    const [selectedBookingId, setSelectedBookingId] = useState(null);

    const handleFeedbackClick = (bookingId) => {
        setSelectedBookingId(bookingId);
        setIsFeedbackOpen(true);
    };
    return (
        <div className="group bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="space-y-3 w-full">
                <div className="flex items-center gap-3">
                    <h4 className="text-xl font-extrabold text-gray-800">
                        {event.title}
                    </h4>
                    <span className="px-3 py-0.5 bg-sky-50 text-sky-700 text-[10px] font-extrabold uppercase rounded-full border border-sky-100">
                        {event.session}
                    </span>
                    {eventCategory === "all" && (
                        <span
                            className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${event.category === "pending" ? "bg-yellow-50 text-yellow-600 border-yellow-100" : event.category === "past" ? "bg-gray-50 text-gray-600 border-gray-100" : "bg-green-50 text-green-600 border-green-100"}`}
                        >
                            {event.category}
                        </span>
                    )}
                </div>
                <div className="space-y-2.5 text-sm font-semibold text-gray-600">
                    <div className="flex items-center gap-3">
                        <Users size={16} className="text-sky-500/70" />
                        <span className="text-gray-400 text-[10px] w-20">
                            ORGANIZER:
                        </span>{" "}
                        {event.organizer}
                    </div>
                    <div className="flex items-center gap-3">
                        <MapPin size={16} className="text-sky-500/70" />
                        <span className="text-gray-400 text-[10px] w-20">
                            LOCATION:
                        </span>{" "}
                        {event.spot_name}
                    </div>
                    <div className="flex items-center gap-3">
                        <Calendar size={16} className="text-sky-500/70" />
                        <span className="text-gray-400 text-[10px] w-20">DATE:</span>
                        <span className="text-gray-700">
                            {event.start_date}
                            {event.end_date && event.end_date !== event.start_date
                                ? ` to ${event.end_date}`
                                : ""}
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-2 shrink-0 self-center">
                {/* ================= NORMAL EVENTS ================= */}
                {eventCategory !== "recommendations" && (
                    <>
                        {(event.category === "upcoming" ||
                            event.category === "pending") && (
                                <>
                                    <button
                                        onClick={() => onSeeDetails(event)}
                                        className="bg-sky-50 text-sky-600 border border-sky-100 px-3 py-1.5 rounded-md text-[10px] font-bold hover:bg-sky-600 hover:text-white transition-all w-28"
                                    >
                                        See Details
                                    </button>

                                    {event.category === "upcoming" && (
                                        <button
                                            onClick={() => onApprovalCopy(event)}
                                            className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-3 py-1.5 rounded-md text-[10px] font-bold hover:bg-emerald-600 hover:text-white transition-all w-28"
                                        >
                                            Approval Copy
                                        </button>
                                    )}

                                    <button className="bg-red-50 text-red-600 border border-red-100 px-3 py-1.5 rounded-md text-[10px] font-bold hover:bg-red-600 hover:text-white transition-all w-28">
                                        Cancel Request
                                    </button>
                                </>
                            )}

                        {event.category === "past" && (
                            <>
                                <button
                                    onClick={() => onWriteBlog(event)}
                                    className="flex items-center justify-center gap-1.5 bg-sky-50 text-sky-700 border border-sky-100 px-3 py-1.5 rounded-md text-[10px] font-bold w-28"
                                >
                                    <PenLine size={12} /> Write Blog
                                </button>

                                <button
                                    onClick={() => handleFeedbackClick(event.booking_id)} // Pass the booking ID
                                    className="bg-white text-gray-700 border border-gray-200 px-2 py-1.5 rounded-md text-[10px] font-bold hover:bg-gray-800 hover:text-white transition-all w-28"
                                >
                                    Write Feedback
                                </button>

                                {/* Add the Modal component at the bottom */}
                                {isFeedbackOpen && (
                                    <FeedbackModal
                                        bookingId={selectedBookingId}
                                        onClose={() => setIsFeedbackOpen(false)}
                                    />
                                )}
                            </>
                        )}
                    </>
                )}

                {/* ================= RECOMMENDATION MODE ================= */}
                {eventCategory === "recommendations" && (
                    <>
                        <button
                            onClick={() => onSeeDetails(event)}
                            className="bg-sky-50 text-sky-600 border border-sky-100 px-3 py-1.5 rounded-md text-[10px] font-bold hover:bg-sky-600 hover:text-white transition-all w-28"
                        >
                            See Details
                        </button>

                        {/* 🟢 CASE 1: Upcoming & not recommended */}
                        {!isPast && event.is_recommended === 0 && (
                            <button
                                onClick={() => onRecommend(event.booking_id)}
                                className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-3 py-1.5 rounded-md text-[10px] font-bold hover:bg-emerald-600 hover:text-white transition-all w-28"
                            >
                                Recommend
                            </button>
                        )}

                        {/* 🟢 CASE 2: Already recommended */}
                        {event.is_recommended === 1 && (
                            <span className="text-[10px] font-bold text-green-600 text-center">
                                ✅ Recommended
                            </span>
                        )}

                        {/* 🔴 CASE 3: Past & not recommended */}
                        {isPast && event.is_recommended === 0 && (
                            <span className="text-[10px] font-bold text-red-500 text-center">
                                ❌ Not Recommended
                            </span>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
