import React from 'react';

const EventDetailsModal = ({ isOpen, event, onClose }) => {
    if (!isOpen || !event) return null;

    console.log("Event Details Modal Opened with Event:", event);
    console.log("Event Category:", event.category);
    console.log("Event Recommender:", event.recommender);


    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-white w-full max-w-2xl rounded-[32px] p-8 shadow-2xl space-y-6">
                <h3 className="text-2xl font-black">{event.name}</h3>
                <div className="grid grid-cols-2 gap-4 text-sm md:text-base">
                    <p><strong>Title:</strong> {event.title}</p>
                    <p><strong>Organizer:</strong> {event.organizer}</p>
                    <p><strong>Location:</strong> {event.spot_name}</p>
                    <p><strong>Date:</strong> {event.start_date}
                            {event.end_date && event.end_date !== event.start_date ? ` to ${event.end_date}` : ""}</p>
                    <p><strong>Session:</strong> {event.session}</p>
                </div>

                {event.recommender && (
                    <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Recommender</p>
                        <p className="font-bold">{event.recommender.name}</p>
                        <p className="text-sm text-blue-600">{event.recommender.designation}</p>
                        {event.recommender.signature && (
                            <img src={event.recommender.signature} className="h-10 mt-2" alt="Signature" />
                        )}
                    </div>
                )}

                <div className="space-y-2">
                    <label className="text-gray-400 font-bold uppercase text-[10px]">Description</label>
                    <div className="p-4 bg-gray-50 rounded-xl italic text-sm">
                        "{event.description}"
                    </div>
                </div>

                <button onClick={onClose} className="w-full md:w-auto px-8 bg-slate-500 hover:bg-slate-900 text-white py-3 rounded-2xl font-bold transition-all">
                    Close
                </button>
            </div>
        </div>
    );
};

export default EventDetailsModal;