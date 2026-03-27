import { X, Download } from "lucide-react";

import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const PdfRow = ({ label, value }) => (
    <div className="flex border-b border-gray-50 pb-2">
        <span className="w-32 text-gray-400 font-bold uppercase text-[10px] tracking-wider">{label}</span>
        <span className="font-bold text-slate-800 uppercase tracking-tight">{value || 'N/A'}</span>
    </div>
);

export default function ApprovalModal({ selectedReq, setIsPreviewOpen }) {

    const handleDownloadPdf = () => {
        const input = document.getElementById('pdf-content');

        if (!input) {
            console.error("ID 'pdf-content' not found");
            return;
        }

        html2canvas(input, {
            scale: 2,
            useCORS: true,
            backgroundColor: "#ffffff"
        }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Approval_Copy_${selectedReq?.id || 'Request'}.pdf`);
        });
    };
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsPreviewOpen(false)}></div>
            <div className="relative bg-zinc-100 w-full max-w-4xl rounded-[32px] shadow-2xl flex flex-col max-h-[95vh] overflow-hidden">
                <div className="bg-slate-900 p-3 text-white flex justify-between items-center px-8">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80">Approval Copy System</span>
                    <button onClick={() => setIsPreviewOpen(false)} className="hover:bg-slate-800 p-1.5 rounded-full"><X size={18} /></button>
                </div>
                <div className="p-6 overflow-y-auto">
                    <div id="pdf-content" className="bg-white w-full mx-auto p-10 border border-gray-200 text-slate-900 min-h-[842px]">
                        <div className="text-center mb-8 border-b-2 border-slate-900 pb-4">
                            <h1 className="text-2xl font-black uppercase">Approval Copy</h1>
                            <p className="text-sm font-bold text-slate-500">Shahjalal University of Science & Technology</p>
                        </div>
                        <div className="space-y-8">
                            <section>
                                <h2 className="bg-slate-100 px-3 py-1 text-[11px] font-black uppercase mb-4 inline-block">01. Event Details</h2>
                                <div className="grid grid-cols-2 gap-x-12 gap-y-4 text-sm ml-2">
                                    <PdfRow label="Title" value={selectedReq.title} />
                                    <PdfRow label="Spot" value={selectedReq.spotName} />
                                    <PdfRow label="Date" value={selectedReq.endDate ? `${selectedReq.date} to ${selectedReq.endDate}` : selectedReq.date} />
                                    <PdfRow label="Session" value={selectedReq.session} />
                                    <PdfRow label="Organizer" value={selectedReq.organizer} />
                                    <PdfRow label="Timing" value={`${selectedReq.startTime || '00:00'} - ${selectedReq.endTime || '00:00'}`} />
                                </div>
                            </section>
                            {/* Stakeholders etc... */}
                            {/* 2. Stakeholder Grid (Applicant, Recommender, Approver) */}
                            <section className="grid grid-cols-3 gap-8 border-t border-b border-gray-100 py-8">
                                {/* Applicant */}
                                <div className="space-y-4">
                                    <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Applicant Details</h3>
                                    <div className="text-xs space-y-1">
                                        <p className="font-bold">{selectedReq.applicant?.name || 'N/A'}</p>
                                        <p>{selectedReq.applicant?.dept || 'N/A'}</p>
                                        <p className="text-slate-500 italic">{selectedReq.applicant?.designation}</p>
                                        <p className="pt-2">Contact: {selectedReq.applicant?.contact}</p>
                                    </div>
                                    <div className="h-12 w-24 bg-gray-50 flex items-center justify-center border border-dashed rounded italic text-[10px] text-gray-400">
                                        <img src={selectedReq.applicant?.signature} alt="sig" />
                                        {/* Applicant Signature */}
                                    </div>
                                </div>

                                {/* Recommender */}
                                <div className="space-y-4">
                                    <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Recommender Details</h3>
                                    <div className="text-xs space-y-1">
                                        <p className="font-bold">{selectedReq.recommender?.name}</p>
                                        <p>{selectedReq.recommender?.dept || 'Physics'}</p>
                                        <p className="text-slate-500 italic">{selectedReq.recommender?.post}</p>
                                    </div>
                                    <div className="h-12 w-24 bg-gray-50 flex items-center justify-center border border-dashed rounded italic text-[10px] text-gray-400">
                                        <img src={selectedReq.recommender?.signature} alt="sig" />
                                        {/* Recommender Signature */}
                                    </div>
                                </div>

                                {/* Approver */}
                                <div className="space-y-4">
                                    <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Approver Details</h3>
                                    <div className="text-xs space-y-1">
                                        <p className="font-bold">{selectedReq.approver?.name || 'Prof. Dr. M. Ahmed'}</p>
                                        <p className="text-slate-500 italic">{selectedReq.approver?.post || 'Director'}</p>
                                    </div>
                                    <div className="h-12 w-24 bg-blue-50/50 flex items-center justify-center border border-blue-100 rounded italic text-[10px] text-blue-400">
                                        <img src={selectedReq.approver?.signature} alt="sig" />
                                        {/* Approver Signature */}
                                    </div>
                                </div>
                            </section>

                            <section className="space-y-3 pt-4 border-t border-slate-100">
                                <p className="text-[11px] font-black text-slate-800 uppercase tracking-wider">Terms and Conditions</p>
                                <ol className="text-[11px] text-slate-600 space-y-1 ml-4 list-decimal leading-relaxed">
                                    <li>The applicant must ensure the cleanliness of the spot and properly dispose of all waste materials after the event.</li>
                                    <li>Any damage to university property during the event will be the sole responsibility of the organizing department/individual.</li>
                                    <li>Sound systems must be kept within a reasonable volume limit to avoid disturbing the academic environment of the university.</li>
                                    <li>The event must be concluded strictly within the approved timeframe, and no extension is allowed without prior permission from the Estate Office.</li>
                                </ol>
                            </section>

                            {/* 3. Forwarded Copy List */}
                            <section className="space-y-3">
                                <p className="text-[11px] font-black text-slate-800">Forwarded copy to:</p>
                                <ol className="text-[11px] text-slate-600 space-y-1 ml-4 list-decimal leading-relaxed">
                                    <li>The Registrar, SUST (for kind information).</li>
                                    <li>The Estate Officer, SUST (for field preparation and security).</li>
                                    <li>The Proctor, SUST (for maintenance of law and order).</li>
                                    <li>The Director (Audit), SUST.</li>
                                    <li>Office Copy.</li>
                                </ol>
                            </section>
                        </div>
                    </div>
                </div>
                <div className="p-5 bg-white border-t flex justify-end gap-3 px-8">
                    <button onClick={() => setIsPreviewOpen(false)} className="px-6 py-2 text-xs font-bold text-gray-500 hover:text-red-500">Close</button>
                    <button onClick={handleDownloadPdf} className="bg-emerald-600 text-white px-6 py-2 rounded-xl text-xs font-bold flex items-center gap-2"><Download size={14} /> Download PDF</button>
                </div>
            </div>
        </div>
    );
}