"use client"

import { useState, useRef, useEffect } from "react"
import {
  LayoutDashboard, MapPin, ClipboardCheck, History, FileText, Settings,
  Calendar, Clock, CheckCircle2, Users, ArrowRight, Camera, ImagePlus, X, Check, Info, AlertCircle, Eye
} from "lucide-react"

import {
  Search,
  Filter,
  Download,
  Calendar as CalendarIcon,
  ChevronDown,
  XCircle
} from "lucide-react"

// import { Camera, ImagePlus, X } from "lucide-react";
import Header from "../components/Header/Header" // adjust path if needed

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("overview")

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* TOP HEADER */}
      <Header />

      {/* BODY */}
      <div className="flex">
        {/* SIDEBAR */}
        {/* ================= SIDEBAR ================= */}
        <aside className="w-64 bg-white border-r flex flex-col sticky top-[70px] h-[calc(100vh-70px)]">
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

          <div className="p-4 border-t border-gray-100">
            <button className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:text-blue-600 transition text-sm font-medium">
              <Settings size={20} /> Settings
            </button>
          </div>
        </aside>
        {/* MAIN */}
        {/* ================= MAIN AREA ================= */}
        <main className="flex-1 p-10">
          <header className="mb-8">

          </header>

          {/* CONTENT */}
          {activeSection === "overview" && <DashboardOverview />}
          {activeSection === "spots" && <SpotManagement />}
          {activeSection === "approvals" && <BookingApprovals />}
          {activeSection === "history" && <BookingHistory />}
        </main>
      </div>
    </div>
  )
}




/* ================= COMPONENTS ================= */

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

const DashboardOverview = () => {
  const [stats, setStats] = useState({
    total: 8,
    approved: 0,
    pending: 0,
    rejected: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/admin/dashboard", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        });
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchStats();
  }, []);
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#0f172a]">Admin Overview</h1>
        <p className="text-gray-500 mt-1">Manage your spots, bookings, and community content.</p>
      </div>
      {/* 1. Unified Summary Card */}
      <div className="bg-[#eef6ff] border border-blue-100 rounded-3xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4 text-[#0052cc]">
          <Calendar size={20} />
          <h3 className="font-bold text-lg">Requests (Last 30 Days)</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/60 p-4 rounded-2xl">
            <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Total</p>
            <p className="text-2xl font-black text-slate-800">{stats.total}</p>
          </div>
          <div className="bg-white/60 p-4 rounded-2xl">
            <p className="text-xs text-emerald-600 uppercase font-bold tracking-wider">Approved</p>
            <p className="text-2xl font-black text-emerald-700">{stats.approved}</p>
          </div>
          <div className="bg-white/60 p-4 rounded-2xl">
            <p className="text-xs text-orange-600 uppercase font-bold tracking-wider">Pending</p>
            <p className="text-2xl font-black text-orange-700">{stats.pending}</p>
          </div>
          <div className="bg-white/60 p-4 rounded-2xl">
            <p className="text-xs text-red-600 uppercase font-bold tracking-wider">Rejected</p>
            <p className="text-2xl font-black text-red-700">{stats.rejected}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8">
        {/* Recent Activity (Existing) */}
        <div className="col-span-2 bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-[#0f172a]">Recent Activity</h3>
            <p className="text-sm text-gray-400">Live updates from your spots.</p>
          </div>
          <div className="space-y-2">
            <ActivityRow name="John Doe" action="requested Central Auditorium" event="Tech Fest 2026" date="24th May, 2026" />
            <ActivityRow name="John Doe" action="requested Central Auditorium" event="Tech Fest 2026" date="24th May, 2026" />
            <ActivityRow name="John Doe" action="requested Central Auditorium" event="Tech Fest 2026" date="24th May, 2026" />
          </div>
        </div>

        <div className="space-y-8">
          {/* 2. Upcoming Approved Events Card */}
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
            <h3 className="text-lg font-bold text-[#0f172a] mb-4">Upcoming Events</h3>
            <div className="space-y-4">
              <EventItem title="Annual Meet" date="15 Feb 2026" />
              <EventItem title="Coding Hackathon" date="10–12 Feb 2026" />
            </div>
          </div>

          {/* Quick Actions (Existing) */}
          <div className="bg-[#eef6ff] rounded-3xl p-6">
            <h3 className="text-lg font-bold text-[#0052cc] mb-6">Quick Actions</h3>
            <div className="space-y-3">
              <ActionButton label="Update Spot Availability" />
              <ActionButton label="Review Blog Submissions" />
              <ActionButton label="Export Monthly History" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

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

import mainImage_display from "../assets/central_auditorium.png";

// const SpotManagement = () => {

//   // // ১. ইমেজ স্টোর করার জন্য স্টেট
//   // const [mainImage, setMainImage] = useState(mainImage_display);
//   // const [galleryImages, setGalleryImages] = useState([
//   //   "https://images.unsplash.com/photo-1514525253361-bee8a48790c3",
//   //   "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4"
//   // ]);

//   const [mainImage, setMainImage] = useState(null);
//   const [galleryImages, setGalleryImages] = useState([]);

//   const [mainPreview, setMainPreview] = useState(null);
//   const [galleryPreview, setGalleryPreview] = useState([]);

//   // ২. রিফ তৈরি (Input ফিল্ড ট্রিগার করার জন্য)
//   const mainInputRef = useRef(null);
//   const galleryInputRef = useRef(null);

//   // ৩. মেইন ইমেজ পরিবর্তন
//   const handleMainImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setMainImage(file);
//       setMainPreview(URL.createObjectURL(file));
//     }
//   };

//   // ৪. গ্যালারিতে নতুন ইমেজ যোগ
//   const handleAddGalleryImages = (e) => {
//     const files = Array.from(e.target.files);

//     setGalleryImages(prev => [...prev, ...files]);

//     const previews = files.map(file => URL.createObjectURL(file));
//     setGalleryPreview(prev => [...prev, ...previews]);
//   };

//   // ৫. ইমেজ রিমুভ
//   const removeGalleryImage = (index) => {
//     setGalleryImages(prev => prev.filter((_, i) => i !== index));
//     setGalleryPreview(prev => prev.filter((_, i) => i !== index));
//   };

//   return (
//     <div className="max-w-5xl space-y-8 animate-in fade-in duration-500">
//       {/* Hidden File Inputs */}
//       <input type="file" ref={mainInputRef} className="hidden" accept="image/*" onChange={handleMainImageChange} />
//       <input type="file" ref={galleryInputRef} className="hidden" accept="image/*" multiple onChange={handleAddGalleryImages} />

//       <div>
//         <h1 className="text-3xl font-bold text-[#0f172a]">Spot Management</h1>
//         <p className="text-gray-500 mt-1">Manage visuals and details for Central Auditorium.</p>
//       </div>

//       {/* মেইন ব্যানার */}
//       <div className="relative h-[350px] w-full rounded-[32px] overflow-hidden shadow-sm group">
//         <img src={mainImage} alt="Main Banner" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
//         <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-all flex items-end justify-end p-8">
//           <button
//             onClick={() => mainInputRef.current.click()} // এটি এখন আপনার গ্যালারি ওপেন করবে
//             className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-5 py-2.5 rounded-2xl text-sm font-bold text-gray-800 hover:bg-white shadow-xl transition-all"
//           >
//             <Camera size={18} className="text-[#0052cc]" /> Change Main Image
//           </button>
//         </div>
//       </div>

//       <div className="bg-white rounded-[32px] border border-gray-100 p-10 shadow-sm space-y-8">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//           <InputField label="Spot Name" defaultValue="Central Auditorium" />
//           <InputField label="Location" defaultValue="Main Building, 2nd Floor" />
//           <InputField label="Capacity" defaultValue="500" type="number" />
//           <InputField label="Max Booking Range (Days)" defaultValue="7" type="number" />

//           <div className="col-span-1 md:col-span-2">
//             <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
//             <textarea className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-100 outline-none h-24 transition-all resize-none" defaultValue="A state-of-the-art auditorium suitable for seminars and cultural events." />
//           </div>

//           <div className="col-span-1 md:col-span-2">
//             <label className="block text-sm font-bold text-gray-700 mb-2">Instructions & Rules</label>
//             <textarea className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-100 outline-none h-24 transition-all resize-none" defaultValue="1. No food allowed. 2. Sound system operated by staff only." />
//           </div>
//         </div>

//         {/* এডিশনাল গ্যালারি */}
//         <div className="space-y-4">
//           <div className="flex justify-between items-center">
//             <label className="block text-sm font-bold text-gray-700">Extra Gallery Images</label>
//             <button onClick={() => galleryInputRef.current.click()} className="text-[#0052cc] text-xs font-bold hover:underline">Add Images</button>
//           </div>

//           <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
//             {galleryImages.map((img, index) => (
//               <div key={index} className="relative aspect-[4/3] rounded-2xl overflow-hidden group border">
//                 <img src={img} className="w-full h-full object-cover" />
//                 <button
//                   onClick={() => removeGalleryImage(index)} // এটি এখন ইমেজ রিমুভ করবে
//                   className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-100 md:opacity-0 group-hover:opacity-100 transition-all shadow-lg"
//                 >
//                   <X size={14} />
//                 </button>
//               </div>
//             ))}
//             <div onClick={() => galleryInputRef.current.click()} className="aspect-[4/3] bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-blue-50 hover:border-blue-200 transition-all group">
//               <ImagePlus size={28} className="mb-1 group-hover:text-[#0052cc]" />
//               <span className="text-xs font-bold group-hover:text-[#0052cc]">Add New</span>
//             </div>
//           </div>
//         </div>

//         <div className="pt-8 border-t border-gray-50 flex justify-end gap-4">
//           <button className="px-8 py-3 rounded-2xl font-bold text-gray-500 hover:bg-gray-100">Discard</button>
//           <button onClick={() => alert("Changes saved temporarily in UI!")} className="bg-[#0052cc] text-white px-10 py-3 rounded-2xl font-bold hover:shadow-lg active:scale-95 transition-all">
//             Save Changes
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }

// // হেল্পার ইনপুট কম্পোনেন্ট
// const InputField = ({ label, type = "text", placeholder, defaultValue }) => (
//   <div className="space-y-2">
//     <label className="block text-sm font-bold text-gray-700">{label}</label>
//     <input
//       type={type}
//       defaultValue={defaultValue}
//       placeholder={placeholder}
//       className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-100 outline-none transition-all"
//     />
//   </div>
// );
const API = "http://localhost:5000/api/admin";

const SpotManagement = () => {
  const [spots, setSpots] = useState([]);
  const [activeSpot, setActiveSpot] = useState(null);

  const [form, setForm] = useState({
    name: "",
    location: "",
    description: "",
    spot_rules: ""
  });

  const [mainImage, setMainImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);

  const mainInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  /* ================= LOAD SPOTS ================= */
  useEffect(() => {
    fetchSpots();
  }, []);

  const fetchSpots = async () => {
    try {
      const res = await fetch(`${API}/spots`);
      const data = await res.json();

      setSpots(data);

      // 🔥 don't override manually selected spot
      if (!activeSpot && data.length) {
        setActiveSpot(data[0]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= SET FORM WHEN SPOT SELECTED ================= */
  useEffect(() => {
    if (!activeSpot) return;

    setForm({
      name: activeSpot.name || "",
      location: activeSpot.location || "",
      description: activeSpot.description || "",
      spot_rules: activeSpot.spot_rules || ""
    });

    // 🔥 IMPORTANT: assume backend gives full URL
    setMainImage(activeSpot.image1 || null);

    setGalleryImages(
      [activeSpot.image2, activeSpot.image3].filter(Boolean)
    );
  }, [activeSpot]);

  /* ================= ADD NEW SPOT ================= */
  const handleAddSpot = () => {
    const tempSpot = {
      spot_id: "new",
      name: "New Spot"
    };

    // 🔥 insert at beginning (slide effect)
    setSpots(prev => [tempSpot, ...prev]);

    setActiveSpot(tempSpot);

    setForm({
      name: "",
      location: "",
      description: "",
      spot_rules: ""
    });

    setMainImage(null);
    setGalleryImages([]);
  };

  /* ================= IMAGE HANDLING ================= */
  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setMainImage(file);
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    setGalleryImages(prev => [...prev, ...files]);
  };

  const removeGalleryImage = (index) => {
    setGalleryImages(prev => prev.filter((_, i) => i !== index));
  };

  /* ================= SAVE ================= */
  const handleSave = async () => {
    try {
      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("location", form.location);
      formData.append("description", form.description);
      formData.append("spot_rules", form.spot_rules);

      // 🔥 send only new files
      if (mainImage instanceof File) {
        formData.append("image1", mainImage);
      }

      galleryImages.forEach((img, index) => {
        if (img instanceof File) {
          formData.append(`image${index + 2}`, img);
        }
      });

      let url = `${API}/spots`;
      let method = "POST";

      if (activeSpot && activeSpot.spot_id !== "new") {
        url = `${API}/spots/${activeSpot.spot_id}`;
        method = "PUT";
      }

      const res = await fetch(url, {
        method,
        body: formData
      });

      if (!res.ok) throw new Error("Save failed");

      alert("Saved successfully ✅");

      setActiveSpot(null); // reset selection
      await fetchSpots();

    } catch (err) {
      console.error(err);
      alert("Error saving spot ❌");
    }
  };

  return (
    <div className="space-y-6">

      {/* ================= TABS ================= */}
      <div className="flex gap-3 flex-wrap items-center">
        {spots.map((spot) => (
          <button
            key={spot.spot_id}
            onClick={() => setActiveSpot(spot)}
            className={`px-4 py-2 rounded-xl border ${activeSpot?.spot_id === spot.spot_id
                ? "bg-blue-600 text-white"
                : "bg-gray-100"
              }`}
          >
            {spot.name}
          </button>
        ))}

        {/* ADD BUTTON */}
        <button
          onClick={handleAddSpot}
          className="px-4 py-2 rounded-xl bg-green-600 text-white"
        >
          + Add New Spot
        </button>
      </div>

      {/* ================= MAIN IMAGE ================= */}
      <div className="relative h-[300px] bg-gray-200 rounded-2xl overflow-hidden">
        {mainImage && (
          <img
            src={
              typeof mainImage === "string"
                ? mainImage
                : URL.createObjectURL(mainImage)
            }
            className="w-full h-full object-cover"
          />
        )}

        <button
          onClick={() => mainInputRef.current.click()}
          className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-xl"
        >
          Change Image
        </button>

        <input
          type="file"
          hidden
          ref={mainInputRef}
          onChange={handleMainImageChange}
        />
      </div>

      {/* ================= FORM ================= */}
      <div className="grid grid-cols-2 gap-4">
        <input
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Spot Name"
          className="p-3 border rounded-xl"
        />

        <input
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          placeholder="Location"
          className="p-3 border rounded-xl"
        />

        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Description"
          className="p-3 border rounded-xl col-span-2"
        />

        <textarea
          value={form.spot_rules}
          onChange={(e) => setForm({ ...form, spot_rules: e.target.value })}
          placeholder="Rules"
          className="p-3 border rounded-xl col-span-2"
        />
      </div>

      {/* ================= GALLERY ================= */}
      <div className="flex gap-3 flex-wrap">
        {galleryImages.map((img, i) => (
          <div key={i} className="relative w-32 h-24">
            <img
              src={
                typeof img === "string"
                  ? img
                  : URL.createObjectURL(img)
              }
              className="w-full h-full object-cover rounded"
            />
            <button
              onClick={() => removeGalleryImage(i)}
              className="absolute top-1 right-1 bg-red-500 text-white px-1"
            >
              X
            </button>
          </div>
        ))}

        <button
          onClick={() => galleryInputRef.current.click()}
          className="w-32 h-24 border flex items-center justify-center"
        >
          +
        </button>

        <input
          type="file"
          hidden
          multiple
          ref={galleryInputRef}
          onChange={handleGalleryChange}
        />
      </div>

      {/* ================= SAVE ================= */}
      <button
        onClick={handleSave}
        className="bg-blue-600 text-white px-6 py-3 rounded-xl"
      >
        Save Changes
      </button>
    </div>
  );
};


/* ================= 2. BOOKING APPROVALS (LOGIC INCLUDED) ================= */

const BookingApprovals = () => {
  const [selectedReq, setSelectedReq] = useState(null)
  const [reason, setReason] = useState("")
  const [isRejectOpen, setIsRejectOpen] = useState(false)

  const pendingData = [
    {
      id: "REQ-001",
      spotName: "Central Auditorium",
      title: "Annual Debate Competition",
      organizer: "Debating Society",
      date: "2026-06-15",
      type: "Single Day",
      session: "Day",
      description: "Inter-university debate championship.",
      recommender: { name: "Dr. Abu Sayed", post: "Head of Physics Department" } // নতুন তথ্য
    },
    {
      id: "REQ-002",
      spotName: "Main Sports Field",
      title: "Sust Inter-Dept Football",
      organizer: "Physical Dept",
      startDate: "2026-06-20",
      endDate: "2026-06-22",
      type: "Date Range",
      session: "Full Day",
      description: "Semi-finals and finals.",
      recommender: { name: "Someone", post: "Head of Physics Department" } // নতুন তথ্য
    }
  ]

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <h2 className="text-3xl font-bold text-slate-800">Booking Approvals</h2>
      <div className="grid gap-4">
        {pendingData.map((req) => (
          <div key={req.id} className="bg-white border border-gray-100 rounded-[24px] p-6 shadow-sm flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="space-y-2 flex-1">
              <div className="flex gap-3 items-center">
                <span className="bg-blue-50 text-[#0052cc] px-3 py-1 rounded-full text-[10px] font-black">{req.id}</span>
                <span className="text-xs text-gray-400 flex items-center gap-1"><Clock size={12} /> 4h ago</span>
              </div>
              <h3 className="text-xl font-bold text-slate-800">{req.title}</h3>
              <div className="flex gap-4 text-sm text-gray-500 font-medium">
                <span className="flex items-center gap-1"><MapPin size={14} className="text-blue-500" /> {req.spotName}</span>
                <span className="flex items-center gap-1"><Calendar size={14} className="text-blue-500" /> {req.date || `${req.startDate} to ${req.endDate}`}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setSelectedReq(req)} className="bg-gray-100 text-gray-700 px-5 py-2.5 rounded-2xl text-sm font-bold hover:bg-gray-200 flex items-center gap-2"><Eye size={16} /> Details</button>
              <button onClick={() => { setSelectedReq(req); setIsRejectOpen(true); }} className="bg-red-50 text-red-600 px-5 py-2.5 rounded-2xl text-sm font-bold hover:bg-red-600 hover:text-white border border-red-100 transition-all flex items-center gap-2"><X size={16} /> Reject</button>
              <button onClick={() => alert("Approved")} className="bg-[#0052cc] text-white px-6 py-2.5 rounded-2xl text-sm font-bold hover:bg-blue-700 shadow-lg flex items-center gap-2"><Check size={16} /> Approve</button>
            </div>
          </div>
        ))}
      </div>

      {/* DETAIL MODAL */}
      {selectedReq && !isRejectOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedReq(null)}></div>
          <div className="relative bg-white w-full max-w-2xl rounded-[32px] p-8 shadow-2xl animate-in zoom-in-95 duration-200 space-y-6">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">Booking Details</h3>
              <span className="bg-blue-50 text-[#0052cc] px-4 py-1 rounded-full text-xs font-bold border border-blue-100 uppercase tracking-widest">{selectedReq.id}</span>
            </div>

            {/* বেসিক ইনফো গ্রিড */}
            <div className="grid grid-cols-2 gap-6">
              <DetailItem label="Organizer" value={selectedReq.organizer} />
              <DetailItem label="Spot" value={selectedReq.spotName} />
              <DetailItem label="Date(s)" value={selectedReq.date || `${selectedReq.startDate} to ${selectedReq.endDate}`} />
              <DetailItem label="Session" value={selectedReq.session} isBadge />
            </div>

            {/* Recommender Info Section - নতুন যোগ করা হয়েছে */}
            <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-100 space-y-2">
              <label className="text-gray-400 block font-bold uppercase text-[10px] tracking-widest">Recommender Info</label>
              <div className="flex flex-col">
                <p className="font-bold text-slate-800 text-lg">{selectedReq.recommender?.name}</p>
                <p className="text-sm text-blue-600 font-medium">{selectedReq.recommender?.post}</p>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-gray-400 block font-bold uppercase text-[10px] tracking-widest">Event Description</label>
              <div className="p-4 bg-slate-50 rounded-2xl italic font-medium text-slate-600 text-sm leading-relaxed">
                "{selectedReq.description}"
              </div>
            </div>

            {/* অ্যাকশন বাটন */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setSelectedReq(null)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3.5 rounded-2xl font-bold transition-all"
              >
                Close Details
              </button>
              <button
                onClick={() => { alert("Approved"); setSelectedReq(null); }}
                className="flex-1 bg-[#0052cc] text-white py-3.5 rounded-2xl font-bold shadow-lg hover:bg-blue-700 transition-all"
              >
                Approve Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REJECT MODAL */}
      {isRejectOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-red-900/10 backdrop-blur-sm"
            onClick={() => { setIsRejectOpen(false); setSelectedReq(null); }} // বাইরের অন্ধকার জায়গায় ক্লিক করলেও যেন ক্লিয়ার হয়
          ></div>
          <div className="relative bg-white w-full max-w-md rounded-[32px] p-8 space-y-4">
            <h3 className="text-xl font-bold text-red-600">Reject Request</h3>
            <textarea
              className="w-full p-4 bg-gray-50 border rounded-2xl h-32 outline-none focus:ring-2 focus:ring-red-100"
              placeholder="Reason for rejection..."
              value={reason}
              onChange={e => setReason(e.target.value)}
            />
            <div className="flex gap-4">
              <button
                onClick={() => {
                  setIsRejectOpen(false);
                  setSelectedReq(null); // এখানে এটি যোগ করা হয়েছে
                  setReason("");
                }}
                className="flex-1 py-3 font-bold text-gray-500"
              >
                Cancel
              </button>
              <button
                disabled={!reason}
                onClick={() => {
                  alert("Rejected");
                  setIsRejectOpen(false);
                  setSelectedReq(null);
                  setReason("");
                }}
                className="flex-1 bg-red-600 text-white py-3 rounded-2xl font-bold shadow-lg disabled:opacity-50"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

{/* হেল্পার সাব-কম্পোনেন্ট (আপনার ফাইলের নিচে বা বাইরে রাখতে পারেন) */ }
function DetailItem({ label, value, isBadge = false }) {
  return (
    <div className="space-y-1">
      <label className="text-gray-400 block font-bold uppercase text-[10px] tracking-widest">{label}</label>
      {isBadge ? (
        <span className="inline-block bg-slate-100 px-3 py-1 rounded-lg text-xs font-bold text-slate-700">{value}</span>
      ) : (
        <p className="font-bold text-slate-700">{value}</p>
      )}
    </div>
  )
}


// ডামি ডেটা
const allHistoryData = [
  { id: "REQ-001", title: "Annual Debate Competition", spotName: "Central Auditorium", organizer: "Debating Society", date: "2026-06-15", type: "Single Day", status: "Approved" },
  { id: "REQ-002", title: "Sust Inter-Dept Football", spotName: "Main Sports Field", organizer: "Physical Dept", startDate: "2026-06-20", endDate: "2026-06-22", type: "Date Range", status: "Rejected" },
  { id: "REQ-003", title: "Freshers Reception 2026", spotName: "Mini Auditorium", organizer: "CSE Society", date: "2026-05-10", type: "Single Day", status: "Cancelled" },
  { id: "REQ-004", title: "IEEE Workshop", spotName: "Central Auditorium", organizer: "IEEE Student Branch", date: "2026-06-05", type: "Single Day", status: "Approved" },
  { id: "REQ-005", title: "Cultural Night", spotName: "Main Building Rooftop", organizer: "Sust Himesh", date: "2026-06-12", type: "Single Day", status: "Approved" },
];

const BookingHistory = () => {
  const [filterStatus, setFilterStatus] = useState("All")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  // ফিল্টারিং লজিক
  const filteredData = allHistoryData.filter((item) => {
    const itemDate = new Date(item.date || item.startDate);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    const matchesStatus = filterStatus === "All" || item.status === filterStatus;
    const matchesDateRange = (!start || itemDate >= start) && (!end || itemDate <= end);

    return matchesStatus && matchesDateRange;
  });

  // স্ট্যাটিস্টিক্স ক্যালকুলেশন
  const stats = {
    total: filteredData.length,
    approved: filteredData.filter(d => d.status === "Approved").length,
    rejected: filteredData.filter(d => d.status === "Rejected").length,
    cancelled: filteredData.filter(d => d.status === "Cancelled").length,
  };

  const handleDownload = () => {
    alert(`Downloading history for ${startDate || 'all time'} to ${endDate || 'now'}...`);
    // এখানে আপনি CSV বা PDF জেনারেট করার লজিক লিখতে পারেন
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* হেডার এবং ডাউনলোড বাটন */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Booking History</h2>
          <p className="text-gray-500">View and export past booking records.</p>
        </div>
        <button
          onClick={handleDownload}
          className="flex items-center justify-center gap-2 bg-[#0052cc] text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg active:scale-95"
        >
          <Download size={18} /> Export History (CSV)
        </button>
      </div>

      {/* ফিল্টার বার */}
      <div className="bg-white p-6 rounded-[28px] border border-gray-100 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* স্ট্যাটাস ফিল্টার */}
          <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
            {["All", "Approved", "Rejected", "Cancelled"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${filterStatus === status
                  ? "bg-white text-[#0052cc] shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* ডেট রেঞ্জ ফিল্টার */}
          <div className="flex items-center gap-3 ml-auto">
            <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100">
              <CalendarIcon size={16} className="text-gray-400" />
              <input
                type="date"
                className="bg-transparent text-sm font-bold outline-none text-gray-700"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <span className="text-gray-400 font-bold">to</span>
            <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-2xl border border-gray-100">
              <CalendarIcon size={16} className="text-gray-400" />
              <input
                type="date"
                className="bg-transparent text-sm font-bold outline-none text-gray-700"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            {(startDate || endDate) && (
              <button
                onClick={() => { setStartDate(""); setEndDate(""); }}
                className="text-xs font-bold text-red-500 hover:underline px-2"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* সামারি কাউন্ট (Stats) - Compact Version */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl border border-slate-200">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Total:</span>
          <span className="text-sm font-black text-slate-800">{stats.total}</span>
        </div>

        <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-xl border border-green-100">
          <span className="text-[10px] font-black uppercase tracking-wider text-green-600">Approved:</span>
          <span className="text-sm font-black text-green-700">{stats.approved}</span>
        </div>

        <div className="flex items-center gap-2 bg-red-50 px-4 py-2 rounded-xl border border-red-100">
          <span className="text-[10px] font-black uppercase tracking-wider text-red-600">Rejected:</span>
          <span className="text-sm font-black text-red-700">{stats.rejected}</span>
        </div>

        <div className="flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-xl border border-orange-100">
          <span className="text-[10px] font-black uppercase tracking-wider text-orange-600">Cancelled:</span>
          <span className="text-sm font-black text-orange-700">{stats.cancelled}</span>
        </div>
      </div>

      {/* ডেটা টেবিল */}
      <div className="bg-white rounded-[32px] border border-gray-100 overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">ID & Title</th>
              <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Organizer</th>
              <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Spot</th>
              <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Date</th>
              <th className="px-6 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-[#0052cc]">{item.id}</span>
                      <span className="font-bold text-slate-700">{item.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-600">{item.organizer}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-600">{item.spotName}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-500">
                    {item.date || `${item.startDate} - ${item.endDate}`}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <StatusBadge status={item.status} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-20 text-center text-gray-400 font-medium">
                  No records found for the selected criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

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
  }
  return (
    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase border tracking-widest ${styles[status]}`}>
      {status}
    </span>
  )
}