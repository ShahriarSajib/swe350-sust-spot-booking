import { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Download, RotateCcw, X, Loader2 } from "lucide-react";
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

  useEffect(() => {
    adminApi().get("/bookings")
      .then(res => {
        const normalized = (res.data || []).map(b => ({
          id: `REQ-${String(b.booking_id).padStart(3, "0")}`,
          title:     b.event_title || b.title || "(No Title)",
          spotName:  b.spot_name || b.name || "Unknown",
          organizer: b.full_name || "Unknown",
          date:      b.start_date?.split("T")[0] || "",
          endDate:   b.end_date?.split("T")[0] || null,
          status: { approved: "Approved", rejected: "Rejected", cancelled: "Cancelled", pending: "Pending" }[(b.booking_status || "pending").toLowerCase()] || "Pending",
        }));
        setBookings(normalized);
      })
      .catch(() => setToast({ msg: "Failed to load history", type: "error" }))
      .finally(() => setLoading(false));
  }, []);

  const spots    = ["All", ...new Set(bookings.map(b => b.spotName))];
  const statuses = ["All", "Approved", "Rejected", "Cancelled", "Pending"];

  const filtered = bookings.filter(b => {
    const d = new Date(b.date);
    return (filterStatus === "All" || b.status === filterStatus)
      && (filterSpot === "All" || b.spotName === filterSpot)
      && (!startDate || d >= new Date(startDate))
      && (!endDate   || d <= new Date(endDate));
  });

  const stats = {
    total:     filtered.length,
    approved:  filtered.filter(b => b.status === "Approved").length,
    rejected:  filtered.filter(b => b.status === "Rejected").length,
    cancelled: filtered.filter(b => b.status === "Cancelled").length,
    pending:   filtered.filter(b => b.status === "Pending").length,
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18); doc.setTextColor(0, 82, 204);
    doc.text("Booking History Report", 14, 20);
    doc.setFontSize(9); doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 27);
    doc.setFontSize(9); doc.setTextColor(50);
    doc.text(`Filters — Spot: ${filterSpot} | Status: ${filterStatus} | Range: ${startDate || "Any"} to ${endDate || "Any"}`, 14, 34);

    autoTable(doc, {
      head: [["ID", "Title", "Organizer", "Spot", "Date", "Status"]],
      body: filtered.map(b => [b.id, b.title, b.organizer, b.spotName, b.date, b.status]),
      startY: 42,
      theme: "grid",
      headStyles: { fillColor: [0, 82, 204], fontSize: 9 },
      bodyStyles:  { fontSize: 8 },
    });

    setPdfUrl(doc.output("bloburl"));
  };

  const badgeStyle = (status) => {
    const styles = {
      Approved:  { background: "rgba(34,197,94,0.12)",  color: "var(--green)",  border: "1px solid rgba(34,197,94,0.2)"  },
      Rejected:  { background: "rgba(239,68,68,0.12)",  color: "var(--red)",    border: "1px solid rgba(239,68,68,0.2)"  },
      Cancelled: { background: "rgba(249,115,22,0.12)", color: "var(--orange)", border: "1px solid rgba(249,115,22,0.2)" },
      Pending:   { background: "rgba(234,179,8,0.12)",  color: "var(--yellow)", border: "1px solid rgba(234,179,8,0.2)"  },
    };
    return styles[status] || {};
  };

  return (
    <div>
      {toast && <Toast message={toast.msg} type={toast.type} onDone={() => setToast(null)} />}
      <div className="section-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="section-title">Booking History</h1>
            <p className="section-subtitle">Filter, view, and export all booking records</p>
          </div>
          <button className="btn-primary" style={{ padding: "10px 20px", borderRadius: 12, fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }} onClick={exportPDF}>
            <Download size={15} /> Export PDF
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="glass" style={{ borderRadius: 16, padding: 20, marginBottom: 20 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "flex-end" }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Field</div>
            <div className="flex gap-1">
              {spots.map(s => (
                <button key={s} onClick={() => setFilterSpot(s)}
                  style={{
                    padding: "6px 12px", borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: "pointer", transition: "all 0.15s",
                    background: filterSpot === s ? "var(--accent)" : "var(--bg2)", color: filterSpot === s ? "white" : "var(--text2)",
                    border: `1px solid ${filterSpot === s ? "var(--accent)" : "var(--border)"}`
                  }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Status</div>
            <div className="flex gap-1">
              {statuses.map(s => (
                <button key={s} onClick={() => setFilterStatus(s)}
                  style={{
                    padding: "6px 12px", borderRadius: 8, fontSize: 11, fontWeight: 600, cursor: "pointer", transition: "all 0.15s",
                    background: filterStatus === s ? "var(--accent)" : "var(--bg2)", color: filterStatus === s ? "white" : "var(--text2)",
                    border: `1px solid ${filterStatus === s ? "var(--accent)" : "var(--border)"}`
                  }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2" style={{ marginLeft: "auto" }}>
            <input type="date" className="input-field" style={{ width: "auto" }} value={startDate} onChange={e => setStartDate(e.target.value)} />
            <span style={{ color: "var(--text3)", fontSize: 12 }}>→</span>
            <input type="date" className="input-field" style={{ width: "auto" }} value={endDate} onChange={e => setEndDate(e.target.value)} />
            {(filterStatus !== "All" || filterSpot !== "All" || startDate || endDate) && (
              <button className="btn-ghost" style={{ padding: "7px 12px", borderRadius: 8, fontSize: 11, display: "flex", alignItems: "center", gap: 5 }}
                onClick={() => { setFilterStatus("All"); setFilterSpot("All"); setStartDate(""); setEndDate(""); }}>
                <RotateCcw size={11} /> Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        {[
          { label: "Total",     value: stats.total,     color: "var(--text2)"  },
          { label: "Approved",  value: stats.approved,  color: "var(--green)"  },
          { label: "Rejected",  value: stats.rejected,  color: "var(--red)"    },
          { label: "Cancelled", value: stats.cancelled, color: "var(--orange)" },
          { label: "Pending",   value: stats.pending,   color: "var(--yellow)" },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: "8px 16px", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text3)", fontFamily: "JetBrains Mono", textTransform: "uppercase" }}>{label}</span>
            <span style={{ fontSize: 15, fontWeight: 800, color, fontFamily: "JetBrains Mono" }}>{value}</span>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="glass" style={{ borderRadius: 18, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "var(--bg2)", borderBottom: "1px solid var(--border)" }}>
              {["ID & Title", "Organizer", "Spot", "Date", "Status"].map(h => (
                <th key={h} style={{ padding: "14px 18px", textAlign: "left", fontSize: 10, fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.1em" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ textAlign: "center", padding: "50px 0", color: "var(--text3)" }}>
                <Loader2 size={18} className="animate-spin" style={{ margin: "0 auto 8px", display: "block" }} /> Loading...
              </td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: "center", padding: "50px 0", color: "var(--text3)" }}>No records found</td></tr>
            ) : filtered.map(b => (
              <tr key={b.id} className="table-row" style={{ borderBottom: "1px solid var(--border)" }}>
                <td style={{ padding: "12px 18px" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: "var(--accent2)", fontFamily: "JetBrains Mono", marginBottom: 3 }}>{b.id}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{b.title}</div>
                </td>
                <td style={{ padding: "12px 18px", fontSize: 13, color: "var(--text2)" }}>{b.organizer}</td>
                <td style={{ padding: "12px 18px" }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "var(--accent)", background: "rgba(79,110,247,0.1)", padding: "3px 10px", borderRadius: 6 }}>{b.spotName}</span>
                </td>
                <td style={{ padding: "12px 18px", fontSize: 12, fontWeight: 600, color: "var(--text3)", fontFamily: "JetBrains Mono" }}>{b.date}</td>
                <td style={{ padding: "12px 18px" }}>
                  <span className="badge" style={badgeStyle(b.status)}>{b.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* PDF Modal */}
      {pdfUrl && (
        <div className="modal-overlay">
          <div style={{ background: "var(--bg2)", borderRadius: 24, width: "100%", maxWidth: 900, height: "90vh", display: "flex", flexDirection: "column", border: "1px solid var(--border2)" }}>
            <div style={{ padding: "16px 24px", background: "var(--bg3)", borderRadius: "24px 24px 0 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: "var(--text)" }}>Report Preview</div>
                <div style={{ fontSize: 11, color: "var(--text3)" }}>Verify before downloading</div>
              </div>
              <button style={{ background: "none", border: "none", color: "var(--text2)", cursor: "pointer" }} onClick={() => setPdfUrl(null)}><X size={18} /></button>
            </div>
            <div style={{ flex: 1, padding: 20, background: "var(--bg)" }}>
              <iframe src={pdfUrl} style={{ width: "100%", height: "100%", borderRadius: 12, border: "none" }} title="PDF" />
            </div>
            <div style={{ padding: "16px 24px", background: "var(--bg3)", borderRadius: "0 0 24px 24px", display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button className="btn-ghost" style={{ padding: "9px 18px", borderRadius: 10, fontSize: 12, fontWeight: 600 }} onClick={() => setPdfUrl(null)}>Cancel</button>
              <a href={pdfUrl} download={`History_${new Date().toISOString().split("T")[0]}.pdf`} onClick={() => setPdfUrl(null)}
                className="btn-primary" style={{ padding: "9px 22px", borderRadius: 10, fontSize: 12, fontWeight: 600, textDecoration: "none", display: "flex", alignItems: "center", gap: 6 }}>
                <Download size={14} /> Download
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingHistory;
