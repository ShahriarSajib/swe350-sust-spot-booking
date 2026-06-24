import axios from "axios";
import { Bell, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import sustLogo from "../../assets/sust.png";
import API_BASE from "../../config";

const Header = ({ onLogout, onOpenNotif, role }) => {
  const [unreadCount, setUnreadCount] = useState(0);
  // const navigate = useNavigate();

  // 🔹 Fetch unread count
  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem("token"); // adjust if needed

      const res = await axios.get(
        `${API_BASE}/api/notifications/unread-count`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setUnreadCount(res.data.count || 0);
    } catch (err) {
      console.error("Unread count error:", err);
    }
  };

  // 🔹 Load on mount + poll
  useEffect(() => {
    fetchUnreadCount();

    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 15000); // refresh every 15s

    return () => clearInterval(interval);
  }, []);
  return (
    <header
      style={{
        background: "#38bdf8",
        height: "64px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 28px",
        position: "sticky",
        top: 0,
        zIndex: 50, // Fixed: camelCase
        boxShadow: "0 2px 12px rgba(14,165,233,0.3)",
      }}
    >
      {/* Left Section: Logo & Brand */}
      <Link
        to="/"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          textDecoration: "none",
        }}
      >
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
          <img
            src={sustLogo}
            alt="SUST"
            style={{ width: "32px", height: "32px", objectFit: "contain" }}
          />
        </div>
        <span
          style={{
            color: "white",
            fontWeight: 700,
            fontSize: "18px",
            letterSpacing: "-0.01em",
          }}
        >
          SUST Spot Booking
        </span>
      </Link>

      {/* Right Section: Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        {/* <button
          onClick={
            () => navigate("/hello")
          }
          style={{
            background: "white",
            color: "#0284c7",
            border: "none",
            borderRadius: "10px",
            padding: "8px 20px",
            cursor: "pointer",
            fontWeight: 700,
            fontSize: "14px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          hello button
        </button> */}
        {/* Profile Link (Visible only for users) */}
        {role === "user" && (
          <Link
            to="/profile"
            className="hidden md:flex" // Hides text on mobile, keeps link logic
            style={{
              color: "white",
              fontSize: "14px",
              fontWeight: 600,
              alignItems: "center",
              gap: "6px",
              textDecoration: "none",
              padding: "8px 12px",
              borderRadius: "10px",
              background: "rgba(255,255,255,0.1)",
              transition: "0.2s",
            }}
          >
            <User size={18} />
            <span>Profile</span>
          </Link>
          
        )}

        {/* Notification Bell */}
        <button
          onClick={onOpenNotif}
          style={{
            position: "relative",
            background: "rgba(255,255,255,0.15)",
            border: "none",
            borderRadius: "10px",
            padding: "8px 16px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            color: "white",
            fontWeight: 700,
            fontSize: "14px",
          }}
        >
          <Bell size={18} />
          <span className="hidden sm:inline">Notifications</span>
          {unreadCount > 0 && (
            <span
              style={{
                position: "absolute",
                top: "-5px",
                right: "-5px",
                background: "#ef4444",
                color: "white",
                borderRadius: "50%",
                width: "20px",
                height: "20px",
                fontSize: "11px",
                fontWeight: 800,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
              }}
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>

        {/* Logout Button */}
        <button
          onClick={onLogout}
          style={{
            background: "white",
            color: "#0284c7",
            border: "none",
            borderRadius: "10px",
            padding: "8px 20px",
            cursor: "pointer",
            fontWeight: 700,
            fontSize: "14px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
