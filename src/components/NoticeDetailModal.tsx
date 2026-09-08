import React from "react";
import {
  X,
  Megaphone,
  Calendar,
  Users,
  Paperclip,
  Download,
  Share2,
  Printer,
  ShieldCheck,
  Building,
} from "lucide-react";
import { Notice } from "../types";

interface NoticeDetailModalProps {
  notice: Notice | null;
  isOpen: boolean;
  onClose: () => void;
}

export const NoticeDetailModal: React.FC<NoticeDetailModalProps> = ({
  notice,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !notice) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadAttachment = () => {
    if (notice.attachmentUrl) {
      window.open(notice.attachmentUrl, "_blank");
    } else {
      // Generate a simulated official download document
      const blob = new Blob(
        [
          `FACTFUSION HUB - INSTITUTIONAL NOTICE\n\nTitle: ${notice.title}\nCategory: ${notice.category}\nDate: ${notice.date}\nAuthor: ${notice.author || "Administration"}\nTarget Audience: ${notice.targetAudience || "All"}\n\n===============================\nCIRCULAR CONTENT:\n===============================\n${notice.content}\n\n[Official Seal Verified]`,
        ],
        { type: "text/plain" }
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${notice.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_notice.txt`;
      a.click();
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[7000] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6 my-auto overflow-hidden relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center cursor-pointer transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="space-y-3 pr-8">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider ${
                notice.isUrgent
                  ? "bg-rose-500 text-white"
                  : "bg-emerald-100 text-emerald-950 border border-emerald-300"
              }`}
            >
              {notice.category}
            </span>
            {notice.isUrgent && (
              <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[11px] font-black animate-pulse">
                High Priority
              </span>
            )}
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Published: {notice.date}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-slate-950 leading-tight">
            {notice.title}
          </h2>
        </div>

        {/* Notice Meta Information Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700">
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">Issued By</div>
            <div className="text-slate-900 font-bold mt-0.5 flex items-center gap-1">
              <Building className="w-3.5 h-3.5 text-slate-500" />
              <span className="truncate">{notice.author || "Administration Desk"}</span>
            </div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">Target Audience</div>
            <div className="text-slate-900 font-bold mt-0.5 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-slate-500" />
              <span>{notice.targetAudience || "All Students & Staff"}</span>
            </div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">Status</div>
            <div className="text-emerald-700 font-bold mt-0.5 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Official Circular</span>
            </div>
          </div>
        </div>

        {/* Full Notice Content */}
        <div className="p-5 bg-white rounded-xl border border-slate-200/80 text-sm sm:text-base text-slate-700 leading-relaxed font-medium whitespace-pre-line max-h-72 overflow-y-auto">
          {notice.content}
        </div>

        {/* Attachment box if present */}
        {notice.attachmentName && (
          <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-950 truncate">
              <Paperclip className="w-4 h-4 text-emerald-700 shrink-0" />
              <span className="truncate">{notice.attachmentName}</span>
            </div>
            <button
              onClick={handleDownloadAttachment}
              className="px-3 py-1.5 rounded-lg bg-[#0B4632] hover:bg-emerald-900 text-white text-xs font-bold flex items-center gap-1.5 transition shrink-0 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Download
            </button>
          </div>
        )}

        {/* Modal Actions Footer */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black flex items-center gap-1.5 transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" /> Print
            </button>
            <button
              onClick={handleDownloadAttachment}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black flex items-center gap-1.5 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Save Copy
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#0B4632] hover:bg-emerald-900 text-white text-xs font-black transition cursor-pointer"
          >
            Close Circular
          </button>
        </div>
      </div>
    </div>
  );
};
