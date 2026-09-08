import React, { useState, useEffect } from "react";
import { NoticeEventManager } from "./NoticeEventManager";
import { AdminNotificationDrawer } from "./AdminNotificationDrawer";
import { ApplicationDetailModal } from "./ApplicationDetailModal";
import { OfficialAdmissionFormModal } from "./OfficialAdmissionFormModal";
import {
  School,
  ChartPie,
  GraduationCap,
  ClipboardList,
  Banknote,
  BookOpen,
  PenSquare,
  BarChart3,
  Presentation,
  Building2,
  Megaphone,
  ChartLine,
  UserCog,
  LogOut,
  UserPlus,
  CalendarCheck,
  Receipt,
  Sparkles,
  Search,
  Plus,
  Trash2,
  CheckCircle2,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Filter,
  Download,
  Printer,
  ShieldCheck,
  Check,
  Clock,
  DollarSign,
  TrendingUp,
  FileSpreadsheet,
  Calendar,
  AlertCircle,
  UserCheck,
  ArrowUpRight,
  RefreshCw,
  Award,
  Layers,
  Lock,
} from "lucide-react";
import { Student, Admission, Notice } from "../types";

interface DashboardPortalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAdmit: () => void;
  onOpenAISuite: (tab?: string) => void;
}

export const DashboardPortal: React.FC<DashboardPortalProps> = ({
  isOpen,
  onClose,
  onOpenAdmit,
  onOpenAISuite,
}) => {
  // Collapsible sidebar state (default: collapsed/icon-only as requested, easily toggled via header menu)
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState("sec-dashboard");

  // Real-time Lead Review Application Modal State
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);
  const [isAppDetailModalOpen, setIsAppDetailModalOpen] = useState<boolean>(false);
  const [isOfficialFormOpen, setIsOfficialFormOpen] = useState<boolean>(false);
  const [students, setStudents] = useState<Student[]>([
    {
      id: "1",
      rollNo: "STU-1001",
      name: "Aarav Sharma",
      grade: "Grade 11",
      faculty: "Computer Science",
      phone: "+977 9841234567",
      email: "aarav.sharma@factfusion.edu.np",
      attendanceRate: 98,
      dueAmount: 0,
    },
    {
      id: "2",
      rollNo: "STU-1002",
      name: "Pooja Chaudhary",
      grade: "Grade 12",
      faculty: "Management",
      phone: "+977 9801239876",
      email: "pooja.c@factfusion.edu.np",
      attendanceRate: 94,
      dueAmount: 1500,
    },
    {
      id: "3",
      rollNo: "STU-1003",
      name: "Rohan Adhikari",
      grade: "Grade 11",
      faculty: "General Science",
      phone: "+977 9812345678",
      email: "rohan.a@factfusion.edu.np",
      attendanceRate: 91,
      dueAmount: 0,
    },
    {
      id: "4",
      rollNo: "STU-1004",
      name: "Sneha Mahato",
      grade: "Grade 10",
      faculty: "General Science",
      phone: "+977 9865432109",
      email: "sneha.m@factfusion.edu.np",
      attendanceRate: 96,
      dueAmount: 3200,
    },
    {
      id: "5",
      rollNo: "STU-1005",
      name: "Karan Raut",
      grade: "Grade 12",
      faculty: "Computer Science",
      phone: "+977 9843219870",
      email: "karan.r@factfusion.edu.np",
      attendanceRate: 95,
      dueAmount: 0,
    },
  ]);

  const [admissions, setAdmissions] = useState<Admission[]>([
    {
      id: "ADM-9021",
      fullName: "Bikash Yadav",
      phone: "+977 9811223344",
      email: "bikash.yadav@gmail.com",
      grade: "11",
      faculty: "Computer Science",
      status: "Approved",
      submittedAt: "2026-08-30 14:20",
    },
    {
      id: "ADM-9022",
      fullName: "Nisha Shrestha",
      phone: "+977 9822334455",
      email: "nisha.s@gmail.com",
      grade: "12",
      faculty: "Management",
      status: "Pending",
      submittedAt: "2026-08-31 09:15",
    },
    {
      id: "ADM-9023",
      fullName: "Siddhartha Karki",
      phone: "+977 9833445566",
      email: "siddhartha.k@gmail.com",
      grade: "11",
      faculty: "Bio Sciences",
      status: "Approved",
      submittedAt: "2026-09-01 11:45",
    },
  ]);

  const [notices, setNotices] = useState<Notice[]>([
    {
      id: "NOT-101",
      title: "Second Terminal Examination Routine Published",
      date: "2026-09-01",
      category: "Exam",
      content:
        "The complete examination routine for Grade 10, 11, and 12 has been officially published. Hall tickets can be collected from the administration office.",
    },
    {
      id: "NOT-102",
      title: "Annual Science & AI Tech Exhibition 2026",
      date: "2026-08-28",
      category: "Academic",
      content:
        "Registration is open for students presenting robotics, smart school models, and coding projects in the upcoming annual exhibition.",
    },
    {
      id: "NOT-103",
      title: "Public Holiday Notice - Constitution Day",
      date: "2026-08-25",
      category: "Holiday",
      content:
        "The institution will remain closed on the upcoming official national holiday. Regular administrative sessions resume the following day.",
    },
  ]);

  const [studentSearch, setStudentSearch] = useState("");
  const [selectedFacultyFilter, setSelectedFacultyFilter] = useState("All");

  // New Student state
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [newStudentName, setNewStudentName] = useState("");
  const [newStudentGrade, setNewStudentGrade] = useState("Grade 11");
  const [newStudentFaculty, setNewStudentFaculty] = useState("Computer Science");
  const [newStudentPhone, setNewStudentPhone] = useState("+977 9800000000");

  // New Notice state
  const [noticeTitle, setNoticeTitle] = useState("");
  const [noticeCategory, setNoticeCategory] = useState<"Academic" | "Exam" | "General" | "Holiday">("Academic");
  const [noticeContent, setNoticeContent] = useState("");

  // Attendance state
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().substring(0, 10));
  const [attendanceRecords, setAttendanceRecords] = useState<{ [id: string]: "Present" | "Absent" | "Late" }>({
    "1": "Present",
    "2": "Present",
    "3": "Present",
    "4": "Present",
    "5": "Present",
  });

  // Fee state
  const [collectedToday, setCollectedToday] = useState(58500);
  const [feeStudentId, setFeeStudentId] = useState("2");
  const [feeAmount, setFeeAmount] = useState(1500);

  // Accounting ledger dummy records
  const [accountingRecords, setAccountingRecords] = useState([
    { id: "TX-401", title: "Monthly Tuition Fee - Batch 2026", category: "Tuition Income", type: "Income", amount: 185000, date: "2026-09-01" },
    { id: "TX-402", title: "Faculty Science Lab Equipment", category: "Academics", type: "Expense", amount: 34500, date: "2026-08-30" },
    { id: "TX-403", title: "High-Speed Campus Fiber Internet", category: "Utilities", type: "Expense", amount: 12000, date: "2026-08-28" },
    { id: "TX-404", title: "Library Reference Books & Journals", category: "Library", type: "Expense", amount: 21000, date: "2026-08-27" },
  ]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resStu, resAdm, resNot] = await Promise.all([
        fetch("/api/students"),
        fetch("/api/admissions"),
        fetch("/api/notices"),
      ]);

      if (resStu.ok) {
        const d = await resStu.json();
        if (d && d.length > 0) setStudents(d);
      }
      if (resAdm.ok) {
        const d = await resAdm.json();
        if (d && d.length > 0) setAdmissions(d);
      }
      if (resNot.ok) {
        const d = await resNot.json();
        if (d && d.length > 0) setNotices(d);
      }
    } catch (e) {
      console.warn("Utilizing pre-loaded institutional records.");
    }
  };

  if (!isOpen) return null;

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    const newStudentObj: Student = {
      id: String(Date.now()),
      rollNo: `STU-${Math.floor(1000 + Math.random() * 9000)}`,
      name: newStudentName,
      grade: newStudentGrade,
      faculty: newStudentFaculty,
      phone: newStudentPhone,
      email: `${newStudentName.toLowerCase().replace(/\s+/g, "")}@factfusion.edu.np`,
      attendanceRate: 100,
      dueAmount: 0,
    };

    setStudents((prev) => [...prev, newStudentObj]);
    setShowAddStudentModal(false);
    setNewStudentName("");

    try {
      await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStudentObj),
      });
    } catch (err) {
      // client updated
    }
  };

  const handleAddNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    const newNoticeObj: Notice = {
      id: `NOT-${Date.now().toString().slice(-4)}`,
      title: noticeTitle,
      category: noticeCategory,
      content: noticeContent,
      date: new Date().toISOString().substring(0, 10),
      targetAudience: "All",
      status: "Active",
    };

    setNotices((prev) => [newNoticeObj, ...prev]);
    setNoticeTitle("");
    setNoticeContent("");
    alert("Notice published successfully!");

    try {
      await fetch("/api/notices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newNoticeObj),
      });
    } catch (err) {
      // client updated
    }
  };

  const handleCollectFee = (e: React.FormEvent) => {
    e.preventDefault();
    setCollectedToday((prev) => prev + Number(feeAmount));
    setStudents((prev) =>
      prev.map((s) => (s.id === feeStudentId ? { ...s, dueAmount: Math.max(0, s.dueAmount - Number(feeAmount)) } : s))
    );
    const targetStudent = students.find((s) => s.id === feeStudentId);
    setAccountingRecords((prev) => [
      {
        id: `TX-${Math.floor(500 + Math.random() * 500)}`,
        title: `Fee Collected - ${targetStudent?.name || "Student"}`,
        category: "Tuition Income",
        type: "Income",
        amount: Number(feeAmount),
        date: new Date().toISOString().substring(0, 10),
      },
      ...prev,
    ]);
    alert(`Fee of Rs. ${Number(feeAmount).toLocaleString()} recorded successfully for student ID ${feeStudentId}!`);
  };

  const markAllAttendance = (status: "Present" | "Absent" | "Late") => {
    const updated: { [id: string]: "Present" | "Absent" | "Late" } = {};
    students.forEach((s) => {
      updated[s.id] = status;
    });
    setAttendanceRecords(updated);
  };

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.faculty.toLowerCase().includes(studentSearch.toLowerCase());
    const matchesFaculty = selectedFacultyFilter === "All" || s.faculty === selectedFacultyFilter;
    return matchesSearch && matchesFaculty;
  });

  const navigationItems = [
    { id: "sec-dashboard", label: "Dashboard", icon: ChartPie },
    { id: "sec-students", label: "Students", icon: GraduationCap },
    { id: "sec-attendance", label: "Attendance", icon: ClipboardList },
    { id: "sec-feecollect", label: "Fee Collection", icon: Banknote },
    { id: "sec-accounting", label: "Accounting", icon: BookOpen },
    { id: "sec-exams", label: "Exams Setup", icon: PenSquare },
    { id: "sec-results", label: "Results & Marks", icon: BarChart3 },
    { id: "sec-teachers", label: "Teachers & Staff", icon: Presentation },
    { id: "sec-academic", label: "Academic Setup", icon: Building2 },
    { id: "sec-notices", label: "Notices & Events", icon: Megaphone },
    { id: "sec-reports", label: "Reports", icon: ChartLine },
    { id: "sec-users", label: "User Roles", icon: UserCog },
  ];

  return (
    <div
      id="dashboardContainer"
      className="fixed inset-0 w-screen h-screen bg-slate-900/40 backdrop-blur-xs z-[5000] overflow-hidden flex flex-col p-2 sm:p-3 md:p-4 transition-all duration-300"
      style={{ display: "flex" }}
    >
      {/* Outer framing wrapper ensuring safe margins from screen edges */}
      <div className="flex-1 w-full h-full bg-[#F4F6F9] rounded-2xl shadow-2xl border border-slate-300/80 overflow-hidden flex flex-col">
        {/* TOP HEADER BAR WITH MENU TOGGLE */}
        <header className="h-16 md:h-18 bg-white border-b border-slate-200/90 px-4 md:px-6 flex items-center justify-between shrink-0 shadow-xs z-20">
          <div className="flex items-center gap-3 md:gap-4">
            {/* 3-line Hamburger Menu Toggle Icon */}
            <button
              id="sidebarMenuToggleBtn"
              onClick={() => setIsSidebarExpanded((prev) => !prev)}
              aria-label="Toggle Navigation Menu"
              className="w-11 h-11 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-[#0B4632] border border-slate-200 hover:border-emerald-300 flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95"
              title={isSidebarExpanded ? "Collapse Sidebar (Icon Mode)" : "Expand Sidebar (Full Menu)"}
            >
              <Menu className="w-6 h-6 shrink-0" />
            </button>

            {/* School System Branding */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0B4632] text-white flex items-center justify-center font-black shadow-xs shrink-0">
                <School className="w-5 h-5" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-base md:text-lg font-black text-slate-900 tracking-tight leading-none">
                  FactFusion SMS
                </h1>
                <p className="text-[11px] md:text-xs font-semibold text-emerald-800 tracking-wide mt-0.5">
                  School Management ERP
                </p>
              </div>
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            {/* Real-time Lead Application Notification Bell */}
            <AdminNotificationDrawer
              onSelectApplication={(appId) => {
                setSelectedApplicationId(appId);
                setIsAppDetailModalOpen(true);
              }}
            />

            <button
              onClick={() => onOpenAISuite("thinking")}
              className="px-3.5 py-2 md:px-4 md:py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 rounded-xl text-xs md:text-sm font-extrabold flex items-center gap-2 shadow-xs transition-all cursor-pointer active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span className="hidden xs:inline">AI Intelligence</span>
            </button>

            {/* Current Active View Badge */}
            <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>
                {navigationItems.find((n) => n.id === activeTab)?.label || "Dashboard"}
              </span>
            </div>

            {/* Close / Return to Website */}
            <button
              onClick={onClose}
              className="px-3.5 py-2 md:px-4 md:py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs md:text-sm rounded-xl border border-slate-200 flex items-center gap-1.5 transition cursor-pointer"
              title="Return to Public Website"
            >
              <X className="w-4 h-4" />
              <span className="hidden sm:inline">Exit Dashboard</span>
            </button>
          </div>
        </header>

        {/* MAIN BODY: SIDEBAR + CONTENT VIEW */}
        <div className="flex flex-1 w-full h-[calc(100%-4rem)] md:h-[calc(100%-4.5rem)] overflow-hidden">
          {/* 1. COLLAPSIBLE SIDEBAR */}
          <aside
            className={`bg-white border-r border-slate-200/90 flex flex-col justify-between shrink-0 transition-all duration-300 ease-in-out shadow-xs z-10 select-none ${
              isSidebarExpanded ? "w-72 md:w-80" : "w-20 md:w-22"
            }`}
          >
            {/* Top User Profile & Nav List */}
            <div className={`flex flex-col flex-1 overflow-hidden ${isSidebarExpanded ? "p-4 md:p-5" : "p-2.5 md:p-3"}`}>
              {/* User Profile Avatar Card */}
              <div
                className={`flex items-center border-b border-slate-100 pb-3 mb-3 transition-all ${
                  isSidebarExpanded ? "gap-3.5 px-2" : "justify-center"
                }`}
              >
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#0B4632] to-[#126449] text-white flex items-center justify-center font-black text-sm shadow-xs shrink-0">
                  AN
                </div>
                {isSidebarExpanded && (
                  <div className="overflow-hidden transition-all">
                    <h3 className="text-sm md:text-base font-extrabold text-slate-900 leading-tight truncate">
                      Abdullah Nahian
                    </h3>
                    <p className="text-xs font-semibold text-emerald-800 truncate">Super Administrator</p>
                  </div>
                )}
              </div>

              {/* Navigation Items List */}
              <ul className="flex-1 overflow-y-auto space-y-1.5 pr-0.5 custom-scrollbar">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => setActiveTab(item.id)}
                        title={item.label}
                        className={`w-full flex items-center rounded-xl transition-all duration-200 cursor-pointer min-h-[48px] md:min-h-[50px] ${
                          isSidebarExpanded ? "gap-3.5 px-4 py-3" : "justify-center px-2 py-3"
                        } ${
                          isActive
                            ? "bg-[#0B4632] text-white font-extrabold shadow-sm"
                            : "text-slate-600 hover:text-slate-950 hover:bg-slate-100 font-bold"
                        }`}
                      >
                        <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-white" : "text-slate-500"}`} />
                        {isSidebarExpanded && (
                          <span className="text-sm md:text-base tracking-tight truncate leading-none">
                            {item.label}
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Logout Action at Bottom */}
            <div className={`border-t border-slate-100 ${isSidebarExpanded ? "p-4 md:p-5" : "p-2.5 md:p-3"}`}>
              <button
                onClick={onClose}
                title="Log Out of Dashboard"
                className={`w-full min-h-[48px] md:min-h-[52px] bg-red-50 hover:bg-red-100 text-red-700 font-extrabold rounded-xl flex items-center justify-center border border-red-200 transition-all cursor-pointer shadow-2xs active:scale-95 ${
                  isSidebarExpanded ? "gap-3 px-4 py-3 text-sm md:text-base" : "px-2 py-3"
                }`}
              >
                <LogOut className="w-5 h-5 shrink-0" />
                {isSidebarExpanded && <span>Log Out</span>}
              </button>
            </div>
          </aside>

          {/* 2. MAIN CONTENT PANE */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 flex flex-col gap-6 bg-[#F4F6F9] min-w-0 max-w-6xl mx-auto w-full">
            {/* TAB 1: DASHBOARD OVERVIEW */}
            {activeTab === "sec-dashboard" && (
              <div className="space-y-6">
                {/* Header Welcome Banner */}
                <div className="bg-gradient-to-r from-[#031c12] via-[#0B4632] to-[#145a42] rounded-2xl p-6 sm:p-8 text-white flex flex-col lg:flex-row justify-between lg:items-center gap-6 shadow-md border border-emerald-800/40">
                  <div className="flex items-center gap-5">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80"
                      alt="Profile"
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-3 border-amber-300 object-cover shadow-md"
                    />
                    <div>
                      <div className="inline-flex items-center gap-2 bg-amber-400/20 border border-amber-300/40 text-amber-300 text-xs sm:text-sm font-black px-3 py-1 rounded-lg uppercase tracking-wider mb-1.5">
                        <ShieldCheck className="w-4 h-4" /> Super Administrator
                      </div>
                      <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">
                        Good Day, Abdullah Nahian
                      </h2>
                      <p className="text-sm sm:text-base text-emerald-100 font-medium mt-1">
                        FactFusion Hub Central School System (Mahottari Campus, Nepal)
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={onOpenAdmit}
                      className="px-5 py-3.5 bg-white hover:bg-emerald-50 text-[#0B4632] rounded-xl text-sm sm:text-base font-extrabold transition shadow-sm flex items-center gap-2 cursor-pointer active:scale-95"
                    >
                      <UserPlus className="w-5 h-5" /> Admit Student
                    </button>
                    <button
                      onClick={() => onOpenAISuite("fast")}
                      className="px-5 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-sm sm:text-base font-extrabold transition shadow-sm flex items-center gap-2 cursor-pointer active:scale-95"
                    >
                      <Sparkles className="w-5 h-5" /> AI Advisor
                    </button>
                  </div>
                </div>

                {/* KPI Metrics Grid (High Visibility Cards) */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                  <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between min-h-[115px]">
                    <div className="flex items-center justify-between text-slate-500">
                      <span className="text-xs sm:text-sm font-bold uppercase tracking-wider">Students</span>
                      <GraduationCap className="w-4.5 h-4.5 text-emerald-700" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">12,450</div>
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 mt-1">
                      <TrendingUp className="w-3.5 h-3.5" /> +8.4% this year
                    </span>
                  </div>

                  <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between min-h-[115px]">
                    <div className="flex items-center justify-between text-slate-500">
                      <span className="text-xs sm:text-sm font-bold uppercase tracking-wider">Faculty</span>
                      <Presentation className="w-4.5 h-4.5 text-blue-700" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">150+</div>
                    <span className="text-xs font-semibold text-slate-500 mt-1">Active Professors</span>
                  </div>

                  <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between min-h-[115px]">
                    <div className="flex items-center justify-between text-slate-500">
                      <span className="text-xs sm:text-sm font-bold uppercase tracking-wider">Today Fees</span>
                      <Banknote className="w-4.5 h-4.5 text-emerald-700" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-emerald-800 mt-2">
                      Rs. {collectedToday.toLocaleString()}
                    </div>
                    <span className="text-xs font-bold text-emerald-600 mt-1">Verified Cashier</span>
                  </div>

                  <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between min-h-[115px]">
                    <div className="flex items-center justify-between text-slate-500">
                      <span className="text-xs sm:text-sm font-bold uppercase tracking-wider">Attendance</span>
                      <ClipboardList className="w-4.5 h-4.5 text-blue-700" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-blue-800 mt-2">96.8%</div>
                    <span className="text-xs font-bold text-blue-600 mt-1">Present Today</span>
                  </div>

                  <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between min-h-[115px]">
                    <div className="flex items-center justify-between text-slate-500">
                      <span className="text-xs sm:text-sm font-bold uppercase tracking-wider">Pending Dues</span>
                      <AlertCircle className="w-4.5 h-4.5 text-amber-600" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-amber-700 mt-2">Rs. 4,700</div>
                    <span className="text-xs font-semibold text-slate-500 mt-1">2 Student Invoices</span>
                  </div>

                  <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between min-h-[115px]">
                    <div className="flex items-center justify-between text-slate-500">
                      <span className="text-xs sm:text-sm font-bold uppercase tracking-wider">Programs</span>
                      <Building2 className="w-4.5 h-4.5 text-purple-700" />
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-purple-800 mt-2">80+</div>
                    <span className="text-xs font-semibold text-slate-500 mt-1">Academic Streams</span>
                  </div>
                </div>

                {/* Quick Action Commands (Taller interactive cards) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <button
                    onClick={() => setIsOfficialFormOpen(true)}
                    className="bg-white border border-slate-200/90 hover:border-emerald-600 p-6 rounded-2xl flex items-center gap-4 text-left shadow-xs hover:shadow-md transition-all cursor-pointer group min-h-[90px]"
                  >
                    <div className="w-13 h-13 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <UserPlus className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-extrabold text-slate-900 group-hover:text-emerald-800 transition-colors">
                        Admit New Student
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 font-medium">
                        Enroll and fill official printable application form
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveTab("sec-attendance")}
                    className="bg-white border border-slate-200/90 hover:border-blue-600 p-6 rounded-2xl flex items-center gap-4 text-left shadow-xs hover:shadow-md transition-all cursor-pointer group min-h-[90px]"
                  >
                    <div className="w-13 h-13 rounded-2xl bg-blue-50 text-blue-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <CalendarCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-extrabold text-slate-900 group-hover:text-blue-800 transition-colors">
                        Record Attendance
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 font-medium">
                        Mark daily classroom roll registry
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveTab("sec-feecollect")}
                    className="bg-white border border-slate-200/90 hover:border-amber-600 p-6 rounded-2xl flex items-center gap-4 text-left shadow-xs hover:shadow-md transition-all cursor-pointer group min-h-[90px]"
                  >
                    <div className="w-13 h-13 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Receipt className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-extrabold text-slate-900 group-hover:text-amber-800 transition-colors">
                        Collect Student Fees
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 font-medium">
                        Process tuition payments and receipts
                      </p>
                    </div>
                  </button>
                </div>

                {/* Recent Admissions Ledger (Scaled Table with larger fonts & height) */}
                <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                    <div>
                      <h3 className="text-lg sm:text-xl font-black text-slate-900">
                        Recent Online Admissions Roster
                      </h3>
                      <p className="text-xs sm:text-sm font-medium text-slate-500">
                        Pending verification and document approvals for academic batch 2026
                      </p>
                    </div>
                    <button
                      onClick={() => setIsOfficialFormOpen(true)}
                      className="px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-[#0B4632] rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-2 border border-emerald-200 transition cursor-pointer"
                    >
                      <Plus className="w-4 h-4" /> New Registration Form
                    </button>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 text-xs sm:text-sm font-extrabold uppercase tracking-wider">
                          <th className="py-4 px-4 sm:px-6">Ref ID</th>
                          <th className="py-4 px-4 sm:px-6">Applicant Name</th>
                          <th className="py-4 px-4 sm:px-6">Class / Faculty</th>
                          <th className="py-4 px-4 sm:px-6">Contact Phone</th>
                          <th className="py-4 px-4 sm:px-6">Submitted At</th>
                          <th className="py-4 px-4 sm:px-6 text-right">Status Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 text-sm sm:text-base font-semibold text-slate-800">
                        {admissions.map((a) => (
                          <tr
                            key={a.id}
                            onClick={() => {
                              setSelectedApplicationId(a.id);
                              setIsAppDetailModalOpen(true);
                            }}
                            className="hover:bg-emerald-50/70 transition-colors cursor-pointer group"
                          >
                            <td className="py-4.5 px-4 sm:px-6 font-black text-slate-900 group-hover:text-emerald-800">{a.id}</td>
                            <td className="py-4.5 px-4 sm:px-6 font-bold text-slate-950">{a.fullName}</td>
                            <td className="py-4.5 px-4 sm:px-6 text-slate-700">
                              Grade {a.grade} {a.faculty ? `• ${a.faculty}` : ""}
                            </td>
                            <td className="py-4.5 px-4 sm:px-6 text-slate-600 font-mono text-xs sm:text-sm">{a.phone}</td>
                            <td className="py-4.5 px-4 sm:px-6 text-slate-500 text-xs sm:text-sm">{a.submittedAt}</td>
                            <td className="py-4.5 px-4 sm:px-6 text-right">
                              <span
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-extrabold ${
                                  a.status === "Approved"
                                    ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                                    : "bg-amber-100 text-amber-900 border border-amber-300"
                                }`}
                              >
                                {a.status === "Approved" ? <CheckCircle2 className="w-4 h-4 text-emerald-700" /> : <Clock className="w-4 h-4 text-amber-700" />}
                                {a.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: STUDENTS DIRECTORY */}
            {activeTab === "sec-students" && (
              <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6 min-h-[600px]">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                  <div>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900">
                      Students Directory & Enrolled Rosters
                    </h2>
                    <p className="text-sm sm:text-base font-medium text-slate-500 mt-1">
                      Manage active student enrollment profiles, classroom faculties, and fees records.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    {/* Search Field */}
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                      <input
                        type="text"
                        value={studentSearch}
                        onChange={(e) => setStudentSearch(e.target.value)}
                        placeholder="Search student or roll no..."
                        className="pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-sm sm:text-base font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-slate-50 min-h-[46px] w-56 sm:w-64"
                      />
                    </div>

                    {/* Faculty filter */}
                    <select
                      value={selectedFacultyFilter}
                      onChange={(e) => setSelectedFacultyFilter(e.target.value)}
                      className="px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-bold bg-slate-50 min-h-[46px] focus:outline-none"
                    >
                      <option value="All">All Streams</option>
                      <option value="Computer Science">Computer Science</option>
                      <option value="General Science">General Science</option>
                      <option value="Management">Management</option>
                    </select>

                    <button
                      onClick={() => setShowAddStudentModal(true)}
                      className="px-5 py-2.5 bg-[#0B4632] hover:bg-emerald-900 text-white rounded-xl text-sm sm:text-base font-extrabold flex items-center gap-2 transition shadow-xs cursor-pointer min-h-[46px]"
                    >
                      <Plus className="w-5 h-5" /> Add Student
                    </button>
                  </div>
                </div>

                {/* Table with enhanced height & typography */}
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 text-xs sm:text-sm font-extrabold uppercase tracking-wider">
                        <th className="py-4 px-4 sm:px-6">Roll No</th>
                        <th className="py-4 px-4 sm:px-6">Student Name</th>
                        <th className="py-4 px-4 sm:px-6">Grade / Stream</th>
                        <th className="py-4 px-4 sm:px-6">Contact Details</th>
                        <th className="py-4 px-4 sm:px-6">Attendance</th>
                        <th className="py-4 px-4 sm:px-6">Fee Status</th>
                        <th className="py-4 px-4 sm:px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-sm sm:text-base font-semibold text-slate-800">
                      {filteredStudents.map((s) => (
                        <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-4.5 px-4 sm:px-6 font-black text-slate-900">{s.rollNo}</td>
                          <td className="py-4.5 px-4 sm:px-6 font-bold text-slate-950">
                            <div>{s.name}</div>
                            <div className="text-xs font-normal text-slate-500">{s.email}</div>
                          </td>
                          <td className="py-4.5 px-4 sm:px-6">
                            <span className="inline-block bg-slate-100 text-slate-800 px-2.5 py-1 rounded-md text-xs sm:text-sm font-bold border border-slate-200">
                              {s.grade} • {s.faculty}
                            </span>
                          </td>
                          <td className="py-4.5 px-4 sm:px-6 font-mono text-xs sm:text-sm text-slate-600">{s.phone}</td>
                          <td className="py-4.5 px-4 sm:px-6">
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-emerald-700 text-sm sm:text-base">{s.attendanceRate}%</span>
                              <div className="w-16 bg-slate-200 rounded-full h-2 overflow-hidden">
                                <div className="bg-emerald-600 h-2 rounded-full" style={{ width: `${s.attendanceRate}%` }}></div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4.5 px-4 sm:px-6">
                            {s.dueAmount > 0 ? (
                              <span className="inline-flex items-center gap-1 text-amber-800 bg-amber-100 border border-amber-300 font-extrabold text-xs sm:text-sm px-2.5 py-1 rounded-md">
                                Due: Rs. {s.dueAmount.toLocaleString()}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-100 border border-emerald-300 font-extrabold text-xs sm:text-sm px-2.5 py-1 rounded-md">
                                <Check className="w-3.5 h-3.5" /> Fully Paid
                              </span>
                            )}
                          </td>
                          <td className="py-4.5 px-4 sm:px-6 text-right">
                            <button
                              onClick={() => {
                                setFeeStudentId(s.id);
                                setActiveTab("sec-feecollect");
                              }}
                              className="px-3 py-1.5 bg-slate-100 hover:bg-emerald-100 text-slate-700 hover:text-emerald-900 rounded-lg text-xs sm:text-sm font-bold border border-slate-200 transition cursor-pointer"
                            >
                              Collect Fee
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 3: DAILY ATTENDANCE REGISTRY */}
            {activeTab === "sec-attendance" && (
              <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6 min-h-[600px]">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                  <div>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900">
                      Daily Attendance Registry
                    </h2>
                    <p className="text-sm sm:text-base font-medium text-slate-500 mt-1">
                      Record presence status for enrolled classroom cohorts and generate attendance logs.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-300 min-h-[46px]">
                      <Calendar className="w-4.5 h-4.5 text-slate-500" />
                      <input
                        type="date"
                        value={attendanceDate}
                        onChange={(e) => setAttendanceDate(e.target.value)}
                        className="text-sm sm:text-base font-bold text-slate-800 bg-transparent focus:outline-none"
                      />
                    </div>

                    <button
                      onClick={() => markAllAttendance("Present")}
                      className="px-4 py-2.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 rounded-xl text-xs sm:text-sm font-extrabold border border-emerald-300 transition cursor-pointer min-h-[46px]"
                    >
                      Mark All Present
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 text-xs sm:text-sm font-extrabold uppercase tracking-wider">
                        <th className="py-4 px-4 sm:px-6">Roll ID</th>
                        <th className="py-4 px-4 sm:px-6">Student Name</th>
                        <th className="py-4 px-4 sm:px-6">Class Stream</th>
                        <th className="py-4 px-4 sm:px-6 text-right">Attendance Status Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-sm sm:text-base font-semibold text-slate-800">
                      {students.map((s) => (
                        <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-4.5 px-4 sm:px-6 font-black text-slate-900">{s.rollNo}</td>
                          <td className="py-4.5 px-4 sm:px-6 font-bold text-slate-950">{s.name}</td>
                          <td className="py-4.5 px-4 sm:px-6 text-slate-600">
                            {s.grade} • {s.faculty}
                          </td>
                          <td className="py-4.5 px-4 sm:px-6 text-right">
                            <div className="inline-flex gap-2">
                              {(["Present", "Absent", "Late"] as const).map((st) => (
                                <button
                                  key={st}
                                  onClick={() => setAttendanceRecords((prev) => ({ ...prev, [s.id]: st }))}
                                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold border transition-all cursor-pointer min-h-[40px] ${
                                    attendanceRecords[s.id] === st
                                      ? st === "Present"
                                        ? "bg-emerald-700 text-white border-emerald-700 shadow-xs scale-105"
                                        : st === "Absent"
                                        ? "bg-red-700 text-white border-red-700 shadow-xs scale-105"
                                        : "bg-amber-600 text-white border-amber-600 shadow-xs scale-105"
                                      : "bg-white text-slate-600 border-slate-300 hover:bg-slate-100"
                                  }`}
                                >
                                  {st}
                                </button>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => alert(`Attendance for ${attendanceDate} saved successfully!`)}
                    className="px-6 py-3 bg-[#0B4632] hover:bg-emerald-900 text-white rounded-xl text-sm sm:text-base font-extrabold shadow-sm transition flex items-center gap-2 cursor-pointer"
                  >
                    <CheckCircle2 className="w-5 h-5" /> Save Attendance Log
                  </button>
                </div>
              </div>
            )}

            {/* TAB 4: FEE COLLECTION & CASHIER */}
            {activeTab === "sec-feecollect" && (
              <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6 min-h-[600px]">
                <div className="border-b border-slate-100 pb-5">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900">
                    Fee Collection & Cashier Processing
                  </h2>
                  <p className="text-sm sm:text-base font-medium text-slate-500 mt-1">
                    Process student tuition fees, exam fees, bus transport, and print digital receipts.
                  </p>
                </div>

                <form onSubmit={handleCollectFee} className="grid grid-cols-1 md:grid-cols-3 gap-5 p-6 bg-slate-50 rounded-2xl border border-slate-200">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Select Student</label>
                    <select
                      value={feeStudentId}
                      onChange={(e) => setFeeStudentId(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm sm:text-base font-bold bg-white min-h-[50px] focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    >
                      {students.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.rollNo} - {s.name} (Due: Rs. {s.dueAmount.toLocaleString()})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Payment Amount (NPR)</label>
                    <input
                      type="number"
                      value={feeAmount}
                      onChange={(e) => setFeeAmount(Number(e.target.value))}
                      required
                      min={100}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm sm:text-base font-bold bg-white min-h-[50px] focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                    />
                  </div>

                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full py-3.5 px-6 bg-[#0B4632] hover:bg-emerald-900 text-white rounded-xl font-extrabold text-sm sm:text-base shadow-sm transition flex items-center justify-center gap-2 cursor-pointer min-h-[50px] active:scale-98"
                    >
                      <Receipt className="w-5 h-5" /> Post Payment & Issue Receipt
                    </button>
                  </div>
                </form>

                {/* Recent Accounting Records */}
                <div className="space-y-4">
                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">Recent Cashier Ledger</h3>
                  <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 text-xs sm:text-sm font-extrabold uppercase tracking-wider">
                          <th className="py-4 px-4 sm:px-6">Transaction Ref</th>
                          <th className="py-4 px-4 sm:px-6">Item / Category</th>
                          <th className="py-4 px-4 sm:px-6">Type</th>
                          <th className="py-4 px-4 sm:px-6">Date</th>
                          <th className="py-4 px-4 sm:px-6 text-right">Amount (NPR)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 text-sm sm:text-base font-semibold text-slate-800">
                        {accountingRecords.map((r) => (
                          <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                            <td className="py-4 px-4 sm:px-6 font-mono font-bold text-slate-900">{r.id}</td>
                            <td className="py-4 px-4 sm:px-6 font-bold text-slate-950">{r.title}</td>
                            <td className="py-4 px-4 sm:px-6">
                              <span
                                className={`px-3 py-1 rounded-lg text-xs sm:text-sm font-extrabold ${
                                  r.type === "Income" ? "bg-emerald-100 text-emerald-900" : "bg-red-100 text-red-900"
                                }`}
                              >
                                {r.type}
                              </span>
                            </td>
                            <td className="py-4 px-4 sm:px-6 text-slate-600 text-xs sm:text-sm">{r.date}</td>
                            <td className="py-4 px-4 sm:px-6 text-right font-black text-emerald-800">
                              Rs. {r.amount.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: ACCOUNTING */}
            {activeTab === "sec-accounting" && (
              <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6 min-h-[600px]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                  <div>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900">
                      Accounting & Financial Balance Sheet
                    </h2>
                    <p className="text-sm sm:text-base font-medium text-slate-500 mt-1">
                      Institutional ledger, revenue streams, campus expenditures, and tax balances.
                    </p>
                  </div>
                  <button
                    onClick={() => alert("Financial Ledger Exported to Excel/PDF")}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs sm:text-sm font-extrabold flex items-center gap-2 border border-slate-200 transition"
                  >
                    <Download className="w-4 h-4" /> Export Report
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl">
                    <span className="text-xs sm:text-sm font-bold text-emerald-800 uppercase">Total Revenue (FY 2026)</span>
                    <div className="text-2xl sm:text-3xl font-black text-emerald-950 mt-2">Rs. 4,850,000</div>
                  </div>
                  <div className="bg-red-50 border border-red-200 p-5 rounded-2xl">
                    <span className="text-xs sm:text-sm font-bold text-red-800 uppercase">Total Expenses</span>
                    <div className="text-2xl sm:text-3xl font-black text-red-950 mt-2">Rs. 1,620,000</div>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 p-5 rounded-2xl">
                    <span className="text-xs sm:text-sm font-bold text-blue-800 uppercase">Net Institutional Surplus</span>
                    <div className="text-2xl sm:text-3xl font-black text-blue-950 mt-2">Rs. 3,230,000</div>
                  </div>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-700 text-xs sm:text-sm font-extrabold uppercase tracking-wider">
                        <th className="py-4 px-4 sm:px-6">Transaction ID</th>
                        <th className="py-4 px-4 sm:px-6">Ledger Description</th>
                        <th className="py-4 px-4 sm:px-6">Category</th>
                        <th className="py-4 px-4 sm:px-6">Date</th>
                        <th className="py-4 px-4 sm:px-6 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-sm sm:text-base font-semibold text-slate-800">
                      {accountingRecords.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-4 px-4 sm:px-6 font-mono font-bold">{item.id}</td>
                          <td className="py-4 px-4 sm:px-6 font-bold">{item.title}</td>
                          <td className="py-4 px-4 sm:px-6 text-slate-600">{item.category}</td>
                          <td className="py-4 px-4 sm:px-6 text-slate-500">{item.date}</td>
                          <td className="py-4 px-4 sm:px-6 text-right font-black text-slate-900">
                            Rs. {item.amount.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 6: NOTICES & EVENTS MANAGER */}
            {activeTab === "sec-notices" && (
              <NoticeEventManager onSyncUpdated={fetchData} />
            )}

            {/* TAB 7, 8, 9, 10, 11: EXAMS, RESULTS, TEACHERS, ACADEMIC, REPORTS, USER ROLES */}
            {activeTab === "sec-exams" && (
              <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6 min-h-[600px]">
                <div className="border-b border-slate-100 pb-5 flex justify-between items-center">
                  <div>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900">
                      Exams Setup & Hall Allocation
                    </h2>
                    <p className="text-sm sm:text-base font-medium text-slate-500 mt-1">
                      Configure term examination routines, admit cards, and invigilator rosters.
                    </p>
                  </div>
                  <button
                    onClick={() => alert("New Exam Schedule Created")}
                    className="px-5 py-2.5 bg-[#0B4632] text-white rounded-xl font-extrabold text-sm flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Create Exam Schedule
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
                    <h4 className="text-base font-extrabold text-slate-900">First Terminal Exam 2026</h4>
                    <p className="text-xs text-slate-500 mt-1">Completed • Grade 10, 11, 12</p>
                    <div className="mt-4 flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-lg w-fit">
                      <CheckCircle2 className="w-4 h-4" /> 100% Results Published
                    </div>
                  </div>
                  <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-200">
                    <h4 className="text-base font-extrabold text-emerald-950">Second Terminal Exam 2026</h4>
                    <p className="text-xs text-emerald-800 mt-1">Active Upcoming • Starts Sept 20</p>
                    <div className="mt-4 flex items-center gap-2 text-xs font-bold text-amber-900 bg-amber-200 px-3 py-1.5 rounded-lg w-fit">
                      <Clock className="w-4 h-4" /> Hall Tickets Generating
                    </div>
                  </div>
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
                    <h4 className="text-base font-extrabold text-slate-900">Annual Board Mock Exam</h4>
                    <p className="text-xs text-slate-500 mt-1">Scheduled • Nov 2026</p>
                    <div className="mt-4 text-xs font-bold text-slate-600 bg-slate-200 px-3 py-1.5 rounded-lg w-fit">
                      Routine In Draft
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "sec-results" && (
              <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6 min-h-[600px]">
                <div className="border-b border-slate-100 pb-5">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900">
                    Results & Grade Ledger
                  </h2>
                  <p className="text-sm sm:text-base font-medium text-slate-500 mt-1">
                    Student GPA evaluation, marksheets, and institutional ranking matrices.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-200">
                    <span className="text-xs font-bold text-emerald-800 uppercase">Average Campus GPA</span>
                    <div className="text-3xl font-black text-emerald-950 mt-1">3.68 / 4.0</div>
                  </div>
                  <div className="p-5 bg-blue-50 rounded-2xl border border-blue-200">
                    <span className="text-xs font-bold text-blue-800 uppercase">A+ Honors Count</span>
                    <div className="text-3xl font-black text-blue-950 mt-1">428 Students</div>
                  </div>
                  <div className="p-5 bg-purple-50 rounded-2xl border border-purple-200">
                    <span className="text-xs font-bold text-purple-800 uppercase">Pass Percentage</span>
                    <div className="text-3xl font-black text-purple-950 mt-1">99.4%</div>
                  </div>
                  <div className="p-5 bg-amber-50 rounded-2xl border border-amber-200">
                    <span className="text-xs font-bold text-amber-800 uppercase">Pending Verification</span>
                    <div className="text-3xl font-black text-amber-950 mt-1">0 Grades</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "sec-teachers" && (
              <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6 min-h-[600px]">
                <div className="border-b border-slate-100 pb-5 flex justify-between items-center">
                  <div>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900">
                      Faculty & Staff Directory
                    </h2>
                    <p className="text-sm sm:text-base font-medium text-slate-500 mt-1">
                      Teaching roster, subject master allocations, and department leads.
                    </p>
                  </div>
                  <button
                    onClick={() => alert("Add Teacher Modal Opened")}
                    className="px-5 py-2.5 bg-[#0B4632] text-white rounded-xl font-extrabold text-sm flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Add Teacher
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {[
                    { name: "Dr. Rameshwor Jha", dept: "Computer Science & AI", role: "Head of Department", email: "r.jha@factfusion.edu.np" },
                    { name: "Prof. Sunita Regmi", dept: "General & Applied Sciences", role: "Senior Professor", email: "s.regmi@factfusion.edu.np" },
                    { name: "Er. Amit Kumar Yadav", dept: "Information Technology", role: "Lecturer", email: "a.yadav@factfusion.edu.np" },
                  ].map((t, idx) => (
                    <div key={idx} className="p-6 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
                      <div>
                        <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-md">{t.dept}</span>
                        <h4 className="text-lg font-black text-slate-900 mt-3">{t.name}</h4>
                        <p className="text-xs text-slate-500 font-semibold">{t.role}</p>
                        <p className="text-xs text-slate-600 font-mono mt-2">{t.email}</p>
                      </div>
                      <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between items-center">
                        <span className="text-xs font-bold text-emerald-700">Active Campus</span>
                        <button className="text-xs font-extrabold text-[#0B4632] hover:underline">View Routine →</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "sec-academic" && (
              <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6 min-h-[600px]">
                <div className="border-b border-slate-100 pb-5">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900">
                    Academic Curriculum & Program Setup
                  </h2>
                  <p className="text-sm sm:text-base font-medium text-slate-500 mt-1">
                    Manage semester modules, class schedules, syllabus standards, and lecture halls.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50">
                    <h4 className="text-lg font-black text-slate-900">Grade 11 & 12 Syllabus (National Board)</h4>
                    <p className="text-sm text-slate-600 mt-2">
                      Full accreditation alignment with Science, Management, and Technical education streams.
                    </p>
                  </div>
                  <div className="p-6 rounded-2xl border border-slate-200 bg-slate-50">
                    <h4 className="text-lg font-black text-slate-900">Smart Classroom & Lab Allocations</h4>
                    <p className="text-sm text-slate-600 mt-2">
                      8 Science Labs, 4 AI Computer Labs, and 20 multimedia lecture rooms.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "sec-reports" && (
              <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6 min-h-[600px]">
                <div className="border-b border-slate-100 pb-5">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900">
                    Comprehensive Institutional Reports
                  </h2>
                  <p className="text-sm sm:text-base font-medium text-slate-500 mt-1">
                    Export audit-ready CSV, Excel, and PDF performance documents.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { title: "Student Attendance Analytics", format: "Excel / CSV" },
                    { title: "Monthly Fee Audit Statement", format: "PDF / Ledger" },
                    { title: "Academic Terminal Performance", format: "Official Report" },
                  ].map((rep, i) => (
                    <div key={i} className="p-5 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
                      <div>
                        <h4 className="text-base font-bold text-slate-900">{rep.title}</h4>
                        <p className="text-xs text-slate-500 mt-1">Format: {rep.format}</p>
                      </div>
                      <button
                        onClick={() => alert(`Downloaded: ${rep.title}`)}
                        className="mt-4 px-4 py-2 bg-[#0B4632] hover:bg-emerald-900 text-white text-xs font-extrabold rounded-xl flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Download className="w-4 h-4" /> Download Report
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "sec-users" && (
              <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6 min-h-[600px]">
                <div className="border-b border-slate-100 pb-5">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900">
                    User Roles & Security Access Control
                  </h2>
                  <p className="text-sm sm:text-base font-medium text-slate-500 mt-1">
                    Role-Based Access Control (RBAC) permissions matrix for Admin, Faculty, Accountant, and Students.
                  </p>
                </div>
                <div className="space-y-3">
                  {[
                    { role: "Super Administrator", user: "Abdullah Nahian", access: "All Modules & DB Control", active: true },
                    { role: "Academic Head", user: "Dr. Rameshwor Jha", access: "Exams, Classes, Syllabus", active: true },
                    { role: "Accountant & Cashier", user: "Suresh Poudel", access: "Fee Collection & Accounting", active: true },
                    { role: "Teacher Staff", user: "Faculty Group", access: "Daily Attendance & Marks Entry", active: true },
                  ].map((u, i) => (
                    <div key={i} className="p-5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-950 text-base">{u.user}</span>
                          <span className="text-xs font-extrabold text-[#0B4632] bg-emerald-100 px-2 py-0.5 rounded">
                            {u.role}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Scope: {u.access}</p>
                      </div>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg">
                        Active Access
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Add Student Modal */}
      {showAddStudentModal && (
        <div className="fixed inset-0 z-[6500] flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <h3 className="text-lg sm:text-xl font-black text-slate-900">Add Student to Database</h3>
              <button
                onClick={() => setShowAddStudentModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddStudent} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Student Full Name</label>
                <input
                  type="text"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  required
                  placeholder="e.g. Suman Thapa"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm sm:text-base font-bold bg-white min-h-[48px] focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Grade / Class</label>
                <select
                  value={newStudentGrade}
                  onChange={(e) => setNewStudentGrade(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm sm:text-base font-bold bg-white min-h-[48px]"
                >
                  <option value="Grade 11">Grade 11</option>
                  <option value="Grade 12">Grade 12</option>
                  <option value="Grade 10">Grade 10</option>
                  <option value="Grade 9">Grade 9</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Faculty Stream</label>
                <select
                  value={newStudentFaculty}
                  onChange={(e) => setNewStudentFaculty(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm sm:text-base font-bold bg-white min-h-[48px]"
                >
                  <option value="Computer Science">Computer Science</option>
                  <option value="General Science">General Science</option>
                  <option value="Management">Management</option>
                  <option value="Bio Sciences">Bio Sciences</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Contact Phone</label>
                <input
                  type="text"
                  value={newStudentPhone}
                  onChange={(e) => setNewStudentPhone(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl text-sm sm:text-base font-bold bg-white min-h-[48px]"
                />
              </div>

              <div className="flex gap-3 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="px-5 py-3 rounded-xl text-sm font-extrabold text-slate-600 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl text-sm font-extrabold text-white bg-[#0B4632] hover:bg-emerald-900 transition cursor-pointer shadow-sm"
                >
                  Save Student Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Real-time Pending Lead Verification Modal */}
      <ApplicationDetailModal
        applicationId={selectedApplicationId}
        isOpen={isAppDetailModalOpen}
        onClose={() => {
          setIsAppDetailModalOpen(false);
          setSelectedApplicationId(null);
        }}
        onApplicationUpdated={() => {
          fetchData();
        }}
      />

      {/* Official A4 Printable School Admission Application Form Modal */}
      <OfficialAdmissionFormModal
        isOpen={isOfficialFormOpen}
        onClose={() => setIsOfficialFormOpen(false)}
        onFormSubmitted={() => {
          fetchData();
        }}
      />
    </div>
  );
};
