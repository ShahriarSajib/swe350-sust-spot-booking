import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import innovation from "../assets/innovation.png";
import musicConcert from "../assets/consert.png";
import handballMatch from "../assets/handball.png";
import basketballDunk from "../assets/basketball.png";  
import artExhibition from "../assets/art_exibition.png";


const blogPosts = [
    {
        id: 1,
        eventId: 1,
        eventName: "Annual Science Fair 2025",
        organizer: "Science Club",
        spot: "Central Auditorium",
        date: "2025-12-15",
        title: "A Spectacular Journey Through Innovation at Science Fair 2025",
        author: "Dr. Sarah Ahmed",
        summary: "The Annual Science Fair 2025 showcased groundbreaking projects from students across all departments, featuring AI innovations, sustainable energy solutions, and biotechnology breakthroughs.",
        images: innovation ? [{ url: innovation, caption: "Science Fair", alt: "Science Fair" }] : [],
    },
    {
        id: 2,
        eventId: 2,
        eventName: "Music Night Harmony 2025",
        organizer: "Music Club",
        spot: "Mini Auditorium",
        date: "2025-11-20",
        title: "Melodies That Touched Hearts: Music Night Harmony 2025 Recap",
        author: "Tanvir Hassan",
        summary: "An enchanting evening of musical performances featuring classical, contemporary, and fusion genres that brought together music lovers from across the university.",
        images: [{ url: musicConcert, caption: "The stage", alt: "Music concert" }],
    },
    {
        id: 3,
        eventId: 5,
        eventName: "Inter-University Handball Tournament",
        organizer: "Sports Committee",
        spot: "Handball Ground",
        date: "2025-10-10",
        title: "Thrilling Victory: SUST Dominates Handball Tournament 2025",
        author: "Coach Rahim Khan",
        summary: "SUST handball team clinched the championship title in an intense three-day tournament, showcasing exceptional teamwork and athletic prowess.",
        images: [{ url: handballMatch, caption: "Intense action", alt: "Handball match" }],
    },
    {
        id: 4,
        eventId: 6,
        eventName: "Basketball Championship Finals",
        organizer: "Sports Committee",
        spot: "Basketball Ground",
        date: "2025-09-25",
        title: "Slam Dunk Success: Basketball Championship 2025 Highlights",
        author: "Ahmed Kamal",
        summary: "The annual basketball championship delivered edge-of-your-seat excitement with incredible dunks, three-pointers, and outstanding team performances.",
        images: [{ url: basketballDunk, caption: "Slam dunk", alt: "Basketball" }],
    },
    {
        id: 5,
        eventId: 8,
        eventName: "Art Exhibition: Colors of Campus",
        organizer: "Art Club",
        spot: "Central Field",
        date: "2025-08-05",
        title: "A Canvas of Creativity: Art Exhibition 2025 Review",
        author: "Nusrat Jahan",
        summary: "The outdoor art exhibition transformed Central Field into a vibrant gallery showcasing diverse artistic expressions from painting to sculpture and digital art.",
        images: [{ url: artExhibition, caption: "Art exhibition", alt: "Art" }],
    }
];

const FeaturedEventsBlog = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [selectedSpot, setSelectedSpot] = useState("All Spots");
    const [selectedDate, setSelectedDate] = useState("");

    const filteredBlogs = blogPosts.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(search.toLowerCase());
        const matchesSpot = selectedSpot === "All Spots" || post.spot === selectedSpot;
        const matchesDate = !selectedDate || post.date === selectedDate;
        return matchesSearch && matchesSpot && matchesDate;
    });

    return (
        <div className="min-h-screen bg-slate-100 py-12 px-4 md:px-10">
            <div className="max-w-7xl mx-auto flex flex-col lg:row lg:flex-row gap-8">
                
                {/* FILTER ASIDE */}
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

                            <button onClick={() => {setSearch(""); setSelectedSpot("All Spots"); setSelectedDate("");}} className="w-full py-3 text-xs font-bold text-slate-400 hover:text-red-500 transition-colors uppercase tracking-widest">
                                Reset Filters
                            </button>
                        </div>
                    </div>
                </aside>

                {/* BLOG LIST */}
                <main className="w-full lg:w-3/4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {filteredBlogs.map((post) => (
                            <div key={post.id} onClick={() => navigate(`/blog/${post.id}`)} className="group bg-white rounded-[40px] overflow-hidden shadow-md hover:shadow-2xl border border-slate-200 transition-all duration-500 cursor-pointer">
                                <div className="h-64 overflow-hidden relative">
                                    <img src={post.images[0].url} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-4 py-1 rounded-full text-[10px] font-black uppercase text-blue-600 shadow-sm">
                                        {post.spot}
                                    </div>
                                </div>
                                <div className="p-8">
                                    <div className="text-[10px] font-bold text-slate-400 mb-3 tracking-widest uppercase">{post.date}</div>
                                    <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-blue-600 transition-colors leading-tight">{post.title}</h3>
                                    <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 mb-6">{post.summary}</p>
                                    <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                                        <span className="text-xs font-bold text-slate-800">By {post.author}</span>
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
};
export default FeaturedEventsBlog;