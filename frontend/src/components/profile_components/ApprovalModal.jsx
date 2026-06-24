import React, { useEffect, useState } from 'react';
import { X, Download, Loader2 } from "lucide-react";
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import axios from 'axios';
import API_BASE from "../../config";

const PdfRow = ({ label, value }) => (
    <div style={{ display: 'flex', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px', marginBottom: '8px' }}>
        <span style={{ width: '128px', color: '#94a3b8', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.1em' }}>
            {label}
        </span>
        <span style={{ fontWeight: 'bold', color: '#1e293b', textTransform: 'uppercase', fontSize: '12px' }}>
            {value || 'N/A'}
        </span>
    </div>
);

export default function ApprovalModal({ selectedReq, setIsPreviewOpen, userProfile }) {
    const [approvalData, setApprovalData] = useState({ rules: "", approvers: [] });
    const [loading, setLoading] = useState(true);

    // 1. Fetch Dynamic Data from Backend
    // Inside your standard Internal Modal:
    // Inside your Internal ApprovalModal component
    useEffect(() => {
        const fetchDetails = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${API_BASE}/api/approver/details/${selectedReq.spot_id}`);

                // FIX: We must specify internalApprovers here
                setApprovalData({
                    rules: res.data.rules,
                    approvers: res.data.internalApprovers // Use the internal list
                });
            } catch (error) {
                console.error("Error fetching internal approval details:", error);
            } finally {
                setLoading(false);
            }
        };

        if (selectedReq?.spot_id) fetchDetails();
    }, [selectedReq]);
    // Derived Data
    const rulesArray = approvalData.rules ? approvalData.rules.split('.').filter(r => r.trim() !== "") : [];
    const finalApprover = approvalData.approvers.length > 0
        ? approvalData.approvers[approvalData.approvers.length - 1]
        : null;

    const handleDownloadPdf = async () => {
        const input = document.getElementById('pdf-content');
        if (!input) return;

        try {
            const canvas = await html2canvas(input, {
                scale: 2,
                useCORS: true,
                backgroundColor: "#ffffff",
            });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = pdf.internal.pageSize.getWidth();
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            pdf.save(`Approval_${selectedReq?.id || 'Copy'}.pdf`);
        } catch (error) {
            console.error("PDF Error:", error);
        }
    };

    if (loading) {
        return (
            <div className="fixed inset-0 z-[110] bg-black/50 backdrop-blur flex items-center justify-center">
                <Loader2 className="animate-spin text-white" size={48} />
            </div>
        );
    }
    const getImageUrl = (path) => {
        if (!path) return "";
        // If the path already contains http, return it as is
        if (path.startsWith("http")) return path;
        // Otherwise, prepend your backend URL
        return `${API_BASE}/${path}`;
    };
    const getFullImageUrl = (imagePath) => {
        if (!imagePath) return "";

        // If it's already a full URL, return it
        if (imagePath.startsWith("http")) return imagePath;

        // Ensure 'uploads/' is included in the path
        const cleanPath = imagePath.startsWith("uploads/")
            ? imagePath
            : `uploads/${imagePath}`;

        return `${API_BASE}/${cleanPath}`;
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[#0f172a]/60 backdrop-blur-sm" onClick={() => setIsPreviewOpen(false)}></div>

            <div className="relative bg-[#f4f4f5] w-full max-w-4xl rounded-[32px] shadow-2xl flex flex-col max-h-[95vh] overflow-hidden">
                {/* Header */}
                <div className="bg-[#0f172a] p-3 text-white flex justify-between items-center px-8">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80">Approval Copy System</span>
                    <button onClick={() => setIsPreviewOpen(false)} className="hover:bg-slate-800 p-1.5 rounded-full"><X size={18} /></button>
                </div>

                <div className="p-6 overflow-y-auto">
                    <div id="pdf-content" style={{ backgroundColor: '#ffffff', color: '#0f172a', padding: '40px', border: '1px solid #e2e8f0', minHeight: '842px' }}>

                        {/* University Letterhead */}
                        <div style={{ textAlign: 'center', marginBottom: '32px', borderBottom: '2px solid #0f172a', paddingBottom: '16px' }}>
                            <h1 style={{ fontSize: '24px', fontWeight: '900', textTransform: 'uppercase', margin: 0 }}>Spot Booking Approval Copy</h1>
                            <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#64748b' }}>Shahjalal University of Science & Technology</p>
                        </div>

                        <div className="space-y-8">
                            {/* 01. Event Details */}
                            <section>
                                <h2 style={{ backgroundColor: '#f1f5f9', padding: '4px 12px', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '16px', display: 'inline-block' }}>Event Details</h2>
                                <div className="grid grid-cols-2 gap-x-12 gap-y-1 ml-2">
                                    <PdfRow label="Title" value={selectedReq?.title} />
                                    <PdfRow label="Spot" value={selectedReq?.spot_name} />
                                    <PdfRow label="Date" value={selectedReq?.end_date ? `${selectedReq.start_date} to ${selectedReq.end_date}` : selectedReq?.start_date} />
                                    <PdfRow label="Session" value={selectedReq?.session} />
                                    <PdfRow label="Organizer" value={selectedReq?.organizer} />
                                    <PdfRow label="Timing" value={`${selectedReq?.start_time || '00:00'} - ${selectedReq?.end_time || '00:00'}`} />
                                </div>
                            </section>

                            {/* 02. Dynamic Stakeholders */}
                            <section style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9', padding: '32px 0' }}>

                                {/* 1. Applicant (Remains from userProfile) */}
                                <div className="space-y-4">
                                    <h3 style={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', color: '#94a3b8' }}>Applicant</h3>
                                    <div style={{ fontSize: '12px' }}>
                                        <p style={{ fontWeight: 'bold' }}>{userProfile?.name || 'N/A'}</p>
                                        <p style={{ color: '#64748b' }}>{userProfile?.department}</p>
                                    </div>
                                    <div style={{ height: '64px', border: '1px dashed #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {userProfile?.signature && (
                                            <img crossOrigin="anonymous" src={getImageUrl(userProfile.signature)} alt="sig" style={{ maxHeight: '100%' }} />
                                        )}
                                    </div>
                                </div>

                                {/* 2. Recommender (RESTORED: Using your original selectedReq data) */}
                                <div className="space-y-4">
                                    <h3 style={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', color: '#94a3b8' }}>Recommender</h3>
                                    <div style={{ fontSize: '12px' }}>
                                        <p style={{ fontWeight: 'bold' }}>{selectedReq?.recommender?.name || 'Pending'}</p>
                                        <p style={{ color: '#64748b' }}>{selectedReq?.recommender?.designation || 'N/A'}</p>
                                    </div>
                                    <div style={{ height: '64px', border: '1px dashed #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {selectedReq?.recommender?.signature && (
                                            // For Recommender, we use the original getFullImageUrl function since the signature path might already be complete or might need the uploads/ prefix
                                            <img
                                                crossOrigin="anonymous"
                                                src={getFullImageUrl(selectedReq?.recommender?.signature)}
                                                alt="sig"
                                                style={{ maxHeight: '100%' }}
                                            />)}
                                    </div>
                                </div>

                                {/* 3. Final Approver (Dynamic: Last person from the fetched approval_order) */}
                                <div className="space-y-4">
                                    <h3 style={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', color: '#94a3b8' }}>Final Approval</h3>
                                    <div style={{ fontSize: '12px' }}>
                                        <p style={{ fontWeight: 'bold' }}>{finalApprover?.approver_name || 'Pending'}</p>
                                        <p style={{ color: '#64748b' }}>{finalApprover?.approver_designation}</p>
                                    </div>
                                    <div style={{ height: '64px', border: '1px solid #dbeafe', backgroundColor: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        {finalApprover?.approver_signature && (
                                            <img
                                                crossOrigin="anonymous"
                                                src={getFullImageUrl(finalApprover?.approver_signature)}
                                                alt="sig"
                                                style={{ maxHeight: '100%' }}
                                            />)}
                                    </div>
                                </div>
                            </section>

                            {/* 03. Terms from DB */}
                            <section>
                                <p style={{ fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '12px' }}>Terms and Conditions</p>
                                <ol style={{ fontSize: '10px', color: '#475569', paddingLeft: '20px', listStyleType: 'decimal' }}>
                                    {rulesArray.map((rule, i) => (
                                        <li key={i} style={{ marginBottom: '4px' }}>{rule.trim()}.</li>
                                    ))}
                                </ol>
                            </section>

                            {/* 04. Recipients List */}
                            <section>
                                <p style={{ fontSize: '11px', fontWeight: '900', marginBottom: '12px' }}>Forwarded For Information To:</p>
                                <ol style={{ fontSize: '10px', color: '#475569', paddingLeft: '20px', listStyleType: 'decimal' }}>
                                    {approvalData.approvers.map((app, i) => (
                                        <li key={i}>{app.approver_designation}, SUST.</li>
                                    ))}
                                </ol>
                            </section>
                        </div>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="p-5 bg-white border-t flex justify-end gap-3 px-8">
                    <button onClick={() => setIsPreviewOpen(false)} className="px-6 py-2 text-xs font-bold text-gray-400">Cancel</button>
                    <button onClick={handleDownloadPdf} className="bg-[#10b981] text-white px-8 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2">
                        <Download size={14} /> Download Approval Copy
                    </button>
                </div>
            </div>
        </div>
    );
}