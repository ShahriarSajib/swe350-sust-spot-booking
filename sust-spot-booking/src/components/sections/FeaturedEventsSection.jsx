import React from 'react';
// import { pastEvents } from '../../data/pastEvents.js'; // Apnar data file theke niben
//import centralAuditoriumImg from "../../assets/central_auditorium.png";
import cseCarnival from "../../assets/sust-cse-carnival.png";
//import dramaFest from "../../assets/drama-fest.png";
// import sahittya from "../../assets/sust-sahittya-utsob.png";
import innovation from "../../assets/innovation.png";
import musicConcert from "../../assets/consert.png";
import handballMatch from "../../assets/handball.png";
// import basketballDunk from "../assets/basketball.png";  
// import artExhibition from "../assets/art_exibition.png";
import { useNavigate } from "react-router-dom";
//import { SortDesc } from 'lucide-react';

const FeaturedEventsSection = () => {
    const navigate = useNavigate();
    const featuredEvents = [
        {
            id:6,
            eventId:4,
            eventName: "CSE carnival Prize Giving Ceremony 2025",
            organizer: "CSE Society SUST",
            spot:"Central Auditorium",
            date: "2025-12-05",
            title: "CSE Carnival 2025: A Celebration of Technology and Innovation",
            author: "Md. Abdus  Salehin",
            summary: "The CSE Carnival 2025 at SUST was a grand event that showcased the latest technological innovations and projects by students, fostering a spirit of creativity and collaboration.",
            image: cseCarnival

        },
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
            // images: innovation ? [{ url: innovation, caption: "Science Fair", alt: "Science Fair" }] : [],
            image: innovation
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
            // images: [{ url: musicConcert, caption: "The stage", alt: "Music concert" }],
            image: musicConcert,
            // SortDesc:""
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
            // images: [{ url: handballMatch, caption: "Intense action", alt: "Handball match" }],
            image: handballMatch
        },
        // {
        //     id: 4,
        //     eventId: 6,
        //     eventName: "Basketball Championship Finals",
        //     organizer: "Sports Committee",
        //     spot: "Basketball Ground",
        //     date: "2025-09-25",
        //     title: "Slam Dunk Success: Basketball Championship 2025 Highlights",
        //     author: "Ahmed Kamal",
        //     summary: "The annual basketball championship delivered edge-of-your-seat excitement with incredible dunks, three-pointers, and outstanding team performances.",
        //     // images: [{ url: basketballDunk, caption: "Slam dunk", alt: "Basketball" }],
        //     image: sahittya
        // },
    ];

    return (

        <section className="w-full bg-[#e0e0e0]  py-20 px-4 md:px-10">
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

                {/* 2. FEATURED BLOCKS (Clickable) */}
                {/* 2. FEATURED BLOCKS (Clickable) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {featuredEvents.map((event) => (
                        <div
                            key={event.id}
                            // --- এই অংশটুকু আপডেট করা হয়েছে ---
                            onClick={() => navigate(`/blog/${event.id}`)}
                            className="group cursor-pointer bg-slate-50 rounded-[24px] overflow-hidden border border-slate-100 transition-all duration-500 hover:shadow-xl hover:-translate-y-2"
                        >
                            {/* Image Section */}
                            <div className="relative h-48 overflow-hidden">
                                <img
                                    src={event.image}
                                    alt={event.eventName}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            </div>

                            {/* Content Section */}
                            <div className="p-5">
                                <span className="text-blue-600 text-[10px] font-bold uppercase tracking-wider">{event.date}</span>

                                <h3 className="text-base font-black text-slate-900 mt-2 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                                    {event.eventName}
                                </h3>

                                <p className="text-slate-500 text-[12px] font-medium leading-tight mb-4 line-clamp-2">
                                    {event.summary}
                                </p>

                                <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                                        By {event.organizer}
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
            {/* 2. SEE ALL BUTTON SECTION */}
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