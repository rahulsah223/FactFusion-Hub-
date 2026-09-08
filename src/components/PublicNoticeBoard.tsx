import React, { useState } from "react";
import {
  Megaphone,
  Calendar,
  Search,
  Filter,
  Paperclip,
  Users,
  Eye,
  AlertCircle,
  FileText,
  ChevronRight,
  ArrowRight,
  Clock,
  Sparkles,
} from "lucide-react";
import { Notice } from "../types";

interface PublicNoticeBoardProps {
  notices: Notice[];
  onSelectNotice: (notice: Notice) => void;
}

export const PublicNoticeBoard: React.FC<PublicNoticeBoardProps> = ({ notices, onSelectNotice }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [audienceFilter, setAudienceFilter] = useState<string>("All");

  const todayStr = new Date().toISOString().substring(0, 10);

  // Filter only Active notices and non-expired notices
  const activeNotices = notices.filter((n) => {
    // Exclude Draft / Archived notices on public view
    if (n.status && n.status !== "Active") return false;
    // Exclude expired notices if expiryDate is set and past today
    if (n.expiryDate && n.expiryDate < todayStr) return false;

    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (n.author && n.author.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === "All" || n.category === selectedCategory;
    const matchesAudience =
      audienceFilter === "All" || n.targetAudience === audienceFilter || n.targetAudience === "All";

    return matchesSearch && matchesCategory && matchesAudience;
  });

  const categories = [
    { id: "All", label: "All Bulletins" },
    { id: "Urgent", label: "Urgent Circulars" },
    { id: "Academic", label: "Academic" },
    { id: "Exam", label: "Exam Routines" },
    { id: "Holiday", label: "Holidays" },
    { id: "Admission", label: "Admissions" },
  ];

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "Urgent":
        return "bg-rose-500 text-white shadow-xs animate-pulse";
      case "Exam":
        return "bg-purple-100 text-purple-900 border border-purple-300";
      case "Academic":
        return "bg-emerald-100 text-emerald-950 border border-emerald-300";
      case "Holiday":
        return "bg-blue-100 text-blue-950 border border-blue-300";
      case "Admission":
        return "bg-amber-100 text-amber-950 border border-amber-300";
      default:
        return "bg-slate-100 text-slate-900 border border-slate-300";
    }
  };

  return (
    <section className="sec-container bg-[#F8FAFC] py-16 px-[6%] lg:px-[8%] border-t border-b border-slate-200" id="notices">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* SECTION HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-black uppercase tracking-wider mb-3">
              <Megaphone className="w-3.5 h-3.5 text-emerald-700" />
              <span>Official Institutional Circulars</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 tracking-tight">
              Notice Board & Academic Bulletins
            </h2>
            <p className="text-sm sm:text-base font-medium text-slate-600 mt-2 max-w-2xl">
              Stay updated with the latest NEB board schedules, campus holidays, scholarship lists, and administrative announcements.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-2xs self-start md:self-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Live Synchronized with Admin Desk</span>
          </div>
        </div>

        {/* CONTROLS BAR: CATEGORY CHIPS + SEARCH */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-xs">
          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-[#0B4632] text-white shadow-xs scale-102"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search & Audience */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search circulars..."
                className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium bg-slate-50 focus:bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <select
              value={audienceFilter}
              onChange={(e) => setAudienceFilter(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold bg-slate-50 text-slate-700 focus:ring-2 focus:ring-emerald-600 focus:outline-none shrink-0"
            >
              <option value="All">All Audiences</option>
              <option value="Students">Students</option>
              <option value="Faculty">Faculty</option>
              <option value="Parents">Parents</option>
            </select>
          </div>
        </div>

        {/* NOTICES GRID */}
        {activeNotices.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <FileText className="w-6 h-6" />
            </div>
            <h4 className="text-base font-extrabold text-slate-800">No matching notices found</h4>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              There are currently no active announcements matching your query or filter criteria. Check back soon for institutional updates.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {activeNotices.map((notice) => (
              <div
                key={notice.id}
                onClick={() => onSelectNotice(notice)}
                className={`group bg-white rounded-2xl p-6 border transition-all duration-200 hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between cursor-pointer relative overflow-hidden ${
                  notice.isUrgent
                    ? "border-rose-300 ring-1 ring-rose-200/80 shadow-rose-100/50"
                    : "border-slate-200/90 hover:border-emerald-400 shadow-xs"
                }`}
              >
                {/* Urgent top ribbon accent */}
                {notice.isUrgent && (
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-500 via-amber-500 to-rose-500"></div>
                )}

                <div className="space-y-3.5">
                  {/* Category & Date */}
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider ${getCategoryBadge(
                        notice.category
                      )}`}
                    >
                      {notice.category}
                    </span>

                    <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {notice.date}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-[#0B4632] transition-colors leading-snug line-clamp-2">
                    {notice.title}
                  </h3>

                  {/* Description preview */}
                  <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed line-clamp-3">
                    {notice.content}
                  </p>
                </div>

                {/* Card Footer: Attachment, Audience, Read More Link */}
                <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 text-slate-500 font-semibold truncate">
                    {notice.attachmentName ? (
                      <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-bold truncate">
                        <Paperclip className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span className="truncate max-w-[120px]">{notice.attachmentName}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-slate-500 font-semibold">
                        <Users className="w-3 h-3 text-slate-400 shrink-0" />
                        {notice.targetAudience || "All"}
                      </span>
                    )}
                  </div>

                  <span className="inline-flex items-center gap-1 font-black text-[#0B4632] group-hover:translate-x-0.5 transition-transform shrink-0">
                    Read Circular <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
