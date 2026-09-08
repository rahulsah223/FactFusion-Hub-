import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Bot,
  Zap,
  Brain,
  Image as ImageIcon,
  MapPin,
  Search,
  Mail,
  Phone,
  Calendar,
  ArrowRight,
  UserCheck,
  Shield,
  GraduationCap,
  X,
  Menu,
  Megaphone,
  Bell,
  Ticket,
  AlertCircle,
  Volume2,
} from "lucide-react";
import { AIAssistantModal } from "./components/AIAssistantModal";
import { DashboardPortal } from "./components/DashboardPortal";
import { ModernAuthModal } from "./components/ModernAuthModal";
import { TermsModal } from "./components/TermsModal";
import { PolicyModal } from "./components/PolicyModal";
import { OfficialAdmissionFormModal } from "./components/OfficialAdmissionFormModal";
import { AdmitApplicationModal } from "./components/AdmitApplicationModal";
import { ConsolidatedEventsHub } from "./components/ConsolidatedEventsHub";
import { UnifiedDetailModal, DetailItem } from "./components/UnifiedDetailModal";
import { EventRSVPModal } from "./components/EventRSVPModal";
import { Notice, CampusEvent } from "./types";
import { formatLiveDateTime } from "./utils/nepaliDate";

// NEPALI DICTIONARY & CALENDAR TRANSLATION ENGINE
const translations = {
  en: {
    locText: "Nepal, Mahottari Gaushala",
    navHome: "Home",
    navPrograms: "Programs",
    navAdmissions: "Admissions",
    navCampus: "Campus Life",
    navAbout: "About Us",
    navContact: "Contact",
    applyNow: "Apply Now",
    exploreBtn: "Explore Programs →",
    tourBtn: "Play Campus Tour",
    s1Title: "Shaping Minds. Building Futures. Changing Lives.",
    s1Desc: "Join FactFusion Hub and be part of a global community of learners and leaders in Nepal, Mahottari.",
    s2Title: "Empowering Innovation & Academic Excellence.",
    s2Desc: "Equipping students with modern software tools, hands-on programming skills, and future-ready tech education.",
    s3Title: "World-Class Academic & Digital Resources.",
    s3Desc: "Unlocking potential through curated digital notes, extensive research tools, and collaborative learning hubs.",
    s4Title: "Practical Coding & Software Labs.",
    s4Desc: "Mastering modern algorithms, web application development, and mobile programming in interactive environments.",
    s5Title: "Interactive Classroom Collaborations.",
    s5Desc: "Fostering teamwork, innovative thinking, and peer-to-peer knowledge exchange across various streams.",
    s6Title: "Next-Gen Computer Science Curriculum.",
    s6Desc: "Preparing Class 11 & 12 students with solid NEB computer science foundations and real-world project skills.",
    s7Title: "Leadership & Public Speaking Skills.",
    s7Desc: "Developing essential soft skills, confidence, and community leadership for tomorrow’s pioneers.",
    s8Title: "Comprehensive Digital Study Hub.",
    s8Desc: "Access notes, online revision sheets, and solved solutions anywhere through integrated platforms.",
    s9Title: "Bridging Technology & Regional Growth.",
    s9Desc: "Bringing top-notch digital literacy and software solutions directly to the Mahottari community in Nepal.",
    s10Title: "Inspiring Content Creation & Media.",
    s10Desc: "Empowering students to share knowledge globally through FactFusion Hub educational video platforms.",
    st1Num: "12K+",
    st2Num: "15+",
    st3Num: "80+",
    st4Num: "98%",
    stat1: "Students Enrolled",
    stat2: "Expert Faculty",
    stat3: "Programs Offered",
    stat4: "Graduate Success",
    whyHeading: "Education That Empowers You For Life",
    whySub: "At FactFusion Hub, we combine academic excellence with practical learning to help you achieve your goals and make a meaningful impact.",
    w1Title: "Industry-Focused Programs",
    w1Desc: "Learn skills that are relevant, in-demand, and future-ready.",
    w2Title: "World-Class Faculty",
    w2Desc: "Study with experienced educators and thought leaders.",
    w3Title: "Global Opportunities",
    w3Desc: "Exchange programs, international partnerships, and more.",
    popTitle: "Popular Programs",
    popSub: "Explore our top-rated programs designed to shape your future.",
    viewProgLink: "View All Programs →",
    p1: "Business",
    p2: "Computer Science",
    p3: "Bio Sciences",
    p4: "Management",
    p5: "Hotel Management",
    campTitle: "Campus Life Beyond Classrooms",
    campDesc: "From clubs and events to sports and volunteering, life at FactFusion Hub is about learning, growing, and making unforgettable memories.",
    discBtn: "Discover More →",
    newsTitle: "News & Updates",
    newsSub: "Stay informed with the latest from FactFusion Hub.",
    viewNewsLink: "View All News →",
    readMore: "Read More →",
    n1Date: "May 12, 2025",
    n1Title: "FactFusion Hub Hosts Global Education Summit 2026",
    n2Date: "May 08, 2025",
    n2Title: "New Research Center for Innovation Launched",
    n3Date: "Apr 28, 2026",
    n3Title: "Students Win Awards at National Competition",
    testiTitle: "Student Success Stories",
    testiSub: "Hear from our students and alumni who are making an impact around the world.",
    viewTestiLink: "View All Stories →",
    t1Quote: `"Studying here gave me the confidence and practical coding skills to build real-world software applications."`,
    t2Quote: `"The dedicated professors and family environment at FactFusion Hub helped me realize my potential in technology."`,
    t3Quote: `"I am thankful to FactFusion Hub for providing great study resources and guidance for my academic career."`,
    evTitle: "Upcoming Events",
    evSub: "Join us for upcoming workshops and sessions.",
    e1Date: "22 MAY",
    e1Title: "Career Fair 2025",
    e1Desc: "Connect with top companies and explore career opportunities.",
    e2Date: "05 JUN",
    e2Title: "International Education Week",
    e2Desc: "Celebrating cultures and global learning experiences.",
    e3Date: "18 JUN",
    e3Title: "Alumni Networking Night",
    e3Desc: "Reconnect and expand your professional network.",
    qlTitle: "Quick Links",
    ql1: "Undergraduate Admissions",
    ql2: "Graduate Admissions",
    ql3: "Scholarships",
    ql4: "Financial Aid",
    ql5: "Academic Calendar",
    ql6: "Library Resources",
    ql7: "Student Portal",
    ql8: "Contact Us",
    ctaTitle: "Ready to Start Your Journey?",
    ctaSub: "Apply now and take the first step toward a brighter future with FactFusion Hub.",
    homeTitle: "A Campus That Feels Like Home",
    homeSub: "Our beautiful campus provides the perfect environment to learn, grow, and thrive.",
    c1: "Modern Classrooms & Labs",
    c2: "Vibrant Student Communities",
    c3: "Safe & Inclusive Environment",
    c4: "Top-Notch Facilities",
    vTourBtn: "Take a Virtual Tour →",
    newsSubTitle: "Stay Connected",
    newsSubDesc: "Subscribe to our newsletter for updates, events, and inspiring stories.",
    subBtn: "Subscribe",
    footTagline: "Empowering minds. Building futures. Changing lives. Join FactFusion Hub and become part of a legacy of excellence.",
    fCol1: "Explore",
    fCol2: "Resources",
    fCol3: "Contact Us",
    termsAndCond: "Terms & Conditions",
    privacyPolicy: "System Access Policy",
    systemPolicy: "System Access Policy",
  },
  ne: {
    locText: "नेपाल, महोत्तरी गौशाला",
    navHome: "गृहपृष्ठ",
    navPrograms: "कार्यक्रमहरू",
    navAdmissions: "भर्ना",
    navCampus: "क्याम्पस जीवन",
    navAbout: "हाम्रो बारेमा",
    navContact: "सम्पर्क",
    applyNow: "आवेदन दिनुहोस्",
    exploreBtn: "कार्यक्रमहरू हेर्नुहोस् →",
    tourBtn: "क्याम्पस भ्रमण हेर्नुहोस्",
    s1Title: "सोचलाई आकार। भविष्य निर्माण। जीवन परिवर्तन।",
    s1Desc: "FactFusion Hub मा सामेल भई नेपाल, महोत्तरीमा विद्यार्थी र नेताहरूको विश्वव्यापी समुदायको हिस्सा बन्नुहोस्।",
    s2Title: "नवाचार र शैक्षिक उत्कृष्टतालाई सशक्त बनाउँदै।",
    s2Desc: "विद्यार्थीहरूलाई आधुनिक सफ्टवेयर उपकरण, व्यावहारिक प्रोग्रामिङ सीप र प्रविधिसँग जोड्दै।",
    s3Title: "विश्वस्तरीय शैक्षिक र डिजिटल संसाधनहरू।",
    s3Desc: "डिजिटल नोट्स, अनुसन्धान उपकरण र सिकाइ केन्द्रहरूमार्फत क्षमता अभिवृद्धि।",
    s4Title: "व्यावहारिक कोडिङ र सफ्टवेयर ल्याबहरू।",
    s4Desc: "आधुनिक अल्गोरिदम, वेब अनुप्रयोग विकास र मोबाइल प्रोग्रामिङमा निपुणता।",
    s5Title: "इन्टरएक्टिभ कक्षाकोठा सहकार्य।",
    s5Desc: "विभिन्न सङ्कायहरूमा टिमवर्क, नवप्रवर्तनशील सोच र ज्ञानको आदानप्रदान।",
    s6Title: "नेक्स्ट-जेन कम्प्युटर साइन्स पाठ्यक्रम।",
    s6Desc: "कक्षा ११ र १२ का विद्यार्थीहरूलाई NEB कम्प्युटर साइन्सको बलियो जग बसाल्दै।",
    s7Title: "नेतृत्व र सार्वजनिक भाषण सीप।",
    s7Desc: "भोलिका अग्रगामीहरूका लागि आवश्यक सफ्ट स्किल्स, आत्मविश्वास र नेतृत्व विकास।",
    s8Title: "व्यापक डिजिटल अध्ययन केन्द्र।",
    s8Desc: "एकीकृत प्लेटफर्महरूमार्फत नोटहरू, अनलाइन पुनरावृत्ति पानाहरू र समाधानहरू पहुँच गर्नुहोस्।",
    s9Title: "प्रविधि र क्षेत्रीय विकासलाई जोड्दै।",
    s9Desc: "नेपालको महोत्तरी समुदायमा उत्कृष्ट डिजिटल साक्षरता र सफ्टवेयर समाधानहरू पुर्‍याउँदै।",
    s10Title: "प्रेरणादायी सामग्री सिर्जना र मिडिया।",
    s10Desc: "FactFusion Hub भिडियो प्लेटफर्महरूमार्फत विश्वव्यापी रूपमा ज्ञान साझा गर्न विद्यार्थीहरूलाई सशक्त बनाउँदै।",
    st1Num: "१२ हजार+",
    st2Num: "१५+",
    st3Num: "८०+",
    st4Num: "९८%",
    stat1: "भर्ना भएका विद्यार्थीहरू",
    stat2: "विशेषज्ञ शिक्षकहरू",
    stat3: "सञ्चालित कार्यक्रमहरू",
    stat4: "सफलता दर",
    whyHeading: "जीवनका लागि सशक्त बनाउने शिक्षा",
    whySub: "FactFusion Hub मा, हामी तपाईंलाई आफ्नो लक्ष्य हासिल गर्न र सार्थक प्रभाव पार्न मद्दत गर्न व्यावहारिक सिकाइसँग शैक्षिक उत्कृष्टता संयोजन गर्छौं।",
    w1Title: "उद्योग-केन्द्रित कार्यक्रमहरू",
    w1Desc: "प्रासंगिक, मागमा आधारित र भविष्यका लागि तयार सीपहरु सिक्नुहोस्।",
    w2Title: "विश्वस्तरीय शिक्षकहरू",
    w2Desc: "अनुभवी शिक्षकहरू र विचारशील नेताहरूसँग अध्ययन गर्नुहोस्।",
    w3Title: "विश्वव्यापी अवसरहरू",
    w3Desc: "आदानप्रदान कार्यक्रमहरू, अन्तर्राष्ट्रिय साझेदारीहरू र थप।",
    popTitle: "लोकप्रिय कार्यक्रमहरू",
    popSub: "तपाईंको भविष्यलाई आकार दिन डिजाइन गरिएका हाम्रा शीर्ष-रेटेड कार्यक्रमहरू हेर्नुहोस्।",
    viewProgLink: "सबै कार्यक्रमहरू हेर्नुहोस् →",
    p1: "व्यापार र व्यवस्थापन",
    p2: "कम्प्युटर साइन्स",
    p3: "बायो साइन्स",
    p4: "व्यवस्थापन",
    p5: "होटल व्यवस्थापन",
    campTitle: "कक्षाकोठा बाहिरको क्याम्पस जीवन",
    campDesc: "क्लब र कार्यक्रमहरू देखि खेलकुद र स्वयंसेवा सम्म, FactFusion Hub को जीवन भनेको सिक्ने, हुर्कने र अविस्मरणीय यादहरू बनाउने बारे हो।",
    discBtn: "थप खोज्नुहोस् →",
    newsTitle: "समाचार र अपडेटहरू",
    newsSub: "FactFusion Hub बाट नवीनतम समाचारहरूसँग सूचित रहनुहोस्।",
    viewNewsLink: "सबै समाचारहरू हेर्नुहोस् →",
    readMore: "थप पढ्नुहोस् →",
    n1Date: "वैशाख २९, २०८२",
    n1Title: "FactFusion Hub द्वारा विश्वव्यापी शिक्षा सम्मेलन २०८३ आयोजना",
    n2Date: "वैशाख २५, २०८२",
    n2Title: "नवाचारका लागि नयाँ अनुसन्धान केन्द्रको शुभारम्भ",
    n3Date: "वैशाख १५, २०८३",
    n3Title: "राष्ट्रिय प्रतियोगितामा विद्यार्थीहरूले जिते पुरस्कार",
    testiTitle: "विद्यार्थी सफलताका कथाहरू",
    testiSub: "विश्वभर प्रभाव पारिरहेका हाम्रा विद्यार्थीहरू र पूर्व विद्यार्थीहरूबाट सुन्नुहोस्।",
    viewTestiLink: "सबै कथाहरू हेर्नुहोस् →",
    t1Quote: `"यहाँ अध्ययन गर्नाले मलाई वास्तविक सफ्टवेयर अनुप्रयोगहरू निर्माण गर्न आत्मविश्वास र व्यावहारिक कोडिङ सीपहरू प्राप्त भयो।"`,
    t2Quote: `"FactFusion Hub का समर्पित प्राध्यापकहरू र पारिवारिक वातावरणले मलाई प्रविधिमा मेरो सम्भावना महसुस गर्न मद्दत गर्यो।"`,
    t3Quote: `"मेरो शैक्षिक करियरका लागि उत्कृष्ट अध्ययन सामग्री र मार्गदर्शन प्रदान गरेकोमा म FactFusion Hub प्रति आभारी छु।"`,
    evTitle: "आगामी कार्यक्रमहरू",
    evSub: "आगामी कार्यशाला र सत्रहरूका लागि हामीसँग जोडिनुहोस्।",
    e1Date: "०८ जेठ",
    e1Title: "करियर मेला २०८२",
    e1Desc: "शीर्ष कम्पनीहरूसँग जोडिनुहोस् र करियरका अवसरहरू खोज्नुहोस्।",
    e2Date: "२२ जेठ",
    e2Title: "अन्तर्राष्ट्रिय शिक्षा सप्ताह",
    e2Desc: "संस्कृति र विश्वव्यापी सिकाइ अनुभवहरूको उत्सव मनाउँदै।",
    e3Date: "०४ असार",
    e3Title: "पूर्व विद्यार्थी नेटवर्किङ साँझ",
    e3Desc: "पुनः जोडिनुहोस् र आफ्नो व्यावसायिक नेटवर्क विस्तार गर्नुहोस्।",
    qlTitle: "द्रुत लिङ्कहरू",
    ql1: "स्नातक भर्ना",
    ql2: "स्नातकोत्तर भर्ना",
    ql3: "छात्रवृत्ति",
    ql4: "वित्तीय सहायता",
    ql5: "शैक्षिक क्यालेन्डर",
    ql6: "पुस्तकालय संसाधनहरू",
    ql7: "विद्यार्थी पोर्टल",
    ql8: "हामीलाई सम्पर्क गर्नुहोस्",
    ctaTitle: "तपाईंको यात्रा सुरु गर्न तयार हुनुहुन्छ?",
    ctaSub: "अहिले नै आवेदन दिनुहोस् र FactFusion Hub सँग उज्ज्वल भविष्यतर्फ पहिलो कदम चालनुहोस्।",
    homeTitle: "घर जस्तै महसुस हुने क्याम्पस",
    homeSub: "हाम्रो सुन्दर क्याम्पसले सिक्न, हुर्कन र फस्टाउनको लागि उत्तम वातावरण प्रदान गर्दछ।",
    c1: "आधुनिक कक्षाकोठा र प्रयोगशालाहरू",
    c2: "जीवन्त विद्यार्थी समुदायहरू",
    c3: "सुरक्षित र समावेशी वातावरण",
    c4: "उत्कृष्ट सुविधाहरू",
    vTourBtn: "भर्चुअल भ्रमण लिनुहोस् →",
    newsSubTitle: "जोडिएर रहनुहोस्",
    newsSubDesc: "अपडेटहरू, कार्यक्रमहरू र प्रेरणादायी कथाहरूको लागि हाम्रो न्यूजलेटरमा सदस्यता लिनुहोस्।",
    subBtn: "सदस्यता लिनुहोस्",
    footTagline: "सोचलाई सशक्त बनाउँदै। भविष्य निर्माण। जीवन परिवर्तन। FactFusion Hub मा सामेल हुनुहोस् र उत्कृष्टताको हिस्सा बन्नुहोस्।",
    fCol1: "खोज्नुहोस्",
    fCol2: "संसाधनहरू",
    fCol3: "सम्पर्क गर्नुहोस्",
    termsAndCond: "नियम तथा शर्तहरू",
    privacyPolicy: "प्रणाली पहुँच नीति",
    systemPolicy: "प्रणाली पहुँच नीति",
  },
};

export default function App() {
  const [currentLang, setCurrentLang] = useState<"en" | "ne">("en");
  const [liveClock, setLiveClock] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);

  // Modals & Navigation state
  const [showNavDropdown, setShowNavDropdown] = useState(false);
  const navMenuRef = useRef<HTMLDivElement>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showFacultyModal, setShowFacultyModal] = useState(false);
  const [showAdmitModal, setShowAdmitModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showAISuite, setShowAISuite] = useState(false);
  const [aiSuiteInitialTab, setAiSuiteInitialTab] = useState<any>("fast");

  // Synchronized Notices & Events state
  const [notices, setNotices] = useState<Notice[]>([]);
  const [events, setEvents] = useState<CampusEvent[]>([]);
  const [selectedHubItemForDetail, setSelectedHubItemForDetail] = useState<DetailItem | null>(null);
  const [selectedEventForRSVP, setSelectedEventForRSVP] = useState<CampusEvent | null>(null);

  // Admission Form state
  const [showOfficialFormModal, setShowOfficialFormModal] = useState(false);
  const [officialFormInitialData, setOfficialFormInitialData] = useState<{
    fullName?: string;
    phone?: string;
    email?: string;
    grade?: string;
    faculty?: string;
  } | undefined>(undefined);
  const [appFullName, setAppFullName] = useState("");
  const [appPhone, setAppPhone] = useState("");
  const [appEmail, setAppEmail] = useState("");
  const [appClass, setAppClass] = useState("");
  const [appFaculty, setAppFaculty] = useState("");
  const [isSubmittingApp, setIsSubmittingApp] = useState(false);
  const [appSubmitSuccess, setAppSubmitSuccess] = useState<string | null>(null);
  const [appSubmitError, setAppSubmitError] = useState<string | null>(null);

  // Faculty Search state
  const [facultySearch, setFacultySearch] = useState("");

  const t = translations[currentLang];

  // Fetch notices & events from backend API with fallback
  const fetchLiveNoticesAndEvents = async () => {
    try {
      const [noticesRes, eventsRes] = await Promise.allSettled([
        fetch("/api/notices"),
        fetch("/api/events"),
      ]);

      if (noticesRes.status === "fulfilled" && noticesRes.value.ok) {
        const noticesData = await noticesRes.value.json();
        setNotices(noticesData);
      }
      if (eventsRes.status === "fulfilled" && eventsRes.value.ok) {
        const eventsData = await eventsRes.value.json();
        setEvents(eventsData);
      }
    } catch (err) {
      console.warn("Failed to synchronize notices & events from backend:", err);
    }
  };

  // Real-time synchronization: initial fetch, polling, and custom event listener
  useEffect(() => {
    fetchLiveNoticesAndEvents();

    const handleSync = () => {
      fetchLiveNoticesAndEvents();
    };

    window.addEventListener("factfusion_sync_update", handleSync);
    window.addEventListener("focus", handleSync);

    // Periodic sync poll every 10 seconds
    const syncInterval = setInterval(fetchLiveNoticesAndEvents, 10000);

    return () => {
      window.removeEventListener("factfusion_sync_update", handleSync);
      window.removeEventListener("focus", handleSync);
      clearInterval(syncInterval);
    };
  }, []);

  const slidesData = [
    {
      img: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1600&q=80",
      titleKey: "s1Title",
      descKey: "s1Desc",
      hasTour: true,
    },
    {
      img: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1600&q=80",
      titleKey: "s2Title",
      descKey: "s2Desc",
      hasTour: false,
    },
    {
      img: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1600&q=80",
      titleKey: "s3Title",
      descKey: "s3Desc",
      hasTour: false,
    },
    {
      img: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1600&q=80",
      titleKey: "s4Title",
      descKey: "s4Desc",
      hasTour: false,
    },
    {
      img: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1600&q=80",
      titleKey: "s5Title",
      descKey: "s5Desc",
      hasTour: false,
    },
    {
      img: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=1600&q=80",
      titleKey: "s6Title",
      descKey: "s6Desc",
      hasTour: false,
    },
    {
      img: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1600&q=80",
      titleKey: "s7Title",
      descKey: "s7Desc",
      hasTour: false,
    },
    {
      img: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1600&q=80",
      titleKey: "s8Title",
      descKey: "s8Desc",
      hasTour: false,
    },
    {
      img: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80",
      titleKey: "s9Title",
      descKey: "s9Desc",
      hasTour: false,
    },
    {
      img: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1600&q=80",
      titleKey: "s10Title",
      descKey: "s10Desc",
      hasTour: false,
    },
  ];

  // Clock - Dynamic English / Nepali Calendar Support
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLiveClock(formatLiveDateTime(now, currentLang));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [currentLang]);

  // Close nav dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navMenuRef.current && !navMenuRef.current.contains(event.target as Node)) {
        setShowNavDropdown(false);
      }
    };
    if (showNavDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNavDropdown]);

  // Carousel Autoplay
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slidesData.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [slidesData.length]);

  const toggleLanguage = () => {
    setCurrentLang((prev) => (prev === "en" ? "ne" : "en"));
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowLoginModal(false);
    setShowDashboard(true);
  };

  const handleAdmissionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAppSubmitError(null);
    setAppSubmitSuccess(null);

    // Form Field Validations
    if (!appFullName.trim() || appFullName.trim().length < 2) {
      setAppSubmitError("Please enter your full legal name.");
      return;
    }

    const phoneDigits = appPhone.replace(/[^0-9]/g, "");
    if (phoneDigits.length < 7) {
      setAppSubmitError("Please enter a valid phone number (at least 7 digits).");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(appEmail.trim())) {
      setAppSubmitError("Please enter a valid email address.");
      return;
    }

    if (!appClass) {
      setAppSubmitError("Please select a class or grade.");
      return;
    }

    setIsSubmittingApp(true);

    try {
      const res = await fetch("/api/pending-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: appFullName.trim(),
          phoneNumber: appPhone.trim(),
          emailAddress: appEmail.trim(),
          classGradeSelection: appClass,
          facultyStream: appFaculty,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setAppSubmitSuccess(
          `Application received! Reference ID: ${data.application.id}. An Admissions Officer will contact you at ${appPhone} for verification.`
        );

        // Dispatch sync event for real-time admin alert bell trigger
        window.dispatchEvent(new CustomEvent("factfusion_sync_update"));

        setTimeout(() => {
          setShowAdmitModal(false);
          setAppSubmitSuccess(null);
          setAppFullName("");
          setAppPhone("");
          setAppEmail("");
          setAppClass("");
          setAppFaculty("");
        }, 3000);
      } else {
        const errData = await res.json();
        setAppSubmitError(errData.error || "Failed to process application submission.");
      }
    } catch (err) {
      setAppSubmitError("Network error while submitting application. Please try again.");
    } finally {
      setIsSubmittingApp(false);
    }
  };

  const faculties = [
    {
      title: "Computer Science",
      desc: "C Programming, Web Tech, Database Systems, & AI Fundamentals under NEB.",
      badge: "Class 11 & 12",
      icon: "fa-laptop-code",
      tags: "computer science cs software programming web tech ai python",
    },
    {
      title: "Science Stream",
      desc: "Physics, Chemistry, Biology & High Mathematics for technical medical careers.",
      badge: "Class 11 & 12",
      icon: "fa-flask",
      tags: "science physics chemistry biology lab math medical engineering",
    },
    {
      title: "Management Stream",
      desc: "Accountancy, Business Studies, Economics, & Digital Marketing.",
      badge: "Class 11 & 12",
      icon: "fa-chart-line",
      tags: "management accounting finance business commerce economics",
    },
  ];

  const filteredFaculties = faculties.filter(
    (f) =>
      f.title.toLowerCase().includes(facultySearch.toLowerCase()) ||
      f.tags.toLowerCase().includes(facultySearch.toLowerCase()) ||
      f.desc.toLowerCase().includes(facultySearch.toLowerCase())
  );

  return (
    <div className="relative min-h-screen bg-white font-['Plus_Jakarta_Sans',sans-serif] text-[#1A1A1A]">
      {/* TOP INFORMATION BAR */}
      <div className="top-info-bar">
        <div className="top-info-left">
          <span>
            <i className="fa-solid fa-location-dot text-emerald-400"></i> <span>{t.locText}</span>
          </span>
          <a href="tel:+9779807695843" className="hover:text-emerald-300 transition inline-flex items-center gap-1.5 text-inherit no-underline">
            <i className="fa-solid fa-phone text-emerald-400"></i> <span>+977 9807695843</span>
          </a>
        </div>
        <div className="top-info-right flex items-center gap-4">
          <span className="live-clock-pill">
            <i className="fa-regular fa-calendar-days text-emerald-400"></i> <span>{liveClock || "Loading..."}</span>
          </span>
        </div>
      </div>

      {/* MAIN HEADER NAVIGATION */}
      <nav className="sticky top-0 z-50 bg-white shadow-sm flex items-center justify-between px-[6%] lg:px-[8%] py-3.5 border-b border-gray-100">
        <div className="nav-left-wrapper relative flex items-center gap-3" ref={navMenuRef}>
          <button
            className={`menu-toggle-btn ${showNavDropdown ? "active" : ""}`}
            onClick={() => setShowNavDropdown((prev) => !prev)}
            aria-label="Toggle navigation menu"
            title="Navigation Menu"
          >
            {showNavDropdown ? <i className="fa-solid fa-xmark"></i> : <i className="fa-solid fa-bars"></i>}
          </button>
          <a href="#home" className="logo">
            <div className="w-8 h-8 rounded-lg bg-[#002B1D] text-white flex items-center justify-center shadow-xs">
              <i className="fa-solid fa-graduation-cap text-base text-emerald-400"></i>
            </div>
            <span className="font-extrabold tracking-tight text-[#002B1D]">FactFusion <span className="text-emerald-600 font-semibold">Hub</span></span>
          </a>

          {/* Enhanced Dropdown Menu */}
          {showNavDropdown && (
            <div className="dropdown-menu show" style={{ display: "flex" }}>
              <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Quick Navigation</span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">Menu</span>
              </div>
              
              {/* Mobile Main Nav Items */}
              <div className="block lg:hidden border-b border-gray-100 pb-1">
                <a href="#home" className="dropdown-item" onClick={() => setShowNavDropdown(false)}>
                  <i className="fa-solid fa-house text-gray-400"></i> {t.navHome}
                </a>
                <a href="#programs" className="dropdown-item" onClick={() => setShowNavDropdown(false)}>
                  <i className="fa-solid fa-book-open text-gray-400"></i> {t.navPrograms}
                </a>
                <a href="#admissions" className="dropdown-item" onClick={() => setShowNavDropdown(false)}>
                  <i className="fa-solid fa-user-plus text-gray-400"></i> {t.navAdmissions}
                </a>
                <a href="#campus" className="dropdown-item" onClick={() => setShowNavDropdown(false)}>
                  <i className="fa-solid fa-building-columns text-gray-400"></i> {t.navCampus}
                </a>
                <a href="#about" className="dropdown-item" onClick={() => setShowNavDropdown(false)}>
                  <i className="fa-solid fa-circle-info text-gray-400"></i> {t.navAbout}
                </a>
                <a href="#contact" className="dropdown-item" onClick={() => setShowNavDropdown(false)}>
                  <i className="fa-solid fa-envelope text-gray-400"></i> {t.navContact}
                </a>
              </div>

              {/* Portal & Tools */}
              <div className="py-1">
                <div
                  className="dropdown-item"
                  onClick={() => {
                    setShowLoginModal(true);
                    setShowNavDropdown(false);
                  }}
                >
                  <i className="fa-solid fa-right-to-bracket text-emerald-600"></i> Admin / Student Login
                </div>
                <div
                  className="dropdown-item"
                  onClick={() => {
                    setShowLoginModal(true);
                    setShowNavDropdown(false);
                  }}
                >
                  <i className="fa-solid fa-user-shield text-blue-600"></i> System Portal Dashboard
                </div>
                <div
                  className="dropdown-item"
                  onClick={() => {
                    setShowFacultyModal(true);
                    setShowNavDropdown(false);
                  }}
                >
                  <i className="fa-solid fa-chalkboard-user text-purple-600"></i> Explore Faculties
                </div>
                <div
                  className="dropdown-item"
                  onClick={() => {
                    setShowAISuite(true);
                    setShowNavDropdown(false);
                  }}
                >
                  <i className="fa-solid fa-wand-magic-sparkles text-amber-500"></i> AI Intelligence Suite
                </div>
                <div
                  className="dropdown-item"
                  onClick={() => {
                    setShowAdmitModal(true);
                    setShowNavDropdown(false);
                  }}
                >
                  <i className="fa-solid fa-file-signature text-emerald-600"></i> Apply for Admission
                </div>
                <div
                  className="dropdown-item"
                  onClick={() => {
                    setShowTermsModal(true);
                    setShowNavDropdown(false);
                  }}
                >
                  <i className="fa-solid fa-file-contract text-teal-600"></i> {t.termsAndCond}
                </div>
                <div
                  className="dropdown-item"
                  onClick={() => {
                    setShowPolicyModal(true);
                    setShowNavDropdown(false);
                  }}
                >
                  <i className="fa-solid fa-shield-halved text-emerald-600"></i> {t.privacyPolicy}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Desktop Nav Links */}
        <ul className="nav-links">
          <li>
            <a href="#home">{t.navHome}</a>
          </li>
          <li>
            <a href="#programs">{t.navPrograms}</a>
          </li>
          <li>
            <a href="#admissions">{t.navAdmissions}</a>
          </li>
          <li>
            <a href="#campus">{t.navCampus}</a>
          </li>
          <li>
            <a href="#about">{t.navAbout}</a>
          </li>
          <li>
            <a href="#contact">{t.navContact}</a>
          </li>
        </ul>

        {/* Right Navigation Dock */}
        <div className="nav-right flex items-center gap-2">
          {/* AI Quick Button */}
          <button
            onClick={() => {
              setAiSuiteInitialTab("fast");
              setShowAISuite(true);
            }}
            className="hidden"
            style={{ display: "none" }}
            title="Gemini AI Multimodal Suite"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            <span className="hidden md:inline font-semibold">AI Suite</span>
          </button>

          {/* Bilingual Switcher */}
          <button className="lang-btn" onClick={toggleLanguage} id="langBtn" title="Switch Language & Calendar">
            <i className="fa-solid fa-globe text-emerald-700"></i>
            <span>{currentLang === "en" ? "नेपाली" : "English"}</span>
          </button>

          {/* Login Button */}
          <button className="nav-login-btn hidden" style={{ display: "none" }} onClick={() => setShowLoginModal(true)}>
            <i className="fa-solid fa-lock"></i>
            <span>Login</span>
          </button>

          {/* Apply Now Primary CTA */}
          <button className="apply-btn" onClick={() => setShowAdmitModal(true)}>
            {t.applyNow}
          </button>
        </div>
      </nav>

      {/* LIVE URGENT NOTICE TICKER BANNER */}
      {notices.some((n) => (n.status === "Active" || !n.status) && n.isUrgent) && (
        <div className="bg-rose-600 text-white px-4 py-2 text-xs sm:text-sm font-bold flex items-center justify-between gap-3 shadow-md z-[3000] relative">
          <div className="flex items-center gap-2 truncate flex-1">
            <span className="px-2 py-0.5 rounded bg-white text-rose-700 text-[10px] font-black uppercase tracking-wider animate-pulse shrink-0">
              URGENT NOTICE
            </span>
            <span className="truncate">
              {notices.find((n) => (n.status === "Active" || !n.status) && n.isUrgent)?.title}
            </span>
          </div>
          <button
            onClick={() => {
              const urg = notices.find((n) => (n.status === "Active" || !n.status) && n.isUrgent);
              if (urg) {
                setSelectedHubItemForDetail({
                  id: `notice-${urg.id}`,
                  itemType: "notice",
                  title: urg.title,
                  category: urg.category === "Urgent" ? "Urgent Circular" : `${urg.category} Notice`,
                  date: urg.date,
                  content: urg.content,
                  attachmentName: urg.attachmentName,
                  attachmentUrl: urg.attachmentUrl,
                  author: urg.author || "Admin Office",
                  targetAudience: urg.targetAudience || "All",
                  isUrgent: true,
                  status: urg.status,
                  originalNotice: urg,
                });
              }
            }}
            className="px-3 py-1 bg-white/20 hover:bg-white text-white hover:text-rose-700 rounded-lg text-xs font-black transition cursor-pointer shrink-0"
          >
            Read Notice →
          </button>
        </div>
      )}

      {/* HERO CAROUSEL SECTION (10 Distinct High Quality Photos & Overlay Content) */}
      <section className="hero-carousel" id="home">
        {slidesData.map((slide, idx) => (
          <div
            key={idx}
            className={`slide ${idx === currentSlide ? "active" : ""}`}
            style={{ backgroundImage: `url('${slide.img}')` }}
          >
            <div className="hero-content">
              <h1>{(t as any)[slide.titleKey]}</h1>
              <p>{(t as any)[slide.descKey]}</p>
              <div className="hero-btns">
                <button className="btn-pill-primary" onClick={() => setShowAdmitModal(true)}>
                  {t.exploreBtn}
                </button>
                {slide.hasTour && (
                  <button
                    className="btn-play-tour"
                    onClick={() => {
                      setAiSuiteInitialTab("analyze-vid");
                      setShowAISuite(true);
                    }}
                  >
                    <i className="fa-solid fa-circle-play"></i> <span>{t.tourBtn}</span>
                  </button>
                )}
                <a
                  href="https://www.youtube.com/@FactFusion-Hub2"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-youtube"
                >
                  <i className="fa-brands fa-youtube"></i> YouTube Channel
                </a>
              </div>
            </div>
          </div>
        ))}

        <button
          className="carousel-arrow arrow-left"
          onClick={() => setCurrentSlide((prev) => (prev - 1 + slidesData.length) % slidesData.length)}
        >
          &#10094;
        </button>
        <button
          className="carousel-arrow arrow-right"
          onClick={() => setCurrentSlide((prev) => (prev + 1) % slidesData.length)}
        >
          &#10095;
        </button>
      </section>

      {/* STATS OVERLAY BAR */}
      <div className="stats-bar">
        <div className="stat-item">
          <h3>{t.st1Num}</h3>
          <p>{t.stat1}</p>
        </div>
        <div className="stat-item">
          <h3>{t.st2Num}</h3>
          <p>{t.stat2}</p>
        </div>
        <div className="stat-item">
          <h3>{t.st3Num}</h3>
          <p>{t.stat3}</p>
        </div>
        <div className="stat-item">
          <h3>{t.st4Num}</h3>
          <p>{t.stat4}</p>
        </div>
      </div>

      {/* WHY CHOOSE FACTFUSION HUB SECTION */}
      <section className="sec-container bg-cream" id="about">
        <div className="why-choose-grid">
          <div>
            <div className="sec-header-left">
              <h2>{t.whyHeading}</h2>
              <p>{t.whySub}</p>
            </div>
            <ul className="why-list">
              <li className="why-item">
                <div className="why-icon">
                  <i className="fa-solid fa-briefcase"></i>
                </div>
                <div className="why-info">
                  <h4>{t.w1Title}</h4>
                  <p>{t.w1Desc}</p>
                </div>
              </li>
              <li className="why-item">
                <div className="why-icon">
                  <i className="fa-solid fa-chalkboard-user"></i>
                </div>
                <div className="why-info">
                  <h4>{t.w2Title}</h4>
                  <p>{t.w2Desc}</p>
                </div>
              </li>
              <li className="why-item">
                <div className="why-icon">
                  <i className="fa-solid fa-globe"></i>
                </div>
                <div className="why-info">
                  <h4>{t.w3Title}</h4>
                  <p>{t.w3Desc}</p>
                </div>
              </li>
            </ul>
          </div>
          <div className="image-collage-grid">
            <img
              src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80"
              alt="Student"
              className="collage-img tall"
            />
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80"
              alt="Study Outdoors"
              className="collage-img"
            />
            <img
              src="https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=600&q=80"
              alt="Campus"
              className="collage-img"
            />
          </div>
        </div>
      </section>

      {/* POPULAR PROGRAMS SECTION (5 Major Programs) */}
      <section className="sec-container bg-white" id="programs">
        <div className="sec-header">
          <div className="sec-header-left">
            <h2>{t.popTitle}</h2>
            <p>{t.popSub}</p>
          </div>
          <button onClick={() => setShowFacultyModal(true)} className="sec-link font-bold text-[#002B1D]">
            {t.viewProgLink}
          </button>
        </div>

        <div className="programs-grid">
          <div className="program-card cursor-pointer" onClick={() => setShowFacultyModal(true)}>
            <div className="program-card-icon">
              <i className="fa-solid fa-briefcase"></i>
            </div>
            <h3>{t.p1}</h3>
          </div>
          <div className="program-card cursor-pointer" onClick={() => setShowFacultyModal(true)}>
            <div className="program-card-icon">
              <i className="fa-solid fa-code"></i>
            </div>
            <h3>{t.p2}</h3>
          </div>
          <div className="program-card cursor-pointer" onClick={() => setShowFacultyModal(true)}>
            <div className="program-card-icon">
              <i className="fa-solid fa-dna"></i>
            </div>
            <h3>{t.p3}</h3>
          </div>
          <div className="program-card cursor-pointer" onClick={() => setShowFacultyModal(true)}>
            <div className="program-card-icon">
              <i className="fa-solid fa-chart-line"></i>
            </div>
            <h3>{t.p4}</h3>
          </div>
          <div className="program-card cursor-pointer" onClick={() => setShowFacultyModal(true)}>
            <div className="program-card-icon">
              <i className="fa-solid fa-hotel"></i>
            </div>
            <h3>{t.p5}</h3>
          </div>
        </div>
      </section>

      {/* CAMPUS LIFE BEYOND CLASSROOMS SECTION */}
      <section className="sec-container bg-dark-green" id="campus">
        <div className="campus-life-box">
          <div>
            <div className="sec-header-left">
              <h2>{t.campTitle}</h2>
              <p style={{ margin: "18px 0 28px" }}>{t.campDesc}</p>
            </div>
            <button
              className="btn-pill-primary"
              style={{ background: "var(--card-bg)", color: "var(--primary-dark)" }}
              onClick={() => {
                setAiSuiteInitialTab("analyze-vid");
                setShowAISuite(true);
              }}
            >
              {t.discBtn}
            </button>
          </div>
          <div className="campus-media-rel">
            <img
              src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1000&q=80"
              alt="Campus Life Students"
            />
            <div
              className="play-overlay-btn"
              onClick={() => {
                setAiSuiteInitialTab("analyze-vid");
                setShowAISuite(true);
              }}
            >
              <i className="fa-solid fa-play"></i>
            </div>
          </div>
        </div>
      </section>

      {/* CONSOLIDATED UPCOMING EVENTS & INSTITUTIONAL BULLETINS HUB */}
      <ConsolidatedEventsHub
        notices={notices}
        events={events}
        onSelectItem={(item) => setSelectedHubItemForDetail(item)}
        onRSVP={(event) => setSelectedEventForRSVP(event)}
      />

      {/* STUDENT SUCCESS STORIES (TESTIMONIALS) */}
      <section className="sec-container bg-cream">
        <div className="sec-header">
          <div className="sec-header-left">
            <h2>{t.testiTitle}</h2>
            <p>{t.testiSub}</p>
          </div>
          <span className="sec-link">{t.viewTestiLink}</span>
        </div>

        <div className="testimonial-grid">
          <div className="testi-card">
            <div>
              <i className="fa-solid fa-quote-left quote-icon"></i>
              <p className="testi-text">{t.t1Quote}</p>
            </div>
            <div className="testi-user">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                alt="User"
              />
              <div>
                <h4>Sonia Shrestha</h4>
                <p>CS Graduate</p>
              </div>
            </div>
          </div>

          <div className="testi-card featured">
            <div>
              <i className="fa-solid fa-quote-left quote-icon"></i>
              <p className="testi-text">{t.t2Quote}</p>
            </div>
            <div className="testi-user">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
                alt="User"
              />
              <div>
                <h4>Rahul Shah</h4>
                <p>Alumni Leader</p>
              </div>
            </div>
          </div>

          <div className="testi-card">
            <div>
              <i className="fa-solid fa-quote-left quote-icon"></i>
              <p className="testi-text">{t.t3Quote}</p>
            </div>
            <div className="testi-user">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
                alt="User"
              />
              <div>
                <h4>Aarti Sharma</h4>
                <p>Class 12 Student</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* UPCOMING EVENTS & QUICK LINKS SPLIT SECTION */}
      <section className="sec-container bg-white" id="admissions">
        <div className="events-links-split">
          <div className="events-container">
            <div className="sec-header-left" style={{ marginBottom: "20px" }}>
              <h2 style={{ color: "white" }}>{t.evTitle}</h2>
              <p style={{ color: "#a1a1a1" }}>{t.evSub}</p>
            </div>

            <div className="event-item-card">
              <div className="event-date-box">{t.e1Date}</div>
              <div className="event-info">
                <h4>{t.e1Title}</h4>
                <p>{t.e1Desc}</p>
              </div>
            </div>

            <div className="event-item-card">
              <div className="event-date-box">{t.e2Date}</div>
              <div className="event-info">
                <h4>{t.e2Title}</h4>
                <p>{t.e2Desc}</p>
              </div>
            </div>

            <div className="event-item-card">
              <div className="event-date-box">{t.e3Date}</div>
              <div className="event-info">
                <h4>{t.e3Title}</h4>
                <p>{t.e3Desc}</p>
              </div>
            </div>
          </div>

          <div className="quick-links-container">
            <h2 style={{ color: "white", marginBottom: "20px" }}>{t.qlTitle}</h2>
            <ul className="quick-links-list">
              <li>
                <button onClick={() => setShowAdmitModal(true)} className="w-full flex justify-between text-left">
                  <span>{t.ql1}</span> &rarr;
                </button>
              </li>
              <li>
                <button onClick={() => setShowAdmitModal(true)} className="w-full flex justify-between text-left">
                  <span>{t.ql2}</span> &rarr;
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setAiSuiteInitialTab("search");
                    setShowAISuite(true);
                  }}
                  className="w-full flex justify-between text-left"
                >
                  <span>{t.ql3}</span> &rarr;
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setAiSuiteInitialTab("fast");
                    setShowAISuite(true);
                  }}
                  className="w-full flex justify-between text-left"
                >
                  <span>{t.ql4}</span> &rarr;
                </button>
              </li>
              <li>
                <button onClick={() => setShowFacultyModal(true)} className="w-full flex justify-between text-left">
                  <span>{t.ql5}</span> &rarr;
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setAiSuiteInitialTab("thinking");
                    setShowAISuite(true);
                  }}
                  className="w-full flex justify-between text-left"
                >
                  <span>{t.ql6}</span> &rarr;
                </button>
              </li>
              <li>
                <button onClick={() => setShowLoginModal(true)} className="w-full flex justify-between text-left">
                  <span>{t.ql7}</span> &rarr;
                </button>
              </li>
              <li>
                <a href="#contact" className="w-full flex justify-between">
                  <span>{t.ql8}</span> &rarr;
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* BANNER CTA SECTION */}
      <section className="sec-container bg-white" style={{ paddingTop: 0 }}>
        <div className="banner-cta">
          <div className="banner-cta-text">
            <h2>{t.ctaTitle}</h2>
            <p>{t.ctaSub}</p>
          </div>
          <button className="btn-pill-primary" onClick={() => setShowAdmitModal(true)}>
            {t.applyNow} &rarr;
          </button>
        </div>
      </section>

      {/* A CAMPUS THAT FEELS LIKE HOME FEATURE BLOCK */}
      <section className="sec-container bg-cream">
        <div className="campus-home-block">
          <img
            src="https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=800&q=80"
            alt="Campus Clock Tower"
            className="campus-home-img"
          />
          <div>
            <div className="sec-header-left">
              <h2>{t.homeTitle}</h2>
              <p>{t.homeSub}</p>
            </div>
            <ul className="checklist-ul">
              <li>
                <i className="fa-solid fa-circle-check"></i> <span>{t.c1}</span>
              </li>
              <li>
                <i className="fa-solid fa-circle-check"></i> <span>{t.c2}</span>
              </li>
              <li>
                <i className="fa-solid fa-circle-check"></i> <span>{t.c3}</span>
              </li>
              <li>
                <i className="fa-solid fa-circle-check"></i> <span>{t.c4}</span>
              </li>
            </ul>
            <button
              className="btn-pill-primary"
              onClick={() => {
                setAiSuiteInitialTab("maps");
                setShowAISuite(true);
              }}
            >
              {t.vTourBtn}
            </button>
          </div>
        </div>
      </section>

      {/* NEWSLETTER SUBSCRIPTION SECTION */}
      <section className="newsletter-sec">
        <div>
          <h2 style={{ fontSize: "2.2rem", fontWeight: 800 }}>{t.newsSubTitle}</h2>
          <p style={{ marginTop: "8px", opacity: 0.85 }}>{t.newsSubDesc}</p>
          <form
            className="newsletter-form"
            onSubmit={(e) => {
              e.preventDefault();
              alert("Subscribed Successfully to FactFusion Hub Newsletter!");
            }}
          >
            <input type="email" placeholder="Enter your email" required />
            <button type="submit">{t.subBtn}</button>
          </form>
        </div>
        <div>
          <img
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80"
            alt="Students Connected"
            className="newsletter-img"
          />
        </div>
      </section>

      {/* FOOTER SECTION */}
      <footer id="contact">
        <div className="footer-cols">
          <div className="footer-col">
            <div className="footer-logo">
              <i className="fa-solid fa-graduation-cap"></i> FactFusion Hub
            </div>
            <p>{t.footTagline}</p>
            <div className="social-icons">
              <a href="#" className="social-icon">
                <i className="fa-brands fa-facebook-f"></i>
              </a>
              <a href="#" className="social-icon">
                <i className="fa-brands fa-twitter"></i>
              </a>
              <a href="#" className="social-icon">
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a href="#" className="social-icon">
                <i className="fa-brands fa-linkedin-in"></i>
              </a>
              <a
                href="https://www.youtube.com/@FactFusion-Hub2"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
              >
                <i className="fa-brands fa-youtube"></i>
              </a>
            </div>
          </div>

          <div className="footer-col">
            <h4>{t.fCol1}</h4>
            <ul className="footer-ul">
              <li>
                <a href="#home">{t.navHome}</a>
              </li>
              <li>
                <a href="#programs">{t.navPrograms}</a>
              </li>
              <li>
                <a href="#admissions">{t.navAdmissions}</a>
              </li>
              <li>
                <a href="#campus">{t.navCampus}</a>
              </li>
              <li>
                <a href="#about">{t.navAbout}</a>
              </li>
              <li>
                <a href="#contact">{t.navContact}</a>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>{t.fCol2}</h4>
            <ul className="footer-ul">
              <li>
                <button onClick={() => setShowFacultyModal(true)} className="text-left">
                  Library
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setAiSuiteInitialTab("search");
                    setShowAISuite(true);
                  }}
                  className="text-left"
                >
                  Career Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setAiSuiteInitialTab("thinking");
                    setShowAISuite(true);
                  }}
                  className="text-left"
                >
                  Research
                </button>
              </li>
              <li>
                <button onClick={() => setShowLoginModal(true)} className="text-left">
                  Alumni
                </button>
              </li>
              <li>
                <a href="#news">News & Events</a>
              </li>
              <li>
                <button
                  onClick={() => {
                    setAiSuiteInitialTab("fast");
                    setShowAISuite(true);
                  }}
                  className="text-left"
                >
                  FAQs
                </button>
              </li>
              <li>
                <button
                  onClick={() => setShowPolicyModal(true)}
                  className="text-left text-emerald-300 font-semibold"
                >
                  {t.privacyPolicy}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setShowTermsModal(true)}
                  className="text-left text-emerald-300 font-semibold"
                >
                  {t.termsAndCond}
                </button>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>{t.fCol3}</h4>
            <p style={{ marginBottom: "8px" }}>
              <i className="fa-solid fa-phone"></i> +977 9807695843
            </p>
            <p style={{ marginBottom: "8px" }}>
              <i className="fa-solid fa-envelope"></i> myenotes12@gmail.com
            </p>
            <p>
              <i className="fa-solid fa-location-dot"></i> <span>{t.locText}</span>
            </p>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <div>&copy; 2026 FactFusion Hub. All Rights Reserved.</div>
          <div style={{ display: "flex", gap: "20px" }}>
            <button
              onClick={() => setShowPolicyModal(true)}
              style={{ color: "#9ca3af", background: "none", border: "none", cursor: "pointer", fontSize: "0.85rem", padding: 0 }}
              className="hover:text-emerald-300 transition"
            >
              {t.privacyPolicy}
            </button>
            <button
              onClick={() => setShowTermsModal(true)}
              style={{ color: "#9ca3af", background: "none", border: "none", cursor: "pointer", fontSize: "0.85rem", padding: 0 }}
              className="hover:text-emerald-300 transition underline underline-offset-4"
            >
              {t.termsAndCond}
            </button>
          </div>
        </div>
      </footer>

      {/* SYSTEM ACCESS POLICY MODAL (BILINGUAL NE/EN) */}
      <PolicyModal
        isOpen={showPolicyModal}
        onClose={() => setShowPolicyModal(false)}
        lang={currentLang}
      />

      {/* TERMS AND CONDITIONS MODAL (BILINGUAL NE/EN) */}
      <TermsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        lang={currentLang}
      />

      {/* MAIN AUTHENTICATION & LOGIN MODAL (FIREBASE INTEGRATED) */}
      <ModernAuthModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={() => {
          setShowLoginModal(false);
          setShowDashboard(true);
        }}
        onOpenTerms={() => setShowTermsModal(true)}
      />

      {/* FACULTY DISCOVERY MODAL */}
      {showFacultyModal && (
        <div className="modal-overlay show" id="facultyModal" style={{ display: "flex" }}>
          <div className="login-card" style={{ maxWidth: "650px" }}>
            <button className="close-modal" onClick={() => setShowFacultyModal(false)}>
              <i className="fa-solid fa-xmark"></i>
            </button>
            <h2>
              <i className="fa-solid fa-chalkboard-user"></i> Academic Faculties
            </h2>
            <p>Explore streams, subjects, and specialization options offered.</p>

            <div style={{ marginBottom: "15px" }}>
              <input
                type="text"
                id="facultySearch"
                value={facultySearch}
                onChange={(e) => setFacultySearch(e.target.value)}
                placeholder="Search faculty or subject..."
                style={{
                  width: "100%",
                  padding: "9px 12px",
                  border: "1px solid var(--border-color)",
                  borderRadius: "6px",
                }}
              />
            </div>

            <div className="faculty-card-grid" id="facultyGrid">
              {filteredFaculties.map((fac, idx) => (
                <div key={idx} className="faculty-card">
                  <h4>
                    <i className={`fa-solid ${fac.icon}`}></i> {fac.title}
                  </h4>
                  <p>{fac.desc}</p>
                  <span className="role-badge">{fac.badge}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SEAMLESS ENROLLMENT & REAL-TIME REFERENCE ID TRACKER MODAL */}
      <AdmitApplicationModal
        isOpen={showAdmitModal}
        onClose={() => setShowAdmitModal(false)}
        onOpenOfficialForm={(data) => {
          if (data) {
            setOfficialFormInitialData(data);
          }
          setShowOfficialFormModal(true);
        }}
      />

      {/* UNIFIED EVENT & NOTICE DETAIL MODAL WITH DYNAMIC ASPECT RATIO HERO MEDIA */}
      <UnifiedDetailModal
        item={selectedHubItemForDetail}
        isOpen={!!selectedHubItemForDetail}
        onClose={() => setSelectedHubItemForDetail(null)}
        onOpenRSVP={(evt) => setSelectedEventForRSVP(evt)}
      />

      {/* EVENT RSVP / REGISTRATION PASS MODAL */}
      <EventRSVPModal
        event={selectedEventForRSVP}
        isOpen={!!selectedEventForRSVP}
        onClose={() => setSelectedEventForRSVP(null)}
        onRSVPSuccess={(updatedEvt) => {
          setEvents((prev) =>
            prev.map((e) => (e.id === updatedEvt.id ? updatedEvt : e))
          );
        }}
      />

      {/* SCHOOL MANAGEMENT SYSTEM DASHBOARD (SMS) */}
      <DashboardPortal
        isOpen={showDashboard}
        onClose={() => setShowDashboard(false)}
        onOpenAdmit={() => setShowOfficialFormModal(true)}
        onOpenAISuite={(tab) => {
          setAiSuiteInitialTab(tab || "thinking");
          setShowAISuite(true);
        }}
      />

      {/* OFFICIAL A4 PRINTABLE SCHOOL ADMISSION APPLICATION FORM MODAL */}
      <OfficialAdmissionFormModal
        isOpen={showOfficialFormModal}
        onClose={() => setShowOfficialFormModal(false)}
        initialData={officialFormInitialData}
      />

      {/* AI SUITE MODAL (MULTIMODAL GEMINI & GMAIL TOOLS) */}
      <AIAssistantModal
        isOpen={showAISuite}
        onClose={() => setShowAISuite(false)}
        defaultTab={aiSuiteInitialTab}
      />

      {/* FLOATING AI ASSISTANT BUTTON (ICON-ONLY) */}
      <div className="fixed bottom-6 right-6 z-[4500]">
        <button
          onClick={() => {
            setAiSuiteInitialTab("fast");
            setShowAISuite(true);
          }}
          className="w-13 h-13 rounded-full bg-[#002B1D] text-amber-300 shadow-2xl hover:bg-emerald-950 transition-all duration-200 border-2 border-[#F4E8C1] flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95 group shadow-emerald-950/40"
          aria-label="Open AI Assistant"
          title="FactFusion Hub AI Assistant"
        >
          <Sparkles className="w-6 h-6 animate-pulse text-amber-300 group-hover:rotate-12 transition-transform duration-300" />
        </button>
      </div>
    </div>
  );
}
