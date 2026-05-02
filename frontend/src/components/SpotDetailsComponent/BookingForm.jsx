import React, { useState } from 'react';
import axios from 'axios';

export default function BookingForm({ bookingData, setBookingData, personalDetails, bookingType }) {
const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [recommenderError, setRecommenderError] = useState("");
    const [generalError, setGeneralError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBookingData(prev => ({
            ...prev,
            [name]: value
        }));
        if (name === "recommenderEmail") setRecommenderError("");
    };

    // 1. Function to clear all fields
    const resetForm = () => {
        setBookingData({
            department: "",
            recommenderName: "",
            designation: "",
            recommenderEmail: "",
            eventTitle: "",
            startTime: "",
            endTime: "",
            eventDescription: "",
            // Keep the read-only data from props if necessary, 
            // or reset them if they come from this local state
            spotName: bookingData.spotName, 
            date: bookingData.date,
            startDate: bookingData.startDate,
            endDate: bookingData.endDate,
            session: bookingData.session
        });
        setShowSuccessModal(false);
    };

    const handleConfirmClick = () => {
        setGeneralError("");
        setShowConfirmModal(true);
    };

    const executeBooking = () => {
        setShowConfirmModal(false);
        setRecommenderError("");

        const userId = localStorage.getItem("userId");
        const spotId = localStorage.getItem("selectedSpotId");

        const payload = {
            userId: userId,
            spotId: spotId,
            organizer: bookingData.department,
            startDate: bookingType === "single" ? bookingData.date : bookingData.startDate,
            endDate: bookingType === "single" ? bookingData.date : bookingData.endDate,
            session: bookingData.session?.toLowerCase() || 'day',
            title: bookingData.eventTitle,
            description: bookingData.eventDescription,
            spotName: bookingData.spotName,
            startTime: bookingData.startTime,
            endTime: bookingData.endTime,
            recommenderEmail: bookingData.recommenderEmail,
            recommenderDesignation: bookingData.designation
        };

        axios.post("http://localhost:5000/api/bookings/confirm", payload)
            .then(res => {
                // Trigger Success Modal instead of an alert
                setShowSuccessModal(true);
            })
            .catch(err => {
                const errorMsg = err.response?.data?.message || "";
                if (errorMsg.toLowerCase().includes("recommender")) {
                    setRecommenderError("⚠️ Recommender email not registered.");
                } else {
                    setGeneralError(errorMsg || "Booking failed.");
                }
            });
    };
    return (
        <div className="mt-6 border-t pt-6 relative">
            <h2 className="text-xl font-bold mb-6 text-slate-800">Booking Details</h2>

            {/* Global Success/Error Messages
            {successMessage && (
                <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-xl font-bold text-center animate-bounce">
                    {successMessage}
                </div>
            )} */}
            {generalError && (
                <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-xl font-bold text-center">
                    Error: {generalError}
                </div>
            )}

            <form className="space-y-6">
                {/* --- BASIC INFO BLOCK --- */}
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

                {/* --- 1. PERSONAL DETAILS BLOCK --- */}
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

                {/* --- 2. DEPT / ORG DETAILS BLOCK (Modified for Recommender UI Error) --- */}
                <div className={`bg-blue-50 p-6 rounded-2xl border-2 space-y-4 shadow-sm transition-colors ${recommenderError ? 'border-red-400 bg-red-50' : 'border-blue-100'}`}>
                    <h3 className={`text-sm font-black uppercase tracking-widest flex items-center gap-2 ${recommenderError ? 'text-red-600' : 'text-[#0052cc]'}`}>
                        <span className={`w-2 h-2 rounded-full ${recommenderError ? 'bg-red-600' : 'bg-[#0052cc]'}`}></span> Dept / Organization Details
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Department / Organization Name</label>
                            <input
                                type="text"
                                name="department"
                                placeholder="e.g. Dept of PME or SUST Sports Club"
                                className="w-full p-3 border border-blue-200 rounded-xl bg-white shadow-sm outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                                onChange={handleChange}
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-1">
                                <label className="block text-xs font-bold text-slate-700 mb-1">Recommender Name</label>
                                <input type="text" name="recommenderName" placeholder="Name" className="w-full p-3 border border-blue-200 rounded-xl bg-white shadow-sm outline-none" onChange={handleChange} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Designation</label>
                                <input type="text" name="designation" placeholder="e.g. Professor" className="w-full p-3 border border-blue-200 rounded-xl bg-white shadow-sm outline-none" onChange={handleChange} />
                            </div>
                            {/* Email Input Field inside your Dept/Org Details Block */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    name="recommenderEmail"
                                    placeholder="recommender@sust.edu"
                                    className={`w-full p-3 border rounded-xl bg-white shadow-sm outline-none transition-all ${recommenderError ? 'border-red-500 ring-2 ring-red-100' : 'border-blue-200 focus:ring-2 focus:ring-blue-100'
                                        }`}
                                    onChange={handleChange}
                                />

                                {/* THIS PART SHOWS THE ERROR MESSAGE IN THE UI */}
                                {recommenderError && (
                                    <p className="text-red-600 text-[11px] font-bold mt-2 flex items-center gap-1 animate-pulse">
                                        {recommenderError}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- 3. EVENT DETAILS BLOCK --- */}
                <div className="bg-blue-50 p-6 rounded-2xl border-2 border-blue-100 space-y-4 shadow-sm">
                    <h3 className="text-sm font-black uppercase tracking-widest text-[#0052cc] flex items-center gap-2">
                        <span className="w-2 h-2 bg-[#0052cc] rounded-full"></span> Event Details
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Event Title</label>
                            <input
                                type="text"
                                name="eventTitle"
                                placeholder="Enter event name"
                                className="w-full p-3 border border-blue-200 rounded-xl bg-white shadow-sm outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                                onChange={handleChange}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Approx. Start Time</label>
                                <input type="text" name="startTime" placeholder="e.g. 10:00 AM" className="w-full p-3 border border-blue-200 rounded-xl bg-white shadow-sm outline-none" onChange={handleChange} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">Approx. End Time</label>
                                <input type="text" name="endTime" placeholder="e.g. 12:00 PM" className="w-full p-3 border border-blue-200 rounded-xl bg-white shadow-sm outline-none" onChange={handleChange} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Event Description</label>
                            <textarea
                                rows="3"
                                name="eventDescription"
                                placeholder="Briefly describe the purpose of your booking..."
                                className="w-full p-3 border border-blue-200 rounded-xl bg-white shadow-sm outline-none resize-none focus:ring-2 focus:ring-blue-100"
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={handleConfirmClick}
                    className="w-full bg-[#0052cc] text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 hover:shadow-xl active:scale-[0.98] transition-all shadow-md mt-4"
                >
                    Confirm Booking Request
                </button>
            </form>

            {/* --- MODAL 1: ARE YOU SURE? --- */}
            {showConfirmModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl">
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Confirm Booking?</h3>
                        <p className="text-slate-500 mb-6 text-sm">Are you sure you want to submit this request?</p>
                        <div className="flex gap-3">
                            <button onClick={() => setShowConfirmModal(false)} className="flex-1 py-3 rounded-xl font-bold text-slate-600 bg-slate-100">Cancel</button>
                            <button onClick={executeBooking} className="flex-1 py-3 rounded-xl font-bold text-white bg-[#0052cc]">Yes, Confirm</button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- MODAL 2: SUCCESS MESSAGE --- */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center border-t-8 border-green-500">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Success!</h3>
                        <p className="text-slate-500 mb-6 text-sm">Your booking request has been submitted successfully.</p>
                        <button 
                            onClick={resetForm} 
                            className="w-full py-3 rounded-xl font-bold text-white bg-green-600 hover:bg-green-700 transition-colors shadow-lg shadow-green-200"
                        >
                            Okay
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}