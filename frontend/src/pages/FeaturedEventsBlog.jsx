
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const FeaturedEventsBlog = () => {
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState([]); // State for backend data
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedSpot, setSelectedSpot] = useState("All Spots");
    const [selectedDate, setSelectedDate] = useState("");

    // 1. Fetch data from Backend
    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                // Adjust URL if your port is different
                const response = await fetch('http://localhost:5000/api/blog/all');
                const data = await response.json();
                setBlogs(data);
            } catch (error) {
                console.error("Error fetching blogs:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBlogs();
    }, []);

    // 2. Filter logic (Mapping backend fields to frontend logic)
    const filteredBlogs = blogs.filter(post => {
        const matchesSearch = post.blog_title.toLowerCase().includes(search.toLowerCase());

        // Update this line to use spot_name from the new backend response
        const matchesSpot = selectedSpot === "All Spots" || post.spot_name === selectedSpot;

        const dbDate = post.published_at ? post.published_at.split('T')[0] : "";
        const matchesDate = !selectedDate || dbDate === selectedDate;

        return matchesSearch && matchesSpot && matchesDate;
    });

    if (loading) return <div className="text-center py-20 font-bold text-slate-500">Loading Stories...</div>;

    return (
        <div className="min-h-screen bg-slate-100 py-12 px-4 md:px-10">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">

                {/* FILTER ASIDE (Same as your code) */}
                <aside className="w-full lg:w-1/4">
                    <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-200 sticky top-24">
                        <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-2">
                            <span className="w-2 h-8 bg-blue-600 rounded-full"></span> Filters
                        </h2>

                        <div className="space-y-6">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Search</label>
                                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Find a blog..." />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Spot</label>
                                <select value={selectedSpot} onChange={(e) => setSelectedSpot(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm outline-none cursor-pointer">
                                    <option>All Spots</option>
                                    <option>Central Auditorium</option>
                                    <option>Mini Auditorium</option>
                                    <option>Handball Ground</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Date</label>
                                <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm outline-none" />
                            </div>

                            <button onClick={() => { setSearch(""); setSelectedSpot("All Spots"); setSelectedDate(""); }} className="w-full py-3 text-xs font-bold text-slate-400 hover:text-red-500 transition-colors uppercase tracking-widest">
                                Reset Filters
                            </button>
                        </div>
                    </div>
                </aside>

                {/* BLOG LIST */}
                <main className="w-full lg:w-3/4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {filteredBlogs.map((post) => (
                            <div
                                key={post.id}
                                onClick={() => navigate(`/blog/${post.id}`, { state: { blogData: post } })}
                                className="group cursor-pointer bg-slate-50 rounded-[24px] overflow-hidden border border-slate-100 transition-all duration-500 hover:shadow-xl hover:-translate-y-2"
                            >
                                <div className="h-64 overflow-hidden relative">
                                    {/* Using cover_image from backend. Update URL path to your uploads folder */}
                                    <img
                                        src={`http://localhost:5000/uploads/${post.cover_image}`}
                                        alt={post.blog_title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-4 py-1 rounded-full text-[10px] font-black uppercase text-blue-600 shadow-sm">
                                        {post.spot_name || "Event"}
                                    </div>
                                </div>
                                <div className="p-8">
                                    <div className="text-[10px] font-bold text-slate-400 mb-3 tracking-widest uppercase">
                                        {new Date(post.published_at || post.submitted_at).toLocaleDateString()}
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-blue-600 transition-colors leading-tight">
                                        {post.blog_title}
                                    </h3>
                                    <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 mb-6">
                                        {post.summary}
                                    </p>
                                    <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                                        <span className="text-xs font-bold text-slate-800">By {post.author_name || "Admin"}</span>
                                        <span className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">→</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default FeaturedEventsBlog;