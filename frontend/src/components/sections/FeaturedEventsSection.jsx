import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

const FeaturedEventsSection = () => {
    const navigate = useNavigate();
    const [featuredEvents, setFeaturedEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                // Fetching from your existing API
                const response = await fetch('http://localhost:5000/api/blog/all');
                const data = await response.json();

                // Take only the first 4 blogs for the "Featured" section
                setFeaturedEvents(data.slice(0, 4));
            } catch (error) {
                console.error("Error fetching featured blogs:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFeatured();
    }, []);

    if (loading) return <div className="py-20 text-center font-bold text-slate-400">Loading Highlights...</div>;

    return (
        <section className="w-full bg-[#e0e0e0] py-20 px-4 md:px-10">
            <div className="max-w-7xl mx-auto">

                {/* 1. SECTION HEADER */}
                <div className="mb-12">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="h-[2px] w-8 bg-blue-600"></span>
                        <span className="text-blue-600 font-black text-xs uppercase tracking-widest">Memories</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 uppercase">
                        Featured <span className="text-blue-600">Event Blogs</span>
                    </h2>
                    <p className="text-slate-500 mt-2 font-medium">Explore stories and experiences shared by event organizers.</p>
                </div>

                {/* 2. FEATURED BLOCKS */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {featuredEvents.map((event) => (
                        // inside your featuredEvents.map((event) => ( ... ))

                        <div
                            key={event.id}
                            onClick={() => navigate(`/blog/${event.id}`, { state: { blogData: event } })}
                            className="group cursor-pointer bg-slate-50 rounded-[24px] overflow-hidden border border-slate-100 transition-all duration-500 hover:shadow-xl hover:-translate-y-2"
                        >
                            {/* Image Section */}
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={`http://localhost:5000/uploads/${event.cover_image}`}
                                    alt={event.blog_title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            </div>

                            {/* Content Section */}
                            <div className="p-5">
                                <span className="text-blue-600 text-[10px] font-bold uppercase tracking-wider">
                                    {new Date(event.published_at || event.submitted_at).toLocaleDateString()}
                                </span>

                                <h3 className="text-base font-black text-slate-900 mt-2 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                                    {event.blog_title}
                                </h3>

                                <p className="text-slate-500 text-[12px] font-medium leading-tight mb-4 line-clamp-2">
                                    {event.summary}
                                </p>

                                <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                                        By {event.author_name || "Admin"}
                                    </span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 3. SEE ALL BUTTON */}
            <div className="mt-16 flex justify-center">
                <button
                    onClick={() => navigate("/featured-events")}
                    className="group flex items-center gap-3 bg-white border-2 border-slate-900 text-slate-900 px-8 py-3 rounded-full font-black text-sm uppercase tracking-widest transition-all duration-300 hover:bg-slate-900 hover:text-white hover:shadow-2xl hover:shadow-blue-200"
                >
                    See All Featured Events
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 transform transition-transform duration-300 group-hover:translate-x-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </button>
            </div>
        </section>
    );
};

export default FeaturedEventsSection;