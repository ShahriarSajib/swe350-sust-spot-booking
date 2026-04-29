import React, { useState, useEffect } from 'react';
import { FileText, Calendar as CalendarIcon, Plus } from "lucide-react";

export default function MyBlogs({navigate }) {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        const fetchUserBlogs = async () => {
            console.log("Fetching blogs for user ID:", userId);
            if (!userId) return;
            try {
                // Fetching from your new backend API
                const response = await fetch(`http://localhost:5000/api/blog/user/${userId}`);
                const data = await response.json();
                setBlogs(data);
            } catch (error) {
                console.error("Error fetching my blogs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserBlogs();
    }, [userId]);

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <div className="animate-pulse flex flex-col items-center">
                    <FileText size={48} className="text-slate-200 mb-4" />
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading your stories...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black text-slate-800 flex items-center gap-2">
                    <FileText size={24} className="text-sky-600" /> My Personal Blogs
                </h3>
                <span className="bg-sky-100 text-sky-700 px-3 py-1 rounded-full text-xs font-black">
                    {blogs.length} POSTS
                </span>
            </div>

            {blogs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {blogs.map((blog) => (
                        <div
                            key={blog.blog_id}
                            // Passing the full blog object 
                            onClick={() => navigate(`/blog/${blog.blog_id}`, { state: { blogData: blog } })}
                            className="group bg-white border border-slate-100 rounded-3xl overflow-hidden hover:shadow-xl hover:shadow-sky-100/50 transition-all cursor-pointer flex flex-col"
                        >
                            {/* Blog Image */}
                            <div className="relative h-48 overflow-hidden bg-slate-100">
                                <img
                                    src={`http://localhost:5000/uploads/${blog.cover_image}`}
                                    alt={blog.blog_title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase text-sky-700 shadow-sm">
                                    {blog.spot_name}
                                </span>
                            </div>

                            {/* Blog Content */}
                            <div className="p-5 flex flex-col flex-grow">
                                <p className="text-[11px] font-bold text-slate-400 flex items-center gap-1 mb-2">
                                    <CalendarIcon size={12} /> 
                                    Published: {new Date(blog.published_at || blog.submitted_at).toLocaleDateString()}
                                </p>
                                <h4 className="text-lg font-bold text-slate-800 leading-tight group-hover:text-sky-600 transition-colors mb-3 line-clamp-2">
                                    {blog.blog_title}
                                </h4>
                                <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                                    {blog.summary}
                                </p>

                                {/* Read More Link */}
                                <div className="mt-auto pt-4 border-t border-slate-50 flex items-center gap-2 text-sky-600 font-bold text-[11px] uppercase tracking-wider">
                                    Read Full Story <Plus size={14} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                /* Empty State */
                <div className="flex flex-col items-center justify-center py-20 text-gray-400 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-100">
                    <FileText size={64} className="mb-4 opacity-20" />
                    <h3 className="text-xl font-bold">No Blogs Yet</h3>
                    <p className="text-sm mt-2">Your shared experiences will appear here.</p>
                </div>
            )}
        </div>
    );
}