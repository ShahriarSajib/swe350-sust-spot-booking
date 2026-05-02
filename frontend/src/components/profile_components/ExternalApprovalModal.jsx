import React from 'react';
import { X, Download } from "lucide-react";
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const ExternalApprovalModal = ({ selectedReq, setIsPreviewOpen }) => {
    
    if (!selectedReq) return null;

    const today = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
    const userName = localStorage.getItem("userName") || "External User";

    const handleDownloadPdf = async () => {
        const input = document.getElementById('pdf-content');

        if (!input) {
            console.error("ID 'pdf-content' not found");
            return;
        }

        try {
            const canvas = await html2canvas(input, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: "#ffffff",
                onclone: (clonedDoc) => {
                    const el = clonedDoc.getElementById('pdf-content');
                    el.style.fontFamily = 'serif';
                }
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const imgWidth = pdfWidth;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            pdf.save(`Approval_Letter_${selectedReq.booking_id || 'External'}.pdf`);
        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("Error generating PDF. Please ensure no oklch colors are used in the capture area.");
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

                {/* Non-captured Header */}
                <div className="bg-[#0f172a] p-3 text-white flex justify-between items-center px-8">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80">
                        External Approval Preview
                    </span>
                    <button
                        onClick={() => setIsPreviewOpen(false)}
                        className="hover:bg-slate-800 p-1.5 rounded-full transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Scrollable Preview Area */}
                <div className="p-6 overflow-y-auto scrollbar-thin">
                    
                    {/* CAPTURE AREA (#pdf-content) */}
                    <div
                        id="pdf-content"
                        style={{
                            backgroundColor: '#ffffff',
                            color: '#0f172a',
                            padding: '60px',
                            width: '100%',
                            minHeight: '842px',
                            fontFamily: 'serif'
                        }}
                    >
                        {/* Letterhead Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #000000', paddingBottom: '16px', marginBottom: '32px' }}>
                            <div style={{ width: '45%' }}>
                                <h1 style={{ fontWeight: 'bold', fontSize: '18px', margin: 0 }}>Shahjalal University of Science and Technology</h1>
                                <p style={{ fontSize: '12px', margin: '4px 0' }}>Sylhet-3114, Bangladesh.</p>
                            </div>
                            <div style={{ width: '45%', textAlign: 'right' }}>
                                <h1 style={{ fontWeight: 'bold', fontSize: '18px', margin: 0 }}>Registrar Office</h1>
                                <p style={{ fontSize: '12px', margin: '4px 0' }}>Website: sust.edu.bd</p>
                            </div>
                        </div>

                        {/* Memo & Date */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px', fontSize: '14px', fontWeight: 'bold' }}>
                            <div>Memo No: Reg/ {selectedReq.booking_id || '255/1/520'}</div>
                            <div>Date: {today}</div>
                        </div>
                        
                        {/* Recipient */}
                        <div style={{ marginBottom: '40px' }}>
                            <p style={{ margin: '0 0 8px 0' }}>To,</p>
                            <p style={{ fontWeight: 'bold', textTransform: 'uppercase', margin: 0 }}>{userName}</p>
                            <p style={{ margin: 0 }}>{selectedReq.organizer || 'External Organization'}</p>
                        </div>

                        {/* Subject */}
                        <div style={{ marginBottom: '32px', fontWeight: 'bold' }}>
                            Subject: <span style={{ fontStyle: 'italic' }}>
                                Permission to use {selectedReq.spot_name} for "{selectedReq.title}".
                            </span>
                        </div>

                        {/* Letter Body */}
                        <div style={{ textAlign: 'justify', lineHeight: '1.6', fontSize: '15px' }}>
                            <p>Dear Sir/Madam,</p>
                            <p style={{ marginTop: '16px' }}>
                                Permission is granted to use <strong>{selectedReq.spot_name}</strong> on 
                                <strong> {selectedReq.start_date} at {selectedReq.start_time} to {selectedReq.end_time}</strong> for the event 
                                <strong> "{selectedReq.title}"</strong> to be organized by <strong>{selectedReq.organizer}</strong>.
                            </p>
                            <p style={{ marginTop: '16px' }}>
                                The fixed rent is BDT: <strong> {selectedReq.totalPrice || '30,000'}/- </strong>. 
                                Please deposit this to <strong>Account no: 33000012</strong> at Sonali Bank, SUST Branch.
                            </p>
                        </div>

                        {/* Signature Section */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginTop: '64px' }}>
                            <div style={{ textAlign: 'center', width: '250px' }}>
                                <p style={{ fontWeight: 'bold', fontStyle: 'italic', marginBottom: '48px' }}>By Order of the Authority,</p>
                                <p style={{ fontWeight: 'bold', textTransform: 'uppercase', margin: 0 }}>Registrar</p>
                                <p style={{ margin: 0, fontSize: '13px' }}>Shahjalal University Of Science and Technology</p>
                                <p style={{ margin: 0, fontSize: '13px' }}>Email: registrar@sust.edu.bd</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Non-captured Footer Actions */}
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
                        <Download size={14} /> Download Copy
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExternalApprovalModal;