"use client"

import { useState } from "react"
import { Camera, Lock, User, X, MapPin, Calendar, Users, FileText, Clock, CheckCircle, History, PenLine, Grid, Download, Check } from "lucide-react"
import { Calendar as CalendarIcon, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

// import applicantSignature from "../assets/applicant_sig.png";
// import recommenderSignature from "../assets/recommender_sig.png";
// import approverSignature from "../assets/approver_sig.png";

// import innovation from "../assets/innovation.png";


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
        profile_picture: "",       // profile picture
        signature: ""    // signature
    });

    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [otp, setOtp] = useState("")
    const [otpSent, setOtpSent] = useState(false)

    const [passwordLoading, setPasswordLoading] = useState(false)
    const [passwordMessage, setPasswordMessage] = useState("")

    const [selectedTab, setSelectedTab] = useState(window.location.hash.replace('#', '') || "events");
    const [showBlogForm, setShowBlogForm] = useState(false)
    const [selectedEvent, setSelectedEvent] = useState(null)

    const [text, setText] = useState("");


    const [activeFeedbackId, setActiveFeedbackId] = useState(null);

    const [selectedReq, setSelectedReq] = useState(null); 
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false); 
    const [signaturePreview, setSignaturePreview] = useState(profile.signature || null);

    const handleTabChange = (tabName) => {
        window.location.hash = tabName; 
        setSelectedTab(tabName);
    };
    useEffect(() => {
        const syncHashWithTab = () => {
            const hash = window.location.hash.replace('#', '');
            if (hash) {
                setSelectedTab(hash);
            } else {
                setSelectedTab('events'); 
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
                console.error("Error fetching profile:", err);
            }
        };

        fetchProfile();
    }, []);

    // const userId = localStorage.getItem("userId");
    const [allEvents, setAllEvents] = useState([]); 
    const [eventCategory, setEventCategory] = useState("all");

    useEffect(() => {
        const fetchEvents = async () => {
            const userId = localStorage.getItem("userId");
            const token = localStorage.getItem("token");
            try {
                const res = await axios.get(`http://localhost:5000/api/bookings/user-events/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAllEvents(res.data);
            } catch (err) {
                console.error("Fetch error:", err);
            }

        };
        fetchEvents();
    }, []);

    const filteredEvents = allEvents.filter(event => {
        if (eventCategory === "all") return true;
        return event.category === eventCategory;
    });

    // console.log("All Events:", allEvents);

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


