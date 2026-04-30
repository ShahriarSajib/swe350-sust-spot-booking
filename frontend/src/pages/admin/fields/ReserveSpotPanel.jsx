import { useState, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import {
  MapPin, Calendar as CalendarIcon, Check, AlertTriangle, Loader2,
} from "lucide-react";
import { adminApi } from "./adminApi";
import Toast from "./Toast";

const ReserveSpotPanel = ({ onClose }) => {
  const [spots, setSpots] = useState([]);
  const [selectedSpotId, setSelectedSpotId] = useState("");
  const [selectedSpotName, setSelectedSpotName] = useState("");
  const [bookingType, setBookingType] = useState("single"); // "single" | "range"
  const [selectedDate, setSelectedDate] = useState(null);
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [session, setSession] = useState("");
  const [conflictInfo, setConflictInfo] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const today = new Date();

  useEffect(() => {
    adminApi().get("/spots").then(r => setSpots(r.data || [])).catch(() => {});
  }, []);

  const formatDate = (d) => {
    if (!d) return null;
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };

  const checkConflict = async (date) => {
    if (!selectedSpotId || !date) return;
    try {
      const res = await adminApi().get(`/spots/${selectedSpotId}/availability?date=${formatDate(date)}`);
      setConflictInfo(res.data.conflict ? res.data : null);
    } catch {
      setConflictInfo(null);
    }
  };

  const handleDateSelect = (val) => {
    if (bookingType === "single") {
      setSelectedDate(val);
      setConflictInfo(null);
      if (val) checkConflict(val);
    } else {
      setDateRange(val || { from: null, to: null });
      setConflictInfo(null);
    }
  };

  const handleReserve = async () => {
    if (!selectedSpotId || !session) return;
    const startDate = bookingType === "single" ? formatDate(selectedDate) : formatDate(dateRange.from);
    const endDate   = bookingType === "range"  ? formatDate(dateRange.to) : null;
    if (!startDate) return;

    setSaving(true);
    try {
      await adminApi().post("/bookings/reserve", {
        spot_id: selectedSpotId,
        start_date: startDate,
        end_date: endDate,
        session,
        title: `Admin Reserved — ${selectedSpotName}`,
      });
      setToast({ msg: `${selectedSpotName} reserved successfully!`, type: "success" });
      setTimeout(onClose, 1500);
    } catch {
      setToast({ msg: "Reservation failed. Try again.", type: "error" });
    }
    setSaving(false);
  };

  const dateReady = bookingType === "single" ? !!selectedDate : !!(dateRange?.from && dateRange?.to);

  return (
    <>
      {toast && <Toast message={toast.msg} type={toast.type} onDone={() => setToast(null)} />}
      <div style={{
        background: "#f0f9ff", border: "1.5px solid #bae6fd", borderRadius: 20,
        padding: 24, marginBottom: 4,
        animation: "fadeSlideIn 0.25s ease",
      }}>
        {/* Panel Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <CalendarIcon size={18} color="#0284c7" />
              <span style={{ fontWeight: 700, fontSize: 15, color: "#0c4a6e" }}>Admin Priority Reservation</span>
            </div>
            <div style={{ fontSize: 12, color: "#0284c7", marginTop: 3, marginLeft: 26 }}>
              Spot: {selectedSpotName || "Not selected"}
            </div>
          </div>

          {/* Controls */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <select
              value={selectedSpotId}
              onChange={e => {
                const opt = e.target.options[e.target.selectedIndex];
                setSelectedSpotId(e.target.value);
                setSelectedSpotName(opt.text);
                setSelectedDate(null); setDateRange({ from: null, to: null }); setConflictInfo(null);
              }}
              style={{ padding: "8px 14px", borderRadius: 10, border: "1.5px solid #7dd3fc", background: "white", color: "#0c4a6e", fontWeight: 700, fontSize: 12, outline: "none", cursor: "pointer" }}
            >
              <option value="">Select Spot</option>
              {spots.map(s => <option key={s.spot_id} value={s.spot_id}>{s.name}</option>)}
            </select>

            <select
              value={bookingType}
              onChange={e => { setBookingType(e.target.value); setSelectedDate(null); setDateRange({ from: null, to: null }); setConflictInfo(null); }}
              style={{ padding: "8px 14px", borderRadius: 10, border: "1.5px solid #cbd5e1", background: "white", color: "#475569", fontWeight: 600, fontSize: 12, outline: "none", cursor: "pointer" }}
            >
              <option value="single">Single Day</option>
              <option value="range">Multiple Days</option>
            </select>
          </div>
        </div>

        {/* Body */}
        {!selectedSpotId ? (
          <div style={{ textAlign: "center", padding: "32px 0", border: "1.5px dashed #bae6fd", borderRadius: 14, background: "rgba(255,255,255,0.5)" }}>
            <MapPin size={28} color="#bae6fd" style={{ margin: "0 auto 8px" }} />
            <div style={{ color: "#94a3b8", fontWeight: 600, fontSize: 13 }}>Please select a spot first</div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 20 }}>
            {/* Calendar */}
            <div style={{ background: "white", borderRadius: 16, padding: 16, border: "1px solid #e0f2fe", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
              <DayPicker
                mode={bookingType === "single" ? "single" : "range"}
                selected={bookingType === "single" ? selectedDate : dateRange}
                onSelect={handleDateSelect}
                disabled={d => d < today}
              />
            </div>

            {/* Right Panel */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Conflict warning */}
              {conflictInfo && (
                <div style={{ background: "#fef2f2", border: "1.5px solid #fca5a5", borderRadius: 14, padding: 16 }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <AlertTriangle size={18} color="#dc2626" style={{ flexShrink: 0, marginTop: 1 }} />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 12, color: "#dc2626", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>Conflict Detected</div>
                      <div style={{ fontSize: 13, color: "#7f1d1d" }}>{conflictInfo.msg || "An event is already booked on this date."}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Date display */}
              {dateReady && (
                <div style={{ background: "#dcfce7", border: "1.5px solid #86efac", borderRadius: 12, padding: "12px 16px", display: "flex", alignItems: "center", gap: 10 }}>
                  <Check size={16} color="#16a34a" />
                  <span style={{ fontWeight: 700, fontSize: 13, color: "#15803d" }}>
                    {bookingType === "single"
                      ? `Selected: ${formatDate(selectedDate)}`
                      : `${formatDate(dateRange.from)} → ${formatDate(dateRange.to)}`}
                  </span>
                </div>
              )}

              {/* Session picker */}
              {dateReady && (
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Select Session</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {[
                      { val: "day",       label: "Day",        sub: "Morning to afternoon" },
                      { val: "night",     label: "Night",      sub: "Evening to midnight" },
                      { val: "day+night", label: "Day & Night", sub: "Full day" },
                    ].map(({ val, label, sub }) => (
                      <label
                        key={val}
                        style={{
                          display: "flex", alignItems: "center", gap: 12,
                          padding: "12px 16px", borderRadius: 12, cursor: "pointer",
                          border: `1.5px solid ${session === val ? "#7dd3fc" : "#e2e8f0"}`,
                          background: session === val ? "#f0f9ff" : "white",
                          transition: "all 0.15s",
                        }}
                      >
                        <input type="radio" name="reserve-session" value={val}
                          checked={session === val} onChange={() => setSession(val)}
                          style={{ accentColor: "#0284c7", width: 16, height: 16 }} />
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 13, color: "#0c4a6e" }}>{label}</div>
                          <div style={{ fontSize: 11, color: "#94a3b8" }}>{sub}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Reserve Button */}
              {dateReady && session && (
                <button
                  onClick={handleReserve}
                  disabled={saving}
                  style={{
                    width: "100%", padding: "14px", borderRadius: 14, border: "none",
                    background: saving ? "#94a3b8" : "#0284c7", color: "white",
                    fontWeight: 800, fontSize: 15, cursor: saving ? "not-allowed" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    boxShadow: saving ? "none" : "0 4px 14px rgba(2,132,199,0.35)",
                    transition: "all 0.2s", marginTop: "auto",
                  }}
                >
                  {saving ? <Loader2 size={16} className="animate-spin" /> : null}
                  {saving ? "Reserving..." : `Reserve ${selectedSpotName}`}
                </button>
              )}

              {/* Empty state */}
              {!dateReady && !conflictInfo && (
                <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", border: "1.5px dashed #bae6fd", borderRadius: 14, padding: 32, background: "rgba(255,255,255,0.4)" }}>
                  <div style={{ textAlign: "center", color: "#94a3b8" }}>
                    <CalendarIcon size={32} style={{ margin: "0 auto 8px", opacity: 0.3 }} />
                    <div style={{ fontSize: 13, fontWeight: 600 }}>
                      {bookingType === "single" ? "Pick a date from the calendar" : "Pick start and end dates"}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ReserveSpotPanel;
