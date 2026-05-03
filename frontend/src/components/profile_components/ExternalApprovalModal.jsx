import React, { useEffect, useState } from 'react';
import { X, Download, Loader2 } from "lucide-react";
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import axios from 'axios';

const ExternalApprovalModal = ({ selectedReq, setIsPreviewOpen }) => {
    const [approvalData, setApprovalData] = useState({ approvers: [] });
    const [loading, setLoading] = useState(true);

    // Helper for images
    const getImageUrl = (path) => {
        if (!path) return "";
        if (path.startsWith("http")) return path;
        return `http://localhost:5000/${path}`;
    };

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`http://localhost:5000/api/approver/details/${selectedReq.spot_id}`);

                // We set the state with the specific list we need for THIS modal
                setApprovalData({
                    approvers: res.data.externalApprovers, // <--- Using the external list here
                    rules: res.data.rules
                });
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        if (selectedReq?.spot_id) fetchDetails();
    }, [selectedReq]);

    if (!selectedReq) return null;

    // The LAST person in the external_approval_order is the signatory
    const finalSignatory = approvalData.approvers.length > 0
        ? approvalData.approvers[approvalData.approvers.length - 1]
        : null;

    const today = new Date().toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
    });

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
            pdf.save(`External_Approval_${selectedReq.booking_id}.pdf`);
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

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[#0f172a]/60 backdrop-blur-sm" onClick={() => setIsPreviewOpen(false)}></div>

            <div className="relative bg-[#f4f4f5] w-full max-w-4xl rounded-[32px] shadow-2xl flex flex-col max-h-[95vh] overflow-hidden">
                {/* Header */}
                <div className="bg-[#0f172a] p-3 text-white flex justify-between items-center px-8">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80">External Approval Preview</span>
                    <button onClick={() => setIsPreviewOpen(false)} className="hover:bg-slate-800 p-1.5 rounded-full"><X size={18} /></button>
                </div>

                <div className="p-6 overflow-y-auto">
                    <div id="pdf-content" style={{ backgroundColor: '#ffffff', color: '#0f172a', padding: '60px', minHeight: '842px', fontFamily: 'serif' }}>

                        {/* Letterhead */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #000', paddingBottom: '16px', marginBottom: '32px' }}>
                            <div style={{ width: '45%' }}>
                                <h1 style={{ fontWeight: 'bold', fontSize: '18px', margin: 0 }}>Shahjalal University of Science and Technology</h1>
                                <p style={{ fontSize: '12px', margin: '4px 0' }}>Sylhet-3114, Bangladesh.</p>
                            </div>
                            <div style={{ width: '45%', textAlign: 'right' }}>
                                <h1 style={{ fontWeight: 'bold', fontSize: '18px', margin: 0 }}>Registrar Office</h1>
                                <p style={{ fontSize: '12px', margin: '4px 0' }}>Website: sust.edu.bd</p>
                            </div>
                        </div>

                        {/* Letter Body logic remains same... */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px', fontSize: '14px', fontWeight: 'bold' }}>
                            <div>Memo No: Reg/ {selectedReq.booking_id || '255/1/520'}</div>
                            <div>Date: {today}</div>
                        </div>

                        <div style={{ marginBottom: '40px' }}>
                            <p style={{ margin: '0 0 8px 0' }}>To,</p>
                            <p style={{ fontWeight: 'bold', textTransform: 'uppercase', margin: 0 }}>{selectedReq.userName || 'Recipient'}</p>
                            <p style={{ margin: 0 }}>{selectedReq.organizer || 'External Organization'}</p>
                        </div>

                        <div style={{ marginBottom: '32px', fontWeight: 'bold' }}>
                            Subject: <span style={{ fontStyle: 'italic' }}>Permission to use {selectedReq.spot_name} for "{selectedReq.title}".</span>
                        </div>

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

                        {/* DYNAMIC SIGNATURE SECTION */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginTop: '64px' }}>
                            <div style={{ textAlign: 'center', width: '300px' }}>
                                <p style={{ fontWeight: 'bold', fontStyle: 'italic', marginBottom: '10px' }}>By Order of the Authority,</p>

                                {/* Signature Image */}
                                <div style={{ height: '60px', marginBottom: '10px', display: 'flex', justifyContent: 'center' }}>
                                    {finalSignatory?.approver_signature && (
                                        <img
                                            crossOrigin="anonymous"
                                            src={getImageUrl(finalSignatory.approver_signature)}
                                            alt="signature"
                                            style={{ maxHeight: '100%' }}
                                        />
                                    )}
                                </div>

                                <p style={{ fontWeight: 'bold', textTransform: 'uppercase', margin: 0 }}>
                                    {finalSignatory?.approver_name || 'Registrar'}
                                </p>
                                <p style={{ margin: 0, fontSize: '13px' }}>
                                    {finalSignatory?.approver_designation || 'Shahjalal University Of Science and Technology'}
                                </p>
                                <p style={{ margin: 0, fontSize: '13px' }}>
                                    Email: {finalSignatory?.approver_email || 'registrar@sust.edu.bd'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-5 bg-white border-t flex justify-end gap-3 px-8">
                    <button onClick={() => setIsPreviewOpen(false)} className="px-6 py-2 text-xs font-bold text-gray-400">Cancel</button>
                    <button onClick={handleDownloadPdf} className="bg-[#10b981] text-white px-8 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2">
                        <Download size={14} /> Download Copy
                    </button>
                </div>
            </div>
        </div>
    );
};
export default ExternalApprovalModal;