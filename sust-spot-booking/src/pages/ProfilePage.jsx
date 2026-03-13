"use client"

import { useState } from "react"
import { Camera, Lock, User, X, MapPin, Calendar, Users, FileText, Clock, CheckCircle, History, PenLine, Grid, Download, Check } from "lucide-react"
import { Calendar as CalendarIcon, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import applicantSignature from "../assets/applicant_sig.png";
import recommenderSignature from "../assets/recommender_sig.png";
import approverSignature from "../assets/approver_sig.png";

import innovation from "../assets/innovation.png";


import BlogForm from './BlogForm';
import ProfileSidebar from "../components/profile_components/ProfileSidebar";
import EventCard from "../components/profile_components/EventCard";
import ApprovalModal from "../components/profile_components/ApprovalModal";
import MyBlogs from "../components/profile_components/MyBlogs";
import { useProfileUpdate } from "../components/profile_components/userProfileUpdate";  


import axios from "axios";

export default function ProfilePage() {
    const navigate = useNavigate();
    const [showEdit, setShowEdit] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const [profile, setProfile] = useState({
        name: "",
        email: "",
        department: "",
        contact: "",
        image: "",       // profile picture
        signature: ""    // signature
    });

    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [otp, setOtp] = useState("")
    const [otpSent, setOtpSent] = useState(false)

    const [passwordLoading, setPasswordLoading] = useState(false)
    const [passwordMessage, setPasswordMessage] = useState("")

    // URL থেকে ট্যাব নিবে, না থাকলে ডিফল্ট "events"
    const [selectedTab, setSelectedTab] = useState(window.location.hash.replace('#', '') || "events");
    const [eventCategory, setEventCategory] = useState("all")

    const [showBlogForm, setShowBlogForm] = useState(false)
    const [selectedEvent, setSelectedEvent] = useState(null)

    const [text, setText] = useState("");


    const [activeFeedbackId, setActiveFeedbackId] = useState(null);

    const [selectedReq, setSelectedReq] = useState(null); // ডাটা রাখার জন্য
    const [isPreviewOpen, setIsPreviewOpen] = useState(false); // Approval Preview-এর জন্য
    const [isDetailsOpen, setIsDetailsOpen] = useState(false); // See Details-এর জন্য

    const events = [
        {
            id: 1,
            title: "Annual Meet",
            session: "Day+Night",
            organizer: "Administration",
            spotName: "Central Auditorium",
            date: "2/15/2026",
            endDate: "2/16/2026",
            category: "upcoming",
            startTime: "10:00 AM",
            endTime: "09:00 PM",
            description: "Yearly gathering for all administrative staff to discuss progress and future goals.",
            applicant: {
                name: "John Doe",
                post: "Event Coordinator",
                department: "Administration",
                signature: applicantSignature

            },
            recommender: {
                name: "Dr. M. A. Rashid",
                post: "Registrar, SUST",
                signature: recommenderSignature
            },
            approver: {
                name: "Prof. Dr. Kamal Uddin",
                post: "Vice Chancellor, SUST",
                signature: approverSignature
            }
        },
        {
            id: 2,
            title: "Coding Hackathon",
            session: "Night",
            organizer: "Tech Club",
            spotName: "Mini Auditorium",
            date: "2/10/2026 ",
            endDate: "2/12/2026",
            category: "upcoming",
            description: "A 48-hour non-stop coding competition to solve real-world problems.",
            startTime: "04:30 PM",
            endTime: "08:30 PM",
            applicant: {
                name: "John Doe",
                post: "Event Coordinator",
                department: "Administration",
                signature: applicantSignature

            },
            recommender: {
                name: "Prof. Dr. Ariful Islam",
                post: "Head of CSE",
                signature: recommenderSignature
            },
            approver: {
                name: "Prof. Dr. Kamal Uddin",
                post: "Vice Chancellor, SUST",
                signature: approverSignature
            }
        },
        {
            id: 5,
            title: "Science Fair",
            session: "Day",
            organizer: "Science Club",
            spotName: "Lab Hall",
            date: "3/10/2026",
            category: "pending",
            startTime: "09:00 AM",
            endTime: "05:00 PM",
            description: "Showcasing innovative research projects from undergraduate students.",
            applicant: {
                name: "John Doe",
                post: "Event Coordinator",
                department: "Administration",
                signature: applicantSignature

            },
            recommender: {
                name: "Dr. Sabina Yasmin",
                post: "Dean of Physical Sciences",
                signature: recommenderSignature
            },
            approver: {
                name: "Prof. Dr. Kamal Uddin",
                post: "Vice Chancellor, SUST",
                signature: approverSignature
            }
        },
        {
            id: 3,
            title: "Art Exhibition",
            session: "Day",
            organizer: "Art Club",
            spotName: "Central Field",
            date: "8/5/2025",
            category: "past",
            startTime: "09:00 AM",
            endTime: "05:00 PM",
            description: "Showcasing innovative research projects from undergraduate students.",
            applicant: {
                name: "John Doe",
                post: "Event Coordinator",
                department: "Administration",
                signature: recommenderSignature

            },
            recommender: {
                name: "Dr. Sabina Yasmin",
                post: "Dean of Physical Sciences",
                signature: applicantSignature
            },
            approver: {
                name: "Prof. Dr. Kamal Uddin",
                post: "Vice Chancellor, SUST",
                signature: approverSignature
            }
        },
        {
            id: 4,
            title: "Tech Conference 2025",
            session: "Day+Night",
            organizer: "Tech Club",
            spotName: "Main Hall",
            date: "6/20/2025",
            endDate: "6/22/2025",
            category: "past",
            startTime: "10:00 AM",
            endTime: "09:00 PM",
            description: "Showcasing innovative research projects from undergraduate students.",
            applicant: {
                name: "John Doe",
                post: "Event Coordinator",
                department: "Administration",
                signature: applicantSignature

            },
            recommender: {
                name: "Dr. Sabina Yasmin",
                post: "Dean of Physical Sciences",
                signature: recommenderSignature
            },
            approver: {
                name: "Prof. Dr. Kamal Uddin",
                post: "Vice Chancellor, SUST",
                signature: approverSignature
            }
        },
    ];
    const myBlogs = [
        {
            id: "1",
            title: " Annual Innovation Hub Event",
            publishedDate: "Oct 12, 2025",
            description: "A thrilling experience managing the largest sports event of the year...",
            image: innovation, // Sample Image
            category: "Mini Auditorium"
        },
        {
            id: "2",
            title: "Music Night Harmony Recap",
            publishedDate: "Nov 05, 2025",
            description: "New safety measures and floor maintenance tips for our basketball players...",
            image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400",
            category: "Basketball Ground"
        }
    ];

    const filteredEvents = eventCategory === "all"
        ? events
        : events.filter((e) => e.category === eventCategory);

    const [signaturePreview, setSignaturePreview] = useState(profile.signature || null);

    const handleTabChange = (tabName) => {
        window.location.hash = tabName; // ইউআরএল এর শেষে #blogs যোগ করবে
        setSelectedTab(tabName);
    };
    useEffect(() => {
        const syncHashWithTab = () => {
            const hash = window.location.hash.replace('#', '');
            if (hash) {
                setSelectedTab(hash);
            } else {
                setSelectedTab('events'); // ডিফল্ট ট্যাব
            }
        };

        window.addEventListener('hashchange', syncHashWithTab);
        return () => window.removeEventListener('hashchange', syncHashWithTab);
    }, []);

    const {
        savingProfile,
        profileMessage,
        setProfileMessage,
        handleImageChange,
        handleSignatureUpload,
        handleProfileUpdate
    } = useProfileUpdate(profile, setProfile, setSignaturePreview, setShowEdit);

    // কম্পোনেন্টের ভেতরে এই ফাংশনটি দিন
    const handleDownloadPdf = () => {
        const input = document.getElementById('pdf-content'); // নিশ্চিত করুন এই ID টি আপনার ডিভে আছে

        if (!input) {
            console.error("ID 'pdf-content' not found in the DOM");
            alert("Error: Could not find the document to download.");
            return;
        }

        // ডাউনলোড শুরু হওয়ার আগে একটি ছোট ওয়েট বাটন লোডিং দেখাতে পারেন
        html2canvas(input, {
            scale: 2, // হাই কোয়ালিটি নিশ্চিত করার জন্য
            useCORS: true, // ইমেজ বা সিগনেচার লোড করার জন্য
            allowTaint: true,
            backgroundColor: "#ffffff"
        }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Approval_Copy_${selectedReq?.id || 'Request'}.pdf`);
        }).catch(err => {
            console.error("PDF generation failed:", err);
        });

    };


    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const userId = localStorage.getItem("userId"); // 👉 localStorage থেকে id নাও
                if (!userId) return;

                const res = await axios.get(`http://localhost:5000/api/users/profile/${userId}`);

                const user = res.data;

                setProfile({
                    name: user.full_name || "",
                    email: user.email || "",
                    department: user.department || "",
                    contact: user.contact_number || "",
                    image: user.profile_picture ? `http://localhost:5000/uploads/${user.profile_picture}` : "",
                    signature: user.signature ? `http://localhost:5000/uploads/${user.signature}` : ""
                });

            } catch (err) {
                console.error("Error fetching profile:", err);
            }
        };

        fetchProfile();
    }, []);

    if (!profile) {
        return (
            <div className="flex justify-center items-center h-screen">
                Loading profile details...
            </div>
        );
    }
    return (

        <div className="grid grid-cols-12 gap-6 p-6 min-h-screen bg-gray-50 font-sans">
            {/* ================= LEFT PANEL ================= */}
            <ProfileSidebar
                // প্রোফাইল ডাটা
            profile={profile}
            setProfile={setProfile}
            signaturePreview={signaturePreview}
            
            // হুক থেকে আসা ফাংশন ও স্টেট
            handleImageChange={handleImageChange}
            handleSignatureUpload={handleSignatureUpload}
            handleProfileUpdate={handleProfileUpdate}
            savingProfile={savingProfile}
            profileMessage={profileMessage}
            setProfileMessage={setProfileMessage}

            // পাসওয়ার্ড স্টেট (যা মেইন পেজে আছে)
            showEdit={showEdit}
            setShowEdit={setShowEdit}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            currentPassword={currentPassword}
            setCurrentPassword={setCurrentPassword}
            newPassword={newPassword}
            setNewPassword={setNewPassword}
            otp={otp}
            setOtp={setOtp}
            otpSent={otpSent}
            setOtpSent={setOtpSent}
            passwordLoading={passwordLoading}
            setPasswordLoading={setPasswordLoading}
            passwordMessage={passwordMessage}
            setPasswordMessage={setPasswordMessage}
            />

            {/* ================= RIGHT PANEL ================= */}
            <div className="col-span-12 lg:col-span-8 flex flex-col h-full">
                <div className="bg-gray-200/50 p-1.5 rounded-2xl flex w-fit mb-6 border border-gray-100">
                    <button
                        className={`px-8 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${selectedTab === "events" ? "bg-white text-sky-700 shadow-sm border border-gray-100" : "text-gray-500 hover:text-gray-700"}`}
                        // onClick={() => setSelectedTab("events")}
                        onClick={() => handleTabChange("events")}
                    >
                        <Calendar size={18} /> My Events
                    </button>
                    <button
                        className={`px-8 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${selectedTab === "blogs" ? "bg-white text-sky-700 shadow-sm border border-gray-100" : "text-gray-500 hover:text-gray-700"}`}
                        // onClick={() => setSelectedTab("blogs")}
                        onClick={() => handleTabChange("blogs")}
                    >
                        <PenLine size={18} /> My Blogs
                    </button>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex-1 flex flex-col">
                    {selectedTab === "events" ? (
                        <>
                            <div className="flex justify-between items-center mb-8">
                                <div className="flex bg-gray-100 p-1 rounded-xl overflow-x-auto">
                                    {[
                                        { id: "all", label: "All", icon: Grid },
                                        { id: "upcoming", label: "Upcoming", icon: CheckCircle },
                                        { id: "pending", label: "Pending", icon: Clock },
                                        { id: "past", label: "Past", icon: History },
                                    ].map((cat) => (
                                        <button
                                            key={cat.id}
                                            onClick={() => setEventCategory(cat.id)}
                                            className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${eventCategory === cat.id ? "bg-white text-sky-700 shadow-sm" : "text-gray-400 hover:text-gray-600"}`}
                                        >
                                            <cat.icon size={14} />
                                            {cat.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Filter Buttons */}
                            <div className="space-y-6 overflow-y-auto">
                                {filteredEvents.map(event => (
                                    <EventCard
                                        key={event.id}
                                        event={event}
                                        eventCategory={eventCategory}
                                        onSeeDetails={(ev) => { setSelectedReq(ev); setIsDetailsOpen(true); }}
                                        onApprovalCopy={(ev) => { setSelectedReq(ev); setIsPreviewOpen(true); setIsDetailsOpen(false); }}
                                        onWriteBlog={(ev) => { setSelectedEvent(ev); setShowBlogForm(true); }}
                                        onFeedback={(id) => setActiveFeedbackId(activeFeedbackId === id ? null : id)}
                                        activeFeedbackId={activeFeedbackId} // মেইন পেজের স্টেট
                                        text={text} // মেইন পেজের স্টেট
                                        setText={setText} // মেইন পেজের স্টেট
                                    />
                                ))}
                            </div>

                            {showBlogForm && selectedEvent && (
                                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
                                    <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
                                        <div className="p-6 border-b flex justify-between items-center bg-white">
                                            <h3 className="text-xl font-bold text-gray-800">Create Event Blog</h3>
                                            <button onClick={() => { setShowBlogForm(false); setSelectedEvent(null); }} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                                                <X size={24} />
                                            </button>
                                        </div>
                                        <div className="p-6 overflow-y-auto">
                                            <BlogForm event={selectedEvent} onClose={() => { setShowBlogForm(false); setSelectedEvent(null); }} />
                                        </div>
                                    </div>
                                </div>
                            )}

                        </>
                    ) : (
                        <div className="py-8">
                            <MyBlogs
                                myBlogs={myBlogs}
                                navigate={navigate}
                            />
                        </div>
                    )}
                </div>
            </div>
            {isDetailsOpen && selectedReq && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedReq(null)}></div>

                    {/* The Preview Box (Your UI code) */}
                    <div className="relative bg-white w-full max-w-2xl rounded-[32px] p-8 shadow-2xl space-y-6">
                        <h3 className="text-2xl font-black">{selectedReq.name}</h3>

                        <div className="grid grid-cols-2 gap-4">
                            <p><strong>Title:</strong> {selectedReq.title}</p>
                            <p><strong>Organizer:</strong> {selectedReq.organizer}</p>
                            <p><strong>Location:</strong> {selectedReq.spotName}</p>
                            <p><strong>Date:</strong> {selectedReq.date}</p>
                            <p><strong>session:</strong> {selectedReq.session}</p>
                        </div>

                        {/* Recommender Info from Array */}
                        <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                            <p className="text-[10px] font-bold text-gray-400 uppercase">Recommender</p>
                            <p className="font-bold">{selectedReq.recommender.name}</p>
                            <p className="text-sm text-blue-600">{selectedReq.recommender.post}</p>
                            <img src={selectedReq.recommender.signature} className="h-10 mt-2" alt="Signature" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-gray-400 font-bold uppercase text-[10px]">Description</label>
                            <div className="p-4 bg-gray-50 rounded-xl italic text-sm">
                                "{selectedReq.description}"
                            </div>
                        </div>

                        <button
                            onClick={() => setSelectedReq(null)}
                            className="px-8 bg-slate-500 hover:bg-slate-900 text-white py-3 rounded-2xl font-bold transition-all shadow-lg hover:shadow-slate-200"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {isPreviewOpen && selectedReq && (
                <ApprovalModal
                    selectedReq={selectedReq}
                    setIsPreviewOpen={setIsPreviewOpen}
                    handleDownloadPdf={handleDownloadPdf}
                />
            )}
        </div>
    )
}


