import React, { useState, useEffect } from "react";
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Users,
  Ticket,
  Paperclip,
  Download,
  Printer,
  Share2,
  Building,
  ShieldCheck,
  UserCheck,
  Sparkles,
  ExternalLink,
  Phone,
  Mail,
  AlertTriangle,
  FileText,
  Maximize2,
} from "lucide-react";
import { Notice, CampusEvent } from "../types";

export type DetailItem = {
  id: string;
  itemType: "notice" | "event";
  title: string;
  category: string;
  date: string;
  time?: string;
  venue?: string;
  content: string; // description or full content
  bannerUrl?: string;
  attachmentName?: string;
  attachmentUrl?: string;
  organizer?: string;
  author?: string;
  speakerLineup?: string[];
  targetAudience?: string;
  isUrgent?: boolean;
  registeredCount?: number;
  maxAttendees?: number;
  status?: string;
  contactEmail?: string;
  contactPhone?: string;
  originalNotice?: Notice;
  originalEvent?: CampusEvent;
};

interface UnifiedDetailModalProps {
  item: DetailItem | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenRSVP?: (event: CampusEvent) => void;
}

export const UnifiedDetailModal: React.FC<UnifiedDetailModalProps> = ({
  item,
  isOpen,
  onClose,
  onOpenRSVP,
}) => {
  const [aspectRatio, setAspectRatio] = useState<"16:9" | "4:3">("16:9");
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    setImageLoaded(false);
    setAspectRatio("16:9");
  }, [item?.id]);

  if (!isOpen || !item) return null;

  // Auto-detect image natural aspect ratio on load
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    setImageLoaded(true);
    // If vertical or non-landscape ratio (height > 0.8 * width)
    if (naturalHeight > naturalWidth * 0.8) {
      setAspectRatio("4:3");
    } else {
      setAspectRatio("16:9");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadAttachment = () => {
    if (item.attachmentUrl) {
      window.open(item.attachmentUrl, "_blank");
    } else {
      const docContent = `FACTFUSION HUB - INSTITUTIONAL CIRCULAR & EVENT DOCUMENTATION\n\nTitle: ${item.title}\nCategory: ${item.category}\nDate: ${item.date}\nTime: ${item.time || "N/A"}\nVenue/Issued By: ${item.venue || item.author || "Admin Office"}\n\n=========================================\nOFFICIAL DETAILS:\n=========================================\n${item.content}\n\n[Verified FactFusion Hub Digital Certificate]`;

      const blob = new Blob([docContent], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${item.title.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_official_document.txt`;
      a.click();
    }
  };

  const fallbackImage =
    item.itemType === "event"
      ? "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80"
      : "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1200&q=80";

  const displayBanner = item.bannerUrl || fallbackImage;

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-[7000] flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full border border-slate-200 shadow-2xl my-auto overflow-hidden relative flex flex-col max-h-[90vh]">
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white flex items-center justify-center cursor-pointer transition backdrop-blur-md shadow-md"
          title="Close detail view"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Container */}
        <div className="overflow-y-auto flex-1">
          {/* TOP HERO MEDIA BANNER WITH DYNAMIC ASPECT RATIO */}
          <div className="relative w-full bg-slate-950 overflow-hidden group">
            <div
              className={`w-full relative transition-all duration-300 ${
                aspectRatio === "16:9" ? "aspect-video" : "aspect-[4/3]"
              }`}
            >
              <img
                src={displayBanner}
                alt={item.title}
                onLoad={handleImageLoad}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-black/20"></div>

              {/* Aspect Ratio Badge & Display Format Toggle */}
              <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-black/60 text-white backdrop-blur-md border border-white/20 flex items-center gap-1.5">
                  <Maximize2 className="w-3 h-3 text-emerald-400" />
                  <span>{aspectRatio} {aspectRatio === "16:9" ? "Widescreen" : "Standard Photo"}</span>
                </span>
                <button
                  onClick={() => setAspectRatio(aspectRatio === "16:9" ? "4:3" : "16:9")}
                  className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/20 hover:bg-white/40 text-white backdrop-blur-md border border-white/20 transition cursor-pointer"
                  title="Toggle Display Aspect Ratio"
                >
                  Switch Ratio
                </button>
              </div>

              {/* Title & Category Badge over Hero */}
              <div className="absolute bottom-5 left-6 right-6 text-white space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider backdrop-blur-md ${
                      item.isUrgent
                        ? "bg-rose-600 text-white animate-pulse"
                        : item.itemType === "event"
                        ? "bg-emerald-500 text-slate-950"
                        : "bg-blue-600 text-white"
                    }`}
                  >
                    {item.category}
                  </span>

                  <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-white/20 text-white backdrop-blur-xs">
                    {item.itemType === "event" ? "Campus Event" : "Official Notice"}
                  </span>

                  {item.isUrgent && (
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-500/80 text-white text-xs font-extrabold flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> High Priority
                    </span>
                  )}
                </div>

                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white leading-tight drop-shadow-md">
                  {item.title}
                </h1>
              </div>
            </div>
          </div>

          {/* MAIN CONTENT BODY */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* QUICK OPERATIONAL STATS GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200/90 text-xs font-bold text-slate-700">
              {/* Date & Time */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">
                    Date & Schedule
                  </div>
                  <div className="text-slate-900 font-extrabold mt-0.5">
                    {item.date} {item.time && `• ${item.time}`}
                  </div>
                </div>
              </div>

              {/* Location / Venue / Issued By */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">
                    {item.itemType === "event" ? "Campus Venue" : "Issued Authority"}
                  </div>
                  <div className="text-slate-900 font-extrabold mt-0.5 truncate">
                    {item.venue || item.author || item.organizer || "Main Campus Desk"}
                  </div>
                </div>
              </div>

              {/* Target Audience / Attendees */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">
                    {item.itemType === "event" ? "Registration" : "Target Audience"}
                  </div>
                  <div className="text-slate-900 font-extrabold mt-0.5">
                    {item.itemType === "event"
                      ? `${item.registeredCount || 0} / ${item.maxAttendees || 200} Registered`
                      : item.targetAudience || "All Students & Staff"}
                  </div>
                </div>
              </div>
            </div>

            {/* SPEAKER LINEUP / ORGANIZER BANNER (IF APPLICABLE) */}
            {(item.speakerLineup && item.speakerLineup.length > 0) || item.organizer ? (
              <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="font-extrabold text-emerald-950 uppercase tracking-wider text-[10px]">
                    Organized & Moderated By
                  </div>
                  <div className="font-black text-emerald-900 text-sm">
                    {item.organizer || item.author || "FactFusion Hub Academic Committee"}
                  </div>
                </div>

                {item.speakerLineup && item.speakerLineup.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5">
                    {item.speakerLineup.map((speaker, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-white text-emerald-950 border border-emerald-200 font-bold"
                      >
                        🎙️ {speaker}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ) : null}

            {/* DESCRIPTION & CIRCULAR CONTENT */}
            <div className="space-y-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                Detailed Information & Announcements
              </h3>
              <div className="p-5 bg-white rounded-2xl border border-slate-200 text-sm sm:text-base text-slate-700 leading-relaxed font-medium whitespace-pre-line shadow-2xs">
                {item.content}
              </div>
            </div>

            {/* ATTACHMENT / OFFICIAL CIRCULAR PDF */}
            {(item.attachmentName || item.itemType === "notice") && (
              <div className="p-4 bg-slate-900 text-white rounded-2xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-md">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-black text-white">
                      {item.attachmentName || `${item.title.substring(0, 30)}...pdf`}
                    </div>
                    <div className="text-[11px] text-slate-400 font-medium">
                      Official Institutional PDF Attachment • Verified Digital Copy
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleDownloadAttachment}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 shrink-0 cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" /> Download PDF Document
                </button>
              </div>
            )}

            {/* OFFICIAL CONTACT INFORMATION */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
              <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                Official Helpdesk & Inquiries
              </div>
              <div className="flex flex-wrap items-center gap-6 text-slate-700 font-bold">
                <span className="flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-slate-500" />
                  {item.author || item.organizer || "FactFusion Hub Administration"}
                </span>
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-emerald-600" />
                  {item.contactEmail || "info@factfusion.edu.np"}
                </span>
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-blue-600" />
                  {item.contactPhone || "+977 9807695843"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* MODAL ACTIONS FOOTER */}
        <div className="p-4 sm:px-6 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 text-xs font-black flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" /> Print
            </button>
            <button
              onClick={handleDownloadAttachment}
              className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-800 text-xs font-black flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" /> Save Document
            </button>
          </div>

          <div className="flex items-center gap-3">
            {item.itemType === "event" && item.originalEvent && onOpenRSVP && (
              <button
                onClick={() => {
                  onClose();
                  onOpenRSVP(item.originalEvent!);
                }}
                className="px-5 py-2.5 bg-[#0B4632] hover:bg-emerald-900 text-white rounded-xl text-xs font-black shadow-xs transition flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Ticket className="w-4 h-4" />
                <span>RSVP / Register Free</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-black transition cursor-pointer"
            >
              Close Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
