import React, { useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Search,
  Filter,
  Paperclip,
  Users,
  AlertCircle,
  FileText,
  ArrowRight,
  Ticket,
  Sparkles,
  Megaphone,
  CheckCircle2,
  Download,
  ShieldAlert,
} from "lucide-react";
import { Notice, CampusEvent } from "../types";
import { DetailItem } from "./UnifiedDetailModal";

interface ConsolidatedEventsHubProps {
  notices: Notice[];
  events: CampusEvent[];
  onSelectItem: (item: DetailItem) => void;
  onRSVP: (event: CampusEvent) => void;
}

export const ConsolidatedEventsHub: React.FC<ConsolidatedEventsHubProps> = ({
  notices,
  events,
  onSelectItem,
  onRSVP,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [audienceFilter, setAudienceFilter] = useState<string>("All");

  const todayStr = new Date().toISOString().substring(0, 10);

  // Convert Notices & Events into Unified DetailItems for the single cohesive hub feed
  const activeNoticeItems: DetailItem[] = notices
    .filter((n) => {
      if (n.status && n.status !== "Active") return false;
      if (n.expiryDate && n.expiryDate < todayStr) return false;
      return true;
    })
    .map((n) => ({
      id: `notice-${n.id}`,
      itemType: "notice",
      title: n.title,
      category: n.category === "Urgent" ? "Urgent Circular" : `${n.category} Notice`,
      date: n.date,
      content: n.content,
      bannerUrl: undefined, // Notices collapse image container if no banner provided
      attachmentName: n.attachmentName,
      attachmentUrl: n.attachmentUrl,
      author: n.author || "Admin Office",
      targetAudience: n.targetAudience || "All",
      isUrgent: n.isUrgent || n.category === "Urgent",
      status: n.status,
      originalNotice: n,
    }));

  const eventItems: DetailItem[] = events.map((e) => ({
    id: `event-${e.id}`,
    itemType: "event",
    title: e.title,
    category: `${e.category} Event`,
    date: e.date,
    time: e.time,
    venue: e.venue,
    content: e.description,
    bannerUrl: e.bannerUrl && e.bannerUrl.trim() !== "" ? e.bannerUrl : undefined,
    organizer: e.organizer,
    registeredCount: e.registeredCount,
    maxAttendees: e.maxAttendees,
    status: e.status,
    speakerLineup: ["Keynote Academic Panel", "Industry Mentors"],
    originalEvent: e,
  }));

  // Combine and sort chronologically (most recent or upcoming dates first)
  const allHubItems: DetailItem[] = [...activeNoticeItems, ...eventItems].sort((a, b) => {
    // Put urgent items at top first if active
    if (a.isUrgent && !b.isUrgent) return -1;
    if (!a.isUrgent && b.isUrgent) return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  // Filter items based on tab selection, search, and audience
  const filteredItems = allHubItems.filter((item) => {
    // Search query match
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.venue && item.venue.toLowerCase().includes(searchQuery.toLowerCase()));

    // Audience filter
    const matchesAudience =
      audienceFilter === "All" ||
      !item.targetAudience ||
      item.targetAudience === audienceFilter ||
      item.targetAudience === "All";

    // Category / Filter tab match
    if (selectedFilter === "All") return matchesSearch && matchesAudience;
    if (selectedFilter === "Events") return item.itemType === "event" && matchesSearch && matchesAudience;
    if (selectedFilter === "Notices") return item.itemType === "notice" && matchesSearch && matchesAudience;
    if (selectedFilter === "Urgent") return item.isUrgent && matchesSearch && matchesAudience;

    return item.category.toLowerCase().includes(selectedFilter.toLowerCase()) && matchesSearch && matchesAudience;
  });

  const filterTabs = [
    { id: "All", label: "All Hub Updates" },
    { id: "Events", label: "Campus Events & Hackathons" },
    { id: "Notices", label: "Notices & Circulars" },
    { id: "Urgent", label: "Urgent & Exam Bulletins" },
  ];

  // Helper function to format Date badge parts
  const parseDateParts = (dateStr: string) => {
    try {
      const dateObj = new Date(dateStr);
      if (isNaN(dateObj.getTime())) {
        return { day: "15", month: "SEP", year: "2026", weekday: "MON" };
      }
      const day = dateObj.getDate().toString().padStart(2, "0");
      const month = dateObj.toLocaleString("en-US", { month: "short" }).toUpperCase();
      const year = dateObj.getFullYear();
      const weekday = dateObj.toLocaleString("en-US", { weekday: "short" }).toUpperCase();
      return { day, month, year, weekday };
    } catch {
      return { day: "15", month: "SEP", year: "2026", weekday: "MON" };
    }
  };

  return (
    <section
      className="sec-container bg-white py-16 px-[4%] sm:px-[5%] lg:px-[8%] border-t border-b border-slate-200 text-slate-900"
      id="events"
    >
      {/* Hidden duplicate anchor element so navbar links to #notices also smoothly land here */}
      <div id="notices" className="sr-only">Notice Board</div>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* SECTION HEADER - ALWAYS DESKTOP MOOD */}
        <div className="flex flex-row items-end justify-between gap-6 pb-2">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-[#0B4632] border border-emerald-200 text-xs font-black uppercase tracking-wider mb-3">
              <Calendar className="w-3.5 h-3.5 text-emerald-700" />
              <span>Unified Campus Hub</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 tracking-tight">
              Upcoming Events & Official Bulletins
            </h2>
            <p className="text-sm sm:text-base font-medium text-slate-600 mt-2 max-w-2xl">
              All institutional notices, NEB exam circulars, campus hackathons, workshops, and upcoming summits consolidated into a single real-time stream.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200 shadow-2xs shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="hidden sm:inline">Live Synchronized Stream</span>
            <span className="sm:hidden">Live Stream</span>
          </div>
        </div>

        {/* DESKTOP-MOOD CONTAINER: LOCKED TO DESKTOP HORIZONTAL SPEC ACROSS MOBILE, TABLET & DESKTOP */}
        <div className="w-full overflow-x-auto pb-4 -mx-2 px-2 sm:mx-0 sm:px-0 scrollbar-thin">
          {/* Visual Indicator on Mobile/Tablet acknowledging Desktop-Mood lock */}
          <div className="lg:hidden flex items-center justify-between bg-emerald-50 text-emerald-800 text-[11px] font-bold px-3 py-1.5 rounded-lg mb-3 border border-emerald-200">
            <span>🖥️ Desktop Mood Active (Full horizontal layout preserved)</span>
            <span className="text-emerald-700">← Scroll to explore →</span>
          </div>

          <div className="min-w-[880px] space-y-4">
            {/* CONTROLS BAR: FILTER TABS & SEARCH (ALWAYS DESKTOP HORIZONTAL ROW) */}
            <div className="flex flex-row items-center justify-between gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/90 shadow-2xs mb-[14px]">
              {/* Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-0 scrollbar-none shrink-0">
                {filterTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedFilter(tab.id)}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                      selectedFilter === tab.id
                        ? "bg-[#0B4632] text-white shadow-xs font-black scale-102"
                        : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Search & Audience Select */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="relative w-64">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search events & circulars..."
                    className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium bg-white text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <select
                  value={audienceFilter}
                  onChange={(e) => setAudienceFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold bg-white text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-none shrink-0"
                >
                  <option value="All">All Audiences</option>
                  <option value="Students">Students</option>
                  <option value="Faculty">Faculty</option>
                  <option value="Parents">Parents</option>
                </select>
              </div>
            </div>

            {/* CONSOLIDATED LIST LAYOUT (ALWAYS DESKTOP HORIZONTAL ROW CARDS WITH 14-PIXEL GAP) */}
            {filteredItems.length === 0 ? (
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-12 text-center space-y-3 shadow-2xs">
                <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto border border-slate-200">
                  <FileText className="w-6 h-6" />
                </div>
                <h4 className="text-base font-extrabold text-slate-800">No matching updates found</h4>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
                  There are currently no items matching your criteria. Try adjusting your search query or switching filter tabs.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-[14px]">
                {filteredItems.map((item) => {
                  const { day, month, year, weekday } = parseDateParts(item.date);
                  const hasImage = Boolean(item.bannerUrl && item.bannerUrl.trim() !== "");

                  return (
                    <div
                      key={item.id}
                      onClick={() => onSelectItem(item)}
                      className={`group bg-[#0A2E23] rounded-2xl p-6 border transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-950/60 flex flex-row items-stretch gap-6 cursor-pointer relative overflow-hidden ${
                        item.isUrgent
                          ? "border-rose-500/60 ring-1 ring-rose-500/30"
                          : "border-emerald-800/50 hover:border-emerald-500/80"
                      }`}
                    >
                      {/* Urgent Top Bar Accent */}
                      {item.isUrgent && (
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 via-amber-500 to-rose-500"></div>
                      )}

                      {/* LEFT COLUMN: DEDICATED DATE BADGE (ALWAYS DESKTOP WIDTH & PADDING) */}
                      <div className="flex flex-col items-center justify-center p-4 bg-amber-100 text-amber-950 rounded-xl shrink-0 w-24 text-center border border-amber-200/80 shadow-xs transition-transform group-hover:scale-102 my-auto self-center">
                        <span className="text-3xl font-black leading-none tracking-tight text-amber-950">
                          {day}
                        </span>
                        <span className="text-sm font-black uppercase tracking-wider text-amber-900 mt-1">
                          {month}
                        </span>
                        <span className="text-[10px] font-bold text-amber-800/80 mt-0.5 tracking-wider">
                          {year}
                        </span>
                      </div>

                      {/* MIDDLE COLUMN: TITLE, CATEGORY, DESCRIPTION & METADATA (ALWAYS DESKTOP FULL SPEC) */}
                      <div className="flex-1 flex flex-col justify-between min-w-0 space-y-3">
                        <div className="space-y-2">
                          {/* Category Pills & Badges */}
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span
                              className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider ${
                                item.isUrgent
                                  ? "bg-rose-500/20 text-rose-300 border border-rose-500/50 animate-pulse"
                                  : item.itemType === "event"
                                  ? "bg-[#134537] text-emerald-300 border border-emerald-700/50"
                                  : "bg-blue-900/40 text-blue-300 border border-blue-700/50"
                              }`}
                            >
                              {item.category}
                            </span>

                            {item.targetAudience && item.targetAudience !== "All" && (
                              <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#134537]/70 text-[#A3B8B0] border border-emerald-800/40">
                                Audience: {item.targetAudience}
                              </span>
                            )}

                            {item.attachmentName && (
                              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-300 bg-[#134537] px-2.5 py-1 rounded-md border border-emerald-700/50">
                                <Paperclip className="w-3.5 h-3.5 text-emerald-400" /> PDF Attachment
                              </span>
                            )}
                          </div>

                          {/* Title */}
                          <h3 className="text-lg lg:text-xl font-black text-white group-hover:text-emerald-300 transition-colors leading-snug line-clamp-2">
                            {item.title}
                          </h3>

                          {/* Description / Subtext */}
                          <p className="text-sm text-[#A3B8B0] font-medium leading-relaxed line-clamp-3">
                            {item.content}
                          </p>
                        </div>

                        {/* Metadata line: Venue/Schedule & Action Link */}
                        <div className="pt-3 border-t border-emerald-800/40 flex flex-row items-center justify-between gap-3 text-xs text-[#A3B8B0] font-semibold mt-auto">
                          <div className="flex items-center gap-4">
                            {item.time && (
                              <span className="flex items-center gap-1.5 text-[#A3B8B0] font-bold shrink-0">
                                <Clock className="w-3.5 h-3.5 text-emerald-400" /> {item.time}
                              </span>
                            )}
                            <span className="flex items-center gap-1.5 text-[#A3B8B0] font-medium truncate max-w-[240px]">
                              <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                              <span className="truncate">{item.venue || item.author || "Main Campus Desk"}</span>
                            </span>
                          </div>

                          <div className="flex items-center gap-2.5 shrink-0">
                            {item.itemType === "event" && item.originalEvent && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onRSVP(item.originalEvent!);
                                }}
                                className="px-3.5 py-1.5 bg-emerald-400 hover:bg-emerald-300 text-[#0A2E23] rounded-xl text-xs font-black transition flex items-center gap-1 cursor-pointer shadow-sm active:scale-95 shrink-0"
                              >
                                <Ticket className="w-3.5 h-3.5" /> RSVP Free
                              </button>
                            )}

                            {item.attachmentUrl && (
                              <a
                                href={item.attachmentUrl}
                                onClick={(e) => e.stopPropagation()}
                                target="_blank"
                                rel="noreferrer"
                                className="px-3 py-1.5 bg-[#134537] hover:bg-[#1A5746] text-emerald-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border border-emerald-700/50 shrink-0"
                              >
                                <Download className="w-3.5 h-3.5" /> Download PDF Document
                              </a>
                            )}

                            <span className="inline-flex items-center gap-1 font-black text-emerald-300 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0">
                              Details <ArrowRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* RIGHT COLUMN: RELEVANT EVENT THUMBNAIL (ALWAYS DESKTOP HORIZONTAL THUMBNAIL ON RIGHT) */}
                      {hasImage && (
                        <div className="w-48 lg:w-56 h-auto min-h-[140px] rounded-xl overflow-hidden bg-[#061F17] relative shrink-0 border border-emerald-800/50">
                          <img
                            src={item.bannerUrl}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0A2E23]/60 via-transparent to-transparent"></div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

