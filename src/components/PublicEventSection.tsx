import React, { useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Share2,
  ExternalLink,
  Ticket,
} from "lucide-react";
import { CampusEvent } from "../types";

interface PublicEventSectionProps {
  events: CampusEvent[];
  onSelectEvent: (event: CampusEvent) => void;
  onRSVP: (event: CampusEvent) => void;
}

export const PublicEventSection: React.FC<PublicEventSectionProps> = ({
  events,
  onSelectEvent,
  onRSVP,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = [
    { id: "All", label: "All Events" },
    { id: "Tech", label: "Tech & Hackathons" },
    { id: "Career", label: "Career Fairs" },
    { id: "Academic", label: "Olympiad & Quizzes" },
    { id: "Sports", label: "Sports Meets" },
    { id: "Workshop", label: "Workshops" },
  ];

  const filteredEvents = events.filter((e) => {
    if (selectedCategory === "All") return true;
    return e.category === selectedCategory;
  });

  const calculateDaysLeft = (dateStr: string) => {
    try {
      const targetDate = new Date(dateStr);
      const today = new Date();
      targetDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);

      const diffTime = targetDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 0) return "Completed";
      if (diffDays === 0) return "Happening Today!";
      if (diffDays === 1) return "Tomorrow";
      return `${diffDays} Days Left`;
    } catch {
      return "Upcoming";
    }
  };

  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case "Tech":
        return "bg-cyan-50 text-cyan-800 border-cyan-200";
      case "Career":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "Sports":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "Academic":
        return "bg-emerald-50 text-emerald-800 border-emerald-200";
      case "Workshop":
        return "bg-purple-50 text-purple-700 border-purple-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <section className="sec-container bg-white py-16 px-[6%] lg:px-[8%]" id="events">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* SECTION HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-black uppercase tracking-wider mb-3">
              <Calendar className="w-3.5 h-3.5 text-emerald-700" />
              <span>Campus Calendar & Hackathons</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 tracking-tight">
              Upcoming Events & Tech Summits
            </h2>
            <p className="text-sm sm:text-base font-medium text-slate-600 mt-2 max-w-2xl">
              Join workshops, hackathons, sports championships, and global career networking sessions at FactFusion Hub.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none self-start md:self-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-[#0B4632] text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* EVENTS GRID */}
        {filteredEvents.length === 0 ? (
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-12 text-center space-y-2">
            <h4 className="text-base font-bold text-slate-800">No events scheduled in this category</h4>
            <p className="text-xs sm:text-sm text-slate-500">
              New events and workshops will be published soon.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((evt) => {
              const daysLeft = calculateDaysLeft(evt.date);
              const isUrgentTiming = daysLeft === "Happening Today!" || daysLeft === "Tomorrow";

              return (
                <div
                  key={evt.id}
                  className="group bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:border-emerald-300 hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden"
                >
                  {/* Banner Image with Overlay Badge */}
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                    <img
                      src={evt.bannerUrl || "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80"}
                      alt={evt.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>

                    {/* Top Badges: Category & Countdown */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider backdrop-blur-md bg-white/90 ${getCategoryBadgeClass(
                          evt.category
                        )}`}
                      >
                        {evt.category}
                      </span>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-black backdrop-blur-md shadow-xs ${
                          isUrgentTiming
                            ? "bg-rose-500 text-white animate-pulse"
                            : "bg-slate-900/80 text-white"
                        }`}
                      >
                        {daysLeft}
                      </span>
                    </div>

                    {/* Bottom overlay: Organizer */}
                    <div className="absolute bottom-3 left-3 right-3 text-white text-xs font-bold drop-shadow-md truncate">
                      {evt.organizer || "FactFusion Hub Campus"}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      {/* Date & Time pills */}
                      <div className="flex items-center gap-3 text-xs font-bold text-slate-600">
                        <span className="flex items-center gap-1.5 text-emerald-900 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                          <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                          {evt.date}
                        </span>
                        <span className="flex items-center gap-1 text-slate-500">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {evt.time}
                        </span>
                      </div>

                      {/* Event Title */}
                      <h3
                        onClick={() => onSelectEvent(evt)}
                        className="text-base sm:text-lg font-black text-slate-900 group-hover:text-[#0B4632] transition-colors leading-snug cursor-pointer line-clamp-2"
                      >
                        {evt.title}
                      </h3>

                      {/* Description snippet */}
                      <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed line-clamp-2">
                        {evt.description}
                      </p>

                      {/* Venue location */}
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold pt-1">
                        <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                        <span className="truncate">{evt.venue}</span>
                      </div>
                    </div>

                    {/* Footer: RSVP Button & Details */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                      <div className="text-xs text-slate-500 font-semibold">
                        <span className="font-bold text-slate-800">{evt.registeredCount || 0}</span>
                        <span> / {evt.maxAttendees || 200} registered</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onSelectEvent(evt)}
                          className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-extrabold transition cursor-pointer"
                        >
                          Details
                        </button>

                        <button
                          onClick={() => onRSVP(evt)}
                          className="px-4 py-2 bg-[#0B4632] hover:bg-emerald-900 text-white rounded-xl text-xs font-black shadow-xs transition flex items-center gap-1.5 cursor-pointer active:scale-95"
                        >
                          <Ticket className="w-3.5 h-3.5" />
                          <span>RSVP Free</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
