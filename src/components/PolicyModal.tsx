import React, { useState, useEffect, useRef } from "react";
import {
  ShieldCheck,
  ShieldAlert,
  Globe,
  Printer,
  Copy,
  CheckCheck,
  Search,
  X,
  Calendar,
  Clock,
  Building2,
  Lock,
  BookOpen,
  HelpCircle,
  Eye,
  KeyRound,
  FileCheck,
  ChevronRight,
  Menu,
} from "lucide-react";

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: "en" | "ne";
}

export function PolicyModal({ isOpen, onClose, lang: initialLang }: PolicyModalProps) {
  const [activeLang, setActiveLang] = useState<"en" | "ne">(initialLang);
  const [searchQuery, setSearchQuery] = useState("");
  const [copied, setCopied] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState("pol-sec-1");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [fontSize, setFontSize] = useState<"sm" | "base" | "lg">("base");
  const [showSidebar, setShowSidebar] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setActiveLang(initialLang);
  }, [initialLang]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Track scroll progress and active section
  const handleScroll = () => {
    if (!contentRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
    const totalScroll = scrollHeight - clientHeight;
    const progress = totalScroll > 0 ? (scrollTop / totalScroll) * 100 : 0;
    setScrollProgress(progress);

    const sectionElements = [1, 2, 3, 4].map((num) =>
      document.getElementById(`pol-sec-${num}`)
    );

    for (let i = sectionElements.length - 1; i >= 0; i--) {
      const el = sectionElements[i];
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= 220) {
          setActiveSectionId(`pol-sec-${i + 1}`);
          break;
        }
      }
    }
  };

  const scrollToSection = (id: string) => {
    setActiveSectionId(id);
    const element = document.getElementById(id);
    if (element && contentRef.current) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const englishPolicyText = `System Access Policy

1. Overview
This policy governs access rights, permissions, and administrative controls for the platform. The platform operates on a public-view model for regular users while providing dedicated administrative access for verified institutions and administrators.

2. User Access & Permissions
Public Access: Regular users can view all content, browse listings, access features, and submit applications directly through the platform.
No User Authentication Required: Standard users are not required to create accounts or authenticate to utilize public features and application processes.

3. Administrator & Institutional Access
Administrative Privileges: Authorized school administrators and system managers maintain full administrative control over the platform.
Management Capabilities: Administrative access permits managing content, reviewing incoming applications, updating site parameters, and configuring platform settings.
Access Control: Institutional access is strictly restricted to authorized administrative personnel to ensure platform integrity and data security.

4. Policy Compliance & Security
Unauthenticated users are strictly prohibited from accessing administrative tools, background management interfaces, or data controls.
All application data submitted by users is managed exclusively by authorized administrators.`;

  const nepaliPolicyText = `प्रणाली पहुँच नीति (System Access Policy)

१. अवलोकनसम्बन्धी व्यवस्था (Overview)
यो नीतिले प्लेटफर्मका लागि पहुँच अधिकार, अनुमति र प्रशासनिक नियन्त्रणहरूलाई नियमन गर्छ। यो प्लेटफर्म सामान्य प्रयोगकर्ताहरूका लागि सार्वजनिक-पहँच मोड (public-view model) मा सञ्चालन हुन्छ भने प्रमाणित संस्थाहरू र प्रशासकहरूका लागि समर्पित प्रशासनिक पहुँच प्रदान गर्दछ।

२. प्रयोगकर्ता पहुँच र अनुमतिहरू (User Access & Permissions)
सार्वजनिक पहुँच (Public Access): सामान्य प्रयोगकर्ताहरूले प्लेटफर्म मार्फत सिधै सबै सामग्री हेर्न, सूचीहरू अवलोकन गर्न, सुविधाहरू प्रयोग गर्न र आवेदनहरू बुझाउन सक्नुहुनेछ।
प्रयोगकर्ता प्रमाणीकरण आवश्यक नरहेको (No User Authentication Required): सर्वसाधारण प्रयोगकर्ताहरूलाई सार्वजनिक सुविधाहरू र आवेदन प्रक्रियाहरू प्रयोग गर्न खाता सिर्जना गर्न वा लगइन (authenticate) गर्न आवश्यक छैन।

३. प्रशासक र संस्थागत पहुँच (Administrator & Institutional Access)
प्रशासनिक अधिकारहरू (Administrative Privileges): अधिकृत विद्यालय प्रशासकहरू र प्रणाली व्यवस्थापकहरूले प्लेटफर्ममाथि पूर्ण प्रशासनिक नियन्त्रण कायम राख्छन्।
व्यवस्थापन क्षमताहरू (Management Capabilities): प्रशासनिक पहुँचले सामग्री व्यवस्थापन गर्न, आएका आवेदनहरूको समीक्षा गर्न, साइटका मापदण्डहरू अद्यावधिक गर्न र प्लेटफर्म सेटिङहरू कन्फिगर गर्न अनुमति दिन्छ।
पहुँच नियन्त्रण (Access Control): प्लेटफर्मको अखण्डता र डेटा सुरक्षा सुनिश्चित गर्न संस्थागत पहुँच केवल अधिकृत प्रशासनिक कर्मचारीहरूमा मात्र कडा रूपमा सीमित गरिएको छ।

४. नीति पालना र सुरक्षा (Policy Compliance & Security)
गैर-प्रमाणित प्रयोगकर्ताहरूलाई प्रशासनिक उपकरणहरू, ब्याकग्राउन्ड व्यवस्थापन इन्टरफेस, वा डेटा नियन्त्रणहरूमा पहुँच गर्न कडा प्रतिबन्ध लगाइएको छ।
प्रयोगकर्ताहरूद्वारा बुझाइएका सबै आवेदन डेटा केवल अधिकृत प्रशासकहरूद्वारा मात्र व्यवस्थापन गरिन्छ।`;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeLang === "ne" ? nepaliPolicyText : englishPolicyText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!isOpen) return null;

  const sectionsList = [
    {
      id: "pol-sec-1",
      num: activeLang === "ne" ? "१" : "1",
      title: activeLang === "ne" ? "अवलोकनसम्बन्धी व्यवस्था" : "Overview",
      subtitle: activeLang === "ne" ? "Overview & Purpose" : "Public-View Model",
      icon: Eye,
    },
    {
      id: "pol-sec-2",
      num: activeLang === "ne" ? "२" : "2",
      title: activeLang === "ne" ? "प्रयोगकर्ता पहुँच र अनुमतिहरू" : "User Access & Permissions",
      subtitle: activeLang === "ne" ? "No Auth Required" : "Public Submissions",
      icon: BookOpen,
    },
    {
      id: "pol-sec-3",
      num: activeLang === "ne" ? "३" : "3",
      title: activeLang === "ne" ? "प्रशासक र संस्थागत पहुँच" : "Administrator & Institutional Access",
      subtitle: activeLang === "ne" ? "Admin Controls" : "School Management",
      icon: Building2,
    },
    {
      id: "pol-sec-4",
      num: activeLang === "ne" ? "४" : "4",
      title: activeLang === "ne" ? "नीति पालना र सुरक्षा" : "Policy Compliance & Security",
      subtitle: activeLang === "ne" ? "Compliance & Security" : "Strict Verification",
      icon: ShieldAlert,
    },
  ];

  const fontSizeClasses = {
    sm: "text-sm leading-relaxed",
    base: "text-base leading-relaxed md:leading-8",
    lg: "text-lg leading-loose md:leading-9",
  };

  return (
    <div
      id="system-access-policy-modal"
      className="fixed inset-0 w-screen h-screen z-[99999] bg-[#001c13] text-slate-900 flex flex-col overflow-hidden select-text"
      style={{ margin: 0, padding: 0 }}
    >
      {/* 1. EXECUTIVE TOP NAVIGATION */}
      <header className="w-full bg-[#002B1D] text-white px-4 lg:px-8 py-3 flex items-center justify-between border-b border-emerald-800/80 shadow-lg shrink-0 z-30">
        {/* Left: Title & Branding */}
        <div className="flex items-center gap-3 md:gap-4">
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="p-2 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 border border-emerald-700/50 transition cursor-pointer hidden lg:flex items-center justify-center"
            title={showSidebar ? "Collapse Outline" : "Expand Outline"}
          >
            <Menu className="w-4 h-4" />
          </button>

          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/30 to-teal-400/10 text-emerald-300 flex items-center justify-center border border-emerald-400/30 shadow-inner shrink-0">
            <Lock className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base md:text-lg font-bold tracking-tight text-white flex items-center gap-2">
                {activeLang === "ne" ? "प्रणाली पहुँच नीति" : "System Access Policy"}
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2.5 py-0.5 rounded-full font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                {activeLang === "ne" ? "आधिकारिक नीति" : "Official Policy"}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-emerald-300/80 font-medium">
              <span>FactFusion Hub</span>
              <span>&bull;</span>
              <span>{activeLang === "ne" ? "लागु मिति: २०२६" : "Effective: 2026"}</span>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Font Size Adjuster */}
          <div className="hidden sm:flex items-center bg-emerald-950/80 rounded-lg p-0.5 border border-emerald-800/80">
            <button
              onClick={() => setFontSize("sm")}
              className={`px-2.5 py-1 text-xs rounded font-bold transition cursor-pointer ${
                fontSize === "sm" ? "bg-emerald-600 text-white" : "text-emerald-300/70 hover:text-white"
              }`}
              title="Small Text"
            >
              A-
            </button>
            <button
              onClick={() => setFontSize("base")}
              className={`px-2.5 py-1 text-xs rounded font-bold transition cursor-pointer ${
                fontSize === "base" ? "bg-emerald-600 text-white" : "text-emerald-300/70 hover:text-white"
              }`}
              title="Standard Text"
            >
              A
            </button>
            <button
              onClick={() => setFontSize("lg")}
              className={`px-2.5 py-1 text-xs rounded font-bold transition cursor-pointer ${
                fontSize === "lg" ? "bg-emerald-600 text-white" : "text-emerald-300/70 hover:text-white"
              }`}
              title="Large Text"
            >
              A+
            </button>
          </div>

          {/* Language Switcher */}
          <button
            onClick={() => setActiveLang((prev) => (prev === "en" ? "ne" : "en"))}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-900/80 hover:bg-emerald-800 text-white border border-emerald-700/60 text-xs font-semibold transition cursor-pointer shadow-xs"
            title="Switch Language / भाषा परिवर्तन"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>{activeLang === "en" ? "नेपाली" : "English"}</span>
          </button>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-900/80 hover:bg-emerald-800 text-white border border-emerald-700/60 text-xs font-semibold transition cursor-pointer shadow-xs"
            title="Copy Policy Text"
          >
            {copied ? (
              <>
                <CheckCheck className="w-3.5 h-3.5 text-emerald-300" />
                <span className="text-emerald-300">{activeLang === "ne" ? "प्रतिलिपि गरियो" : "Copied"}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-emerald-300" />
                <span>{activeLang === "ne" ? "कपी" : "Copy"}</span>
              </>
            )}
          </button>

          {/* Print Button */}
          <button
            onClick={handlePrint}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-900/80 hover:bg-emerald-800 text-white border border-emerald-700/60 text-xs font-semibold transition cursor-pointer shadow-xs"
            title="Print Policy"
          >
            <Printer className="w-3.5 h-3.5 text-emerald-300" />
            <span>{activeLang === "ne" ? "प्रिन्ट" : "Print"}</span>
          </button>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 hover:text-white border border-rose-400/40 text-xs font-bold transition cursor-pointer ml-1 shadow-xs"
            aria-label="Close Policy Modal"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">{activeLang === "ne" ? "बन्द गर्नुहोस्" : "Close (Esc)"}</span>
          </button>
        </div>
      </header>

      {/* Dynamic Scroll Progress */}
      <div className="w-full bg-[#001710] h-1 shrink-0">
        <div
          className="bg-emerald-400 h-full transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* 2. HORIZONTAL JUMP BAR */}
      <div className="w-full bg-white border-b border-slate-200 px-4 md:px-8 py-2 overflow-x-auto shrink-0 flex items-center gap-2 no-scrollbar shadow-xs">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap flex items-center gap-1.5 pr-2 border-r border-slate-200">
          <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
          {activeLang === "ne" ? "खण्डहरू:" : "Jump to:"}
        </span>
        {sectionsList.map((sec) => (
          <button
            key={sec.id}
            onClick={() => scrollToSection(sec.id)}
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
              activeSectionId === sec.id
                ? "bg-[#002B1D] text-white shadow-xs"
                : "bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 border border-slate-200/80"
            }`}
          >
            <span className="opacity-80 font-bold">{sec.num}.</span>
            <span>{sec.title}</span>
          </button>
        ))}
      </div>

      {/* 3. MAIN WORKSPACE (WIDTH = DEVICE WIDTH) */}
      <div className="flex-1 flex w-full h-full overflow-hidden bg-[#F4F7F5]">
        {/* SIDEBAR NAVIGATION (XL DESKTOPS) */}
        {showSidebar && (
          <aside className="hidden xl:flex w-72 bg-white border-r border-slate-200 flex-col shrink-0 h-full overflow-hidden shadow-xs">
            <div className="p-3.5 border-b border-slate-100 bg-slate-50/70">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder={activeLang === "ne" ? "नीतिहरू खोज्नुहोस्..." : "Search policy..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 transition"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-1">
              <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {activeLang === "ne" ? "नीति खण्डहरू" : "Policy Sections"}
              </div>
              {sectionsList.map((sec) => {
                const isMatch = searchQuery
                  ? sec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    sec.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
                  : true;

                if (!isMatch) return null;

                return (
                  <button
                    key={sec.id}
                    onClick={() => scrollToSection(sec.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl transition flex items-center justify-between group cursor-pointer ${
                      activeSectionId === sec.id
                        ? "bg-emerald-50 text-emerald-950 border border-emerald-200 font-semibold"
                        : "hover:bg-slate-100 text-slate-600 font-medium"
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className={`w-5 h-5 rounded-md text-[11px] font-bold flex items-center justify-center shrink-0 ${
                          activeSectionId === sec.id
                            ? "bg-[#002B1D] text-white"
                            : "bg-slate-100 text-slate-600 group-hover:bg-slate-200"
                        }`}
                      >
                        {sec.num}
                      </span>
                      <span className="text-xs truncate">{sec.title}</span>
                    </div>
                    <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-slate-700 shrink-0" />
                  </button>
                );
              })}
            </div>

            <div className="p-3 m-3 bg-emerald-950 text-white rounded-xl border border-emerald-800/80 shadow-xs shrink-0">
              <div className="flex items-center gap-1.5 mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs font-bold text-emerald-200">
                  {activeLang === "ne" ? "संस्थागत सुरक्षा" : "Security Guarantee"}
                </span>
              </div>
              <p className="text-[11px] text-emerald-300/80 leading-snug">
                {activeLang === "ne"
                  ? "सार्वजनिक प्रयोगकर्ताहरूलाई कुनै दर्ता आवश्यक पर्दैन, प्रशासनिक अधिकारहरू सुरक्षित छन्।"
                  : "Public access is friction-free without login; administrative privileges are securely restricted."}
              </p>
            </div>
          </aside>
        )}

        {/* MAIN CANVAS - DEVICE-WIDTH RESPONSIVE */}
        <main
          ref={contentRef}
          onScroll={handleScroll}
          className="flex-1 h-full overflow-y-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24 py-8 md:py-12 scroll-smooth w-full"
        >
          <div className="max-w-5xl mx-auto space-y-8 pb-20">
            {/* HERO POLICY BANNER */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 md:p-10 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#002B1D] via-emerald-600 to-teal-500" />

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold mb-3">
                    <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{activeLang === "ne" ? "प्रणाली पहुँच नीति (System Access Policy)" : "System Access Policy"}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#002B1D] tracking-tight">
                    {activeLang === "ne" ? "प्रणाली पहुँच नीति" : "System Access Policy"}
                  </h2>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{activeLang === "ne" ? "~२ मिनेट पढ्ने समय" : "~2 min read"}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{activeLang === "ne" ? "आधिकारिक नीति" : "Official Policy"}</span>
                  </div>
                </div>
              </div>

              {/* Overview Summary Lead */}
              <div className="mt-6 p-5 rounded-2xl bg-gradient-to-br from-emerald-50/70 to-teal-50/40 border border-emerald-100/90 text-slate-800 font-medium text-sm md:text-base leading-relaxed">
                {activeLang === "ne" ? (
                  <p>
                    यो नीतिले FactFusion Hub प्लेटफर्मका लागि पहुँच अधिकार, अनुमति र प्रशासनिक नियन्त्रणहरूलाई नियमन गर्छ। सामान्य प्रयोगकर्ताहरूका लागि सार्वजनिक पहुँच र प्रमाणित संस्थाहरूका लागि समर्पित प्रशासनिक अधिकार व्यवस्थापन गरिएको छ।
                  </p>
                ) : (
                  <p>
                    This policy outlines the access protocols, user permissions, and institutional management safeguards governing the FactFusion Hub platform.
                  </p>
                )}
              </div>
            </div>

            {/* SECTIONS */}
            {activeLang === "ne" ? (
              /* ================== NEPALI VERSION ================== */
              <div className="space-y-6">
                {/* 1. Overview */}
                <section
                  id="pol-sec-1"
                  className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xs transition hover:border-emerald-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-950 font-black text-xl flex items-center justify-center shrink-0 shadow-xs border border-emerald-200">
                      १
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <h3 className="text-xl md:text-2xl font-extrabold text-[#002B1D]">
                          १. अवलोकनसम्बन्धी व्यवस्था (Overview)
                        </h3>
                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                          खण्ड १
                        </span>
                      </div>
                      <p className={`text-slate-700 ${fontSizeClasses[fontSize]}`}>
                        यो नीतिले प्लेटफर्मका लागि पहुँच अधिकार, अनुमति र प्रशासनिक नियन्त्रणहरूलाई नियमन गर्छ। यो प्लेटफर्म सामान्य प्रयोगकर्ताहरूका लागि सार्वजनिक-पहँच मोड (public-view model) मा सञ्चालन हुन्छ भने प्रमाणित संस्थाहरू र प्रशासकहरूका लागि समर्पित प्रशासनिक पहुँच प्रदान गर्दछ।
                      </p>
                    </div>
                  </div>
                </section>

                {/* 2. User Access & Permissions */}
                <section
                  id="pol-sec-2"
                  className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xs transition hover:border-emerald-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-950 font-black text-xl flex items-center justify-center shrink-0 shadow-xs border border-emerald-200">
                      २
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <h3 className="text-xl md:text-2xl font-extrabold text-[#002B1D]">
                          २. प्रयोगकर्ता पहुँच र अनुमतिहरू (User Access &amp; Permissions)
                        </h3>
                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                          खण्ड २
                        </span>
                      </div>
                      <div className={`space-y-4 text-slate-700 ${fontSizeClasses[fontSize]}`}>
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 mt-2 shrink-0" />
                          <div>
                            <strong className="text-slate-900 block mb-1">सार्वजनिक पहुँच (Public Access):</strong>
                            <span>सामान्य प्रयोगकर्ताहरूले प्लेटफर्म मार्फत सिधै सबै सामग्री हेर्न, सूचीहरू अवलोकन गर्न, सुविधाहरू प्रयोग गर्न र आवेदनहरू बुझाउन सक्नुहुनेछ।</span>
                          </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 mt-2 shrink-0" />
                          <div>
                            <strong className="text-slate-900 block mb-1">प्रयोगकर्ता प्रमाणीकरण आवश्यक नरहेको (No User Authentication Required):</strong>
                            <span>सर्वसाधारण प्रयोगकर्ताहरूलाई सार्वजनिक सुविधाहरू र आवेदन प्रक्रियाहरू प्रयोग गर्न खाता सिर्जना गर्न वा लगइन (authenticate) गर्न आवश्यक छैन।</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* 3. Administrator & Institutional Access */}
                <section
                  id="pol-sec-3"
                  className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xs transition hover:border-emerald-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-950 font-black text-xl flex items-center justify-center shrink-0 shadow-xs border border-emerald-200">
                      ३
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <h3 className="text-xl md:text-2xl font-extrabold text-[#002B1D]">
                          ३. प्रशासक र संस्थागत पहुँच (Administrator &amp; Institutional Access)
                        </h3>
                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                          खण्ड ३
                        </span>
                      </div>
                      <div className={`space-y-4 text-slate-700 ${fontSizeClasses[fontSize]}`}>
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 mt-2 shrink-0" />
                          <div>
                            <strong className="text-slate-900 block mb-1">प्रशासनिक अधिकारहरू (Administrative Privileges):</strong>
                            <span>अधिकृत विद्यालय प्रशासकहरू र प्रणाली व्यवस्थापकहरूले प्लेटफर्ममाथि पूर्ण प्रशासनिक नियन्त्रण कायम राख्छन्।</span>
                          </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 mt-2 shrink-0" />
                          <div>
                            <strong className="text-slate-900 block mb-1">व्यवस्थापन क्षमताहरू (Management Capabilities):</strong>
                            <span>प्रशासनिक पहुँचले सामग्री व्यवस्थापन गर्न, आएका आवेदनहरूको समीक्षा गर्न, साइटका मापदण्डहरू अद्यावधिक गर्न र प्लेटफर्म सेटिङहरू कन्फिगर गर्न अनुमति दिन्छ।</span>
                          </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 mt-2 shrink-0" />
                          <div>
                            <strong className="text-slate-900 block mb-1">पहुँच नियन्त्रण (Access Control):</strong>
                            <span>प्लेटफर्मको अखण्डता र डेटा सुरक्षा सुनिश्चित गर्न संस्थागत पहुँच केवल अधिकृत प्रशासनिक कर्मचारीहरूमा मात्र कडा रूपमा सीमित गरिएको छ।</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* 4. Policy Compliance & Security */}
                <section
                  id="pol-sec-4"
                  className="bg-white border-2 border-emerald-200 rounded-3xl p-6 md:p-8 shadow-xs relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-2 h-full bg-[#002B1D]" />
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-950 text-white font-black text-xl flex items-center justify-center shrink-0 shadow-xs border border-emerald-800">
                      ४
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <h3 className="text-xl md:text-2xl font-extrabold text-[#002B1D] flex items-center gap-2">
                          <ShieldCheck className="w-5 h-5 text-emerald-600" />
                          ४. नीति पालना र सुरक्षा (Policy Compliance &amp; Security)
                        </h3>
                        <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                          कडा सुरक्षा मापदण्ड
                        </span>
                      </div>
                      <div className={`space-y-4 text-slate-700 ${fontSizeClasses[fontSize]}`}>
                        <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-start gap-3.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-700 mt-2 shrink-0" />
                          <div>
                            <span>गैर-प्रमाणित प्रयोगकर्ताहरूलाई प्रशासनिक उपकरणहरू, ब्याकग्राउन्ड व्यवस्थापन इन्टरफेस, वा डेटा नियन्त्रणहरूमा पहुँच गर्न कडा प्रतिबन्ध लगाइएको छ।</span>
                          </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-start gap-3.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-700 mt-2 shrink-0" />
                          <div>
                            <span>प्रयोगकर्ताहरूद्वारा बुझाइएका सबै आवेदन डेटा केवल अधिकृत प्रशासकहरूद्वारा मात्र व्यवस्थापन गरिन्छ।</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            ) : (
              /* ================== ENGLISH VERSION ================== */
              <div className="space-y-6">
                {/* 1. Overview */}
                <section
                  id="pol-sec-1"
                  className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xs transition hover:border-emerald-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-950 font-black text-xl flex items-center justify-center shrink-0 shadow-xs border border-emerald-200">
                      1
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <h3 className="text-xl md:text-2xl font-extrabold text-[#002B1D]">
                          1. Overview
                        </h3>
                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                          Section 1
                        </span>
                      </div>
                      <p className={`text-slate-700 ${fontSizeClasses[fontSize]}`}>
                        This policy governs access rights, permissions, and administrative controls for the platform. The platform operates on a public-view model for regular users while providing dedicated administrative access for verified institutions and administrators.
                      </p>
                    </div>
                  </div>
                </section>

                {/* 2. User Access & Permissions */}
                <section
                  id="pol-sec-2"
                  className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xs transition hover:border-emerald-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-950 font-black text-xl flex items-center justify-center shrink-0 shadow-xs border border-emerald-200">
                      2
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <h3 className="text-xl md:text-2xl font-extrabold text-[#002B1D]">
                          2. User Access &amp; Permissions
                        </h3>
                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                          Section 2
                        </span>
                      </div>
                      <div className={`space-y-4 text-slate-700 ${fontSizeClasses[fontSize]}`}>
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 mt-2 shrink-0" />
                          <div>
                            <strong className="text-slate-900 block mb-1">Public Access:</strong>
                            <span>Regular users can view all content, browse listings, access features, and submit applications directly through the platform.</span>
                          </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 mt-2 shrink-0" />
                          <div>
                            <strong className="text-slate-900 block mb-1">No User Authentication Required:</strong>
                            <span>Standard users are not required to create accounts or authenticate to utilize public features and application processes.</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* 3. Administrator & Institutional Access */}
                <section
                  id="pol-sec-3"
                  className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xs transition hover:border-emerald-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-950 font-black text-xl flex items-center justify-center shrink-0 shadow-xs border border-emerald-200">
                      3
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <h3 className="text-xl md:text-2xl font-extrabold text-[#002B1D]">
                          3. Administrator &amp; Institutional Access
                        </h3>
                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                          Section 3
                        </span>
                      </div>
                      <div className={`space-y-4 text-slate-700 ${fontSizeClasses[fontSize]}`}>
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 mt-2 shrink-0" />
                          <div>
                            <strong className="text-slate-900 block mb-1">Administrative Privileges:</strong>
                            <span>Authorized school administrators and system managers maintain full administrative control over the platform.</span>
                          </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 mt-2 shrink-0" />
                          <div>
                            <strong className="text-slate-900 block mb-1">Management Capabilities:</strong>
                            <span>Administrative access permits managing content, reviewing incoming applications, updating site parameters, and configuring platform settings.</span>
                          </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 mt-2 shrink-0" />
                          <div>
                            <strong className="text-slate-900 block mb-1">Access Control:</strong>
                            <span>Institutional access is strictly restricted to authorized administrative personnel to ensure platform integrity and data security.</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* 4. Policy Compliance & Security */}
                <section
                  id="pol-sec-4"
                  className="bg-white border-2 border-emerald-200 rounded-3xl p-6 md:p-8 shadow-xs relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-2 h-full bg-[#002B1D]" />
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-950 text-white font-black text-xl flex items-center justify-center shrink-0 shadow-xs border border-emerald-800">
                      4
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <h3 className="text-xl md:text-2xl font-extrabold text-[#002B1D] flex items-center gap-2">
                          <ShieldCheck className="w-5 h-5 text-emerald-600" />
                          4. Policy Compliance &amp; Security
                        </h3>
                        <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                          Strict Compliance
                        </span>
                      </div>
                      <div className={`space-y-4 text-slate-700 ${fontSizeClasses[fontSize]}`}>
                        <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-start gap-3.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-700 mt-2 shrink-0" />
                          <div>
                            <span>Unauthenticated users are strictly prohibited from accessing administrative tools, background management interfaces, or data controls.</span>
                          </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-start gap-3.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-700 mt-2 shrink-0" />
                          <div>
                            <span>All application data submitted by users is managed exclusively by authorized administrators.</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {/* INSTITUTIONAL FOOTER BADGE */}
            <div className="p-6 bg-[#002B1D] text-white rounded-3xl border border-emerald-800/80 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-300 border border-emerald-400/30 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">
                    {activeLang === "ne" ? "आधिकारिक संस्थागत नीति" : "Official Institutional Policy"}
                  </h4>
                  <p className="text-xs text-emerald-300/80">
                    {activeLang === "ne" ? "FactFusion Hub प्रशासनिक ढाँचा" : "FactFusion Hub Governance Framework"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shadow-xs"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copied ? (activeLang === "ne" ? "प्रतिलिपि गरियो" : "Copied!") : (activeLang === "ne" ? "कपी गर्नुहोस्" : "Copy Policy")}</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  {activeLang === "ne" ? "स्वीकार गर्नुहोस्" : "Close & Acknowledge"}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
