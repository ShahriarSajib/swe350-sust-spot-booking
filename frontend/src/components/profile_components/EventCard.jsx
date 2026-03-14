import { Users, MapPin, Calendar, PenLine } from "lucide-react";

export default function EventCard({ event, eventCategory, onSeeDetails, onApprovalCopy, onWriteBlog,onFeedback, activeFeedbackId ,text, setText}) {
    return (
        <div className="group bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="space-y-3 w-full">
                <div className="flex items-center gap-3">
                    <h4 className="text-xl font-extrabold text-gray-800">{event.title}</h4>
                    <span className="px-3 py-0.5 bg-sky-50 text-sky-700 text-[10px] font-extrabold uppercase rounded-full border border-sky-100">
                        {event.session}
                    </span>
                    {eventCategory === "all" && (
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${event.category === 'pending' ? 'bg-yellow-50 text-yellow-600 border-yellow-100' : event.category === 'past' ? 'bg-gray-50 text-gray-600 border-gray-100' : 'bg-green-50 text-green-600 border-green-100'}`}>
                            {event.category}
                        </span>
                    )}
                </div>
                <div className="space-y-2.5 text-sm font-semibold text-gray-600">
                    <div className="flex items-center gap-3"><Users size={16} className="text-sky-500/70" /><span className="text-gray-400 text-[10px] w-20">ORGANIZER:</span> {event.organizer}</div>
                    <div className="flex items-center gap-3"><MapPin size={16} className="text-sky-500/70" /><span className="text-gray-400 text-[10px] w-20">LOCATION:</span> {event.spotName}</div>
                    <div className="flex items-center gap-3"><Calendar size={16} className="text-sky-500/70" /><span className="text-gray-400 text-[10px] w-20">DATE:</span> {event.date}</div>
                </div>
            </div>

            <div className="flex flex-col gap-2 shrink-0 self-center">
                {(event.category === "upcoming" || event.category === "pending") && (
                    <>
                        <button onClick={() => onSeeDetails(event)} className="bg-sky-50 text-sky-600 border border-sky-100 px-3 py-1.5 rounded-md text-[10px] font-bold hover:bg-sky-600 hover:text-white transition-all w-28">See Details</button>
                        {event.category === "upcoming" && (
                            <button onClick={() => onApprovalCopy(event)} className="bg-emerald-50 text-emerald-600 border border-emerald-100 px-3 py-1.5 rounded-md text-[10px] font-bold hover:bg-emerald-600 hover:text-white transition-all w-28">Approval Copy</button>
                        )}
                        <button className="bg-red-50 text-red-600 border border-red-100 px-3 py-1.5 rounded-md text-[10px] font-bold hover:bg-red-600 hover:text-white transition-all w-28">Cancel Request</button>
                    </>
                )}
                {event.category === "past" && (
                    <>
                        <button onClick={() => onWriteBlog(event)} className="flex items-center justify-center gap-1.5 bg-sky-50 text-sky-700 border border-sky-100 px-3 py-1.5 rounded-md text-[10px] font-bold w-28"><PenLine size={12} /> Write Blog</button>
                        
                        <button 
                            onClick={() => onFeedback(event.id)} // এখানে মেইন পেজের ফাংশন কল হবে
                            className="bg-white text-gray-700 border border-gray-200 px-2 py-1.5 rounded-md text-[10px] font-bold hover:bg-gray-800 hover:text-white transition-all w-28"
                        >
                            Write Feedback
                        </button>

                        {/* Feedback Modal (Conditional Rendering) */}
                        {activeFeedbackId === event.id && (
                            <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
                                <div 
                                    className="absolute inset-0 bg-black/30 backdrop-blur-sm" 
                                    onClick={() => onFeedback(null)} // ক্লোজ করার জন্য
                                ></div>
                                <div className="relative w-full max-w-sm p-6 bg-white border border-sky-100 rounded-3xl shadow-2xl animate-in zoom-in-95 duration-300">
                                    <h4 className="text-sm font-black text-sky-900 mb-4 flex items-center gap-2">
                                        <PenLine size={16} /> Write Feedback
                                    </h4>
                                    <textarea
                                        value={text}
                                        onChange={(e) => setText(e.target.value)}
                                        placeholder={`Tell us about your experience...`}
                                        className="w-full p-4 text-sm border border-slate-100 rounded-2xl focus:ring-2 focus:ring-sky-500 bg-slate-50 mb-4"
                                        rows="4"
                                        autoFocus
                                    />
                                    <div className="flex justify-end gap-3">
                                        <button onClick={() => onFeedback(null)} className="px-4 py-2 text-xs text-slate-400 font-bold uppercase">Cancel</button>
                                        <button 
                                            onClick={() => {
                                                console.log("Feedback Submitted:", text);
                                                onFeedback(null);
                                                setText("");
                                            }}
                                            className="bg-sky-600 text-white text-xs px-6 py-2.5 rounded-xl font-bold uppercase"
                                        >
                                            Submit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}