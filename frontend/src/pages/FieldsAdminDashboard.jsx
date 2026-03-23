"use client"

import { useState, useRef, useMemo, useEffect } from "react"
import axios from "axios"
import {
    LayoutDashboard, MapPin, ClipboardCheck, History, FileText, Settings,
    Calendar, Clock, Camera, CheckCircle2, User,      // Add this
    Mail,      // Add this
    ShieldCheck, // Add this
    Plus,
    X,
    ImagePlus,
    Check, Info, AlertCircle, Eye, ArrowUpDown, RotateCcw, PenLine, Upload// Add this, ArrowRight, Camera, ImagePlus, X, Check, Info, AlertCircle, Eye, ArrowUpDown, RotateCcw
} from "lucide-react"

import {
    Search,
    Filter,
    Download,
    Calendar as CalendarIcon,
    ChevronDown,
    XCircle
} from "lucide-react"

import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";


// import { useSearchParams } from "react-router-dom";

// import { Camera, ImagePlus, X } from "lucide-react";
import Header from "../components/Header/Header" // adjust path if needed

// export default function FieldsAdminDashboard() {
//     const [activeSection, setActiveSection] = useState("overview")

//     return (
//         <div className="min-h-screen bg-[#f8fafc]">
//             {/* TOP HEADER */}
//             {/* <Header /> */}

//             {/* BODY */}
//             <div className="flex">
//                 {/* SIDEBAR */}
//                 {/* ================= SIDEBAR ================= */}
//                 <aside className="w-64 bg-white border-r flex flex-col sticky top-[70px] h-[calc(100vh-70px)]">
//                     <nav className="flex-1 px-4 space-y-1 mt-4">
//                         <SidebarItem
//                             icon={<LayoutDashboard size={20} />}
//                             label="Overview"
//                             active={activeSection === "overview"}
//                             onClick={() => setActiveSection("overview")}
//                         />
//                         <SidebarItem
//                             icon={<MapPin size={20} />}
//                             label="Spot Management"
//                             active={activeSection === "spots"}
//                             onClick={() => setActiveSection("spots")}
//                         />
//                         <SidebarItem
//                             icon={<ClipboardCheck size={20} />}
//                             label="Booking Approvals"
//                             active={activeSection === "approvals"}
//                             onClick={() => setActiveSection("approvals")}
//                         />
//                         <SidebarItem
//                             icon={<History size={20} />}
//                             label="Booking History"
//                             active={activeSection === "history"}
//                             onClick={() => setActiveSection("history")}
//                         />
//                         <SidebarItem
//                             icon={<FileText size={20} />}
//                             label="Blog Moderation"
//                             active={activeSection === "blogs"}
//                             onClick={() => setActiveSection("blogs")}
//                         />
//                     </nav>
//                 </aside>
//                 {/* MAIN */}
//                 {/* ================= MAIN AREA ================= */}
//                 <main className="flex-1 p-10">
//                     <header className="mb-8">
//                     </header>
//                     {/* CONTENT */}
//                     {activeSection === "overview" && <DashboardOverview />}
//                     {activeSection === "spots" && <SpotManagement />}
//                     {activeSection === "approvals" && <BookingApprovals />}
//                     {activeSection === "history" && <BookingHistory />}
//                     {/* {activeSection === "blogs" && <BlogModeration />} */}
//                 </main>
//             </div>
//         </div>
//     )
// }

export default function FieldsAdminDashboard() {
    const [activeSection, setActiveSection] = useState("overview");
    // const [showNotifications, setShowNotifications] = useState(false);


    return (
        <div className="min-h-screen bg-[#f8fafc]">
            {/* BODY */}
            <div className="flex">

                {/* 1. SIDEBAR: Only show if we are NOT on the overview landing page */}
                {activeSection !== "overview" && (
                    <aside className="w-64 bg-white border-r flex flex-col sticky top-0 h-screen animate-in slide-in-from-left duration-300">
                        <nav className="flex-1 px-4 space-y-1 mt-4">
                            <SidebarItem
                                icon={<LayoutDashboard size={20} />}
                                label="Overview"
                                active={activeSection === "overview"}
                                onClick={() => setActiveSection("overview")}
                            />
                            <SidebarItem
                                icon={<MapPin size={20} />}
                                label="Spot Management"
                                active={activeSection === "spots"}
                                onClick={() => setActiveSection("spots")}
                            />
                            <SidebarItem
                                icon={<ClipboardCheck size={20} />}
                                label="Booking Approvals"
                                active={activeSection === "approvals"}
                                onClick={() => setActiveSection("approvals")}
                            />
                            <SidebarItem
                                icon={<History size={20} />}
                                label="Booking History"
                                active={activeSection === "history"}
                                onClick={() => setActiveSection("history")}
                            />
                            <SidebarItem
                                icon={<FileText size={20} />}
                                label="Blog Moderation"
                                active={activeSection === "blogs"}
                                onClick={() => setActiveSection("blogs")}
                            />
                        </nav>
                    </aside>
                )}

                {/* 2. MAIN AREA */}
                <main className={`flex-1 ${activeSection === "overview" ? "p-20" : "p-10"}`}>
                    {/* If overview is selected, show the Landing Layout (No Sidebar) */}
                    {activeSection === "overview" && (
                        <DashboardOverview setActiveSection={setActiveSection} />
                    )}

                    {/* If other sections are selected, show the Content with Sidebar existing */}
                    {activeSection === "spots" && <SpotManagement />}
                    {activeSection === "approvals" && <BookingApprovals />}
                    {activeSection === "history" && <BookingHistory />}
                    {activeSection === "blogs" && <BlogModeration />}
                </main>
            </div>

            {/* <NotificationModal 
                isOpen={showNotifications} 
                onClose={() => setShowNotifications(false)} 
            /> */}
        </div>
    );
}


/* ================= COMPONENTS ================= */

import signature from "../assets/approver_sig.png";

// const DashboardOverview = ({ setActiveSection }) => {

//     // Assume 'initialSignature' is imported or a string URL from your database
//     const [isEditing, setIsEditing] = useState(false);
//     const [adminData, setAdminData] = useState({
//         name: "Mokhlesur Rahman",
//         email: "mokhlesh123@sust.edu",
//         signatureUrl: signature
//     });

//     const handleImageChange = (e) => {
//         if (e.target.files && e.target.files[0]) {
//             const file = e.target.files[0];
//             // In a real app, you'd upload this to a server. 
//             // For now, we update the preview:
//             setAdminData({
//                 ...adminData,
//                 signatureUrl: URL.createObjectURL(file)
//             });
//         }
//     };

//     // Pass setActiveSection to navigate from cards
//     return (
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-500">

//             {/* ================= LEFT SIDE: ADMIN INFO ================= */}
//             <div className="lg:col-span-4 space-y-6">
//                 <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm relative">

//                     {/* Edit Info Button */}
//                     <button
//                         onClick={() => setIsEditing(!isEditing)}
//                         className="absolute top-6 right-6 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-gray-400 hover:text-sky-600 transition-all bg-gray-50 px-2 py-1 rounded-md"
//                     >
//                         <PenLine size={12} /> {isEditing ? "Cancel" : "Edit Info"}
//                     </button>

//                     <div className="flex flex-col items-center text-center">
//                         {/* Profile Avatar */}
//                         <div className="w-24 h-24 bg-sky-100 rounded-full flex items-center justify-center text-sky-600 mb-4 border-4 border-white shadow-md">
//                             <User size={48} />
//                         </div>

//                         {/* Editable Info Area */}
//                         {isEditing ? (
//                             <div className="w-full space-y-2 mb-2 animate-in fade-in slide-in-from-top-2">
//                                 <input
//                                     className="w-full p-2 text-sm border border-sky-100 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
//                                     value={adminData.name}
//                                     onChange={(e) => setAdminData({ ...adminData, name: e.target.value })}
//                                 />
//                                 <input
//                                     className="w-full p-2 text-sm border border-sky-100 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
//                                     value={adminData.email}
//                                     onChange={(e) => setAdminData({ ...adminData, email: e.target.value })}
//                                 />
//                                 <button
//                                     onClick={() => setIsEditing(false)}
//                                     className="w-full py-2 bg-sky-600 text-white text-xs font-bold rounded-lg hover:bg-sky-700 shadow-md transition-all"
//                                 >
//                                     Save Info
//                                 </button>
//                             </div>
//                         ) : (
//                             <>
//                                 <h2 className="text-xl font-bold text-slate-800">{adminData.name}</h2>
//                                 <p className="text-sm text-gray-500 font-medium">Head of Physical Education</p>
//                             </>
//                         )}

//                         {/* Admin Details */}
//                         <div className="w-full mt-6 space-y-3 pt-6 border-t border-gray-50 text-left">
//                             <div className="flex items-center gap-3 text-sm text-gray-600">
//                                 <Mail size={16} className="text-sky-500/70" />
//                                 <span className="truncate">{adminData.email}</span>
//                             </div>
//                             {/* <div className="flex items-center gap-3 text-sm text-gray-600">
//                     <ShieldCheck size={16} className="text-sky-500/70" />
//                     <span>Super Admin Privileges</span>
//                 </div> */}
//                         </div>

//                         {/* Signature Section */}
//                         {/* Signature Section */}
//                         <div className="w-full mt-6 pt-6 border-t border-gray-50">
//                             <div className="flex justify-between items-center mb-3">
//                                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Official Signature</p>
//                             </div>

//                             {/* The Image Box */}
//                             <div className="relative w-full h-28 border-2 border-dashed border-sky-100 rounded-2xl flex items-center justify-center bg-gray-50/50 overflow-hidden transition-all">
//                                 {adminData.signatureUrl ? (
//                                     <img
//                                         src={adminData.signatureUrl}
//                                         alt="Admin Signature"
//                                         className="h-full w-full object-contain p-4 mix-blend-multiply"
//                                     />
//                                 ) : (
//                                     <div className="flex flex-col items-center gap-1 text-gray-300">
//                                         <ImagePlus size={24} />
//                                         <span className="text-[10px] font-medium">No Signature</span>
//                                     </div>
//                                 )}
//                             </div>

//                             {/* Upload Option - Now placed BELOW the image */}
//                             <div className="mt-3 flex justify-center">
//                                 <label className="flex items-center gap-2 px-4 py-2 bg-white border border-sky-100 rounded-xl cursor-pointer hover:bg-sky-50 hover:border-sky-300 transition-all shadow-sm group">
//                                     <Upload size={14} className="text-sky-500 group-hover:scale-110 transition-transform" />
//                                     <span className="text-[11px] font-bold text-sky-600 uppercase tracking-tight">Update Signature Image</span>
//                                     <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
//                                 </label>
//                             </div>
//                         </div>

//                     </div>
//                 </div>
//             </div>

//             {/* ================= RIGHT SIDE: STATS & QUICK ACTIONS ================= */}
//             <div className="lg:col-span-8 space-y-8">
//                 {/* Header & Main Button */}
//                 <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//                     <div>
//                         <h1 className="text-3xl font-bold text-[#0f172a]">Admin Dashboard</h1>
//                         <p className="text-gray-500">Manage your system at a glance.</p>
//                     </div>
//                     <button className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-sky-200 flex items-center gap-2">
//                         <Plus size={18} /> Reserve a Spot
//                     </button>
//                 </div>

//                 {/* Unified Summary Card (The Count Bar) */}
//                 <div className="bg-[#eef6ff] border border-blue-100 rounded-3xl p-6">
//                     <div className="flex items-center gap-2 mb-4 text-[#0052cc]">
//                         <Calendar size={20} />
//                         <h3 className="font-bold text-lg">Requests (Last 30 Days)</h3>
//                     </div>
//                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                         <StatBox1 label="Total" count="12" color="text-slate-800" />
//                         <StatBox1 label="Approved" count="8" color="text-emerald-700" />
//                         <StatBox1 label="Pending" count="2" color="text-orange-700" />
//                         <StatBox1 label="Rejected" count="2" color="text-red-700" />
//                     </div>
//                 </div>

//                 {/* Navigation Cards Grid */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <NavCard
//                         title="Spot Management"
//                         icon={<MapPin size={24} />}
//                         desc="Edit, add or remove venues"
//                         onClick={() => setActiveSection("spots")}
//                     />
//                     <NavCard
//                         title="Booking Approvals"
//                         icon={<ClipboardCheck size={24} />}
//                         desc="Verify and approve requests"
//                         onClick={() => setActiveSection("approvals")}
//                     />
//                     <NavCard
//                         title="Booking History"
//                         icon={<History size={24} />}
//                         desc="View all past activities"
//                         onClick={() => setActiveSection("history")}
//                     />
//                     <NavCard
//                         title="Blog Moderation"
//                         icon={<FileText size={24} />}
//                         desc="Manage community content"
//                         onClick={() => setActiveSection("blogs")}
//                     />
//                 </div>


//             </div>
//         </div>
//     );
// };


// ── shared admin API helper ────────────────────────────────────────────────
const adminApi = () => {
    const token = localStorage.getItem("adminToken");
    return axios.create({
        baseURL: "http://localhost:5000/api/admin",
        headers: { Authorization: `Bearer ${token}` }
    });
};

const DashboardOverview = ({ setActiveSection }) => {
    // --- States for Admin Info ---
    const [isEditing, setIsEditing] = useState(false);
    const [adminData, setAdminData] = useState({
        name: localStorage.getItem("adminName") || "Admin",
        email: "",
        designation: localStorage.getItem("adminDesignation") || "",
        signatureUrl: signature
    });
    const [dashStats, setDashStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });

    // Load real profile + stats once on mount
    useEffect(() => {
        const api = adminApi();
        api.get("/profile").then(res => {
            const a = res.data;
            setAdminData(prev => ({
                ...prev,
                name: a.approver_name || prev.name,
                email: a.approver_email || prev.email,
                designation: a.approver_designation || prev.designation,
            }));
        }).catch(() => { }); // silently ignore if backend is offline

        api.get("/dashboard").then(res => {
            const s = res.data.stats || {};
            setDashStats({
                total: Number(s.total) || 0,
                pending: Number(s.pending) || 0,
                approved: Number(s.approved) || 0,
                rejected: Number(s.rejected) || 0,
            });
        }).catch(() => { });
    }, []);

    // --- States for Reservation Logic ---
    const [isReserveOpen, setIsReserveOpen] = useState(false);
    const [bookingType, setBookingType] = useState("single"); // 'single' or 'range'
    const [selectedDate, setSelectedDate] = useState(null);
    const [dateRange, setDateRange] = useState({ from: null, to: null });
    const [session, setSession] = useState(""); // 'day', 'night', 'day+night'
    const [conflictInfo, setConflictInfo] = useState(null);
    // const [showForm, setShowForm] = useState(false);
    const [selectedSpot, setSelectedSpot] = useState(""); // নতুন স্টেট
    const [showConfirmCancel, setShowConfirmCancel] = useState(false);

    const today = new Date();

    // --- Mock Data ---
    const [existingBookings, setExistingBookings] = useState([
        { date: "2026-01-31", spot: "Central Field", org: "CSE Dept", session: "Day", status: "partial" },
        { date: "2026-01-03", spot: "Central Field", org: "SUST Sports Club", session: "Night", status: "partial" },
        { date: "2026-01-05", spot: "Central Field", org: "PME Dept", session: "Full Day + Night", status: "full" },
        { date: "2026-01-20", spot: "Central Field", org: "Drama Society", session: "Day", status: "pending" },
    ]);


    // --- Helper Functions ---
    const formatLocalDate = (date) => {
        if (!date) return null;
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const checkAdminConflicts = (date) => {
        if (!date) return null;
        const dateStr = formatLocalDate(date);
        const booking = existingBookings.find(b => b.date === dateStr);

        if (booking) {
            return {
                type: booking.status,
                msg: `An event of '${booking.org}' is ${booking.status === 'pending' ? 'pending' : 'approved'} on this date (${booking.session} session).`,
                dateStr: dateStr
            };
        }
        return null;
    };

    const handleCancelExisting = (dateStr) => {
        setExistingBookings(existingBookings.filter(b => b.date !== dateStr));

        // রিসেট স্টেট
        setConflictInfo(null);
        setShowConfirmCancel(false);
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setAdminData({ ...adminData, signatureUrl: URL.createObjectURL(file) });
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-500">
            {/* LEFT SIDE: ADMIN INFO */}
            <div className="lg:col-span-4 space-y-6">
                <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm relative">
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="absolute top-6 right-6 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-gray-400 hover:text-sky-600 transition-all bg-gray-50 px-2 py-1 rounded-md"
                    >
                        <PenLine size={12} /> {isEditing ? "Cancel" : "Edit Info"}
                    </button>

                    <div className="flex flex-col items-center text-center">
                        <div className="w-24 h-24 bg-sky-100 rounded-full flex items-center justify-center text-sky-600 mb-4 border-4 border-white shadow-md">
                            <User size={48} />
                        </div>

                        {isEditing ? (
                            <div className="w-full space-y-2 mb-2">
                                <input
                                    className="w-full p-2 text-sm border border-sky-100 rounded-lg outline-none focus:ring-2 focus:ring-sky-500"
                                    value={adminData.name}
                                    onChange={(e) => setAdminData({ ...adminData, name: e.target.value })}
                                />
                                <input
                                    className="w-full p-2 text-sm border border-sky-100 rounded-lg outline-none focus:ring-2 focus:ring-sky-500"
                                    value={adminData.email}
                                    onChange={(e) => setAdminData({ ...adminData, email: e.target.value })}
                                />
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="w-full py-2 bg-sky-600 text-white text-xs font-bold rounded-lg hover:bg-sky-700 shadow-md"
                                >
                                    Save Info
                                </button>
                            </div>
                        ) : (
                            <>
                                <h2 className="text-xl font-bold text-slate-800">{adminData.name}</h2>
                                <p className="text-sm text-gray-500 font-medium">{adminData.designation || "Admin"}</p>
                            </>
                        )}

                        <div className="w-full mt-6 space-y-3 pt-6 border-t border-gray-50 text-left">
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <Mail size={16} className="text-sky-500/70" />
                                <span className="truncate">{adminData.email}</span>
                            </div>
                        </div>

                        <div className="w-full mt-6 pt-6 border-t border-gray-50">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Official Signature</p>
                            <div className="relative w-full h-28 border-2 border-dashed border-sky-100 rounded-2xl flex items-center justify-center bg-gray-50/50 overflow-hidden">
                                {adminData.signatureUrl ? (
                                    <img src={adminData.signatureUrl} alt="Signature" className="h-full w-full object-contain p-4" />
                                ) : (
                                    <div className="text-gray-300 text-[10px] flex flex-col items-center"><ImagePlus size={24} />No Signature</div>
                                )}
                            </div>
                            <label className="mt-3 flex justify-center cursor-pointer">
                                <div className="flex items-center gap-2 px-4 py-2 bg-white border border-sky-100 rounded-xl hover:bg-sky-50 transition-all">
                                    <Upload size={14} className="text-sky-500" />
                                    <span className="text-[11px] font-bold text-sky-600 uppercase">Update Signature</span>
                                    <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                                </div>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT SIDE: STATS & RESERVE DROPDOWN */}
            <div className="lg:col-span-8 space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-[#0f172a]">Admin Dashboard</h1>
                        <p className="text-gray-500">Manage your system at a glance.</p>
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => setIsReserveOpen(!isReserveOpen)}
                            className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-sky-200 flex items-center gap-2"
                        >
                            <Plus size={18} /> {isReserveOpen ? "Close Reservation" : "Reserve a Spot"}
                        </button>
                    </div>
                </div>

                {/* --- SEPARATE RESERVE DROPDOWN SECTION --- */}
                {/* Separate Dropdown/Section for Admin Reservation */}
                {/* Separate Dropdown/Section for Admin Reservation */}
                {isReserveOpen && (
                    <div className="bg-slate-50 border-2 border-sky-100 rounded-3xl p-6 animate-in slide-in-from-top duration-300">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                            <div>
                                <h3 className="text-lg font-bold text-sky-900 flex items-center gap-2">
                                    <CalendarIcon size={20} /> Admin Priority Reservation
                                </h3>
                                <p className="text-xs text-slate-500 ml-7 font-medium">Spot: {selectedSpot || "Not selected"}</p>
                            </div>

                            {/* SPOT & TYPE SELECTION */}
                            <div className="flex flex-wrap gap-2 w-full md:w-auto">
                                <select
                                    value={selectedSpot}
                                    onChange={(e) => {
                                        setSelectedSpot(e.target.value);
                                        setConflictInfo(null);
                                        setSelectedDate(null);
                                        setDateRange({ from: null, to: null });
                                        setShowConfirmCancel(false);
                                    }}
                                    className="text-xs font-bold p-3 rounded-xl border-2 border-sky-200 outline-none bg-white text-sky-700 shadow-sm"
                                >
                                    <option value="">Select Spot</option>
                                    <option value="Central Field">Central Field</option>
                                    <option value="Handball Ground">Handball Ground</option>
                                    <option value="Basketball Ground">Basketball Ground</option>
                                </select>

                                <select
                                    value={bookingType}
                                    onChange={(e) => {
                                        setBookingType(e.target.value);
                                        setSelectedDate(null);
                                        setDateRange({ from: null, to: null });
                                        setConflictInfo(null);
                                        setShowConfirmCancel(false);
                                    }}
                                    className="text-xs font-bold p-3 rounded-xl border-2 border-slate-200 outline-none bg-white text-slate-600 shadow-sm"
                                >
                                    <option value="single">Single Day</option>
                                    <option value="range">Multiple Days</option>
                                </select>
                            </div>
                        </div>

                        {!selectedSpot ? (
                            <div className="text-center py-12 bg-white/60 rounded-3xl border-2 border-dashed border-slate-200">
                                <MapPin className="mx-auto text-slate-300 mb-2" size={32} />
                                <p className="text-slate-500 font-bold">Please select a spot first</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-500">

                                {/* LEFT: CALENDAR */}
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                                    <DayPicker
                                        mode={bookingType === "single" ? "single" : "range"}
                                        selected={bookingType === "single" ? selectedDate : dateRange}
                                        disabled={(date) => date < today}
                                        onSelect={(value) => {
                                            if (bookingType === "single") {
                                                setSelectedDate(value);
                                                setConflictInfo(value ? checkAdminConflicts(value, selectedSpot) : null);
                                                setShowConfirmCancel(false);
                                            } else {
                                                // রেঞ্জ মুডে value একটি অবজেক্ট {from, to} দেয়
                                                setDateRange(value || { from: null, to: null });
                                                setConflictInfo(null);
                                            }
                                        }}
                                    />
                                </div>

                                {/* RIGHT: DETAILS & ACTIONS */}
                                <div className="flex flex-col h-full">
                                    {conflictInfo ? (
                                        /* Conflict Detected Section */
                                        <div className="bg-red-50 border-2 border-red-100 p-6 rounded-3xl mb-4 animate-in zoom-in-95 duration-200">
                                            <div className="flex items-start gap-3 mb-6">
                                                <div className="p-2 bg-red-100 text-red-600 rounded-xl">
                                                    <ClipboardCheck size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black text-red-600 uppercase mb-1">Conflict Detected</p>
                                                    <p className="text-sm text-red-900 font-semibold leading-relaxed">{conflictInfo.msg}</p>
                                                </div>
                                            </div>

                                            {!showConfirmCancel ? (
                                                <button
                                                    onClick={() => setShowConfirmCancel(true)}
                                                    className="w-full bg-white border-2 border-red-200 text-red-600 py-3 rounded-xl text-xs font-bold hover:bg-red-50 transition-all flex items-center justify-center gap-2"
                                                >
                                                    Cancel Existing Event
                                                </button>
                                            ) : (
                                                <div className="space-y-2 animate-in slide-in-from-bottom-2">
                                                    <button
                                                        onClick={() => handleCancelExisting(conflictInfo.dateStr)}
                                                        className="w-full bg-red-600 text-white py-4 rounded-xl text-sm font-black hover:bg-red-700 transition-all shadow-lg shadow-red-200 flex items-center justify-center gap-2"
                                                    >
                                                        Confirm Cancellation
                                                    </button>
                                                    <button
                                                        onClick={() => setShowConfirmCancel(false)}
                                                        className="w-full text-slate-500 py-2 text-[11px] font-bold uppercase tracking-widest hover:text-slate-700"
                                                    >
                                                        Keep Existing Event
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ) : ((bookingType === "single" && selectedDate) || (bookingType === "range" && dateRange?.from && dateRange?.to)) ? (
                                        /* Available Date or Range Section */
                                        <div className="space-y-6 animate-in slide-in-from-right-4">
                                            <div className="bg-emerald-50 border-2 border-emerald-100 p-4 rounded-2xl flex items-center gap-3">
                                                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                                                    <Plus size={16} />
                                                </div>
                                                <div className="text-sm font-bold text-emerald-800 leading-tight">
                                                    {bookingType === "single"
                                                        ? `Selected: ${selectedDate ? formatLocalDate(selectedDate) : ""}`
                                                        : `Range: ${formatLocalDate(dateRange.from)} - ${formatLocalDate(dateRange.to)}`}
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Select Session</h4>
                                                <div className="grid grid-cols-1 gap-2">
                                                    {["day", "night", "day+night"].map((s) => (
                                                        <label key={s} className={`flex items-center gap-3 p-4 border-2 rounded-2xl cursor-pointer transition-all ${session === s ? "border-sky-500 bg-sky-50 shadow-sm" : "border-slate-100 bg-white"}`}>
                                                            <input
                                                                type="radio"
                                                                name="admin-session"
                                                                value={s}
                                                                checked={session === s}
                                                                onChange={(e) => setSession(e.target.value)}
                                                                className="w-4 h-4 text-sky-600"
                                                            />
                                                            <span className="text-sm font-bold text-slate-800 capitalize">{s.replace("+", " & ")}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>

                                            <button
                                                disabled={!session}
                                                onClick={() => alert(`Reserved for ${bookingType === "single" ? "one day" : "the range"}`)}
                                                className={`w-full py-4 rounded-2xl font-black text-lg transition-all ${session ? "bg-sky-600 text-white shadow-xl shadow-sky-100" : "bg-slate-200 text-slate-400 cursor-not-allowed"}`}
                                            >
                                                Reserve {selectedSpot}
                                            </button>
                                        </div>
                                    ) : (
                                        /* Empty State: Prompt User to Select */
                                        <div className="h-full flex items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl p-8 text-center bg-white/40">
                                            <div>
                                                <CalendarIcon className="mx-auto text-slate-300 mb-2 opacity-20" size={48} />
                                                <p className="text-sm text-slate-400 font-bold italic">
                                                    {bookingType === "single" ? "Pick a date from the calendar" : "Pick start and end dates"}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* STATS SUMMARY BOXES */}
                <div className="bg-[#eef6ff] border border-blue-100 rounded-3xl p-6">
                    <div className="flex items-center gap-2 mb-4 text-[#0052cc]">
                        <Calendar size={20} />
                        <h3 className="font-bold text-lg">Requests (All Time)</h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <StatBox1 label="Total" count={dashStats.total} color="text-slate-800" />
                        <StatBox1 label="Approved" count={dashStats.approved} color="text-emerald-700" />
                        <StatBox1 label="Pending" count={dashStats.pending} color="text-orange-700" />
                        <StatBox1 label="Rejected" count={dashStats.rejected} color="text-red-700" />
                    </div>
                </div>

                {/* NAVIGATION CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <NavCard title="Spot Management" icon={<MapPin size={24} />} desc="Edit, add or remove venues" onClick={() => setActiveSection("spots")} />
                    <NavCard title="Booking Approvals" icon={<ClipboardCheck size={24} />} desc="Verify and approve requests" onClick={() => setActiveSection("approvals")} />
                    <NavCard title="Booking History" icon={<History size={24} />} desc="View all past activities" onClick={() => setActiveSection("history")} />
                    <NavCard title="Blog Moderation" icon={<FileText size={24} />} desc="Manage community content" onClick={() => setActiveSection("blogs")} />
                </div>
            </div>
        </div>
    );
};

// --- Sub-components (যাতে এরর না আসে) ---
// const StatBox1 = ({ label, count, color }) => (
//     <div className="bg-white p-4 rounded-2xl border border-blue-50">
//         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
//         <p className={`text-2xl font-black ${color}`}>{count}</p>
//     </div>
// );

// const NavCard = ({ title, icon, desc, onClick }) => (
//     <button onClick={onClick} className="flex items-center gap-4 p-5 bg-white border border-gray-100 rounded-3xl hover:border-sky-300 hover:shadow-md transition-all text-left group">
//         <div className="p-3 bg-sky-50 text-sky-600 rounded-2xl group-hover:bg-sky-600 group-hover:text-white transition-all">{icon}</div>
//         <div>
//             <h4 className="font-bold text-slate-800">{title}</h4>
//             <p className="text-xs text-gray-500">{desc}</p>
//         </div>
//     </button>
// );

// export default DashboardOverview;
/* --- SMALL HELPER COMPONENTS (Keep in same file) --- */

const StatBox1 = ({ label, count, color }) => (
    <div className="bg-white/60 p-4 rounded-2xl">
        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">{label}</p>
        <p className={`text-2xl font-black ${color}`}>{count}</p>
    </div>
);


const SidebarItem = ({ icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
      ${active
                ? "bg-[#e0f0ff] text-[#0052cc]"
                : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
            }`}
    >
        {icon}
        {label}
    </button>
)

const NavCard = ({ title, icon, desc, onClick }) => (
    <button
        onClick={onClick}
        className="flex items-center gap-4 p-5 bg-white border border-gray-100 rounded-2xl hover:border-sky-300 hover:shadow-md transition-all text-left group"
    >
        <div className="p-3 bg-sky-50 rounded-xl text-sky-600 group-hover:bg-sky-600 group-hover:text-white transition-colors">
            {icon}
        </div>
        <div>
            <h4 className="font-bold text-slate-800">{title}</h4>
            <p className="text-xs text-gray-400">{desc}</p>
        </div>
    </button>
);

/* Updated Support Component for Upcoming Events */
const EventItem = ({ title, date }) => (
    <div className="flex items-start gap-3 group cursor-pointer">
        <div className="mt-1 w-2 h-2 rounded-full bg-blue-500 group-hover:scale-125 transition-transform" />
        <div>
            <p className="text-sm font-semibold text-gray-800">{title}</p>
            <p className="text-xs text-gray-400">{date}</p>
        </div>
    </div>
)

const StatCard = ({ label, value, icon }) => (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
        <div className="flex justify-between items-start mb-4">
            <span className="text-sm font-medium text-gray-500">{label}</span>
            {icon}
        </div>
        <div className="text-3xl font-bold text-[#0f172a]">{value}</div>
    </div>
)

const ActivityRow = ({ name, action, event, date }) => (
    <div className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0">
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-[#0052cc] font-bold text-sm">
                JD
            </div>
            <div>
                <p className="text-sm font-semibold text-gray-900">
                    {name} <span className="font-normal text-gray-600">{action}</span>
                </p>
                <p className="text-xs text-gray-400 font-medium">
                    {event} • {date}
                </p>
            </div>
        </div>
        <button className="text-sm font-bold text-gray-900 hover:text-blue-600">Details</button>
    </div>
)

const ActionButton = ({ label }) => (
    <button className="w-full flex items-center justify-between bg-white p-4 rounded-xl text-sm font-bold text-gray-800 hover:shadow-md transition-shadow group">
        {label}
        <ArrowRight size={18} className="text-gray-400 group-hover:text-blue-600 transition-colors" />
    </button>
)

const Placeholder = ({ title }) => (
    <div className="bg-white border border-dashed rounded-3xl p-20 text-center text-gray-400">
        <p className="text-lg font-medium capitalize">{title} Content Coming Soon</p>
    </div>
)

import fieldImg from "../assets/central_field.jpg";
import handballImg from "../assets/handball_ground.png";
import basketballImg from "../assets/basketball_ground.png";

const SpotManagement = () => {
    // ── STATE ──────────────────────────────────────────────────
    const [spots, setSpots] = useState({
        "Central Field": {
            name: "Central Field",
            location: "East Side, SUST Campus",
            capacity: "10000",
            maxBooking: "7",
            description: "Main sports field for football and cricket.",
            rules: "1. No littering. 2. Prior permission required.",
            mainImage: fieldImg, // Replace with fieldImg
            gallery: ["https://images.unsplash.com/photo-1514525253361-bee8a48790c3"],
            recipients: [
                { name: "Registrar Office", email: "registrar@sust.edu" },
                { name: "Estate Officer", email: "estate@sust.edu" }
            ]
        },
        "Handball Ground": {
            name: "Handball Ground",
            location: "Beside Gym",
            capacity: "500",
            maxBooking: "5",
            description: "Dedicated court for handball matches.",
            rules: "1. Proper sports attire required.",
            mainImage: handballImg, // Replace with handballImg
            gallery: [],
            recipients: [
                { name: "Physical Education Dept", email: "sports@sust.edu" }
            ]
        },
        "Basketball Ground": {
            name: "Basketball Ground",
            location: "Near Medical Center",
            capacity: "300",
            maxBooking: "3",
            description: "Outdoor basketball court with floodlights.",
            rules: "1. Non-marking shoes only.",
            mainImage: basketballImg, // Replace with basketballImg
            gallery: [],
            recipients: [
                { name: "Proctor Office", email: "proctor@sust.edu" }
            ]
        }
    });

    const [activeSpot, setActiveSpot] = useState("Central Field");
    const [saving, setSaving] = useState(false);
    const [saveMsg, setSaveMsg] = useState("");
    const mainInputRef = useRef(null);
    const galleryInputRef = useRef(null);

    // Load spot data + recipients from DB on mount
    useEffect(() => {
        const api = adminApi();
        api.get("/spots").then(res => {
            const dbSpots = res.data || [];
            const spotMap = {};
            dbSpots.forEach(s => {
                const key = s.name;
                spotMap[key] = {
                    spot_id: s.spot_id,
                    name: s.name,
                    location: s.location || "",
                    capacity: String(s.capacity || ""),
                    maxBooking: String(s.max_booking || ""),
                    description: s.description || "",
                    rules: s.spot_rules || "",
                    mainImage: s.image1 ? `http://localhost:5000/uploads/${s.image1}` : fieldImg,
                    gallery: [s.image2, s.image3].filter(Boolean).map(img => `http://localhost:5000/uploads/${img}`),
                    recipients: []
                };
            });
            // Merge with existing state so local images don't break
            setSpots(prev => {
                const merged = { ...prev };
                Object.keys(spotMap).forEach(key => {
                    merged[key] = { ...prev[key], ...spotMap[key] };
                });
                return merged;
            });

            // Load recipients for each spot
            dbSpots.forEach(s => {
                api.get(`/spots/${s.spot_id}/recipients`).then(rRes => {
                    const recs = (rRes.data || []).map(r => ({ name: r.recipient_designation, email: r.recipient_email }));
                    setSpots(prev => ({
                        ...prev,
                        [s.name]: { ...prev[s.name], recipients: recs.length ? recs : prev[s.name]?.recipients || [] }
                    }));
                }).catch(() => { });
            });
        }).catch(() => { });
    }, []);

    // Helper to get current active data
    const currentData = spots[activeSpot];

    // Update logic for basic text fields
    const handleUpdate = (field, value) => {
        setSpots(prev => ({
            ...prev,
            [activeSpot]: { ...prev[activeSpot], [field]: value }
        }));
    };

    // Main image handler
    const handleMainImageChange = (e) => {
        const file = e.target.files[0];
        if (file) handleUpdate('mainImage', URL.createObjectURL(file));
    };

    // Gallery image handlers
    const handleAddGalleryImages = (e) => {
        const files = Array.from(e.target.files);
        const newImages = files.map(file => URL.createObjectURL(file));
        setSpots(prev => ({
            ...prev,
            [activeSpot]: {
                ...prev[activeSpot],
                gallery: [...prev[activeSpot].gallery, ...newImages]
            }
        }));
    };

    const removeGalleryImage = (indexToRemove) => {
        setSpots(prev => ({
            ...prev,
            [activeSpot]: {
                ...prev[activeSpot],
                gallery: prev[activeSpot].gallery.filter((_, i) => i !== indexToRemove)
            }
        }));
    };

    // Recipient Management Logic (Spot Specific)
    const addRecipient = () => {
        setSpots(prev => ({
            ...prev,
            [activeSpot]: {
                ...prev[activeSpot],
                recipients: [...prev[activeSpot].recipients, { name: "", email: "" }]
            }
        }));
    };

    const updateRecipient = (index, field, value) => {
        const updatedRecipients = [...currentData.recipients];
        updatedRecipients[index][field] = value;
        setSpots(prev => ({
            ...prev,
            [activeSpot]: { ...prev[activeSpot], recipients: updatedRecipients }
        }));
    };

    const removeRecipient = (indexToRemove) => {
        setSpots(prev => ({
            ...prev,
            [activeSpot]: {
                ...prev[activeSpot],
                recipients: prev[activeSpot].recipients.filter((_, i) => i !== indexToRemove)
            }
        }));
    };

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-6 animate-in fade-in duration-500">
            {/* Hidden Inputs */}
            <input type="file" ref={mainInputRef} className="hidden" accept="image/*" onChange={handleMainImageChange} />
            <input type="file" ref={galleryInputRef} className="hidden" accept="image/*" multiple onChange={handleAddGalleryImages} />

            {/* Tab Navigation */}
            <div className="flex gap-2 bg-gray-100 p-1 rounded-2xl w-fit">
                {Object.keys(spots).map((spot) => (
                    <button
                        key={spot}
                        onClick={() => setActiveSpot(spot)}
                        className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${activeSpot === spot ? "bg-white text-[#0052cc] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                    >
                        {spot}
                    </button>
                ))}
            </div>

            {/* Header Section */}
            <div>
                <h1 className="text-2xl font-black text-[#0f172a] tracking-tight">{activeSpot} Settings</h1>
                <p className="text-sm text-gray-500">Configure details and approval workflows for this venue.</p>
            </div>

            {/* Main Banner */}
            <div className="relative h-[300px] w-full rounded-[24px] overflow-hidden group border border-gray-100 shadow-sm">
                <img src={currentData.mainImage} alt="Banner" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/20 flex items-end justify-end p-6">
                    <button
                        onClick={() => mainInputRef.current.click()}
                        className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl text-xs font-bold text-gray-800 hover:bg-gray-50 shadow-lg transition-all"
                    >
                        <Camera size={16} className="text-[#0052cc]" /> Update Cover
                    </button>
                </div>
            </div>

            {/* Main Content Form */}
            <div className="bg-white rounded-[24px] border border-gray-100 p-8 shadow-sm space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Basic Info Inputs */}
                    <div className="space-y-1">
                        <label className="text-[11px] font-bold text-gray-500 uppercase ml-1">Spot Name</label>
                        <input
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-400 transition-all"
                            value={currentData.name}
                            onChange={(e) => handleUpdate('name', e.target.value)}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[11px] font-bold text-gray-500 uppercase ml-1">Location</label>
                        <input
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-400 transition-all"
                            value={currentData.location}
                            onChange={(e) => handleUpdate('location', e.target.value)}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[11px] font-bold text-gray-500 uppercase ml-1">Capacity</label>
                        <input
                            type="number"
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-400 transition-all"
                            value={currentData.capacity}
                            onChange={(e) => handleUpdate('capacity', e.target.value)}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[11px] font-bold text-gray-500 uppercase ml-1">Max Booking (Days)</label>
                        <input
                            type="number"
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-400 transition-all"
                            value={currentData.maxBooking}
                            onChange={(e) => handleUpdate('maxBooking', e.target.value)}
                        />
                    </div>

                    {/* Full Width Textareas */}
                    <div className="col-span-1 md:col-span-2 space-y-1">
                        <label className="text-[11px] font-bold text-gray-500 uppercase ml-1">Description</label>
                        <textarea
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm h-20 outline-none focus:border-blue-400 transition-all resize-none"
                            value={currentData.description}
                            onChange={(e) => handleUpdate('description', e.target.value)}
                        />
                    </div>
                    <div className="col-span-1 md:col-span-2 space-y-1">
                        <label className="text-[11px] font-bold text-gray-500 uppercase ml-1">Rules & Instructions</label>
                        <textarea
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm h-20 outline-none focus:border-blue-400 transition-all resize-none"
                            value={currentData.rules}
                            onChange={(e) => handleUpdate('rules', e.target.value)}
                        />
                    </div>

                    {/* Spot-Specific Recipient Block */}
                    <div className="col-span-1 md:col-span-2 mt-4 p-5 border border-blue-100 bg-blue-50/30 rounded-2xl space-y-4">
                        <div className="flex justify-between items-center border-b border-blue-100 pb-3">
                            <div>
                                <h3 className="text-sm font-black text-blue-800 uppercase tracking-tight">Approval Copy Recipients</h3>
                                <p className="text-[10px] text-blue-500 font-medium">Emails listed here will receive a copy of the approval letter.</p>
                            </div>

                        </div>

                        <div className="space-y-3">
                            {currentData.recipients.map((recipient, index) => (
                                <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-3 group">
                                    <input
                                        type="text"
                                        placeholder="Name / Designation"
                                        className="w-full p-2.5 bg-white border border-blue-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                                        value={recipient.name}
                                        onChange={(e) => updateRecipient(index, 'name', e.target.value)}
                                    />
                                    <div className="flex gap-2">
                                        <input
                                            type="email"
                                            placeholder="office.email@sust.edu"
                                            className="flex-1 p-2.5 bg-white border border-blue-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                                            value={recipient.email}
                                            onChange={(e) => updateRecipient(index, 'email', e.target.value)}
                                        />
                                        {currentData.recipients.length > 1 && (
                                            <button
                                                onClick={() => removeRecipient(index)}
                                                className="p-2 text-red-400 hover:text-red-600 transition-colors"
                                            >
                                                <X size={18} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={addRecipient}
                            className="inline-flex items-center gap-2 text-[11px] font-bold text-[#0052cc] bg-white px-4 py-2 rounded-lg border border-blue-200 hover:border-blue-400 transition-all shadow-sm"
                        >
                            <span className="text-lg">+</span> Add Recipient
                        </button>
                    </div>
                </div>

                {/* Gallery Section */}
                <div className="pt-6 border-t border-gray-100 space-y-4">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-bold text-gray-700">Visual Gallery</label>
                        {/* <button onClick={() => galleryInputRef.current.click()} className="text-[#0052cc] text-xs font-bold hover:underline">Upload Multiple</button> */}
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
                        {currentData.gallery.map((img, index) => (
                            <div key={index} className="relative aspect-square rounded-xl overflow-hidden group border border-gray-100">
                                <img src={img} className="w-full h-full object-cover" alt="Gallery" />
                                <button
                                    onClick={() => removeGalleryImage(index)}
                                    className="absolute top-1.5 right-1.5 p-1 bg-red-500 text-white rounded-md opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                                >
                                    <X size={12} />
                                </button>
                            </div>
                        ))}
                        <button
                            onClick={() => galleryInputRef.current.click()}
                            className="aspect-square bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-gray-400 hover:bg-blue-50 hover:border-blue-200 transition-all group"
                        >
                            <ImagePlus size={24} className="mb-1 group-hover:text-[#0052cc]" />
                            <span className="text-[10px] font-bold group-hover:text-[#0052cc]">Add More</span>
                        </button>
                    </div>
                </div>

                {/* Footer Controls */}
                <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-4 py-2 rounded-xl">
                        <Info size={14} />
                        <span className="text-[11px] font-bold tracking-tight">Modifying settings for {activeSpot} only</span>
                    </div>
                    {saveMsg && <span className={`text-xs font-bold px-3 py-1.5 rounded-lg ${saveMsg.includes('✓') ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'}`}>{saveMsg}</span>}
                    <div className="flex gap-3">
                        <button
                            onClick={() => setSaveMsg("")}
                            className="px-6 py-2.5 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-all text-sm"
                        >Discard</button>
                        <button
                            disabled={saving || !currentData.spot_id}
                            onClick={async () => {
                                setSaving(true); setSaveMsg("");
                                try {
                                    const api = adminApi();
                                    await api.put(`/spots/${currentData.spot_id}`, {
                                        name: currentData.name,
                                        description: currentData.description,
                                        location: currentData.location,
                                        spot_rules: currentData.rules
                                    });
                                    await api.put(`/spots/${currentData.spot_id}/recipients`, {
                                        recipients: currentData.recipients
                                    });
                                    setSaveMsg(`✓ Saved for ${currentData.name}`);
                                } catch { setSaveMsg("✗ Save failed. Try again."); }
                                finally { setSaving(false); }
                            }}
                            className="bg-[#0052cc] text-white px-8 py-2.5 rounded-xl font-bold hover:shadow-lg active:scale-95 transition-all text-sm disabled:opacity-60"
                        >
                            {saving ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
// হেল্পার ইনপুট কম্পোনেন্ট
const InputField = ({ label, type = "text", placeholder, defaultValue }) => (
    <div className="space-y-2">
        <label className="block text-sm font-bold text-gray-700">{label}</label>
        <input
            type={type}
            defaultValue={defaultValue}
            placeholder={placeholder}
            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-100 outline-none transition-all"
        />
    </div>
);


import applicantSignature from "../assets/applicant_sig.png";
import recommenderSignature from "../assets/recommender_sig.png";
import approverSignature from "../assets/approver_sig.png";
/* ================= 2. BOOKING APPROVALS (LOGIC INCLUDED) ================= */

const BookingApprovals = () => {
    // 1. STATE MANAGEMENT
    const [selectedReq, setSelectedReq] = useState(null);
    const [reason, setReason] = useState("");
    const [isRejectOpen, setIsRejectOpen] = useState(false);
    const [filterSpot, setFilterSpot] = useState("All Spots");
    const [filterDate, setFilterDate] = useState("");
    const [sortOrder, setSortOrder] = useState("newest");
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    // 2. REAL DATA from backend
    const [pendingData, setPendingData] = useState([]);
    const [loadingApprovals, setLoadingApprovals] = useState(true);

    const fetchPending = () => {
        const api = adminApi();
        setLoadingApprovals(true);
        api.get("/dashboard")
            .then(res => {
                const rows = res.data.pending || [];
                // Normalize backend fields → UI shape
                const normalized = rows.map(b => ({
                    id: `REQ-${String(b.booking_id).padStart(3, '0')}`,
                    booking_id: b.booking_id,
                    spotName: b.name || b.spot_name || "Unknown Spot",
                    title: b.event_title || b.title || "(No Title)",
                    organizer: b.full_name || b.organizer || "Unknown",
                    date: b.start_date ? b.start_date.split('T')[0] : "",
                    endDate: b.end_date ? b.end_date.split('T')[0] : null,
                    session: b.session || "",
                    startTime: b.start_time || "",
                    endTime: b.end_time || "",
                    timestamp: b.timestamp || b.start_date || new Date().toISOString(),
                    description: b.description || "",
                    applicant: { name: b.full_name || "", dept: b.dept || "", designation: b.designation || "", contact: b.contact_number || "" },
                    recommender: { name: b.recommender_name || "", post: b.recommender_post || "" },
                    approver: { name: localStorage.getItem("adminName") || "", post: localStorage.getItem("adminDesignation") || "" },
                }));
                setPendingData(normalized);
            })
            .catch(() => { })
            .finally(() => setLoadingApprovals(false));
    };

    useEffect(() => { fetchPending(); }, []);

    // Approve handler
    const handleApprove = async (req) => {
        try {
            await adminApi().post(`/bookings/${req.booking_id}/approve`);
            setPendingData(prev => prev.filter(r => r.booking_id !== req.booking_id));
            setSelectedReq(null);
            setIsPreviewOpen(false);
        } catch {
            alert("Failed to approve booking. Please try again.");
        }
    };

    // Reject handler
    const handleReject = async () => {
        if (!selectedReq || !reason) return;
        try {
            await adminApi().post(`/bookings/${selectedReq.booking_id}/reject`);
            setPendingData(prev => prev.filter(r => r.booking_id !== selectedReq.booking_id));
            setIsRejectOpen(false);
            setSelectedReq(null);
            setReason("");
        } catch {
            alert("Failed to reject booking. Please try again.");
        }
    };

    // 2b. placeholder data array (kept for reference, now unused)
    const _unusedMock = [
        {
            id: "REQ-011",
            spotName: "Handball Ground",
            title: "Inter-University Handball Tournament",
            organizer: "Physical Education Dept",
            date: "2026-02-10",
            endDate: "2026-02-12",
            session: "Morning",
            startTime: "08:00 AM",
            endTime: "01:00 PM",
            timestamp: "2026-02-10T08:00:00", // Added to fix NaN error
            description: "Annual inter-university handball competition involving multiple teams across the country. The event aims to promote sportsmanship and physical fitness among students.",
            applicant: { name: "Masud Rana", dept: "Physical Education", designation: "Sports Coordinator", contact: "018XXXXXXXX", signature: applicantSignature },
            recommender: { name: "Mr. Zaman", dept: "Sports Office", post: "Assistant Director", signature: recommenderSignature },
            approver: { name: "Prof. Dr. M. Ahmed", post: "Director of Physical Education", signature: approverSignature }
        },
        {
            id: "REQ-012",
            spotName: "Basketball Ground",
            title: "CSE Fest_1 Basketball Showdown",
            organizer: "CSE Society",
            date: "2026-01-12",
            endDate: null,
            session: "Evening",
            startTime: "04:30 PM",
            endTime: "08:30 PM",
            timestamp: "2026-01-12T18:45:00", // 06:45 PM
            applicant: { name: "Tahmid Hasan", dept: "CSE", designation: "Sports Secretary", contact: "015XXXXXXXX", signature: "/sig-tahmid.png" },
            recommender: { name: "Prof. Dr. Mohammad Shahid", dept: "CSE", post: "Head of Department", signature: "/sig-shahid.png" },
            approver: { name: "Prof. Dr. M. Ahmed", post: "Director of Physical Education", signature: "/sig-app.png" }
        },
        {
            id: "REQ-015", // Unique Key updated!
            spotName: "Basketball Ground",
            title: "CSE Fest_2 Basketball Showdown",
            organizer: "CSE Society",
            date: "2026-01-12",
            endDate: null,
            session: "Evening",
            startTime: "04:30 PM",
            endTime: "08:30 PM",
            timestamp: "2026-01-12T11:45:00", // 11:45 AM
            applicant: { name: "Tahmid Hasan", dept: "CSE", designation: "Sports Secretary", contact: "015XXXXXXXX", signature: "/sig-tahmid.png" },
            recommender: { name: "Prof. Dr. Mohammad Shahid", dept: "CSE", post: "Head of Department", signature: "/sig-shahid.png" },
            approver: { name: "Prof. Dr. M. Ahmed", post: "Director of Physical Education", signature: "/sig-app.png" }
        },
        {
            id: "REQ-013",
            spotName: "Central Field",
            title: "SUST Admission Test Pandal Construction",
            organizer: "Admission Committee 2026",
            date: "2026-04-15",
            endDate: "2026-04-20",
            session: "Full Day",
            startTime: "06:00 AM",
            endTime: "10:00 PM",
            timestamp: "2026-04-15T06:00:00", // Added to fix NaN error
            applicant: { name: "Engr. Rakib Uddin", dept: "Estate Office", designation: "Assistant Engineer", contact: "019XXXXXXXX", signature: "/sig-rakib.png" },
            recommender: { name: "Md. Jafar Alam", dept: "Registrar Office", post: "Registrar", signature: "/sig-jafar.png" },
            approver: { name: "Prof. Dr. M. Ahmed", post: "Director of Physical Education", signature: "/sig-app.png" }
        },
        {
            id: "REQ-014",
            spotName: "Handball Ground",
            title: "Departmental Cultural Night",
            organizer: "Sociology Dept",
            date: "2026-01-12",
            endDate: null,
            session: "Night",
            startTime: "06:00 PM",
            endTime: "11:59 PM",
            timestamp: "2026-01-12T18:00:00",
            applicant: { name: "Nabila Sultana", dept: "Sociology", designation: "Convener", contact: "013XXXXXXXX", signature: "/sig-nabila.png" },
            recommender: { name: "Dr. Lutfur Rahman", dept: "Sociology", post: "Head of Dept", signature: "/sig-lutfur.png" },
            approver: { name: "Prof. Dr. M. Ahmed", post: "Director of Physical Education", signature: "/sig-app.png" }
        }
    ];
    // End of unused mock array

    const resetFilters = () => {
        setFilterSpot("All Spots");
        setFilterDate("");
        setSortOrder("newest");
    };

    // 3. COLLECTIVE FILTERING & SORTING LOGIC
    const filteredAndSortedData = useMemo(() => {
        return pendingData
            .filter(req => {
                const matchesSpot = filterSpot === "All Spots" || req.spotName === filterSpot;
                const matchesDate = !filterDate || req.date === filterDate;
                return matchesSpot && matchesDate;
            })
            .sort((a, b) => {
                const timeA = new Date(a.timestamp).getTime();
                const timeB = new Date(b.timestamp).getTime();
                return sortOrder === "newest" ? timeB - timeA : timeA - timeB;
            });
    }, [pendingData, filterSpot, filterDate, sortOrder]);

    // 4. TIME FORMATTING HELPER (Bangladeshi 12h Format)
    const formatBDTime = (isoString) => {
        const date = new Date(isoString);
        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        return `${hours}:${minutes} ${ampm}`;
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 p-6 animate-in fade-in duration-500">
            {/* HEADER */}
            <div>
                <h2 className="text-3xl font-black text-slate-800 tracking-tight">Booking Approvals</h2>
                <p className="text-gray-500 text-sm">Collective filtering by spot, date, and request time.</p>
            </div>

            {/* SPOT FILTER (Pill-style Toggle) */}
            {/* UNIFIED FILTER & SORT BAR */}
            <div className="bg-white p-5 rounded-[32px] border border-gray-100 shadow-sm flex items-end gap-8">

                {/* 1. SELECT FIELD GROUP */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-4">
                        Select Field
                    </label>
                    <div className="flex bg-gray-50/80 p-1.5 rounded-[24px] border border-gray-100 gap-1">
                        {["All Spots", "Central Field", "Handball Ground", "Basketball Ground"].map((spot) => (
                            <button
                                key={spot}
                                onClick={() => setFilterSpot(spot)}
                                className={`px-6 py-2 rounded-[20px] text-xs font-bold transition-all duration-300 ${filterSpot === spot
                                    ? "bg-white text-[#0052cc] shadow-sm"
                                    : "text-slate-500 hover:text-slate-800"
                                    }`}
                            >
                                {spot}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 2. TARGET DATE GROUP */}
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">
                        Target Date
                    </label>
                    <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-[18px] border border-gray-100 h-[52px]">
                        <Calendar size={18} className="text-[#0052cc]" />
                        <input
                            type="date"
                            value={filterDate}
                            onChange={(e) => setFilterDate(e.target.value)}
                            className="bg-transparent text-sm font-bold text-slate-700 outline-none cursor-pointer"
                        />
                    </div>
                </div>

                {/* 3. ACTION GROUP (Clear + Sort) */}
                <div className="ml-auto flex items-center gap-4">
                    {/* Only show Reset if filters are active */}
                    {(filterSpot !== "All Spots" || filterDate !== "") && (
                        <button
                            onClick={resetFilters}
                            className="flex items-center gap-2 text-gray-400 hover:text-red-500 px-4 py-2 text-xs font-bold transition-colors duration-200"
                        >
                            <RotateCcw size={14} />
                            Reset
                        </button>
                    )}

                    <button
                        onClick={() => setSortOrder(prev => prev === "newest" ? "oldest" : "newest")}
                        className="flex items-center gap-2 bg-[#0f172a] text-white px-6 py-3.5 rounded-[20px] text-xs font-bold hover:bg-slate-800 transition-all shadow-lg h-[52px]"
                    >
                        <ArrowUpDown size={16} />
                        {sortOrder === "newest" ? "Latest First" : "Earliest First"}
                    </button>
                </div>
            </div>

            {/* MAIN LIST */}
            {loadingApprovals && (
                <div className="text-center py-12 text-gray-400 font-bold">Loading pending bookings...</div>
            )}
            {!loadingApprovals && filteredAndSortedData.length === 0 && (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                    <CheckCircle2 className="mx-auto text-green-400 mb-3" size={40} />
                    <p className="text-gray-500 font-bold text-lg">No pending bookings!</p>
                    <p className="text-xs text-gray-400 mt-1">All requests have been processed.</p>
                </div>
            )}
            <div className="grid gap-3">
                {filteredAndSortedData.map((req) => (
                    <div
                        key={req.id}
                        className="bg-white border border-gray-100 rounded-[24px] p-4 shadow-sm flex flex-col lg:flex-row justify-between items-center gap-4 group"
                    >
                        <div className="space-y-2 flex-1 w-full"> {/* Reduced vertical spacing */}
                            <div className="flex gap-2 items-center">
                                {/* Smaller Badge */}
                                <span className="bg-blue-50 text-[#0052cc] px-3 py-0.5 rounded-full text-[9px] font-black tracking-widest">
                                    {req.id}
                                </span>
                                {/* Smaller Timestamp */}
                                <span className="flex items-center gap-1 text-[10px] font-bold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-md">
                                    <Clock size={12} /> {formatBDTime(req.timestamp)}
                                </span>
                            </div>

                            {/* Smaller Title */}
                            <h3 className="text-sm font-bold text-slate-800 group-hover:text-[#0052cc] transition-colors leading-tight">
                                {req.title}
                            </h3>

                            {/* Smaller Metadata */}
                            <div className="flex flex-wrap gap-4 text-xs text-gray-500 font-bold">
                                <span className="flex items-center gap-1.5">
                                    <MapPin size={14} className="text-blue-500" /> {req.spotName}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Calendar size={14} className="text-blue-500" /> {req.date}
                                </span>
                            </div>
                        </div>

                        {/* Compact Action Buttons */}
                        <div className="flex gap-2 w-full lg:w-auto">
                            <button
                                onClick={() => setSelectedReq(req)}
                                className="flex-1 lg:flex-none bg-gray-100 text-gray-700 px-4 py-2 rounded-xl text-xs font-bold hover:bg-gray-200 flex items-center justify-center gap-2 transition-all active:scale-95"
                            >
                                <Eye size={16} />See Details
                            </button>
                            <button
                                onClick={() => { setSelectedReq(req); setIsRejectOpen(true); }}
                                className="flex-1 lg:flex-none bg-red-50 text-red-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-red-600 hover:text-white border border-red-100 transition-all flex items-center gap-2"
                            >
                                <X size={14} /> Reject
                            </button>
                            <button
                                onClick={() => handleApprove(req)}
                                className="flex-1 lg:flex-none bg-[#0052cc] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-700 flex items-center gap-2 transition-all active:scale-95"
                            >
                                <Check size={14} /> Approve
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- 5. MODALS SECTION (PLACED AT THE BOTTOM) --- */}

            {/* DETAIL MODAL */}
            {/* DETAIL MODAL */}
            {selectedReq && !isRejectOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => { setSelectedReq(null); setIsPreviewOpen(false); }}></div>

                    {/* Conditional Rendering: Switch between Details and PDF Preview */}
                    {!isPreviewOpen ? (
                        /* --- ORIGINAL DETAIL VIEW --- */
                        <div className="relative bg-white w-full max-w-2xl rounded-[32px] p-8 shadow-2xl animate-in zoom-in-95 duration-200 space-y-6">
                            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                                <h3 className="text-2xl font-black text-slate-800 tracking-tight">Booking Details</h3>
                                <span className="bg-blue-50 text-[#0052cc] px-4 py-1 rounded-full text-xs font-bold border border-blue-100 uppercase">{selectedReq.id}</span>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <DetailItem label="Organizer" value={selectedReq.organizer} />
                                <DetailItem label="Spot" value={selectedReq.spotName} />
                                <DetailItem label="Date" value={selectedReq.date} />
                                <DetailItem label="Session" value={selectedReq.session} />

                            </div>

                            <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-2">
                                <label className="text-gray-400 block font-bold uppercase text-[10px] tracking-widest">Recommender Info</label>
                                <p className="font-bold text-slate-800 text-lg">{selectedReq.recommender?.name}</p>
                                <p className="text-sm text-blue-600 font-medium">{selectedReq.recommender?.post}</p>
                                <img src={selectedReq.recommender?.signature} alt="Recommender Signature" className="h-12 w-32 object-contain" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-gray-400 block font-bold uppercase text-[10px] tracking-widest">Event Description</label>
                                <div className="p-4 bg-slate-50 rounded-2xl italic font-medium text-slate-600 text-sm leading-relaxed">
                                    "{selectedReq.description}"
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button onClick={() => setSelectedReq(null)} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3.5 rounded-2xl font-bold transition-all">Close</button>
                                <button onClick={() => setIsPreviewOpen(true)} className="flex-1 bg-[#0052cc] text-white py-3.5 rounded-2xl font-bold shadow-lg hover:bg-blue-700 transition-all">Preview &amp; Approve</button>
                            </div>
                        </div>
                    ) : (
                        /* --- NEW PDF / APPROVAL PREVIEW VIEW --- */
                        <div className="relative bg-zinc-100 w-full max-w-4xl rounded-[32px] shadow-2xl animate-in fade-in zoom-in-95 duration-300 flex flex-col max-h-[95vh]">
                            {/* PDF Header Tool */}
                            <div className="bg-slate-900 p-3 rounded-t-[32px] text-white flex justify-between items-center px-8">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80">Approval Copy System</span>
                                <button onClick={() => setIsPreviewOpen(false)} className="hover:bg-slate-800 p-1.5 rounded-full transition-colors">
                                    <X size={18} />
                                </button>
                            </div>

                            {/* The Document Area */}
                            <div className="p-6 overflow-y-auto">
                                <div className="bg-white w-full mx-auto p-10 shadow-sm border border-gray-200 text-slate-900 min-h-[842px] font-sans">
                                    {/* Header */}
                                    <div className="text-center mb-8 border-b-2 border-slate-900 pb-4">
                                        <h1 className="text-2xl font-black uppercase tracking-tight">Approval Copy</h1>
                                        <p className="text-sm font-bold text-slate-500 uppercase">Shahjalal University of Science & Technology</p>
                                    </div>

                                    <div className="space-y-8">
                                        {/* 1. Event Details */}
                                        <section>
                                            <h2 className="bg-slate-100 px-3 py-1 text-[11px] font-black uppercase tracking-widest mb-4 inline-block">01. Event Details</h2>
                                            <div className="grid grid-cols-2 gap-x-12 gap-y-4 text-sm ml-2">
                                                <PdfRow label="Event Title" value={selectedReq.title} />
                                                <PdfRow label="Spot Name" value={selectedReq.spotName} />
                                                <PdfRow
                                                    label="Date"
                                                    value={selectedReq.endDate ? `${selectedReq.date} to ${selectedReq.endDate}` : selectedReq.date}
                                                />
                                                <PdfRow label="Session" value={selectedReq.session} />
                                                <PdfRow label="Organizer" value={selectedReq.organizer} />
                                                <PdfRow label="Timing" value={`${selectedReq.startTime || '00:00'} - ${selectedReq.endTime || '00:00'}`} />
                                            </div>
                                        </section>

                                        {/* 2. Stakeholder Grid (Applicant, Recommender, Approver) */}
                                        <section className="grid grid-cols-3 gap-8 border-t border-b border-gray-100 py-8">
                                            {/* Applicant */}
                                            <div className="space-y-4">
                                                <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Applicant Details</h3>
                                                <div className="text-xs space-y-1">
                                                    <p className="font-bold">{selectedReq.applicant?.name || 'N/A'}</p>
                                                    <p>{selectedReq.applicant?.dept || 'N/A'}</p>
                                                    <p className="text-slate-500 italic">{selectedReq.applicant?.designation}</p>
                                                    <p className="pt-2">Contact: {selectedReq.applicant?.contact}</p>
                                                </div>
                                                <div className="h-12 w-24 bg-gray-50 flex items-center justify-center border border-dashed rounded italic text-[10px] text-gray-400">
                                                    <img src={selectedReq.applicant?.signature} alt="sig" />
                                                    {/* Applicant Signature */}
                                                </div>
                                            </div>

                                            {/* Recommender */}
                                            <div className="space-y-4">
                                                <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Recommender Details</h3>
                                                <div className="text-xs space-y-1">
                                                    <p className="font-bold">{selectedReq.recommender?.name}</p>
                                                    <p>{selectedReq.recommender?.dept || 'Physics'}</p>
                                                    <p className="text-slate-500 italic">{selectedReq.recommender?.post}</p>
                                                </div>
                                                <div className="h-12 w-24 bg-gray-50 flex items-center justify-center border border-dashed rounded italic text-[10px] text-gray-400">
                                                    <img src={selectedReq.recommender?.signature} alt="sig" />
                                                    {/* Recommender Signature */}
                                                </div>
                                            </div>

                                            {/* Approver */}
                                            <div className="space-y-4">
                                                <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Approver Details</h3>
                                                <div className="text-xs space-y-1">
                                                    <p className="font-bold">{selectedReq.approver?.name || 'Prof. Dr. M. Ahmed'}</p>
                                                    <p className="text-slate-500 italic">{selectedReq.approver?.post || 'Director'}</p>
                                                </div>
                                                <div className="h-12 w-24 bg-blue-50/50 flex items-center justify-center border border-blue-100 rounded italic text-[10px] text-blue-400">
                                                    <img src={selectedReq.approver?.signature} alt="sig" />
                                                    {/* Approver Signature */}
                                                </div>
                                            </div>
                                        </section>
                                        <section className="space-y-3 pt-4 border-t border-slate-100">
                                            <p className="text-[11px] font-black text-slate-800 uppercase tracking-wider">Terms and Conditions</p>
                                            <ol className="text-[11px] text-slate-600 space-y-1 ml-4 list-decimal leading-relaxed">
                                                <li>The applicant must ensure the cleanliness of the spot and properly dispose of all waste materials after the event.</li>
                                                <li>Any damage to university property during the event will be the sole responsibility of the organizing department/individual.</li>
                                                <li>Sound systems must be kept within a reasonable volume limit to avoid disturbing the academic environment of the university.</li>
                                                <li>The event must be concluded strictly within the approved timeframe, and no extension is allowed without prior permission from the Estate Office.</li>
                                            </ol>
                                        </section>

                                        {/* 3. Forwarded Copy List */}
                                        <section className="space-y-3">
                                            <p className="text-[11px] font-black text-slate-800">Forwarded copy to:</p>
                                            <ol className="text-[11px] text-slate-600 space-y-1 ml-4 list-decimal leading-relaxed">
                                                <li>The Registrar, SUST (for kind information).</li>
                                                <li>The Estate Officer, SUST (for field preparation and security).</li>
                                                <li>The Proctor, SUST (for maintenance of law and order).</li>
                                                <li>The Director (Audit), SUST.</li>
                                                <li>Office Copy.</li>
                                            </ol>
                                        </section>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Action Buttons */}
                            <div className="p-5 bg-white rounded-b-[32px] border-t border-gray-100 flex justify-end gap-3 px-8">
                                <button
                                    onClick={() => setIsPreviewOpen(false)}
                                    className="px-6 py-2 text-xs font-bold text-gray-500 hover:text-red-500 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleApprove(selectedReq)}
                                    className="bg-[#0052cc] text-white px-8 py-2 rounded-xl text-xs font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all flex items-center gap-2"
                                >
                                    <Check size={14} /> Confirm &amp; Approve
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* REJECT MODAL */}
            {isRejectOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-red-900/10 backdrop-blur-sm" onClick={() => { setIsRejectOpen(false); setSelectedReq(null); }}></div>
                    <div className="relative bg-white w-full max-w-md rounded-[32px] p-8 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        <h3 className="text-xl font-bold text-red-600">Reject Request</h3>
                        <textarea
                            className="w-full p-4 bg-gray-50 border rounded-2xl h-32 outline-none focus:ring-2 focus:ring-red-100 border-gray-200 text-sm"
                            placeholder="Enter the reason for rejection..."
                            value={reason}
                            onChange={e => setReason(e.target.value)}
                        />
                        <div className="flex gap-4">
                            <button onClick={() => { setIsRejectOpen(false); setSelectedReq(null); setReason(""); }} className="flex-1 py-3 font-bold text-gray-500">Cancel</button>
                            <button disabled={!reason} onClick={handleReject} className="flex-1 bg-red-600 text-white py-3 rounded-2xl font-bold shadow-lg disabled:opacity-50 transition-all">Confirm Reject</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const PdfRow = ({ label, value }) => (
    <div className="flex border-b border-gray-50 pb-2">
        <span className="w-32 text-gray-400 font-bold uppercase text-[10px] tracking-wider">{label}</span>
        <span className="font-bold text-slate-800 uppercase tracking-tight">{value || 'N/A'}</span>
    </div>
);

// 6. HELPER COMPONENT (PLACED OUTSIDE MAIN COMPONENT)
const DetailItem = ({ label, value }) => (
    <div className="space-y-1">
        <label className="text-gray-400 block font-bold uppercase text-[10px] tracking-widest">{label}</label>
        <p className="font-bold text-slate-700">{value}</p>
    </div>
);


// allHistoryData is now loaded from API inside BookingHistory

// import React, { useState } from "react";
// import {   X } from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import autoTable from "jspdf-autotable";

const BookingHistory = () => {
    const [filterStatus, setFilterStatus] = useState("All");
    const [filterSpot, setFilterSpot] = useState("All Spots");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null);

    // ── Real data from backend ───────────────────────────────────────
    const [allHistoryData, setAllHistoryData] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(true);

    useEffect(() => {
        adminApi().get("/bookings")
            .then(res => {
                const rows = res.data || [];
                const normalized = rows.map(b => {
                    const rawStatus = (b.booking_status || "pending").toLowerCase();
                    const statusMap = { approved: "Approved", rejected: "Rejected", cancelled: "Cancelled", pending: "Pending" };
                    return {
                        id: `REQ-${String(b.booking_id).padStart(3, '0')}`,
                        title: b.event_title || b.title || "(No Title)",
                        spotName: b.name || b.spot_name || "Unknown Spot",
                        organizer: b.full_name || b.organizer || "Unknown",
                        date: b.start_date ? b.start_date.split('T')[0] : "",
                        startDate: b.start_date ? b.start_date.split('T')[0] : "",
                        endDate: b.end_date ? b.end_date.split('T')[0] : null,
                        status: statusMap[rawStatus] || "Pending",
                    };
                });
                setAllHistoryData(normalized);
            })
            .catch(() => { })
            .finally(() => setLoadingHistory(false));
    }, []);

    // Updated Filtering Logic
    const filteredData = allHistoryData.filter((item) => {
        const itemDate = new Date(item.date || item.startDate);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        const matchesStatus = filterStatus === "All" || item.status === filterStatus;
        const matchesSpot = filterSpot === "All Spots" || item.spotName === filterSpot;
        const matchesDateRange = (!start || itemDate >= start) && (!end || itemDate <= end);

        return matchesStatus && matchesSpot && matchesDateRange;
    });

    const baseDataForStats = allHistoryData.filter((item) => {
        const itemDate = new Date(item.date || item.startDate);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        const matchesSpot = filterSpot === "All Spots" || item.spotName === filterSpot;
        const matchesDateRange = (!start || itemDate >= start) && (!end || itemDate <= end);

        return matchesSpot && matchesDateRange;
    });

    const stats = {
        total: baseDataForStats.length,
        approved: baseDataForStats.filter(d => d.status === "Approved").length,
        rejected: baseDataForStats.filter(d => d.status === "Rejected").length,
        cancelled: baseDataForStats.filter(d => d.status === "Cancelled").length,
    };

    // NEW: Updated HandlePreview Function
    const handlePreview = () => {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        // PDF Content Construction
        doc.setFontSize(20);
        doc.setTextColor(0, 82, 204);
        doc.text("Request History Report", 14, 20);

        doc.setFontSize(9);
        doc.setTextColor(100);
        doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 27);

        doc.setDrawColor(230);
        doc.line(14, 32, pageWidth - 14, 32);

        doc.setFontSize(10);
        doc.setTextColor(15, 23, 42);
        doc.setFont(undefined, 'bold');
        doc.text("Active Filters:", 14, 40);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(71, 85, 105);
        doc.text(`Spot: ${filterSpot}  |  Status: ${filterStatus}  |  Range: ${startDate || 'Any'} to ${endDate || 'Any'}`, 14, 46);

        // Stats Box in PDF
        doc.setFillColor(248, 250, 252);
        doc.roundedRect(14, 52, pageWidth - 28, 15, 3, 3, 'F');
        doc.setFontSize(10);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(15, 23, 42);
        doc.text(`Total: ${stats.total}`, 20, 62);

        let nextX = 55;
        if (filterStatus === "All" || filterStatus === "Approved") {
            doc.setTextColor(22, 101, 52);
            doc.text(`Approved: ${stats.approved}`, nextX, 62);
            nextX += 45;
        }
        if (filterStatus === "All" || filterStatus === "Rejected") {
            doc.setTextColor(185, 28, 28);
            doc.text(`Rejected: ${stats.rejected}`, nextX, 62);
            nextX += 45;
        }
        if (filterStatus === "All" || filterStatus === "Cancelled") {
            doc.setTextColor(194, 65, 12);
            doc.text(`Cancelled: ${stats.cancelled}`, nextX, 62);
        }

        const tableColumn = ["ID", "Title", "Organizer", "Spot Name", "Date", "Status"];
        const tableRows = filteredData.map(item => [
            item.id, item.title, item.organizer, item.spotName,
            item.date || `${item.startDate} - ${item.endDate}`, item.status
        ]);

        // New, safer way
        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 75,
            theme: 'grid',
            headStyles: { fillColor: [0, 82, 204], fontSize: 9, fontStyle: 'bold' },
            bodyStyles: { fontSize: 8 },
        });

        const blobUrl = doc.output('bloburl');
        setPdfPreviewUrl(blobUrl);
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header and Download Button */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Booking History</h2>
                    <p className="text-gray-500">View and export past records for physical education fields.</p>
                </div>
                {/* Button updated to trigger handlePreview */}
                <button
                    onClick={handlePreview}
                    className="flex items-center justify-center gap-2 bg-[#0052cc] text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg active:scale-95"
                >
                    <Download size={18} /> Export History
                </button>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-6 rounded-[28px] border border-gray-100 shadow-sm space-y-6">
                <div className="flex flex-wrap items-center gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Select Field</label>
                        <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
                            {["All Spots", "Central Field", "Handball Ground", "Basketball Ground"].map((spot) => (
                                <button
                                    key={spot}
                                    onClick={() => setFilterSpot(spot)}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filterSpot === spot ? "bg-white text-[#0052cc] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                                >
                                    {spot}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1">Status</label>
                        <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
                            {["All", "Approved", "Rejected", "Cancelled"].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setFilterStatus(status)}
                                    className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${filterStatus === status ? "bg-white text-[#0052cc] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2 ml-auto">
                        <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-1 text-right block">Date Range</label>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100">
                                <CalendarIcon size={16} className="text-gray-400" />
                                <input type="date" className="bg-transparent text-sm font-bold outline-none text-gray-700" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                            </div>
                            <span className="text-gray-400 font-bold">to</span>
                            <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100">
                                <CalendarIcon size={16} className="text-gray-400" />
                                <input type="date" className="bg-transparent text-sm font-bold outline-none text-gray-700" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Summary Counts (Stats) */}
            <div className="flex flex-wrap gap-3 mb-6">
                <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Total:</span>
                    <span className="text-sm font-black text-slate-800">{stats.total}</span>
                </div>
                {(filterStatus === "All" || filterStatus === "Approved") && (
                    <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-xl border border-green-100">
                        <span className="text-[10px] font-black uppercase tracking-wider text-green-600">Approved:</span>
                        <span className="text-sm font-black text-green-700">{stats.approved}</span>
                    </div>
                )}
                {(filterStatus === "All" || filterStatus === "Rejected") && (
                    <div className="flex items-center gap-2 bg-red-50 px-4 py-2 rounded-xl border border-red-100">
                        <span className="text-[10px] font-black uppercase tracking-wider text-red-600">Rejected:</span>
                        <span className="text-sm font-black text-red-700">{stats.rejected}</span>
                    </div>
                )}
                {(filterStatus === "All" || filterStatus === "Cancelled") && (
                    <div className="flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-xl border border-orange-100">
                        <span className="text-[10px] font-black uppercase tracking-wider text-orange-600">Cancelled:</span>
                        <span className="text-sm font-black text-orange-700">{stats.cancelled}</span>
                    </div>
                )}
                {(startDate || endDate || filterSpot !== "All Spots" || filterStatus !== "All") && (
                    <button onClick={() => { setStartDate(""); setEndDate(""); setFilterSpot("All Spots"); setFilterStatus("All"); }} className="ml-auto text-xs font-bold text-red-500 hover:bg-red-50 px-4 py-2 rounded-xl transition-all border border-transparent hover:border-red-100">Reset All Filters</button>
                )}
            </div>

            {/* Data Table */}
            <div className="bg-white rounded-[32px] border border-gray-100 overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100">
                            <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">ID & Title</th>
                            <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Organizer</th>
                            <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Field/Spot</th>
                            <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                            <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {loadingHistory ? (
                            <tr><td colSpan="5" className="px-6 py-10 text-center text-gray-400 text-xs font-medium">Loading bookings...</td></tr>
                        ) : filteredData.length > 0 ? (
                            filteredData.map((item) => (
                                <tr key={item.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-6 py-2">
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-bold text-[#0052cc] leading-none mb-1">{item.id}</span>
                                            <span className="font-bold text-slate-700 text-sm leading-tight">{item.title}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-2 text-xs font-medium text-gray-600">{item.organizer}</td>
                                    <td className="px-6 py-2 text-xs font-bold text-[#0052cc]"><span className="bg-blue-50/50 px-2 py-0.5 rounded-md">{item.spotName}</span></td>
                                    <td className="px-6 py-2 text-xs font-bold text-slate-500">{item.date || `${item.startDate} - ${item.endDate}`}</td>
                                    <td className="px-6 py-2 text-center">
                                        <div className="scale-90 origin-center"><StatusBadge status={item.status} /></div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="5" className="px-6 py-10 text-center text-gray-400 text-xs font-medium">No records found...</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* PDF PREVIEW MODAL */}
            {pdfPreviewUrl && (
                <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-5xl h-[95vh] rounded-[32px] overflow-hidden shadow-2xl flex flex-col">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
                            <div>
                                <h2 className="text-xl font-bold text-slate-800">History Report Preview</h2>
                                <p className="text-xs text-gray-500 font-medium">Verify summary and filters before downloading</p>
                            </div>
                            <button onClick={() => setPdfPreviewUrl(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={20} className="text-gray-400" /></button>
                        </div>
                        <div className="flex-1 bg-slate-100 p-6 flex justify-center">
                            <iframe src={pdfPreviewUrl} className="w-full h-full rounded-xl border border-gray-200 shadow-2xl bg-white" title="PDF Preview" />
                        </div>
                        <div className="p-6 border-t border-gray-100 flex gap-4 justify-end bg-white">
                            <button onClick={() => setPdfPreviewUrl(null)} className="px-8 py-3 rounded-2xl text-sm font-bold text-gray-500 hover:bg-gray-50 transition-all">Cancel</button>
                            <a href={pdfPreviewUrl} download={`History_Report_${new Date().toISOString().split('T')[0]}.pdf`} onClick={() => setPdfPreviewUrl(null)} className="flex items-center gap-2 bg-[#0052cc] text-white px-10 py-3 rounded-2xl text-sm font-bold hover:bg-blue-700 shadow-lg transition-all active:scale-95">
                                <Download size={18} /> Download Document
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


/* ================= হেল্পার সাব-কম্পোনেন্টস ================= */

const StatBox = ({ label, count, color }) => (
    <div className={`${color} p-5 rounded-[24px] border border-current/10 flex flex-col items-center justify-center`}>
        <span className="text-[10px] font-black uppercase tracking-widest opacity-70 mb-1">{label}</span>
        <span className="text-3xl font-black">{count}</span>
    </div>
)

const StatusBadge = ({ status }) => {
    const styles = {
        Approved: "bg-green-100 text-green-700 border-green-200",
        Rejected: "bg-red-100 text-red-700 border-red-200",
        Cancelled: "bg-orange-100 text-orange-700 border-orange-200",
        Pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
    }
    return (
        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase border tracking-widest ${styles[status] || 'bg-gray-100 text-gray-500 border-gray-200'}`}>
            {status}
        </span>
    )
}


import { CheckCircle, Trash2, MessageSquare, Globe } from 'lucide-react';
import music from "../assets/consert.png";

const BlogModeration = () => {
    const [selectedBlog, setSelectedBlog] = useState(null);
    const [activeTab, setActiveTab] = useState('blogs');
    const [blogStatus, setBlogStatus] = useState('pending');

    // ── Real data from DB ─────────────────────────────────────
    const [pendingBlogs, setPendingBlogs] = useState([]);
    const [publishedBlogs, setPublishedBlogs] = useState([]);
    const [feedbacks, setFeedbacks] = useState([]);
    const [loadingBlogs, setLoadingBlogs] = useState(true);
    const [loadingFeedbacks, setLoadingFeedbacks] = useState(true);

    const fetchBlogs = () => {
        const api = adminApi();
        setLoadingBlogs(true);
        Promise.all([
            api.get("/blogs?status=pending"),
            api.get("/blogs?status=published")
        ]).then(([pendingRes, publishedRes]) => {
            setPendingBlogs((pendingRes.data || []).map(b => ({
                id: b.blog_id,
                title: b.blog_title,
                author: b.author || "Unknown",
                date: b.submitted_at ? new Date(b.submitted_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : "",
                image: b.cover_image ? `http://localhost:5000/uploads/${b.cover_image}` : music,
                spot: b.spot_name || "",
                eventdate: b.event_date ? b.event_date.split('T')[0] : "",
                content: b.story_details || b.summary || ""
            })));
            setPublishedBlogs((publishedRes.data || []).map(b => ({
                id: b.blog_id,
                title: b.blog_title,
                author: b.author || "Unknown",
                date: b.submitted_at ? new Date(b.submitted_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : "",
                image: b.cover_image ? `http://localhost:5000/uploads/${b.cover_image}` : music,
                spot: b.spot_name || "",
                eventdate: b.event_date ? b.event_date.split('T')[0] : "",
                content: b.story_details || b.summary || ""
            })));
        }).catch(() => { }).finally(() => setLoadingBlogs(false));
    };

    const fetchFeedbacks = () => {
        const api = adminApi();
        setLoadingFeedbacks(true);
        api.get("/feedbacks").then(res => {
            setFeedbacks((res.data || []).map(fb => ({
                id: fb.event_id,
                user: fb.user_name || "Anonymous",
                message: fb.feedback || "",
                date: fb.event_date ? fb.event_date.split('T')[0] : "",
                spot: fb.spot_name || "",
                eventdate: fb.event_date ? fb.event_date.split('T')[0] : "",
                title: fb.event_title || ""
            })));
        }).catch(() => { }).finally(() => setLoadingFeedbacks(false));
    };

    useEffect(() => { fetchBlogs(); fetchFeedbacks(); }, []);

    const handlePublish = async (blogId) => {
        try {
            await adminApi().post(`/blogs/${blogId}/publish`);
            fetchBlogs();
            setSelectedBlog(null);
        } catch { alert("Failed to publish blog."); }
    };

    const handleRejectBlog = async (blogId) => {
        try {
            await adminApi().post(`/blogs/${blogId}/reject`);
            fetchBlogs();
        } catch { alert("Failed to reject blog."); }
    };

    const handleDeleteBlog = async (blogId) => {
        if (!window.confirm("Delete this blog permanently?")) return;
        try {
            await adminApi().delete(`/blogs/${blogId}`);
            fetchBlogs();
        } catch { alert("Failed to delete blog."); }
    };

    return (
        <div className="p-8 bg-white rounded-[40px] border border-slate-100 shadow-sm min-h-[600px] font-sans">

            {/* Main Navigation (Blogs vs Feedbacks) */}
            <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-sky-600 rounded-2xl text-white shadow-lg shadow-sky-100">
                        <Globe size={24} />
                    </div>
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">Blogs Moderation and Feedbacks</h2>
                </div>

                <div className="flex bg-slate-100 p-1.5 rounded-2xl">
                    <button
                        onClick={() => setActiveTab('blogs')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'blogs' ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-500'}`}
                    >
                        <FileText size={18} /> Blogs
                    </button>
                    <button
                        onClick={() => setActiveTab('feedbacks')}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${activeTab === 'feedbacks' ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-500'}`}
                    >
                        <MessageSquare size={18} /> Feedbacks
                    </button>
                </div>
            </div>

            {/* Sub-Tabs for Blogs (Only visible when 'blogs' tab is active) */}
            {activeTab === 'blogs' && (
                <div className="flex gap-4 mb-8">
                    <button
                        onClick={() => setBlogStatus('pending')}
                        className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${blogStatus === 'pending' ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        Pending Requests
                    </button>
                    <button
                        onClick={() => setBlogStatus('published')}
                        className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${blogStatus === 'published' ? 'bg-green-100 text-green-700 border border-green-200' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        Published Blogs
                    </button>
                </div>
            )}

            {/* CONTENT AREA */}
            {loadingBlogs && activeTab === 'blogs' && <div className="text-center py-12 text-gray-400 font-bold">Loading blogs...</div>}
            {loadingFeedbacks && activeTab === 'feedbacks' && <div className="text-center py-12 text-gray-400 font-bold">Loading feedbacks...</div>}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* 1. BLOG CARDS (Pending & Published) */}
                {activeTab === 'blogs' && !loadingBlogs && (blogStatus === 'pending' ? pendingBlogs : publishedBlogs).length === 0 && (
                    <div className="col-span-3 text-center py-16 text-gray-400 font-medium">No {blogStatus} blogs found.</div>
                )}
                {activeTab === 'blogs' && !loadingBlogs && (blogStatus === 'pending' ? pendingBlogs : publishedBlogs).map(blog => (
                    <div key={blog.id} className="group bg-white border border-slate-100 rounded-[32px] overflow-hidden hover:shadow-xl hover:shadow-slate-100 transition-all duration-300">
                        <div className="relative h-48 overflow-hidden">
                            <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-bold text-slate-800 shadow-sm">
                                {blog.date}
                            </div>
                        </div>

                        <div className="p-6">
                            <h3 className="font-black text-slate-800 text-lg mb-1 leading-tight line-clamp-2">{blog.title}</h3>
                            <br />
                            <div className="text-xs text-slate-400 mb-6 flex flex-col gap-2">
                                <div className="flex items-center gap-1">
                                    <span>Author:</span>
                                    <span className="text-sky-600 font-bold">{blog.author}</span>
                                </div>

                                <div className="flex items-center gap-1">
                                    <span>Held at:</span>
                                    <span className="text-sky-600 font-bold">{blog.spot}</span>
                                </div>

                                <div className="flex items-center gap-1">
                                    <span>On Date:</span>
                                    <span className="text-sky-600 font-bold">{blog.eventdate}</span>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-50">
                                {blogStatus === 'pending' ? (
                                    <>
                                        <button onClick={() => setSelectedBlog(blog)} className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-bold hover:bg-blue-500 hover:text-white transition-all">
                                            <Eye size={14} /> DETAILS
                                        </button>
                                        <button onClick={() => handlePublish(blog.id)} className="flex items-center gap-1.5 px-3 py-2 bg-green-50 text-green-600 rounded-xl text-[10px] font-bold hover:bg-green-500 hover:text-white transition-all">
                                            <CheckCircle size={14} /> PUBLISH
                                        </button>
                                        <button onClick={() => handleRejectBlog(blog.id)} className="flex items-center gap-1.5 px-3 py-2 bg-red-50 text-red-600 rounded-xl text-[10px] font-bold hover:bg-red-500 hover:text-white transition-all">
                                            <XCircle size={14} /> REJECT
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => setSelectedBlog(blog)} className="flex items-center gap-1.5 px-3 py-2 bg-gray-200 text-slate-600 rounded-xl text-[10px] font-bold hover:bg-blue-500 hover:text-white transition-all">
                                            <Eye size={14} /> VIEW BLOG
                                        </button>
                                        <button onClick={() => handleDeleteBlog(blog.id)} className="flex items-center gap-1.5 px-3 py-2 bg-red-50 text-red-600 rounded-xl text-[10px] font-bold hover:bg-red-500 hover:text-white transition-all">
                                            <Trash2 size={14} /> DELETE
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                ))}

                {/* 2. FEEDBACK CARDS (Only visible when 'feedbacks' tab is active) */}
                {activeTab === 'feedbacks' && feedbacks.map(fb => (
                    <div key={fb.id} className="p-6 bg-slate-50 border border-slate-100 rounded-[32px] hover:bg-white hover:shadow-lg transition-all border-l-4 border-l-sky-500">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center text-sky-600 font-bold text-sm">
                                {fb.user.charAt(0)}
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800 text-sm">{fb.user}</h4>
                                <p className="text-[10px] text-slate-400 font-medium">{fb.date}</p>
                            </div>
                        </div>
                        <div className="text-xs text-slate-400 mb-6 flex flex-col gap-2">
                            <div className="flex items-center gap-1">
                                <span>Event :</span>
                                <span className="text-sky-600 font-bold">{fb.title}</span>
                            </div>

                            <div className="flex items-center gap-1">
                                <span>Held at:</span>
                                <span className="text-sky-600 font-bold">{fb.spot}</span>
                            </div>

                            <div className="flex items-center gap-1">
                                <span>On Date:</span>
                                <span className="text-sky-600 font-bold">{fb.eventdate}</span>
                            </div>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed italic">"{fb.message}"</p>
                    </div>
                ))}
            </div>

            {/* 3. BLOG DETAILS MODAL */}
            {selectedBlog && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedBlog(null)}></div>
                    <div className="relative bg-white w-full max-w-2xl rounded-[40px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
                        <div className="h-64 relative">
                            <img src={selectedBlog.image} alt="" className="w-full h-full object-cover" />
                            <button onClick={() => setSelectedBlog(null)} className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-md transition-all">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-8">
                            <h3 className="text-2xl font-black text-slate-800 mb-2">{selectedBlog.title}</h3>
                            <p className="text-sm text-sky-600 font-bold mb-6 italic">By {selectedBlog.author} • Submitted on {selectedBlog.date}</p>

                            <div className="bg-slate-50 p-6 rounded-3xl mb-8 max-h-48 overflow-y-auto">
                                <p className="text-slate-600 leading-relaxed text-sm whitespace-pre-line">{selectedBlog.content}</p>
                            </div>


                            <div className="flex gap-4">
                                {selectedBlog && !publishedBlogs.find(b => b.id === selectedBlog.id) && (
                                    <button onClick={() => handlePublish(selectedBlog.id)} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-green-100 flex items-center justify-center gap-2">
                                        <CheckCircle size={18} /> Publish Blog
                                    </button>
                                )}
                                <button onClick={() => setSelectedBlog(null)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 py-4 rounded-2xl font-bold transition-all">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

