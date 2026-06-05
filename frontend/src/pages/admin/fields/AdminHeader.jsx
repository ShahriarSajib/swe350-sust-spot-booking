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
    <header className="bg-[var(--header-bg)] h-16 flex items-center justify-between px-7 sticky top-0 z-50 shadow-[0_2px_12px_rgba(14,165,233,0.3)]">
      {/* Brand */}
      <div className="flex items-center gap-3 no-underline">
        <div className="w-[38px] h-[38px] rounded-[10px] bg-white/20 flex items-center justify-center">
          <img src={sustLogo} alt="SUST" className="w-8 h-8 object-contain" />
        </div>
        <span className="text-white font-bold text-lg tracking-[-0.01em]">
          SUST Spot Booking
        </span>
      </div>

      {/* Right: Notifications + Logout */}
      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <button
          onClick={onBellClick}
          className="relative bg-white/15 border-none rounded-[10px] px-4 py-2 cursor-pointer flex items-center gap-2 text-white font-bold text-sm transition-colors duration-200 hover:bg-white/25"
        >
          <Bell size={16} />
          <span>Notifications</span>
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 bg-[#ef4444] text-white rounded-full w-[18px] h-[18px] text-[10px] font-extrabold flex items-center justify-center font-mono">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="bg-white text-[#0284c7] border-none rounded-[10px] px-5 py-2 cursor-pointer font-bold text-sm transition-all duration-200 shadow-[0_2px_8px_rgba(0,0,0,0.1)] hover:-translate-y-0.5"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
