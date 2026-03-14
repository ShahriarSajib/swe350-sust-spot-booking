import React from 'react';
//import { useNavigate } from 'react-router-dom';
import { X, Calendar, XCircle, FileText, MessageSquare, ChevronRight } from 'lucide-react';

const AdminNotifications = ({ isOpen, onClose }) => {
    // if (!isOpen) return null;
    //const navigate = useNavigate(); // Initialize navigate

    const handleClose = () => {
        onClose(); // This calls setShowNotif(false) in App.jsx
    };
   if (!isOpen) return null;
    // This data would eventually come from your backend/API
    const notifications = [
        {
            id: 1,
            type: "booking",
            text: "You have a new booking request for spot Central Field on date 2024-05-20",
            time: "2 mins ago",
            unread: true
        },
        {
            id: 2,
            type: "cancel",
            text: "A user has cancelled an approved request for spot Central Field on date 2024-05-18",
            time: "1 hour ago",
            unread: true
        },
        {
            id: 3,
            type: "feedback",
            text: "A user has submitted a feedback of an event for a spot",
            time: "5 hours ago",
            unread: false
        },
        {
            id: 4,
            type: "blog",
            text: "A user has requested for a blog to publish.",
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
                        <h2 className="text-xl font-bold text-slate-800"> Notifications</h2>
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
                            className={`p-4 rounded-2xl border transition-all flex gap-4 ${
                                notif.unread 
                                ? "bg-white border-sky-100 shadow-sm" 
                                : "bg-gray-50/50 border-transparent opacity-80"
                            }`}
                        >
                            {/* Icon Logic based on Notification Type */}
                            <div className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                                notif.type === 'booking' ? 'bg-emerald-50 text-emerald-600' :
                                notif.type === 'cancel' ? 'bg-red-50 text-red-600' :
                                notif.type === 'blog' ? 'bg-purple-50 text-purple-600' : 'bg-sky-50 text-sky-600'
                            }`}>
                                {notif.type === 'booking' && <Calendar size={20} />}
                                {notif.type === 'cancel' && <XCircle size={20} />}
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
                                {(notif.type === 'booking') && (
                                    <button className="mt-3 text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 group">
                                        View Details
                                        <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                                    </button>
                                )}
                                 {(notif.type === 'blog') && (
                                    <button className="mt-3 text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 group">
                                        View Details
                                        <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer Actions */}
                <div className="p-4 border-t border-gray-100 text-center bg-white">
                    <button className="text-xs font-bold text-gray-400 hover:text-slate-600 uppercase tracking-widest">
                        Mark all as read
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminNotifications;