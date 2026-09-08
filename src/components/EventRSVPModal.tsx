import React, { useState } from "react";
import {
  X,
  Ticket,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Printer,
  Download,
  Share2,
  User,
  Mail,
  Phone,
} from "lucide-react";
import { CampusEvent } from "../types";

interface EventRSVPModalProps {
  event: CampusEvent | null;
  isOpen: boolean;
  onClose: () => void;
  onRSVPSuccess: (event: CampusEvent) => void;
}

export const EventRSVPModal: React.FC<EventRSVPModalProps> = ({
  event,
  isOpen,
  onClose,
  onRSVPSuccess,
}) => {
  const [attendeeName, setAttendeeName] = useState("");
  const [attendeeEmail, setAttendeeEmail] = useState("");
  const [attendeePhone, setAttendeePhone] = useState("");
  const [attendeeGrade, setAttendeeGrade] = useState("Grade 11 CS");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedTicket, setConfirmedTicket] = useState<{
    ticketId: string;
    name: string;
    seatNo: string;
  } | null>(null);

  if (!isOpen || !event) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!attendeeName.trim() || !attendeeEmail.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/events/${event.id}/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          attendeeName: attendeeName.trim(),
          email: attendeeEmail.trim(),
          phone: attendeePhone.trim(),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setConfirmedTicket({
          ticketId: `FFH-${Date.now().toString().slice(-6)}`,
          name: attendeeName.trim(),
          seatNo: `SEC-${Math.floor(10 + Math.random() * 90)}-${Math.floor(1 + Math.random() * 40)}`,
        });
        if (data.event) {
          onRSVPSuccess(data.event);
        }
      }
    } catch (err) {
      console.error("Offline RSVP local reservation:", err);
      setConfirmedTicket({
        ticketId: `FFH-${Date.now().toString().slice(-6)}`,
        name: attendeeName.trim(),
        seatNo: `SEC-A-${Math.floor(1 + Math.random() * 40)}`,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[7000] flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6 my-auto overflow-hidden relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center cursor-pointer transition"
        >
          <X className="w-4 h-4" />
        </button>

        {!confirmedTicket ? (
          <>
            {/* Modal Header */}
            <div className="flex items-start gap-3.5 pr-8">
              <div className="w-11 h-11 rounded-xl bg-emerald-100 text-[#0B4632] flex items-center justify-center font-bold shrink-0">
                <Ticket className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-950 leading-tight">
                  Free Event Registration & RSVP
                </h3>
                <p className="text-xs text-slate-500 font-bold mt-0.5 truncate max-w-xs sm:max-w-sm">
                  {event.title}
                </p>
              </div>
            </div>

            {/* Event Summary Pill Box */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5 font-semibold text-slate-700">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{event.date} • {event.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span className="truncate">{event.venue}</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={attendeeName}
                    onChange={(e) => setAttendeeName(e.target.value)}
                    required
                    placeholder="e.g. Rahul Shah"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-bold bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      value={attendeeEmail}
                      onChange={(e) => setAttendeeEmail(e.target.value)}
                      required
                      placeholder="rahul@example.com"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="tel"
                      value={attendeePhone}
                      onChange={(e) => setAttendeePhone(e.target.value)}
                      placeholder="+977 98..."
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Faculty / Institution</label>
                <input
                  type="text"
                  value={attendeeGrade}
                  onChange={(e) => setAttendeeGrade(e.target.value)}
                  placeholder="e.g. Class 11 CS / Visitor"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-medium bg-white focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-[#0B4632] hover:bg-emerald-900 text-white rounded-xl text-xs sm:text-sm font-black shadow-xs transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Ticket className="w-4 h-4" />
                  <span>{isSubmitting ? "Generating Ticket..." : "Confirm Free Registration"}</span>
                </button>
              </div>
            </form>
          </>
        ) : (
          /* Confirmed Digital Ticket */
          <div className="space-y-5 text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-xs font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Registration Confirmed
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                You're In! Here is your Entry Pass
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Present this ticket badge or ticket code at the campus registration counter.
              </p>
            </div>

            {/* Ticket Card */}
            <div className="bg-gradient-to-br from-emerald-950 to-slate-900 text-white p-5 rounded-2xl text-left space-y-4 shadow-xl border border-emerald-800/40 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-emerald-800/60 pb-3">
                <div className="font-extrabold text-sm text-emerald-300">FactFusion Hub Campus</div>
                <div className="text-[11px] font-mono bg-emerald-800/60 px-2 py-0.5 rounded text-emerald-200">
                  {confirmedTicket.ticketId}
                </div>
              </div>

              <div>
                <h4 className="text-base font-black text-white line-clamp-1">{event.title}</h4>
                <p className="text-xs text-emerald-200/80 font-medium mt-0.5">Attendee: {confirmedTicket.name}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-emerald-800/40">
                <div>
                  <div className="text-[10px] text-emerald-300 font-bold uppercase">Date & Time</div>
                  <div className="font-semibold text-white mt-0.5">{event.date}</div>
                </div>
                <div>
                  <div className="text-[10px] text-emerald-300 font-bold uppercase">Allocated Seat / Hall</div>
                  <div className="font-semibold text-emerald-300 mt-0.5">{confirmedTicket.seatNo}</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={handlePrint}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black flex items-center gap-1.5 transition cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" /> Print Pass
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-[#0B4632] hover:bg-emerald-900 text-white text-xs font-black transition cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
