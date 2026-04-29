// "use client";

import { useState, useRef, useMemo, useEffect, useCallback } from "react";
import axios from "axios";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Bell } from "lucide-react";
import {
  LayoutDashboard, MapPin, ClipboardCheck, History, FileText,
  Calendar, Clock, Camera, CheckCircle2, User, Mail, Plus, X,
  ImagePlus, Check, Info, Eye, ArrowUpDown, RotateCcw, PenLine,
  Upload, Search, Filter, Download, ChevronDown, XCircle,
  Calendar as CalendarIcon, Globe, MessageSquare, CheckCircle,
  Trash2, Shield, LogOut, AlertTriangle, Loader2, RefreshCw,
  ChevronRight, Layers, Star, Activity, TrendingUp, Users, BarChart2,
} from "lucide-react";

// ── API HELPER ────────────────────────────────────────────────────────────────
const BASE_URL = "http://localhost:5000/api/admin";

const adminApi = () => {
  const token = localStorage.getItem("adminToken");
  return axios.create({
    baseURL: BASE_URL,
    headers: { Authorization: `Bearer ${token}` },
  });
};

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function FieldsAdminDashboard() {
  const [activeSection, setActiveSection] = useState("overview");
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const navItems = [
    { id: "overview", icon: LayoutDashboard, label: "Overview" },
    { id: "spots", icon: MapPin, label: "Spot Management" },
    { id: "approvals", icon: ClipboardCheck, label: "Booking Approvals" },
    { id: "history", icon: History, label: "Booking History" },
    { id: "blogs", icon: FileText, label: "Blog Moderation" },
  ];

  // Fetch notifications on mount + poll every 30s
  const fetchNotifications = useCallback(async () => {
    try {
      const res = await adminApi().get("/notifications");
      const data = res.data || [];
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.is_read).length);
    } catch {
      // silently fail — backend may not have this endpoint yet
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const markAllRead = async () => {
    try {
      await adminApi().put("/notifications/read-all");
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch { }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)", fontFamily: "'Sora', sans-serif" }}>
      {/* ── STYLES ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap');
 
        :root {
          --bg: #f0f4f8;
          --bg2: #ffffff;
          --bg3: #f8fafc;
          --surface: #ffffff;
          --surface2: #f1f5f9;
          --border: rgba(0,0,0,0.07);
          --border2: rgba(0,0,0,0.11);
          --text: #0f172a;
          --text2: #475569;
          --text3: #94a3b8;
          --accent: #0284c7;
          --accent2: #0369a1;
          --accent-glow: rgba(2,132,199,0.15);
          --green: #16a34a;
          --red: #dc2626;
          --orange: #ea580c;
          --yellow: #d97706;
          --purple: #7c3aed;
          --header-bg: #0ea5e9;
        }
 
        * { box-sizing: border-box; }
        body { font-family: 'Sora', sans-serif; }
 
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: #f1f5f9; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 2px; }
 
        .mono { font-family: 'JetBrains Mono', monospace; }
 
        .glass {
          background: var(--surface);
          border: 1px solid var(--border);
        }
 
        .glass2 {
          background: var(--surface2);
          border: 1px solid var(--border2);
        }
 
        .btn-primary {
          background: var(--accent);
          color: white;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-primary:hover { background: var(--accent2); transform: translateY(-1px); box-shadow: 0 6px 20px var(--accent-glow); }
        .btn-primary:active { transform: translateY(0); }
 
        .btn-ghost {
          background: transparent;
          border: 1px solid var(--border2);
          color: var(--text2);
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-ghost:hover { border-color: var(--accent); color: var(--accent); background: rgba(2,132,199,0.05); }
 
        .nav-item {
          display: flex; align-items: center; gap: 12px;
          padding: 10px 14px; border-radius: 10px;
          cursor: pointer; transition: all 0.2s;
          color: var(--text2); font-size: 13px; font-weight: 500;
          border: 1px solid transparent; background: none;
          width: 100%; text-align: left;
        }
        .nav-item:hover { color: var(--accent); background: rgba(2,132,199,0.06); border-color: rgba(2,132,199,0.15); }
        .nav-item.active {
          color: var(--accent); background: rgba(2,132,199,0.1);
          border-color: rgba(2,132,199,0.2);
        }
 
        .stat-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 16px;
          padding: 20px;
          position: relative;
          overflow: hidden;
          transition: all 0.2s;
          box-shadow: 0 1px 4px rgba(0,0,0,0.05);
        }
        .stat-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.08); transform: translateY(-2px); }
 
        .input-field {
          width: 100%; padding: 10px 14px;
          background: var(--bg3); border: 1px solid var(--border2);
          border-radius: 10px; color: var(--text);
          font-family: 'Sora', sans-serif; font-size: 13px;
          outline: none; transition: border-color 0.2s;
        }
        .input-field:focus { border-color: var(--accent); box-shadow: 0 0 0 3px rgba(2,132,199,0.08); }
        .input-field::placeholder { color: var(--text3); }
 
        .badge {
          display: inline-flex; align-items: center;
          padding: 3px 10px; border-radius: 20px;
          font-size: 11px; font-weight: 600;
          font-family: 'JetBrains Mono', monospace;
          letter-spacing: 0.05em;
        }
 
        .modal-overlay {
          position: fixed; inset: 0; z-index: 100;
          background: rgba(15,23,42,0.5); backdrop-filter: blur(6px);
          display: flex; align-items: center; justify-content: center; padding: 16px;
        }
 
        .modal-box {
          background: var(--bg2); border: 1px solid var(--border2);
          border-radius: 24px; padding: 32px;
          width: 100%; max-width: 560px;
          animation: modalIn 0.2s ease;
          box-shadow: 0 20px 60px rgba(0,0,0,0.12);
        }
 
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
 
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
 
        .fade-in { animation: fadeSlideIn 0.3s ease both; }
 
        .section-header {
          display: flex; flex-direction: column; gap: 4px;
          margin-bottom: 28px;
        }
 
        .section-title {
          font-size: 22px; font-weight: 700; color: var(--text);
          letter-spacing: -0.02em;
        }
 
        .section-subtitle { font-size: 13px; color: var(--text3); }
 
        /* Day Picker overrides */
        .rdp {
          --rdp-cell-size: 36px !important;
          --rdp-accent-color: var(--accent) !important;
          --rdp-background-color: #e0f2fe !important;
          color: var(--text) !important;
        }
        .rdp-day_selected { background: var(--accent) !important; color: white !important; }
        .rdp-button:hover:not([disabled]) { background: #e0f2fe !important; }
        .rdp-caption_label { color: var(--text) !important; font-weight: 700 !important; }
        .rdp-head_cell { color: var(--text3) !important; }
 
        .table-row { transition: background 0.15s; }
        .table-row:hover { background: rgba(2,132,199,0.03); }
 
        .spot-tab {
          padding: 8px 18px; border-radius: 8px; cursor: pointer;
          font-size: 12px; font-weight: 600; transition: all 0.2s;
          border: 1px solid var(--border2); color: var(--text2); background: var(--surface);
        }
        .spot-tab:hover { border-color: var(--accent); color: var(--accent); }
        .spot-tab.active {
          background: var(--accent); color: white;
          border-color: var(--accent);
        }
 
        .image-drop {
          border: 2px dashed var(--border2); border-radius: 12px;
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; cursor: pointer;
          transition: all 0.2s; padding: 20px;
        }
        .image-drop:hover { border-color: var(--accent); background: rgba(2,132,199,0.03); }
 
        .toast {
          position: fixed; bottom: 24px; right: 24px; z-index: 9999;
          padding: 12px 20px; border-radius: 12px; font-size: 13px; font-weight: 600;
          display: flex; align-items: center; gap: 10px;
          animation: toastIn 0.3s ease;
          box-shadow: 0 8px 32px rgba(0,0,0,0.12);
        }
        @keyframes toastIn {
          from { opacity: 0; transform: translateY(16px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .toast.success { background: #f0fdf4; border: 1px solid #22c55e; color: #15803d; }
        .toast.error { background: #fef2f2; border: 1px solid #ef4444; color: #b91c1c; }
 
        /* Notification item */
        .notif-item {
          display: flex; gap: 12px; padding: 14px 16px;
          border-radius: 12px; cursor: pointer; transition: background 0.15s;
          border: 1px solid transparent;
        }
        .notif-item:hover { background: #f0f9ff; border-color: #bae6fd; }
        .notif-item.unread { background: #f0f9ff; }
      `}</style>

      {/* ── TOP HEADER ── */}
      <header style={{
        background: "var(--header-bg)",
        height: 64,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 28px",
        position: "sticky", top: 0, zIndex: 50,
        boxShadow: "0 2px 12px rgba(14,165,233,0.3)",
      }}>
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(0,0,0,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Layers size={18} color="white" />
          </div>
          <span style={{ color: "white", fontWeight: 700, fontSize: 16, letterSpacing: "-0.01em" }}>SUST Spot Booking</span>
        </div>

        {/* Right: Notifications + Logout */}
        <div className="flex items-center gap-3">
          {/* Notification Bell */}
          <button
            onClick={() => setShowNotifications(true)}
            style={{
              position: "relative", background: "rgba(255,255,255,0.15)", border: "none",
              borderRadius: 10, padding: "8px 16px", cursor: "pointer",
              display: "flex", alignItems: "center", gap: 8,
              color: "white", fontWeight: 700, fontSize: 14, transition: "background 0.2s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.25)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
          >
            <Bell size={16} />
            <span>Notifications</span>
            {unreadCount > 0 && (
              <span style={{
                position: "absolute", top: 4, right: 4,
                background: "#ef4444", color: "white",
                borderRadius: "50%", width: 18, height: 18,
                fontSize: 10, fontWeight: 800,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "JetBrains Mono",
              }}>{unreadCount > 9 ? "9+" : unreadCount}</span>
            )}
          </button>

          {/* Logout */}
          <button
            onClick={() => { localStorage.removeItem("adminToken"); window.location.href = "/login"; }}
            style={{
              background: "white", color: "#0284c7", border: "none",
              borderRadius: 10, padding: "8px 20px", cursor: "pointer",
              fontWeight: 700, fontSize: 14, transition: "all 0.2s",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }}
            onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
            onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
          >
            Logout
          </button>
        </div>
      </header>

      {/* ── BODY ── */}
      <div style={{ display: "flex", height: "calc(100vh - 64px)" }}>

        {/* ── SIDEBAR ── */}
        <aside style={{
          width: 220, background: "var(--bg2)",
          borderRight: "1px solid var(--border)",
          flexShrink: 0, display: "flex", flexDirection: "column",
          boxShadow: "2px 0 8px rgba(0,0,0,0.04)",
        }}>
          <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: 4 }}>
            {navItems.map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                className={`nav-item ${activeSection === id ? "active" : ""}`}
                onClick={() => setActiveSection(id)}
              >
                <Icon size={15} />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <main style={{ flex: 1, overflowY: "auto", background: "var(--bg)" }}>
          <div className="p-8 fade-in" key={activeSection}>
            {activeSection === "overview" && <DashboardOverview setActiveSection={setActiveSection} />}
            {activeSection === "spots" && <SpotManagement />}
            {activeSection === "approvals" && <BookingApprovals />}
            {activeSection === "history" && <BookingHistory />}
            {activeSection === "blogs" && <BlogModeration />}
          </div>
        </main>
      </div>

      {/* ── NOTIFICATIONS MODAL ── */}
      {showNotifications && (
        <NotificationsModal
          notifications={notifications}
          onClose={() => setShowNotifications(false)}
          onMarkAllRead={markAllRead}
          onRefresh={fetchNotifications}
          setActiveSection={setActiveSection}
        />
      )}
    </div>
  );
}

// ── TOAST HELPER ──────────────────────────────────────────────────────────────
const Toast = ({ message, type, onDone }) => {
  useEffect(() => { const t = setTimeout(onDone, 3000); return () => clearTimeout(t); }, [onDone]);
  return (
    <div className={`toast ${type}`}>
      {type === "success" ? <Check size={16} /> : <AlertTriangle size={16} />}
      {message}
    </div>
  );
};

//notification modal
const NotificationsModal = ({ notifications, onClose, onMarkAllRead, onRefresh, setActiveSection }) => {
  const unread = notifications.filter(n => !n.is_read).length;

  // Notification type → icon + color
  const getTypeStyle = (type) => {
    switch (type) {
      case "new_booking": return { icon: CalendarIcon, color: "#0284c7", bg: "#e0f2fe" };
      case "cancellation": return { icon: XCircle, color: "#dc2626", bg: "#fee2e2" };
      case "feedback": return { icon: MessageSquare, color: "#7c3aed", bg: "#f3e8ff" };
      case "blog_request": return { icon: FileText, color: "#d97706", bg: "#fef3c7" };
      case "approval": return { icon: CheckCircle2, color: "#16a34a", bg: "#dcfce7" };
      case "rejection": return { icon: AlertTriangle, color: "#dc2626", bg: "#fee2e2" };
      default: return { icon: Bell, color: "#64748b", bg: "#f1f5f9" };
    }
  };

  // Relative time helper
  const relTime = (ts) => {
    if (!ts) return "";
    const diff = (Date.now() - new Date(ts).getTime()) / 1000;
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hour${Math.floor(diff / 3600) > 1 ? "s" : ""} ago`;
    if (diff < 172800) return "Yesterday";
    return new Date(ts).toLocaleDateString("en-GB");
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "rgba(15,23,42,0.45)", backdropFilter: "blur(4px)",
      }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          background: "white", borderRadius: 20, width: "100%", maxWidth: 520,
          boxShadow: "0 24px 64px rgba(0,0,0,0.15)", border: "1px solid #e2e8f0",
          animation: "modalIn 0.2s ease",
          display: "flex", flexDirection: "column", maxHeight: "80vh",
        }}
      >
        {/* Header */}
        <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid #f1f5f9" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 18, color: "#0f172a" }}>Notifications</div>
              <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>Stay updated with user activities</div>
            </div>
            <button
              onClick={onClose}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 6, borderRadius: 8, color: "#94a3b8" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#f1f5f9"; e.currentTarget.style.color = "#0f172a"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "#94a3b8"; }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* List */}
        <div style={{ overflowY: "auto", flex: 1, padding: "12px 16px" }}>
          {notifications.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 0", color: "#94a3b8" }}>
              <Bell size={32} style={{ margin: "0 auto 10px", opacity: 0.3 }} />
              <div style={{ fontSize: 14 }}>No notifications yet</div>
            </div>
          ) : (
            notifications.map((notif) => {
              const { icon: Icon, color, bg } = getTypeStyle(notif.type);
              return (
                <div
                  key={notif.notification_id}
                  className={`notif-item ${!notif.is_read ? "unread" : ""}`}
                  onClick={() => {
                    // Navigate to the relevant section
                    if (notif.type === "new_booking") { setActiveSection("approvals"); onClose(); }
                    if (notif.type === "blog_request") { setActiveSection("blogs"); onClose(); }
                    if (notif.type === "feedback") { setActiveSection("blogs"); onClose(); }
                  }}
                >
                  {/* Icon */}
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={16} color={color} />
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: "#0f172a", fontWeight: notif.is_read ? 400 : 600, lineHeight: 1.5 }}>
                      {notif.message}
                    </div>
                    {notif.booking_id && (
                      <button
                        onClick={e => { e.stopPropagation(); setActiveSection("approvals"); onClose(); }}
                        style={{ fontSize: 12, color: "#0284c7", fontWeight: 600, background: "none", border: "none", cursor: "pointer", padding: 0, marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}
                      >
                        View Details <ChevronRight size={12} />
                      </button>
                    )}
                    <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 3, fontFamily: "JetBrains Mono" }}>
                      {relTime(notif.created_at)}
                    </div>
                  </div>

                  {/* Unread dot */}
                  {!notif.is_read && (
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#0284c7", flexShrink: 0, marginTop: 4 }} />
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div style={{ padding: "12px 24px", borderTop: "1px solid #f1f5f9", textAlign: "center" }}>
            <button
              onClick={onMarkAllRead}
              style={{ fontSize: 13, fontWeight: 700, color: "#0284c7", background: "none", border: "none", cursor: "pointer", letterSpacing: "0.02em" }}
              onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
              onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}
            >
              MARK ALL AS READ
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
//reserve spot panel
const ReserveSpotPanel = ({ onClose }) => {
  const [spots, setSpots] = useState([]);
  const [selectedSpotId, setSelectedSpotId] = useState("");
  const [selectedSpotName, setSelectedSpotName] = useState("");
  const [bookingType, setBookingType] = useState("single"); // "single" | "range"
  const [selectedDate, setSelectedDate] = useState(null);
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [session, setSession] = useState("");
  const [conflictInfo, setConflictInfo] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const today = new Date();

  // Load spots list
  useEffect(() => {
    adminApi().get("/spots").then(r => setSpots(r.data || [])).catch(() => { });
  }, []);

  const formatDate = (d) => {
    if (!d) return null;
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };

  // Check conflicts against real DB
  const checkConflict = async (date) => {
    if (!selectedSpotId || !date) return;
    try {
      const res = await adminApi().get(`/spots/${selectedSpotId}/availability?date=${formatDate(date)}`);
      setConflictInfo(res.data.conflict ? res.data : null);
    } catch {
      setConflictInfo(null); // no conflict endpoint = allow
    }
  };

  const handleDateSelect = (val) => {
    if (bookingType === "single") {
      setSelectedDate(val);
      setConflictInfo(null);
      if (val) checkConflict(val);
    } else {
      setDateRange(val || { from: null, to: null });
      setConflictInfo(null);
    }
  };

  const handleReserve = async () => {
    if (!selectedSpotId || !session) return;
    const startDate = bookingType === "single" ? formatDate(selectedDate) : formatDate(dateRange.from);
    const endDate = bookingType === "range" ? formatDate(dateRange.to) : null;
    if (!startDate) return;

    setSaving(true);
    try {
      await adminApi().post("/bookings/reserve", {
        spot_id: selectedSpotId,
        start_date: startDate,
        end_date: endDate,
        session,
        title: `Admin Reserved — ${selectedSpotName}`,
      });
      setToast({ msg: `${selectedSpotName} reserved successfully!`, type: "success" });
      setTimeout(onClose, 1500);
    } catch {
      setToast({ msg: "Reservation failed. Try again.", type: "error" });
    }
    setSaving(false);
  };

  const dateReady = bookingType === "single" ? !!selectedDate : !!(dateRange?.from && dateRange?.to);

  return (
    <>
      {toast && <Toast message={toast.msg} type={toast.type} onDone={() => setToast(null)} />}
      <div style={{
        background: "#f0f9ff", border: "1.5px solid #bae6fd", borderRadius: 20,
        padding: 24, marginBottom: 4,
        animation: "fadeSlideIn 0.25s ease",
      }}>
        {/* Panel Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <CalendarIcon size={18} color="#0284c7" />
              <span style={{ fontWeight: 700, fontSize: 15, color: "#0c4a6e" }}>Admin Priority Reservation</span>
            </div>
            <div style={{ fontSize: 12, color: "#0284c7", marginTop: 3, marginLeft: 26 }}>
              Spot: {selectedSpotName || "Not selected"}
            </div>
          </div>

          {/* Controls */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <select
              value={selectedSpotId}
              onChange={e => {
                const opt = e.target.options[e.target.selectedIndex];
                setSelectedSpotId(e.target.value);
                setSelectedSpotName(opt.text);
                setSelectedDate(null); setDateRange({ from: null, to: null }); setConflictInfo(null);
              }}
              style={{ padding: "8px 14px", borderRadius: 10, border: "1.5px solid #7dd3fc", background: "white", color: "#0c4a6e", fontWeight: 700, fontSize: 12, outline: "none", cursor: "pointer" }}
            >
              <option value="">Select Spot</option>
              {spots.map(s => <option key={s.spot_id} value={s.spot_id}>{s.name}</option>)}
            </select>

            <select
              value={bookingType}
              onChange={e => { setBookingType(e.target.value); setSelectedDate(null); setDateRange({ from: null, to: null }); setConflictInfo(null); }}
              style={{ padding: "8px 14px", borderRadius: 10, border: "1.5px solid #cbd5e1", background: "white", color: "#475569", fontWeight: 600, fontSize: 12, outline: "none", cursor: "pointer" }}
            >
              <option value="single">Single Day</option>
              <option value="range">Multiple Days</option>
            </select>
          </div>
        </div>

        {/* Body */}
        {!selectedSpotId ? (
          <div style={{ textAlign: "center", padding: "32px 0", border: "1.5px dashed #bae6fd", borderRadius: 14, background: "rgba(255,255,255,0.5)" }}>
            <MapPin size={28} color="#bae6fd" style={{ margin: "0 auto 8px" }} />
            <div style={{ color: "#94a3b8", fontWeight: 600, fontSize: 13 }}>Please select a spot first</div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 20 }}>
            {/* Calendar */}
            <div style={{ background: "white", borderRadius: 16, padding: 16, border: "1px solid #e0f2fe", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
              <DayPicker
                mode={bookingType === "single" ? "single" : "range"}
                selected={bookingType === "single" ? selectedDate : dateRange}
                onSelect={handleDateSelect}
                disabled={d => d < today}
              />
            </div>

            {/* Right Panel */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Conflict warning */}
              {conflictInfo && (
                <div style={{ background: "#fef2f2", border: "1.5px solid #fca5a5", borderRadius: 14, padding: 16 }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <AlertTriangle size={18} color="#dc2626" style={{ flexShrink: 0, marginTop: 1 }} />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 12, color: "#dc2626", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Conflict Detected</div>
                      <div style={{ fontSize: 13, color: "#7f1d1d" }}>{conflictInfo.msg || "An event is already booked on this date."}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Date display */}
              {dateReady && (
                <div style={{ background: "#dcfce7", border: "1.5px solid #86efac", borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
                  <Check size={16} color="#16a34a" />
                  <span style={{ fontWeight: 700, fontSize: 13, color: "#15803d" }}>
                    {bookingType === "single"
                      ? `Selected: ${formatDate(selectedDate)}`
                      : `${formatDate(dateRange.from)} → ${formatDate(dateRange.to)}`}
                  </span>
                </div>
              )}

              {/* Session picker */}
              {dateReady && (
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Select Session</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {[
                      { val: "day", label: "Day", sub: "Morning to afternoon" },
                      { val: "night", label: "Night", sub: "Evening to midnight" },
                      { val: "day+night", label: "Day & Night", sub: "Full day" },
                    ].map(({ val, label, sub }) => (
                      <label
                        key={val}
                        style={{
                          display: "flex", alignItems: "center", gap: 12,
                          padding: "12px 16px", borderRadius: 12, cursor: "pointer",
                          border: `1.5px solid ${session === val ? "#7dd3fc" : "#e2e8f0"}`,
                          background: session === val ? "#f0f9ff" : "white",
                          transition: "all 0.15s",
                        }}
                      >
                        <input type="radio" name="reserve-session" value={val}
                          checked={session === val} onChange={() => setSession(val)}
                          style={{ accentColor: "#0284c7", width: 16, height: 16 }} />
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 13, color: "#0c4a6e" }}>{label}</div>
                          <div style={{ fontSize: 11, color: "#94a3b8" }}>{sub}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Reserve Button */}
              {dateReady && session && (
                <button
                  onClick={handleReserve}
                  disabled={saving}
                  style={{
                    width: "100%", padding: "14px", borderRadius: 14, border: "none",
                    background: saving ? "#94a3b8" : "#0284c7", color: "white",
                    fontWeight: 800, fontSize: 15, cursor: saving ? "not-allowed" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    boxShadow: saving ? "none" : "0 4px 14px rgba(2,132,199,0.35)",
                    transition: "all 0.2s", marginTop: "auto",
                  }}
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : null}
                  {saving ? "Reserving..." : `Reserve ${selectedSpotName}`}
                </button>
              )}

              {/* Empty state */}
              {!dateReady && !conflictInfo && (
                <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", border: "1.5px dashed #bae6fd", borderRadius: 14, padding: 32, background: "rgba(255,255,255,0.4)" }}>
                  <div style={{ textAlign: "center", color: "#94a3b8" }}>
                    <CalendarIcon size={32} style={{ margin: "0 auto 8px", opacity: 0.3 }} />
                    <div style={{ fontSize: 13, fontWeight: 600 }}>
                      {bookingType === "single" ? "Pick a date from the calendar" : "Pick start and end dates"}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
// ── DASHBOARD OVERVIEW ────────────────────────────────────────────────────────
const DashboardOverview = ({ setActiveSection }) => {
  const [adminData, setAdminData] = useState({ approver_name: "", approver_email: "", approver_designation: "", approver_signature: null });
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [upcoming, setUpcoming] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [toast, setToast] = useState(null);
  const [showReserve, setShowReserve] = useState(false);
  const sigInputRef = useRef(null);

  useEffect(() => {
    const api = adminApi();
    api.get("/profile").then(r => { setAdminData(r.data); setEditForm(r.data); }).catch(() => { });
    api.get("/dashboard").then(r => {
      const s = r.data.stats || {};
      setStats({ total: +s.total || 0, pending: +s.pending || 0, approved: +s.approved || 0, rejected: +s.rejected || 0 });
      setUpcoming(r.data.upcoming || []);
    }).catch(() => { });
  }, []);

  const saveProfile = async () => {
    try {
      await adminApi().put("/profile", editForm);
      setAdminData(editForm); setIsEditing(false);
      setToast({ msg: "Profile saved", type: "success" });
    } catch { setToast({ msg: "Save failed", type: "error" }); }
  };

  const uploadSignature = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    const fd = new FormData(); fd.append("signature", file);
    try {
      await adminApi().put("/profile/signature", fd);
      setAdminData(prev => ({ ...prev, approver_signature: URL.createObjectURL(file) }));
      setToast({ msg: "Signature updated", type: "success" });
    } catch { setToast({ msg: "Upload failed", type: "error" }); }
  };

  const statCards = [
    { label: "Total Requests", value: stats.total, color: "#4f6ef7", icon: BarChart2 },
    { label: "Approved", value: stats.approved, color: "#22c55e", icon: CheckCircle2 },
    { label: "Pending", value: stats.pending, color: "#f97316", icon: Clock },
    { label: "Rejected", value: stats.rejected, color: "#ef4444", icon: XCircle },
  ];

  return (
    <div>
      {toast && <Toast message={toast.msg} type={toast.type} onDone={() => setToast(null)} />}
      <div className="flex items-center justify-between px-8 py-6 bg-slate-50 rounded-xl">

        {/* Left Side */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Admin Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your system at a glance.
          </p>
        </div>

        {/* Right Button */}
        <button
          onClick={() => setShowReserve(v => !v)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full 
               bg-gradient-to-r from-sky-500 to-blue-600 
               text-white text-sm font-semibold 
               shadow-md hover:shadow-lg 
               hover:-translate-y-0.5 transition-all duration-200"
        >
          <Plus size={16} />
          {showReserve ? "Close Reservation" : "Reserve a Spot"}
        </button>

      </div>
      {showReserve && <ReserveSpotPanel onClose={() => setShowReserve(false)} />}

      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 24 }}>
        {/* LEFT: Profile */}
        <div>
          <div className="glass" style={{ borderRadius: 20, padding: 24 }}>
            <div className="flex items-center justify-between mb-5">
              <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Profile</span>
              <button className="btn-ghost" style={{ padding: "5px 10px", borderRadius: 8, fontSize: 11, display: "flex", alignItems: "center", gap: 5 }}
                onClick={() => { if (!isEditing) setEditForm(adminData); setIsEditing(!isEditing); }}>
                <PenLine size={11} /> {isEditing ? "Cancel" : "Edit"}
              </button>
            </div>

            <div className="flex flex-col items-center text-center mb-6">
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(79,110,247,0.15)", border: "2px solid rgba(79,110,247,0.3)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                <User size={28} color="var(--accent2)" />
              </div>
              {isEditing ? (
                <div style={{ width: "100%" }} className="space-y-2">
                  <input className="input-field" value={editForm.approver_name || ""} onChange={e => setEditForm(p => ({ ...p, approver_name: e.target.value }))} placeholder="Name" />
                  <input className="input-field" value={editForm.approver_email || ""} onChange={e => setEditForm(p => ({ ...p, approver_email: e.target.value }))} placeholder="Email" />
                  <input className="input-field" value={editForm.approver_designation || ""} onChange={e => setEditForm(p => ({ ...p, approver_designation: e.target.value }))} placeholder="Designation" />
                  <button className="btn-primary" style={{ width: "100%", padding: "9px", borderRadius: 10, fontSize: 12, fontWeight: 600 }} onClick={saveProfile}>Save Changes</button>
                </div>
              ) : (
                <>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "var(--text)", marginBottom: 3 }}>{adminData.approver_name || "—"}</div>
                  <div style={{ fontSize: 12, color: "var(--text3)" }}>{adminData.approver_designation || "Admin"}</div>
                </>
              )}
            </div>

            <div style={{ borderTop: "1px solid var(--border)", paddingTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
              <div className="flex items-center gap-2">
                <Mail size={13} color="var(--text3)" />
                <span style={{ fontSize: 12, color: "var(--text2)" }}>{adminData.approver_email || "—"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield size={13} color="var(--text3)" />
                <span style={{ fontSize: 12, color: "var(--text2)" }}>Super Admin</span>
              </div>
            </div>

            {/* Signature */}
            <div style={{ marginTop: 20, borderTop: "1px solid var(--border)", paddingTop: 16 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Official Signature</div>
              <div style={{ width: "100%", height: 80, borderRadius: 10, border: "1px dashed var(--border2)", background: "var(--bg2)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                {adminData.approver_signature ? (
                  <img src={adminData.approver_signature.startsWith("blob") ? adminData.approver_signature : `http://localhost:5000/${adminData.approver_signature}`}
                    alt="Signature" style={{ height: "100%", width: "100%", objectFit: "contain", padding: 8, filter: "invert(1)" }} />
                ) : (
                  <div style={{ color: "var(--text3)", fontSize: 11 }}>No signature</div>
                )}
              </div>
              <button className="btn-ghost" style={{ width: "100%", marginTop: 8, padding: "7px", borderRadius: 8, fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}
                onClick={() => sigInputRef.current.click()}>
                <Upload size={12} /> Update Signature
              </button>
              <input type="file" hidden ref={sigInputRef} accept="image/*" onChange={uploadSignature} />
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
            {statCards.map(({ label, value, color, icon: Icon }) => (
              <div key={label} className="stat-card">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon size={16} color={color} />
                  </div>
                </div>
                <div style={{ fontSize: 28, fontWeight: 800, color, fontFamily: "JetBrains Mono", marginBottom: 4 }}>{value}</div>
                <div style={{ fontSize: 11, color: "var(--text3)", fontWeight: 500 }}>{label}</div>
              </div>
            ))}
          </div>

          {/* Quick Nav */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              { id: "spots", icon: MapPin, label: "Spot Management", desc: "Edit venues & settings", color: "#4f6ef7" },
              { id: "approvals", icon: ClipboardCheck, label: "Booking Approvals", desc: "Review pending requests", color: "#22c55e" },
              { id: "history", icon: History, label: "Booking History", desc: "View past records", color: "#f97316" },
              { id: "blogs", icon: FileText, label: "Blog Moderation", desc: "Manage community posts", color: "#a855f7" },
            ].map(({ id, icon: Icon, label, desc, color }) => (
              <button key={id} className="glass" style={{ borderRadius: 14, padding: 18, textAlign: "left", cursor: "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", gap: 14 }}
                onClick={() => setActiveSection(id)}
                onMouseEnter={e => e.currentTarget.style.borderColor = color + "50"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon size={18} color={color} />
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13, color: "var(--text)", marginBottom: 2 }}>{label}</div>
                  <div style={{ fontSize: 11, color: "var(--text3)" }}>{desc}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Upcoming Events */}
          {upcoming.length > 0 && (
            <div className="glass" style={{ borderRadius: 16, padding: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>Upcoming Events</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {upcoming.map((ev) => (
                  <div key={ev.booking_id} className="flex items-center gap-3">
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)", flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text)" }}>{ev.event_title}</div>
                      <div style={{ fontSize: 11, color: "var(--text3)" }}>{ev.spot_name} · {ev.start_date?.split("T")[0]}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ── SPOT MANAGEMENT ───────────────────────────────────────────────────────────
const SpotManagement = () => {
  const [spots, setSpots] = useState([]);
  const [activeSpot, setActiveSpot] = useState(null); // null = creating new
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const [form, setForm] = useState({ name: "", location: "", capacity: "", max_booking: "", description: "", spot_rules: "" });
  const [mainImage, setMainImage] = useState(null); // File or URL string
  const [gallery, setGallery] = useState([null, null]); // 2 gallery images
  const [recipients, setRecipients] = useState([{ recipient_name: "", recipient_email: "" }]);

  const mainRef = useRef(null);
  const galleryRefs = [useRef(null), useRef(null)];
  const API_URL = "http://localhost:5000";

  const fetchSpots = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi().get("/spots");
      setSpots(res.data || []);
    } catch (e) {
      setToast({ msg: "Failed to load spots", type: "error" });
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchSpots(); }, [fetchSpots]);

  // Load spot into form
  useEffect(() => {
    if (!activeSpot) {
      setForm({ name: "", location: "", capacity: "", max_booking: "", description: "", spot_rules: "" });
      setMainImage(null); setGallery([null, null]);
      setRecipients([{ recipient_name: "", recipient_email: "" }]);
      return;
    }
    setForm({
      name: activeSpot.name || "",
      location: activeSpot.location || "",
      capacity: activeSpot.capacity || "",
      max_booking: activeSpot.max_booking || "",
      description: activeSpot.description || "",
      spot_rules: activeSpot.spot_rules || "",
    });
    setMainImage(activeSpot.image1 ? `${API_URL}/${activeSpot.image1}` : null);
    setGallery([
      activeSpot.image2 ? `${API_URL}/${activeSpot.image2}` : null,
      activeSpot.image3 ? `${API_URL}/${activeSpot.image3}` : null,
    ]);
    adminApi().get(`/spots/${activeSpot.spot_id}/recipients`)
      .then(r => setRecipients(r.data.length ? r.data.map(x => ({ recipient_name: x.recipient_designation || "", recipient_email: x.recipient_email || "" })) : [{ recipient_name: "", recipient_email: "" }]))
      .catch(() => setRecipients([{ recipient_name: "", recipient_email: "" }]));
  }, [activeSpot]);

  const handleSave = async () => {
    if (!form.name.trim()) { setToast({ msg: "Spot name is required", type: "error" }); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (mainImage instanceof File) fd.append("image1", mainImage);
      if (gallery[0] instanceof File) fd.append("image2", gallery[0]);
      if (gallery[1] instanceof File) fd.append("image3", gallery[1]);

      let spotId;
      if (activeSpot) {
        await adminApi().put(`/spots/${activeSpot.spot_id}`, fd);
        spotId = activeSpot.spot_id;
      } else {
        const res = await adminApi().post("/spots", fd);
        spotId = res.data.spot_id;
      }

      // Save recipients
      await adminApi().put(`/spots/${spotId}/recipients`, { recipients });

      setToast({ msg: "Spot saved successfully!", type: "success" });
      await fetchSpots();
      if (!activeSpot && spotId) {
        const fresh = await adminApi().get(`/spots/${spotId}`);
        setActiveSpot(fresh.data);
      }
    } catch (e) {
      setToast({ msg: "Save failed. Try again.", type: "error" });
    }
    setSaving(false);
  };

  const handleDelete = async (spotId) => {
    if (!window.confirm("Delete this spot permanently?")) return;
    try {
      await adminApi().delete(`/spots/${spotId}`);
      setToast({ msg: "Spot deleted", type: "success" });
      setActiveSpot(null);
      await fetchSpots();
    } catch { setToast({ msg: "Delete failed", type: "error" }); }
  };

  const imgSrc = (img) => img instanceof File ? URL.createObjectURL(img) : img;

  return (
    <div>
      {toast && <Toast message={toast.msg} type={toast.type} onDone={() => setToast(null)} />}
      <div className="section-header">
        <h1 className="section-title">Spot Management</h1>
        <p className="section-subtitle">Configure venues, images, and approval recipients</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {loading ? <div style={{ color: "var(--text3)", fontSize: 13 }}>Loading...</div> : spots.map(s => (
          <button key={s.spot_id} className={`spot-tab ${activeSpot?.spot_id === s.spot_id ? "active" : ""}`}
            onClick={() => setActiveSpot(s)}>{s.name}</button>
        ))}
        <button className="spot-tab" style={{ borderColor: "rgba(34,197,94,0.3)", color: "var(--green)" }}
          onClick={() => setActiveSpot(null)}>+ New Spot</button>
      </div>

      {/* Form */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20 }}>
        {/* LEFT: Form Fields */}
        <div className="glass" style={{ borderRadius: 20, padding: 28 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text)", marginBottom: 20 }}>
            {activeSpot ? `Editing: ${activeSpot.name}` : "Create New Spot"}
          </div>

          {/* Main Image */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: 8 }}>Cover Image</label>
            <div style={{ position: "relative", height: 200, borderRadius: 14, overflow: "hidden", background: "var(--bg2)" }}>
              {mainImage ? (
                <img src={imgSrc(mainImage)} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="Cover" />
              ) : (
                <div className="image-drop h-full" style={{ height: "100%" }}>
                  <Camera size={24} color="var(--text3)" style={{ marginBottom: 6 }} />
                  <span style={{ fontSize: 12, color: "var(--text3)" }}>Click to upload cover image</span>
                </div>
              )}
              <button className="btn-ghost" onClick={() => mainRef.current.click()}
                style={{ position: "absolute", bottom: 10, right: 10, padding: "6px 14px", borderRadius: 8, fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", gap: 5, background: "rgba(168, 182, 214, 0.8)" }}>
                <Camera size={12} /> Change
              </button>
              <input type="file" hidden ref={mainRef} accept="image/*" onChange={e => e.target.files[0] && setMainImage(e.target.files[0])} />
            </div>
          </div>

          {/* Gallery */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: 8 }}>Gallery (2 images)</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[0, 1].map(i => (
                <div key={i} style={{ position: "relative", height: 110, borderRadius: 10, overflow: "hidden", background: "var(--bg2)" }}>
                  {gallery[i] ? (
                    <>
                      <img src={imgSrc(gallery[i])} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt={`Gallery ${i}`} />
                      <button onClick={() => setGallery(p => { const n = [...p]; n[i] = null; return n; })}
                        style={{ position: "absolute", top: 6, right: 6, background: "rgba(239,68,68,0.9)", border: "none", borderRadius: 6, padding: 4, cursor: "pointer", display: "flex" }}>
                        <X size={12} color="white" />
                      </button>
                    </>
                  ) : (
                    <div className="image-drop" style={{ height: "100%", cursor: "pointer" }} onClick={() => galleryRefs[i].current.click()}>
                      <ImagePlus size={18} color="var(--text3)" style={{ marginBottom: 4 }} />
                      <span style={{ fontSize: 10, color: "var(--text3)" }}>Image {i + 1}</span>
                    </div>
                  )}
                  <input type="file" hidden ref={galleryRefs[i]} accept="image/*"
                    onChange={e => { if (e.target.files[0]) setGallery(p => { const n = [...p]; n[i] = e.target.files[0]; return n; }); }} />
                </div>
              ))}
            </div>
          </div>

          {/* Text Fields */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {[
              { key: "name", label: "Spot Name", placeholder: "e.g. Central Field" },
              { key: "location", label: "Location", placeholder: "e.g. East Campus" },
              { key: "capacity", label: "Capacity", placeholder: "e.g. 10000" },
              { key: "max_booking", label: "Max Booking Days", placeholder: "e.g. 7" },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>{label}</label>
                <input className="input-field" value={form[key] || ""} placeholder={placeholder}
                  onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} />
              </div>
            ))}
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>Description</label>
              <textarea className="input-field" style={{ resize: "vertical", minHeight: 80 }} value={form.description || ""} placeholder="Describe the spot..."
                onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>Rules & Instructions</label>
              <textarea className="input-field" style={{ resize: "vertical", minHeight: 80 }} value={form.spot_rules || ""} placeholder="1. No littering..."
                onChange={e => setForm(p => ({ ...p, spot_rules: e.target.value }))} />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between mt-6" style={{ paddingTop: 20, borderTop: "1px solid var(--border)" }}>
            {activeSpot && (
              <button onClick={() => handleDelete(activeSpot.spot_id)}
                style={{ padding: "8px 16px", borderRadius: 10, fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 6, background: "rgba(239,68,68,0.1)", color: "var(--red)", border: "1px solid rgba(239,68,68,0.2)", cursor: "pointer" }}>
                <Trash2 size={13} /> Delete Spot
              </button>
            )}
            <button className="btn-primary" disabled={saving}
              style={{ marginLeft: "auto", padding: "10px 24px", borderRadius: 12, fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 8, opacity: saving ? 0.7 : 1 }}
              onClick={handleSave}>
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
              {saving ? "Saving..." : "Save Spot"}
            </button>
          </div>
        </div>

        {/* RIGHT: Recipients */}
        <div className="glass" style={{ borderRadius: 20, padding: 24, alignSelf: "start" }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: "var(--text)", marginBottom: 4 }}>Approval Recipients</div>
            <div style={{ fontSize: 11, color: "var(--text3)" }}>These receive approval letter copies</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {recipients.map((r, i) => (
              <div key={i} style={{ background: "var(--bg2)", borderRadius: 10, padding: 12, border: "1px solid var(--border)" }}>
                <div className="flex items-center justify-between mb-2">
                  <span style={{ fontSize: 10, fontWeight: 700, color: "var(--text3)", fontFamily: "JetBrains Mono" }}>#{i + 1}</span>
                  {recipients.length > 1 && (
                    <button onClick={() => setRecipients(p => p.filter((_, j) => j !== i))}
                      style={{ background: "none", border: "none", color: "var(--red)", cursor: "pointer", padding: 2 }}>
                      <X size={13} />
                    </button>
                  )}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <input className="input-field" placeholder="Name / Designation" value={r.recipient_name}
                    onChange={e => setRecipients(p => p.map((x, j) => j === i ? { ...x, recipient_name: e.target.value } : x))} />
                  <input className="input-field" placeholder="email@sust.edu" value={r.recipient_email}
                    onChange={e => setRecipients(p => p.map((x, j) => j === i ? { ...x, recipient_email: e.target.value } : x))} />
                </div>
              </div>
            ))}
          </div>

          <button className="btn-ghost" style={{ width: "100%", marginTop: 12, padding: "8px", borderRadius: 10, fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
            onClick={() => setRecipients(p => [...p, { recipient_name: "", recipient_email: "" }])}>
            <Plus size={13} /> Add Recipient
          </button>
        </div>
      </div>
    </div>
  );
};

// ── BOOKING APPROVALS ─────────────────────────────────────────────────────────
const BookingApprovals = () => {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterSpot, setFilterSpot] = useState("All");
  const [filterDate, setFilterDate] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [selectedReq, setSelectedReq] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const fetchPending = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi().get("/dashboard");
      const rows = res.data.pending || [];
      setPending(rows.map(b => ({
        id: `REQ-${String(b.booking_id).padStart(3, "0")}`,
        booking_id: b.booking_id,
        spotName: b.spot_name || b.name || "Unknown Spot",
        title: b.event_title || "(No Title)",
        organizer: b.full_name || "Unknown",
        date: b.start_date?.split("T")[0] || "",
        endDate: b.end_date?.split("T")[0] || null,
        session: b.session || "",
        startTime: b.start_time || "",
        endTime: b.end_time || "",
        timestamp: b.timestamp || new Date().toISOString(),
        description: b.description || "",
        applicant: { name: b.full_name, dept: b.dept, designation: b.designation, contact: b.contact_number },
        recommender: { name: b.recommender_name, post: b.recommender_post, dept: b.recommender_dept },
      })));
    } catch { setToast({ msg: "Failed to load pending bookings", type: "error" }); }
    setLoading(false);
  }, []);

  useEffect(() => { fetchPending(); }, [fetchPending]);

  const handleApprove = async (req) => {
    setActionLoading(true);
    try {
      await adminApi().post(`/bookings/${req.booking_id}/approve`);
      setPending(p => p.filter(r => r.booking_id !== req.booking_id));
      setSelectedReq(null); setPreviewOpen(false);
      setToast({ msg: "Booking approved!", type: "success" });
    } catch { setToast({ msg: "Approve failed", type: "error" }); }
    setActionLoading(false);
  };

  const handleReject = async () => {
    if (!selectedReq) return;
    setActionLoading(true);
    try {
      await adminApi().post(`/bookings/${selectedReq.booking_id}/reject`, { reason: rejectReason });
      setPending(p => p.filter(r => r.booking_id !== selectedReq.booking_id));
      setRejectOpen(false); setSelectedReq(null); setRejectReason("");
      setToast({ msg: "Booking rejected", type: "success" });
    } catch { setToast({ msg: "Reject failed", type: "error" }); }
    setActionLoading(false);
  };

  const spots = ["All", ...new Set(pending.map(r => r.spotName))];

  const filtered = useMemo(() => {
    return pending
      .filter(r => (filterSpot === "All" || r.spotName === filterSpot) && (!filterDate || r.date === filterDate))
      .sort((a, b) => {
        const tA = new Date(a.timestamp).getTime(), tB = new Date(b.timestamp).getTime();
        return sortOrder === "newest" ? tB - tA : tA - tB;
      });
  }, [pending, filterSpot, filterDate, sortOrder]);

  const fmtTime = (iso) => {
    const d = new Date(iso); let h = d.getHours(); const m = d.getMinutes().toString().padStart(2, "0");
    const ampm = h >= 12 ? "PM" : "AM"; h = h % 12 || 12; return `${h}:${m} ${ampm}`;
  };

  return (
    <div>
      {toast && <Toast message={toast.msg} type={toast.type} onDone={() => setToast(null)} />}
      <div className="section-header">
        <h1 className="section-title">Booking Approvals</h1>
        <p className="section-subtitle">{pending.length} request{pending.length !== 1 ? "s" : ""} awaiting review</p>
      </div>

      {/* Filter Bar */}
      <div className="glass" style={{ borderRadius: 16, padding: "14px 20px", marginBottom: 20, display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
        <div className="flex items-center gap-2">
          {spots.map(s => (
            <button key={s} onClick={() => setFilterSpot(s)}
              style={{
                padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.2s",
                background: filterSpot === s ? "var(--accent)" : "var(--bg2)", color: filterSpot === s ? "white" : "var(--text2)",
                border: `1px solid ${filterSpot === s ? "var(--accent)" : "var(--border)"}`
              }}>
              {s}
            </button>
          ))}
        </div>
        <input type="date" className="input-field" style={{ width: "auto" }} value={filterDate} onChange={e => setFilterDate(e.target.value)} />
        <button className="btn-ghost" style={{ padding: "7px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 6, marginLeft: "auto" }}
          onClick={() => setSortOrder(p => p === "newest" ? "oldest" : "newest")}>
          <ArrowUpDown size={13} /> {sortOrder === "newest" ? "Latest First" : "Oldest First"}
        </button>
        {(filterSpot !== "All" || filterDate) && (
          <button className="btn-ghost" style={{ padding: "7px 12px", borderRadius: 8, fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", gap: 5 }}
            onClick={() => { setFilterSpot("All"); setFilterDate(""); }}>
            <RotateCcw size={12} /> Reset
          </button>
        )}
      </div>

      {/* List */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text3)", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
          <Loader2 size={18} className="animate-spin" /> Loading bookings...
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass" style={{ borderRadius: 20, padding: 60, textAlign: "center" }}>
          <CheckCircle2 size={40} color="var(--green)" style={{ margin: "0 auto 12px" }} />
          <div style={{ fontWeight: 700, fontSize: 16, color: "var(--text)", marginBottom: 4 }}>All clear!</div>
          <div style={{ fontSize: 13, color: "var(--text3)" }}>No pending bookings match your filters.</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map(req => (
            <div key={req.id} className="glass table-row" style={{ borderRadius: 14, padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
              <div style={{ flex: 1 }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="badge" style={{ background: "rgba(79,110,247,0.15)", color: "var(--accent2)" }}>{req.id}</span>
                  <span className="flex items-center gap-1" style={{ fontSize: 11, fontWeight: 600, color: "var(--orange)", fontFamily: "JetBrains Mono" }}>
                    <Clock size={11} /> {fmtTime(req.timestamp)}
                  </span>
                </div>
                <div style={{ fontWeight: 600, fontSize: 14, color: "var(--text)", marginBottom: 6 }}>{req.title}</div>
                <div className="flex items-center gap-4" style={{ fontSize: 12, color: "var(--text3)" }}>
                  <span className="flex items-center gap-1"><MapPin size={12} color="var(--accent)" /> {req.spotName}</span>
                  <span className="flex items-center gap-1"><CalendarIcon size={12} color="var(--accent)" /> {req.date}</span>
                  <span className="flex items-center gap-1"><User size={12} /> {req.organizer}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => { setSelectedReq(req); setPreviewOpen(false); }}
                  style={{ padding: "7px 14px", borderRadius: 9, fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 5, background: "var(--surface2)", border: "1px solid var(--border2)", color: "var(--text2)", cursor: "pointer", transition: "all 0.2s" }}>
                  <Eye size={13} /> Details
                </button>
                <button onClick={() => { setSelectedReq(req); setRejectOpen(true); }}
                  style={{ padding: "7px 14px", borderRadius: 9, fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 5, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "var(--red)", cursor: "pointer", transition: "all 0.2s" }}>
                  <X size={13} /> Reject
                </button>
                <button onClick={() => handleApprove(req)}
                  style={{ padding: "7px 16px", borderRadius: 9, fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 5, background: "var(--accent)", border: "none", color: "white", cursor: "pointer", transition: "all 0.2s" }}>
                  <Check size={13} /> Approve
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedReq && !rejectOpen && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && (setSelectedReq(null), setPreviewOpen(false))}>
          {!previewOpen ? (
            <div className="modal-box" style={{ maxWidth: 600 }}>
              <div className="flex items-center justify-between mb-6">
                <h3 style={{ fontWeight: 700, fontSize: 18, color: "var(--text)" }}>Booking Details</h3>
                <span className="badge" style={{ background: "rgba(79,110,247,0.15)", color: "var(--accent2)" }}>{selectedReq.id}</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
                {[
                  { label: "Organizer", value: selectedReq.organizer },
                  { label: "Spot", value: selectedReq.spotName },
                  { label: "Date", value: selectedReq.endDate ? `${selectedReq.date} → ${selectedReq.endDate}` : selectedReq.date },
                  { label: "Session", value: selectedReq.session },
                  { label: "Time", value: `${selectedReq.startTime || "—"} – ${selectedReq.endTime || "—"}` },
                  { label: "Dept", value: selectedReq.applicant?.dept || "—" },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>{label}</div>
                    <div style={{ fontWeight: 600, color: "var(--text)", fontSize: 13 }}>{value}</div>
                  </div>
                ))}
              </div>
              {selectedReq.recommender?.name && (
                <div style={{ background: "var(--bg)", borderRadius: 12, padding: 16, marginBottom: 16, border: "1px solid var(--border)" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Recommender</div>
                  <div style={{ fontWeight: 600, color: "var(--text)", fontSize: 13 }}>{selectedReq.recommender.name}</div>
                  <div style={{ fontSize: 12, color: "var(--accent2)" }}>{selectedReq.recommender.post}</div>
                </div>
              )}
              {selectedReq.description && (
                <div style={{ background: "var(--bg)", borderRadius: 12, padding: 16, marginBottom: 20, border: "1px solid var(--border)" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Description</div>
                  <div style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.6 }}>{selectedReq.description}</div>
                </div>
              )}
              <div className="flex gap-3">
                <button className="btn-ghost" style={{ flex: 1, padding: "11px", borderRadius: 12, fontWeight: 600 }} onClick={() => setSelectedReq(null)}>Close</button>
                <button className="btn-primary" style={{ flex: 1, padding: "11px", borderRadius: 12, fontWeight: 600 }} onClick={() => setPreviewOpen(true)}>Preview & Approve</button>
              </div>
            </div>
          ) : (
            /* Approval Preview */
            <div style={{ background: "var(--bg2)", borderRadius: 24, width: "100%", maxWidth: 700, maxHeight: "90vh", display: "flex", flexDirection: "column", border: "1px solid var(--border2)" }}>
              <div style={{ background: "var(--bg3)", padding: "14px 24px", borderRadius: "24px 24px 0 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text3)", fontFamily: "JetBrains Mono", letterSpacing: "0.2em", textTransform: "uppercase" }}>Approval Document Preview</span>
                <button style={{ background: "none", border: "none", color: "var(--text2)", cursor: "pointer" }} onClick={() => setPreviewOpen(false)}><X size={18} /></button>
              </div>
              <div style={{ padding: "20px 24px", overflowY: "auto", flex: 1 }}>
                <div style={{ background: "white", color: "#1a1a2e", padding: 40, borderRadius: 12, fontFamily: "Georgia, serif", minHeight: 600 }}>
                  <div style={{ textAlign: "center", marginBottom: 24, borderBottom: "2px solid #1a1a2e", paddingBottom: 16 }}>
                    <div style={{ fontSize: 20, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em" }}>Approval Copy</div>
                    <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>Shahjalal University of Science & Technology</div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
                    {[
                      ["Event Title", selectedReq.title],
                      ["Venue", selectedReq.spotName],
                      ["Date", selectedReq.endDate ? `${selectedReq.date} to ${selectedReq.endDate}` : selectedReq.date],
                      ["Session", selectedReq.session],
                      ["Organizer", selectedReq.organizer],
                      ["Time", `${selectedReq.startTime || "—"} - ${selectedReq.endTime || "—"}`],
                    ].map(([l, v]) => (
                      <div key={l} style={{ borderBottom: "1px solid #eee", paddingBottom: 8 }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: "#888", textTransform: "uppercase", marginBottom: 2 }}>{l}</div>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{v}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20, borderTop: "1px solid #eee", paddingTop: 20, marginBottom: 20 }}>
                    {[
                      { title: "Applicant", name: selectedReq.applicant?.name, sub: selectedReq.applicant?.dept, note: selectedReq.applicant?.designation },
                      { title: "Recommender", name: selectedReq.recommender?.name, sub: selectedReq.recommender?.dept, note: selectedReq.recommender?.post },
                      { title: "Approver", name: localStorage.getItem("adminName") || "Admin", sub: "", note: localStorage.getItem("adminDesignation") || "" },
                    ].map(({ title, name, sub, note }) => (
                      <div key={title}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: "#888", textTransform: "uppercase", marginBottom: 8 }}>{title}</div>
                        <div style={{ fontSize: 13, fontWeight: 700 }}>{name || "—"}</div>
                        {sub && <div style={{ fontSize: 11, color: "#555" }}>{sub}</div>}
                        {note && <div style={{ fontSize: 11, color: "#888", fontStyle: "italic" }}>{note}</div>}
                        <div style={{ marginTop: 12, height: 40, border: "1px dashed #ddd", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <span style={{ fontSize: 9, color: "#ccc" }}>Signature</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ fontSize: 11, color: "#555" }}>
                    <div style={{ fontWeight: 700, marginBottom: 6 }}>Terms & Conditions</div>
                    <ol style={{ paddingLeft: 18, lineHeight: 2 }}>
                      <li>The venue must be left clean after the event.</li>
                      <li>Any damage to university property is the organizer's responsibility.</li>
                      <li>Sound levels must remain within acceptable limits.</li>
                      <li>Event must end within the approved timeframe.</li>
                    </ol>
                  </div>
                </div>
              </div>
              <div style={{ padding: "14px 24px", background: "var(--bg3)", borderRadius: "0 0 24px 24px", display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <button className="btn-ghost" style={{ padding: "9px 18px", borderRadius: 10, fontSize: 12, fontWeight: 600 }} onClick={() => setPreviewOpen(false)}>Cancel</button>
                <button className="btn-primary" disabled={actionLoading} style={{ padding: "9px 24px", borderRadius: 10, fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}
                  onClick={() => handleApprove(selectedReq)}>
                  {actionLoading ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />} Confirm & Approve
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Reject Modal */}
      {rejectOpen && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && (setRejectOpen(false), setSelectedReq(null))}>
          <div className="modal-box">
            <div className="flex items-center gap-3 mb-6">
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(239,68,68,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <AlertTriangle size={18} color="var(--red)" />
              </div>
              <div>
                <h3 style={{ fontWeight: 700, fontSize: 16, color: "var(--text)" }}>Reject Booking</h3>
                <p style={{ fontSize: 12, color: "var(--text3)" }}>{selectedReq?.id}</p>
              </div>
            </div>
            <textarea className="input-field" style={{ resize: "vertical", minHeight: 120, marginBottom: 16 }} placeholder="Provide a reason for rejection..."
              value={rejectReason} onChange={e => setRejectReason(e.target.value)} />
            <div className="flex gap-3">
              <button className="btn-ghost" style={{ flex: 1, padding: "11px", borderRadius: 12, fontWeight: 600 }}
                onClick={() => { setRejectOpen(false); setSelectedReq(null); setRejectReason(""); }}>Cancel</button>
              <button disabled={!rejectReason || actionLoading}
                style={{ flex: 1, padding: "11px", borderRadius: 12, fontWeight: 600, background: "var(--red)", border: "none", color: "white", cursor: rejectReason ? "pointer" : "not-allowed", opacity: rejectReason ? 1 : 0.5, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
                onClick={handleReject}>
                {actionLoading ? <Loader2 size={14} className="animate-spin" /> : null} Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ── BOOKING HISTORY ───────────────────────────────────────────────────────────
const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterSpot, setFilterSpot] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [pdfUrl, setPdfUrl] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    adminApi().get("/bookings")
      .then(res => {
        const normalized = (res.data || []).map(b => ({
          id: `REQ-${String(b.booking_id).padStart(3, "0")}`,
          title: b.event_title || b.title || "(No Title)",
          spotName: b.spot_name || b.name || "Unknown",
          organizer: b.full_name || "Unknown",
          date: b.start_date?.split("T")[0] || "",
          endDate: b.end_date?.split("T")[0] || null,
          status: { approved: "Approved", rejected: "Rejected", cancelled: "Cancelled", pending: "Pending" }[(b.booking_status || "pending").toLowerCase()] || "Pending",
        }));
        setBookings(normalized);
      })
      .catch(() => setToast({ msg: "Failed to load history", type: "error" }))
      .finally(() => setLoading(false));
  }, []);

  const spots = ["All", ...new Set(bookings.map(b => b.spotName))];
  const statuses = ["All", "Approved", "Rejected", "Cancelled", "Pending"];

  const filtered = bookings.filter(b => {
    const d = new Date(b.date);
    return (filterStatus === "All" || b.status === filterStatus)
      && (filterSpot === "All" || b.spotName === filterSpot)
      && (!startDate || d >= new Date(startDate))
      && (!endDate || d <= new Date(endDate));
  });

  const stats = {
    total: filtered.length,
    approved: filtered.filter(b => b.status === "Approved").length,
    rejected: filtered.filter(b => b.status === "Rejected").length,
    cancelled: filtered.filter(b => b.status === "Cancelled").length,
    pending: filtered.filter(b => b.status === "Pending").length,
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18); doc.setTextColor(0, 82, 204);
    doc.text("Booking History Report", 14, 20);
    doc.setFontSize(9); doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 27);
    doc.setFontSize(9); doc.setTextColor(50);
    doc.text(`Filters — Spot: ${filterSpot} | Status: ${filterStatus} | Range: ${startDate || "Any"} to ${endDate || "Any"}`, 14, 34);

    autoTable(doc, {
      head: [["ID", "Title", "Organizer", "Spot", "Date", "Status"]],
      body: filtered.map(b => [b.id, b.title, b.organizer, b.spotName, b.date, b.status]),
      startY: 42,
      theme: "grid",
      headStyles: { fillColor: [0, 82, 204], fontSize: 9 },
      bodyStyles: { fontSize: 8 },
    });

    setPdfUrl(doc.output("bloburl"));
  };

  const badgeStyle = (status) => {
    const styles = {
      Approved: { background: "rgba(34,197,94,0.12)", color: "var(--green)", border: "1px solid rgba(34,197,94,0.2)" },
      Rejected: { background: "rgba(239,68,68,0.12)", color: "var(--red)", border: "1px solid rgba(239,68,68,0.2)" },
      Cancelled: { background: "rgba(249,115,22,0.12)", color: "var(--orange)", border: "1px solid rgba(249,115,22,0.2)" },
      Pending: { background: "rgba(234,179,8,0.12)", color: "var(--yellow)", border: "1px solid rgba(234,179,8,0.2)" },
    };
    return styles[status] || {};
  };

  return (
    <div>
      {toast && <Toast message={toast.msg} type={toast.type} onDone={() => setToast(null)} />}
      <div className="section-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="section-title">Booking History</h1>
            <p className="section-subtitle">Filter, view, and export all booking records</p>
          </div>
          <button className="btn-primary" style={{ padding: "10px 20px", borderRadius: 12, fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }} onClick={exportPDF}>
            <Download size={15} /> Export PDF
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="glass" style={{ borderRadius: 16, padding: 20, marginBottom: 20 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "flex-end" }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Field</div>
            <div className="flex gap-1">
              {spots.map(s => (
                <button key={s} onClick={() => setFilterSpot(s)}
                  style={{
                    padding: "6px 12px", borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: "pointer", transition: "all 0.15s",
                    background: filterSpot === s ? "var(--accent)" : "var(--bg2)", color: filterSpot === s ? "white" : "var(--text2)",
                    border: `1px solid ${filterSpot === s ? "var(--accent)" : "var(--border)"}`
                  }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Status</div>
            <div className="flex gap-1">
              {statuses.map(s => (
                <button key={s} onClick={() => setFilterStatus(s)}
                  style={{
                    padding: "6px 12px", borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: "pointer", transition: "all 0.15s",
                    background: filterStatus === s ? "var(--accent)" : "var(--bg2)", color: filterStatus === s ? "white" : "var(--text2)",
                    border: `1px solid ${filterStatus === s ? "var(--accent)" : "var(--border)"}`
                  }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2" style={{ marginLeft: "auto" }}>
            <input type="date" className="input-field" style={{ width: "auto" }} value={startDate} onChange={e => setStartDate(e.target.value)} />
            <span style={{ color: "var(--text3)", fontSize: 12 }}>→</span>
            <input type="date" className="input-field" style={{ width: "auto" }} value={endDate} onChange={e => setEndDate(e.target.value)} />
            {(filterStatus !== "All" || filterSpot !== "All" || startDate || endDate) && (
              <button className="btn-ghost" style={{ padding: "7px 12px", borderRadius: 8, fontSize: 11, display: "flex", alignItems: "center", gap: 5 }}
                onClick={() => { setFilterStatus("All"); setFilterSpot("All"); setStartDate(""); setEndDate(""); }}>
                <RotateCcw size={11} /> Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        {[
          { label: "Total", value: stats.total, color: "var(--text2)" },
          { label: "Approved", value: stats.approved, color: "var(--green)" },
          { label: "Rejected", value: stats.rejected, color: "var(--red)" },
          { label: "Cancelled", value: stats.cancelled, color: "var(--orange)" },
          { label: "Pending", value: stats.pending, color: "var(--yellow)" },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: "8px 16px", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text3)", fontFamily: "JetBrains Mono", textTransform: "uppercase" }}>{label}</span>
            <span style={{ fontSize: 15, fontWeight: 800, color, fontFamily: "JetBrains Mono" }}>{value}</span>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="glass" style={{ borderRadius: 18, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "var(--bg2)", borderBottom: "1px solid var(--border)" }}>
              {["ID & Title", "Organizer", "Spot", "Date", "Status"].map(h => (
                <th key={h} style={{ padding: "14px 18px", textAlign: "left", fontSize: 10, fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.1em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ textAlign: "center", padding: "50px 0", color: "var(--text3)" }}>Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: "center", padding: "50px 0", color: "var(--text3)" }}>No records found</td></tr>
            ) : filtered.map(b => (
              <tr key={b.id} className="table-row" style={{ borderBottom: "1px solid var(--border)" }}>
                <td style={{ padding: "12px 18px" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "var(--accent2)", fontFamily: "JetBrains Mono", marginBottom: 3 }}>{b.id}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{b.title}</div>
                </td>
                <td style={{ padding: "12px 18px", fontSize: 13, color: "var(--text2)" }}>{b.organizer}</td>
                <td style={{ padding: "12px 18px" }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "var(--accent)", background: "rgba(79,110,247,0.1)", padding: "3px 10px", borderRadius: 6 }}>{b.spotName}</span>
                </td>
                <td style={{ padding: "12px 18px", fontSize: 12, fontWeight: 600, color: "var(--text3)", fontFamily: "JetBrains Mono" }}>{b.date}</td>
                <td style={{ padding: "12px 18px" }}>
                  <span className="badge" style={badgeStyle(b.status)}>{b.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PDF Modal */}
      {pdfUrl && (
        <div className="modal-overlay">
          <div style={{ background: "var(--bg2)", borderRadius: 24, width: "100%", maxWidth: 900, height: "90vh", display: "flex", flexDirection: "column", border: "1px solid var(--border2)" }}>
            <div style={{ padding: "16px 24px", background: "var(--bg3)", borderRadius: "24px 24px 0 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: "var(--text)" }}>Report Preview</div>
                <div style={{ fontSize: 11, color: "var(--text3)" }}>Verify before downloading</div>
              </div>
              <button style={{ background: "none", border: "none", color: "var(--text2)", cursor: "pointer" }} onClick={() => setPdfUrl(null)}><X size={18} /></button>
            </div>
            <div style={{ flex: 1, padding: 20, background: "var(--bg)" }}>
              <iframe src={pdfUrl} style={{ width: "100%", height: "100%", borderRadius: 12, border: "none" }} title="PDF" />
            </div>
            <div style={{ padding: "16px 24px", background: "var(--bg3)", borderRadius: "0 0 24px 24px", display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button className="btn-ghost" style={{ padding: "9px 18px", borderRadius: 10, fontSize: 12, fontWeight: 600 }} onClick={() => setPdfUrl(null)}>Cancel</button>
              <a href={pdfUrl} download={`History_${new Date().toISOString().split("T")[0]}.pdf`} onClick={() => setPdfUrl(null)}
                className="btn-primary" style={{ padding: "9px 22px", borderRadius: 10, fontSize: 12, fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
                <Download size={14} /> Download
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ── BLOG MODERATION ───────────────────────────────────────────────────────────
const BlogModeration = () => {
  const [activeTab, setActiveTab] = useState("blogs");
  const [blogStatus, setBlogStatus] = useState("pending");
  const [pendingBlogs, setPendingBlogs] = useState([]);
  const [publishedBlogs, setPublishedBlogs] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [toast, setToast] = useState(null);

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const [pRes, pubRes] = await Promise.all([
        adminApi().get("/blogs?status=pending"),
        adminApi().get("/blogs?status=published"),
      ]);
      const normalize = (arr) => (arr || []).map(b => ({
        id: b.blog_id, title: b.blog_title, author: b.author || "Unknown",
        date: b.submitted_at ? new Date(b.submitted_at).toLocaleDateString("en-GB") : "",
        image: b.cover_image ? `http://localhost:5000/uploads/${b.cover_image}` : null,
        spot: b.spot_name || "", eventdate: b.event_date?.split("T")[0] || "",
        content: b.story_details || b.summary || "",
      }));
      setPendingBlogs(normalize(pRes.data));
      setPublishedBlogs(normalize(pubRes.data));
    } catch { } finally { setLoading(false); }
  }, []);

  const fetchFeedbacks = useCallback(async () => {
    try {
      const res = await adminApi().get("/feedbacks");
      setFeedbacks((res.data || []).map(fb => ({
        id: fb.event_id, user: fb.user_name || "Anonymous",
        message: fb.feedback || "", date: fb.event_date?.split("T")[0] || "",
        spot: fb.spot_name || "", title: fb.event_title || "",
      })));
    } catch { }
  }, []);

  useEffect(() => { fetchBlogs(); fetchFeedbacks(); }, [fetchBlogs, fetchFeedbacks]);

  const handlePublish = async (id) => {
    try { await adminApi().post(`/blogs/${id}/publish`); await fetchBlogs(); setSelectedBlog(null); setToast({ msg: "Blog published!", type: "success" }); }
    catch { setToast({ msg: "Publish failed", type: "error" }); }
  };
  const handleReject = async (id) => {
    try { await adminApi().post(`/blogs/${id}/reject`); await fetchBlogs(); setToast({ msg: "Blog rejected", type: "success" }); }
    catch { setToast({ msg: "Reject failed", type: "error" }); }
  };
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this blog permanently?")) return;
    try { await adminApi().delete(`/blogs/${id}`); await fetchBlogs(); setToast({ msg: "Blog deleted", type: "success" }); }
    catch { setToast({ msg: "Delete failed", type: "error" }); }
  };

  const currentBlogs = blogStatus === "pending" ? pendingBlogs : publishedBlogs;

  return (
    <div>
      {toast && <Toast message={toast.msg} type={toast.type} onDone={() => setToast(null)} />}
      <div className="section-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="section-title">Blog Moderation</h1>
            <p className="section-subtitle">Review posts and manage community content</p>
          </div>
          <div className="flex gap-2" style={{ background: "var(--surface)", padding: "4px", borderRadius: 12, border: "1px solid var(--border)" }}>
            <button onClick={() => setActiveTab("blogs")}
              style={{
                padding: "8px 18px", borderRadius: 9, fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", gap: 6,
                background: activeTab === "blogs" ? "var(--accent)" : "transparent", color: activeTab === "blogs" ? "white" : "var(--text2)", border: "none"
              }}>
              <FileText size={13} /> Blogs
            </button>
            <button onClick={() => setActiveTab("feedbacks")}
              style={{
                padding: "8px 18px", borderRadius: 9, fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", gap: 6,
                background: activeTab === "feedbacks" ? "var(--accent)" : "transparent", color: activeTab === "feedbacks" ? "white" : "var(--text2)", border: "none"
              }}>
              <MessageSquare size={13} /> Feedbacks
            </button>
          </div>
        </div>
      </div>

      {activeTab === "blogs" && (
        <div className="flex gap-2 mb-6">
          {["pending", "published"].map(s => (
            <button key={s} onClick={() => setBlogStatus(s)}
              style={{
                padding: "7px 18px", borderRadius: 20, fontSize: 11, fontWeight: 700, cursor: "pointer", textTransform: "capitalize", letterSpacing: "0.05em",
                background: blogStatus === s ? (s === "pending" ? "rgba(234,179,8,0.15)" : "rgba(34,197,94,0.15)") : "var(--surface)",
                color: blogStatus === s ? (s === "pending" ? "var(--yellow)" : "var(--green)") : "var(--text3)",
                border: `1px solid ${blogStatus === s ? (s === "pending" ? "rgba(234,179,8,0.3)" : "rgba(34,197,94,0.3)") : "var(--border)"}`
              }}>
              {s === "pending" ? "Pending" : "Published"} ({s === "pending" ? pendingBlogs.length : publishedBlogs.length})
            </button>
          ))}
        </div>
      )}

      {loading && activeTab === "blogs" ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text3)" }}>Loading blogs...</div>
      ) : activeTab === "blogs" ? (
        currentBlogs.length === 0 ? (
          <div className="glass" style={{ borderRadius: 20, padding: 60, textAlign: "center" }}>
            <FileText size={40} color="var(--text3)" style={{ margin: "0 auto 12px", opacity: 0.4 }} />
            <div style={{ color: "var(--text3)", fontSize: 14 }}>No {blogStatus} blogs</div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 18 }}>
            {currentBlogs.map(blog => (
              <div key={blog.id} className="glass" style={{ borderRadius: 20, overflow: "hidden", transition: "all 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "var(--border2)"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}>
                <div style={{ height: 160, background: "var(--bg3)", overflow: "hidden" }}>
                  {blog.image ? (
                    <img src={blog.image} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt={blog.title} />
                  ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <FileText size={32} color="var(--text3)" style={{ opacity: 0.3 }} />
                    </div>
                  )}
                </div>
                <div style={{ padding: 20 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text)", marginBottom: 10, lineHeight: 1.4 }}>{blog.title}</div>
                  <div style={{ fontSize: 11, color: "var(--text3)", display: "flex", flexDirection: "column", gap: 4, marginBottom: 16 }}>
                    <span>By <span style={{ color: "var(--accent2)" }}>{blog.author}</span></span>
                    {blog.spot && <span>At <span style={{ color: "var(--accent2)" }}>{blog.spot}</span></span>}
                    {blog.eventdate && <span>Date: <span style={{ fontFamily: "JetBrains Mono", color: "var(--text2)" }}>{blog.eventdate}</span></span>}
                  </div>
                  <div className="flex gap-2 flex-wrap" style={{ borderTop: "1px solid var(--border)", paddingTop: 14 }}>
                    <button onClick={() => setSelectedBlog(blog)}
                      style={{
                        padding: "6px 12px", borderRadius: 8, fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", gap: 5, cursor: "pointer",
                        background: "var(--surface2)", border: "1px solid var(--border2)", color: "var(--text2)"
                      }}>
                      <Eye size={12} /> View
                    </button>
                    {blogStatus === "pending" ? (
                      <>
                        <button onClick={() => handlePublish(blog.id)}
                          style={{
                            padding: "6px 12px", borderRadius: 8, fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", gap: 5, cursor: "pointer",
                            background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", color: "var(--green)"
                          }}>
                          <CheckCircle size={12} /> Publish
                        </button>
                        <button onClick={() => handleReject(blog.id)}
                          style={{
                            padding: "6px 12px", borderRadius: 8, fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", gap: 5, cursor: "pointer",
                            background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "var(--red)"
                          }}>
                          <XCircle size={12} /> Reject
                        </button>
                      </>
                    ) : (
                      <button onClick={() => handleDelete(blog.id)}
                        style={{
                          padding: "6px 12px", borderRadius: 8, fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", gap: 5, cursor: "pointer",
                          background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "var(--red)"
                        }}>
                        <Trash2 size={12} /> Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* Feedbacks */
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
          {feedbacks.map(fb => (
            <div key={fb.id} className="glass" style={{ borderRadius: 16, padding: 20, borderLeft: "3px solid var(--accent)" }}>
              <div className="flex items-center gap-3 mb-4">
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(79,110,247,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontWeight: 800, fontSize: 14, color: "var(--accent2)" }}>{fb.user.charAt(0)}</span>
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13, color: "var(--text)" }}>{fb.user}</div>
                  <div style={{ fontSize: 11, color: "var(--text3)", fontFamily: "JetBrains Mono" }}>{fb.date}</div>
                </div>
              </div>
              <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 12, display: "flex", flexDirection: "column", gap: 3 }}>
                {fb.title && <span>Event: <span style={{ color: "var(--accent2)" }}>{fb.title}</span></span>}
                {fb.spot && <span>Spot: <span style={{ color: "var(--accent2)" }}>{fb.spot}</span></span>}
              </div>
              <div style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.6, fontStyle: "italic" }}>"{fb.message}"</div>
            </div>
          ))}
          {feedbacks.length === 0 && (
            <div className="glass" style={{ gridColumn: "1/-1", borderRadius: 20, padding: 60, textAlign: "center" }}>
              <MessageSquare size={40} color="var(--text3)" style={{ margin: "0 auto 12px", opacity: 0.3 }} />
              <div style={{ color: "var(--text3)" }}>No feedbacks yet</div>
            </div>
          )}
        </div>
      )}

      {/* Blog Detail Modal */}
      {selectedBlog && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setSelectedBlog(null)}>
          <div style={{ background: "var(--bg2)", borderRadius: 24, width: "100%", maxWidth: 600, maxHeight: "90vh", overflow: "hidden", display: "flex", flexDirection: "column", border: "1px solid var(--border2)" }}>
            {selectedBlog.image && (
              <div style={{ height: 220, overflow: "hidden" }}>
                <img src={selectedBlog.image} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" />
              </div>
            )}
            <div style={{ padding: 28, overflowY: "auto" }}>
              <div className="flex items-center justify-between mb-4">
                <h3 style={{ fontWeight: 700, fontSize: 18, color: "var(--text)", flex: 1 }}>{selectedBlog.title}</h3>
                <button style={{ background: "none", border: "none", color: "var(--text3)", cursor: "pointer", marginLeft: 12 }} onClick={() => setSelectedBlog(null)}><X size={18} /></button>
              </div>
              <div style={{ fontSize: 12, color: "var(--accent2)", marginBottom: 16 }}>By {selectedBlog.author} · {selectedBlog.date}</div>
              <div style={{ background: "var(--bg)", borderRadius: 12, padding: 16, marginBottom: 20, maxHeight: 200, overflowY: "auto", border: "1px solid var(--border)" }}>
                <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{selectedBlog.content}</p>
              </div>
              <div className="flex gap-3">
                {!publishedBlogs.find(b => b.id === selectedBlog.id) && (
                  <button onClick={() => handlePublish(selectedBlog.id)}
                    style={{ flex: 1, padding: "11px", borderRadius: 12, fontWeight: 600, fontSize: 13, background: "var(--green)", border: "none", color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                    <CheckCircle size={15} /> Publish
                  </button>
                )}
                <button className="btn-ghost" style={{ flex: 1, padding: "11px", borderRadius: 12, fontWeight: 600 }} onClick={() => setSelectedBlog(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};