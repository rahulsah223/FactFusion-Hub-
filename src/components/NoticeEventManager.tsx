import React, { useState, useEffect } from "react";
import {
  Megaphone,
  Calendar,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit3,
  Eye,
  CheckCircle2,
  Clock,
  Archive,
  AlertCircle,
  FileText,
  Paperclip,
  Users,
  MapPin,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Sparkles,
  X,
  Radio,
  Tag,
  Share2,
} from "lucide-react";
import { Notice, CampusEvent } from "../types";

interface NoticeEventManagerProps {
  onSyncUpdated?: () => void;
}

export const NoticeEventManager: React.FC<NoticeEventManagerProps> = ({ onSyncUpdated }) => {
  const [activeModule, setActiveModule] = useState<"notices" | "events">("notices");

  // Notices state
  const [notices, setNotices] = useState<Notice[]>([]);
  const [noticeSearch, setNoticeSearch] = useState("");
  const [noticeCategoryFilter, setNoticeCategoryFilter] = useState<string>("All");
  const [noticeStatusFilter, setNoticeStatusFilter] = useState<string>("All");
  const [noticeAudienceFilter, setNoticeAudienceFilter] = useState<string>("All");
  const [noticePage, setNoticePage] = useState(1);
  const itemsPerPage = 5;

  // Events state
  const [events, setEvents] = useState<CampusEvent[]>([]);
  const [eventSearch, setEventSearch] = useState("");
  const [eventCategoryFilter, setEventCategoryFilter] = useState<string>("All");
  const [eventStatusFilter, setEventStatusFilter] = useState<string>("All");
  const [eventPage, setEventPage] = useState(1);

  // Loading & Action states
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Notice Modals state
  const [isNoticeFormOpen, setIsNoticeFormOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [previewNotice, setPreviewNotice] = useState<Notice | null>(null);
  const [deleteNoticeTarget, setDeleteNoticeTarget] = useState<Notice | null>(null);

  // Event Modals state
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CampusEvent | null>(null);
  const [previewEvent, setPreviewEvent] = useState<CampusEvent | null>(null);
  const [deleteEventTarget, setDeleteEventTarget] = useState<CampusEvent | null>(null);

  // Notice Form Fields
  const [nTitle, setNTitle] = useState("");
  const [nContent, setNContent] = useState("");
  const [nCategory, setNCategory] = useState<Notice["category"]>("General");
  const [nTargetAudience, setNTargetAudience] = useState<Notice["targetAudience"]>("All");
  const [nDate, setNDate] = useState(new Date().toISOString().substring(0, 10));
  const [nExpiryDate, setNExpiryDate] = useState("");
  const [nIsUrgent, setNIsUrgent] = useState(false);
  const [nStatus, setNStatus] = useState<Notice["status"]>("Active");
  const [nAttachmentName, setNAttachmentName] = useState("");
  const [nAuthor, setNAuthor] = useState("FactFusion Administration");

  // Event Form Fields
  const [eTitle, setETitle] = useState("");
  const [eDescription, setEDescription] = useState("");
  const [eDate, setEDate] = useState(new Date().toISOString().substring(0, 10));
  const [eTime, setETime] = useState("10:00 AM - 02:00 PM");
  const [eVenue, setEVenue] = useState("Main Campus Auditorium");
  const [eCategory, setECategory] = useState<CampusEvent["category"]>("Workshop");
  const [eStatus, setEStatus] = useState<CampusEvent["status"]>("Upcoming");
  const [eBannerUrl, setEBannerUrl] = useState("https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80");
  const [eRegistrationLink, setERegistrationLink] = useState("");
  const [eOrganizer, setEOrganizer] = useState("FactFusion Hub Campus");
  const [eMaxAttendees, setEMaxAttendees] = useState(200);

  // Initial Fetch
  useEffect(() => {
    loadAllData();
  }, []);

  const showFeedback = (text: string, type: "success" | "error" = "success") => {
    setFeedbackMsg({ text, type });
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [resN, resE] = await Promise.all([
        fetch("/api/notices"),
        fetch("/api/events"),
      ]);

      if (resN.ok) {
        const dataN = await resN.json();
        setNotices(dataN);
      }
      if (resE.ok) {
        const dataE = await resE.json();
        setEvents(dataE);
      }
    } catch (err) {
      console.error("Failed to fetch notices & events:", err);
    } finally {
      setLoading(false);
    }
  };

  const triggerGlobalSync = () => {
    window.dispatchEvent(new CustomEvent("factfusion_sync_update"));
    if (onSyncUpdated) onSyncUpdated();
  };

  // --- NOTICE CRUD HANDLERS ---

  const handleOpenNoticeCreate = () => {
    setEditingNotice(null);
    setNTitle("");
    setNContent("");
    setNCategory("General");
    setNTargetAudience("All");
    setNDate(new Date().toISOString().substring(0, 10));
    setNExpiryDate("");
    setNIsUrgent(false);
    setNStatus("Active");
    setNAttachmentName("");
    setNAuthor("FactFusion Administration");
    setIsNoticeFormOpen(true);
  };

  const handleOpenNoticeEdit = (notice: Notice) => {
    setEditingNotice(notice);
    setNTitle(notice.title);
    setNContent(notice.content);
    setNCategory(notice.category);
    setNTargetAudience(notice.targetAudience || "All");
    setNDate(notice.date || new Date().toISOString().substring(0, 10));
    setNExpiryDate(notice.expiryDate || "");
    setNIsUrgent(Boolean(notice.isUrgent));
    setNStatus(notice.status || "Active");
    setNAttachmentName(notice.attachmentName || "");
    setNAuthor(notice.author || "FactFusion Administration");
    setIsNoticeFormOpen(true);
  };

  const handleSaveNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nTitle.trim() || !nContent.trim()) {
      showFeedback("Please fill out Title and Notice Content.", "error");
      return;
    }

    setIsSaving(true);
    const noticePayload: Partial<Notice> = {
      title: nTitle.trim(),
      content: nContent.trim(),
      category: nCategory,
      targetAudience: nTargetAudience,
      date: nDate,
      expiryDate: nExpiryDate.trim() || undefined,
      isUrgent: nIsUrgent,
      status: nStatus,
      attachmentName: nAttachmentName.trim() || undefined,
      author: nAuthor.trim() || "FactFusion Administration",
    };

    try {
      if (editingNotice) {
        // UPDATE
        const res = await fetch(`/api/notices/${editingNotice.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(noticePayload),
        });
        if (res.ok) {
          const updated = await res.json();
          setNotices((prev) => prev.map((n) => (n.id === editingNotice.id ? updated : n)));
          showFeedback("Notice updated successfully!");
          setIsNoticeFormOpen(false);
          triggerGlobalSync();
        } else {
          showFeedback("Failed to update notice.", "error");
        }
      } else {
        // CREATE
        const res = await fetch("/api/notices", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(noticePayload),
        });
        if (res.ok) {
          const created = await res.json();
          setNotices((prev) => [created, ...prev]);
          showFeedback("New notice published successfully!");
          setIsNoticeFormOpen(false);
          triggerGlobalSync();
        } else {
          showFeedback("Failed to create notice.", "error");
        }
      }
    } catch (err) {
      console.error(err);
      showFeedback("Server connection error.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleNoticeStatus = async (notice: Notice, newStatus: Notice["status"]) => {
    try {
      const res = await fetch(`/api/notices/${notice.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setNotices((prev) => prev.map((n) => (n.id === notice.id ? { ...n, status: newStatus } : n)));
        showFeedback(`Notice marked as "${newStatus}".`);
        triggerGlobalSync();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleConfirmDeleteNotice = async () => {
    if (!deleteNoticeTarget) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/notices/${deleteNoticeTarget.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setNotices((prev) => prev.filter((n) => n.id !== deleteNoticeTarget.id));
        showFeedback("Notice deleted successfully.");
        setDeleteNoticeTarget(null);
        triggerGlobalSync();
      } else {
        showFeedback("Failed to delete notice.", "error");
      }
    } catch (err) {
      console.error(err);
      showFeedback("Server error.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // --- EVENT CRUD HANDLERS ---

  const handleOpenEventCreate = () => {
    setEditingEvent(null);
    setETitle("");
    setEDescription("");
    setEDate(new Date().toISOString().substring(0, 10));
    setETime("10:00 AM - 02:00 PM");
    setEVenue("Main Campus Auditorium");
    setECategory("Workshop");
    setEStatus("Upcoming");
    setEBannerUrl("https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80");
    setERegistrationLink("");
    setEOrganizer("FactFusion Hub Campus");
    setEMaxAttendees(200);
    setIsEventFormOpen(true);
  };

  const handleOpenEventEdit = (event: CampusEvent) => {
    setEditingEvent(event);
    setETitle(event.title);
    setEDescription(event.description);
    setEDate(event.date);
    setETime(event.time);
    setEVenue(event.venue);
    setECategory(event.category);
    setEStatus(event.status);
    setEBannerUrl(event.bannerUrl || "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80");
    setERegistrationLink(event.registrationLink || "");
    setEOrganizer(event.organizer || "FactFusion Hub Campus");
    setEMaxAttendees(event.maxAttendees || 200);
    setIsEventFormOpen(true);
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eTitle.trim() || !eDescription.trim() || !eDate || !eVenue.trim()) {
      showFeedback("Please fill out Title, Description, Date and Venue.", "error");
      return;
    }

    setIsSaving(true);
    const eventPayload: Partial<CampusEvent> = {
      title: eTitle.trim(),
      description: eDescription.trim(),
      date: eDate,
      time: eTime.trim(),
      venue: eVenue.trim(),
      category: eCategory,
      status: eStatus,
      bannerUrl: eBannerUrl.trim(),
      registrationLink: eRegistrationLink.trim() || undefined,
      organizer: eOrganizer.trim(),
      maxAttendees: Number(eMaxAttendees) || 200,
    };

    try {
      if (editingEvent) {
        // UPDATE
        const res = await fetch(`/api/events/${editingEvent.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(eventPayload),
        });
        if (res.ok) {
          const updated = await res.json();
          setEvents((prev) => prev.map((item) => (item.id === editingEvent.id ? updated : item)));
          showFeedback("Event updated successfully!");
          setIsEventFormOpen(false);
          triggerGlobalSync();
        } else {
          showFeedback("Failed to update event.", "error");
        }
      } else {
        // CREATE
        const res = await fetch("/api/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(eventPayload),
        });
        if (res.ok) {
          const created = await res.json();
          setEvents((prev) => [created, ...prev]);
          showFeedback("New campus event scheduled successfully!");
          setIsEventFormOpen(false);
          triggerGlobalSync();
        } else {
          showFeedback("Failed to schedule event.", "error");
        }
      }
    } catch (err) {
      console.error(err);
      showFeedback("Server connection error.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleEventStatus = async (event: CampusEvent, newStatus: CampusEvent["status"]) => {
    try {
      const res = await fetch(`/api/events/${event.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setEvents((prev) => prev.map((e) => (e.id === event.id ? { ...e, status: newStatus } : e)));
        showFeedback(`Event marked as "${newStatus}".`);
        triggerGlobalSync();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleConfirmDeleteEvent = async () => {
    if (!deleteEventTarget) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/events/${deleteEventTarget.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setEvents((prev) => prev.filter((e) => e.id !== deleteEventTarget.id));
        showFeedback("Event deleted successfully.");
        setDeleteEventTarget(null);
        triggerGlobalSync();
      } else {
        showFeedback("Failed to delete event.", "error");
      }
    } catch (err) {
      console.error(err);
      showFeedback("Server error.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  // --- FILTERED DATA ---
  const filteredNotices = notices.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(noticeSearch.toLowerCase()) ||
      n.content.toLowerCase().includes(noticeSearch.toLowerCase()) ||
      (n.author && n.author.toLowerCase().includes(noticeSearch.toLowerCase()));
    const matchesCategory = noticeCategoryFilter === "All" || n.category === noticeCategoryFilter;
    const matchesStatus = noticeStatusFilter === "All" || n.status === noticeStatusFilter;
    const matchesAudience = noticeAudienceFilter === "All" || n.targetAudience === noticeAudienceFilter;
    return matchesSearch && matchesCategory && matchesStatus && matchesAudience;
  });

  const totalNoticePages = Math.ceil(filteredNotices.length / itemsPerPage) || 1;
  const paginatedNotices = filteredNotices.slice((noticePage - 1) * itemsPerPage, noticePage * itemsPerPage);

  const filteredEvents = events.filter((e) => {
    const matchesSearch =
      e.title.toLowerCase().includes(eventSearch.toLowerCase()) ||
      e.description.toLowerCase().includes(eventSearch.toLowerCase()) ||
      e.venue.toLowerCase().includes(eventSearch.toLowerCase()) ||
      (e.organizer && e.organizer.toLowerCase().includes(eventSearch.toLowerCase()));
    const matchesCategory = eventCategoryFilter === "All" || e.category === eventCategoryFilter;
    const matchesStatus = eventStatusFilter === "All" || e.status === eventStatusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalEventPages = Math.ceil(filteredEvents.length / itemsPerPage) || 1;
  const paginatedEvents = filteredEvents.slice((eventPage - 1) * itemsPerPage, eventPage * itemsPerPage);

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case "Urgent":
        return "bg-rose-50 text-rose-700 border-rose-200";
      case "Exam":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "Academic":
        return "bg-emerald-50 text-emerald-800 border-emerald-200";
      case "Holiday":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Admission":
        return "bg-amber-50 text-amber-800 border-amber-200";
      case "Tech":
        return "bg-cyan-50 text-cyan-800 border-cyan-200";
      case "Career":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "Sports":
        return "bg-orange-50 text-orange-700 border-orange-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Active":
      case "Ongoing":
        return "bg-emerald-100 text-emerald-900 font-extrabold";
      case "Upcoming":
        return "bg-blue-100 text-blue-900 font-extrabold";
      case "Draft":
        return "bg-amber-100 text-amber-900 font-bold";
      case "Archived":
      case "Completed":
        return "bg-slate-200 text-slate-700 font-semibold";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-6 md:p-8 shadow-xs space-y-6 min-h-[650px]">
      {/* SECTION HEADER & STATS BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0B4632] text-white flex items-center justify-center font-bold shadow-xs">
              <Megaphone className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                Notices & Events Manager
              </h2>
              <p className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">
                Manage live institutional circulars and campus events with real-time website synchronization.
              </p>
            </div>
          </div>
        </div>

        {/* Global Live Sync Indicator & Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <button
            onClick={loadAllData}
            disabled={loading}
            className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-2 transition cursor-pointer"
            title="Refresh from Server"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh Data</span>
          </button>

          {activeModule === "notices" ? (
            <button
              onClick={handleOpenNoticeCreate}
              className="px-4 py-2.5 bg-[#0B4632] hover:bg-emerald-900 text-white rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-2 shadow-xs transition cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Create Notice
            </button>
          ) : (
            <button
              onClick={handleOpenEventCreate}
              className="px-4 py-2.5 bg-[#0B4632] hover:bg-emerald-900 text-white rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-2 shadow-xs transition cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Schedule Event
            </button>
          )}
        </div>
      </div>

      {/* FEEDBACK TOAST */}
      {feedbackMsg && (
        <div
          className={`p-3.5 rounded-xl border flex items-center gap-3 text-xs sm:text-sm font-bold shadow-xs transition-all ${
            feedbackMsg.type === "success"
              ? "bg-emerald-50 text-emerald-900 border-emerald-300"
              : "bg-rose-50 text-rose-900 border-rose-300"
          }`}
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* MODULE SWITCHER TABS & SUMMARY METRICS */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-200">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setActiveModule("notices");
              setNoticePage(1);
            }}
            className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
              activeModule === "notices"
                ? "bg-[#0B4632] text-white shadow-xs"
                : "bg-transparent text-slate-600 hover:text-slate-900 hover:bg-white"
            }`}
          >
            <Megaphone className="w-4 h-4" />
            <span>Notice Board ({notices.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveModule("events");
              setEventPage(1);
            }}
            className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
              activeModule === "events"
                ? "bg-[#0B4632] text-white shadow-xs"
                : "bg-transparent text-slate-600 hover:text-slate-900 hover:bg-white"
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Campus Events ({events.length})</span>
          </button>
        </div>

        {/* Live sync pill badge */}
        <div className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Home Screen Real-Time Synced</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. NOTICES MODULE */}
      {/* ========================================================================= */}
      {activeModule === "notices" && (
        <div className="space-y-4">
          {/* SEARCH & FILTER CONTROLS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-3.5 bg-slate-50/70 rounded-2xl border border-slate-200">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={noticeSearch}
                onChange={(e) => {
                  setNoticeSearch(e.target.value);
                  setNoticePage(1);
                }}
                placeholder="Search title, content, author..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={noticeCategoryFilter}
                onChange={(e) => {
                  setNoticeCategoryFilter(e.target.value);
                  setNoticePage(1);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-bold bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              >
                <option value="All">All Categories</option>
                <option value="Urgent">Urgent Circulars</option>
                <option value="Academic">Academic</option>
                <option value="Exam">Exam Routine</option>
                <option value="Holiday">Holidays</option>
                <option value="Admission">Admissions</option>
                <option value="General">General</option>
              </select>
            </div>

            {/* Audience Filter */}
            <div>
              <select
                value={noticeAudienceFilter}
                onChange={(e) => {
                  setNoticeAudienceFilter(e.target.value);
                  setNoticePage(1);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-bold bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              >
                <option value="All">All Audiences</option>
                <option value="Students">Students Only</option>
                <option value="Faculty">Faculty & Staff</option>
                <option value="Parents">Parents</option>
                <option value="Public">Public</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={noticeStatusFilter}
                onChange={(e) => {
                  setNoticeStatusFilter(e.target.value);
                  setNoticePage(1);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-bold bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active (Visible)</option>
                <option value="Draft">Drafts</option>
                <option value="Archived">Archived</option>
              </select>
            </div>
          </div>

          {/* NOTICES TABLE */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/90 border-b border-slate-200 text-slate-700 text-xs font-black uppercase tracking-wider">
                  <th className="py-3.5 px-4">Status & Category</th>
                  <th className="py-3.5 px-4">Notice Title & Details</th>
                  <th className="py-3.5 px-4 hidden md:table-cell">Target Audience</th>
                  <th className="py-3.5 px-4 hidden sm:table-cell">Published Date</th>
                  <th className="py-3.5 px-4 hidden lg:table-cell">Expiry</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs sm:text-sm font-semibold text-slate-800">
                {paginatedNotices.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400 font-medium">
                      No notices match the selected criteria.
                    </td>
                  </tr>
                ) : (
                  paginatedNotices.map((n) => (
                    <tr key={n.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Status & Category */}
                      <td className="py-4 px-4 align-top">
                        <div className="flex flex-col gap-1.5 items-start">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold border ${getCategoryBadgeClass(
                              n.category
                            )}`}
                          >
                            {n.category}
                          </span>
                          <span className={`px-2 py-0.5 rounded-md text-[10px] uppercase ${getStatusBadgeClass(n.status)}`}>
                            {n.status}
                          </span>
                          {n.isUrgent && (
                            <span className="flex items-center gap-1 text-[10px] font-black text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span> URGENT
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Title & Preview */}
                      <td className="py-4 px-4 align-top max-w-sm sm:max-w-md">
                        <div className="font-bold text-slate-900 leading-snug line-clamp-2">{n.title}</div>
                        <p className="text-xs text-slate-500 font-normal line-clamp-2 mt-1">{n.content}</p>
                        {n.attachmentName && (
                          <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 font-semibold mt-1.5">
                            <Paperclip className="w-3 h-3 text-emerald-600" />
                            <span className="truncate">{n.attachmentName}</span>
                          </div>
                        )}
                      </td>

                      {/* Target Audience */}
                      <td className="py-4 px-4 align-top hidden md:table-cell">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold">
                          <Users className="w-3 h-3 text-slate-400" />
                          {n.targetAudience || "All"}
                        </span>
                      </td>

                      {/* Published Date */}
                      <td className="py-4 px-4 align-top hidden sm:table-cell text-slate-600 font-medium">
                        {n.date}
                      </td>

                      {/* Expiry Date */}
                      <td className="py-4 px-4 align-top hidden lg:table-cell">
                        {n.expiryDate ? (
                          <span className="text-xs text-slate-600 font-medium">{n.expiryDate}</span>
                        ) : (
                          <span className="text-xs text-slate-400 font-normal">No Expiry</span>
                        )}
                      </td>

                      {/* Action Buttons */}
                      <td className="py-4 px-4 align-top text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Preview */}
                          <button
                            onClick={() => setPreviewNotice(n)}
                            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                            title="View Notice Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Quick Status Toggle */}
                          {n.status === "Active" ? (
                            <button
                              onClick={() => handleToggleNoticeStatus(n, "Archived")}
                              className="p-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 transition cursor-pointer"
                              title="Archive Notice"
                            >
                              <Archive className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleToggleNoticeStatus(n, "Active")}
                              className="p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[#0B4632] transition cursor-pointer"
                              title="Activate Notice"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                          )}

                          {/* Edit */}
                          <button
                            onClick={() => handleOpenNoticeEdit(n)}
                            className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition cursor-pointer"
                            title="Edit Notice"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => setDeleteNoticeTarget(n)}
                            className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition cursor-pointer"
                            title="Delete Notice"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* NOTICE PAGINATION */}
          {totalNoticePages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-bold text-slate-500">
                Showing {paginatedNotices.length} of {filteredNotices.length} notices
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setNoticePage((p) => Math.max(1, p - 1))}
                  disabled={noticePage === 1}
                  className="p-2 rounded-xl border border-slate-200 disabled:opacity-40 hover:bg-slate-50 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4 text-slate-700" />
                </button>
                <span className="text-xs font-black text-slate-800 px-2">
                  Page {noticePage} of {totalNoticePages}
                </span>
                <button
                  onClick={() => setNoticePage((p) => Math.min(totalNoticePages, p + 1))}
                  disabled={noticePage === totalNoticePages}
                  className="p-2 rounded-xl border border-slate-200 disabled:opacity-40 hover:bg-slate-50 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4 text-slate-700" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. EVENTS MODULE */}
      {/* ========================================================================= */}
      {activeModule === "events" && (
        <div className="space-y-4">
          {/* SEARCH & FILTER CONTROLS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-slate-50/70 rounded-2xl border border-slate-200">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={eventSearch}
                onChange={(e) => {
                  setEventSearch(e.target.value);
                  setEventPage(1);
                }}
                placeholder="Search event title, venue, organizer..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={eventCategoryFilter}
                onChange={(e) => {
                  setEventCategoryFilter(e.target.value);
                  setEventPage(1);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-bold bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              >
                <option value="All">All Categories</option>
                <option value="Tech">Tech & Coding Hackathons</option>
                <option value="Career">Career & Placement</option>
                <option value="Academic">Academic Olympiad</option>
                <option value="Sports">Sports Meet</option>
                <option value="Workshop">Hands-on Workshops</option>
                <option value="Seminar">Seminars</option>
                <option value="Cultural">Cultural Programs</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={eventStatusFilter}
                onChange={(e) => {
                  setEventStatusFilter(e.target.value);
                  setEventPage(1);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-bold bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              >
                <option value="All">All Statuses</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Ongoing">Ongoing Now</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          {/* EVENTS TABLE */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/90 border-b border-slate-200 text-slate-700 text-xs font-black uppercase tracking-wider">
                  <th className="py-3.5 px-4">Event & Category</th>
                  <th className="py-3.5 px-4">Date & Time</th>
                  <th className="py-3.5 px-4 hidden md:table-cell">Venue & Location</th>
                  <th className="py-3.5 px-4 hidden lg:table-cell">RSVPs</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs sm:text-sm font-semibold text-slate-800">
                {paginatedEvents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400 font-medium">
                      No events match the selected criteria.
                    </td>
                  </tr>
                ) : (
                  paginatedEvents.map((evt) => (
                    <tr key={evt.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Event & Category */}
                      <td className="py-4 px-4 align-top max-w-sm">
                        <div className="flex items-start gap-3">
                          {evt.bannerUrl && (
                            <img
                              src={evt.bannerUrl}
                              alt={evt.title}
                              className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0 hidden sm:block"
                            />
                          )}
                          <div>
                            <span
                              className={`inline-block mb-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${getCategoryBadgeClass(
                                evt.category
                              )}`}
                            >
                              {evt.category}
                            </span>
                            <div className="font-bold text-slate-900 leading-snug line-clamp-2">{evt.title}</div>
                            <p className="text-xs text-slate-500 font-normal line-clamp-1 mt-0.5">{evt.organizer}</p>
                          </div>
                        </div>
                      </td>

                      {/* Date & Time */}
                      <td className="py-4 px-4 align-top whitespace-nowrap">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                          {evt.date}
                        </div>
                        <div className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {evt.time}
                        </div>
                      </td>

                      {/* Venue */}
                      <td className="py-4 px-4 align-top hidden md:table-cell max-w-xs">
                        <div className="flex items-start gap-1.5 text-xs text-slate-700 font-semibold">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                          <span className="line-clamp-2">{evt.venue}</span>
                        </div>
                      </td>

                      {/* RSVPs & Capacity */}
                      <td className="py-4 px-4 align-top hidden lg:table-cell">
                        <div className="text-xs font-bold text-slate-800">
                          {evt.registeredCount || 0} / {evt.maxAttendees || 200}
                        </div>
                        <div className="w-24 bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1.5">
                          <div
                            className="bg-emerald-600 h-full rounded-full"
                            style={{
                              width: `${Math.min(
                                100,
                                Math.round(((evt.registeredCount || 0) / (evt.maxAttendees || 200)) * 100)
                              )}%`,
                            }}
                          ></div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 align-top whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-md text-xs ${getStatusBadgeClass(evt.status)}`}>
                          {evt.status}
                        </span>
                      </td>

                      {/* Action Buttons */}
                      <td className="py-4 px-4 align-top text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Preview */}
                          <button
                            onClick={() => setPreviewEvent(evt)}
                            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                            title="View Event Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Quick Toggle Status */}
                          {evt.status === "Upcoming" ? (
                            <button
                              onClick={() => handleToggleEventStatus(evt, "Completed")}
                              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
                              title="Mark as Completed"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleToggleEventStatus(evt, "Upcoming")}
                              className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition cursor-pointer"
                              title="Mark as Upcoming"
                            >
                              <Clock className="w-4 h-4" />
                            </button>
                          )}

                          {/* Edit */}
                          <button
                            onClick={() => handleOpenEventEdit(evt)}
                            className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition cursor-pointer"
                            title="Edit Event"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => setDeleteEventTarget(evt)}
                            className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition cursor-pointer"
                            title="Delete Event"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* EVENT PAGINATION */}
          {totalEventPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-bold text-slate-500">
                Showing {paginatedEvents.length} of {filteredEvents.length} events
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEventPage((p) => Math.max(1, p - 1))}
                  disabled={eventPage === 1}
                  className="p-2 rounded-xl border border-slate-200 disabled:opacity-40 hover:bg-slate-50 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4 text-slate-700" />
                </button>
                <span className="text-xs font-black text-slate-800 px-2">
                  Page {eventPage} of {totalEventPages}
                </span>
                <button
                  onClick={() => setEventPage((p) => Math.min(totalEventPages, p + 1))}
                  disabled={eventPage === totalEventPages}
                  className="p-2 rounded-xl border border-slate-200 disabled:opacity-40 hover:bg-slate-50 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4 text-slate-700" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. MODAL: CREATE / EDIT NOTICE */}
      {/* ========================================================================= */}
      {isNoticeFormOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[6000] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6 my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#0B4632] flex items-center justify-center font-bold">
                  <Megaphone className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900">
                    {editingNotice ? "Edit Notice Circular" : "Create New Notice Circular"}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Publish announcements to student, faculty, and public portals.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsNoticeFormOpen(false)}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNotice} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">
                  Notice Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={nTitle}
                  onChange={(e) => setNTitle(e.target.value)}
                  required
                  placeholder="e.g., NEB Board Examination Registration Form Deadline"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-bold bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              {/* Category, Audience, Status */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">Category</label>
                  <select
                    value={nCategory}
                    onChange={(e) => setNCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-bold bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  >
                    <option value="General">General</option>
                    <option value="Urgent">Urgent</option>
                    <option value="Academic">Academic</option>
                    <option value="Exam">Exam Routine</option>
                    <option value="Holiday">Holiday</option>
                    <option value="Admission">Admission</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">Target Audience</label>
                  <select
                    value={nTargetAudience}
                    onChange={(e) => setNTargetAudience(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-bold bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  >
                    <option value="All">All Audiences</option>
                    <option value="Students">Students Only</option>
                    <option value="Faculty">Faculty & Staff</option>
                    <option value="Parents">Parents</option>
                    <option value="Public">Public</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">Publish Status</label>
                  <select
                    value={nStatus}
                    onChange={(e) => setNStatus(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-bold bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  >
                    <option value="Active">Active (Published)</option>
                    <option value="Draft">Draft (Hidden)</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>

              {/* Dates & Urgent Toggle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">Published Date</label>
                  <input
                    type="date"
                    value={nDate}
                    onChange={(e) => setNDate(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">
                    Expiry Date <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="date"
                    value={nExpiryDate}
                    onChange={(e) => setNExpiryDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Urgent Checkbox */}
              <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl border border-amber-200">
                <input
                  type="checkbox"
                  id="noticeUrgentCheck"
                  checked={nIsUrgent}
                  onChange={(e) => setNIsUrgent(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
                <label htmlFor="noticeUrgentCheck" className="text-xs sm:text-sm font-bold text-amber-950 cursor-pointer">
                  Mark as High Priority / Urgent Breaking Notice (Shows in Home Screen Top Marquee)
                </label>
              </div>

              {/* Content / Description */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">
                  Detailed Notice Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={nContent}
                  onChange={(e) => setNContent(e.target.value)}
                  required
                  placeholder="Enter full announcement details, official instructions, and timelines..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              {/* Optional Attachment & Author */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">
                    Attachment Document Name <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={nAttachmentName}
                    onChange={(e) => setNAttachmentName(e.target.value)}
                    placeholder="e.g., Exam_Routine_2026.pdf"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">Issuing Authority / Author</label>
                  <input
                    type="text"
                    value={nAuthor}
                    onChange={(e) => setNAuthor(e.target.value)}
                    placeholder="e.g. Office of Examination Controller"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNoticeFormOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-extrabold text-xs sm:text-sm hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl bg-[#0B4632] hover:bg-emerald-900 text-white font-black text-xs sm:text-sm shadow-xs transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Megaphone className="w-4 h-4" />}
                  <span>{editingNotice ? "Update Notice" : "Publish Notice"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. MODAL: CREATE / EDIT EVENT */}
      {/* ========================================================================= */}
      {isEventFormOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[6000] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6 my-auto max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center font-bold">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900">
                    {editingEvent ? "Edit Campus Event" : "Schedule New Campus Event"}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Configure workshops, tech summits, sports tournaments, and webinars.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEventFormOpen(false)}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="space-y-4">
              {/* Event Title */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">
                  Event Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={eTitle}
                  onChange={(e) => setETitle(e.target.value)}
                  required
                  placeholder="e.g. FactFusion Tech Fest & Hackathon 2026"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-bold bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              {/* Category, Status, Capacity */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">Category</label>
                  <select
                    value={eCategory}
                    onChange={(e) => setECategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-bold bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  >
                    <option value="Tech">Tech & Hackathon</option>
                    <option value="Career">Career & Placement</option>
                    <option value="Academic">Academic Olympiad</option>
                    <option value="Sports">Sports & Athletic</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Seminar">Seminar</option>
                    <option value="Cultural">Cultural</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">Status</label>
                  <select
                    value={eStatus}
                    onChange={(e) => setEStatus(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-bold bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Ongoing">Ongoing Now</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">Max Attendees</label>
                  <input
                    type="number"
                    value={eMaxAttendees}
                    onChange={(e) => setEMaxAttendees(Number(e.target.value))}
                    min={10}
                    max={2000}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-bold bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Date, Time, Venue */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">Event Date</label>
                  <input
                    type="date"
                    value={eDate}
                    onChange={(e) => setEDate(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">Time Schedule</label>
                  <input
                    type="text"
                    value={eTime}
                    onChange={(e) => setETime(e.target.value)}
                    placeholder="10:00 AM - 04:00 PM"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">Venue / Hall</label>
                  <input
                    type="text"
                    value={eVenue}
                    onChange={(e) => setEVenue(e.target.value)}
                    placeholder="Main Campus Auditorium"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">
                  Event Description & Agenda <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={eDescription}
                  onChange={(e) => setEDescription(e.target.value)}
                  required
                  placeholder="Detail the event objectives, speaker information, rules, and participant benefits..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              {/* Banner Image URL & Organizer */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">Banner Image URL</label>
                  <input
                    type="url"
                    value={eBannerUrl}
                    onChange={(e) => setEBannerUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">Organizing Department / Club</label>
                  <input
                    type="text"
                    value={eOrganizer}
                    onChange={(e) => setEOrganizer(e.target.value)}
                    placeholder="FactFusion Coding Club"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEventFormOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-extrabold text-xs sm:text-sm hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl bg-[#0B4632] hover:bg-emerald-900 text-white font-black text-xs sm:text-sm shadow-xs transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Calendar className="w-4 h-4" />}
                  <span>{editingEvent ? "Update Event" : "Schedule Event"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. MODAL: PREVIEW NOTICE */}
      {/* ========================================================================= */}
      {previewNotice && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[6000] flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-extrabold border ${getCategoryBadgeClass(
                  previewNotice.category
                )}`}
              >
                {previewNotice.category}
              </span>
              <button
                onClick={() => setPreviewNotice(null)}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900 leading-snug">{previewNotice.title}</h3>
              <div className="flex items-center gap-3 text-xs text-slate-500 font-medium mt-2">
                <span>Published: {previewNotice.date}</span>
                {previewNotice.expiryDate && <span>• Expires: {previewNotice.expiryDate}</span>}
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              {previewNotice.content}
            </div>

            {previewNotice.attachmentName && (
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                  <Paperclip className="w-4 h-4 text-emerald-600" />
                  <span>{previewNotice.attachmentName}</span>
                </div>
                <button
                  onClick={() => alert(`Downloaded ${previewNotice.attachmentName}`)}
                  className="text-xs font-black text-[#0B4632] hover:underline"
                >
                  Download File
                </button>
              </div>
            )}

            <div className="pt-2 text-right">
              <button
                onClick={() => setPreviewNotice(null)}
                className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. MODAL: PREVIEW EVENT */}
      {/* ========================================================================= */}
      {previewEvent && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[6000] flex items-center justify-center p-3 sm:p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden space-y-4">
            {previewEvent.bannerUrl && (
              <img src={previewEvent.bannerUrl} alt={previewEvent.title} className="w-full h-48 object-cover" />
            )}

            <div className="p-6 space-y-4 pt-0">
              <div className="flex items-center justify-between">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-extrabold border ${getCategoryBadgeClass(
                    previewEvent.category
                  )}`}
                >
                  {previewEvent.category}
                </span>
                <button
                  onClick={() => setPreviewEvent(null)}
                  className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900 leading-snug">{previewEvent.title}</h3>
                <p className="text-xs text-slate-500 font-bold mt-1">Organized by {previewEvent.organizer}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl text-xs font-semibold text-slate-700">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{previewEvent.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{previewEvent.time}</span>
                </div>
                <div className="col-span-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{previewEvent.venue}</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                {previewEvent.description}
              </p>

              <div className="pt-2 text-right">
                <button
                  onClick={() => setPreviewEvent(null)}
                  className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. MODAL: DELETE CONFIRMATION */}
      {/* ========================================================================= */}
      {(deleteNoticeTarget || deleteEventTarget) && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[6000] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900">
                Confirm Deletion
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
                Are you sure you want to permanently delete{" "}
                <span className="font-bold text-slate-900">
                  {deleteNoticeTarget ? `"${deleteNoticeTarget.title}"` : `"${deleteEventTarget?.title}"`}
                </span>
                ? This action will remove it immediately from both the admin ledger and the public website.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => {
                  setDeleteNoticeTarget(null);
                  setDeleteEventTarget(null);
                }}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={deleteNoticeTarget ? handleConfirmDeleteNotice : handleConfirmDeleteEvent}
                disabled={isSaving}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
