import {
  ClipboardCheck,
  FileText,
  History,
  LayoutDashboard,
  MapPin,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { adminApi } from "./admin/fields/adminApi";
import AdminHeader from "./admin/fields/AdminHeader";
import BlogModeration from "./admin/fields/BlogModeration";
import BookingApprovals from "./admin/fields/BookingApprovals";
import BookingHistory from "./admin/fields/BookingHistory";
import DashboardOverview from "./admin/fields/DashboardOverview";
import "./admin/fields/FieldsAdminDashboard.css";
import NotificationsModal from "./admin/fields/NotificationsModal";
import SpotManagement from "./admin/fields/SpotManagement";

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

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await adminApi().get("/notifications");
      const data = res.data || [];

      setNotifications(data);

      // fallback (if unread-count API fails)
      setUnreadCount(data.filter((n) => !n.is_read).length);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  }, []);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const res = await adminApi().get("/notifications/unread-count");
      setUnreadCount(res.data?.count || 0);
    } catch (err) {
      console.error("Unread count error", err);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();

    const interval = setInterval(() => {
      fetchNotifications();
      fetchUnreadCount();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchNotifications, fetchUnreadCount]);

  const markAllRead = async () => {
    try {
      await adminApi().put("/notifications/read-all");
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch {}
  };
  const markOneRead = async (id) => {
    try {
      await adminApi().put(`/notifications/${id}/read`);

      setNotifications((prev) =>
        prev.map((n) =>
          n.notification_id === id ? { ...n, is_read: true } : n,
        ),
      );

      fetchUnreadCount();
    } catch (err) {
      console.error("Mark read error", err);
    }
  };
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      {/* ── TOP HEADER ── */}
      <AdminHeader
        unreadCount={unreadCount}
        onBellClick={() => setShowNotifications(true)}
      />

      {/* ── BODY ── */}
      <div className="flex h-[calc(100vh-64px)]">
        {/* ── SIDEBAR ── */}
        <aside className="w-[220px] bg-[var(--bg2)] border-r border-[var(--border)] shrink-0 flex flex-col shadow-[2px_0_8px_rgba(0,0,0,0.04)]">
          <nav className="flex-1 py-4 px-3 flex flex-col gap-1">
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
        <main className="flex-1 overflow-y-auto bg-[var(--bg)]">
          <div className="p-8 fade-in" key={activeSection}>
            {activeSection === "overview" && (
              <DashboardOverview setActiveSection={setActiveSection} />
            )}
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
          onMarkOneRead={markOneRead}
          onRefresh={fetchNotifications}
          setActiveSection={setActiveSection}
        />
      )}
    </div>
  );
}
