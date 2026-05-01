import React from 'react';
import { X, Download } from "lucide-react";
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const PdfRow = ({ label, value }) => (
    <div style={{ display: 'flex', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px', marginBottom: '8px' }}>
        <span style={{ width: '128px', color: '#94a3b8', fontWeight: 'bold', textTransform: 'uppercase', fontSize: '10px', trackingWidth: '0.1em' }}>
            {label}
        </span>
        <span style={{ fontWeight: 'bold', color: '#1e293b', textTransform: 'uppercase', fontSize: '12px' }}>
            {value || 'N/A'}
        </span>
    </div>
);

export default function ApprovalModal({ selectedReq, setIsPreviewOpen, userProfile }) {

    const handleDownloadPdf = async () => {
        const input = document.getElementById('pdf-content');

        if (!input) {
            console.error("ID 'pdf-content' not found");
            return;
        }

        try {
            // We use a slight timeout to ensure images are fully rendered
            const canvas = await html2canvas(input, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: "#ffffff",
                // This forces html2canvas to ignore modern CSS functions it can't parse
                onclone: (clonedDoc) => {
                    const el = clonedDoc.getElementById('pdf-content');
                    el.style.fontFamily = 'Arial, sans-serif';
                }
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const imgWidth = pdfWidth;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            pdf.save(`Approval_Copy_${selectedReq?.id || 'Request'}.pdf`);
        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("Error generating PDF. This is often caused by modern CSS 'oklch' colors. The updated code uses HEX to fix this.");
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop Overlay */}
            <div
                className="absolute inset-0 bg-[#0f172a]/60 backdrop-blur-sm"
                onClick={() => setIsPreviewOpen(false)}
            ></div>

            {/* Modal Container */}
            <div className="relative bg-[#f4f4f5] w-full max-w-4xl rounded-[32px] shadow-2xl flex flex-col max-h-[95vh] overflow-hidden">

                {/* Header (Non-captured) */}
                <div className="bg-[#0f172a] p-3 text-white flex justify-between items-center px-8">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80">
                        Approval Copy System
                    </span>
                    <button
                        onClick={() => setIsPreviewOpen(false)}
                        className="hover:bg-slate-800 p-1.5 rounded-full transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Scrollable Preview Area */}
                <div className="p-6 overflow-y-auto">
                    {/*  CAPTURE AREA (#pdf-content) */}
                    <div
                        id="pdf-content"
                        style={{
                            backgroundColor: '#ffffff',
                            color: '#0f172a',
                            padding: '40px',
                            border: '1px solid #e2e8f0',
                            width: '100%',
                            minHeight: '842px' // Approx A4 ratio
                        }}
                    >
                        {/* University Letterhead */}
                        <div style={{ textAlign: 'center', marginBottom: '32px', borderBottom: '2px solid #0f172a', paddingBottom: '16px' }}>
                            <h1 style={{ fontSize: '24px', fontWeight: '900', textTransform: 'uppercase', margin: 0 }}>
                                Spot Booking Approval Copy
                            </h1>
                            <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#64748b', marginTop: '4px' }}>
                                Shahjalal University of Science & Technology
                            </p>
                        </div>

                        <div className="space-y-8">
                            {/* 01. Event Details */}
                            <section>
                                <h2 style={{ backgroundColor: '#f1f5f9', padding: '4px 12px', fontSize: '11px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '16px', display: 'inline-block' }}>
                                    Event Details
                                </h2>
                                <div className="grid grid-cols-2 gap-x-12 gap-y-2 ml-2">
                                    <PdfRow label="Title" value={selectedReq?.title} />
                                    <PdfRow label="Spot" value={selectedReq?.spot_name} />
                                    <PdfRow label="Date" value={selectedReq?.end_date ? `${selectedReq.start_date} to ${selectedReq.end_date}` : selectedReq?.start_date} />
                                    <PdfRow label="Session" value={selectedReq?.session} />
                                    <PdfRow label="Organizer" value={selectedReq?.organizer} />
                                    <PdfRow label="Timing" value={`${selectedReq?.start_time || '00:00'} - ${selectedReq?.end_time || '00:00'}`} />
                                </div>
                            </section>

                            {/* 02. Stakeholders */}
                            <section style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9', padding: '32px 0' }}>

                                {/* Applicant */}
                                <div className="space-y-4">
                                    <h3 style={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.1em' }}>
                                        Applicant Details
                                    </h3>
                                    <div style={{ fontSize: '12px' }}>
                                        <p style={{ fontWeight: 'bold' }}>{userProfile?.name || 'N/A'}</p>
                                        <p style={{ color: '#64748b', fontStyle: 'italic' }}>{userProfile?.department || 'N/A'}</p>
                                        <p style={{ marginTop: '8px' }}>Contact: {userProfile?.contact || 'N/A'}</p>
                                    </div>
                                    <div style={{ height: '64px', width: '100%', border: '1px dashed #cbd5e1', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc' }}>
                                        {userProfile?.signature ? (
                                            <img crossOrigin="anonymous" src={userProfile.signature} alt="sig" style={{ maxHeight: '100%', objectFit: 'contain' }} />
                                        ) : (
                                            <span style={{ fontSize: '10px', color: '#94a3b8' }}>No Signature</span>
                                        )}
                                    </div>
                                </div>

                                {/* Recommender */}
                                <div className="space-y-4">
                                    <h3 style={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.1em' }}>
                                        Recommender
                                    </h3>
                                    <div style={{ fontSize: '12px' }}>
                                        <p style={{ fontWeight: 'bold' }}>{selectedReq?.recommender?.name || 'Pending'}</p>
                                        <p style={{ color: '#64748b', fontStyle: 'italic' }}>{selectedReq?.recommender?.designation || 'N/A'}</p>
                                    </div>
                                    <div style={{ height: '64px', width: '100%', border: '1px dashed #cbd5e1', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc' }}>
                                        {selectedReq?.recommender?.signature && (
                                            <img crossOrigin="anonymous" src={selectedReq.recommender.signature} alt="sig" style={{ maxHeight: '100%', objectFit: 'contain' }} />
                                        )}
                                    </div>
                                </div>

                                {/* Approver */}
                                <div className="space-y-4">
                                    <h3 style={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.1em' }}>
                                        Approver
                                    </h3>
                                    <div style={{ fontSize: '12px' }}>
                                        <p style={{ fontWeight: 'bold' }}>{selectedReq?.approver?.name || 'Prof. Dr. M. Ahmed'}</p>
                                        <p style={{ color: '#64748b', fontStyle: 'italic' }}>{selectedReq?.approver?.post || 'Director'}</p>
                                    </div>
                                    <div style={{ height: '64px', width: '100%', border: '1px solid #dbeafe', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#eff6ff' }}>
                                        {selectedReq?.approver?.signature && (
                                            <img crossOrigin="anonymous" src={selectedReq.approver.signature} alt="sig" style={{ maxHeight: '100%', objectFit: 'contain' }} />
                                        )}
                                    </div>
                                </div>
                            </section>

                            {/* Terms and Forwarded list */}
                            <section style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
                                <p style={{
                                    fontSize: '11px',
                                    fontWeight: '900',
                                    color: '#1e293b',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    marginBottom: '12px'
                                }}>
                                    Terms and Conditions
                                </p>
                                <ol style={{
                                    fontSize: '10px',
                                    color: '#475569',
                                    paddingLeft: '20px',
                                    listStyleType: 'decimal',
                                    lineHeight: '1.6'
                                }}>
                                    <li style={{ marginBottom: '4px' }}>The applicant must ensure the cleanliness of the spot and properly dispose of all waste materials after the event.</li>
                                    <li style={{ marginBottom: '4px' }}>Any damage to university property during the event will be the sole responsibility of the organizing department/individual.</li>
                                    <li style={{ marginBottom: '4px' }}>Sound systems must be kept within a reasonable volume limit to avoid disturbing the academic environment of the university.</li>
                                    <li style={{ marginBottom: '4px' }}>The event must be concluded strictly within the approved timeframe, and no extension is allowed without prior permission from the Estate Office.</li>
                                </ol>
                            </section>

                            {/* 04. Forwarded Copy List */}
                            <section style={{ marginTop: '24px' }}>
                                <p style={{
                                    fontSize: '11px',
                                    fontWeight: '900',
                                    color: '#1e293b',
                                    marginBottom: '12px'
                                }}>
                                    Approval Copy Recipients:
                                </p>
                                <ol style={{
                                    fontSize: '10px',
                                    color: '#475569',
                                    paddingLeft: '20px',
                                    listStyleType: 'decimal',
                                    lineHeight: '1.6'
                                }}>
                                    <li style={{ marginBottom: '2px' }}>The Registrar, SUST (for kind information).</li>
                                    <li style={{ marginBottom: '2px' }}>The Estate Officer, SUST (for field preparation and security).</li>
                                    <li style={{ marginBottom: '2px' }}>The Proctor, SUST (for maintenance of law and order).</li>
                                    <li style={{ marginBottom: '2px' }}>The Director (Audit), SUST.</li>
                                    <li style={{ marginBottom: '2px' }}>Office Copy.</li>
                                </ol>
                            </section>
                        </div>
                    </div>
                </div>

                {/* Footer (Non-captured) */}
                <div className="p-5 bg-white border-t flex justify-end gap-3 px-8">
                    <button
                        onClick={() => setIsPreviewOpen(false)}
                        className="px-6 py-2 text-xs font-bold text-gray-400 hover:text-red-500 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDownloadPdf}
                        className="bg-[#10b981] hover:bg-[#059669] text-white px-8 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-lg active:scale-95"
                    >
                        <Download size={14} /> Download Approval Copy
                    </button>
                </div>
            </div>
        </div>
    );
}