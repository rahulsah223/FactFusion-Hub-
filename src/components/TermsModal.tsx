import React, { useState, useEffect, useRef } from "react";
import {
  Scale,
  ShieldCheck,
  ShieldAlert,
  Globe,
  Printer,
  Copy,
  CheckCheck,
  Search,
  X,
  ChevronUp,
  ArrowLeft,
  Check,
  Calendar,
  Clock,
  Building2,
  FileText,
  Lock,
  BookOpen,
  Sparkles,
  HelpCircle,
  Maximize2,
  Minimize2,
  Type,
  ExternalLink,
  ChevronRight,
  Menu,
} from "lucide-react";

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: "en" | "ne";
}

export function TermsModal({ isOpen, onClose, lang: initialLang }: TermsModalProps) {
  const [activeLang, setActiveLang] = useState<"en" | "ne">(initialLang);
  const [searchQuery, setSearchQuery] = useState("");
  const [copied, setCopied] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState("sec-1");
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

    // Determine active section based on scroll
    const sectionElements = [1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) =>
      document.getElementById(`sec-${num}`)
    );

    for (let i = sectionElements.length - 1; i >= 0; i--) {
      const el = sectionElements[i];
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= 200) {
          setActiveSectionId(`sec-${i + 1}`);
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

  const handleCopy = () => {
    const englishText = `FactFusion Hub - Terms and Conditions
Effective Date: September 1, 2026
Governing Law & Official Document

Welcome to our platform. By accessing or using this website, you agree to comply with and be bound by the following Terms and Conditions. Please read them carefully.

1. Acceptance of Terms
By visiting and using this platform, you acknowledge that you have read, understood, and agreed to these Terms and Conditions. If you do not agree with any part of these terms, you must not use this website.

2. General User Access & Services
- Public Access: General users may browse the website, view published content, explore listings, and submit applications or forms without creating an individual account or registering a personal profile.
- Form Submissions: All information submitted through application forms or interactive features must be accurate, truthful, and complete. Providing misleading or fraudulent information is strictly prohibited.

3. Administrative & School Access
- Administrative Rights: System administrators and authorized school staff retain restricted management access to oversee site operations, process applications, update information, and manage site features.
- Unrestricted Management: Administrative access is managed through secure internal authorizations to ensure site stability, security, and updates. Users acknowledge that authorized school personnel have full authority to modify content, review submissions, and manage site data.

4. Prohibited Activities
Users agree not to:
- Use any automated system, bot, or scraping tool to extract data from this platform.
- Submit fake, malicious, or spam applications through the portal.
- Attempt to gain unauthorized access to administrative controls, servers, or underlying databases.
- Perform any action that disrupts or interferes with the performance, security, or proper functionality of the website.

5. Intellectual Property
All content, designs, graphics, branding, text, and software code on this platform are the property of the site owner/institution and are protected by copyright and intellectual property laws. Unauthorized copying, distribution, or reproduction is strictly prohibited.

6. Limitation of Liability
- The platform is provided on an "As Is" and "As Available" basis without warranties of any kind.
- We do not guarantee continuous, uninterrupted, or secure access to the website.
- We shall not be held liable for any loss or damage arising from system outages, technical failures, or inaccurate user-submitted data.

7. Privacy & Data Handling
Information collected through public forms and applications is handled in accordance with our Privacy Policy and is used strictly for administrative, processing, and operational purposes by authorized personnel.

8. Amendments to Terms
We reserve the right to update or modify these Terms and Conditions at any time without prior notice. Continued use of the platform following any changes constitutes your acceptance of the revised terms.

9. Contact Information
If you have any questions or concerns regarding these Terms and Conditions, please reach out through the official contact channels provided on this website.`;

    const nepaliText = `FactFusion Hub - नियम तथा शर्तहरू (Terms and Conditions)
लागु हुने मिति: सेप्टेम्बर १, २०२६
आधिकारिक कानूनी दस्तावेज

हाम्रो प्लेटफर्ममा स्वागत छ। यो वेबसाइट प्रयोग वा पहुँच गरेर, तपाईं निम्न नियम तथा शर्तहरूको पालना गर्न र यसबाट बाँधिन सहमत हुनुहुन्छ। कृपया यसलाई ध्यानपूर्वक पढ्नुहोस्।

१. शर्तहरूको स्वीकृति (Acceptance of Terms)
यस प्लेटफर्मको भ्रमण र प्रयोग गरेर, तपाईंले यी नियम तथा शर्तहरू पढ्नुभएको, बुझ्नुभएको र स्वीकार गर्नुभएको स्वीकार गर्नुहुन्छ। यदि तपाईं यी शर्तहरूको कुनै पनि भागसँग सहमत हुनुहुन्न भने, तपाईंले यो वेबसाइट प्रयोग गर्नु हुँदैन।

२. सामान्य प्रयोगकर्ता पहुँच र सेवाहरू (General User Access & Services)
- सार्वजनिक पहुँच: सामान्य प्रयोगकर्ताहरूले व्यक्तिगत खाता सिर्जना नगरी वा व्यक्तिगत प्रोफाइल दर्ता नगरी वेबसाइट ब्राउज गर्न, प्रकाशित सामग्रीहरू हेर्न, सूचीहरू अवलोकन गर्न र आवेदन वा फारमहरू बुझाउन सक्नुहुनेछ।
- फारम बुझाउने कार्य: आवेदन फारम वा अन्तरक्रियात्मक सुविधाहरू मार्फत बुझाइएका सबै जानकारीहरू सही, सत्य र पूर्ण हुनुपर्छ। भ्रामक वा कपटपूर्ण जानकारी प्रदान गर्न कडा प्रतिबन्ध लगाइएको छ।

३. प्रशासनिक र विद्यालय पहुँच (Administrative & School Access)
- प्रशासनिक अधिकार: प्रणाली प्रशासकहरू र अधिकृत विद्यालय कर्मचारीहरूले साइट सञ्चालनको रेखदेख गर्न, आवेदनहरू प्रशोधन गर्न, जानकारी अद्यावधिक गर्न र साइटका सुविधाहरू व्यवस्थापन गर्न सीमित व्यवस्थापकीय पहुँच राख्छन्।
- अप्रतिबन्धित व्यवस्थापन: साइटको स्थिरता, सुरक्षा र अद्यावधिकहरू सुनिश्चित गर्न सुरक्षित आन्तरिक अधिकार मार्फत प्रशासनिक पहुँच व्यवस्थापन गरिन्छ। प्रयोगकर्ताहरूले स्वीकार गर्छन् कि अधिकृत विद्यालयका कर्मचारीहरूसँग सामग्री परिमार्जन गर्ने, बुझाइएका आवेदनहरूको समीक्षा गर्ने र साइटको डेटा व्यवस्थापन गर्ने पूर्ण अधिकार छ।

४. निषेधित गतिविधिहरू (Prohibited Activities)
प्रयोगकर्ताहरू निम्न कार्य नगर्न सहमत हुन्छन्:
- यस प्लेटफर्मबाट डेटा निकाल्न कुनै पनि स्वचालित प्रणाली, बोट (bot), वा स्क्र्यापिङ टूल प्रयोग गर्ने।
- पोर्टल मार्फत नक्कली, द्वेषपूर्ण, वा स्प्याम आवेदनहरू बुझाउने।
- प्रशासनिक नियन्त्रण, सर्भर, वा भित्री डेटाबेसमा अनधिकृत पहुँच प्राप्त गर्ने प्रयास गर्ने।
- वेबसाइटको कार्यसम्पादन, सुरक्षा, वा उचित कार्यक्षमतामा बाधा पुर्याउने वा हस्तक्षेप गर्ने कुनै पनि कार्य गर्ने।

५. बौद्धिक सम्पत्ति (Intellectual Property)
यस प्लेटफर्ममा रहेका सबै सामग्री, डिजाइन, ग्राफिक्स, ब्राण्डिङ, पाठ (text), र सफ्टवेयर कोडहरू साइट धनी/संस्थाको सम्पत्ति हुन् र प्रतिलिपि अधिकार (copyright) तथा बौद्धिक सम्पत्ति कानूनद्वारा सुरक्षित छन्। अनधिकृत प्रतिलिपि, वितरण, वा पुनरुत्पादन गर्न कडा मनाही छ।

६. दायित्वको सीमा (Limitation of Liability)
- यो प्लेटफर्म "जस्तो छ" (As Is) र "उपलब्ध भएसम्म" (As Available) को आधारमा कुनै पनि प्रकारको ग्यारेन्टी बिना प्रदान गरिएको छ।
- हामी वेबसाइटमा निरन्तर, बिना अवरोध, वा सुरक्षित पहुँचको ग्यारेन्टी दिँदैनौं।
- प्रणाली बन्द भएको (system outages), प्राविधिक त्रुटिहरू, वा प्रयोगकर्ताद्वारा बुझाइएका असत्य डेटाबाट हुने कुनै पनि नोक्सानी वा क्षतिको लागि हामी जिम्मेवार हुने छैनौं।

७. गोपनीयता र डेटा व्यवस्थापन (Privacy & Data Handling)
सार्वजनिक फारम र आवेदनहरू मार्फत सङ्कलन गरिएका जानकारीहरू हाम्रो गोपनीयता नीति (Privacy Policy) अनुसार व्यवस्थापन गरिन्छ र अधिकृत कर्मचारीहरूद्वारा केवल प्रशासनिक, प्रशोधन र सञ्चालन प्रयोजनका लागि मात्र प्रयोग गरिन्छ।

८. शर्तहरूमा संशोधन (Amendments to Terms)
हामीसँग पूर्व सूचना बिना कुनै पनि समयमा यी नियम तथा शर्तहरू अद्यावधिक वा परिमार्जन गर्ने अधिकार सुरक्षित छ। कुनै पनि परिवर्तन पछि प्लेटफर्मको निरन्तर प्रयोगले परिमार्जित शर्तहरूको स्वीकृतिलाई जनाउँछ।

९. सम्पर्क जानकारी (Contact Information)
यदि यी नियम तथा शर्तहरूको सम्बन्धमा तपाईंको कुनै प्रश्न वा जिज्ञासाहरू छन् भने, कृपया यस वेबसाइटमा प्रदान गरिएका आधिकारिक सम्पर्क माध्यमहरू मार्फत सम्पर्क गर्नुहोस्।`;

    navigator.clipboard.writeText(activeLang === "ne" ? nepaliText : englishText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  if (!isOpen) return null;

  const sectionsList = [
    {
      id: "sec-1",
      num: activeLang === "ne" ? "१" : "1",
      title: activeLang === "ne" ? "शर्तहरूको स्वीकृति" : "Acceptance of Terms",
      subtitle: activeLang === "ne" ? "Acceptance of Terms" : "Binding Agreement",
      icon: Scale,
      color: "emerald",
    },
    {
      id: "sec-2",
      num: activeLang === "ne" ? "२" : "2",
      title: activeLang === "ne" ? "सामान्य प्रयोगकर्ता पहुँच र सेवाहरू" : "General User Access & Services",
      subtitle: activeLang === "ne" ? "Public Access & Forms" : "Browsing & Submissions",
      icon: BookOpen,
      color: "blue",
    },
    {
      id: "sec-3",
      num: activeLang === "ne" ? "३" : "3",
      title: activeLang === "ne" ? "प्रशासनिक र विद्यालय पहुँच" : "Administrative & School Access",
      subtitle: activeLang === "ne" ? "Admin Rights & Operations" : "Staff Management",
      icon: Building2,
      color: "indigo",
    },
    {
      id: "sec-4",
      num: activeLang === "ne" ? "४" : "4",
      title: activeLang === "ne" ? "निषेधित गतिविधिहरू" : "Prohibited Activities",
      subtitle: activeLang === "ne" ? "Security & Bot Protection" : "Usage Restrictions",
      icon: ShieldAlert,
      color: "rose",
    },
    {
      id: "sec-5",
      num: activeLang === "ne" ? "५" : "5",
      title: activeLang === "ne" ? "बौद्धिक सम्पत्ति" : "Intellectual Property",
      subtitle: activeLang === "ne" ? "Copyright & Trademarks" : "Proprietary Rights",
      icon: Lock,
      color: "purple",
    },
    {
      id: "sec-6",
      num: activeLang === "ne" ? "६" : "6",
      title: activeLang === "ne" ? "दायित्वको सीमा" : "Limitation of Liability",
      subtitle: activeLang === "ne" ? "As-Is Disclaimer" : "Warranty Limitations",
      icon: Scale,
      color: "amber",
    },
    {
      id: "sec-7",
      num: activeLang === "ne" ? "७" : "7",
      title: activeLang === "ne" ? "गोपनीयता र डेटा व्यवस्थापन" : "Privacy & Data Handling",
      subtitle: activeLang === "ne" ? "Data Protection Compliance" : "Privacy Compliance",
      icon: ShieldCheck,
      color: "teal",
    },
    {
      id: "sec-8",
      num: activeLang === "ne" ? "८" : "8",
      title: activeLang === "ne" ? "शर्तहरूमा संशोधन" : "Amendments to Terms",
      subtitle: activeLang === "ne" ? "Policy Updates" : "Periodic Modifications",
      icon: Sparkles,
      color: "cyan",
    },
    {
      id: "sec-9",
      num: activeLang === "ne" ? "९" : "9",
      title: activeLang === "ne" ? "सम्पर्क जानकारी" : "Contact Information",
      subtitle: activeLang === "ne" ? "Official Channels" : "Support & Inquiries",
      icon: HelpCircle,
      color: "emerald",
    },
  ];

  const fontSizeClasses = {
    sm: "text-sm leading-relaxed",
    base: "text-base leading-relaxed md:leading-8",
    lg: "text-lg leading-loose md:leading-9",
  };

  return (
    <div
      id="terms-fullscreen-modal"
      className="fixed inset-0 w-screen h-screen z-[99999] bg-[#001c13] text-slate-900 flex flex-col overflow-hidden select-text"
      style={{ margin: 0, padding: 0 }}
    >
      {/* 1. ULTRA-PROFESSIONAL EXECUTIVE TOP NAVIGATION */}
      <header className="w-full bg-[#002B1D] text-white px-4 lg:px-8 py-3 flex items-center justify-between border-b border-emerald-800/80 shadow-lg shrink-0 z-30">
        {/* Left: Brand Identity & Title */}
        <div className="flex items-center gap-3 md:gap-4">
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="p-2 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 border border-emerald-700/50 transition cursor-pointer hidden lg:flex items-center justify-center"
            title={showSidebar ? "Collapse Sidebar" : "Expand Sidebar"}
          >
            <Menu className="w-4 h-4" />
          </button>

          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/30 to-emerald-400/10 text-emerald-300 flex items-center justify-center border border-emerald-400/30 shadow-inner shrink-0">
            <Scale className="w-5 h-5" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base md:text-lg font-bold tracking-tight text-white flex items-center gap-2">
                {activeLang === "ne" ? "नियम तथा शर्तहरू" : "Terms and Conditions"}
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2.5 py-0.5 rounded-full font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" /> {activeLang === "ne" ? "आधिकारिक नीति" : "Official Legal Agreement"}
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-emerald-300/80 font-medium">
              <span>FactFusion Hub</span>
              <span>&bull;</span>
              <span>{activeLang === "ne" ? "लागु मिति: सेप्टेम्बर १, २०२६" : "Effective: Sept 1, 2026"}</span>
            </div>
          </div>
        </div>

        {/* Right: Executive Controls */}
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
            title="Copy Full Agreement Text"
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
            title="Print Terms"
          >
            <Printer className="w-3.5 h-3.5 text-emerald-300" />
            <span>{activeLang === "ne" ? "प्रिन्ट" : "Print"}</span>
          </button>

          {/* Close Fullscreen Button */}
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 hover:text-white border border-rose-400/40 text-xs font-bold transition cursor-pointer ml-1 shadow-xs"
            aria-label="Close Terms and Conditions"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">{activeLang === "ne" ? "बन्द गर्नुहोस्" : "Close (Esc)"}</span>
          </button>
        </div>
      </header>

      {/* Dynamic Progress Bar */}
      <div className="w-full bg-[#001710] h-1 shrink-0">
        <div
          className="bg-emerald-400 h-full transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* 2. MAIN HORIZONTAL QUICK NAVIGATION BAR (FOR EASY JUMPING ON ANY SCREEN) */}
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

      {/* 3. MAIN WORKSPACE */}
      <div className="flex-1 flex w-full h-full overflow-hidden bg-[#F4F7F5]">
        {/* OPTIONAL EXPANDABLE SIDEBAR (ON LARGE DESKTOPS) */}
        {showSidebar && (
          <aside className="hidden xl:flex w-72 bg-white border-r border-slate-200 flex-col shrink-0 h-full overflow-hidden shadow-xs">
            {/* Search Box */}
            <div className="p-3.5 border-b border-slate-100 bg-slate-50/70">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder={activeLang === "ne" ? "नियमहरू खोज्नुहोस्..." : "Search document..."}
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

            {/* Nav list */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1">
              <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {activeLang === "ne" ? "अनुक्रमणिका (Table of Contents)" : "Table of Contents"}
              </div>
              {sectionsList.map((sec) => {
                const Icon = sec.icon;
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

            {/* Compliance Note */}
            <div className="p-3 m-3 bg-emerald-950 text-white rounded-xl border border-emerald-800/80 shadow-xs shrink-0">
              <div className="flex items-center gap-1.5 mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs font-bold text-emerald-200">
                  {activeLang === "ne" ? "कानूनी मान्यता" : "Legal Framework"}
                </span>
              </div>
              <p className="text-[11px] text-emerald-300/80 leading-snug">
                {activeLang === "ne"
                  ? "नेपालको प्रचलित कानून तथा संस्थागत नियमावली बमोजिम लागु हुनेछ।"
                  : "Enforced in compliance with prevailing institutional guidelines & laws of Nepal."}
              </p>
            </div>
          </aside>
        )}

        {/* MAIN LUXURIOUS & SPACIOUS READING CANVAS (UNRESTRICTED FULL WIDTH) */}
        <main
          ref={contentRef}
          onScroll={handleScroll}
          className="flex-1 h-full overflow-y-auto px-4 sm:px-8 md:px-12 lg:px-16 xl:px-24 py-8 md:py-12 scroll-smooth"
        >
          <div className="max-w-5xl mx-auto space-y-8 pb-20">
            {/* HERO EXECUTIVE BANNER */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 md:p-10 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#002B1D] via-emerald-600 to-teal-500" />

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold mb-3">
                    <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{activeLang === "ne" ? "लागु हुने मिति: सेप्टेम्बर १, २०२६" : "Effective Date: September 1, 2026"}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#002B1D] tracking-tight">
                    {activeLang === "ne" ? "नियम तथा शर्तहरू (Terms and Conditions)" : "Terms and Conditions"}
                  </h2>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{activeLang === "ne" ? "~४ मिनेट पढ्ने समय" : "~4 min read"}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{activeLang === "ne" ? "संस्करण १.०" : "Version 1.0"}</span>
                  </div>
                </div>
              </div>

              {/* Document Overview Lead */}
              <div className="mt-6 p-5 rounded-2xl bg-gradient-to-br from-emerald-50/70 to-teal-50/40 border border-emerald-100/90 text-slate-800 font-medium text-sm md:text-base leading-relaxed">
                {activeLang === "ne" ? (
                  <p>
                    हाम्रो प्लेटफर्ममा स्वागत छ। यो वेबसाइट प्रयोग वा पहुँच गरेर, तपाईं निम्न नियम तथा शर्तहरूको पालना गर्न र यसबाट बाँधिन सहमत हुनुहुन्छ। कृपया यसलाई ध्यानपूर्वक पढ्नुहोस्।
                  </p>
                ) : (
                  <p>
                    Welcome to our platform. By accessing or using this website, you agree to comply with and be bound by the following Terms and Conditions. Please read them carefully.
                  </p>
                )}
              </div>
            </div>

            {/* SECTIONS BODY */}
            {activeLang === "ne" ? (
              /* ================== FULL NEPALI SECTIONS ================== */
              <div className="space-y-6">
                {/* 1 */}
                <section
                  id="sec-1"
                  className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xs transition hover:border-emerald-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-950 font-black text-xl flex items-center justify-center shrink-0 shadow-xs border border-emerald-200">
                      १
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <h3 className="text-xl md:text-2xl font-extrabold text-[#002B1D]">
                          शर्तहरूको स्वीकृति (Acceptance of Terms)
                        </h3>
                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                          धारा १
                        </span>
                      </div>
                      <p className={`text-slate-700 ${fontSizeClasses[fontSize]}`}>
                        यस प्लेटफर्मको भ्रमण र प्रयोग गरेर, तपाईंले यी नियम तथा शर्तहरू पढ्नुभएको, बुझ्नुभएको र स्वीकार गर्नुभएको स्वीकार गर्नुहुन्छ। यदि तपाईं यी शर्तहरूको कुनै पनि भागसँग सहमत हुनुहुन्न भने, तपाईंले यो वेबसाइट प्रयोग गर्नु हुँदैन।
                      </p>
                    </div>
                  </div>
                </section>

                {/* 2 */}
                <section
                  id="sec-2"
                  className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xs transition hover:border-emerald-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-950 font-black text-xl flex items-center justify-center shrink-0 shadow-xs border border-emerald-200">
                      २
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <h3 className="text-xl md:text-2xl font-extrabold text-[#002B1D]">
                          सामान्य प्रयोगकर्ता पहुँच र सेवाहरू (General User Access &amp; Services)
                        </h3>
                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                          धारा २
                        </span>
                      </div>
                      <div className={`space-y-4 text-slate-700 ${fontSizeClasses[fontSize]}`}>
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 mt-2 shrink-0" />
                          <div>
                            <strong className="text-slate-900 block mb-1">सार्वजनिक पहुँच (Public Access):</strong>
                            <span>सामान्य प्रयोगकर्ताहरूले व्यक्तिगत खाता सिर्जना नगरी वा व्यक्तिगत प्रोफाइल दर्ता नगरी वेबसाइट ब्राउज गर्न, प्रकाशित सामग्रीहरू हेर्न, सूचीहरू अवलोकन गर्न र आवेदन वा फारमहरू बुझाउन सक्नुहुनेछ।</span>
                          </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 mt-2 shrink-0" />
                          <div>
                            <strong className="text-slate-900 block mb-1">फारम बुझाउने कार्य (Form Submissions):</strong>
                            <span>आवेदन फारम वा अन्तरक्रियात्मक सुविधाहरू मार्फत बुझाइएका सबै जानकारीहरू सही, सत्य र पूर्ण हुनुपर्छ। भ्रामक वा कपटपूर्ण जानकारी प्रदान गर्न कडा प्रतिबन्ध लगाइएको छ।</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* 3 */}
                <section
                  id="sec-3"
                  className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xs transition hover:border-emerald-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-950 font-black text-xl flex items-center justify-center shrink-0 shadow-xs border border-emerald-200">
                      ३
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <h3 className="text-xl md:text-2xl font-extrabold text-[#002B1D]">
                          प्रशासनिक र विद्यालय पहुँच (Administrative &amp; School Access)
                        </h3>
                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                          धारा ३
                        </span>
                      </div>
                      <div className={`space-y-4 text-slate-700 ${fontSizeClasses[fontSize]}`}>
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 mt-2 shrink-0" />
                          <div>
                            <strong className="text-slate-900 block mb-1">प्रशासनिक अधिकार (Administrative Rights):</strong>
                            <span>प्रणाली प्रशासकहरू र अधिकृत विद्यालय कर्मचारीहरूले साइट सञ्चालनको रेखदेख गर्न, आवेदनहरू प्रशोधन गर्न, जानकारी अद्यावधिक गर्न र साइटका सुविधाहरू व्यवस्थापन गर्न सीमित व्यवस्थापकीय पहुँच राख्छन्।</span>
                          </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 mt-2 shrink-0" />
                          <div>
                            <strong className="text-slate-900 block mb-1">अप्रतिबन्धित व्यवस्थापन (Unrestricted Management):</strong>
                            <span>साइटको स्थिरता, सुरक्षा र अद्यावधिकहरू सुनिश्चित गर्न सुरक्षित आन्तरिक अधिकार मार्फत प्रशासनिक पहुँच व्यवस्थापन गरिन्छ। प्रयोगकर्ताहरूले स्वीकार गर्छन् कि अधिकृत विद्यालयका कर्मचारीहरूसँग सामग्री परिमार्जन गर्ने, बुझाइएका आवेदनहरूको समीक्षा गर्ने र साइटको डेटा व्यवस्थापन गर्ने पूर्ण अधिकार छ।</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* 4 */}
                <section
                  id="sec-4"
                  className="bg-white border-2 border-rose-200 rounded-3xl p-6 md:p-8 shadow-xs relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-2 h-full bg-rose-600" />
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-950 font-black text-xl flex items-center justify-center shrink-0 shadow-xs border border-rose-200">
                      ४
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <h3 className="text-xl md:text-2xl font-extrabold text-rose-950 flex items-center gap-2">
                          <ShieldAlert className="w-5 h-5 text-rose-600" />
                          निषेधित गतिविधिहरू (Prohibited Activities)
                        </h3>
                        <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">
                          कडा प्रतिबन्धित
                        </span>
                      </div>
                      <p className="text-slate-800 font-bold text-sm md:text-base">
                        प्रयोगकर्ताहरू निम्न कार्य नगर्न पूर्ण रूपमा सहमत हुन्छन्:
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                        <div className="p-3.5 bg-rose-50/70 border border-rose-100 rounded-xl flex items-start gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-rose-200 text-rose-800 text-xs font-black flex items-center justify-center shrink-0 mt-0.5">&times;</span>
                          <span className="text-xs md:text-sm text-slate-800 font-medium">यस प्लेटफर्मबाट डेटा निकाल्न कुनै पनि स्वचालित प्रणाली, बोट (bot), वा स्क्र्यापिङ टूल प्रयोग गर्ने।</span>
                        </div>
                        <div className="p-3.5 bg-rose-50/70 border border-rose-100 rounded-xl flex items-start gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-rose-200 text-rose-800 text-xs font-black flex items-center justify-center shrink-0 mt-0.5">&times;</span>
                          <span className="text-xs md:text-sm text-slate-800 font-medium">पोर्टल मार्फत नक्कली, द्वेषपूर्ण, वा स्प्याम आवेदनहरू बुझाउने।</span>
                        </div>
                        <div className="p-3.5 bg-rose-50/70 border border-rose-100 rounded-xl flex items-start gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-rose-200 text-rose-800 text-xs font-black flex items-center justify-center shrink-0 mt-0.5">&times;</span>
                          <span className="text-xs md:text-sm text-slate-800 font-medium">प्रशासनिक नियन्त्रण, सर्भर, वा भित्री डेटाबेसमा अनधिकृत पहुँच प्राप्त गर्ने प्रयास गर्ने।</span>
                        </div>
                        <div className="p-3.5 bg-rose-50/70 border border-rose-100 rounded-xl flex items-start gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-rose-200 text-rose-800 text-xs font-black flex items-center justify-center shrink-0 mt-0.5">&times;</span>
                          <span className="text-xs md:text-sm text-slate-800 font-medium">वेबसाइटको कार्यसम्पादन, सुरक्षा, वा उचित कार्यक्षमतामा बाधा पुर्याउने वा हस्तक्षेप गर्ने कुनै पनि कार्य गर्ने।</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* 5 */}
                <section
                  id="sec-5"
                  className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xs transition hover:border-emerald-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-950 font-black text-xl flex items-center justify-center shrink-0 shadow-xs border border-emerald-200">
                      ५
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <h3 className="text-xl md:text-2xl font-extrabold text-[#002B1D]">
                          बौद्धिक सम्पत्ति (Intellectual Property)
                        </h3>
                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                          धारा ५
                        </span>
                      </div>
                      <p className={`text-slate-700 ${fontSizeClasses[fontSize]}`}>
                        यस प्लेटफर्ममा रहेका सबै सामग्री, डिजाइन, ग्राफिक्स, ब्राण्डिङ, पाठ (text), र सफ्टवेयर कोडहरू साइट धनी/संस्थाको सम्पत्ति हुन् र प्रतिलिपि अधिकार (copyright) तथा बौद्धिक सम्पत्ति कानूनद्वारा सुरक्षित छन्। अनधिकृत प्रतिलिपि, वितरण, वा पुनरुत्पादन गर्न कडा मनाही छ।
                      </p>
                    </div>
                  </div>
                </section>

                {/* 6 */}
                <section
                  id="sec-6"
                  className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xs transition hover:border-emerald-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-950 font-black text-xl flex items-center justify-center shrink-0 shadow-xs border border-emerald-200">
                      ६
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <h3 className="text-xl md:text-2xl font-extrabold text-[#002B1D]">
                          दायित्वको सीमा (Limitation of Liability)
                        </h3>
                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                          धारा ६
                        </span>
                      </div>
                      <div className={`space-y-3 text-slate-700 ${fontSizeClasses[fontSize]}`}>
                        <div className="flex items-start gap-3">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 mt-2.5 shrink-0" />
                          <span>यो प्लेटफर्म &quot;जस्तो छ&quot; (As Is) र &quot;उपलब्ध भएसम्म&quot; (As Available) को आधारमा कुनै पनि प्रकारको ग्यारेन्टी बिना प्रदान गरिएको छ।</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 mt-2.5 shrink-0" />
                          <span>हामी वेबसाइटमा निरन्तर, बिना अवरोध, वा सुरक्षित पहुँचको ग्यारेन्टी दिँदैनौं।</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 mt-2.5 shrink-0" />
                          <span>प्रणाली बन्द भएको (system outages), प्राविधिक त्रुटिहरू, वा प्रयोगकर्ताद्वारा बुझाइएका असत्य डेटाबाट हुने कुनै पनि नोक्सानी वा क्षतिको लागि हामी जिम्मेवार हुने छैनौं।</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* 7 */}
                <section
                  id="sec-7"
                  className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xs transition hover:border-emerald-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-950 font-black text-xl flex items-center justify-center shrink-0 shadow-xs border border-emerald-200">
                      ७
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <h3 className="text-xl md:text-2xl font-extrabold text-[#002B1D]">
                          गोपनीयता र डेटा व्यवस्थापन (Privacy &amp; Data Handling)
                        </h3>
                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                          धारा ७
                        </span>
                      </div>
                      <p className={`text-slate-700 ${fontSizeClasses[fontSize]}`}>
                        सार्वजनिक फारम र आवेदनहरू मार्फत सङ्कलन गरिएका जानकारीहरू हाम्रो गोपनीयता नीति (Privacy Policy) अनुसार व्यवस्थापन गरिन्छ र अधिकृत कर्मचारीहरूद्वारा केवल प्रशासनिक, प्रशोधन र सञ्चालन प्रयोजनका लागि मात्र प्रयोग गरिन्छ।
                      </p>
                    </div>
                  </div>
                </section>

                {/* 8 */}
                <section
                  id="sec-8"
                  className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xs transition hover:border-emerald-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-950 font-black text-xl flex items-center justify-center shrink-0 shadow-xs border border-emerald-200">
                      ८
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <h3 className="text-xl md:text-2xl font-extrabold text-[#002B1D]">
                          शर्तहरूमा संशोधन (Amendments to Terms)
                        </h3>
                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                          धारा ८
                        </span>
                      </div>
                      <p className={`text-slate-700 ${fontSizeClasses[fontSize]}`}>
                        हामीसँग पूर्व सूचना बिना कुनै पनि समयमा यी नियम तथा शर्तहरू अद्यावधिक वा परिमार्जन गर्ने अधिकार सुरक्षित छ। कुनै पनि परिवर्तन पछि प्लेटफर्मको निरन्तर प्रयोगले परिमार्जित शर्तहरूको स्वीकृतिलाई जनाउँछ।
                      </p>
                    </div>
                  </div>
                </section>

                {/* 9 */}
                <section
                  id="sec-9"
                  className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xs transition hover:border-emerald-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-950 font-black text-xl flex items-center justify-center shrink-0 shadow-xs border border-emerald-200">
                      ९
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <h3 className="text-xl md:text-2xl font-extrabold text-[#002B1D]">
                          सम्पर्क जानकारी (Contact Information)
                        </h3>
                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                          धारा ९
                        </span>
                      </div>
                      <p className={`text-slate-700 ${fontSizeClasses[fontSize]}`}>
                        यदि यी नियम तथा शर्तहरूको सम्बन्धमा तपाईंको कुनै प्रश्न वा जिज्ञासाहरू छन् भने, कृपया यस वेबसाइटमा प्रदान गरिएका आधिकारिक सम्पर्क माध्यमहरू मार्फत सम्पर्क गर्नुहोस्।
                      </p>
                    </div>
                  </div>
                </section>
              </div>
            ) : (
              /* ================== FULL ENGLISH SECTIONS ================== */
              <div className="space-y-6">
                {/* 1 */}
                <section
                  id="sec-1"
                  className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xs transition hover:border-emerald-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-950 font-black text-xl flex items-center justify-center shrink-0 shadow-xs border border-emerald-200">
                      1
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <h3 className="text-xl md:text-2xl font-extrabold text-[#002B1D]">
                          Acceptance of Terms
                        </h3>
                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                          Section 1
                        </span>
                      </div>
                      <p className={`text-slate-700 ${fontSizeClasses[fontSize]}`}>
                        By visiting and using this platform, you acknowledge that you have read, understood, and agreed to these Terms and Conditions. If you do not agree with any part of these terms, you must not use this website.
                      </p>
                    </div>
                  </div>
                </section>

                {/* 2 */}
                <section
                  id="sec-2"
                  className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xs transition hover:border-emerald-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-950 font-black text-xl flex items-center justify-center shrink-0 shadow-xs border border-emerald-200">
                      2
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <h3 className="text-xl md:text-2xl font-extrabold text-[#002B1D]">
                          General User Access &amp; Services
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
                            <span>General users may browse the website, view published content, explore listings, and submit applications or forms without creating an individual account or registering a personal profile.</span>
                          </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 mt-2 shrink-0" />
                          <div>
                            <strong className="text-slate-900 block mb-1">Form Submissions:</strong>
                            <span>All information submitted through application forms or interactive features must be accurate, truthful, and complete. Providing misleading or fraudulent information is strictly prohibited.</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* 3 */}
                <section
                  id="sec-3"
                  className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xs transition hover:border-emerald-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-950 font-black text-xl flex items-center justify-center shrink-0 shadow-xs border border-emerald-200">
                      3
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <h3 className="text-xl md:text-2xl font-extrabold text-[#002B1D]">
                          Administrative &amp; School Access
                        </h3>
                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                          Section 3
                        </span>
                      </div>
                      <div className={`space-y-4 text-slate-700 ${fontSizeClasses[fontSize]}`}>
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 mt-2 shrink-0" />
                          <div>
                            <strong className="text-slate-900 block mb-1">Administrative Rights:</strong>
                            <span>System administrators and authorized school staff retain restricted management access to oversee site operations, process applications, update information, and manage site features.</span>
                          </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 mt-2 shrink-0" />
                          <div>
                            <strong className="text-slate-900 block mb-1">Unrestricted Management:</strong>
                            <span>Administrative access is managed through secure internal authorizations to ensure site stability, security, and updates. Users acknowledge that authorized school personnel have full authority to modify content, review submissions, and manage site data.</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* 4 */}
                <section
                  id="sec-4"
                  className="bg-white border-2 border-rose-200 rounded-3xl p-6 md:p-8 shadow-xs relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-2 h-full bg-rose-600" />
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-950 font-black text-xl flex items-center justify-center shrink-0 shadow-xs border border-rose-200">
                      4
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <h3 className="text-xl md:text-2xl font-extrabold text-rose-950 flex items-center gap-2">
                          <ShieldAlert className="w-5 h-5 text-rose-600" />
                          Prohibited Activities
                        </h3>
                        <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">
                          Zero Tolerance Policy
                        </span>
                      </div>
                      <p className="text-slate-800 font-bold text-sm md:text-base">
                        Users strictly agree not to:
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                        <div className="p-3.5 bg-rose-50/70 border border-rose-100 rounded-xl flex items-start gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-rose-200 text-rose-800 text-xs font-black flex items-center justify-center shrink-0 mt-0.5">&times;</span>
                          <span className="text-xs md:text-sm text-slate-800 font-medium">Use any automated system, bot, or scraping tool to extract data from this platform.</span>
                        </div>
                        <div className="p-3.5 bg-rose-50/70 border border-rose-100 rounded-xl flex items-start gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-rose-200 text-rose-800 text-xs font-black flex items-center justify-center shrink-0 mt-0.5">&times;</span>
                          <span className="text-xs md:text-sm text-slate-800 font-medium">Submit fake, malicious, or spam applications through the portal.</span>
                        </div>
                        <div className="p-3.5 bg-rose-50/70 border border-rose-100 rounded-xl flex items-start gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-rose-200 text-rose-800 text-xs font-black flex items-center justify-center shrink-0 mt-0.5">&times;</span>
                          <span className="text-xs md:text-sm text-slate-800 font-medium">Attempt to gain unauthorized access to administrative controls, servers, or underlying databases.</span>
                        </div>
                        <div className="p-3.5 bg-rose-50/70 border border-rose-100 rounded-xl flex items-start gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-rose-200 text-rose-800 text-xs font-black flex items-center justify-center shrink-0 mt-0.5">&times;</span>
                          <span className="text-xs md:text-sm text-slate-800 font-medium">Perform any action that disrupts or interferes with the performance, security, or proper functionality of the website.</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* 5 */}
                <section
                  id="sec-5"
                  className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xs transition hover:border-emerald-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-950 font-black text-xl flex items-center justify-center shrink-0 shadow-xs border border-emerald-200">
                      5
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <h3 className="text-xl md:text-2xl font-extrabold text-[#002B1D]">
                          Intellectual Property
                        </h3>
                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                          Section 5
                        </span>
                      </div>
                      <p className={`text-slate-700 ${fontSizeClasses[fontSize]}`}>
                        All content, designs, graphics, branding, text, and software code on this platform are the property of the site owner/institution and are protected by copyright and intellectual property laws. Unauthorized copying, distribution, or reproduction is strictly prohibited.
                      </p>
                    </div>
                  </div>
                </section>

                {/* 6 */}
                <section
                  id="sec-6"
                  className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xs transition hover:border-emerald-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-950 font-black text-xl flex items-center justify-center shrink-0 shadow-xs border border-emerald-200">
                      6
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <h3 className="text-xl md:text-2xl font-extrabold text-[#002B1D]">
                          Limitation of Liability
                        </h3>
                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                          Section 6
                        </span>
                      </div>
                      <div className={`space-y-3 text-slate-700 ${fontSizeClasses[fontSize]}`}>
                        <div className="flex items-start gap-3">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 mt-2.5 shrink-0" />
                          <span>The platform is provided on an &quot;As Is&quot; and &quot;As Available&quot; basis without warranties of any kind.</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 mt-2.5 shrink-0" />
                          <span>We do not guarantee continuous, uninterrupted, or secure access to the website.</span>
                        </div>
                        <div className="flex items-start gap-3">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 mt-2.5 shrink-0" />
                          <span>We shall not be held liable for any loss or damage arising from system outages, technical failures, or inaccurate user-submitted data.</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* 7 */}
                <section
                  id="sec-7"
                  className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xs transition hover:border-emerald-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-950 font-black text-xl flex items-center justify-center shrink-0 shadow-xs border border-emerald-200">
                      7
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <h3 className="text-xl md:text-2xl font-extrabold text-[#002B1D]">
                          Privacy &amp; Data Handling
                        </h3>
                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                          Section 7
                        </span>
                      </div>
                      <p className={`text-slate-700 ${fontSizeClasses[fontSize]}`}>
                        Information collected through public forms and applications is handled in accordance with our Privacy Policy and is used strictly for administrative, processing, and operational purposes by authorized personnel.
                      </p>
                    </div>
                  </div>
                </section>

                {/* 8 */}
                <section
                  id="sec-8"
                  className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xs transition hover:border-emerald-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-950 font-black text-xl flex items-center justify-center shrink-0 shadow-xs border border-emerald-200">
                      8
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <h3 className="text-xl md:text-2xl font-extrabold text-[#002B1D]">
                          Amendments to Terms
                        </h3>
                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                          Section 8
                        </span>
                      </div>
                      <p className={`text-slate-700 ${fontSizeClasses[fontSize]}`}>
                        We reserve the right to update or modify these Terms and Conditions at any time without prior notice. Continued use of the platform following any changes constitutes your acceptance of the revised terms.
                      </p>
                    </div>
                  </div>
                </section>

                {/* 9 */}
                <section
                  id="sec-9"
                  className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xs transition hover:border-emerald-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-950 font-black text-xl flex items-center justify-center shrink-0 shadow-xs border border-emerald-200">
                      9
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <h3 className="text-xl md:text-2xl font-extrabold text-[#002B1D]">
                          Contact Information
                        </h3>
                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                          Section 9
                        </span>
                      </div>
                      <p className={`text-slate-700 ${fontSizeClasses[fontSize]}`}>
                        If you have any questions or concerns regarding these Terms and Conditions, please reach out through the official contact channels provided on this website.
                      </p>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {/* DOCUMENT CONFIRMATION & RETURN CALLOUT */}
            <div className="bg-white border border-emerald-200 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-200">
                  <Check className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-slate-900">
                    {activeLang === "ne" ? "FactFusion Hub कानूनी सम्झौता" : "FactFusion Hub Institutional Policy"}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {activeLang === "ne"
                      ? "सबै अधिकार सुरक्षित © २०२६ FactFusion Hub।"
                      : "All Rights Reserved © 2026 FactFusion Hub."}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-7 py-3 bg-[#002B1D] hover:bg-emerald-950 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>{activeLang === "ne" ? "स्वीकार गरी बन्द गर्नुहोस् (Close)" : "I Agree & Return to Portal"}</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* 4. BOTTOM EXECUTIVE STATUS BAR */}
      <footer className="w-full bg-white border-t border-slate-200 px-4 lg:px-8 py-2.5 flex items-center justify-between shrink-0 z-20 shadow-xs">
        <div className="flex items-center gap-2.5 text-xs text-slate-600 font-medium">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="hidden sm:inline">
            {activeLang === "ne" ? "सक्रिय कानूनी दस्तावेज &bull; नेपाल सरकार र संस्थागत नियमावली" : "Official Legal Agreement &bull; FactFusion Hub Governance"}
          </span>
          <span className="sm:hidden font-bold text-emerald-800">
            {activeLang === "ne" ? "आधिकारिक नीति" : "Active Policy"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (contentRef.current) {
                contentRef.current.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            className="flex items-center gap-1 text-xs text-slate-700 hover:text-emerald-900 font-bold px-3 py-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
          >
            <ChevronUp className="w-4 h-4 text-emerald-700" />
            <span>{activeLang === "ne" ? "शीर्षमा जानुहोस्" : "Top"}</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#002B1D] hover:bg-emerald-950 text-white text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1.5 shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{activeLang === "ne" ? "पोर्टल" : "Return"}</span>
          </button>
        </div>
      </footer>
    </div>
  );
}
