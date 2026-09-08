import React from "react";
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Users,
  Ticket,
  UserCheck,
  Share2,
} from "lucide-react";
import { CampusEvent } from "../types";

interface EventDetailModalProps {
  event: CampusEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenRSVP: (event: CampusEvent) => void;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({
  event,
  isOpen,
  onClose,
  onOpenRSVP,
}) => {
  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[7000] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6 my-auto overflow-hidden relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-lg bg-slate-100/90 hover:bg-slate-200 text-slate-700 flex items-center justify-center cursor-pointer transition z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Banner */}
        <div className="relative h-48 -mt-6 -mx-6 sm:-mt-8 sm:-mx-8 overflow-hidden">
          <img
            src={event.bannerUrl || "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80"}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20"></div>

          <div className="absolute bottom-4 left-6 right-6 text-white space-y-1">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-white/90 text-[#0B4632]">
              {event.category}
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white leading-tight drop-shadow-md">
              {event.title}
            </h2>
          </div>
        </div>

        {/* Quick Meta Stats */}
        <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase">Date & Time</div>
              <div className="text-slate-900 font-bold">{event.date} • {event.time}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase">Campus Venue</div>
              <div className="text-slate-900 font-bold truncate">{event.venue}</div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">About this Event</h4>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium whitespace-pre-line">
            {event.description}
          </p>
        </div>

        {/* Additional Details */}
        <div className="flex items-center justify-between text-xs text-slate-500 font-semibold pt-2 border-t border-slate-100">
          <div>
            Organized by: <strong className="text-slate-800">{event.organizer || "FactFusion Hub"}</strong>
          </div>
          <div>
            Attendance: <strong className="text-emerald-700">{event.registeredCount || 0} / {event.maxAttendees || 200}</strong>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black transition cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onOpenRSVP(event);
            }}
            className="px-5 py-2.5 rounded-xl bg-[#0B4632] hover:bg-emerald-900 text-white text-xs font-black shadow-xs transition flex items-center gap-2 cursor-pointer"
          >
            <Ticket className="w-4 h-4" />
            <span>RSVP / Register Free</span>
          </button>
        </div>
      </div>
    </div>
  );
};
