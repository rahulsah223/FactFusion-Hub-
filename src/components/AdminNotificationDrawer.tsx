import React, { useState, useEffect, useRef } from "react";
import {
  Bell,
  UserCheck,
  Phone,
  GraduationCap,
  ChevronRight,
  CheckCheck,
  Sparkles,
  Inbox,
  Clock,
  X,
} from "lucide-react";

export interface NotificationItem {
  id: string;
  applicationId: string;
  type: "NEW_LEAD_APPLICATION";
  title: string;
  applicantName: string;
  phoneNumber: string;
  classGrade: string;
  facultyStream?: string;
  timestamp: string;
  unread: boolean;
}

interface AdminNotificationDrawerProps {
  onSelectApplication: (applicationId: string) => void;
}

export const AdminNotificationDrawer: React.FC<AdminNotificationDrawerProps> = ({
  onSelectApplication,
}) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (err) {
      console.warn("Could not synchronize notification alerts.");
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Poll every 5 seconds for real-time lead updates
    const interval = setInterval(fetchNotifications, 5000);

    const handleSync = () => fetchNotifications();
    window.addEventListener("factfusion_sync_update", handleSync);

    return () => {
      clearInterval(interval);
      window.removeEventListener("factfusion_sync_update", handleSync);
    };
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleNotificationClick = async (item: NotificationItem) => {
    setIsOpen(false);
    // Mark as read in backend
    try {
      await fetch(`/api/notifications/${item.id}/read`, { method: "PATCH" });
      fetchNotifications();
    } catch (e) {
      // client updated
    }
    // Open detailed view modal
    onSelectApplication(item.applicationId);
  };

  const handleMarkAllRead = async () => {
    try {
      await fetch("/api/notifications/read-all", { method: "POST" });
      fetchNotifications();
    } catch (e) {
      // fallback
    }
  };

  const getRelativeTime = (isoString: string) => {
    try {
      const diffInSeconds = Math.floor((new Date().getTime() - new Date(isoString).getTime()) / 1000);
      if (diffInSeconds < 60) return "Just now";
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
      return `${Math.floor(diffInSeconds / 86400)}d ago`;
    } catch (e) {
      return "Recent";
    }
  };

  return (
    <div className="relative" ref={drawerRef}>
      {/* Bell Button Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-11 h-11 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-[#0B4632] border border-slate-200 hover:border-emerald-300 flex items-center justify-center transition-all cursor-pointer relative shadow-xs active:scale-95"
        aria-label="Toggle Application Alerts"
        title="Real-Time Lead Application Alerts"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full ring-2 ring-white animate-pulse">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Slide-out / Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-[5500] animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="p-4 bg-[#0B4632] text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <h4 className="text-xs font-black uppercase tracking-wider">Admission Lead Alerts</h4>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-slate-950">
                  {unreadCount} New
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-[11px] font-bold text-emerald-200 hover:text-white transition flex items-center gap-1 cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* List of Notification Alerts */}
          <div className="max-h-96 overflow-y-auto divide-y divide-slate-100 custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="p-8 text-center space-y-2 text-slate-400">
                <Inbox className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-xs font-bold">No application alerts received yet.</p>
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleNotificationClick(item)}
                  className={`p-3.5 transition-all cursor-pointer flex items-start gap-3 hover:bg-emerald-50/60 ${
                    item.unread ? "bg-emerald-50/40 border-l-4 border-l-[#0B4632]" : ""
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-bold ${
                      item.unread ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    <UserCheck className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <h5
                        className={`text-xs ${
                          item.unread ? "font-black text-slate-900" : "font-bold text-slate-700"
                        } truncate`}
                      >
                        {item.applicantName}
                      </h5>
                      <span className="text-[10px] font-semibold text-slate-400 shrink-0 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {getRelativeTime(item.timestamp)}
                      </span>
                    </div>

                    <p className={`text-xs ${item.unread ? "font-extrabold text-slate-800" : "text-slate-500"} truncate`}>
                      {item.phoneNumber} • {item.classGrade}
                      {item.facultyStream ? ` (${item.facultyStream})` : ""}
                    </p>
                  </div>

                  <ChevronRight className="w-4 h-4 text-slate-300 self-center shrink-0" />
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
