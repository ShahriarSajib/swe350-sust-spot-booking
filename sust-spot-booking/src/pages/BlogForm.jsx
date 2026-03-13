import React, { useState } from "react";
import { Plus, X } from "lucide-react";

// import React, { useState } from "react"
// import { Plus, X } from "lucide-react"

function BlogForm({ event, onClose }) {
    // if (!event) return null;
    const [formData, setFormData] = useState({
        eventId: event.id || "",
        eventName: event.name || event.title || "Untitled Event",
        organizer: event.club || event.organizer || "N/A",
        spot: event.location || event.spot || "N/A",
        date: event.date || event.startDate || "",
        title: `${event.name || event.title || "Event"} Review`,
        author: "",
        summary: "",
        content: "",
        tags: "",
        scheduleFragments: [],
        images: [],
    })

    const addScheduleFragment = () => {
        setFormData({
            ...formData,
            scheduleFragments: [...formData.scheduleFragments, { time: "", activity: "", description: "" }],
        })
    }

    const removeScheduleFragment = (index) => {
        setFormData({
            ...formData,
            scheduleFragments: formData.scheduleFragments.filter((_, i) => i !== index),
        })
    }

    const updateScheduleFragment = (index, field, value) => {
        const updated = [...formData.scheduleFragments]
        updated[index] = { ...updated[index], [field]: value }
        setFormData({ ...formData, scheduleFragments: updated })
    }

    const addImage = () => {
        setFormData({
            ...formData,
            images: [...formData.images, { url: "", caption: "", alt: "" }],
        })
    }

    const removeImage = (index) => {
        setFormData({
            ...formData,
            images: formData.images.filter((_, i) => i !== index),
        })
    }

    const updateImage = (index, field, value) => {
        const updated = [...formData.images]
        updated[index] = { ...updated[index], [field]: value }
        setFormData({ ...formData, images: updated })
    }

    if (!event) {
        return (
            <div className="p-10 text-center text-gray-500">
                Loading event data...
            </div>
        );
    }

    return (
        <div className="space-y-4 max-h-[80vh] overflow-y-auto p-1">
            <h4 className="font-bold text-lg text-gray-800">Write a Blog</h4>

            {/* Auto-filled fields (read-only style) */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Event Name</p>
                    <p className="text-sm font-semibold text-gray-700">{formData.eventName}</p>
                </div>
                <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Organizer</p>
                    <p className="text-sm font-semibold text-gray-700">{formData.organizer}</p>
                </div>
                <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Location</p>
                    <p className="text-sm font-semibold text-gray-700">{formData.spot}</p>
                </div>
                <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Date</p>
                    <p className="text-sm font-semibold text-gray-700">{formData.date}</p>
                </div>
            </div>

            {/* User input fields */}
            <div className="space-y-4">
                <div>
                    <label className="text-sm font-bold text-gray-600">Blog Title</label>
                    <input
                        type="text"
                        className="w-full mt-1 px-3 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-teal-500"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                </div>

                <div>
                    <label className="text-sm font-bold text-gray-600">Author Name</label>
                    <input
                        type="text"
                        className="w-full mt-1 px-3 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="Your Name"
                        value={formData.author}
                        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    />
                </div>

                <div>
                    <label className="text-sm font-bold text-gray-600">Summary</label>
                    <textarea
                        className="w-full mt-1 px-3 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-teal-500"
                        rows={2}
                        placeholder="Briefly describe the event highlights..."
                        value={formData.summary}
                        onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                    />
                </div>

                <div>
                    <label className="text-sm font-bold text-gray-600">Full Story Content</label>
                    <textarea
                        className="w-full mt-1 px-3 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-teal-500"
                        rows={6}
                        placeholder="Describe your experience in detail..."
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    />
                </div>

                <div>
                    <label className="text-sm font-bold text-gray-600">Tags (comma separated)</label>
                    <input
                        type="text"
                        className="w-full mt-1 px-3 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-teal-500"
                        placeholder="e.g., Art, Exhibition, Culture"
                        value={formData.tags}
                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    />
                </div>

                {/* Schedule Fragments Section */}
                <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between border-b pb-2">
                        <label className="text-sm font-extrabold text-gray-800">Event Schedule Highlights</label>
                        <button
                            type="button"
                            onClick={addScheduleFragment}
                            className="flex items-center gap-1 text-xs font-bold text-teal-600 hover:bg-teal-50 px-2 py-1 rounded-lg transition-colors"
                        >
                            <Plus size={14} /> Add Timeline
                        </button>
                    </div>

                    {formData.scheduleFragments.map((fragment, index) => (
                        <div key={index} className="p-4 border rounded-2xl bg-gray-50/50 relative">
                            <button
                                className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                                onClick={() => removeScheduleFragment(index)}
                            >
                                <X size={16} />
                            </button>
                            <div className="grid grid-cols-1 gap-3">
                                <input
                                    className="w-full px-3 py-2 border rounded-lg text-sm"
                                    placeholder="Time (e.g., 10:00 AM)"
                                    value={fragment.time}
                                    onChange={(e) => updateScheduleFragment(index, "time", e.target.value)}
                                />
                                <input
                                    className="w-full px-3 py-2 border rounded-lg text-sm font-bold"
                                    placeholder="Activity Title"
                                    value={fragment.activity}
                                    onChange={(e) => updateScheduleFragment(index, "activity", e.target.value)}
                                />
                                <input
                                    className="w-full px-3 py-2 border rounded-lg text-sm"
                                    placeholder="Short Description"
                                    value={fragment.description}
                                    onChange={(e) => updateScheduleFragment(index, "description", e.target.value)}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Images Section */}
                <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between border-b pb-2">
                        <label className="text-sm font-extrabold text-gray-800">Gallery Links</label>
                        <button
                            type="button"
                            onClick={addImage}
                            className="flex items-center gap-1 text-xs font-bold text-teal-600 hover:bg-teal-50 px-2 py-1 rounded-lg"
                        >
                            <Plus size={14} /> Add Image Link
                        </button>
                    </div>

                    {formData.images.map((image, index) => (
                        <div key={index} className="p-4 border rounded-2xl bg-gray-50/50 relative">
                            <button
                                className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                                onClick={() => removeImage(index)}
                            >
                                <X size={16} />
                            </button>
                            <div className="space-y-3">
                                <input
                                    className="w-full px-3 py-2 border rounded-lg text-sm"
                                    placeholder="Image URL"
                                    value={image.url}
                                    onChange={(e) => updateImage(index, "url", e.target.value)}
                                />
                                <input
                                    className="w-full px-3 py-2 border rounded-lg text-sm"
                                    placeholder="Caption"
                                    value={image.caption}
                                    onChange={(e) => updateImage(index, "caption", e.target.value)}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex gap-3 pt-6">
                <button
                    className="flex-1 bg-teal-600 text-white font-bold py-3 rounded-xl hover:bg-teal-700 shadow-lg shadow-teal-100 transition-all"
                    onClick={() => {
                        console.log("Submitting blog:", formData)
                        onClose()
                    }}
                >
                    Publish Blog
                </button>
                <button
                    className="px-6 py-3 border border-gray-200 text-gray-500 font-bold rounded-xl hover:bg-gray-50"
                    onClick={onClose}
                >
                    Cancel
                </button>
            </div>
        </div>
    )
}

export default BlogForm;