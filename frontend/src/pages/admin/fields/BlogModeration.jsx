import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  FileText, Eye, X, CheckCircle, XCircle, Trash2, MessageSquare,
  Clock, Image as ImageIcon, AlignLeft, Tag, User, MapPin,
  Calendar, BookOpen, ChevronRight, Layers,
} from "lucide-react";
import { adminApi } from "./adminApi";
import Toast from "./Toast";

const imgUrl = (path) =>
  path ? `http://localhost:5000/uploads/${path}` : null;

const parseTags = (raw) =>
  raw ? raw.split(",").map((t) => t.trim()).filter(Boolean) : [];

const fmtDate = (raw) =>
  raw ? new Date(raw).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "";

const normaliseCard = (b) => ({
  id:          b.blog_id,
  title:       b.blog_title,
  summary:     b.summary    || "",
  story:       b.story_details || "",
  author:      b.author     || "Unknown",
  date:        fmtDate(b.submitted_at),
  publishedAt: fmtDate(b.published_at),
  image:       imgUrl(b.cover_image),
  spot:        b.spot_name  || "",
  eventdate:   b.event_date?.split("T")[0] || "",
  tags:        parseTags(b.tags),
  status:      b.blog_status || "",
  content:     [],
});

// ─── Pill / Badge ────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const cfg = {
    published: { bg: "rgba(34,197,94,0.12)", color: "#16a34a", border: "rgba(34,197,94,0.25)" },
    pending:   { bg: "rgba(234,179,8,0.12)",  color: "#b45309", border: "rgba(234,179,8,0.25)" },
    rejected:  { bg: "rgba(239,68,68,0.12)",  color: "#dc2626", border: "rgba(239,68,68,0.25)" },
  };
  const s = cfg[status] || cfg.pending;
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em",
      padding: "3px 10px", borderRadius: 20,
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
    }}>{status}</span>
  );
};

// ─── Section heading inside modal ───────────────────────────────────────────
const ModalSection = ({ icon, label, children }) => (
  <div style={{ marginBottom: 28 }}>
    <div style={{
      display: "flex", alignItems: "center", gap: 7, marginBottom: 14,
      paddingBottom: 8, borderBottom: "1px solid var(--border)",
    }}>
      <span style={{ color: "var(--accent)", opacity: 0.8 }}>{icon}</span>
      <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text3)" }}>{label}</span>
    </div>
    {children}
  </div>
);

// ─── Meta chip ───────────────────────────────────────────────────────────────
const MetaChip = ({ icon, label, value, accent }) => (
  <div style={{
    display: "flex", alignItems: "center", gap: 8, padding: "9px 14px",
    borderRadius: 10, background: "var(--surface)", border: "1px solid var(--border)",
    flex: "1 1 160px",
  }}>
    <span style={{ color: accent || "var(--text3)", flexShrink: 0 }}>{icon}</span>
    <div>
      <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text3)", marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{value || "—"}</div>
    </div>
  </div>
);

// ─── Main Component ──────────────────────────────────────────────────────────
const BlogModeration = () => {
  const [activeTab,      setActiveTab]      = useState("blogs");
  const [blogStatus,     setBlogStatus]     = useState("pending");
  const [pendingBlogs,   setPendingBlogs]   = useState([]);
  const [publishedBlogs, setPublishedBlogs] = useState([]);
  const [feedbacks,      setFeedbacks]      = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [selectedBlog,   setSelectedBlog]   = useState(null);
  const [detailLoading,  setDetailLoading]  = useState(false);
  const [toast,          setToast]          = useState(null);
  const [activeSection,  setActiveSection]  = useState("overview"); // modal tab

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const [pRes, pubRes] = await Promise.all([
        adminApi().get("/blogs?status=pending"),
        adminApi().get("/blogs?status=published"),
      ]);
      setPendingBlogs((pRes.data   || []).map(normaliseCard));
      setPublishedBlogs((pubRes.data || []).map(normaliseCard));
    } catch {}
    finally { setLoading(false); }
  }, []);

  const fetchFeedbacks = useCallback(async () => {
    try {
      const res = await adminApi().get("/feedbacks");
      setFeedbacks(
        (res.data || []).map((fb) => ({
          id:      fb.event_id,
          user:    fb.user_name  || "Anonymous",
          message: fb.feedback   || "",
          date:    fb.event_date?.split("T")[0] || "",
          spot:    fb.spot_name  || "",
          title:   fb.event_title || "",
        }))
      );
    } catch {}
  }, []);

  useEffect(() => { fetchBlogs(); fetchFeedbacks(); }, [fetchBlogs, fetchFeedbacks]);

  const openBlogDetail = useCallback(async (card) => {
    setSelectedBlog({ ...card });
    setActiveSection("overview");
    setDetailLoading(true);

    try {
      const res = await adminApi().get(`/blogs/${card.id}`);
      const b   = res.data;
      setSelectedBlog({
        ...normaliseCard(b),
        content: (b.content || []).map((c) => ({
          type:                c.content_type,
          time:                c.activity_time        || "",
          activityTitle:       c.activity_title       || "",
          activityDescription: c.activity_description || "",
          imagePath:           imgUrl(c.image_path),
          imageCaption:        c.image_caption        || "",
        })),
      });
    } catch (err) {
      if (err?.response?.status !== 404) {
        setToast({ msg: "Could not load full blog details", type: "error" });
      }
    } finally {
      setDetailLoading(false);
    }
  }, []);

  const handlePublish = async (id) => {
    try {
      await adminApi().post(`/blogs/${id}/publish`);
      await fetchBlogs();
      setSelectedBlog(null);
      setToast({ msg: "Blog published!", type: "success" });
    } catch { setToast({ msg: "Publish failed", type: "error" }); }
  };

  const handleReject = async (id) => {
    try {
      await adminApi().post(`/blogs/${id}/reject`);
      await fetchBlogs();
      setSelectedBlog(null);
      setToast({ msg: "Blog rejected", type: "success" });
    } catch { setToast({ msg: "Reject failed", type: "error" }); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this blog permanently?")) return;
    try {
      await adminApi().delete(`/blogs/${id}`);
      await fetchBlogs();
      setSelectedBlog(null);
      setToast({ msg: "Blog deleted", type: "success" });
    } catch { setToast({ msg: "Delete failed", type: "error" }); }
  };

  const currentBlogs  = blogStatus === "pending" ? pendingBlogs : publishedBlogs;
  const isPublished   = selectedBlog ? publishedBlogs.some((b) => b.id === selectedBlog.id) : false;
  const scheduleItems = (selectedBlog?.content || []).filter((c) => c.type === "schedule");
  const photoItems    = (selectedBlog?.content || []).filter((c) => c.type === "image");

  // tabs available in modal
  const modalTabs = [
    { key: "overview", label: "Overview",  icon: <BookOpen size={12} /> },
    ...(scheduleItems.length ? [{ key: "schedule", label: "Schedule", icon: <Clock size={12} /> }] : []),
    ...(selectedBlog?.story  ? [{ key: "story",    label: "Story",    icon: <AlignLeft size={12} /> }] : []),
    ...(photoItems.length    ? [{ key: "photos",   label: "Photos",   icon: <ImageIcon size={12} /> }] : []),
  ];

  return (
    <div>
      {toast && <Toast message={toast.msg} type={toast.type} onDone={() => setToast(null)} />}

      {/* Header */}
      <div className="section-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="section-title">Blog Moderation</h1>
            <p className="section-subtitle">Review posts and manage community content</p>
          </div>
          <div className="flex gap-2" style={{ background: "var(--surface)", padding: "4px", borderRadius: 12, border: "1px solid var(--border)" }}>
            {[
              { key: "blogs",     icon: <FileText size={13} />,     label: "Blogs" },
              { key: "feedbacks", icon: <MessageSquare size={13} />, label: "Feedbacks" },
            ].map(({ key, icon, label }) => (
              <button key={key} onClick={() => setActiveTab(key)} style={{
                padding: "8px 18px", borderRadius: 9, fontSize: 12, fontWeight: 600,
                cursor: "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", gap: 6,
                background: activeTab === key ? "var(--accent)" : "transparent",
                color: activeTab === key ? "white" : "var(--text2)", border: "none",
              }}>
                {icon} {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Status pills */}
      {activeTab === "blogs" && (
        <div className="flex gap-2 mb-6">
          {["pending", "published"].map((s) => (
            <button key={s} onClick={() => setBlogStatus(s)} style={{
              padding: "7px 18px", borderRadius: 20, fontSize: 11, fontWeight: 700,
              cursor: "pointer", textTransform: "capitalize", letterSpacing: "0.05em",
              background: blogStatus === s ? (s === "pending" ? "rgba(234,179,8,0.15)" : "rgba(34,197,94,0.15)") : "var(--surface)",
              color: blogStatus === s ? (s === "pending" ? "var(--yellow)" : "var(--green)") : "var(--text3)",
              border: `1px solid ${blogStatus === s ? (s === "pending" ? "rgba(234,179,8,0.3)" : "rgba(34,197,94,0.3)") : "var(--border)"}`,
            }}>
              {s === "pending" ? "Pending" : "Published"} ({s === "pending" ? pendingBlogs.length : publishedBlogs.length})
            </button>
          ))}
        </div>
      )}

      {/* Blog grid */}
      {loading && activeTab === "blogs" ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text3)" }}>Loading blogs...</div>
      ) : activeTab === "blogs" ? (
        currentBlogs.length === 0 ? (
          <div className="glass" style={{ borderRadius: 20, padding: 60, textAlign: "center" }}>
            <FileText size={40} color="var(--text3)" style={{ margin: "0 auto 12px", opacity: 0.4 }} />
            <div style={{ color: "var(--text3)", fontSize: 14 }}>No {blogStatus} blogs</div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 20 }}>
            {currentBlogs.map((blog) => (
              <div key={blog.id} className="glass"
                style={{ borderRadius: 20, overflow: "hidden", display: "flex", flexDirection: "column", transition: "all 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--border2)")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}>

                <div style={{ height: 180, background: "var(--bg3)", overflow: "hidden", flexShrink: 0, position: "relative" }}>
                  {blog.image
                    ? <img src={blog.image} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt={blog.title} />
                    : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <FileText size={36} color="var(--text3)" style={{ opacity: 0.25 }} />
                      </div>}
                  {blog.status && (
                    <span style={{
                      position: "absolute", top: 10, right: 10,
                      fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em",
                      padding: "3px 9px", borderRadius: 20, color: "white",
                      background: blog.status === "published" ? "rgba(34,197,94,0.85)" : "rgba(234,179,8,0.85)",
                    }}>{blog.status}</span>
                  )}
                </div>

                <div style={{ padding: "18px 20px 20px", display: "flex", flexDirection: "column", flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: "var(--text)", lineHeight: 1.4, marginBottom: 8 }}>{blog.title}</div>

                  <div style={{ fontSize: 11, color: "var(--text3)", display: "flex", flexWrap: "wrap", gap: "3px 12px", marginBottom: 10 }}>
                    <span>By <span style={{ color: "var(--accent2)", fontWeight: 600 }}>{blog.author}</span></span>
                    {blog.spot      && <span>At <span style={{ color: "var(--accent2)", fontWeight: 600 }}>{blog.spot}</span></span>}
                    {blog.eventdate && <span style={{ fontFamily: "JetBrains Mono" }}>{blog.eventdate}</span>}
                    {blog.date      && <span>Submitted {blog.date}</span>}
                  </div>

                  {blog.tags?.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 10 }}>
                      {blog.tags.map((tag) => (
                        <span key={tag} style={{ fontSize: 10, padding: "2px 8px", borderRadius: 20, background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text3)" }}>{tag}</span>
                      ))}
                    </div>
                  )}

                  {blog.summary && (
                    <p style={{ fontSize: 12, color: "var(--text3)", lineHeight: 1.65, margin: "0 0 14px", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {blog.summary}
                    </p>
                  )}

                  <div style={{ marginTop: "auto", borderTop: "1px solid var(--border)", paddingTop: 14, display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <button onClick={() => openBlogDetail(blog)} style={{
                      padding: "6px 14px", borderRadius: 8, fontSize: 11, fontWeight: 600,
                      display: "flex", alignItems: "center", gap: 5, cursor: "pointer",
                      background: "var(--accent)", border: "none", color: "white",
                    }}>
                      <Eye size={12} /> View
                    </button>
                    {blogStatus === "pending" ? (
                      <>
                        <button onClick={() => handlePublish(blog.id)} style={{ padding: "6px 14px", borderRadius: 8, fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", gap: 5, cursor: "pointer", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", color: "var(--green)" }}>
                          <CheckCircle size={12} /> Publish
                        </button>
                        <button onClick={() => handleReject(blog.id)} style={{ padding: "6px 14px", borderRadius: 8, fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", gap: 5, cursor: "pointer", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "var(--red)" }}>
                          <XCircle size={12} /> Reject
                        </button>
                      </>
                    ) : (
                      <button onClick={() => handleDelete(blog.id)} style={{ padding: "6px 14px", borderRadius: 8, fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", gap: 5, cursor: "pointer", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "var(--red)" }}>
                        <Trash2 size={12} /> Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
          {feedbacks.map((fb) => (
            <div key={fb.id} className="glass" style={{ borderRadius: 16, padding: 20, borderLeft: "3px solid var(--accent)" }}>
              <div className="flex items-center gap-3 mb-4">
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(79,110,247,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontWeight: 800, fontSize: 14, color: "var(--accent2)" }}>{fb.user.charAt(0)}</span>
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13, color: "var(--text)" }}>{fb.user}</div>
                  <div style={{ fontSize: 11, color: "var(--text3)", fontFamily: "JetBrains Mono" }}>{fb.date}</div>
                </div>
              </div>
              <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 12, display: "flex", flexDirection: "column", gap: 3 }}>
                {fb.title && <span>Event: <span style={{ color: "var(--accent2)" }}>{fb.title}</span></span>}
                {fb.spot  && <span>Spot: <span style={{ color: "var(--accent2)" }}>{fb.spot}</span></span>}
              </div>
              <div style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.6, fontStyle: "italic" }}>"{fb.message}"</div>
            </div>
          ))}
          {feedbacks.length === 0 && (
            <div className="glass" style={{ gridColumn: "1/-1", borderRadius: 20, padding: 60, textAlign: "center" }}>
              <MessageSquare size={40} color="var(--text3)" style={{ margin: "0 auto 12px", opacity: 0.3 }} />
              <div style={{ color: "var(--text3)" }}>No feedbacks yet</div>
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          DETAIL MODAL — fully rich view
      ═══════════════════════════════════════════════════════════════ */}
      {selectedBlog && createPortal(
        <div
          className="modal-overlay"
          onClick={(e) => e.target === e.currentTarget && setSelectedBlog(null)}
          style={{ zIndex: 9999 }}
        >
          <div style={{
            background: "var(--bg2)",
            borderRadius: 24,
            width: "100%",
            maxWidth: 760,
            maxHeight: "94vh",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            border: "1px solid var(--border2)",
            boxShadow: "0 24px 80px rgba(0,0,0,0.35)",
          }}>

            {/* ── Cover image (hero) ── */}
            <div style={{ height: 260, overflow: "hidden", flexShrink: 0, position: "relative", background: "var(--bg3)" }}>
              {selectedBlog.image
                ? <img src={selectedBlog.image} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt={selectedBlog.title} />
                : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <FileText size={48} color="var(--text3)" style={{ opacity: 0.2 }} />
                  </div>
              }
              {/* Gradient overlay for legibility */}
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 55%)" }} />

              {/* Loading indicator over cover */}
              {detailLoading && (
                <div style={{ position: "absolute", top: 14, left: 14, background: "rgba(0,0,0,0.55)", borderRadius: 20, padding: "5px 12px", fontSize: 11, color: "white" }}>
                  Loading full details…
                </div>
              )}

              {/* Status + close in top-right */}
              <div style={{ position: "absolute", top: 14, right: 14, display: "flex", gap: 8, alignItems: "center" }}>
                <StatusBadge status={selectedBlog.status} />
                <button
                  onClick={() => setSelectedBlog(null)}
                  style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(0,0,0,0.45)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>
                  <X size={15} />
                </button>
              </div>

              {/* Title overlaid on cover */}
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 28px 20px" }}>
                <h2 style={{ margin: 0, fontWeight: 800, fontSize: 22, color: "white", lineHeight: 1.3, textShadow: "0 1px 6px rgba(0,0,0,0.4)" }}>
                  {selectedBlog.title}
                </h2>
              </div>
            </div>

            {/* ── Scrollable body ── */}
            <div style={{ overflowY: "auto", flex: 1 }}>
              <div style={{ padding: "24px 28px 32px" }}>

                {/* ── Meta chips ── */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 24 }}>
                  <MetaChip icon={<User size={14} />}     label="Author"     value={selectedBlog.author}    accent="var(--accent2)" />
                  <MetaChip icon={<MapPin size={14} />}   label="Spot"       value={selectedBlog.spot}      accent="#10b981" />
                  <MetaChip icon={<Calendar size={14} />} label="Event Date" value={selectedBlog.eventdate} accent="#f59e0b" />
                  <MetaChip icon={<Clock size={14} />}    label="Submitted"  value={selectedBlog.date}      accent="var(--text3)" />
                  {selectedBlog.publishedAt && (
                    <MetaChip icon={<CheckCircle size={14} />} label="Published" value={selectedBlog.publishedAt} accent="#16a34a" />
                  )}
                </div>

                {/* ── Tags ── */}
                {/* {selectedBlog.tags?.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 7, alignItems: "center", marginBottom: 24 }}>
                    <Tag size={13} color="var(--text3)" />
                    {selectedBlog.tags.map((tag) => (
                      <span key={tag} style={{
                        fontSize: 11, padding: "4px 12px", borderRadius: 20,
                        background: "rgba(79,110,247,0.08)", border: "1px solid rgba(79,110,247,0.2)",
                        color: "var(--accent2)", fontWeight: 600,
                      }}>{tag}</span>
                    ))}
                  </div>
                )} */}

                {/* ── Internal nav tabs ── */}
                {modalTabs.length > 1 && (
                  <div style={{
                    display: "flex", gap: 4, marginBottom: 24,
                    background: "var(--surface)", borderRadius: 12, padding: 4,
                    border: "1px solid var(--border)",
                  }}>
                    {modalTabs.map(({ key, label, icon }) => (
                      <button key={key} onClick={() => setActiveSection(key)} style={{
                        flex: 1, padding: "8px 12px", borderRadius: 9, fontSize: 12, fontWeight: 600,
                        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                        border: "none", transition: "all 0.18s",
                        background: activeSection === key ? "var(--accent)" : "transparent",
                        color: activeSection === key ? "white" : "var(--text3)",
                      }}>
                        {icon} {label}
                      </button>
                    ))}
                  </div>
                )}

                {/* ══ OVERVIEW TAB ══ */}
                {activeSection === "overview" && (
                  <>
                    {/* Summary */}
                    {selectedBlog.summary ? (
                      <ModalSection icon={<AlignLeft size={13} />} label="Summary">
                        <p style={{ fontSize: 14, color: "var(--text2)", lineHeight: 1.8, margin: 0 }}>
                          {selectedBlog.summary}
                        </p>
                      </ModalSection>
                    ) : (
                      <div style={{ color: "var(--text3)", fontSize: 13, marginBottom: 24 }}>No summary provided.</div>
                    )}

                    {/* Quick stats row */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12, marginBottom: 24 }}>
                      {[
                        { label: "Schedule items", value: scheduleItems.length, icon: <Clock size={16} /> },
                        { label: "Photos",         value: photoItems.length,    icon: <ImageIcon size={16} /> },
                       // { label: "Tags",           value: selectedBlog.tags?.length || 0, icon: <Tag size={16} /> },
                      ].map(({ label, value, icon }) => (
                        <div key={label} style={{
                          background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12,
                          padding: "14px 16px", display: "flex", flexDirection: "column", gap: 6,
                        }}>
                          <div style={{ color: "var(--text3)" }}>{icon}</div>
                          <div style={{ fontSize: 22, fontWeight: 800, color: "var(--text)" }}>{value}</div>
                          <div style={{ fontSize: 11, color: "var(--text3)", fontWeight: 600 }}>{label}</div>
                        </div>
                      ))}
                    </div>

                    {/* Inline preview of story (first 300 chars) if exists */}
                    {selectedBlog.story && (
                      <ModalSection icon={<BookOpen size={13} />} label="Story Preview">
                        <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.8, margin: "0 0 10px", whiteSpace: "pre-wrap" }}>
                          {selectedBlog.story.slice(0, 300)}{selectedBlog.story.length > 300 ? "…" : ""}
                        </p>
                        {selectedBlog.story.length > 300 && (
                          <button
                            onClick={() => setActiveSection("story")}
                            style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600, color: "var(--accent2)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                            Read full story <ChevronRight size={13} />
                          </button>
                        )}
                      </ModalSection>
                    )}

                    {/* Inline photo preview strip */}
                    {photoItems.length > 0 && (
                      <ModalSection icon={<ImageIcon size={13} />} label="Photo Preview">
                        <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4 }}>
                          {photoItems.slice(0, 5).map((item, i) =>
                             item.imagePath ? (
                              <div key={i} style={{ flexShrink: 0, width: 110, borderRadius: 10, overflow: "hidden", aspectRatio: "4/3", background: "var(--bg3)" }}>
                                <img src={item.imagePath} alt={item.imageCaption || `Photo ${i + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                              </div>
                            ) : null
                          )}
                          {photoItems.length > 5 && (
                            <button
                              onClick={() => setActiveSection("photos")}
                              style={{ flexShrink: 0, width: 110, borderRadius: 10, background: "var(--surface)", border: "1px solid var(--border)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 6, aspectRatio: "4/3", color: "var(--text3)", fontSize: 12, fontWeight: 600 }}>
                              <ImageIcon size={18} />
                              +{photoItems.length - 5} more
                            </button>
                          )}
                        </div>
                      </ModalSection>
                    )}
                  </>
                )}

                {/* ══ SCHEDULE TAB ══ */}
                {activeSection === "schedule" && (
                  <ModalSection icon={<Clock size={13} />} label="Event Schedule">
                    {scheduleItems.length === 0 ? (
                      <div style={{ color: "var(--text3)", fontSize: 13 }}>No schedule items.</div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                        {scheduleItems.map((item, i) => (
                          <div key={i} style={{ display: "flex", gap: 0, position: "relative" }}>
                            {/* Time column */}
                            <div style={{ width: 72, flexShrink: 0, paddingTop: 2, paddingRight: 14, textAlign: "right" }}>
                              {item.time && (
                                <span style={{ fontSize: 11, fontFamily: "JetBrains Mono", color: "var(--accent2)", fontWeight: 700 }}>
                                  {item.time}
                                </span>
                              )}
                            </div>

                            {/* Timeline line + dot */}
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginRight: 16, flexShrink: 0 }}>
                              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--accent)", marginTop: 4, flexShrink: 0, zIndex: 1 }} />
                              {i < scheduleItems.length - 1 && (
                                <div style={{ width: 2, flex: 1, background: "var(--border2)", minHeight: 28, marginTop: 2 }} />
                              )}
                            </div>

                            {/* Content */}
                            <div style={{ flex: 1, paddingBottom: i < scheduleItems.length - 1 ? 20 : 0 }}>
                              {item.activityTitle && (
                                <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text)", marginBottom: 4 }}>{item.activityTitle}</div>
                              )}
                              {item.activityDescription && (
                                <div style={{ fontSize: 12, color: "var(--text3)", lineHeight: 1.65 }}>{item.activityDescription}</div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </ModalSection>
                )}

                {/* ══ STORY TAB ══ */}
                {activeSection === "story" && (
                  <ModalSection icon={<BookOpen size={13} />} label="Full Story">
                    {selectedBlog.story ? (
                      <p style={{ fontSize: 14, color: "var(--text2)", lineHeight: 1.9, margin: 0, whiteSpace: "pre-wrap" }}>
                        {selectedBlog.story}
                      </p>
                    ) : (
                      <div style={{ color: "var(--text3)", fontSize: 13 }}>No story details provided.</div>
                    )}
                  </ModalSection>
                )}

                {/* ══ PHOTOS TAB ══ */}
                {activeSection === "photos" && (
                  <ModalSection icon={<ImageIcon size={13} />} label={`Photos (${photoItems.length})`}>
                    {photoItems.length === 0 ? (
                      <div style={{ color: "var(--text3)", fontSize: 13 }}>No photos.</div>
                    ) : (
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
                        {photoItems.map((item, i) =>
                          item.imagePath ? (
                            <div key={i}>
                              <div style={{ borderRadius: 12, overflow: "hidden", aspectRatio: "4/3", background: "var(--bg3)", border: "1px solid var(--border)" }}>
                                <img
                                  src={item.imagePath}
                                  alt={item.imageCaption || `Photo ${i + 1}`}
                                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                                />
                              </div>
                              {item.imageCaption && (
                                <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 6, textAlign: "center", fontStyle: "italic" }}>
                                  {item.imageCaption}
                                </div>
                              )}
                            </div>
                          ) : null
                        )}
                      </div>
                    )}
                  </ModalSection>
                )}

              </div>
            </div>

            {/* ── Footer action bar ── */}
            <div style={{
              padding: "16px 28px 20px",
              borderTop: "1px solid var(--border)",
              display: "flex", gap: 10, background: "var(--bg2)",
              flexShrink: 0,
            }}>
              {!isPublished && selectedBlog.status !== "rejected" && (
                <button onClick={() => handlePublish(selectedBlog.id)} style={{
                  flex: 1, padding: "12px", borderRadius: 12, fontWeight: 700, fontSize: 13,
                  background: "var(--green)", border: "none", color: "white", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                }}>
                  <CheckCircle size={15} /> Publish
                </button>
              )}
              {selectedBlog.status === "pending" && (
                <button onClick={() => handleReject(selectedBlog.id)} style={{
                  flex: 1, padding: "12px", borderRadius: 12, fontWeight: 700, fontSize: 13,
                  background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "var(--red)", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                }}>
                  <XCircle size={15} /> Reject
                </button>
              )}
              {isPublished && (
                <button onClick={() => handleDelete(selectedBlog.id)} style={{
                  flex: 1, padding: "12px", borderRadius: 12, fontWeight: 700, fontSize: 13,
                  background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "var(--red)", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                }}>
                  <Trash2 size={15} /> Delete
                </button>
              )}
              <button
                onClick={() => setSelectedBlog(null)}
                className="btn-ghost"
                style={{ flex: 1, padding: "12px", borderRadius: 12, fontWeight: 700, fontSize: 13 }}>
                Close
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default BlogModeration;