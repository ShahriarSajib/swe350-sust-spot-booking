import {
  BarChart2,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  FileText,
  History,
  Mail,
  MapPin,
  PenLine,
  Plus,
  Shield,
  Upload,
  User,
  XCircle,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { adminApi } from "./adminApi";
import ReserveSpotPanel from "./ReserveSpotPanel";
import Toast from "./Toast";

const DashboardOverview = ({ setActiveSection }) => {
  const [adminData, setAdminData] = useState({
    approver_name: "",
    approver_email: "",
    approver_designation: "",
    approver_signature: null,
  });
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [upcoming, setUpcoming] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [toast, setToast] = useState(null);
  const [showReserve, setShowReserve] = useState(false);
  const sigInputRef = useRef(null);

  useEffect(() => {
    const api = adminApi();
    api
      .get("/profile")
      .then((r) => {
        setAdminData(r.data);
        setEditForm(r.data);
      })
      .catch(() => {});
    api
      .get("/dashboard")
      .then((r) => {
        const s = r.data.stats || {};
        setStats({
          total: +s.total || 0,
          pending: +s.pending || 0,
          approved: +s.approved || 0,
          rejected: +s.rejected || 0,
        });
        setUpcoming(r.data.upcoming || []);
      })
      .catch(() => {});
  }, []);

  const saveProfile = async () => {
    try {
      await adminApi().put("/profile", editForm);
      setAdminData(editForm);
      setIsEditing(false);
      setToast({ msg: "Profile saved", type: "success" });
    } catch {
      setToast({ msg: "Save failed", type: "error" });
    }
  };

  const uploadSignature = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("signature", file);
    try {
      await adminApi().put("/profile/signature", fd);
      setAdminData((prev) => ({
        ...prev,
        approver_signature: URL.createObjectURL(file),
      }));
      setToast({ msg: "Signature updated", type: "success" });
    } catch {
      setToast({ msg: "Upload failed", type: "error" });
    }
  };

  const statCards = [
    {
      label: "Total Requests",
      value: stats.total,
      color: "#4f6ef7",
      icon: BarChart2,
    },
    {
      label: "Approved",
      value: stats.approved,
      color: "#22c55e",
      icon: CheckCircle2,
    },
    { label: "Pending", value: stats.pending, color: "#f97316", icon: Clock },
    {
      label: "Rejected",
      value: stats.rejected,
      color: "#ef4444",
      icon: XCircle,
    },
  ];

  return (
    <div>
      {toast && (
        <Toast
          message={toast.msg}
          type={toast.type}
          onDone={() => setToast(null)}
        />
      )}
      <div className="flex items-center justify-between px-8 py-6 bg-slate-50 rounded-xl">
        {/* Left Side */}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your system at a glance.
          </p>
        </div>

        {/* Right Button */}
        <button
          onClick={() => setShowReserve((v) => !v)}
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
      {showReserve && (
        <ReserveSpotPanel onClose={() => setShowReserve(false)} />
      )}

      <div
        style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: 24 }}
      >
        {/* LEFT: Profile */}
        <div>
          <div className="glass" style={{ borderRadius: 20, padding: 24 }}>
            <div className="flex items-center justify-between mb-5">
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "var(--text3)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                }}
              >
                Profile
              </span>
              <button
                className="btn-ghost"
                style={{
                  padding: "5px 10px",
                  borderRadius: 8,
                  fontSize: 11,
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                }}
                onClick={() => {
                  if (!isEditing) setEditForm(adminData);
                  setIsEditing(!isEditing);
                }}
              >
                <PenLine size={11} /> {isEditing ? "Cancel" : "Edit"}
              </button>
            </div>

            <div className="flex flex-col items-center text-center mb-6">
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: "rgba(79,110,247,0.15)",
                  border: "2px solid rgba(79,110,247,0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 12,
                }}
              >
                <User size={28} color="var(--accent2)" />
              </div>
              {isEditing ? (
                <div style={{ width: "100%" }} className="space-y-2">
                  <input
                    className="input-field"
                    value={editForm.approver_name || ""}
                    onChange={(e) =>
                      setEditForm((p) => ({
                        ...p,
                        approver_name: e.target.value,
                      }))
                    }
                    placeholder="Name"
                  />
                  <input
                    className="input-field"
                    value={editForm.approver_email || ""}
                    onChange={(e) =>
                      setEditForm((p) => ({
                        ...p,
                        approver_email: e.target.value,
                      }))
                    }
                    placeholder="Email"
                  />
                  <input
                    className="input-field"
                    value={editForm.approver_designation || ""}
                    onChange={(e) =>
                      setEditForm((p) => ({
                        ...p,
                        approver_designation: e.target.value,
                      }))
                    }
                    placeholder="Designation"
                  />
                  <button
                    className="btn-primary"
                    style={{
                      width: "100%",
                      padding: "9px",
                      borderRadius: 10,
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                    onClick={saveProfile}
                  >
                    Save Changes
                  </button>
                </div>
              ) : (
                <>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: 15,
                      color: "var(--text)",
                      marginBottom: 3,
                    }}
                  >
                    {adminData.approver_name || "—"}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text3)" }}>
                    {adminData.approver_designation || "Admin"}
                  </div>
                </>
              )}
            </div>

            <div
              style={{
                borderTop: "1px solid var(--border)",
                paddingTop: 16,
                display: "flex",
                flexDirection: "column",
                gap: 10,
              }}
            >
              <div className="flex items-center gap-2">
                <Mail size={13} color="var(--text3)" />
                <span style={{ fontSize: 12, color: "var(--text2)" }}>
                  {adminData.approver_email || "—"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Shield size={13} color="var(--text3)" />
                <span style={{ fontSize: 12, color: "var(--text2)" }}>
                  Super Admin
                </span>
              </div>
            </div>

            {/* Signature */}
            <div
              style={{
                marginTop: 20,
                borderTop: "1px solid var(--border)",
                paddingTop: 16,
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "var(--text3)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: 10,
                }}
              >
                Official Signature
              </div>
              <div
                style={{
                  width: "100%",
                  height: 80,
                  borderRadius: 10,
                  border: "1px dashed var(--border2)",
                  background: "var(--bg2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                {adminData.approver_signature ? (
                  <img
                    src={
                      adminData.approver_signature.startsWith("blob")
                        ? adminData.approver_signature
                        : `http://localhost:5000/uploads/${adminData.approver_signature}`
                    }
                    alt="Signature"
                    style={{
                      height: "100%",
                      width: "100%",
                      objectFit: "contain",
                      padding: 8,
                      filter: "invert(1)",
                    }}
                  />
                ) : (
                  <div style={{ color: "var(--text3)", fontSize: 11 }}>
                    No signature
                  </div>
                )}
              </div>
              <button
                className="btn-ghost"
                style={{
                  width: "100%",
                  marginTop: 8,
                  padding: "7px",
                  borderRadius: 8,
                  fontSize: 11,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 5,
                }}
                onClick={() => sigInputRef.current.click()}
              >
                <Upload size={12} /> Update Signature
              </button>
              <input
                type="file"
                hidden
                ref={sigInputRef}
                accept="image/*"
                onChange={uploadSignature}
              />
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Stats */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 14,
            }}
          >
            {statCards.map(({ label, value, color, icon: Icon }) => (
              <div key={label} className="stat-card">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 12,
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: `${color}15`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon size={16} color={color} />
                  </div>
                </div>
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 800,
                    color,
                    fontFamily: "JetBrains Mono",
                    marginBottom: 4,
                  }}
                >
                  {value}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--text3)",
                    fontWeight: 500,
                  }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Nav */}
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            {[
              {
                id: "spots",
                icon: MapPin,
                label: "Spot Management",
                desc: "Edit venues & settings",
                color: "#4f6ef7",
              },
              {
                id: "approvals",
                icon: ClipboardCheck,
                label: "Booking Approvals",
                desc: "Review pending requests",
                color: "#22c55e",
              },
              {
                id: "history",
                icon: History,
                label: "Booking History",
                desc: "View past records",
                color: "#f97316",
              },
              {
                id: "blogs",
                icon: FileText,
                label: "Blog Moderation",
                desc: "Manage community posts",
                color: "#a855f7",
              },
            ].map(({ id, icon: Icon, label, desc, color }) => (
              <button
                key={id}
                className="glass"
                style={{
                  borderRadius: 14,
                  padding: 18,
                  textAlign: "left",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                }}
                onClick={() => setActiveSection(id)}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = color + "50")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = "var(--border)")
                }
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: `${color}15`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon size={18} color={color} />
                </div>
                <div>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: 13,
                      color: "var(--text)",
                      marginBottom: 2,
                    }}
                  >
                    {label}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text3)" }}>
                    {desc}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Upcoming Events */}
          {upcoming.length > 0 && (
            <div className="glass" style={{ borderRadius: 16, padding: 20 }}>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "var(--text3)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: 14,
                }}
              >
                Upcoming Events
              </div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                {upcoming.map((ev) => (
                  <div key={ev.booking_id} className="flex items-center gap-3">
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "var(--accent)",
                        flexShrink: 0,
                      }}
                    />
                    <div>
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: "var(--text)",
                        }}
                      >
                        {ev.event_title}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--text3)" }}>
                        {ev.spot_name} · {ev.start_date?.split("T")[0]}
                      </div>
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

export default DashboardOverview;
