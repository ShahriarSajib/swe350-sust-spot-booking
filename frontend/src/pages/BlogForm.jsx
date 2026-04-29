import React, { useState } from "react";
import { Plus, X, Upload, Image as ImageIcon } from "lucide-react";

function BlogForm({ event, onClose }) {
    const [formData, setFormData] = useState({
        eventId: event?.id || "",
        eventName: event?.title || "Untitled Event",
        organizer: event?.club || event?.organizer || "N/A",
        spot: event?.name || "N/A",
        date: event?.date || event?.start_date || "",
        title: event?.title || "Untitled Blog",
        author: "",
        summary: "",
        content: "",
        tags: "",
        coverImage: { file: null, previewUrl: "" },
        scheduleFragments: [],
        images: [],
    });

    // --- Image Handlers ---
    const handleCoverImageChange = (file) => {
        if (!file) return;
        if (formData.coverImage.previewUrl) URL.revokeObjectURL(formData.coverImage.previewUrl);
        setFormData(prev => ({
            ...prev,
            coverImage: { file, previewUrl: URL.createObjectURL(file) }
        }));
    };

    const removeCoverImage = () => {
        if (formData.coverImage.previewUrl) URL.revokeObjectURL(formData.coverImage.previewUrl);
        setFormData(prev => ({ ...prev, coverImage: { file: null, previewUrl: "" } }));
    };

    const addScheduleFragment = () => setFormData(prev => ({ ...prev, scheduleFragments: [...prev.scheduleFragments, { time: "", activity: "", description: "" }] }));
    const removeScheduleFragment = (index) => setFormData(prev => ({ ...prev, scheduleFragments: prev.scheduleFragments.filter((_, i) => i !== index) }));
    const updateScheduleFragment = (index, field, value) => {
        const updated = [...formData.scheduleFragments];
        updated[index] = { ...updated[index], [field]: value };
        setFormData(prev => ({ ...prev, scheduleFragments: updated }));
    };

    const addImage = () => {
        if (formData.images.length < 4) {
            setFormData(prev => ({ ...prev, images: [...prev.images, { file: null, previewUrl: "", caption: "" }] }));
        }
    };

    const removeImage = (index) => {
        if (formData.images[index].previewUrl) URL.revokeObjectURL(formData.images[index].previewUrl);
        setFormData(prev => ({ ...prev, images: formData.images.filter((_, i) => i !== index) }));
    };

    const handleFileChange = (index, file) => {
        if (!file) return;
        if (formData.images[index].previewUrl) URL.revokeObjectURL(formData.images[index].previewUrl);
        const updated = [...formData.images];
        updated[index] = { ...updated[index], file: file, previewUrl: URL.createObjectURL(file) };
        setFormData(prev => ({ ...prev, images: updated }));
    };

    const updateImageField = (index, field, value) => {
        const updated = [...formData.images];
        updated[index] = { ...updated[index], [field]: value };
        setFormData(prev => ({ ...prev, images: updated }));
    };

    // Add this state to your component to handle loading
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handlePublish = async () => {
        setIsSubmitting(true);

        // 1. Initialize FormData
        const payload = new FormData();

        // 2. Append Text Fields
        payload.append('booking_id', event.booking_id);
        payload.append('title', formData.title);
        payload.append('author', formData.author);
        payload.append('summary', formData.summary);
        payload.append('content', formData.content);

        // 3. Append Cover Image
        if (formData.coverImage.file) {
            payload.append('coverImage', formData.coverImage.file);
        }

        // 4. Append Gallery Images
        const captions = [];
        // Removed 'index' because it was unused
        formData.images.forEach((img) => {
            if (img.file) {
                payload.append('galleryImages', img.file);
                captions.push(img.caption || "");
            }
        });
        payload.append('captions', JSON.stringify(captions));

        // 5. Append Schedule Data
        payload.append('scheduleData', JSON.stringify(formData.scheduleFragments));

        // 6. Send to Backend
        try {
            const response = await fetch('http://localhost:5000/api/blog/create', {
                method: 'POST',
                body: payload,
            });

            const result = await response.json();

            if (response.ok) {
                alert("Blog published successfully!");
                if (onClose) onClose();
            } else {
                alert("Error: " + result.error);
            }
        } catch (error) {
            console.error("Submission failed:", error);
            alert("Server error. Please try again.");
        } finally {
            setIsSubmitting(false); // This sets it back to false after completion
        }
    };

    if (!event) return <div className="p-10 text-center text-sky-500">Loading event data...</div>;

    console.log("booking id for blog:", event.booking_id);

    return (
        <div className="space-y-6  p-4 bg-white relative">
            {/* Event Info Grid */}
            <div className="grid grid-cols-2 gap-4 p-5 bg-sky-50 rounded-2xl border border-sky-100">
                {[
                    { label: "Event", value: formData.eventName },
                    { label: "Organizer", value: formData.organizer },
                    { label: "Location", value: formData.spot },
                    { label: "Date", value: formData.date },
                ].map((item, i) => (
                    <div key={i}>
                        <p className="text-[10px] font-bold text-sky-500 uppercase tracking-wider">{item.label}</p>
                        <p className="text-sm font-semibold text-sky-900">{item.value}</p>
                    </div>
                ))}
            </div>

            <div className="space-y-5">
                {/* Cover Image */}
                <div>
                    <label className="text-sm font-bold text-slate-600 block mb-2">Cover Image</label>
                    <div className="relative border-2 border-dashed border-sky-200 rounded-2xl p-4 bg-sky-50/50 hover:bg-sky-50 transition-colors">
                        {!formData.coverImage.previewUrl ? (
                            <label className="flex flex-col items-center justify-center cursor-pointer h-32">
                                <ImageIcon className="text-sky-400 mb-2" size={32} />
                                <span className="text-xs font-bold text-sky-600">Click to upload cover</span>
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleCoverImageChange(e.target.files[0])} />
                            </label>
                        ) : (
                            <div className="relative h-40 w-full rounded-xl overflow-hidden">
                                <img src={formData.coverImage.previewUrl} alt="Cover" className="w-full h-full object-cover" />
                                <button type="button" onClick={removeCoverImage} className="absolute top-2 right-2 bg-white/80 p-1 rounded-full text-red-500 hover:text-red-700">
                                    <X size={20} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Text Fields */}
                {[
                    { label: "Blog Title", field: "title", type: "text" },
                    { label: "Author Name", field: "author", type: "text" },
                    { label: "Summary", field: "summary", type: "textarea" },
                    { label: "Full Story Content", field: "content", type: "textarea" },
                ].map((input, idx) => (
                    <div key={idx}>
                        <label className="text-sm font-bold text-slate-600 block mb-1">{input.label}</label>
                        {input.type === "textarea" ? (
                            <textarea
                                className="w-full px-4 py-3 border border-sky-100 rounded-xl outline-none focus:ring-2 focus:ring-sky-500 bg-white shadow-sm"
                                rows={input.field === "summary" ? 2 : 5}
                                value={formData[input.field]}
                                onChange={(e) => setFormData({ ...formData, [input.field]: e.target.value })}
                            />
                        ) : (
                            <input
                                type="text"
                                className="w-full px-4 py-3 border border-sky-100 rounded-xl outline-none focus:ring-2 focus:ring-sky-500 bg-white shadow-sm"
                                value={formData[input.field]}
                                onChange={(e) => setFormData({ ...formData, [input.field]: e.target.value })}
                            />
                        )}
                    </div>
                ))}

                {/* Schedule */}
                <div className="pt-2">
                    <div className="flex items-center justify-between border-b border-sky-100 pb-2 mb-4">
                        <label className="text-sm font-extrabold text-sky-900">Event Schedule</label>
                        <button type="button" onClick={addScheduleFragment} className="flex items-center gap-1 text-xs font-bold text-sky-600 hover:bg-sky-100 px-3 py-1.5 rounded-lg transition-colors">
                            <Plus size={14} /> Add Timeline
                        </button>
                    </div>
                    {formData.scheduleFragments.map((fragment, index) => (
                        <div key={index} className="p-4 border border-sky-100 rounded-2xl bg-white mb-3 shadow-sm relative">
                            <button type="button" className="absolute top-3 right-3 text-sky-300 hover:text-red-500" onClick={() => removeScheduleFragment(index)}><X size={16} /></button>
                            <input className="w-full px-3 py-2 mb-2 border border-sky-100 rounded-lg text-sm" placeholder="Time" value={fragment.time} onChange={(e) => updateScheduleFragment(index, "time", e.target.value)} />
                            <input className="w-full px-3 py-2 border border-sky-100 rounded-lg text-sm font-semibold text-sky-900" placeholder="Activity Title" value={fragment.activity} onChange={(e) => updateScheduleFragment(index, "activity", e.target.value)} />
                            <textarea className="w-full px-3 py-2 mt-2 border border-sky-100 rounded-lg text-sm" placeholder="Activity Description" value={fragment.description} onChange={(e) => updateScheduleFragment(index, "description", e.target.value)} rows={3} />
                        </div>
                    ))}
                </div>

                {/* Gallery */}
                <div className="pt-2">
                    <div className="flex items-center justify-between border-b border-sky-100 pb-2 mb-4">
                        <label className="text-sm font-extrabold text-sky-900">
                            Gallery <span className="text-sky-400 font-normal">({formData.images.length}/4)</span>
                        </label>
                        {formData.images.length < 4 && (
                            <button type="button" onClick={addImage} className="flex items-center gap-1 text-xs font-bold text-sky-600 hover:bg-sky-100 px-3 py-1.5 rounded-lg transition-colors">
                                <Plus size={14} /> Add Image
                            </button>
                        )}
                    </div>
                    {formData.images.map((image, index) => (
                        <div key={index} className="p-4 border border-sky-100 rounded-2xl bg-white mb-3 shadow-sm relative">
                            <button type="button" className="absolute top-3 right-3 text-sky-300 hover:text-red-500" onClick={() => removeImage(index)}><X size={16} /></button>
                            <label className="flex items-center gap-2 px-3 py-2 border border-sky-100 rounded-lg bg-sky-50 cursor-pointer hover:bg-sky-100 text-sm font-medium text-sky-700 w-full transition-colors">
                                <Upload size={16} />
                                {image.file ? image.file.name : "Select Image"}
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(index, e.target.files[0])} />
                            </label>
                            {image.previewUrl && <img src={image.previewUrl} alt="Preview" className="mt-3 h-20 w-20 object-cover rounded-lg border-2 border-sky-200" />}
                            <input className="w-full mt-2 px-3 py-2 border border-sky-100 rounded-lg text-sm" placeholder="Caption" value={image.caption} onChange={(e) => updateImageField(index, "caption", e.target.value)} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex gap-3 pt-6 border-t border-sky-100">
                <button
                    type="button"
                    className={`flex-1 text-white font-bold py-3 rounded-xl shadow-lg transition-all ${isSubmitting ? 'bg-sky-400 cursor-not-allowed' : 'bg-sky-600 hover:bg-sky-700 shadow-sky-200'
                        }`}
                    onClick={handlePublish}
                    disabled={isSubmitting} // Prevents clicking while submitting
                >
                    {isSubmitting ? "Publishing..." : "Publish Blog"}
                </button>
                <button type="button" className="px-6 py-3 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all" onClick={onClose}>
                    Cancel
                </button>
            </div>
        </div>
    );
}

export default BlogForm;