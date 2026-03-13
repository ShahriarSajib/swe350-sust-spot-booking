import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Calendar, XCircle, FileText, MessageSquare, ChevronRight } from 'lucide-react';

const UserNotifications = ({ isOpen, onClose }) => {
    // if (!isOpen) return null;
    const navigate = useNavigate(); // Initialize navigate
    const [selectedReason, setSelectedReason] = React.useState(null);

    const handleClose = () => {
        onClose(); // This calls setShowNotif(false) in App.jsx
    };
    if (!isOpen) return null;


    // This data would eventually come from your backend/API
    const notifications = [
        {
            id: 4,
            type: "booking",
            text: "Your booking request for spot Central Field on date 2024-05-20 has been submitted successfully. Track the booking status in your profile.",
            time: "2 mins ago",
            unread: true
        },
        {
            id: 2,
            type: "reject",
            text: "Admin has rejected your  request for spot Central Field on date 2024-05-18",
            reason: "The field is undergoing maintenance on this specific date.",
            time: "1 hour ago",
            unread: true
        },
        {
            id: 3,
            type: "feedback",
            text: "Your feedback for the event held at Spot Basketball Ground has been received. Thank you for helping us improve!",
            time: "5 hours ago",
            unread: false
        },
        {
            id: 1,
            type: "blog",
            text: "Admin  has published your blog  for the event for BBQ Night you arranged on Spot Basketball Ground on Date  2024-05-18",
            time: "Yesterday",
            unread: false
        }
    ];



    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            {/* Dark Backdrop with Blur */}
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            ></div>

            {/* Notification Box */}
            <div className="relative bg-white w-full max-w-2xl max-h-[80vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">My Notifications</h2>
                        <p className="text-xs text-gray-500 mt-1">Stay updated with user activities</p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Notification List */}
                <div className="overflow-y-auto p-4 space-y-3 bg-gray-50/50">
                    {notifications.map((notif) => (
                        <div
                            key={notif.id}
                            className={`p-4 rounded-2xl border transition-all flex gap-4 ${notif.unread
                                ? "bg-white border-sky-100 shadow-sm"
                                : "bg-gray-50/50 border-transparent opacity-80"
                                }`}
                        >
                            {/* Icon Logic based on Notification Type */}
                            <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${notif.type === 'booking' ? 'bg-emerald-50 text-emerald-600' :
                                notif.type === 'reject' ? 'bg-red-50 text-red-600' :
                                    notif.type === 'blog' ? 'bg-purple-50 text-purple-600' : 'bg-sky-50 text-sky-600'
                                }`}>
                                {notif.type === 'booking' && <Calendar size={20} />}
                                {notif.type === 'reject' && <XCircle size={20} />}
                                {notif.type === 'blog' && <FileText size={20} />}
                                {notif.type === 'feedback' && <MessageSquare size={20} />}
                            </div>

                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-1">
                                    <p className={`text-sm leading-relaxed ${notif.unread ? "text-slate-800 font-semibold" : "text-slate-600"}`}>
                                        {notif.text}
                                    </p>
                                    <span className="text-[10px] text-gray-400 whitespace-nowrap ml-4 uppercase font-bold tracking-tighter">
                                        {notif.time}
                                    </span>
                                </div>

                                {/* Action Button - View Details logic */}
                                {/* Action Button - View Blog logic */}
                                {notif.type === 'blog' && (
                                    <button
                                        onClick={() => {
                                            //onClose(); // 1. Close the notification modal
                                            navigate(`/blog/${notif.blogId || notif.id}`); // 2. Navigate to the blog detail page
                                        }}
                                        className="mt-3 text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 group"
                                    >
                                        View Blog
                                        <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                                    </button>
                                )}
                                {notif.type === 'reject' && (
                                    <button
                                        onClick={() => setSelectedReason(notif.reason)} // Set the reason here
                                        className="mt-3 text-xs font-bold text-red-400 hover:text-red-700 flex items-center gap-1 group"
                                    >
                                        See Reason
                                        <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                                    </button>
                                )}


                            </div>
                        </div>
                    ))}
                </div>
                {selectedReason && (
                    <div className="fixed inset-0 z-[1100] flex items-center justify-center p-6">
                        {/* Darker overlay that dims the Notification Box too */}
                        <div
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] animate-in fade-in duration-200"
                            onClick={() => setSelectedReason(null)}
                        ></div>

                        {/* The Small Reason Card */}
                        <div className="relative bg-white p-8 rounded-3xl max-w-sm w-full shadow-[0_20px_50px_rgba(0,0,0,0.3)] text-center animate-in fade-in zoom-in duration-200">
                            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <XCircle size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Rejection Reason</h3>
                            <p className="text-sm text-slate-600 leading-relaxed mb-6 italic">
                                "{selectedReason}"
                            </p>
                            <button
                                onClick={() => setSelectedReason(null)}
                                className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-black transition-all"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}

                {/* Footer Actions */}
                <div className="p-4 border-t border-gray-100 text-center bg-white">
                    <button className="text-xs font-bold text-gray-400 hover:text-slate-600 uppercase tracking-widest">
                        Mark all as read
                    </button>
                </div>
                {/* {selectedReason && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-md z-[1010] flex items-center justify-center p-6 animate-in fade-in zoom-in duration-200">
                        <div className="bg-white border border-red-100 p-8 rounded-3xl max-w-sm shadow-2xl text-center">
                            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <XCircle size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Rejection Reason</h3>
                            <p className="text-sm text-slate-600 leading-relaxed mb-8 italic">
                                "{selectedReason}"
                            </p>
                            <button
                                onClick={() => setSelectedReason(null)}
                                className="w-full py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-200"
                            >
                                Close Reason
                            </button>
                        </div>
                    </div>
                )} */}
            </div>

            {/* Reason Overlay/Alert */}
            {/* {selectedReason && (
                <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-[1010] flex items-center justify-center p-6 animate-in fade-in zoom-in duration-200">
                    <div className="bg-red-50 border border-red-100 p-6 rounded-3xl max-w-sm shadow-xl text-center">
                        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <XCircle size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-2">Rejection Reason</h3>
                        <p className="text-sm text-slate-600 leading-relaxed mb-6">
                            "{selectedReason}"
                        </p>
                        <button
                            onClick={() => setSelectedReason(null)}
                            className="w-full py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-900 transition-colors"
                        >
                            Got it
                        </button>
                    </div>
                </div>
            )} */}
        </div>
    );
};

export default UserNotifications;