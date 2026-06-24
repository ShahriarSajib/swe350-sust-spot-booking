import axios from "axios";
import { Calendar, ChevronRight, X, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE from "../config";

const UserNotifications = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [selectedReason, setSelectedReason] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const handleClose = () => {
    onClose();
  };

  // ✅ FETCH NOTIFICATIONS
  useEffect(() => {
    if (!isOpen) return;

    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/notifications`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setNotifications(res.data);
      } catch (err) {
        console.error("Fetch notifications error:", err);
      }
    };

    fetchNotifications();
  }, [isOpen]);

  // ✅ MARK AS READ
  const markAsRead = async (id) => {
    try {
      await axios.put(
        `${API_BASE}/api/notifications/${id}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      setNotifications((prev) =>
        prev.map((n) => (n.notification_id === id ? { ...n, is_read: 1 } : n)),
      );
    } catch (err) {
      console.error("Mark read error:", err);
    }
  };

  // ✅ MARK ALL AS READ
  const markAllAsRead = async () => {
    try {
      await axios.put(
        `${API_BASE}/api/notifications/read-all`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: 1 })));
    } catch (err) {
      console.error("Mark all read error:", err);
    }
  };

  // ❌ CLOSE IF NOT OPEN
  if (!isOpen) return null;

  // 🔹 HELPER: MAP TYPE FROM TITLE
  const getType = (title) => {
    if (title.includes("Rejected")) return "reject";
    if (title.includes("Approved")) return "booking";
    if (title.includes("Recommended")) return "booking";
    if (title.includes("Submitted")) return "booking";
    return "feedback";
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="relative bg-white w-full max-w-2xl max-h-[80vh] rounded-3xl shadow-2xl flex flex-col">
        {/* HEADER */}
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">My Notifications</h2>
          <button onClick={handleClose}>
            <X size={24} />
          </button>
        </div>

        {/* LIST */}
        <div className="overflow-y-auto p-4 space-y-3 bg-gray-50">
          {notifications.length === 0 && (
            <p className="text-center text-gray-400">No notifications</p>
          )}

          {notifications.map((notif) => {
            const type = getType(notif.title);

            return (
              <div
                key={notif.notification_id}
                onClick={() => markAsRead(notif.notification_id)}
                className={`p-4 rounded-2xl flex gap-4 cursor-pointer ${
                  notif.is_read ? "bg-gray-100" : "bg-white shadow"
                }`}
              >
                {/* ICON */}
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-xl ${
                    type === "reject"
                      ? "bg-red-50 text-red-600"
                      : "bg-sky-50 text-sky-600"
                  }`}
                >
                  {type === "reject" ? (
                    <XCircle size={20} />
                  ) : (
                    <Calendar size={20} />
                  )}
                </div>

                {/* CONTENT */}
                <div className="flex-1">
                  <p
                    className={`text-sm ${notif.is_read ? "text-gray-600" : "font-semibold"}`}
                  >
                    {notif.message}
                  </p>

                  <span className="text-xs text-gray-400">
                    {new Date(notif.created_at).toLocaleString()}
                  </span>

                  {/* REJECTION REASON BUTTON */}
                  {type === "reject" && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedReason(notif.message);
                      }}
                      className="mt-2 text-xs text-red-500 flex items-center gap-1"
                    >
                      See Reason <ChevronRight size={12} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* FOOTER */}
        <div className="p-4 text-center border-t">
          <button
            onClick={markAllAsRead}
            className="text-xs font-bold text-gray-500 hover:text-black"
          >
            Mark all as read
          </button>
        </div>

        {/* REASON MODAL */}
        {selectedReason && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50">
            <div className="bg-white p-6 rounded-xl max-w-sm">
              <h3 className="font-bold mb-2">Rejection Reason</h3>
              <p className="text-sm">{selectedReason}</p>
              <button
                onClick={() => setSelectedReason(null)}
                className="mt-4 px-4 py-2 bg-black text-white rounded"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserNotifications;
