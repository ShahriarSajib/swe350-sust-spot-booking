import React, { useState, useMemo } from 'react';
import { upcomingEvents } from '../../data/events.js';

const UpcomingEventsSection = () => {
    const [selectedSpot, setSelectedSpot] = useState("All");
    const [filterDate, setFilterDate] = useState("");

    // --- PAGINATION CONFIG ---
    // Increased initial count to 8 to fill two rows of a 4-column grid
    const INITIAL_VISIBLE_COUNT = 8;
    const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);

    const spots = ["All", "Central Auditorium", "Mini Auditorium", "Central Field", "Handball Ground", "Basketball Ground"];

    const filteredEvents = useMemo(() => {
        setVisibleCount(INITIAL_VISIBLE_COUNT);
        return upcomingEvents
            .filter(event => {
                const matchSpot = selectedSpot === "All" || event.spot === selectedSpot;
                let matchDate = true;
                if (filterDate) {
                    const selected = new Date(filterDate);
                    const start = new Date(event.startDate);
                    const end = new Date(event.endDate);
                    matchDate = selected >= start && selected <= end;
                }
                return matchSpot && matchDate;
            })
            .sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    }, [selectedSpot, filterDate]);

    const eventsToShow = filteredEvents.slice(0, visibleCount);

    return (
        <section className="w-full bg-slate-50 py-16 px-4 md:px-10 min-h-screen">
            <div className="max-w-7xl mx-auto">
                
                {/* 1. HEADER SECTION */}
                <div className="mb-10 flex flex-col items-center text-center">
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tighter mb-3">
                        Discover <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-400">Upcoming Events</span>
                    </h2>
                    <p className="text-slate-500 text-sm font-medium max-w-xl">
                        Stay updated with the latest events happening at SUST.
                    </p>
                </div>

                {/* 2. FILTER CONTROLS */}
                <div className="bg-slate-200/50 p-4 rounded-2xl shadow-sm border border-slate-100 mb-8 flex flex-col lg:flex-row gap-4 items-center justify-between">
                    <div className="flex flex-wrap justify-center gap-1.5">
                        {spots.map(spot => (
                            <button
                                key={spot}
                                onClick={() => setSelectedSpot(spot)}
                                className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all border ${
                                    selectedSpot === spot 
                                    ? "bg-slate-900 text-white border-slate-900 shadow-md" 
                                    : "bg-white text-slate-500 border-transparent hover:border-blue-300 hover:text-blue-600"
                                }`}
                            >
                                {spot}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-3 bg-white p-1.5 rounded-xl border border-slate-100">
                        <input 
                            type="date" 
                            value={filterDate}
                            onChange={(e) => setFilterDate(e.target.value)}
                            className="bg-transparent outline-none text-xs font-bold text-slate-700 px-1 cursor-pointer"
                        />
                        {filterDate && (
                            <button onClick={() => setFilterDate("")} className="text-red-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>

                {/* 3. SMALLER EVENT BLOCKS (4 Columns on Desktop) */}
                <div className="w-full">
                    {eventsToShow.length > 0 ? (
                        <>
                            {/* Changed to grid-cols-2 md:grid-cols-3 lg:grid-cols-4 for smaller cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {eventsToShow.map(event => (
                                    <div 
                                        key={event.id}
                                        className="bg-slate-800 rounded-2xl p-4 shadow-xl transition-all duration-300 group relative overflow-hidden border border-slate-700"
                                    >
                                        <div className="absolute -top-10 -right-10 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all"></div>

                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex flex-col">
                                                <span className="text-[9px] font-black text-blue-400 uppercase tracking-tighter">Organizer</span>
                                                <span className="text-xs font-bold text-slate-300 truncate max-w-[80px]">{event.organizer}</span>
                                            </div>
                                            <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase ${
                                                event.session.includes('Night') ? "bg-blue-600 text-white" : "bg-sky-400 text-slate-900"
                                            }`}>
                                                {event.session}
                                            </span>
                                        </div>

                                        <h3 className="text-sm font-black text-white mb-1 leading-tight group-hover:text-sky-400 transition-colors line-clamp-2 min-h-[2.5rem]">
                                            {event.name}
                                        </h3>
                                        
                                        <div className="flex items-center gap-1.5 mb-4">
                                            <div className="h-[1.5px] w-3 bg-blue-500"></div>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase truncate">{event.spot}</span>
                                        </div>

                                        <div className="bg-slate-900/50 rounded-xl p-2.5 flex items-center justify-between border border-white/5">
                                            <div className="flex flex-col">
                                                <span className="text-[8px] font-black text-slate-500 uppercase">Schedule</span>
                                                <span className="text-[9px] font-bold text-slate-200">
                                                    {event.startDate === event.endDate 
                                                        ? event.startDate 
                                                        : `${event.startDate}..`
                                                    }
                                                </span>
                                                <span className="text-[9px] font-bold text-slate-200">
                                                    {event.startTime} - {event.endTime}
                                                </span>
                                            </div>
                                            <div className="bg-blue-600/10 p-1.5 rounded-lg">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* BUTTONS */}
                            <div className="mt-10 flex justify-center gap-3">
                                {visibleCount < filteredEvents.length && (
                                    <button 
                                        onClick={() => setVisibleCount(prev => prev + 4)}
                                        className="px-6 py-2.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-blue-600 transition-all shadow-md"
                                    >
                                        See More
                                    </button>
                                )}
                                
                                {visibleCount > INITIAL_VISIBLE_COUNT && (
                                    <button 
                                        onClick={() => setVisibleCount(INITIAL_VISIBLE_COUNT)}
                                        className="px-6 py-2.5 bg-white text-slate-900 border border-slate-200 text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-slate-50 transition-all shadow-sm"
                                    >
                                        Show Less
                                    </button>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                            <div className="text-4xl mb-3">🗓️</div>
                            <h3 className="text-lg font-black text-slate-900 uppercase">No Events Found</h3>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default UpcomingEventsSection;