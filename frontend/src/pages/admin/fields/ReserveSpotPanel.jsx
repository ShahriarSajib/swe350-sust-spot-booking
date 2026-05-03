import {
  AlertTriangle,
  Calendar as CalendarIcon,
  Check,
  Loader2,
  MapPin,
  X,
  ShieldAlert,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { adminApi } from "./adminApi";
import Toast from "./Toast";

// ─── Confirmation Dialog ──────────────────────────────────────────────────────
const ConfirmDialog = ({ spotName, dateLabel, session, hasConflict, conflictMsg, onConfirm, onCancel }) => (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.45)",
      zIndex: 9999,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 16,
    }}
  >
    <div
      style={{
        background: "#fff",
        borderRadius: 20,
        padding: 32,
        maxWidth: 420,
        width: "100%",
        boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: "50%",
          background: hasConflict ? "#fef2f2" : "#f0f9ff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 18px",
        }}
      >
        {hasConflict
          ? <ShieldAlert size={24} color="#dc2626" />
          : <CalendarIcon size={24} color="#0284c7" />
        }
      </div>

      {/* Title */}
      <h2 style={{ textAlign: "center", fontSize: 17, fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>
        {hasConflict ? "Override Existing Booking?" : "Confirm Reservation"}
      </h2>

      {/* Booking summary */}
      <div
        style={{
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
          borderRadius: 12,
          padding: "12px 16px",
          margin: "16px 0",
          fontSize: 13,
          color: "#334155",
          lineHeight: 1.7,
        }}
      >
        <div><span style={{ color: "#94a3b8" }}>Spot</span> &nbsp; <strong>{spotName}</strong></div>
        <div><span style={{ color: "#94a3b8" }}>Date</span> &nbsp; <strong>{dateLabel}</strong></div>
        <div><span style={{ color: "#94a3b8" }}>Session</span> &nbsp; <strong style={{ textTransform: "capitalize" }}>{session}</strong></div>
      </div>

      {/* Conflict warning block */}
      {hasConflict && (
        <div
          style={{
            background: "#fef2f2",
            border: "1.5px solid #fca5a5",
            borderRadius: 12,
            padding: "12px 16px",
            marginBottom: 16,
            fontSize: 13,
            color: "#7f1d1d",
            lineHeight: 1.6,
          }}
        >
          <div style={{ fontWeight: 700, color: "#dc2626", marginBottom: 4 }}>⚠ Conflict</div>
          {conflictMsg}
          <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid #fca5a5", color: "#991b1b" }}>
            Proceeding will <strong>cancel</strong> the conflicting booking and automatically send a cancellation notification &amp; email to the requester.
          </div>
        </div>
      )}

      {/* Buttons */}
      <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
        <button
          onClick={onCancel}
          style={{
            flex: 1,
            padding: "11px",
            borderRadius: 12,
            border: "1.5px solid #e2e8f0",
            background: "#fff",
            color: "#64748b",
            fontWeight: 600,
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          style={{
            flex: 1,
            padding: "11px",
            borderRadius: 12,
            border: "none",
            background: hasConflict ? "#dc2626" : "#0284c7",
            color: "#fff",
            fontWeight: 700,
            fontSize: 14,
            cursor: "pointer",
            boxShadow: hasConflict
              ? "0 4px 14px rgba(220,38,38,0.3)"
              : "0 4px 14px rgba(2,132,199,0.3)",
          }}
        >
          {hasConflict ? "Yes, Override & Reserve" : "Yes, Reserve"}
        </button>
      </div>
    </div>
  </div>
);

// ─── Main Panel ───────────────────────────────────────────────────────────────
const ReserveSpotPanel = ({ onClose }) => {
  const [spots, setSpots] = useState([]);
  const [selectedSpotId, setSelectedSpotId] = useState("");
  const [selectedSpotName, setSelectedSpotName] = useState("");
  const [bookingType, setBookingType] = useState("single");
  const [selectedDate, setSelectedDate] = useState(null);
  const [dateRange, setDateRange] = useState({ from: null, to: null });
  const [session, setSession] = useState("");
  const [conflictInfo, setConflictInfo] = useState(null); // null | { conflict: bool, msg: string }
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  // Use a ref so handleReserve always reads the latest values (fixes stale closure bug)
  const stateRef = useRef({});
  stateRef.current = { selectedSpotId, selectedSpotName, selectedDate, dateRange, bookingType, session, conflictInfo };

  const today = new Date();

  useEffect(() => {
    adminApi()
      .get("/spots")
      .then((r) => setSpots(r.data || []))
      .catch(() => {});
  }, []);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const formatDate = (d) => {
    if (!d) return null;
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };

  const dateLabel = () => {
    if (bookingType === "single") return formatDate(selectedDate) || "—";
    const { from, to } = dateRange;
    if (from && to) return `${formatDate(from)} → ${formatDate(to)}`;
    if (from) return `${formatDate(from)} → …`;
    return "—";
  };

  // ── Conflict check ─────────────────────────────────────────────────────────
  const checkConflict = async (date) => {
    if (!selectedSpotId || !date) return;
    try {
      const res = await adminApi().get(
        `/spots/${selectedSpotId}/availability?date=${formatDate(date)}`
      );
      // Always set — clears stale conflict when moving to a clean date
      setConflictInfo(res.data.conflict ? res.data : { conflict: false });
    } catch {
      setConflictInfo(null);
    }
  };

  // ── Date selection ─────────────────────────────────────────────────────────
  const handleDateSelect = (val) => {
    setConflictInfo(null);
    setSession("");              // reset session on new date pick

    if (bookingType === "single") {
      setSelectedDate(val || null);
      if (val) checkConflict(val);
    } else {
      const next = val || { from: null, to: null };
      setDateRange(next);
      // Check conflict as soon as the start date is chosen
      if (next.from) checkConflict(next.from);
    }
  };

  // ── Reserve — opens confirmation dialog ───────────────────────────────────
  const handleReserve = () => {
    // Read from ref so we always have the latest state
    const { selectedSpotId: sid, session: sess } = stateRef.current;
    if (!sid || !sess) return;
    setShowConfirm(true);
  };

  // ── Confirmed — call the API ───────────────────────────────────────────────
  const handleConfirmed = async () => {
    setShowConfirm(false);

    // Read fresh values from ref
    const { selectedSpotId: sid, selectedSpotName: sname, selectedDate: sdate, dateRange: srange, bookingType: stype, session: sess } = stateRef.current;

    const startDate = stype === "single" ? formatDate(sdate) : formatDate(srange.from);
    const endDate   = stype === "range"  ? formatDate(srange.to) : null;

    if (!startDate) return;

    setSaving(true);
    try {
      const res = await adminApi().post("/bookings/reserve", {
        spot_id:    sid,
        start_date: startDate,
        end_date:   endDate,
        session:    sess,
        title:      `Admin Reserved — ${sname}`,
      });

      const cancelled = res.data?.cancelledBookings ?? 0;
      const msg = cancelled > 0
        ? `${sname} reserved. ${cancelled} conflicting booking${cancelled > 1 ? "s" : ""} cancelled — requester${cancelled > 1 ? "s" : ""} notified.`
        : `${sname} reserved successfully!`;

      setToast({ msg, type: "success" });
      setTimeout(onClose, 2500);
    } catch (err) {
      const msg = err?.response?.data?.message || "Reservation failed. Please try again.";
      setToast({ msg, type: "error" });
    } finally {
      setSaving(false);
    }
  };

  // ── Derived booleans ───────────────────────────────────────────────────────
  const dateReady =
    bookingType === "single"
      ? !!selectedDate
      : !!(dateRange?.from && dateRange?.to);

  const hasConflict = !!(conflictInfo?.conflict);

  // The Reserve button is shown only when date + session are chosen.
  // If there IS a conflict, we show it clearly but still allow the admin to proceed
  // (the confirmation dialog makes the consequence explicit).
  const canReserve = dateReady && !!session;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Confirmation dialog */}
      {showConfirm && (
        <ConfirmDialog
          spotName={selectedSpotName}
          dateLabel={dateLabel()}
          session={session}
          hasConflict={hasConflict}
          conflictMsg={conflictInfo?.msg}
          onConfirm={handleConfirmed}
          onCancel={() => setShowConfirm(false)}
        />
      )}

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.msg}
          type={toast.type}
          onDone={() => setToast(null)}
        />
      )}

      <div
        style={{
          background: "#f0f9ff",
          border: "1.5px solid #bae6fd",
          borderRadius: 20,
          padding: 24,
          marginBottom: 4,
          animation: "fadeSlideIn 0.25s ease",
        }}
      >
        {/* ── Panel Header ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <CalendarIcon size={18} color="#0284c7" />
              <span style={{ fontWeight: 700, fontSize: 15, color: "#0c4a6e" }}>
                Admin Priority Reservation
              </span>
            </div>
            <div style={{ fontSize: 12, color: "#0284c7", marginTop: 3, marginLeft: 26 }}>
              Spot: {selectedSpotName || "Not selected"}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* Spot selector */}
            <select
              value={selectedSpotId}
              onChange={(e) => {
                const opt = e.target.options[e.target.selectedIndex];
                setSelectedSpotId(e.target.value);
                setSelectedSpotName(opt.text);
                setSelectedDate(null);
                setDateRange({ from: null, to: null });
                setConflictInfo(null);
                setSession("");
              }}
              style={{
                padding: "8px 14px", borderRadius: 10,
                border: "1.5px solid #7dd3fc", background: "white",
                color: "#0c4a6e", fontWeight: 700, fontSize: 12,
                outline: "none", cursor: "pointer",
              }}
            >
              <option value="">Select Spot</option>
              {spots.map((s) => (
                <option key={s.spot_id} value={s.spot_id}>{s.name}</option>
              ))}
            </select>

            {/* Single / Range selector */}
            <select
              value={bookingType}
              onChange={(e) => {
                setBookingType(e.target.value);
                setSelectedDate(null);
                setDateRange({ from: null, to: null });
                setConflictInfo(null);
                setSession("");
              }}
              style={{
                padding: "8px 14px", borderRadius: 10,
                border: "1.5px solid #cbd5e1", background: "white",
                color: "#475569", fontWeight: 600, fontSize: 12,
                outline: "none", cursor: "pointer",
              }}
            >
              <option value="single">Single Day</option>
              <option value="range">Multiple Days</option>
            </select>
          </div>
        </div>

        {/* ── Body ── */}
        {!selectedSpotId ? (
          <div style={{ textAlign: "center", padding: "32px 0", border: "1.5px dashed #bae6fd", borderRadius: 14, background: "rgba(255,255,255,0.5)" }}>
            <MapPin size={28} color="#bae6fd" style={{ margin: "0 auto 8px" }} />
            <div style={{ color: "#94a3b8", fontWeight: 600, fontSize: 13 }}>
              Please select a spot first
            </div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: 20 }}>

            {/* Calendar */}
            <div style={{ background: "white", borderRadius: 16, padding: 16, border: "1px solid #e0f2fe", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
              <DayPicker
                mode={bookingType === "single" ? "single" : "range"}
                selected={bookingType === "single" ? selectedDate : dateRange}
                onSelect={handleDateSelect}
                disabled={(d) => d < today}
              />
            </div>

            {/* Right panel */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

              {/* ── Conflict banner ── */}
              {hasConflict && (
                <div style={{ background: "#fef2f2", border: "1.5px solid #fca5a5", borderRadius: 14, padding: 16 }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <AlertTriangle size={18} color="#dc2626" style={{ flexShrink: 0, marginTop: 1 }} />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 12, color: "#dc2626", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>
                        Conflict Detected
                      </div>
                      <div style={{ fontSize: 13, color: "#7f1d1d" }}>
                        {conflictInfo.msg || "An event is already booked on this date."}
                      </div>
                      <div style={{ fontSize: 12, color: "#991b1b", marginTop: 8, paddingTop: 8, borderTop: "1px solid #fca5a5" }}>
                        You can still reserve — a confirmation dialog will explain what happens to the existing booking before anything is changed.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Selected date badge ── */}
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

              {/* ── Session picker ── */}
              {dateReady && (
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>
                    Select Session
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {[
                      { val: "day",      label: "Day",        sub: "Morning to afternoon" },
                      { val: "night",    label: "Night",      sub: "Evening to midnight" },
                      { val: "day+night",label: "Day & Night",sub: "Full day" },
                    ].map(({ val, label, sub }) => (
                      <label
                        key={val}
                        onClick={() => setSession(val)}
                        style={{
                          display: "flex", alignItems: "center", gap: 12,
                          padding: "12px 16px", borderRadius: 12, cursor: "pointer",
                          border: `1.5px solid ${session === val ? "#7dd3fc" : "#e2e8f0"}`,
                          background: session === val ? "#f0f9ff" : "white",
                          transition: "all 0.15s",
                        }}
                      >
                        <input
                          type="radio"
                          name="reserve-session"
                          value={val}
                          checked={session === val}
                          onChange={() => setSession(val)}
                          style={{ accentColor: "#0284c7", width: 16, height: 16 }}
                        />
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 13, color: "#0c4a6e" }}>{label}</div>
                          <div style={{ fontSize: 11, color: "#94a3b8" }}>{sub}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Reserve Button ── */}
              {canReserve && (
                <button
                  onClick={handleReserve}
                  disabled={saving}
                  style={{
                    width: "100%", padding: "14px", borderRadius: 14,
                    border: "none",
                    background: saving ? "#94a3b8" : hasConflict ? "#dc2626" : "#0284c7",
                    color: "white", fontWeight: 800, fontSize: 15,
                    cursor: saving ? "not-allowed" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    boxShadow: saving ? "none" : hasConflict ? "0 4px 14px rgba(220,38,38,0.35)" : "0 4px 14px rgba(2,132,199,0.35)",
                    transition: "all 0.2s",
                    marginTop: "auto",
                  }}
                >
                  {saving && <Loader2 size={16} className="animate-spin" />}
                  {saving
                    ? "Reserving..."
                    : hasConflict
                      ? `Override & Reserve ${selectedSpotName}`
                      : `Reserve ${selectedSpotName}`}
                </button>
              )}

              {/* ── Empty state ── */}
              {!dateReady && (
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