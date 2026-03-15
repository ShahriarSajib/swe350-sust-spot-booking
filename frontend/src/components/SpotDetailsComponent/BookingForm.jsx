import React from 'react';

export default function BookingForm({ bookingData, setBookingData, personalDetails, bookingType }) {
    return (
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
                                value={personalDetails.contact}
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
    );
}