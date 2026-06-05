import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Download, Eye, Loader2, RotateCcw, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { adminApi } from "./adminApi";
import Toast from "./Toast";

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterSpot, setFilterSpot] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [pdfUrl, setPdfUrl] = useState(null);
  const [toast, setToast] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    adminApi()
      .get("/bookings/history")
      .then((res) => {
        const normalized = (res.data || []).map((b) => ({
          id: `REQ-${String(b.booking_id).padStart(3, "0")}`,
          booking_id: b.booking_id,
          title: b.event_title || b.title || "(No Title)",
          spotName: b.spot_name || b.name || "Unknown",
          organizer: b.full_name || "Unknown",
          date: b.start_date?.split("T")[0] || "",
          endDate: b.end_date?.split("T")[0] || null,
          session: b.session || "",
          startTime: b.start_time || "",
          endTime: b.end_time || "",
          description: b.description || "",
          applicant: {
            name: b.full_name,
            dept: b.dept,
            contact: b.contact_number,
          },
          recommender: {
            name: b.recommender_name,
            post: b.recommender_post,
            dept: b.recommender_dept,
          },
          status:
            {
              approved: "Approved",
              rejected: "Rejected",
              cancelled: "Cancelled",
              pending: "Pending",
            }[(b.booking_status || "pending").toLowerCase()] || "Pending",
        }));
        setBookings(normalized);
      })
      .catch(() => setToast({ msg: "Failed to load history", type: "error" }))
      .finally(() => setLoading(false));
  }, []);

  const spots = ["All", ...new Set(bookings.map((b) => b.spotName))];
  const statuses = ["All", "Approved", "Rejected", "Cancelled", "Pending"];

  const filtered = bookings.filter((b) => {
    const d = new Date(b.date);
    // AFTER
    return (
      (filterStatus === "All" || b.status === filterStatus) &&
      (filterSpot === "All" || b.spotName === filterSpot) &&
      (!startDate || b.date >= startDate) &&
      (!endDate || b.date <= endDate)
    );
  });

  const stats = {
    total: filtered.length,
    approved: filtered.filter((b) => b.status === "Approved").length,
    rejected: filtered.filter((b) => b.status === "Rejected").length,
    cancelled: filtered.filter((b) => b.status === "Cancelled").length,
    pending: filtered.filter((b) => b.status === "Pending").length,
  };

const exportPDF = () => {


  
  const doc = new jsPDF();
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 14;

  const adminName = localStorage.getItem("adminName") || "Administrator";
  const adminDesignation =
    localStorage.getItem("adminDesignation") || "System Administrator";
  const adminDept = localStorage.getItem("adminDept") || "";

  //  HEADER 
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text(
    "Shahjalal University of Science & Technology",
    pageW / 2,
    18,
    { align: "center" }
  );

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(80);
  doc.text("Booking History Report", pageW / 2, 25, {
    align: "center",
  });

  doc.setFontSize(9);
  doc.text(`Generated: ${new Date().toLocaleString()}`, margin, 32);

  // Divider
  doc.setLineWidth(0.5);
  doc.line(margin, 36, pageW - margin, 36);

  // TABLE
  autoTable(doc, {
    head: [["ID", "Title", "Organizer", "Spot", "Date", "Status"]],
    body: filtered.map((b) => [
      b.id,
      b.title,
      b.organizer,
      b.spotName,
      b.date,
      b.status,
    ]),
    startY: 42,
    theme: "grid",
    headStyles: { fillColor: [0, 82, 204], fontSize: 9 },
    bodyStyles: { fontSize: 8 },

    //FOOTER ON EVERY PAGE 
    didDrawPage: (data) => {
      const footerY = pageH - 12;

      // line
      doc.setDrawColor(200);
      doc.line(margin, footerY - 5, pageW - margin, footerY - 5);

      // admin info (left)
      doc.setFontSize(8);
      doc.setTextColor(80);
      doc.text(adminName, margin, footerY);

      const cred = [adminDesignation, adminDept]
        .filter(Boolean)
        .join(", ");
      doc.text(cred, margin, footerY + 4);

      // page number (right)
      doc.text(
        `Page ${data.pageNumber}`,
        pageW - margin,
        footerY,
        { align: "right" }
      );
    },
  });

  setPdfUrl(doc.output("bloburl"));
};

  const badgeStyle = (status) => {
    const styles = {
      Approved: {
        background: "rgba(34,197,94,0.12)",
        color: "var(--green)",
        border: "1px solid rgba(34,197,94,0.2)",
      },
      Rejected: {
        background: "rgba(239,68,68,0.12)",
        color: "var(--red)",
        border: "1px solid rgba(239,68,68,0.2)",
      },
      Cancelled: {
        background: "rgba(249,115,22,0.12)",
        color: "var(--orange)",
        border: "1px solid rgba(249,115,22,0.2)",
      },
      Pending: {
        background: "rgba(234,179,8,0.12)",
        color: "var(--yellow)",
        border: "1px solid rgba(234,179,8,0.2)",
      },
    };
    return styles[status] || {};
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="section-title">Booking History</h1>
            <p className="section-subtitle">
              Filter, view, and export all booking records
            </p>
          </div>
          <button
            className="btn-primary"
            style={{
              padding: "10px 20px",
              borderRadius: 12,
              fontSize: 13,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
            onClick={exportPDF}
          >
            <Download size={15} /> Export PDF
          </button>
        </div>
      </div>

      {/* Filters */}
      <div
        className="glass"
        style={{ borderRadius: 16, padding: 20, marginBottom: 20 }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
            alignItems: "flex-end",
          }}
        >
          <div>
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
              Field
            </div>
            <div className="flex gap-1">
              {spots.map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterSpot(s)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 8,
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.15s",
                    background:
                      filterSpot === s ? "var(--accent)" : "var(--bg2)",
                    color: filterSpot === s ? "white" : "var(--text2)",
                    border: `1px solid ${filterSpot === s ? "var(--accent)" : "var(--border)"}`,
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div>
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
              Status
            </div>
            <div className="flex gap-1">
              {statuses.map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 8,
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.15s",
                    background:
                      filterStatus === s ? "var(--accent)" : "var(--bg2)",
                    color: filterStatus === s ? "white" : "var(--text2)",
                    border: `1px solid ${filterStatus === s ? "var(--accent)" : "var(--border)"}`,
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div
            className="flex items-center gap-2"
            style={{ marginLeft: "auto" }}
          >
            <input
              type="date"
              className="input-field"
              style={{ width: "auto" }}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <span style={{ color: "var(--text3)", fontSize: 12 }}>→</span>
            <input
              type="date"
              className="input-field"
              style={{ width: "auto" }}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            {(filterStatus !== "All" ||
              filterSpot !== "All" ||
              startDate ||
              endDate) && (
              <button
                className="btn-ghost"
                style={{
                  padding: "7px 12px",
                  borderRadius: 8,
                  fontSize: 11,
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                }}
                onClick={() => {
                  setFilterStatus("All");
                  setFilterSpot("All");
                  setStartDate("");
                  setEndDate("");
                }}
              >
                <RotateCcw size={11} /> Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        {[
          { label: "Total", value: stats.total, color: "var(--text2)" },
          { label: "Approved", value: stats.approved, color: "var(--green)" },
          { label: "Rejected", value: stats.rejected, color: "var(--red)" },
          {
            label: "Cancelled",
            value: stats.cancelled,
            color: "var(--orange)",
          },
          { label: "Pending", value: stats.pending, color: "var(--yellow)" },
        ].map(({ label, value, color }) => (
          <div
            key={label}
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 10,
              padding: "8px 16px",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "var(--text3)",
                fontFamily: "JetBrains Mono",
                textTransform: "uppercase",
              }}
            >
              {label}
            </span>
            <span
              style={{
                fontSize: 15,
                fontWeight: 800,
                color,
                fontFamily: "JetBrains Mono",
              }}
            >
              {value}
            </span>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="glass" style={{ borderRadius: 18, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr
              style={{
                background: "var(--bg2)",
                borderBottom: "1px solid var(--border)",
              }}
            >
              {["ID & Title", "Organizer", "Spot", "Date", "Status", ""].map(
                (h) => (
                  <th
                    key={h}
                    style={{
                      padding: "14px 18px",
                      textAlign: "left",
                      fontSize: 10,
                      fontWeight: 700,
                      color: "var(--text3)",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                    }}
                  >
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={6}
                  style={{
                    textAlign: "center",
                    padding: "50px 0",
                    color: "var(--text3)",
                  }}
                >
                  <Loader2
                    size={18}
                    className="animate-spin"
                    style={{ margin: "0 auto 8px", display: "block" }}
                  />{" "}
                  Loading...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  style={{
                    textAlign: "center",
                    padding: "50px 0",
                    color: "var(--text3)",
                  }}
                >
                  No records found
                </td>
              </tr>
            ) : (
              filtered.map((b) => (
                <tr
                  key={b.id}
                  className="table-row"
                  style={{ borderBottom: "1px solid var(--border)" }}
                >
                  <td style={{ padding: "12px 18px" }}>
                    <div
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: "var(--accent2)",
                        fontFamily: "JetBrains Mono",
                        marginBottom: 3,
                      }}
                    >
                      {b.id}
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "var(--text)",
                      }}
                    >
                      {b.title}
                    </div>
                  </td>
                  <td
                    style={{
                      padding: "12px 18px",
                      fontSize: 13,
                      color: "var(--text2)",
                    }}
                  >
                    {b.organizer}
                  </td>
                  <td style={{ padding: "12px 18px" }}>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "var(--accent)",
                        background: "rgba(79,110,247,0.1)",
                        padding: "3px 10px",
                        borderRadius: 6,
                      }}
                    >
                      {b.spotName}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "12px 18px",
                      fontSize: 12,
                      fontWeight: 600,
                      color: "var(--text3)",
                      fontFamily: "JetBrains Mono",
                    }}
                  >
                    {b.date}
                  </td>
                  <td style={{ padding: "12px 18px" }}>
                    <span className="badge" style={badgeStyle(b.status)}>
                      {b.status}
                    </span>
                  </td>
                  <td style={{ padding: "12px 18px" }}>
                    <button
                      onClick={() => {
                        setSelectedBooking(b);
                        setPreviewOpen(false);
                      }}
                      style={{
                        padding: "6px 12px",
                        borderRadius: 8,
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
                        whiteSpace: "nowrap",
                      }}
                    >
                      <Eye size={13} /> Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {selectedBooking && createPortal(
        <div
          className="modal-overlay"
          onClick={(e) =>
            e.target === e.currentTarget &&
            (setSelectedBooking(null), setPreviewOpen(false))
          }
          style={{ zIndex: 9999 }}
        >
          {!previewOpen ? (
            <div className="modal-box" style={{ maxWidth: 600, maxHeight: "90vh", overflowY: "auto" }}>
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
                  {selectedBooking.id}
                </span>
              </div>

              {/* Status Badge */}
              <div style={{ marginBottom: 20 }}>
                <span
                  className="badge"
                  style={{
                    ...{
                      Approved: {
                        background: "rgba(34,197,94,0.12)",
                        color: "var(--green)",
                        border: "1px solid rgba(34,197,94,0.2)",
                      },
                      Rejected: {
                        background: "rgba(239,68,68,0.12)",
                        color: "var(--red)",
                        border: "1px solid rgba(239,68,68,0.2)",
                      },
                      Cancelled: {
                        background: "rgba(249,115,22,0.12)",
                        color: "var(--orange)",
                        border: "1px solid rgba(249,115,22,0.2)",
                      },
                      Pending: {
                        background: "rgba(234,179,8,0.12)",
                        color: "var(--yellow)",
                        border: "1px solid rgba(234,179,8,0.2)",
                      },
                    }[selectedBooking.status],
                    fontSize: 12,
                    fontWeight: 700,
                    padding: "4px 14px",
                    borderRadius: 8,
                  }}
                >
                  {selectedBooking.status}
                </span>
              </div>

              {/* Event Info Grid */}
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
                    marginBottom: 12,
                  }}
                >
                  Event Info
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 14,
                  }}
                >
                  {[
                    { label: "Event Title", value: selectedBooking.title },
                    { label: "Spot / Venue", value: selectedBooking.spotName },
                    {
                      label: "Date",
                      value: selectedBooking.endDate
                        ? `${selectedBooking.date} → ${selectedBooking.endDate}`
                        : selectedBooking.date,
                    },
                    { label: "Session", value: selectedBooking.session || "—" },
                    {
                      label: "Start Time",
                      value: selectedBooking.startTime || "—",
                    },
                    {
                      label: "End Time",
                      value: selectedBooking.endTime || "—",
                    },
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
              </div>

              {/* Applicant Info */}
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
                    marginBottom: 12,
                  }}
                >
                  Applicant
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 14,
                  }}
                >
                  {[
                    {
                      label: "Full Name",
                      value: selectedBooking.applicant?.name || "—",
                    },
                    {
                      label: "Department",
                      value: selectedBooking.applicant?.dept || "—",
                    },
                    {
                      label: "Designation",
                      value: selectedBooking.applicant?.designation || "—",
                    },
                    {
                      label: "Contact",
                      value: selectedBooking.applicant?.contact || "—",
                    },
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
              </div>

              {/* Recommender Info */}
              {selectedBooking.recommender?.name && (
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
                      marginBottom: 12,
                    }}
                  >
                    Recommender
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 14,
                    }}
                  >
                    {[
                      {
                        label: "Full Name",
                        value: selectedBooking.recommender?.name || "—",
                      },
                      {
                        label: "Post",
                        value: selectedBooking.recommender?.post || "—",
                      },
                      {
                        label: "Department",
                        value: selectedBooking.recommender?.dept || "—",
                      },
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
                </div>
              )}

              {/* Description */}
              {selectedBooking.description && (
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
                    {selectedBooking.description}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  className="btn-ghost"
                  style={{
                    flex: 1,
                    padding: "11px",
                    borderRadius: 12,
                    fontWeight: 600,
                  }}
                  onClick={() => setSelectedBooking(null)}
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
                  Preview Document
                </button>
              </div>
            </div>
          ) : (
            /* Approval Document Preview */
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
                  {/* Header */}
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

                  {/* Event Details */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 12,
                      marginBottom: 24,
                    }}
                  >
                    {[
                      ["Event Title", selectedBooking.title],
                      ["Venue", selectedBooking.spotName],
                      [
                        "Date",
                        selectedBooking.endDate
                          ? `${selectedBooking.date} to ${selectedBooking.endDate}`
                          : selectedBooking.date,
                      ],
                      ["Session", selectedBooking.session || "—"],
                      ["Organizer", selectedBooking.organizer],
                      [
                        "Time",
                        `${selectedBooking.startTime || "—"} - ${selectedBooking.endTime || "—"}`,
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

                  {/* Signature Section */}
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
                        name: selectedBooking.applicant?.name,
                        sub: selectedBooking.applicant?.dept,
                        note: selectedBooking.applicant?.designation,
                      },
                      {
                        title: "Recommender",
                        name: selectedBooking.recommender?.name,
                        sub: selectedBooking.recommender?.dept,
                        note: selectedBooking.recommender?.post,
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

                  {/* Terms */}
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
                  className="btn-primary"
                  style={{
                    padding: "9px 24px",
                    borderRadius: 10,
                    fontSize: 12,
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                  onClick={() => setPreviewOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>,
        document.body
      )}

      {/* PDF Modal */}
      {pdfUrl && createPortal(
        <div className="modal-overlay" style={{ zIndex: 9999 }}>
          <div
            style={{
              background: "var(--bg2)",
              borderRadius: 24,
              width: "100%",
              maxWidth: 900,
              height: "90vh",
              display: "flex",
              flexDirection: "column",
              border: "1px solid var(--border2)",
            }}
          >
            <div
              style={{
                padding: "16px 24px",
                background: "var(--bg3)",
                borderRadius: "24px 24px 0 0",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 15,
                    color: "var(--text)",
                  }}
                >
                  Report Preview
                </div>
                <div style={{ fontSize: 11, color: "var(--text3)" }}>
                  Verify before downloading
                </div>
              </div>
              <button
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--text2)",
                  cursor: "pointer",
                }}
                onClick={() => setPdfUrl(null)}
              >
                <X size={18} />
              </button>
            </div>
            <div style={{ flex: 1, padding: 20, background: "var(--bg)" }}>
              <iframe
                src={pdfUrl}
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: 12,
                  border: "none",
                }}
                title="PDF"
              />
            </div>
            <div
              style={{
                padding: "16px 24px",
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
                onClick={() => setPdfUrl(null)}
              >
                Cancel
              </button>
              <a
                href={pdfUrl}
                download={`History_${new Date().toISOString().split("T")[0]}.pdf`}
                onClick={() => setPdfUrl(null)}
                className="btn-primary"
                style={{
                  padding: "9px 22px",
                  borderRadius: 10,
                  fontSize: 12,
                  fontWeight: 600,
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <Download size={14} /> Download
              </a>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default BookingHistory;