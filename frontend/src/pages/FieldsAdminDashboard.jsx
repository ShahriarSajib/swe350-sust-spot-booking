import { useState, useCallback, useEffect } from "react";
import {
  LayoutDashboard, MapPin, ClipboardCheck, History, FileText,
} from "lucide-react";

import "./admin/fields/FieldsAdminDashboard.css";
import { adminApi } from "./admin/fields/adminApi";
import AdminHeader from "./admin/fields/AdminHeader";
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
      <AdminHeader
        unreadCount={unreadCount}
        onBellClick={() => setShowNotifications(true)}
      />

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