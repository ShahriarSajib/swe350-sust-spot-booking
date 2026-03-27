"use client"

import { useState } from "react"
import { Camera, Lock, User, X, MapPin, Calendar, Users, FileText, Clock, CheckCircle, History, PenLine, Grid, Download, Check } from "lucide-react"
import { Calendar as CalendarIcon, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import applicantSignature from "../assets/applicant_sig.png";
import recommenderSignature from "../assets/recommender_sig.png";
import approverSignature from "../assets/approver_sig.png";

import innovation from "../assets/innovation.png";


import BlogForm from './BlogForm';
import ProfileSidebar from "../components/profile_components/ProfileSidebar";
import EventCard from "../components/profile_components/EventCard";
import ApprovalModal from "../components/profile_components/ApprovalModal";
import MyBlogs from "../components/profile_components/MyBlogs";
import EventFilters from "../components/profile_components/EventFilters";
import TabSwitcher from "../components/profile_components/TabSwitcher";
import EventDetailsModal from "../components/profile_components/EventDetailsModal";
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


    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const userId = localStorage.getItem("userId"); //
                const token = localStorage.getItem("token");
                if (!userId) { console.error("User ID  missing"); return; }
                if (!token) { console.error(" Token missing"); return; }
                const res = await axios.get(`http://localhost:5000/api/users/profile/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const user = res.data;
                setProfile({
                    name: user.full_name || "",
                    email: user.email || "",
                    department: user.department || "",
                    contact: user.contact_number || "",
                    image: user.profile_picture ? `http://localhost:5,000/uploads/${user.profile_picture}` : "",
                    signature: user.signature ? `http://localhost:5000/uploads/${user.signature}` : ""
                });

            } catch (err) {
                console.error("Error fetching profile:",  err);
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
                // profile data
                profile={profile}
                setProfile={setProfile}
                signaturePreview={signaturePreview}

                // profile update handlers
                handleImageChange={handleImageChange}
                handleSignatureUpload={handleSignatureUpload}
                handleProfileUpdate={handleProfileUpdate}
                savingProfile={savingProfile}
                profileMessage={profileMessage}
                setProfileMessage={setProfileMessage}

                // password state
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
                <TabSwitcher selectedTab={selectedTab} onTabChange={handleTabChange} />

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex-1 flex flex-col">
                    {selectedTab === "events" ? (
                        <>
                            <EventFilters currentCategory={eventCategory} setCategory={setEventCategory} />

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
                                        activeFeedbackId={activeFeedbackId}
                                        text={text}
                                        setText={setText}
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
                <EventDetailsModal
                    isOpen={isDetailsOpen}
                    event={selectedReq}
                    onClose={() => setIsDetailsOpen(false)}
                />
            )}

            {isPreviewOpen && selectedReq && (
                <ApprovalModal
                    selectedReq={selectedReq}
                    setIsPreviewOpen={setIsPreviewOpen}
                />
            )}
        </div>
    )
}


