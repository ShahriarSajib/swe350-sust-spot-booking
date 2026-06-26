import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import API_BASE from "../config";
import { getImageUrl } from "../utils/imageHelper";

const BlogDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    // Grab the blog data from the navigation state
    const blog = location.state?.blogData;

    console.log("Blog Detail Data:", blog); // Debugging log to check the data structure

    // Fallback if the user refreshes the page or navigates directly via URL
    if (!blog) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-10 bg-slate-50">
                <h2 className="text-2xl font-bold text-slate-800 mb-4">No Data Available</h2>
                <p className="text-slate-500 mb-6 text-center">Please return to the events list to view the story.</p>
                <button
                    onClick={() => navigate('/featured-events')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-bold transition-colors"
                >
                    Return to Events
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <article className="max-w-4xl mx-auto py-12 px-6">
                
                {/* HERO IMAGE */}
                <div className="w-full h-[300px] md:h-[500px] rounded-[40px] overflow-hidden mb-12 shadow-2xl border border-slate-200">
                    <img
                        src={blog.cover_image ? getImageUrl(blog.cover_image) : '/default-image.jpg'} // Path from your local array
                        className="w-full h-full object-cover"
                        alt={blog.blog_title || blog.eventName}
                    />
                </div>

                {/* HEADER SECTION */}
                <div className="mb-10 text-center md:text-left">
                    <span className="text-blue-600 font-black text-xs uppercase tracking-[0.3em]">
                        {blog.spot_name}
                    </span>
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 mt-4 mb-6 leading-tight">
                        {blog.title || blog.eventName}
                    </h1>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 md:gap-8 text-slate-400 font-bold text-[10px] md:text-xs uppercase tracking-wider">
                        <div className="flex items-center gap-2">
                            <span className="text-slate-300">AUTHOR:</span> {blog.author_name}
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-slate-300">DATE:</span> {blog.published_at ? new Date(blog.published_at).toLocaleDateString() : "N/A"}
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-slate-300">ORG:</span> {blog.organizer}
                        </div>
                    </div>
                </div>

                {/* SUMMARY SECTION */}
                <div className="bg-slate-50 p-8 rounded-3xl border-l-8 border-blue-500 mb-12 italic text-slate-700 leading-relaxed font-medium text-lg shadow-sm border border-slate-200">
                    "{blog.summary}"
                </div>

                {/* SCHEDULES (If available in your array) */}
                {blog.schedules && blog.schedules.length > 0 && (
                    <section className="mb-20">
                        <h2 className="text-2xl font-black text-slate-900 uppercase mb-8 flex items-center gap-3">
                            <span className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center text-sm shadow-lg shadow-blue-200">
                                S
                            </span>
                            Event Highlights
                        </h2>
                        <div className="grid gap-6">
                            {blog.schedules.map((item, idx) => (
                                <div key={idx} className="bg-slate-100 p-6 rounded-3xl flex flex-col md:flex-row gap-6">
                                    <div className="min-w-[120px] text-blue-600 font-black text-sm uppercase">
                                        {item.time}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-lg mb-1">{item.activity}</h4>
                                        {item.description && <p className="text-slate-600 text-sm">{item.description}</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* GALLERY (If images exist in array) */}
                {blog.images && blog.images.length > 0 && (
                    <section className="pb-20">
                        <h2 className="text-2xl font-black text-slate-900 uppercase mb-8">Event Gallery</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {blog.images.map((img, idx) => (
                                <div key={idx} className="group">
                                    <div className="h-72 rounded-[32px] overflow-hidden shadow-lg mb-4 bg-slate-100 border border-slate-200">
                                        <img
                                            src={img.image_path ? getImageUrl(img.image_path) : '/default-image.jpg'} // Path from your local array
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            alt={img.image_caption}
                                        />
                                    </div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                                        {img.image_caption}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </article>
        </div>
    );
};

export default BlogDetail;