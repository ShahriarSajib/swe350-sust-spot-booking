import {
  AlertTriangle,
  ArrowUpDown,
  Calendar as CalendarIcon,
  Check,
  CheckCircle2,
  Clock,
  Eye,
  Loader2,
  MapPin,
  RotateCcw,
  User,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { adminApi } from "./adminApi";
import Toast from "./Toast";

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
      const res = await adminApi().get("/bookings");
      const rows = res.data || [];
      setPending(
        rows.map((b) => ({
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
          applicant: {
            name: b.full_name,
            dept: b.dept,
            designation: b.designation,
            contact: b.contact_number,
          },
          recommender: {
            name: b.recommender_name,
            email: b.recommender_email,
            post: b.recommender_post,
            dept: b.recommender_dept,
          },
        })),
      );
    } catch {
      setToast({ msg: "Failed to load pending bookings", type: "error" });
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPending();
  }, [fetchPending]);

  const handleApprove = async (req) => {
    setActionLoading(true);
    try {
      await adminApi().post(`/bookings/${req.booking_id}/approve`);
      setPending((p) => p.filter((r) => r.booking_id !== req.booking_id));
      setSelectedReq(null);
      setPreviewOpen(false);
      setToast({ msg: "Booking approved!", type: "success" });
    } catch {
      setToast({ msg: "Approve failed", type: "error" });
    }
    setActionLoading(false);
  };

  const handleReject = async () => {
    if (!selectedReq) return;
    setActionLoading(true);
    try {
      await adminApi().post(`/bookings/${selectedReq.booking_id}/reject`, {
        reason: rejectReason,
      });
      setPending((p) =>
        p.filter((r) => r.booking_id !== selectedReq.booking_id),
      );
      setRejectOpen(false);
      setSelectedReq(null);
      setRejectReason("");
      setToast({ msg: "Booking rejected", type: "success" });
    } catch {
      setToast({ msg: "Reject failed", type: "error" });
    }
    setActionLoading(false);
  };

  const spots = ["All", ...new Set(pending.map((r) => r.spotName))];

  const filtered = useMemo(() => {
    return pending
      .filter(
        (r) =>
          (filterSpot === "All" || r.spotName === filterSpot) &&
          (!filterDate || r.date === filterDate),
      )
      .sort((a, b) => {
        const tA = new Date(a.timestamp).getTime(),
          tB = new Date(b.timestamp).getTime();
        return sortOrder === "newest" ? tB - tA : tA - tB;
      });
  }, [pending, filterSpot, filterDate, sortOrder]);

  const fmtTime = (iso) => {
    const d = new Date(iso);
    let h = d.getHours();
    const m = d.getMinutes().toString().padStart(2, "0");
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${h}:${m} ${ampm}`;
  };

  return (
    <div>
      {toast && (
        <Toast
          message={toast.msg}
          type={toast.type}
          onDone={() => setToast(null)}
        />
      )}
      <div className="section-header">
        <h1 className="section-title">Booking Approvals</h1>
        <p className="section-subtitle">
          {pending.length} request{pending.length !== 1 ? "s" : ""} awaiting
          review
        </p>
      </div>

      {/* Filter Bar */}
      <div
        className="glass"
        style={{
          borderRadius: 16,
          padding: "14px 20px",
          marginBottom: 20,
          display: "flex",
          alignItems: "center",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div className="flex items-center gap-2">
          {spots.map((s) => (
            <button
              key={s}
              onClick={() => setFilterSpot(s)}
              style={{
                padding: "6px 14px",
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s",
                background: filterSpot === s ? "var(--accent)" : "var(--bg2)",
                color: filterSpot === s ? "white" : "var(--text2)",
                border: `1px solid ${filterSpot === s ? "var(--accent)" : "var(--border)"}`,
              }}
            >
              {s}
            </button>
          ))}
        </div>
        <input
          type="date"
          className="input-field"
          style={{ width: "auto" }}
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        />
        <button
          className="btn-ghost"
          style={{
            padding: "7px 14px",
            borderRadius: 8,
            fontSize: 12,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginLeft: "auto",
          }}
          onClick={() =>
            setSortOrder((p) => (p === "newest" ? "oldest" : "newest"))
          }
        >
          <ArrowUpDown size={13} />{" "}
          {sortOrder === "newest" ? "Latest First" : "Oldest First"}
        </button>
        {(filterSpot !== "All" || filterDate) && (
          <button
            className="btn-ghost"
            style={{
              padding: "7px 12px",
              borderRadius: 8,
              fontSize: 11,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 5,
            }}
            onClick={() => {
              setFilterSpot("All");
              setFilterDate("");
            }}
          >
            <RotateCcw size={12} /> Reset
          </button>
        )}
      </div>

      {/* List */}
      {loading ? (
        <div
          style={{
            textAlign: "center",
            padding: "60px 0",
            color: "var(--text3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
          }}
        >
          <Loader2 size={18} className="animate-spin" /> Loading bookings...
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="glass"
          style={{ borderRadius: 20, padding: 60, textAlign: "center" }}
        >
          <CheckCircle2
            size={40}
            color="var(--green)"
            style={{ margin: "0 auto 12px" }}
          />
          <div
            style={{
              fontWeight: 700,
              fontSize: 16,
              color: "var(--text)",
              marginBottom: 4,
            }}
          >
            All clear!
          </div>
          <div style={{ fontSize: 13, color: "var(--text3)" }}>
            No pending bookings match your filters.
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.map((req) => (
            <div
              key={req.id}
              className="glass table-row"
              style={{
                borderRadius: 14,
                padding: "14px 18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16,
              }}
            >
              <div style={{ flex: 1 }}>
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="badge"
                    style={{
                      background: "rgba(79,110,247,0.15)",
                      color: "var(--accent2)",
                    }}
                  >
                    {req.id}
                  </span>
                  <span
                    className="flex items-center gap-1"
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: "var(--orange)",
                      fontFamily: "JetBrains Mono",
                    }}
                  >
                    <Clock size={11} /> {fmtTime(req.timestamp)}
                  </span>
                </div>
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: 14,
                    color: "var(--text)",
                    marginBottom: 6,
                  }}
                >
                  {req.title}
                </div>
                <div
                  className="flex items-center gap-4"
                  style={{ fontSize: 12, color: "var(--text3)" }}
                >
                  <span className="flex items-center gap-1">
                    <MapPin size={12} color="var(--accent)" /> {req.spotName}
                  </span>
                  <span className="flex items-center gap-1">
                    <CalendarIcon size={12} color="var(--accent)" /> {req.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <User size={12} /> {req.organizer}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedReq(req);
                    setPreviewOpen(false);
                  }}
                  style={{
                    padding: "7px 14px",
                    borderRadius: 9,
                    fontSize: 12,
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    background: "var(--surface2)",
                    border: "1px solid var(--border2)",
                    color: "var(--text2)",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  <Eye size={13} /> Details
                </button>
                <button
                  onClick={() => {
                    setSelectedReq(req);
                    setRejectOpen(true);
                  }}
                  style={{
                    padding: "7px 14px",
                    borderRadius: 9,
                    fontSize: 12,
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    background: "rgba(239,68,68,0.1)",
                    border: "1px solid rgba(239,68,68,0.2)",
                    color: "var(--red)",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  <X size={13} /> Reject
                </button>
                <button
                  onClick={() => handleApprove(req)}
                  style={{
                    padding: "7px 16px",
                    borderRadius: 9,
                    fontSize: 12,
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    background: "var(--accent)",
                    border: "none",
                    color: "white",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  <Check size={13} /> Approve
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedReq && !rejectOpen && (
        <div
          className="modal-overlay"
          onClick={(e) =>
            e.target === e.currentTarget &&
            (setSelectedReq(null), setPreviewOpen(false))
          }
        >
          {!previewOpen ? (
            <div className="modal-box" style={{ maxWidth: 600 }}>
              <div className="flex items-center justify-between mb-6">
                <h3
                  style={{
                    fontWeight: 700,
                    fontSize: 18,
                    color: "var(--text)",
                  }}
                >
                  Booking Details
                </h3>
                <span
                  className="badge"
                  style={{
                    background: "rgba(79,110,247,0.15)",
                    color: "var(--accent2)",
                  }}
                >
                  {selectedReq.id}
                </span>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 16,
                  marginBottom: 20,
                }}
              >
                {[
                  { label: "Organizer", value: selectedReq.organizer },
                  { label: "Spot", value: selectedReq.spotName },
                  {
                    label: "Date",
                    value: selectedReq.endDate
                      ? `${selectedReq.date} → ${selectedReq.endDate}`
                      : selectedReq.date,
                  },
                  { label: "Session", value: selectedReq.session },
                  {
                    label: "Time",
                    value: `${selectedReq.startTime || "—"} – ${selectedReq.endTime || "—"}`,
                  },
                  { label: "Dept", value: selectedReq.applicant?.dept || "—" },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: "var(--text3)",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        marginBottom: 4,
                      }}
                    >
                      {label}
                    </div>
                    <div
                      style={{
                        fontWeight: 600,
                        color: "var(--text)",
                        fontSize: 13,
                      }}
                    >
                      {value}
                    </div>
                  </div>
                ))}
              </div>
              {selectedReq.recommender?.name && (
                <div
                  style={{
                    background: "var(--bg)",
                    borderRadius: 12,
                    padding: 16,
                    marginBottom: 16,
                    border: "1px solid var(--border)",
                  }}
                >
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: "var(--text3)",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      marginBottom: 8,
                    }}
                  >
                    Recommender
                  </div>
                  <div
                    style={{
                      fontWeight: 600,
                      color: "var(--text)",
                      fontSize: 13,
                    }}
                  >
                    {selectedReq.recommender.name}
                  </div>
                  {selectedReq.recommender.email && (
                    <div style={{ fontSize: 12, color: "var(--text3)" }}>
                      {selectedReq.recommender.email}
                    </div>
                  )}
                  <div style={{ fontSize: 12, color: "var(--accent2)" }}>
                    {selectedReq.recommender.post}
                  </div>
                </div>
              )}
              {selectedReq.description && (
                <div
                  style={{
                    background: "var(--bg)",
                    borderRadius: 12,
                    padding: 16,
                    marginBottom: 20,
                    border: "1px solid var(--border)",
                  }}
                >
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: "var(--text3)",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      marginBottom: 8,
                    }}
                  >
                    Description
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "var(--text2)",
                      lineHeight: 1.6,
                    }}
                  >
                    {selectedReq.description}
                  </div>
                </div>
              )}
              <div className="flex gap-3">
                <button
                  className="btn-ghost"
                  style={{
                    flex: 1,
                    padding: "11px",
                    borderRadius: 12,
                    fontWeight: 600,
                  }}
                  onClick={() => setSelectedReq(null)}
                >
                  Close
                </button>
                <button
                  className="btn-primary"
                  style={{
                    flex: 1,
                    padding: "11px",
                    borderRadius: 12,
                    fontWeight: 600,
                  }}
                  onClick={() => setPreviewOpen(true)}
                >
                  Preview & Approve
                </button>
              </div>
            </div>
          ) : (
            /* Approval Preview */
            <div
              style={{
                background: "var(--bg2)",
                borderRadius: 24,
                width: "100%",
                maxWidth: 700,
                maxHeight: "90vh",
                display: "flex",
                flexDirection: "column",
                border: "1px solid var(--border2)",
              }}
            >
              <div
                style={{
                  background: "var(--bg3)",
                  padding: "14px 24px",
                  borderRadius: "24px 24px 0 0",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "var(--text3)",
                    fontFamily: "JetBrains Mono",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                  }}
                >
                  Approval Document Preview
                </span>
                <button
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--text2)",
                    cursor: "pointer",
                  }}
                  onClick={() => setPreviewOpen(false)}
                >
                  <X size={18} />
                </button>
              </div>
              <div style={{ padding: "20px 24px", overflowY: "auto", flex: 1 }}>
                <div
                  style={{
                    background: "white",
                    color: "#1a1a2e",
                    padding: 40,
                    borderRadius: 12,
                    fontFamily: "Georgia, serif",
                    minHeight: 600,
                  }}
                >
                  <div
                    style={{
                      textAlign: "center",
                      marginBottom: 24,
                      borderBottom: "2px solid #1a1a2e",
                      paddingBottom: 16,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 20,
                        fontWeight: 800,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      Approval Copy
                    </div>
                    <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
                      Shahjalal University of Science & Technology
                    </div>
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 12,
                      marginBottom: 24,
                    }}
                  >
                    {[
                      ["Event Title", selectedReq.title],
                      ["Venue", selectedReq.spotName],
                      [
                        "Date",
                        selectedReq.endDate
                          ? `${selectedReq.date} to ${selectedReq.endDate}`
                          : selectedReq.date,
                      ],
                      ["Session", selectedReq.session],
                      ["Organizer", selectedReq.organizer],
                      [
                        "Time",
                        `${selectedReq.startTime || "—"} - ${selectedReq.endTime || "—"}`,
                      ],
                    ].map(([l, v]) => (
                      <div
                        key={l}
                        style={{
                          borderBottom: "1px solid #eee",
                          paddingBottom: 8,
                        }}
                      >
                        <div
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            color: "#888",
                            textTransform: "uppercase",
                            marginBottom: 2,
                          }}
                        >
                          {l}
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{v}</div>
                      </div>
                    ))}
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 1fr",
                      gap: 20,
                      borderTop: "1px solid #eee",
                      paddingTop: 20,
                      marginBottom: 20,
                    }}
                  >
                    {[
                      {
                        title: "Applicant",
                        name: selectedReq.applicant?.name,
                        sub: selectedReq.applicant?.dept,
                        note: selectedReq.applicant?.designation,
                      },
                      {
                        title: "Recommender",
                        name: selectedReq.recommender?.name,
                        sub: selectedReq.recommender?.dept,
                        note: selectedReq.recommender?.post,
                      },
                      {
                        title: "Approver",
                        name: localStorage.getItem("adminName") || "Admin",
                        sub: "",
                        note: localStorage.getItem("adminDesignation") || "",
                      },
                    ].map(({ title, name, sub, note }) => (
                      <div key={title}>
                        <div
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            color: "#888",
                            textTransform: "uppercase",
                            marginBottom: 8,
                          }}
                        >
                          {title}
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 700 }}>
                          {name || "—"}
                        </div>
                        {sub && (
                          <div style={{ fontSize: 11, color: "#555" }}>
                            {sub}
                          </div>
                        )}
                        {note && (
                          <div
                            style={{
                              fontSize: 11,
                              color: "#888",
                              fontStyle: "italic",
                            }}
                          >
                            {note}
                          </div>
                        )}
                        <div
                          style={{
                            marginTop: 12,
                            height: 40,
                            border: "1px dashed #ddd",
                            borderRadius: 6,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <span style={{ fontSize: 9, color: "#ccc" }}>
                            Signature
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ fontSize: 11, color: "#555" }}>
                    <div style={{ fontWeight: 700, marginBottom: 6 }}>
                      Terms & Conditions
                    </div>
                    <ol style={{ paddingLeft: 18, lineHeight: 2 }}>
                      <li>The venue must be left clean after the event.</li>
                      <li>
                        Any damage to university property is the organizer's
                        responsibility.
                      </li>
                      <li>
                        Sound levels must remain within acceptable limits.
                      </li>
                      <li>Event must end within the approved timeframe.</li>
                    </ol>
                  </div>
                </div>
              </div>
              <div
                style={{
                  padding: "14px 24px",
                  background: "var(--bg3)",
                  borderRadius: "0 0 24px 24px",
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 10,
                }}
              >
                <button
                  className="btn-ghost"
                  style={{
                    padding: "9px 18px",
                    borderRadius: 10,
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                  onClick={() => setPreviewOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn-primary"
                  disabled={actionLoading}
                  style={{
                    padding: "9px 24px",
                    borderRadius: 10,
                    fontSize: 12,
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                  onClick={() => handleApprove(selectedReq)}
                >
                  {actionLoading ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <Check size={13} />
                  )}{" "}
                  Confirm & Approve
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Reject Modal */}
      {rejectOpen && (
        <div
          className="modal-overlay"
          onClick={(e) =>
            e.target === e.currentTarget &&
            (setRejectOpen(false), setSelectedReq(null))
          }
        >
          <div className="modal-box">
            <div className="flex items-center gap-3 mb-6">
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: "rgba(239,68,68,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <AlertTriangle size={18} color="var(--red)" />
              </div>
              <div>
                <h3
                  style={{
                    fontWeight: 700,
                    fontSize: 16,
                    color: "var(--text)",
                  }}
                >
                  Reject Booking
                </h3>
                <p style={{ fontSize: 12, color: "var(--text3)" }}>
                  {selectedReq?.id}
                </p>
              </div>
            </div>
            <textarea
              className="input-field"
              style={{ resize: "vertical", minHeight: 120, marginBottom: 16 }}
              placeholder="Provide a reason for rejection..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
            <div className="flex gap-3">
              <button
                className="btn-ghost"
                style={{
                  flex: 1,
                  padding: "11px",
                  borderRadius: 12,
                  fontWeight: 600,
                }}
                onClick={() => {
                  setRejectOpen(false);
                  setSelectedReq(null);
                  setRejectReason("");
                }}
              >
                Cancel
              </button>
              <button
                disabled={!rejectReason || actionLoading}
                style={{
                  flex: 1,
                  padding: "11px",
                  borderRadius: 12,
                  fontWeight: 600,
                  background: "var(--red)",
                  border: "none",
                  color: "white",
                  cursor: rejectReason ? "pointer" : "not-allowed",
                  opacity: rejectReason ? 1 : 0.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                }}
                onClick={handleReject}
              >
                {actionLoading ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : null}{" "}
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingApprovals;
