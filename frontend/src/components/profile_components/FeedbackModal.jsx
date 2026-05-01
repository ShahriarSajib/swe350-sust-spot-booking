import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import axios from 'axios';

export default function FeedbackModal({ bookingId, onClose }) {

    console.log("Feedback Modal Opened for Booking ID:", bookingId);
    const [feedback, setFeedback] = useState('');
    const [loading, setLoading] = useState(false);
    const [statusMsg, setStatusMsg] = useState('');

    const handleSubmit = async () => {
        if (!feedback.trim()) return;

        setLoading(true);
        setStatusMsg(''); // Reset message

        try {
            const res = await axios.post('http://localhost:5000/api/events/feedback', {
                booking_id: bookingId,
                feedback: feedback
            });

            setStatusMsg(res.data.message);

            setTimeout(() => onClose(), 2000);

        } catch (err) {
            const errorMsg = err.response?.data?.message || "Something went wrong";
            setStatusMsg(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            {/* Overlay */}
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>

            {/* Modal Content */}
            <div className="relative bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gray-50 p-4 border-b flex justify-between items-center">
                    <h3 className="font-bold text-gray-800">Event Feedback</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                </div>

                <div className="p-6">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                        Your Experience
                    </label>

                    <textarea
                        className="w-full h-32 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none text-sm transition-all"
                        placeholder="How was the event? Any suggestions for improvement?"
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        disabled={loading || statusMsg.includes("successfully")}
                    />

                    
                    {statusMsg && (
                        <div className={`mt-3 p-3 rounded-lg text-xs font-medium border ${statusMsg.includes("successfully")
                                ? "bg-green-50 text-green-700 border-green-200"
                                : "bg-red-50 text-red-700 border-red-200"
                            }`}>
                            {statusMsg}
                        </div>
                    )}

                    <div className="mt-6 flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2 text-sm font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition-all"
                        >
                            Cancel
                        </button>

                        {!statusMsg.includes("successfully") && (
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="flex-1 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                            >
                                {loading ? "Submitting..." : <><Send size={16} /> Submit</>}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}