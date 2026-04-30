import { useState, useEffect, useCallback } from "react";
import {
  FileText, Eye, X, CheckCircle, XCircle, Trash2, MessageSquare,
} from "lucide-react";
import { adminApi } from "./adminApi";
import Toast from "./Toast";

const BlogModeration = () => {
  const [activeTab, setActiveTab] = useState("blogs");
  const [blogStatus, setBlogStatus] = useState("pending");
  const [pendingBlogs, setPendingBlogs] = useState([]);
  const [publishedBlogs, setPublishedBlogs] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [toast, setToast] = useState(null);

  const fetchBlogs = useCallback(async () => {
    setLoading(true);
    try {
      const [pRes, pubRes] = await Promise.all([
        adminApi().get("/blogs?status=pending"),
        adminApi().get("/blogs?status=published"),
      ]);
      const normalize = (arr) => (arr || []).map(b => ({
        id: b.blog_id, title: b.blog_title, author: b.author || "Unknown",
        date: b.submitted_at ? new Date(b.submitted_at).toLocaleDateString("en-GB") : "",
        image: b.cover_image ? `http://localhost:5000/uploads/${b.cover_image}` : null,
        spot: b.spot_name || "", eventdate: b.event_date?.split("T")[0] || "",
        content: b.story_details || b.summary || "",
      }));
      setPendingBlogs(normalize(pRes.data));
      setPublishedBlogs(normalize(pubRes.data));
    } catch { } finally { setLoading(false); }
  }, []);

  const fetchFeedbacks = useCallback(async () => {
    try {
      const res = await adminApi().get("/feedbacks");
      setFeedbacks((res.data || []).map(fb => ({
        id: fb.event_id, user: fb.user_name || "Anonymous",
        message: fb.feedback || "", date: fb.event_date?.split("T")[0] || "",
        spot: fb.spot_name || "", title: fb.event_title || "",
      })));
    } catch { }
  }, []);

  useEffect(() => { fetchBlogs(); fetchFeedbacks(); }, [fetchBlogs, fetchFeedbacks]);

  const handlePublish = async (id) => {
    try { await adminApi().post(`/blogs/${id}/publish`); await fetchBlogs(); setSelectedBlog(null); setToast({ msg: "Blog published!", type: "success" }); }
    catch { setToast({ msg: "Publish failed", type: "error" }); }
  };
  const handleReject = async (id) => {
    try { await adminApi().post(`/blogs/${id}/reject`); await fetchBlogs(); setToast({ msg: "Blog rejected", type: "success" }); }
    catch { setToast({ msg: "Reject failed", type: "error" }); }
  };
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this blog permanently?")) return;
    try { await adminApi().delete(`/blogs/${id}`); await fetchBlogs(); setToast({ msg: "Blog deleted", type: "success" }); }
    catch { setToast({ msg: "Delete failed", type: "error" }); }
  };

  const currentBlogs = blogStatus === "pending" ? pendingBlogs : publishedBlogs;

  return (
    <div>
      {toast && <Toast message={toast.msg} type={toast.type} onDone={() => setToast(null)} />}
      <div className="section-header">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="section-title">Blog Moderation</h1>
            <p className="section-subtitle">Review posts and manage community content</p>
          </div>
          <div className="flex gap-2" style={{ background: "var(--surface)", padding: "4px", borderRadius: 12, border: "1px solid var(--border)" }}>
            <button onClick={() => setActiveTab("blogs")}
              style={{
                padding: "8px 18px", borderRadius: 9, fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", gap: 6,
                background: activeTab === "blogs" ? "var(--accent)" : "transparent", color: activeTab === "blogs" ? "white" : "var(--text2)", border: "none"
              }}>
              <FileText size={13} /> Blogs
            </button>
            <button onClick={() => setActiveTab("feedbacks")}
              style={{
                padding: "8px 18px", borderRadius: 9, fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.2s", display: "flex", alignItems: "center", gap: 6,
                background: activeTab === "feedbacks" ? "var(--accent)" : "transparent", color: activeTab === "feedbacks" ? "white" : "var(--text2)", border: "none"
              }}>
              <MessageSquare size={13} /> Feedbacks
            </button>
          </div>
        </div>
      </div>

      {activeTab === "blogs" && (
        <div className="flex gap-2 mb-6">
          {["pending", "published"].map(s => (
            <button key={s} onClick={() => setBlogStatus(s)}
              style={{
                padding: "7px 18px", borderRadius: 20, fontSize: 11, fontWeight: 700, cursor: "pointer", textTransform: "capitalize", letterSpacing: "0.05em",
                background: blogStatus === s ? (s === "pending" ? "rgba(234,179,8,0.15)" : "rgba(34,197,94,0.15)") : "var(--surface)",
                color: blogStatus === s ? (s === "pending" ? "var(--yellow)" : "var(--green)") : "var(--text3)",
                border: `1px solid ${blogStatus === s ? (s === "pending" ? "rgba(234,179,8,0.3)" : "rgba(34,197,94,0.3)") : "var(--border)"}`
              }}>
              {s === "pending" ? "Pending" : "Published"} ({s === "pending" ? pendingBlogs.length : publishedBlogs.length})
            </button>
          ))}
        </div>
      )}

      {loading && activeTab === "blogs" ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text3)" }}>Loading blogs...</div>
      ) : activeTab === "blogs" ? (
        currentBlogs.length === 0 ? (
          <div className="glass" style={{ borderRadius: 20, padding: 60, textAlign: "center" }}>
            <FileText size={40} color="var(--text3)" style={{ margin: "0 auto 12px", opacity: 0.4 }} />
            <div style={{ color: "var(--text3)", fontSize: 14 }}>No {blogStatus} blogs</div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 18 }}>
            {currentBlogs.map(blog => (
              <div key={blog.id} className="glass" style={{ borderRadius: 20, overflow: "hidden", transition: "all 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "var(--border2)"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}>
                <div style={{ height: 160, background: "var(--bg3)", overflow: "hidden" }}>
                  {blog.image ? (
                    <img src={blog.image} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt={blog.title} />
                  ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <FileText size={32} color="var(--text3)" style={{ opacity: 0.3 }} />
                    </div>
                  )}
                </div>
                <div style={{ padding: 20 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "var(--text)", marginBottom: 10, lineHeight: 1.4 }}>{blog.title}</div>
                  <div style={{ fontSize: 11, color: "var(--text3)", display: "flex", flexDirection: "column", gap: 4, marginBottom: 16 }}>
                    <span>By <span style={{ color: "var(--accent2)" }}>{blog.author}</span></span>
                    {blog.spot && <span>At <span style={{ color: "var(--accent2)" }}>{blog.spot}</span></span>}
                    {blog.eventdate && <span>Date: <span style={{ fontFamily: "JetBrains Mono", color: "var(--text2)" }}>{blog.eventdate}</span></span>}
                  </div>
                  <div className="flex gap-2 flex-wrap" style={{ borderTop: "1px solid var(--border)", paddingTop: 14 }}>
                    <button onClick={() => setSelectedBlog(blog)}
                      style={{ padding: "6px 12px", borderRadius: 8, fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", gap: 5, cursor: "pointer", background: "var(--surface2)", border: "1px solid var(--border2)", color: "var(--text2)" }}>
                      <Eye size={12} /> View
                    </button>
                    {blogStatus === "pending" ? (
                      <>
                        <button onClick={() => handlePublish(blog.id)}
                          style={{ padding: "6px 12px", borderRadius: 8, fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", gap: 5, cursor: "pointer", background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.2)", color: "var(--green)" }}>
                          <CheckCircle size={12} /> Publish
                        </button>
                        <button onClick={() => handleReject(blog.id)}
                          style={{ padding: "6px 12px", borderRadius: 8, fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", gap: 5, cursor: "pointer", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "var(--red)" }}>
                          <XCircle size={12} /> Reject
                        </button>
                      </>
                    ) : (
                      <button onClick={() => handleDelete(blog.id)}
                        style={{ padding: "6px 12px", borderRadius: 8, fontSize: 11, fontWeight: 600, display: "flex", alignItems: "center", gap: 5, cursor: "pointer", background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "var(--red)" }}>
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
        /* Feedbacks */
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
          {feedbacks.map(fb => (
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

      {/* Blog Detail Modal */}
      {selectedBlog && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setSelectedBlog(null)}>
          <div style={{ background: "var(--bg2)", borderRadius: 24, width: "100%", maxWidth: 600, maxHeight: "90vh", overflow: "hidden", display: "flex", flexDirection: "column", border: "1px solid var(--border2)" }}>
            {selectedBlog.image && (
              <div style={{ height: 220, overflow: "hidden" }}>
                <img src={selectedBlog.image} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" />
              </div>
            )}
            <div style={{ padding: 28, overflowY: "auto" }}>
              <div className="flex items-center justify-between mb-4">
                <h3 style={{ fontWeight: 700, fontSize: 18, color: "var(--text)", flex: 1 }}>{selectedBlog.title}</h3>
                <button style={{ background: "none", border: "none", color: "var(--text3)", cursor: "pointer", marginLeft: 12 }} onClick={() => setSelectedBlog(null)}><X size={18} /></button>
              </div>
              <div style={{ fontSize: 12, color: "var(--accent2)", marginBottom: 16 }}>By {selectedBlog.author} · {selectedBlog.date}</div>
              <div style={{ background: "var(--bg)", borderRadius: 12, padding: 16, marginBottom: 20, maxHeight: 200, overflowY: "auto", border: "1px solid var(--border)" }}>
                <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{selectedBlog.content}</p>
              </div>
              <div className="flex gap-3">
                {!publishedBlogs.find(b => b.id === selectedBlog.id) && (
                  <button onClick={() => handlePublish(selectedBlog.id)}
                    style={{ flex: 1, padding: "11px", borderRadius: 12, fontWeight: 600, fontSize: 13, background: "var(--green)", border: "none", color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                    <CheckCircle size={15} /> Publish
                  </button>
                )}
                <button className="btn-ghost" style={{ flex: 1, padding: "11px", borderRadius: 12, fontWeight: 600 }} onClick={() => setSelectedBlog(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogModeration;
