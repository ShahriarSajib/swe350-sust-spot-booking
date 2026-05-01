import {
  Camera,
  Check,
  ImagePlus,
  Loader2,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { adminApi } from "./adminApi";
import Toast from "./Toast";

const SpotManagement = () => {
  const [spots, setSpots] = useState([]);
  const [activeSpot, setActiveSpot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const [form, setForm] = useState({
    name: "",
    location: "",
    capacity: "",
    max_booking: "",
    description: "",
    rules: "",
  });
  const [mainImage, setMainImage] = useState(null);
  const [gallery, setGallery] = useState([null, null]);
  const [recipients, setRecipients] = useState([
    { recipient_name: "", recipient_email: "" },
  ]);

  const mainRef = useRef(null);
  const galleryRefs = [useRef(null), useRef(null)];
  const API_URL = "http://localhost:5000";

  const fetchSpots = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi().get("/spots");
      setSpots(res.data || []);
    } catch {
      setToast({ msg: "Failed to load spots", type: "error" });
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSpots();
  }, [fetchSpots]);

  useEffect(() => {
    if (!activeSpot) {
      setForm({
        name: "",
        location: "",
        capacity: "",
        max_booking: "",
        description: "",
        rules: "",
      });
      setMainImage(null);
      setGallery([null, null]);
      setRecipients([{ recipient_name: "", recipient_email: "" }]);
      return;
    }
    setForm({
      name: activeSpot.name || "",
      location: activeSpot.location || "",
      capacity: activeSpot.capacity || "",
      max_booking: activeSpot.max_booking || "",
      description: activeSpot.description || "",
      rules: activeSpot.rules || "",
    });
    setMainImage(
      activeSpot.image1 ? `${API_URL}/uploads/${activeSpot.image1}` : null,
    );
    setGallery([
      activeSpot.image2 ? `${API_URL}/uploads/${activeSpot.image2}` : null,
      activeSpot.image3 ? `${API_URL}/uploads/${activeSpot.image3}` : null,
    ]);
    adminApi()
      .get(`/spots/${activeSpot.spot_id}/recipients`)
      .then((r) =>
        setRecipients(
          r.data.length
            ? r.data.map((x) => ({
                recipient_name: x.recipient_designation || "",
                recipient_email: x.recipient_email || "",
              }))
            : [{ recipient_name: "", recipient_email: "" }],
        ),
      )
      .catch(() =>
        setRecipients([{ recipient_name: "", recipient_email: "" }]),
      );
  }, [activeSpot]);

  const handleSave = async () => {
    if (!form.name.trim()) {
      setToast({ msg: "Spot name is required", type: "error" });
      return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (mainImage instanceof File) fd.append("image1", mainImage);
      if (gallery[0] instanceof File) fd.append("image2", gallery[0]);
      if (gallery[1] instanceof File) fd.append("image3", gallery[1]);

      let spotId;
      if (activeSpot) {
        await adminApi().put(`/spots/${activeSpot.spot_id}`, fd);
        spotId = activeSpot.spot_id;
      } else {
        const res = await adminApi().post("/spots", fd);
        spotId = res.data.spot_id;
      }

      await adminApi().put(`/spots/${spotId}/recipients`, { recipients });
      setToast({ msg: "Spot saved successfully!", type: "success" });
      await fetchSpots();
      if (!activeSpot && spotId) {
        const fresh = await adminApi().get(`/spots/${spotId}`);
        setActiveSpot(fresh.data);
      }
    } catch {
      setToast({ msg: "Save failed. Try again.", type: "error" });
    }
    setSaving(false);
  };

  const handleDelete = async (spotId) => {
    if (!window.confirm("Delete this spot permanently?")) return;
    try {
      await adminApi().delete(`/spots/${spotId}`);
      setToast({ msg: "Spot deleted", type: "success" });
      setActiveSpot(null);
      await fetchSpots();
    } catch {
      setToast({ msg: "Delete failed", type: "error" });
    }
  };

  const imgSrc = (img) =>
    img instanceof File ? URL.createObjectURL(img) : img;

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
        <h1 className="section-title">Spot Management</h1>
        <p className="section-subtitle">
          Configure venues, images, and approval recipients
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {loading ? (
          <div style={{ color: "var(--text3)", fontSize: 13 }}>Loading...</div>
        ) : (
          spots.map((s) => (
            <button
              key={s.spot_id}
              className={`spot-tab ${activeSpot?.spot_id === s.spot_id ? "active" : ""}`}
              onClick={() => setActiveSpot(s)}
            >
              {s.name}
            </button>
          ))
        )}
        <button
          className="spot-tab"
          style={{ borderColor: "rgba(34,197,94,0.3)", color: "var(--green)" }}
          onClick={() => setActiveSpot(null)}
        >
          + New Spot
        </button>
      </div>

      {/* Form */}
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20 }}
      >
        {/* LEFT: Form Fields */}
        <div className="glass" style={{ borderRadius: 20, padding: 28 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "var(--text)",
              marginBottom: 20,
            }}
          >
            {activeSpot ? `Editing: ${activeSpot.name}` : "Create New Spot"}
          </div>

          {/* Main Image */}
          <div style={{ marginBottom: 20 }}>
            <label
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "var(--text3)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                display: "block",
                marginBottom: 8,
              }}
            >
              Cover Image
            </label>
            <div
              style={{
                position: "relative",
                height: 200,
                borderRadius: 14,
                overflow: "hidden",
                background: "var(--bg2)",
              }}
            >
              {mainImage ? (
                <img
                  src={imgSrc(mainImage)}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  alt="Cover"
                />
              ) : (
                <div className="image-drop h-full" style={{ height: "100%" }}>
                  <Camera
                    size={24}
                    color="var(--text3)"
                    style={{ marginBottom: 6 }}
                  />
                  <span style={{ fontSize: 12, color: "var(--text3)" }}>
                    Click to upload cover image
                  </span>
                </div>
              )}
              <button
                className="btn-ghost"
                onClick={() => mainRef.current.click()}
                style={{
                  position: "absolute",
                  bottom: 10,
                  right: 10,
                  padding: "6px 14px",
                  borderRadius: 8,
                  fontSize: 11,
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  background: "rgba(168, 182, 214, 0.8)",
                }}
              >
                <Camera size={12} /> Change
              </button>
              <input
                type="file"
                hidden
                ref={mainRef}
                accept="image/*"
                onChange={(e) =>
                  e.target.files[0] && setMainImage(e.target.files[0])
                }
              />
            </div>
          </div>

          {/* Gallery */}
          <div style={{ marginBottom: 20 }}>
            <label
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "var(--text3)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                display: "block",
                marginBottom: 8,
              }}
            >
              Gallery (2 images)
            </label>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
              }}
            >
              {[0, 1].map((i) => (
                <div
                  key={i}
                  style={{
                    position: "relative",
                    height: 110,
                    borderRadius: 10,
                    overflow: "hidden",
                    background: "var(--bg2)",
                  }}
                >
                  {gallery[i] ? (
                    <>
                      <img
                        src={imgSrc(gallery[i])}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        alt={`Gallery ${i}`}
                      />
                      <button
                        onClick={() =>
                          setGallery((p) => {
                            const n = [...p];
                            n[i] = null;
                            return n;
                          })
                        }
                        style={{
                          position: "absolute",
                          top: 6,
                          right: 6,
                          background: "rgba(239,68,68,0.9)",
                          border: "none",
                          borderRadius: 6,
                          padding: 4,
                          cursor: "pointer",
                          display: "flex",
                        }}
                      >
                        <X size={12} color="white" />
                      </button>
                    </>
                  ) : (
                    <div
                      className="image-drop"
                      style={{ height: "100%", cursor: "pointer" }}
                      onClick={() => galleryRefs[i].current.click()}
                    >
                      <ImagePlus
                        size={18}
                        color="var(--text3)"
                        style={{ marginBottom: 4 }}
                      />
                      <span style={{ fontSize: 10, color: "var(--text3)" }}>
                        Image {i + 1}
                      </span>
                    </div>
                  )}
                  <input
                    type="file"
                    hidden
                    ref={galleryRefs[i]}
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files[0])
                        setGallery((p) => {
                          const n = [...p];
                          n[i] = e.target.files[0];
                          return n;
                        });
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Text Fields */}
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}
          >
            {[
              {
                key: "name",
                label: "Spot Name",
                placeholder: "e.g. Central Field",
              },
              {
                key: "location",
                label: "Location",
                placeholder: "e.g. East Campus",
              },
              { key: "capacity", label: "Capacity", placeholder: "e.g. 10000" },
              {
                key: "max_booking",
                label: "Max Booking Days",
                placeholder: "e.g. 7",
              },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "var(--text3)",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  {label}
                </label>
                <input
                  className="input-field"
                  value={form[key] || ""}
                  placeholder={placeholder}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, [key]: e.target.value }))
                  }
                />
              </div>
            ))}
            <div style={{ gridColumn: "1 / -1" }}>
              <label
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "var(--text3)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  display: "block",
                  marginBottom: 6,
                }}
              >
                Description
              </label>
              <textarea
                className="input-field"
                style={{ resize: "vertical", minHeight: 80 }}
                value={form.description || ""}
                placeholder="Describe the spot..."
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
              />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "var(--text3)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  display: "block",
                  marginBottom: 6,
                }}
              >
                Rules & Instructions
              </label>
              <textarea
                className="input-field"
                style={{ resize: "vertical", minHeight: 80 }}
                value={form.rules || ""}
                placeholder="1. No littering..."
                onChange={(e) =>
                  setForm((p) => ({ ...p, rules: e.target.value }))
                }
              />
            </div>
          </div>

          {/* Actions */}
          <div
            className="flex items-center justify-between mt-6"
            style={{ paddingTop: 20, borderTop: "1px solid var(--border)" }}
          >
            {activeSpot && (
              <button
                onClick={() => handleDelete(activeSpot.spot_id)}
                style={{
                  padding: "8px 16px",
                  borderRadius: 10,
                  fontSize: 12,
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  background: "rgba(239,68,68,0.1)",
                  color: "var(--red)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  cursor: "pointer",
                }}
              >
                <Trash2 size={13} /> Delete Spot
              </button>
            )}
            <button
              className="btn-primary"
              disabled={saving}
              style={{
                marginLeft: "auto",
                padding: "10px 24px",
                borderRadius: 12,
                fontSize: 13,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 8,
                opacity: saving ? 0.7 : 1,
              }}
              onClick={handleSave}
            >
              {saving ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Check size={14} />
              )}
              {saving ? "Saving..." : "Save Spot"}
            </button>
          </div>
        </div>

        {/* RIGHT: Recipients */}
        <div
          className="glass"
          style={{ borderRadius: 20, padding: 24, alignSelf: "start" }}
        >
          <div style={{ marginBottom: 16 }}>
            <div
              style={{
                fontWeight: 700,
                fontSize: 13,
                color: "var(--text)",
                marginBottom: 4,
              }}
            >
              Approval Recipients
            </div>
            <div style={{ fontSize: 11, color: "var(--text3)" }}>
              These receive approval letter copies
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {recipients.map((r, i) => (
              <div
                key={i}
                style={{
                  background: "var(--bg2)",
                  borderRadius: 10,
                  padding: 12,
                  border: "1px solid var(--border)",
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: "var(--text3)",
                      fontFamily: "JetBrains Mono",
                    }}
                  >
                    #{i + 1}
                  </span>
                  {recipients.length > 1 && (
                    <button
                      onClick={() =>
                        setRecipients((p) => p.filter((_, j) => j !== i))
                      }
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--red)",
                        cursor: "pointer",
                        padding: 2,
                      }}
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 6 }}
                >
                  <input
                    className="input-field"
                    placeholder="Name / Designation"
                    value={r.recipient_name}
                    onChange={(e) =>
                      setRecipients((p) =>
                        p.map((x, j) =>
                          j === i
                            ? { ...x, recipient_name: e.target.value }
                            : x,
                        ),
                      )
                    }
                  />
                  <input
                    className="input-field"
                    placeholder="email@sust.edu"
                    value={r.recipient_email}
                    onChange={(e) =>
                      setRecipients((p) =>
                        p.map((x, j) =>
                          j === i
                            ? { ...x, recipient_email: e.target.value }
                            : x,
                        ),
                      )
                    }
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            className="btn-ghost"
            style={{
              width: "100%",
              marginTop: 12,
              padding: "8px",
              borderRadius: 10,
              fontSize: 12,
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
            }}
            onClick={() =>
              setRecipients((p) => [
                ...p,
                { recipient_name: "", recipient_email: "" },
              ])
            }
          >
            <Plus size={13} /> Add Recipient
          </button>
        </div>
      </div>
    </div>
  );
};

export default SpotManagement;
