import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  FileText, Eye, X, CheckCircle, XCircle, Trash2, MessageSquare,
  Clock, Image as ImageIcon, AlignLeft, Tag, User, MapPin,
  Calendar, BookOpen, ChevronRight, Layers,
} from "lucide-react";
import { adminApi } from "./adminApi";
import Toast from "./Toast";

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const imgUrl = (path) =>
  path ? `${API_BASE}/uploads/${path}` : null;

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
    published: "bg-emerald-500/12 text-emerald-600 border-emerald-500/25",
    pending:   "bg-amber-500/12 text-amber-700 border-amber-500/25",
    rejected:  "bg-red-500/12 text-red-600 border-red-500/25",
  };
  const s = cfg[status] || cfg.pending;
  return (
    <span className={`text-[10px] font-bold uppercase tracking-[0.08em] px-2.5 py-1 rounded-[20px] border ${s}`}>
      {status}
    </span>
  );
};

// ─── Section heading inside modal ───────────────────────────────────────────
const ModalSection = ({ icon, label, children }) => (
  <div className="mb-7">
    <div className="flex items-center gap-1.5 mb-3.5 pb-2 border-b border-[var(--border)]">
      <span className="text-[var(--accent)] opacity-80">{icon}</span>
      <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[var(--text3)]">{label}</span>
    </div>
    {children}
  </div>
);

// ─── Meta chip ───────────────────────────────────────────────────────────────
const MetaChip = ({ icon, label, value, accent }) => {
  const accentColorStyle = accent ? { color: accent } : {};
  return (
    <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-[10px] bg-[var(--surface)] border border-[var(--border)] flex-1 min-w-[160px]">
      <span style={accentColorStyle} className={!accent ? "text-[var(--text3)] shrink-0" : "shrink-0"}>{icon}</span>
      <div>
        <div className="text-[9px] font-bold uppercase tracking-[0.08em] text-[var(--text3)] mb-0.5">{label}</div>
        <div className="text-sm font-semibold text-[var(--text)]">{value || "—"}</div>
      </div>
    </div>
  );
};

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
          <div className="flex gap-2 bg-[var(--surface)] p-1 rounded-[12px] border border-[var(--border)]">
            {[
              { key: "blogs",     icon: <FileText size={13} />,     label: "Blogs" },
              { key: "feedbacks", icon: <MessageSquare size={13} />, label: "Feedbacks" },
            ].map(({ key, icon, label }) => (
              <button key={key} onClick={() => setActiveTab(key)} className={`px-[18px] py-2 rounded-[9px] text-[12px] font-semibold cursor-pointer transition-all duration-200 flex items-center gap-1.5 border-none ${activeTab === key ? "bg-[var(--accent)] text-white" : "bg-transparent text-[var(--text2)]"}`}>
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
            <button key={s} onClick={() => setBlogStatus(s)} className={`px-[18px] py-[7px] rounded-[20px] text-[11px] font-bold cursor-pointer capitalize tracking-[0.05em] border ${blogStatus === s ? (s === "pending" ? "bg-amber-500/15 text-[var(--yellow)] border-amber-500/30" : "bg-green-500/15 text-[var(--green)] border-green-500/30") : "bg-[var(--surface)] border-[var(--border)] text-[var(--text3)]"}`}>
              {s === "pending" ? "Pending" : "Published"} ({s === "pending" ? pendingBlogs.length : publishedBlogs.length})
            </button>
          ))}
        </div>
      )}

      {/* Blog grid */}
      {loading && activeTab === "blogs" ? (
        <div className="text-center py-[60px] text-[var(--text3)]">Loading blogs...</div>
      ) : activeTab === "blogs" ? (
        currentBlogs.length === 0 ? (
          <div className="glass rounded-[20px] p-[60px] text-center">
            <FileText size={40} color="var(--text3)" className="mx-auto mb-3 opacity-40" />
            <div className="text-[var(--text3)] text-sm">No {blogStatus} blogs</div>
          </div>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-5">
            {currentBlogs.map((blog) => (
              <div key={blog.id} className="glass rounded-[20px] overflow-hidden flex flex-col transition-all duration-200 border border-[var(--border)] hover:border-[var(--border2)]">

                <div className="h-[180px] bg-[var(--bg3)] overflow-hidden shrink-0 relative">
                  {blog.image
                    ? <img src={blog.image} className="w-full h-full object-cover" alt={blog.title} />
                    : <div className="w-full h-full flex items-center justify-center">
                        <FileText size={36} color="var(--text3)" className="opacity-25" />
                      </div>}
                  {blog.status && (
                    <span className={`absolute top-2.5 right-2.5 text-[10px] font-bold uppercase tracking-[0.07em] px-2 py-0.5 rounded-[20px] text-white ${blog.status === "published" ? "bg-green-500/85" : "bg-yellow-500/85"}`}>{blog.status}</span>
                  )}
                </div>

                <div className="pt-4.5 px-5 pb-5 flex flex-col flex-1">
                  <div className="font-bold text-[15px] text-[var(--text)] leading-snug mb-2">{blog.title}</div>

                  <div className="text-[11px] text-[var(--text3)] flex flex-wrap gap-x-3 gap-y-[3px] mb-2.5">
                    <span>By <span className="text-[var(--accent2)] font-semibold">{blog.author}</span></span>
                    {blog.spot      && <span>At <span className="text-[var(--accent2)] font-semibold">{blog.spot}</span></span>}
                    {blog.eventdate && <span className="font-mono">{blog.eventdate}</span>}
                    {blog.date      && <span>Submitted {blog.date}</span>}
                  </div>

                  {blog.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-2.5">
                      {blog.tags.map((tag) => (
                        <span key={tag} className="text-[10px] px-2 py-0.5 rounded-[20px] bg-[var(--surface)] border border-[var(--border)] text-[var(--text3)]">{tag}</span>
                      ))}
                    </div>
                  )}

                  {blog.summary && (
                    <p className="text-[12px] text-[var(--text3)] leading-relaxed mb-3.5 line-clamp-3">
                      {blog.summary}
                    </p>
                  )}

                  <div className="mt-auto border-t border-[var(--border)] pt-3.5 flex gap-2 flex-wrap">
                    <button onClick={() => openBlogDetail(blog)} className="px-3.5 py-1.5 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer bg-[var(--accent)] border-none text-white">
                      <Eye size={12} /> View
                    </button>
                    {blogStatus === "pending" ? (
                      <>
                        <button onClick={() => handlePublish(blog.id)} className="px-3.5 py-1.5 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer bg-green-500/10 border border-green-500/20 text-[var(--green)]">
                          <CheckCircle size={12} /> Publish
                        </button>
                        <button onClick={() => handleReject(blog.id)} className="px-3.5 py-1.5 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer bg-red-500/10 border border-red-500/20 text-[var(--red)]">
                          <XCircle size={12} /> Reject
                        </button>
                      </>
                    ) : (
                      <button onClick={() => handleDelete(blog.id)} className="px-3.5 py-1.5 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer bg-red-500/10 border border-red-500/20 text-[var(--red)]">
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
        <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-4">
          {feedbacks.map((fb) => (
            <div key={fb.id} className="glass rounded-2xl p-5 border-l-3 border-l-[var(--accent)]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-full bg-[#4f6ef7]/15 flex items-center justify-center">
                  <span className="font-extrabold text-sm text-[var(--accent2)]">{fb.user.charAt(0)}</span>
                </div>
                <div>
                  <div className="font-semibold text-[13px] text-[var(--text)]">{fb.user}</div>
                  <div className="text-[11px] text-[var(--text3)] font-mono">{fb.date}</div>
                </div>
              </div>
              <div className="text-[11px] text-[var(--text3)] mb-3 flex flex-col gap-1">
                {fb.title && <span>Event: <span className="text-[var(--accent2)]">{fb.title}</span></span>}
                {fb.spot  && <span>Spot: <span className="text-[var(--accent2)]">{fb.spot}</span></span>}
              </div>
              <div className="text-[13px] text-[var(--text2)] leading-relaxed italic">"{fb.message}"</div>
            </div>
          ))}
          {feedbacks.length === 0 && (
            <div className="glass col-span-full rounded-[20px] p-[60px] text-center">
              <MessageSquare size={40} color="var(--text3)" className="mx-auto mb-3 opacity-30" />
              <div className="text-[var(--text3)]">No feedbacks yet</div>
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
            <div className="h-[260px] overflow-hidden shrink-0 relative bg-[var(--bg3)]">
              {selectedBlog.image
                ? <img src={selectedBlog.image} className="w-full h-full object-cover" alt={selectedBlog.title} />
                : <div className="w-full h-full flex items-center justify-center">
                    <FileText size={48} color="var(--text3)" className="opacity-2
                    " />
                  </div>
              }
              {/* Gradient overlay for legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent/55" />

              {/* Loading indicator over cover */}
              {detailLoading && (
                <div className="absolute top-3.5 left-3.5 bg-black/55 rounded-[20px] px-3 py-1.5 text-[11px] text-white">
                  Loading full details…
                </div>
              )}

              {/* Status + close in top-right */}
              <div className="absolute top-3.5 right-3.5 flex gap-2 items-center">
                <StatusBadge status={selectedBlog.status} />
                <button
                  onClick={() => setSelectedBlog(null)}
                  className="w-8 h-8 rounded-full bg-black/45 border-none cursor-pointer flex items-center justify-center text-white">
                  <X size={15} />
                </button>
              </div>

              {/* Title overlaid on cover */}
              <div className="absolute bottom-0 left-0 right-0 px-7 pb-5">
                <h2 className="m-0 font-extrabold text-2xl text-white leading-snug [text-shadow:0_1px_6px_rgba(0,0,0,0.4)]">
                  {selectedBlog.title}
                </h2>
              </div>
            </div>

            {/* ── Scrollable body ── */}
            <div className="overflow-y-auto flex-1">
              <div className="pt-6 px-7 pb-8">

                {/* ── Meta chips ── */}
                <div className="flex flex-wrap gap-2.5 mb-6">
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
                  <div className="flex gap-1 mb-6 bg-[var(--surface)] rounded-[12px] p-1 border border-[var(--border)]">
                    {modalTabs.map(({ key, label, icon }) => (
                      <button key={key} onClick={() => setActiveSection(key)} className={`flex-1 py-2 px-3 rounded-[9px] text-[12px] font-semibold cursor-pointer flex items-center justify-center gap-1.5 border-none transition-all duration-200 ${activeSection === key ? "bg-[var(--accent)] text-white" : "bg-transparent text-[var(--text3)]"}`}>
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
                        <p className="text-[14px] text-[var(--text2)] leading-relaxed m-0">
                          {selectedBlog.summary}
                        </p>
                      </ModalSection>
                    ) : (
                      <div className="text-[var(--text3)] text-[13px] mb-6">No summary provided.</div>
                    )}

                    {/* Quick stats row */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      {[
                        { label: "Schedule items", value: scheduleItems.length, icon: <Clock size={16} /> },
                        { label: "Photos",         value: photoItems.length,    icon: <ImageIcon size={16} /> },
                       // { label: "Tags",           value: selectedBlog.tags?.length || 0, icon: <Tag size={16} /> },
                      ].map(({ label, value, icon }) => (
                        <div key={label} className="bg-[var(--surface)] border border-[var(--border)] rounded-[12px] px-4 py-3.5 flex flex-col gap-1.5">
                          <div className="text-[var(--text3)]">{icon}</div>
                          <div className="text-2xl font-extrabold text-[var(--text)]">{value}</div>
                          <div className="text-[11px] text-[var(--text3)] font-semibold">{label}</div>
                        </div>
                      ))}
                    </div>

                    {/* Inline preview of story (first 300 chars) if exists */}
                    {selectedBlog.story && (
                      <ModalSection icon={<BookOpen size={13} />} label="Story Preview">
                        <p className="text-[13px] text-[var(--text2)] leading-relaxed mb-2.5 whitespace-pre-wrap">
                          {selectedBlog.story.slice(0, 300)}{selectedBlog.story.length > 300 ? "…" : ""}
                        </p>
                        {selectedBlog.story.length > 300 && (
                          <button
                            onClick={() => setActiveSection("story")}
                            className="inline-flex items-center gap-1 text-[12px] font-semibold text-[var(--accent2)] bg-transparent border-none cursor-pointer p-0">
                            Read full story <ChevronRight size={13} />
                          </button>
                        )}
                      </ModalSection>
                    )}

                    {/* Inline photo preview strip */}
                    {photoItems.length > 0 && (
                      <ModalSection icon={<ImageIcon size={13} />} label="Photo Preview">
                        <div className="flex gap-2.5 overflow-x-auto pb-1">
                          {photoItems.slice(0, 5).map((item, i) =>
                             item.imagePath ? (
                              <div key={i} className="shrink-0 w-[110px] rounded-[10px] overflow-hidden aspect-[4/3] bg-[var(--bg3)]">
                                <img src={item.imagePath} alt={item.imageCaption || `Photo ${i + 1}`} className="w-full h-full object-cover block" />
                              </div>
                            ) : null
                          )}
                          {photoItems.length > 5 && (
                            <button
                              onClick={() => setActiveSection("photos")}
                              className="shrink-0 w-[110px] rounded-[10px] bg-[var(--surface)] border border-[var(--border)] cursor-pointer flex items-center justify-center flex-col gap-1.5 aspect-[4/3] text-[var(--text3)] text-[12px] font-semibold">
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
                      <div className="text-[var(--text3)] text-[13px]">No schedule items.</div>
                    ) : (
                      <div className="flex flex-col gap-0">
                        {scheduleItems.map((item, i) => (
                          <div key={i} className="flex gap-0 relative">
                            {/* Time column */}
                            <div className="w-[72px] shrink-0 pt-0.5 pr-3.5 text-right">
                              {item.time && (
                                <span className="text-[11px] font-mono text-[var(--accent2)] font-bold">
                                  {item.time}
                                </span>
                              )}
                            </div>

                            {/* Timeline line + dot */}
                            <div className="flex flex-col items-center mr-4 shrink-0">
                              <div className="w-2.5 h-2.5 rounded-full bg-[var(--accent)] mt-1 shrink-0 z-[1]" />
                              {i < scheduleItems.length - 1 && (
                                <div className="w-[2px] flex-1 bg-[var(--border2)] min-h-[28px] mt-0.5" />
                              )}
                            </div>

                            {/* Content */}
                            <div className={`flex-1 ${i < scheduleItems.length - 1 ? "pb-5" : "pb-0"}`}>
                              {item.activityTitle && (
                                <div className="font-bold text-sm text-[var(--text)] mb-1">{item.activityTitle}</div>
                              )}
                              {item.activityDescription && (
                                <div className="text-[12px] text-[var(--text3)] leading-relaxed">{item.activityDescription}</div>
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
                      <p className="text-sm text-[var(--text2)] leading-loose m-0 whitespace-pre-wrap">
                        {selectedBlog.story}
                      </p>
                    ) : (
                      <div className="text-[var(--text3)] text-[13px]">No story details provided.</div>
                    )}
                  </ModalSection>
                )}

                {/* ══ PHOTOS TAB ══ */}
                {activeSection === "photos" && (
                  <ModalSection icon={<ImageIcon size={13} />} label={`Photos (${photoItems.length})`}>
                    {photoItems.length === 0 ? (
                      <div className="text-[var(--text3)] text-[13px]">No photos.</div>
                    ) : (
                      <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-3">
                        {photoItems.map((item, i) =>
                          item.imagePath ? (
                            <div key={i}>
                              <div className="rounded-xl overflow-hidden aspect-[4/3] bg-[var(--bg3)] border border-[var(--border)]">
                                <img
                                  src={item.imagePath}
                                  alt={item.imageCaption || `Photo ${i + 1}`}
                                  className="w-full h-full object-cover block"
                                />
                              </div>
                              {item.imageCaption && (
                                <div className="text-[11px] text-[var(--text3)] mt-1.5 text-center italic">
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
            <div className="pt-4 px-7 pb-5 border-t border-[var(--border)] flex gap-2.5 bg-[var(--bg2)] shrink-0">
              {!isPublished && selectedBlog.status !== "rejected" && (
                <button onClick={() => handlePublish(selectedBlog.id)} className="flex-1 p-3 rounded-xl font-bold text-[13px] bg-[var(--green)] border-none text-white cursor-pointer flex items-center justify-center gap-1.5">
                  <CheckCircle size={15} /> Publish
                </button>
              )}
              {selectedBlog.status === "pending" && (
                <button onClick={() => handleReject(selectedBlog.id)} className="flex-1 p-3 rounded-xl font-bold text-[13px] bg-red-500/10 border border-red-500/25 text-[var(--red)] cursor-pointer flex items-center justify-center gap-1.5">
                  <XCircle size={15} /> Reject
                </button>
              )}
              {isPublished && (
                <button onClick={() => handleDelete(selectedBlog.id)} className="flex-1 p-3 rounded-xl font-bold text-[13px] bg-red-500/10 border border-red-500/25 text-[var(--red)] cursor-pointer flex items-center justify-center gap-1.5">
                  <Trash2 size={15} /> Delete
                </button>
              )}
              <button
                onClick={() => setSelectedBlog(null)}
                className="btn-ghost flex-1 p-3 rounded-xl font-bold text-[13px]">
                Close
              </button>
            </div>

          </div>
        </div>,
        document.body
      )},
    </div>
  );
};

export default BlogModeration;