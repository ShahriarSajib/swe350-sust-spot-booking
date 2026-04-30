import {
  Bell, X, FileText, MessageSquare, CheckCircle2, AlertTriangle,
  Calendar as CalendarIcon, XCircle, ChevronRight,
} from "lucide-react";

const NotificationsModal = ({ notifications, onClose, onMarkAllRead, onRefresh, setActiveSection }) => {
  const getTypeStyle = (type) => {
    switch (type) {
      case "new_booking":  return { icon: CalendarIcon,  color: "#0284c7", bg: "#e0f2fe" };
      case "cancellation": return { icon: XCircle,       color: "#dc2626", bg: "#fee2e2" };
      case "feedback":     return { icon: MessageSquare, color: "#7c3aed", bg: "#f3e8ff" };
      case "blog_request": return { icon: FileText,      color: "#d97706", bg: "#fef3c7" };
      case "approval":     return { icon: CheckCircle2,  color: "#16a34a", bg: "#dcfce7" };
      case "rejection":    return { icon: AlertTriangle, color: "#dc2626", bg: "#fee2e2" };
      default:             return { icon: Bell,          color: "#64748b", bg: "#f1f5f9" };
    }
  };

  const relTime = (ts) => {
    if (!ts) return "";
    const diff = (Date.now() - new Date(ts).getTime()) / 1000;
    if (diff < 60)     return "Just now";
    if (diff < 3600)   return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400)  return `${Math.floor(diff / 3600)} hour${Math.floor(diff / 3600) > 1 ? "s" : ""} ago`;
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
                    if (notif.type === "new_booking") { setActiveSection("approvals"); onClose(); }
                    if (notif.type === "blog_request") { setActiveSection("blogs"); onClose(); }
                    if (notif.type === "feedback")    { setActiveSection("blogs"); onClose(); }
                  }}
                >
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <Icon size={16} color={color} />
                  </div>

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

export default NotificationsModal;
