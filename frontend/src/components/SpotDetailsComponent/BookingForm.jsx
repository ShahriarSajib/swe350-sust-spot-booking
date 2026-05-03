import React, { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';


export default function BookingForm({ bookingData, setBookingData, personalDetails, bookingType }) {
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [recommenderError, setRecommenderError] = useState("");
    const [generalError, setGeneralError] = useState("");
    const [hasSignature, setHasSignature] = useState(true);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Update the state
        const updatedData = {
            ...bookingData,
            [name]: value
        };
        setBookingData(updatedData);
        //  localStorage.setItem("draftBooking", JSON.stringify(updatedData));

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
            spotName: bookingData.spotName,
            date: bookingData.date,
            startDate: bookingData.startDate,
            endDate: bookingData.endDate,
            session: bookingData.session
        });
        setShowSuccessModal(false);
    };

    //fetch user profile to check if signature exists
    useEffect(() => {
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token"); // Get your stored token

        // if (!userId || !token) {
        //     console.error("Missing userId or token");
        //     setHasSignature(false);
        //     return;
        // }

        axios.get(`http://localhost:5000/api/users/profile/${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                console.log("User profile data:", res.data);
                if (!res.data.signature) {
                    setHasSignature(false);
                } else {
                    setHasSignature(true);
                }
            })
            .catch(err => {
                console.error("Error checking signature:", err);
            });
    }, []);

    const handleConfirmClick = () => {
        if (!hasSignature) {
            setGeneralError("Signature required. Please upload it in your profile before booking.");
            return;
        }
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
                setShowSuccessModal(true);
                console.log("Booking successful:", res.data);
            })
            .catch(err => {
                const errorMsg = err.response?.data?.message || "";
                if (errorMsg.toLowerCase().includes("recommender")) {
                    setRecommenderError("⚠️ Recommender email not registered.");
                } else {
                    setGeneralError(errorMsg || "Booking failed.");
                }
            });
        // localStorage.removeItem("draftBooking");
    };


    return (
        <div className="mt-6 border-t pt-6 relative">
            <h2 className="text-xl font-bold mb-6 text-slate-800">Booking Details</h2>
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

                                {/* error */}
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

                {/*MODAL 1: SIGNATURE MISSING WARNING*/}
                {!hasSignature && (
                    <div className="bg-red-50 border-2 border-red-100 p-6 rounded-2xl flex items-start gap-4 animate-pulse">
                        <div className="bg-red-500 text-white p-2 rounded-full">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-red-800 font-black uppercase text-xs tracking-widest mb-1">Signature Required</h3>
                            <p className="text-red-600 text-sm font-medium">
                                Your digital signature is missing. To maintain security, you must
                                <Link to="/profile" className="underline ml-1 font-bold hover:text-red-800 transition-colors">
                                    go to your profile
                                </Link> and upload your signature before you can submit any booking requests.
                            </p>
                        </div>
                    </div>
                )}

                {/*MODIFIED SUBMIT BUTTON*/}
                <button
                    type="button"
                    onClick={handleConfirmClick}
                    disabled={!hasSignature}
                    className={`w-full py-4 rounded-2xl font-bold text-lg transition-all shadow-md mt-4 active:scale-[0.98] ${hasSignature
                        ? "bg-[#0052cc] text-white hover:bg-blue-700 hover:shadow-xl"
                        : "bg-slate-200 text-slate-400 cursor-not-allowed"
                        }`}
                >
                    Confirm Booking Request
                </button>
            </form>

            {/*MODAL 1: ARE YOU SURE?*/}
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

            {/*MODAL 2: SUCCESS MESSAGE*/}
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