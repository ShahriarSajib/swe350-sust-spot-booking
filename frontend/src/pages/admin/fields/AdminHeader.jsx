import { Bell } from "lucide-react";
import sustLogo from '../../../assets/sust_logo_2.png';

/**
 * AdminHeader
 * Props:
 *   unreadCount      – number of unread notifications
 *   onBellClick      – open notifications panel
 */
const AdminHeader = ({ unreadCount, onBellClick }) => {
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/login";
  };

  return (
    <header
      style={{
        background: "var(--header-bg)",
        height: 64,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 28px",
        position: "sticky",
        top: 0,
        zIndex: 50,
        boxShadow: "0 2px 12px rgba(14,165,233,0.3)",
      }}
    >
      {/* Brand */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", textDecoration: "none" }}>
        <div
          style={{
            width: "38px",
            height: "38px",
            borderRadius: "10px",
            background: "rgba(255,255,255,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img src={sustLogo} alt="SUST" style={{ width: "32px", height: "32px", objectFit: "contain" }} />
        </div>
        <span style={{ color: "white", fontWeight: 700, fontSize: "18px", letterSpacing: "-0.01em" }}>
          SUST Spot Booking
        </span>
      </div>

      {/* Right: Notifications + Logout */}
      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <button
          onClick={onBellClick}
          style={{
            position: "relative",
            background: "rgba(255,255,255,0.15)",
            border: "none",
            borderRadius: 10,
            padding: "8px 16px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 8,
            color: "white",
            fontWeight: 700,
            fontSize: 14,
            transition: "background 0.2s",
          }}
          onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.25)")}
          onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.15)")}
        >
          <Bell size={16} />
          <span>Notifications</span>
          {unreadCount > 0 && (
            <span
              style={{
                position: "absolute", top: 4, right: 4,
                background: "#ef4444", color: "white",
                borderRadius: "50%", width: 18, height: 18,
                fontSize: 10, fontWeight: 800,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "JetBrains Mono",
              }}
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          style={{
            background: "white",
            color: "#0284c7",
            border: "none",
            borderRadius: 10,
            padding: "8px 20px",
            cursor: "pointer",
            fontWeight: 700,
            fontSize: 14,
            transition: "all 0.2s",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
          onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-1px)")}
          onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
