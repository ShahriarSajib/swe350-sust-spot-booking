import { useState, useCallback, useEffect } from "react";
import { Bell } from "lucide-react";
import {
  LayoutDashboard, MapPin, ClipboardCheck, History, FileText, Layers,
} from "lucide-react";

import "./admin/fields/FieldsAdminDashboard.css";
import { adminApi } from "./admin/fields/adminApi";
import NotificationsModal from "./admin/fields/NotificationsModal";
import DashboardOverview from "./admin/fields/DashboardOverview";
import SpotManagement from "./admin/fields/SpotManagement";
import BookingApprovals from "./admin/fields/BookingApprovals";
import BookingHistory from "./admin/fields/BookingHistory";
import BlogModeration from "./admin/fields/BlogModeration";

export default function FieldsAdminDashboard() {
  const [activeSection, setActiveSection] = useState("overview");
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const navItems = [
    { id: "overview",   icon: LayoutDashboard, label: "Overview"          },
    { id: "spots",      icon: MapPin,           label: "Spot Management"   },
    { id: "approvals",  icon: ClipboardCheck,   label: "Booking Approvals" },
    { id: "history",    icon: History,          label: "Booking History"   },
    { id: "blogs",      icon: FileText,         label: "Blog Moderation"   },
  ];

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
            {activeSection === "overview"  && <DashboardOverview setActiveSection={setActiveSection} />}
            {activeSection === "spots"     && <SpotManagement />}
            {activeSection === "approvals" && <BookingApprovals />}
            {activeSection === "history"   && <BookingHistory />}
            {activeSection === "blogs"     && <BlogModeration />}
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