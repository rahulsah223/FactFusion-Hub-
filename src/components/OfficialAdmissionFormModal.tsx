import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Printer,
  CheckCircle2,
  Save,
  Loader2,
  Upload,
  Image as ImageIcon,
  FileText,
  FileCheck,
  ArrowLeft,
  Download,
  ShieldCheck,
  Building2,
  RefreshCw,
  Calendar,
  Sparkles,
} from "lucide-react";

interface OfficialAdmissionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFormSubmitted?: () => void;
  initialData?: {
    fullName?: string;
    phone?: string;
    email?: string;
    grade?: string;
    faculty?: string;
    studentId?: string;
    studentMobile?: string;
    address?: string;
    dob?: string;
    gender?: "Male" | "Female" | "Other" | "";
  };
}

export const OfficialAdmissionFormModal: React.FC<OfficialAdmissionFormModalProps> = ({
  isOpen,
  onClose,
  onFormSubmitted,
  initialData,
}) => {
  // View mode: FORM or RECEIPT
  const [viewMode, setViewMode] = useState<"FORM" | "RECEIPT">("FORM");

  // Form State
  const [formNo, setFormNo] = useState("");

  // Student ID - Auto-generated unique identifier
  const [studentId, setStudentId] = useState<string>(() => {
    return (
      initialData?.studentId?.trim() ||
      `STU-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
    );
  });

  const generateNewStudentId = () => {
    const newId = `STU-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    setStudentId(newId);
    setOfficeRollNo(newId);
  };

  // Section 1: Student Details (Starts blank - no auto-fill)
  const [studentName, setStudentName] = useState(initialData?.fullName?.trim() || "");
  const [studentMobile, setStudentMobile] = useState(
    initialData?.studentMobile?.trim() || initialData?.phone?.trim() || ""
  );
  const [gender, setGender] = useState<"Male" | "Female" | "Other" | "">(
    (initialData?.gender as any) || ""
  );
  const [dobYear, setDobYear] = useState("");
  const [dobMonth, setDobMonth] = useState("");
  const [dobDay, setDobDay] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [age, setAge] = useState("");
  const [nationality, setNationality] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [academicYear, setAcademicYear] = useState("");

  // Location Details
  const [zone, setZone] = useState("");
  const [district, setDistrict] = useState("");
  const [municipalityVdc, setMunicipalityVdc] = useState("");
  const [wardNo, setWardNo] = useState("");

  // Photo Upload State & Validation
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement | null>(null);

  // Electronic Communication Grid
  const [mobileFather, setMobileFather] = useState(initialData?.phone?.trim() || "");
  const [mobileMother, setMobileMother] = useState("");
  const [mobileGuardian, setMobileGuardian] = useState("");
  const [landlineFather, setLandlineFather] = useState("");
  const [landlineMother, setLandlineMother] = useState("");
  const [landlineGuardian, setLandlineGuardian] = useState("");

  // Parental & Guardian Info
  const [fatherName, setFatherName] = useState("");
  const [fatherProfession, setFatherProfession] = useState("");
  const [motherName, setMotherName] = useState("");
  const [motherProfession, setMotherProfession] = useState("");
  const [guardianName, setGuardianName] = useState("");
  const [guardianProfession, setGuardianProfession] = useState("");

  // Address (Primary Address - Mandatory)
  const [address, setAddress] = useState(initialData?.address?.trim() || "");

  // Seeking Admission For Section
  const [selectedGrade, setSelectedGrade] = useState(() => {
    if (initialData?.grade?.trim()) {
      const g = initialData.grade.trim();
      return g.startsWith("Class") || g.startsWith("Grade") ? g : `Class ${g}`;
    }
    return "";
  });

  // Faculty Stream Selection for Class 11 & Class 12
  const [selectedFaculty, setSelectedFaculty] = useState<string>(() => {
    if (initialData?.faculty?.trim()) {
      const f = initialData.faculty.trim();
      if (
        f.toLowerCase().includes("comp") ||
        f.toLowerCase().includes("bio") ||
        f.toLowerCase().includes("science")
      ) {
        return "Science";
      }
      return f;
    }
    return "";
  });

  const [scienceSubStream, setScienceSubStream] = useState<
    "Computer Science" | "Bioscience (Biology)" | ""
  >(() => {
    if (initialData?.faculty?.toLowerCase().includes("comp")) return "Computer Science";
    if (initialData?.faculty?.toLowerCase().includes("bio")) return "Bioscience (Biology)";
    return "";
  });

  // Additional Info
  const [allergies, setAllergies] = useState("");
  const [specialNeeds, setSpecialNeeds] = useState("");

  // Section 2: Brief Academic History (Blank default state)
  const [prevSchool, setPrevSchool] = useState("");
  const [studiedStandard, setStudiedStandard] = useState("");
  const [academicResult, setAcademicResult] = useState<"Passed" | "Failed" | "">("");
  const [gpa, setGpa] = useState("");
  const [reasonsForLeaving, setReasonsForLeaving] = useState("");

  // Section 4: For Office Use Only
  const [regdNo, setRegdNo] = useState("");
  const [submissionDate, setSubmissionDate] = useState("");
  const [receiptNo, setReceiptNo] = useState("");
  const [officeStudentName, setOfficeStudentName] = useState(initialData?.fullName?.trim() || "");
  const [officeClass, setOfficeClass] = useState(() => {
    if (initialData?.grade?.trim()) {
      const g = initialData.grade.trim();
      return g.startsWith("Class") || g.startsWith("Grade") ? g : `Class ${g}`;
    }
    return "";
  });
  const [officeSection, setOfficeSection] = useState("");
  const [officeRollNo, setOfficeRollNo] = useState(initialData?.studentId?.trim() || "");
  const [officeHouse, setOfficeHouse] = useState("");
  const [officeAcademicYear, setOfficeAcademicYear] = useState("");

  // Synchronize initial data whenever modal is opened
  useEffect(() => {
    if (isOpen) {
      if (initialData?.fullName?.trim()) {
        setStudentName(initialData.fullName.trim());
        setOfficeStudentName(initialData.fullName.trim());
      } else {
        setStudentName("");
        setOfficeStudentName("");
      }

      if (initialData?.studentId?.trim()) {
        setStudentId(initialData.studentId.trim());
        setOfficeRollNo(initialData.studentId.trim());
      } else if (!studentId) {
        generateNewStudentId();
      } else {
        setOfficeRollNo(studentId);
      }

      if (initialData?.studentMobile?.trim()) {
        setStudentMobile(initialData.studentMobile.trim());
      } else if (initialData?.phone?.trim()) {
        setStudentMobile(initialData.phone.trim());
        setMobileFather(initialData.phone.trim());
      } else {
        setStudentMobile("");
        setMobileFather("");
      }

      if (initialData?.address?.trim()) {
        setAddress(initialData.address.trim());
      }

      if (initialData?.gender) {
        setGender(initialData.gender);
      }

      if (initialData?.dob?.trim()) {
        const parts = initialData.dob.trim().split(/[-/]/);
        if (parts.length === 3) {
          setDobYear(parts[0]);
          setDobMonth(parts[1]);
          setDobDay(parts[2]);
        }
      }

      if (initialData?.grade?.trim()) {
        const g =
          initialData.grade.trim().startsWith("Class") ||
          initialData.grade.trim().startsWith("Grade")
            ? initialData.grade.trim()
            : `Class ${initialData.grade.trim()}`;
        setSelectedGrade(g);
        setOfficeClass(g);
      } else {
        setSelectedGrade("");
        setOfficeClass("");
      }

      if (initialData?.faculty?.trim()) {
        const f = initialData.faculty.trim();
        if (f.toLowerCase().includes("bio")) {
          setSelectedFaculty("Science");
          setScienceSubStream("Bioscience (Biology)");
        } else if (f.toLowerCase().includes("comp")) {
          setSelectedFaculty("Science");
          setScienceSubStream("Computer Science");
        } else {
          setSelectedFaculty(f);
        }
      }
    }
  }, [isOpen, initialData]);

  // Handle ESC key dismiss
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Saved Receipt Details for Receipt View Mode
  const [savedReceiptData, setSavedReceiptData] = useState<{
    receiptNo: string;
    refId: string;
    formNo: string;
    studentId: string;
    studentMobile: string;
    studentName: string;
    gender: string;
    dob: string;
    primaryAddress: string;
    classGrade: string;
    facultyStream: string;
    submittedAt: string;
    phone: string;
    email: string;
    fatherName: string;
    motherName: string;
    zone: string;
    district: string;
    photoPreview: string | null;
  } | null>(null);

  // Submission / Loading Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhotoError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!validTypes.includes(file.type.toLowerCase())) {
      setPhotoError("Please select a valid PNG, JPG, or JPEG image file.");
      return;
    }

    // 5MB Max File Size
    if (file.size > 5 * 1024 * 1024) {
      setPhotoError("Image file size exceeds the maximum 5MB limit.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setPhotoPreview(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // 1. Student Name (Mandatory)
    if (!studentName.trim()) {
      setErrorMessage("Student's Name is mandatory.");
      return;
    }

    // 2. Student Mobile (Mandatory)
    const cleanStudentMobile = studentMobile.trim();
    if (!cleanStudentMobile) {
      setErrorMessage("Student Mobile Number is mandatory.");
      return;
    }
    const phoneRegex = /^[+]?[0-9\s-]{7,20}$/;
    if (!phoneRegex.test(cleanStudentMobile)) {
      setErrorMessage("Please enter a valid Student Mobile Number (at least 7 digits).");
      return;
    }

    // 3. Gender (Mandatory)
    if (!gender) {
      setErrorMessage("Gender selection is mandatory. Please select Male, Female, or Other.");
      return;
    }

    // 4. DOB (Mandatory)
    if (!dobYear.trim() || !dobMonth.trim() || !dobDay.trim()) {
      setErrorMessage("Date of Birth (Year, Month, and Day) is mandatory.");
      return;
    }

    // 5. Father's Name (Mandatory)
    if (!fatherName.trim()) {
      setErrorMessage("Father's Name is mandatory.");
      return;
    }

    // 6. Mother's Name (Mandatory)
    if (!motherName.trim()) {
      setErrorMessage("Mother's Name is mandatory.");
      return;
    }

    // 7. Primary Address (Mandatory)
    if (!address.trim()) {
      setErrorMessage("Primary Address (Permanent Residence Address) is mandatory.");
      return;
    }

    // 8. Class / Grade Selection (Mandatory)
    if (!selectedGrade) {
      setErrorMessage("Please select a Class or Grade under 'Seeking Admission For'.");
      return;
    }

    // 9. Faculty Stream Selection (Mandatory for Class 11 and Class 12)
    const isClass11or12 =
      selectedGrade === "Class 11" ||
      selectedGrade === "Class 12" ||
      selectedGrade.includes("11") ||
      selectedGrade.includes("12");

    if (isClass11or12) {
      if (!selectedFaculty) {
        setErrorMessage(
          `Faculty stream selection is mandatory for ${selectedGrade}. Please select Science, Management, Hotel Management, Commerce, or Education.`
        );
        return;
      }
      if (selectedFaculty === "Science" && !scienceSubStream) {
        setErrorMessage(
          "Please select your Science specialization: Computer Science or Bioscience (Biology)."
        );
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const finalFormNo =
        formNo.trim() || `FFH-${Math.floor(1000 + Math.random() * 9000)}`;
      const generatedReceiptNo =
        receiptNo.trim() ||
        `REC-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}-${Date.now()
          .toString(36)
          .slice(-4)
          .toUpperCase()}`;

      const fullFacultyStream = isClass11or12
        ? selectedFaculty === "Science"
          ? `Science (${scienceSubStream})`
          : selectedFaculty
        : selectedFaculty || "General";

      const formattedDob = `${dobYear}-${dobMonth.padStart(2, "0")}-${dobDay.padStart(2, "0")}`;

      const payload = {
        fullName: studentName.trim(),
        phoneNumber: cleanStudentMobile,
        studentMobile: cleanStudentMobile,
        studentId: studentId.trim(),
        assignedStudentId: studentId.trim(),
        emailAddress:
          initialData?.email ||
          `${studentName.toLowerCase().replace(/\s+/g, ".")}@factfusion.edu.np`,
        classGradeSelection: selectedGrade,
        facultyStream: fullFacultyStream,
        receiptNo: generatedReceiptNo,
        gender: gender,
        dob: formattedDob,
        primaryAddress: address.trim(),
        adminNotes: `Official Form ${finalFormNo} submitted. Student ID: ${studentId}. Mobile: ${cleanStudentMobile}. Gender: ${gender}. DOB: ${formattedDob}. Address: ${address}. Stream: ${fullFacultyStream}. Father: ${fatherName} (${fatherProfession || "N/A"}), Mother: ${motherName} (${motherProfession || "N/A"}). Zone: ${zone || "Bagmati"}, District: ${district || "Kathmandu"}. Prev School: ${prevSchool || "N/A"}. GPA: ${gpa || "N/A"}.`,
      };

      const res = await fetch("/api/pending-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        const finalReceiptNo = data.application?.receiptNo || generatedReceiptNo;
        const finalRefId = data.application?.id || `APP-${Math.floor(1000 + Math.random() * 9000)}`;

        setSavedReceiptData({
          receiptNo: finalReceiptNo,
          refId: finalRefId,
          formNo: finalFormNo,
          studentId: studentId.trim(),
          studentMobile: cleanStudentMobile,
          studentName: studentName.trim(),
          gender: gender || "Not Specified",
          dob: formattedDob,
          primaryAddress: address.trim(),
          classGrade: selectedGrade,
          facultyStream: fullFacultyStream,
          submittedAt: new Date().toLocaleString(),
          phone: cleanStudentMobile,
          email:
            initialData?.email ||
            `${studentName.toLowerCase().replace(/\s+/g, ".")}@factfusion.edu.np`,
          fatherName: fatherName.trim() || "N/A",
          motherName: motherName.trim() || "N/A",
          zone: zone.trim() || "Bagmati",
          district: district.trim() || "Kathmandu",
          photoPreview,
        });

        setReceiptNo(finalReceiptNo);
        window.dispatchEvent(new CustomEvent("factfusion_sync_update"));
        if (onFormSubmitted) onFormSubmitted();
        setViewMode("RECEIPT");
      } else {
        const errData = await res.json();
        setErrorMessage(errData.error || "Failed to submit official application form.");
      }
    } catch (err) {
      setErrorMessage("Network error saving official application form.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Grade Selection Categories
  const preSchoolGrades = ["Play group", "Nursery", "LKG", "UKG"];
  const basicLevelGrades = [
    "Class 1",
    "Class 2",
    "Class 3",
    "Class 4",
    "Class 5",
    "Class 6",
    "Class 7",
    "Class 8",
  ];
  const secondaryLevelGrades = ["Class 9", "Class 10", "Class 11", "Class 12"];

  return (
    <div
      className="fixed inset-0 z-[7000] w-full h-full min-h-screen h-[100dvh] bg-white flex flex-col p-0 m-0 overflow-hidden print:p-0 print:bg-white print:fixed print:inset-0"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {/* CSS Styles for Print Formatting */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-admission-form, #printable-admission-form * {
            visibility: visible;
          }
          #printable-admission-form {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            max-width: 100% !important;
            height: auto !important;
            max-height: none !important;
            padding: 0 !important;
            margin: 0 !important;
            border: none !important;
            box-shadow: none !important;
          }
          .no-print {
            display: none !important;
          }
          input, textarea, select {
            border: none !important;
            background: transparent !important;
            appearance: none !important;
            padding: 0 !important;
          }
        }
      `}</style>

      {/* Main Container - Expands dynamically to 100% of the viewport without side or bottom margins */}
      <div
        id="printable-admission-form"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full h-full min-h-screen h-[100dvh] bg-white text-slate-900 overflow-hidden m-0 flex flex-col print:w-full print:h-auto print:max-w-none print:max-h-none print:shadow-none print:border-none print:rounded-none font-sans"
      >
        {/* TOP MODAL HEADER BAR (Screen Only - Clean Edge-to-Edge) */}
        <div className="no-print bg-slate-900 text-white px-5 sm:px-8 md:px-12 py-3.5 sm:py-4 flex items-center justify-between border-b border-slate-800 shrink-0 z-20">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-red-950 border border-red-800 flex items-center justify-center text-red-400 shrink-0 shadow-xs">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-sm sm:text-base md:text-lg tracking-wide block text-white">
                FactFusion Hub — Official Admission Portal
              </span>
              <span className="text-xs sm:text-sm text-slate-400 font-medium">
                {viewMode === "FORM"
                  ? "A4 Format Printable Application & Registration System"
                  : "Official Billing & Submission Receipt"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {viewMode === "RECEIPT" && (
              <button
                type="button"
                onClick={() => setViewMode("FORM")}
                className="h-10 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Edit Form</span>
              </button>
            )}

            <button
              type="button"
              onClick={handlePrint}
              className="h-10 px-4 sm:px-5 bg-[#8B0000] hover:bg-red-900 text-white rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition cursor-pointer shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Print {viewMode === "RECEIPT" ? "Receipt" : "Form"}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition cursor-pointer ml-1"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* VIEW MODE 1: CONFIRMATION / BILLING RECEIPT VIEW */}
        {viewMode === "RECEIPT" && savedReceiptData ? (
          <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-8 space-y-6 bg-slate-50 flex flex-col">
            <div className="max-w-3xl mx-auto w-full bg-white border-2 border-slate-900 rounded-xl p-6 sm:p-8 shadow-xl space-y-6">
              {/* Receipt Branding Header */}
              <div className="border-b-2 border-slate-900 pb-4 flex flex-wrap justify-between items-start gap-4">
                <div>
                  <h1 className="text-2xl font-black text-[#8B0000] uppercase tracking-wider font-serif">
                    FACTFUSION HUB
                  </h1>
                  <p className="text-xs font-bold text-slate-700 uppercase tracking-tight mt-0.5">
                    Official Student Admission & Enrollment Receipt
                  </p>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Admissions Office • Mahottari Gaushala, Nepal • Phone: +977 1-4400000
                  </p>
                </div>

                <div className="bg-red-50 border border-red-200 px-4 py-2 rounded-lg text-right">
                  <span className="text-[10px] font-black uppercase text-red-800 block">
                    STATUS: REGISTERED & SAVED
                  </span>
                  <span className="text-xs font-mono font-extrabold text-slate-900">
                    Ref ID: {savedReceiptData.refId}
                  </span>
                </div>
              </div>

              {/* Unique Receipt Highlight Banner */}
              <div className="bg-slate-900 text-white rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-8 h-8 text-amber-400 shrink-0" />
                  <div>
                    <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider block">
                      OFFICIAL UNIQUE RECEIPT NUMBER
                    </span>
                    <span className="text-xl sm:text-2xl font-mono font-black text-amber-300 tracking-wider">
                      {savedReceiptData.receiptNo}
                    </span>
                  </div>
                </div>

                <div className="text-right sm:border-l border-slate-700 sm:pl-4 text-xs font-mono text-slate-300">
                  <div>Form No: <strong className="text-white">{savedReceiptData.formNo}</strong></div>
                  <div>Date: <strong className="text-white">{savedReceiptData.submittedAt}</strong></div>
                </div>
              </div>

              {/* Student Details Grid & Photo Thumbnail */}
              <div className="grid grid-cols-12 gap-4 border border-slate-300 rounded-lg p-4 bg-slate-50/50">
                {/* Photo Thumbnail */}
                <div className="col-span-12 sm:col-span-3 flex flex-col items-center justify-center">
                  <div className="w-24 h-28 border-2 border-slate-800 bg-white rounded-md overflow-hidden flex items-center justify-center shadow-xs">
                    {savedReceiptData.photoPreview ? (
                      <img
                        src={savedReceiptData.photoPreview}
                        alt={savedReceiptData.studentName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center p-2 text-slate-400">
                        <ImageIcon className="w-8 h-8 mx-auto mb-1" />
                        <span className="text-[9px] font-bold block leading-tight">No Photo Provided</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Info Fields Table */}
                <div className="col-span-12 sm:col-span-9 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] font-black uppercase text-emerald-800 block">Student ID (Assigned)</span>
                    <span className="font-mono font-black text-emerald-950 text-sm bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300 inline-block">
                      {savedReceiptData.studentId}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-black uppercase text-slate-500 block">Student Name</span>
                    <span className="font-extrabold text-slate-900 text-sm">{savedReceiptData.studentName}</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-black uppercase text-slate-500 block">Student Mobile</span>
                    <span className="font-mono font-bold text-slate-900 text-sm">{savedReceiptData.studentMobile}</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-black uppercase text-slate-500 block">Gender & DOB</span>
                    <span className="font-bold text-slate-800">{savedReceiptData.gender} • {savedReceiptData.dob}</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-black uppercase text-slate-500 block">Class / Grade</span>
                    <span className="font-extrabold text-[#8B0000] text-sm">{savedReceiptData.classGrade}</span>
                  </div>

                  {savedReceiptData.facultyStream && (
                    <div>
                      <span className="text-[10px] font-black uppercase text-amber-800 block">Faculty Stream</span>
                      <span className="font-bold text-amber-900 text-xs bg-amber-100 px-2 py-0.5 rounded border border-amber-300 inline-block">
                        {savedReceiptData.facultyStream}
                      </span>
                    </div>
                  )}

                  <div className="sm:col-span-2">
                    <span className="text-[10px] font-black uppercase text-slate-500 block">Primary Address</span>
                    <span className="font-medium text-slate-800">{savedReceiptData.primaryAddress}</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-black uppercase text-slate-500 block">Parents</span>
                    <span className="font-bold text-slate-800">{savedReceiptData.fatherName} / {savedReceiptData.motherName}</span>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900 space-y-1">
                <span className="font-black uppercase tracking-wider block text-[10px]">
                  Verification & Office Instructions:
                </span>
                <p className="leading-relaxed">
                  Please keep this receipt and Reference ID (<strong>{savedReceiptData.refId}</strong>) safe for verification during campus counseling. Our admissions team will contact you shortly via <strong>{savedReceiptData.phone}</strong>.
                </p>
              </div>

              {/* Signatures Footer with generous vertical distance */}
              <div className="grid grid-cols-3 gap-6 pt-16 sm:pt-24 pb-4 text-center text-xs">
                <div className="flex flex-col items-center justify-end">
                  <div className="h-16 sm:h-20 w-full flex items-end justify-center pb-2">
                    <span className="text-[10px] text-slate-400 italic select-none">(Sign Area)</span>
                  </div>
                  <div className="border-b border-dashed border-slate-500 w-36 mx-auto mb-1.5"></div>
                  <span className="font-bold text-slate-800 block text-xs sm:text-sm">Student's Signature</span>
                </div>
                <div className="flex flex-col items-center justify-end">
                  <div className="h-16 sm:h-20 w-full flex items-end justify-center pb-2">
                    <span className="text-[10px] text-slate-400 italic select-none">(Sign Area)</span>
                  </div>
                  <div className="border-b border-dashed border-slate-500 w-36 mx-auto mb-1.5"></div>
                  <span className="font-bold text-slate-800 block text-xs sm:text-sm">Parent / Officer Sign</span>
                </div>
                <div className="flex flex-col items-center justify-end">
                  <div className="h-16 sm:h-20 w-full flex items-end justify-center pb-2">
                    <span className="text-[10px] text-slate-400 italic select-none">(Seal & Stamp)</span>
                  </div>
                  <div className="border-b border-dashed border-slate-500 w-36 mx-auto mb-1.5"></div>
                  <span className="font-black text-slate-900 uppercase block text-xs sm:text-sm">Principal Seal</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="no-print pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setViewMode("FORM")}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Fill Another Application</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="px-5 py-2 bg-[#8B0000] hover:bg-red-900 text-white rounded-xl font-black text-xs flex items-center gap-2 shadow-md transition cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Official Receipt</span>
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold text-xs transition cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* VIEW MODE 2: FORM INPUT VIEW */
          <form
            onSubmit={handleSubmitForm}
            className="flex-1 min-h-0 flex flex-col overflow-y-auto overscroll-contain text-slate-900 bg-slate-50/50 text-sm sm:text-base"
          >
            <div className="flex-1 flex flex-col w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-12 lg:px-16 py-6 sm:py-8 space-y-8">
              {/* Error Banner */}
              {errorMessage && (
                <div className="p-4 bg-red-100 border-l-4 border-red-800 text-red-900 font-bold text-sm sm:text-base rounded-md no-print flex items-center justify-between shadow-xs">
                  <span>{errorMessage}</span>
                  <button
                    type="button"
                    onClick={() => setErrorMessage(null)}
                    className="text-red-800 font-black text-lg ml-2 hover:opacity-75"
                  >
                    ×
                  </button>
                </div>
              )}

              {/* Photo Error Banner */}
              {photoError && (
                <div className="p-4 bg-amber-100 border-l-4 border-amber-600 text-amber-900 font-bold text-sm sm:text-base rounded-md no-print flex items-center justify-between shadow-xs">
                  <span>{photoError}</span>
                  <button
                    type="button"
                    onClick={() => setPhotoError(null)}
                    className="text-amber-900 font-black text-lg ml-2 hover:opacity-75"
                  >
                    ×
                  </button>
                </div>
              )}

              {/* 1. HEADER SECTION */}
              <div className="space-y-4">
                {/* Top Header Grid: Form No. (Left), Title Banner (Center), Photo Upload Box (Right) */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center sm:items-start border-b-2 border-slate-200 pb-6">
                  {/* Form No & Unique Student ID Field (Top Left) */}
                  <div className="sm:col-span-3 pt-1 text-left space-y-3">
                    <div>
                      <label className="font-extrabold text-slate-900 block text-xs sm:text-sm mb-1">
                        Form No.:
                      </label>
                      <input
                        type="text"
                        value={formNo}
                        onChange={(e) => setFormNo(e.target.value)}
                        placeholder="e.g. FFH-2026"
                        className="w-full h-10 font-mono font-bold text-slate-900 border-b-2 border-dashed border-slate-400 focus:outline-none focus:border-red-800 bg-transparent py-1 text-sm sm:text-base placeholder:text-slate-400"
                      />
                    </div>

                    {/* Auto-Generated Unique Student ID Card */}
                    <div className="bg-red-50/90 border-2 border-red-800/30 rounded-lg p-2.5 shadow-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-black uppercase tracking-wider text-red-900 flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-red-700" />
                          Student ID
                        </span>
                        <button
                          type="button"
                          onClick={generateNewStudentId}
                          title="Generate New Unique Student ID"
                          className="text-xs font-bold text-red-700 hover:text-red-950 flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-red-100 transition cursor-pointer"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Regenerate</span>
                        </button>
                      </div>
                      <div className="font-mono font-black text-red-950 text-sm sm:text-base tracking-wider bg-white px-2.5 py-1 rounded border border-red-300 select-all flex items-center justify-between">
                        <span>{studentId}</span>
                        <span className="text-[10px] font-bold uppercase text-red-700 bg-red-100 px-1.5 py-0.5 rounded">
                          Unique
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-semibold mt-1">
                        *Automatically generated unique ID
                      </p>
                    </div>
                  </div>

                  {/* Main Banner Title (Center) */}
                  <div className="sm:col-span-6 text-center">
                    <div className="bg-[#8B0000] text-white py-3 sm:py-4 px-6 rounded-lg shadow-sm border border-red-950">
                      <h1 className="text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-wider font-serif">
                        APPLICATION FORM
                      </h1>
                    </div>
                    <p className="text-sm sm:text-base font-black text-slate-800 mt-2 uppercase tracking-widest">
                      FactFusion Hub
                    </p>
                  </div>

                  {/* Passport Photo Upload Container (Top Right - Interactive) */}
                  <div className="sm:col-span-3 flex justify-center sm:justify-end">
                    <input
                      ref={photoInputRef}
                      type="file"
                      accept="image/png, image/jpeg, image/jpg"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />

                    <div
                      onClick={() => photoInputRef.current?.click()}
                      className="w-32 h-40 sm:w-36 sm:h-44 border-2 border-dashed border-slate-700 bg-slate-50 hover:bg-slate-100 transition flex flex-col items-center justify-center text-center p-2.5 shadow-xs cursor-pointer relative group rounded-md overflow-hidden"
                      title="Click to select and upload passport photo"
                    >
                      {photoPreview ? (
                        <>
                          <img
                            src={photoPreview}
                            alt="Passport Photo Preview"
                            className="w-full h-full object-cover rounded-sm"
                          />
                          <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center text-white text-xs font-bold p-2">
                            <Upload className="w-5 h-5 mb-1 text-amber-300" />
                            <span>Change Photo</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <Upload className="w-6 h-6 sm:w-7 sm:h-7 text-slate-600 mb-1.5" />
                          <span className="text-[11px] sm:text-xs font-bold text-slate-700 leading-snug">
                            Affix recent passport size photo here
                          </span>
                          <span className="text-[10px] sm:text-xs font-black text-red-800 mt-1.5 uppercase">
                            Click to upload
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* ========================================================================= */}
              {/* SECTION 1: STUDENT'S DETAILS */}
              {/* ========================================================================= */}
              <div className="space-y-4">
                {/* Section Banner Header */}
                <div className="bg-[#8B0000] text-white px-5 sm:px-6 py-3 rounded-md font-black text-sm sm:text-base uppercase tracking-wider flex flex-wrap items-center justify-between gap-2 border border-red-900 shadow-xs">
                  <div className="flex items-center gap-3">
                    <span>1. STUDENT'S DETAILS</span>
                    <span className="font-mono text-xs bg-red-950/70 border border-red-700/60 px-2 py-0.5 rounded text-amber-200">
                      ID: {studentId}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-amber-200">
                    * Red asterisk indicates mandatory fields
                  </span>
                </div>

                {/* Primary Student Identification: Name & Student Mobile */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 border-2 border-slate-400 p-4 sm:p-5 rounded-md bg-white shadow-xs">
                  {/* Student's Full Legal Name (Mandatory) */}
                  <div className="md:col-span-7 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                    <label className="font-black text-slate-900 shrink-0 text-sm sm:text-base">
                      Student's Name:<span className="text-red-600 font-black ml-0.5">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={studentName}
                      onChange={(e) => {
                        setStudentName(e.target.value);
                        setOfficeStudentName(e.target.value);
                      }}
                      placeholder="FULL LEGAL NAME IN BLOCK LETTERS"
                      className="w-full h-11 text-base sm:text-lg font-bold uppercase border-b-2 border-slate-400 focus:outline-none focus:border-red-800 bg-transparent px-2 py-1 placeholder:normal-case placeholder:font-normal placeholder:text-slate-400"
                    />
                  </div>

                  {/* Student Mobile (Mandatory) */}
                  <div className="md:col-span-5 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 border-t md:border-t-0 md:border-l border-slate-200 pt-3 md:pt-0 md:pl-4">
                    <label className="font-black text-slate-900 shrink-0 text-sm sm:text-base">
                      Student Mobile:<span className="text-red-600 font-black ml-0.5">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={studentMobile}
                      onChange={(e) => setStudentMobile(e.target.value)}
                      placeholder="+977 98XXXXXXXX"
                      className="w-full h-11 text-base sm:text-lg font-mono font-bold border-b-2 border-slate-400 focus:outline-none focus:border-red-800 bg-transparent px-2 py-1 placeholder:font-normal placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Gender & Date of Birth Row (Both Mandatory) */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 border-2 border-slate-400 p-4 sm:p-5 rounded-md bg-white shadow-xs">
                  {/* Gender Selection (Mandatory) */}
                  <div className="md:col-span-5 flex items-center flex-wrap gap-3 sm:gap-4">
                    <span className="font-black text-slate-900 text-sm sm:text-base shrink-0">
                      Gender:<span className="text-red-600 font-black ml-0.5">*</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <label
                        className={`flex items-center gap-1.5 font-bold cursor-pointer px-3 py-1.5 rounded-lg border-2 text-sm sm:text-base transition ${
                          gender === "Male"
                            ? "border-red-800 bg-red-50 text-red-950 shadow-xs"
                            : "border-slate-300 bg-slate-50 text-slate-700 hover:border-slate-400"
                        }`}
                      >
                        <input
                          type="radio"
                          name="student_gender"
                          checked={gender === "Male"}
                          onChange={() => setGender("Male")}
                          className="w-4 h-4 accent-red-800 cursor-pointer"
                        />
                        <span>Male</span>
                      </label>

                      <label
                        className={`flex items-center gap-1.5 font-bold cursor-pointer px-3 py-1.5 rounded-lg border-2 text-sm sm:text-base transition ${
                          gender === "Female"
                            ? "border-red-800 bg-red-50 text-red-950 shadow-xs"
                            : "border-slate-300 bg-slate-50 text-slate-700 hover:border-slate-400"
                        }`}
                      >
                        <input
                          type="radio"
                          name="student_gender"
                          checked={gender === "Female"}
                          onChange={() => setGender("Female")}
                          className="w-4 h-4 accent-red-800 cursor-pointer"
                        />
                        <span>Female</span>
                      </label>

                      <label
                        className={`flex items-center gap-1.5 font-bold cursor-pointer px-3 py-1.5 rounded-lg border-2 text-sm sm:text-base transition ${
                          gender === "Other"
                            ? "border-red-800 bg-red-50 text-red-950 shadow-xs"
                            : "border-slate-300 bg-slate-50 text-slate-700 hover:border-slate-400"
                        }`}
                      >
                        <input
                          type="radio"
                          name="student_gender"
                          checked={gender === "Other"}
                          onChange={() => setGender("Other")}
                          className="w-4 h-4 accent-red-800 cursor-pointer"
                        />
                        <span>Other</span>
                      </label>
                    </div>
                  </div>

                  {/* Date of Birth (Mandatory) */}
                  <div className="md:col-span-7 flex flex-wrap items-center gap-3 sm:gap-4 border-t md:border-t-0 md:border-l border-slate-200 pt-3 md:pt-0 md:pl-4">
                    <div className="flex items-center gap-1 font-black text-slate-900 text-sm sm:text-base shrink-0">
                      <Calendar className="w-4 h-4 text-red-800" />
                      <span>Date of Birth (DOB):</span>
                      <span className="text-red-600 font-black">*</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-xs text-slate-600">YYYY:</span>
                        <input
                          type="text"
                          maxLength={4}
                          value={dobYear}
                          onChange={(e) => setDobYear(e.target.value)}
                          placeholder="2010"
                          className="w-18 sm:w-20 h-10 text-center font-mono font-bold text-sm sm:text-base border-2 border-slate-400 bg-white placeholder:text-slate-400 rounded-md focus:border-red-800 focus:outline-none"
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-xs text-slate-600">MM:</span>
                        <input
                          type="text"
                          maxLength={2}
                          value={dobMonth}
                          onChange={(e) => setDobMonth(e.target.value)}
                          placeholder="05"
                          className="w-14 sm:w-16 h-10 text-center font-mono font-bold text-sm sm:text-base border-2 border-slate-400 bg-white placeholder:text-slate-400 rounded-md focus:border-red-800 focus:outline-none"
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-xs text-slate-600">DD:</span>
                        <input
                          type="text"
                          maxLength={2}
                          value={dobDay}
                          onChange={(e) => setDobDay(e.target.value)}
                          placeholder="15"
                          className="w-14 sm:w-16 h-10 text-center font-mono font-bold text-sm sm:text-base border-2 border-slate-400 bg-white placeholder:text-slate-400 rounded-md focus:border-red-800 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional General Info Grid Table */}
                <div className="border-2 border-slate-400 rounded-md overflow-hidden text-sm sm:text-base bg-white shadow-xs">

                  {/* General Information Fields with Placeholders */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x-2 divide-slate-400 border-b-2 border-slate-400">
                    <div className="p-3 sm:p-4 flex items-center gap-3">
                      <span className="font-black text-slate-900 shrink-0 text-sm sm:text-base">Blood Group:</span>
                      <input
                        type="text"
                        value={bloodGroup}
                        onChange={(e) => setBloodGroup(e.target.value)}
                        placeholder="e.g. O+"
                        className="w-full h-11 font-bold border-b-2 border-slate-300 focus:outline-none focus:border-red-800 bg-transparent px-2 text-sm sm:text-base placeholder:text-slate-400"
                      />
                    </div>
                    <div className="p-3 sm:p-4 flex items-center gap-3">
                      <span className="font-black text-slate-900 shrink-0 text-sm sm:text-base">Age:</span>
                      <input
                        type="text"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        placeholder="e.g. 16 yrs"
                        className="w-full h-11 font-bold border-b-2 border-slate-300 focus:outline-none focus:border-red-800 bg-transparent px-2 text-sm sm:text-base placeholder:text-slate-400"
                      />
                    </div>
                    <div className="p-3 sm:p-4 flex items-center gap-3">
                      <span className="font-black text-slate-900 shrink-0 text-sm sm:text-base">Nationality:</span>
                      <input
                        type="text"
                        value={nationality}
                        onChange={(e) => setNationality(e.target.value)}
                        placeholder="Nepali"
                        className="w-full h-11 font-bold border-b-2 border-slate-300 focus:outline-none focus:border-red-800 bg-transparent px-2 text-sm sm:text-base placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x-2 divide-slate-400">
                    <div className="p-3 sm:p-4 flex items-center gap-3">
                      <span className="font-black text-slate-900 shrink-0 text-sm sm:text-base">State:</span>
                      <input
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        placeholder="Bagmati Province"
                        className="w-full h-11 font-bold border-b-2 border-slate-300 focus:outline-none focus:border-red-800 bg-transparent px-2 text-sm sm:text-base placeholder:text-slate-400"
                      />
                    </div>
                    <div className="p-3 sm:p-4 flex items-center gap-3">
                      <span className="font-black text-slate-900 shrink-0 text-sm sm:text-base">Country:</span>
                      <input
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder="Nepal"
                        className="w-full h-11 font-bold border-b-2 border-slate-300 focus:outline-none focus:border-red-800 bg-transparent px-2 text-sm sm:text-base placeholder:text-slate-400"
                      />
                    </div>
                    <div className="p-3 sm:p-4 flex items-center gap-3">
                      <span className="font-black text-slate-900 shrink-0 text-sm sm:text-base">Academic Year:</span>
                      <input
                        type="text"
                        value={academicYear}
                        onChange={(e) => setAcademicYear(e.target.value)}
                        placeholder="2026/2027"
                        className="w-full h-11 font-bold border-b-2 border-slate-300 focus:outline-none focus:border-red-800 bg-transparent px-2 text-sm sm:text-base placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Location Details Grid (Zone & District Placeholders #9CA3AF) */}
                <div className="border-2 border-slate-400 p-4 sm:p-5 rounded-md bg-white grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-4 text-sm sm:text-base shadow-xs">
                  <div className="sm:col-span-1 md:col-span-3 flex items-center gap-2">
                    <span className="font-black text-slate-900 shrink-0 text-sm sm:text-base">Zone:</span>
                    <input
                      type="text"
                      value={zone}
                      onChange={(e) => setZone(e.target.value)}
                      placeholder="Bagmati"
                      className="w-full h-11 border-b-2 border-slate-400 font-bold focus:outline-none focus:border-red-800 bg-transparent px-2 text-sm sm:text-base placeholder:text-[#9CA3AF]"
                    />
                  </div>
                  <div className="sm:col-span-1 md:col-span-3 flex items-center gap-2">
                    <span className="font-black text-slate-900 shrink-0 text-sm sm:text-base">District:</span>
                    <input
                      type="text"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      placeholder="Kathmandu"
                      className="w-full h-11 border-b-2 border-slate-400 font-bold focus:outline-none focus:border-red-800 bg-transparent px-2 text-sm sm:text-base placeholder:text-[#9CA3AF]"
                    />
                  </div>
                  <div className="sm:col-span-1 md:col-span-4 flex items-center gap-2">
                    <span className="font-black text-slate-900 shrink-0 text-sm sm:text-base">Municipality/VDC:</span>
                    <input
                      type="text"
                      value={municipalityVdc}
                      onChange={(e) => setMunicipalityVdc(e.target.value)}
                      placeholder="e.g. Kathmandu Metro"
                      className="w-full h-11 border-b-2 border-slate-400 font-bold focus:outline-none focus:border-red-800 bg-transparent px-2 text-sm sm:text-base placeholder:text-slate-400"
                    />
                  </div>
                  <div className="sm:col-span-1 md:col-span-2 flex items-center gap-2">
                    <span className="font-black text-slate-900 shrink-0 text-sm sm:text-base">Ward No.:</span>
                    <input
                      type="text"
                      value={wardNo}
                      onChange={(e) => setWardNo(e.target.value)}
                      placeholder="e.g. 10"
                      className="w-full h-11 border-b-2 border-slate-400 font-bold focus:outline-none focus:border-red-800 bg-transparent px-2 text-sm sm:text-base placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Electronic Communication Grid Table */}
                <div className="border-2 border-slate-400 rounded-md overflow-hidden text-sm sm:text-base bg-white shadow-xs">
                  <div className="bg-slate-800 text-white font-black px-4 py-2.5 text-xs sm:text-sm uppercase tracking-wider flex items-center justify-between">
                    <span>Electronic Communication</span>
                    <span className="text-xs text-amber-300 font-semibold">
                      * Student Mobile and Father's contact required
                    </span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[650px] text-left divide-y divide-slate-400 border-collapse">
                      <thead>
                        <tr className="bg-slate-100 font-black text-slate-800 border-b-2 border-slate-400 divide-x-2 divide-slate-400">
                          <th className="p-3.5 sm:p-4 text-sm sm:text-base w-1/5">Type</th>
                          <th className="p-3.5 sm:p-4 text-sm sm:text-base w-1/5 text-red-900 bg-red-50/50">
                            Student's (Mandatory)*
                          </th>
                          <th className="p-3.5 sm:p-4 text-sm sm:text-base w-1/5 text-red-900 bg-red-50/50">
                            Father's (Mandatory)*
                          </th>
                          <th className="p-3.5 sm:p-4 text-sm sm:text-base w-1/5">Mother's</th>
                          <th className="p-3.5 sm:p-4 text-sm sm:text-base w-1/5">Guardian's</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y-2 divide-slate-400">
                        {/* Row 1: Mobile */}
                        <tr className="divide-x-2 divide-slate-400 bg-white">
                          <td className="p-3.5 sm:p-4 font-black text-slate-900 text-sm sm:text-base">Mobile</td>
                          <td className="p-2 sm:p-3 bg-red-50/20">
                            <input
                              type="tel"
                              required
                              value={studentMobile}
                              onChange={(e) => setStudentMobile(e.target.value)}
                              placeholder="+977 Student Mobile"
                              className="w-full h-11 font-mono font-bold focus:outline-none focus:bg-red-50/50 bg-transparent px-2 text-sm sm:text-base rounded placeholder:text-slate-400"
                            />
                          </td>
                          <td className="p-2 sm:p-3 bg-red-50/20">
                            <input
                              type="tel"
                              required
                              value={mobileFather}
                              onChange={(e) => setMobileFather(e.target.value)}
                              placeholder="+977 Father Mobile"
                              className="w-full h-11 font-mono font-bold focus:outline-none focus:bg-red-50/50 bg-transparent px-2 text-sm sm:text-base rounded placeholder:text-slate-400"
                            />
                          </td>
                          <td className="p-2 sm:p-3">
                            <input
                              type="tel"
                              value={mobileMother}
                              onChange={(e) => setMobileMother(e.target.value)}
                              placeholder="+977 Mobile"
                              className="w-full h-11 font-mono font-bold focus:outline-none focus:bg-red-50/30 bg-transparent px-2 text-sm sm:text-base rounded placeholder:text-slate-400"
                            />
                          </td>
                          <td className="p-2 sm:p-3">
                            <input
                              type="tel"
                              value={mobileGuardian}
                              onChange={(e) => setMobileGuardian(e.target.value)}
                              placeholder="+977 Mobile"
                              className="w-full h-11 font-mono font-bold focus:outline-none focus:bg-red-50/30 bg-transparent px-2 text-sm sm:text-base rounded placeholder:text-slate-400"
                            />
                          </td>
                        </tr>

                        {/* Row 2: Landline */}
                        <tr className="divide-x-2 divide-slate-400 bg-slate-50/50">
                          <td className="p-3.5 sm:p-4 font-black text-slate-900 text-sm sm:text-base">Landline</td>
                          <td className="p-2 sm:p-3 text-center text-xs text-slate-400 font-mono">
                            N/A
                          </td>
                          <td className="p-2 sm:p-3">
                            <input
                              type="text"
                              value={landlineFather}
                              onChange={(e) => setLandlineFather(e.target.value)}
                              placeholder="Landline No."
                              className="w-full h-11 font-mono font-medium focus:outline-none focus:bg-red-50/30 bg-transparent px-2 text-sm sm:text-base rounded placeholder:text-slate-400"
                            />
                          </td>
                          <td className="p-2 sm:p-3">
                            <input
                              type="text"
                              value={landlineMother}
                              onChange={(e) => setLandlineMother(e.target.value)}
                              placeholder="Landline No."
                              className="w-full h-11 font-mono font-medium focus:outline-none focus:bg-red-50/30 bg-transparent px-2 text-sm sm:text-base rounded placeholder:text-slate-400"
                            />
                          </td>
                          <td className="p-2 sm:p-3">
                            <input
                              type="text"
                              value={landlineGuardian}
                              onChange={(e) => setLandlineGuardian(e.target.value)}
                              placeholder="Landline No."
                              className="w-full h-11 font-mono font-medium focus:outline-none focus:bg-red-50/30 bg-transparent px-2 text-sm sm:text-base rounded placeholder:text-slate-400"
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Parental & Guardian Info */}
                <div className="border-2 border-slate-400 p-4 sm:p-6 rounded-md bg-white space-y-4 text-sm sm:text-base shadow-xs">
                  {/* Father's Info (* Mandatory) */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                    <div className="sm:col-span-7 flex items-center gap-2">
                      <label className="font-black text-slate-900 shrink-0 text-sm sm:text-base">
                        Father's Name:<span className="text-red-600 font-black ml-0.5">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={fatherName}
                        onChange={(e) => setFatherName(e.target.value)}
                        placeholder="Father's Full Name (Mandatory)"
                        className="w-full h-11 font-bold border-b-2 border-slate-400 focus:outline-none focus:border-red-800 bg-transparent px-2 text-sm sm:text-base placeholder:text-slate-400"
                      />
                    </div>
                    <div className="sm:col-span-5 flex items-center gap-2">
                      <label className="font-black text-slate-900 shrink-0 text-sm sm:text-base">Profession:</label>
                      <input
                        type="text"
                        value={fatherProfession}
                        onChange={(e) => setFatherProfession(e.target.value)}
                        placeholder="Father's Profession"
                        className="w-full h-11 font-bold border-b-2 border-slate-400 focus:outline-none focus:border-red-800 bg-transparent px-2 text-sm sm:text-base placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  {/* Mother's Info (* Mandatory) */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                    <div className="sm:col-span-7 flex items-center gap-2">
                      <label className="font-black text-slate-900 shrink-0 text-sm sm:text-base">
                        Mother's Name:<span className="text-red-600 font-black ml-0.5">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={motherName}
                        onChange={(e) => setMotherName(e.target.value)}
                        placeholder="Mother's Full Name"
                        className="w-full h-11 font-bold border-b-2 border-slate-400 focus:outline-none focus:border-red-800 bg-transparent px-2 text-sm sm:text-base placeholder:text-slate-400"
                      />
                    </div>
                    <div className="sm:col-span-5 flex items-center gap-2">
                      <label className="font-black text-slate-900 shrink-0 text-sm sm:text-base">Profession:</label>
                      <input
                        type="text"
                        value={motherProfession}
                        onChange={(e) => setMotherProfession(e.target.value)}
                        placeholder="Mother's Profession"
                        className="w-full h-11 font-bold border-b-2 border-slate-400 focus:outline-none focus:border-red-800 bg-transparent px-2 text-sm sm:text-base placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  {/* Guardian's Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                    <div className="sm:col-span-7 flex items-center gap-2">
                      <label className="font-black text-slate-900 shrink-0 text-sm sm:text-base">Guardian's Name:</label>
                      <input
                        type="text"
                        value={guardianName}
                        onChange={(e) => setGuardianName(e.target.value)}
                        placeholder="Guardian's Name (if applicable)"
                        className="w-full h-11 font-bold border-b-2 border-slate-400 focus:outline-none focus:border-red-800 bg-transparent px-2 text-sm sm:text-base placeholder:text-slate-400"
                      />
                    </div>
                    <div className="sm:col-span-5 flex items-center gap-2">
                      <label className="font-black text-slate-900 shrink-0 text-sm sm:text-base">Profession:</label>
                      <input
                        type="text"
                        value={guardianProfession}
                        onChange={(e) => setGuardianProfession(e.target.value)}
                        placeholder="Guardian's Profession"
                        className="w-full h-11 font-bold border-b-2 border-slate-400 focus:outline-none focus:border-red-800 bg-transparent px-2 text-sm sm:text-base placeholder:text-slate-400"
                      />
                    </div>
                  </div>
                </div>

                {/* Address for Communication (Primary Address - Mandatory) */}
                <div className="border-2 border-slate-400 p-4 sm:p-5 rounded-md bg-white space-y-2 text-sm sm:text-base shadow-xs">
                  <div className="flex items-center justify-between">
                    <label className="font-black text-slate-900 block text-sm sm:text-base">
                      Primary Address (Permanent Residence Address):
                      <span className="text-red-600 font-black ml-0.5">*</span>
                    </label>
                    <span className="text-xs text-red-800 font-bold uppercase">
                      Mandatory Field
                    </span>
                  </div>
                  <textarea
                    rows={2}
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Full Street, House No., Tole, Ward, Village / City Address (Mandatory)"
                    className="w-full border-2 border-slate-300 p-3 sm:p-4 font-medium focus:outline-none focus:border-red-800 rounded-md bg-slate-50/50 text-sm sm:text-base min-h-[90px] leading-relaxed placeholder:text-slate-400"
                  />
                </div>

                {/* Seeking Admission For Section (Renamed Levels & Neutral Defaults) */}
                <div className="border-2 border-slate-400 rounded-md p-5 sm:p-6 bg-white space-y-6 text-sm sm:text-base shadow-xs">
                  <div className="flex items-center justify-between border-b-2 border-slate-200 pb-2">
                    <span className="font-black text-slate-900 uppercase tracking-wider text-sm sm:text-base">
                      Seeking Admission For:<span className="text-red-600 font-black ml-0.5">*</span>
                    </span>
                    {selectedGrade && (
                      <span className="text-xs font-black uppercase text-red-900 bg-red-50 border border-red-200 px-2.5 py-1 rounded">
                        Selected: {selectedGrade}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 divide-y sm:divide-y-0 sm:divide-x-2 divide-slate-300">
                    {/* Pre-School Column */}
                    <div className="space-y-2.5">
                      <span className="font-black text-red-900 block text-xs sm:text-sm uppercase tracking-wider">
                        Pre-School
                      </span>
                      <div className="space-y-2">
                        {preSchoolGrades.map((g) => (
                          <label key={g} className="flex items-center gap-2.5 sm:gap-3 cursor-pointer font-bold text-slate-800 hover:text-slate-950 py-1.5 px-2 rounded-md hover:bg-red-50/50 text-sm sm:text-base transition">
                            <input
                              type="checkbox"
                              checked={selectedGrade === g}
                              onChange={() => {
                                const nextGrade = selectedGrade === g ? "" : g;
                                setSelectedGrade(nextGrade);
                                setOfficeClass(nextGrade);
                              }}
                              className="w-5 h-5 accent-red-800 cursor-pointer rounded"
                            />
                            <span>{g}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Basic Level Column (Class 1 to Class 8) */}
                    <div className="pt-4 sm:pt-0 sm:pl-6 space-y-2.5">
                      <span className="font-black text-red-900 block text-xs sm:text-sm uppercase tracking-wider">
                        Basic Level
                      </span>
                      <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                        {basicLevelGrades.map((g) => (
                          <label key={g} className="flex items-center gap-2 cursor-pointer font-bold text-slate-800 hover:text-slate-950 py-1.5 px-2 rounded-md hover:bg-red-50/50 text-sm sm:text-base transition">
                            <input
                              type="checkbox"
                              checked={selectedGrade === g}
                              onChange={() => {
                                const nextGrade = selectedGrade === g ? "" : g;
                                setSelectedGrade(nextGrade);
                                setOfficeClass(nextGrade);
                              }}
                              className="w-5 h-5 accent-red-800 cursor-pointer rounded"
                            />
                            <span>{g}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Secondary Level Column (Class 9 to Class 12) */}
                    <div className="pt-4 sm:pt-0 sm:pl-6 space-y-2.5">
                      <span className="font-black text-red-900 block text-xs sm:text-sm uppercase tracking-wider">
                        Secondary Level
                      </span>
                      <div className="space-y-2">
                        {secondaryLevelGrades.map((g) => (
                          <label
                            key={g}
                            className={`flex items-center gap-2.5 sm:gap-3 cursor-pointer font-bold py-1.5 px-2.5 rounded-md transition ${
                              selectedGrade === g
                                ? "bg-red-100 text-red-950 border border-red-300 shadow-xs"
                                : "text-slate-800 hover:text-slate-950 hover:bg-red-50/50"
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={selectedGrade === g}
                              onChange={() => {
                                const nextGrade = selectedGrade === g ? "" : g;
                                setSelectedGrade(nextGrade);
                                setOfficeClass(nextGrade);
                              }}
                              className="w-5 h-5 accent-red-800 cursor-pointer rounded"
                            />
                            <span>{g}</span>
                            {(g === "Class 11" || g === "Class 12") && (
                              <span className="text-[10px] font-black uppercase text-red-800 bg-white border border-red-300 px-1.5 py-0.5 rounded ml-auto">
                                + Faculty
                              </span>
                            )}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* CONDITIONAL FACULTY STREAM SELECTION (FOR CLASS 11 & CLASS 12) */}
                  {(selectedGrade === "Class 11" ||
                    selectedGrade === "Class 12" ||
                    selectedGrade.includes("11") ||
                    selectedGrade.includes("12")) && (
                    <div className="mt-6 pt-5 border-t-2 border-red-200 bg-red-50/40 p-4 sm:p-6 rounded-lg space-y-4 border border-red-300">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-red-200 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full bg-red-800 animate-pulse"></span>
                          <h3 className="font-black text-red-950 text-base sm:text-lg tracking-wide">
                            Faculty Name & Stream Selection for {selectedGrade}
                            <span className="text-red-600 ml-1">*</span>
                          </h3>
                        </div>
                        <span className="text-xs font-bold text-red-800 uppercase tracking-wider bg-white px-2.5 py-1 rounded border border-red-300">
                          Mandatory Selection
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-700 font-medium">
                        Please choose your specialized faculty stream for enrollment in {selectedGrade}:
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                        {/* 1. Science */}
                        <div
                          onClick={() => setSelectedFaculty("Science")}
                          className={`p-3.5 rounded-xl border-2 cursor-pointer transition flex flex-col justify-between ${
                            selectedFaculty === "Science"
                              ? "border-red-800 bg-white shadow-md ring-2 ring-red-800/20"
                              : "border-slate-300 bg-white hover:border-slate-400"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-black text-slate-900 text-sm sm:text-base">
                              Science
                            </span>
                            <input
                              type="radio"
                              name="faculty_choice"
                              checked={selectedFaculty === "Science"}
                              onChange={() => setSelectedFaculty("Science")}
                              className="w-4 h-4 accent-red-800"
                            />
                          </div>
                          <span className="text-[11px] text-slate-500 font-medium leading-tight">
                            Physics, Chemistry, Math & Stream options
                          </span>
                        </div>

                        {/* 2. Management */}
                        <div
                          onClick={() => {
                            setSelectedFaculty("Management");
                            setScienceSubStream("");
                          }}
                          className={`p-3.5 rounded-xl border-2 cursor-pointer transition flex flex-col justify-between ${
                            selectedFaculty === "Management"
                              ? "border-red-800 bg-white shadow-md ring-2 ring-red-800/20"
                              : "border-slate-300 bg-white hover:border-slate-400"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-black text-slate-900 text-sm sm:text-base">
                              Management
                            </span>
                            <input
                              type="radio"
                              name="faculty_choice"
                              checked={selectedFaculty === "Management"}
                              onChange={() => {
                                setSelectedFaculty("Management");
                                setScienceSubStream("");
                              }}
                              className="w-4 h-4 accent-red-800"
                            />
                          </div>
                          <span className="text-[11px] text-slate-500 font-medium leading-tight">
                            Business Studies, Economics, Accountancy
                          </span>
                        </div>

                        {/* 3. Hotel Management */}
                        <div
                          onClick={() => {
                            setSelectedFaculty("Hotel Management");
                            setScienceSubStream("");
                          }}
                          className={`p-3.5 rounded-xl border-2 cursor-pointer transition flex flex-col justify-between ${
                            selectedFaculty === "Hotel Management"
                              ? "border-red-800 bg-white shadow-md ring-2 ring-red-800/20"
                              : "border-slate-300 bg-white hover:border-slate-400"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-black text-slate-900 text-sm sm:text-base">
                              Hotel Management
                            </span>
                            <input
                              type="radio"
                              name="faculty_choice"
                              checked={selectedFaculty === "Hotel Management"}
                              onChange={() => {
                                setSelectedFaculty("Hotel Management");
                                setScienceSubStream("");
                              }}
                              className="w-4 h-4 accent-red-800"
                            />
                          </div>
                          <span className="text-[11px] text-slate-500 font-medium leading-tight">
                            Hospitality, Culinary Arts, Tourism
                          </span>
                        </div>

                        {/* 4. Commerce */}
                        <div
                          onClick={() => {
                            setSelectedFaculty("Commerce");
                            setScienceSubStream("");
                          }}
                          className={`p-3.5 rounded-xl border-2 cursor-pointer transition flex flex-col justify-between ${
                            selectedFaculty === "Commerce"
                              ? "border-red-800 bg-white shadow-md ring-2 ring-red-800/20"
                              : "border-slate-300 bg-white hover:border-slate-400"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-black text-slate-900 text-sm sm:text-base">
                              Commerce
                            </span>
                            <input
                              type="radio"
                              name="faculty_choice"
                              checked={selectedFaculty === "Commerce"}
                              onChange={() => {
                                setSelectedFaculty("Commerce");
                                setScienceSubStream("");
                              }}
                              className="w-4 h-4 accent-red-800"
                            />
                          </div>
                          <span className="text-[11px] text-slate-500 font-medium leading-tight">
                            Finance, Banking, Commercial Studies
                          </span>
                        </div>

                        {/* 5. Education */}
                        <div
                          onClick={() => {
                            setSelectedFaculty("Education");
                            setScienceSubStream("");
                          }}
                          className={`p-3.5 rounded-xl border-2 cursor-pointer transition flex flex-col justify-between ${
                            selectedFaculty === "Education"
                              ? "border-red-800 bg-white shadow-md ring-2 ring-red-800/20"
                              : "border-slate-300 bg-white hover:border-slate-400"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-black text-slate-900 text-sm sm:text-base">
                              Education
                            </span>
                            <input
                              type="radio"
                              name="faculty_choice"
                              checked={selectedFaculty === "Education"}
                              onChange={() => {
                                setSelectedFaculty("Education");
                                setScienceSubStream("");
                              }}
                              className="w-4 h-4 accent-red-800"
                            />
                          </div>
                          <span className="text-[11px] text-slate-500 font-medium leading-tight">
                            Pedagogy, Social Sciences, Instructional Dev
                          </span>
                        </div>
                      </div>

                      {/* Special Science Sub-stream Selection: Computer Science or Bioscience (biology) */}
                      {selectedFaculty === "Science" && (
                        <div className="mt-4 p-4 bg-white border-2 border-red-800/40 rounded-xl space-y-3 shadow-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-black text-slate-900 text-sm sm:text-base">
                              Choose Science Specialization Stream:<span className="text-red-600 font-black ml-0.5">*</span>
                            </span>
                            <span className="text-xs text-red-800 font-bold">
                              Computer Science OR Bioscience (Biology)
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <label
                              className={`p-3 rounded-lg border-2 flex items-center gap-3 cursor-pointer transition ${
                                scienceSubStream === "Computer Science"
                                  ? "border-red-800 bg-red-50 text-red-950 font-black"
                                  : "border-slate-300 hover:border-slate-400 font-bold text-slate-800"
                              }`}
                            >
                              <input
                                type="radio"
                                name="science_substream"
                                checked={scienceSubStream === "Computer Science"}
                                onChange={() => setScienceSubStream("Computer Science")}
                                className="w-4 h-4 accent-red-800"
                              />
                              <div>
                                <span className="block text-sm sm:text-base">Computer Science</span>
                                <span className="text-[11px] font-medium text-slate-500 block">
                                  Includes Programming, Systems & Digital Logic
                                </span>
                              </div>
                            </label>

                            <label
                              className={`p-3 rounded-lg border-2 flex items-center gap-3 cursor-pointer transition ${
                                scienceSubStream === "Bioscience (Biology)"
                                  ? "border-red-800 bg-red-50 text-red-950 font-black"
                                  : "border-slate-300 hover:border-slate-400 font-bold text-slate-800"
                              }`}
                            >
                              <input
                                type="radio"
                                name="science_substream"
                                checked={scienceSubStream === "Bioscience (Biology)"}
                                onChange={() => setScienceSubStream("Bioscience (Biology)")}
                                className="w-4 h-4 accent-red-800"
                              />
                              <div>
                                <span className="block text-sm sm:text-base">Bioscience (Biology)</span>
                                <span className="text-[11px] font-medium text-slate-500 block">
                                  Includes Zoology, Botany & Pre-Medical prep
                                </span>
                              </div>
                            </label>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Additional Info Box */}
                <div className="border-2 border-slate-400 p-4 sm:p-5 rounded-md bg-slate-50/70 space-y-3 text-sm sm:text-base">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <label className="font-black text-slate-900 shrink-0 text-sm sm:text-base">Allergies:</label>
                      <input
                        type="text"
                        value={allergies}
                        onChange={(e) => setAllergies(e.target.value)}
                        placeholder="Specify if any"
                        className="w-full h-11 font-medium border-b-2 border-slate-400 focus:outline-none focus:border-red-800 bg-transparent px-2 text-sm sm:text-base placeholder:text-slate-400"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="font-black text-slate-900 shrink-0 text-sm sm:text-base">Special Needs:</label>
                      <input
                        type="text"
                        value={specialNeeds}
                        onChange={(e) => setSpecialNeeds(e.target.value)}
                        placeholder="Learning/health conditions"
                        className="w-full h-11 font-medium border-b-2 border-slate-400 focus:outline-none focus:border-red-800 bg-transparent px-2 text-sm sm:text-base placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm italic text-slate-600 leading-relaxed">
                    "Such as allergies to special drugs, learning disabilities, health issues or any such information vital to the well-being of the student that has to be brought to the notice of FactFusion Hub."
                  </p>
                </div>
              </div>

              {/* ========================================================================= */}
              {/* SECTION 2: BRIEF ACADEMIC HISTORY */}
              {/* ========================================================================= */}
              <div className="space-y-4">
                <div className="bg-[#8B0000] text-white px-5 sm:px-6 py-3 rounded-md font-black text-sm sm:text-base uppercase tracking-wider border border-red-900 shadow-xs">
                  2. BRIEF ACADEMIC HISTORY
                </div>

                <div className="border-2 border-slate-400 rounded-md overflow-hidden text-sm sm:text-base bg-white shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[550px] border-collapse">
                      <tbody>
                        {/* Row 1: Previous School */}
                        <tr className="border-b-2 border-slate-400 bg-white">
                          <td className="p-3.5 sm:p-4 font-black text-slate-900 w-52 sm:w-60 border-r-2 border-slate-400 bg-slate-100 text-sm sm:text-base">
                            Previous School:
                          </td>
                          <td className="p-2 sm:p-3" colSpan={3}>
                            <input
                              id="academic-prev-school"
                              type="text"
                              value={prevSchool}
                              onChange={(e) => setPrevSchool(e.target.value)}
                              placeholder="Name of previous school / institute"
                              className="w-full h-11 font-bold focus:outline-none bg-transparent px-2 text-slate-900 text-sm sm:text-base placeholder:text-slate-400"
                            />
                          </td>
                        </tr>

                        {/* Row 2: Studied last standard | Result: (Passed/Failed) | GPA */}
                        <tr className="border-b-2 border-slate-400 bg-slate-50/30 divide-x-2 divide-slate-400">
                          <td className="p-3.5 sm:p-4 font-black text-slate-900 w-52 sm:w-60 bg-slate-100 text-sm sm:text-base">
                            Studied last standard:
                          </td>
                          <td className="p-2 sm:p-3">
                            <input
                              id="academic-studied-standard"
                              type="text"
                              value={studiedStandard}
                              onChange={(e) => setStudiedStandard(e.target.value)}
                              placeholder="e.g. Class 10 (SEE Board)"
                              className="w-full h-11 font-bold focus:outline-none bg-transparent px-2 text-slate-900 text-sm sm:text-base placeholder:text-slate-400"
                            />
                          </td>
                          <td className="p-3.5 sm:p-4 font-black text-slate-900 w-60 sm:w-68 bg-slate-100 text-sm sm:text-base">
                            <div className="flex items-center justify-between">
                              <span>Result:</span>
                              <div className="inline-flex items-center gap-3 font-bold">
                                <label className="flex items-center gap-2 cursor-pointer text-sm sm:text-base py-1 px-2 rounded-md hover:bg-slate-200/60">
                                  <input
                                    id="academic-result-passed"
                                    type="radio"
                                    name="academicResult"
                                    checked={academicResult === "Passed"}
                                    onChange={() => setAcademicResult("Passed")}
                                    className="w-5 h-5 accent-red-800 cursor-pointer"
                                  />
                                  <span>Passed</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer text-sm sm:text-base py-1 px-2 rounded-md hover:bg-slate-200/60">
                                  <input
                                    id="academic-result-failed"
                                    type="radio"
                                    name="academicResult"
                                    checked={academicResult === "Failed"}
                                    onChange={() => setAcademicResult("Failed")}
                                    className="w-5 h-5 accent-red-800 cursor-pointer"
                                  />
                                  <span>Failed</span>
                                </label>
                              </div>
                            </div>
                          </td>
                          <td className="p-2 sm:p-3 w-40 sm:w-48">
                            <div className="flex items-center gap-2">
                              <span className="font-black text-slate-900 shrink-0 text-sm sm:text-base">GPA:</span>
                              <input
                                id="academic-gpa"
                                type="text"
                                value={gpa}
                                onChange={(e) => setGpa(e.target.value)}
                                placeholder="3.75"
                                className="w-full h-11 font-mono font-bold focus:outline-none bg-transparent px-2 text-slate-900 text-sm sm:text-base placeholder:text-slate-400"
                              />
                            </div>
                          </td>
                        </tr>

                        {/* Row 3: Reasons for Leaving */}
                        <tr className="bg-white">
                          <td className="p-3.5 sm:p-4 font-black text-slate-900 w-52 sm:w-60 border-r-2 border-slate-400 bg-slate-100 text-sm sm:text-base">
                            Reasons for Leaving:
                          </td>
                          <td className="p-2 sm:p-3" colSpan={3}>
                            <input
                              id="academic-reasons-leaving"
                              type="text"
                              value={reasonsForLeaving}
                              onChange={(e) => setReasonsForLeaving(e.target.value)}
                              placeholder="e.g. Completed SEE / Course Completion"
                              className="w-full h-11 font-medium focus:outline-none bg-transparent px-2 text-slate-900 text-sm sm:text-base placeholder:text-slate-400"
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* ========================================================================= */}
              {/* SECTION 3: DECLARATION */}
              {/* ========================================================================= */}
              <div className="space-y-4">
                <div className="bg-[#8B0000] text-white px-5 sm:px-6 py-3 rounded-md font-black text-sm sm:text-base uppercase tracking-wider border border-red-900 shadow-xs">
                  3. DECLARATION
                </div>

                <div className="border-2 border-slate-400 p-5 sm:p-8 rounded-md bg-white space-y-8 text-sm sm:text-base shadow-xs">
                  <p className="text-sm sm:text-base md:text-lg text-slate-800 font-serif leading-relaxed text-center italic max-w-4xl mx-auto">
                    "We, hereby, solemnly declare and affirm that we have carefully studied and understood the rules and regulations of the school, and accept and undertake to abide by the same and any changes introduced by future amendments."
                  </p>

                  {/* Signature Alignment: Exactly two signature spaces side-by-side with generous vertical distance */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 sm:gap-20 pt-28 sm:pt-44 pb-8">
                    <div className="text-center space-y-3 flex flex-col items-center justify-end">
                      {/* Generous vertical clearance space for student signature */}
                      <div className="h-32 sm:h-44 w-full flex items-end justify-center pb-2 border-b border-dashed border-slate-200">
                        <span className="text-xs text-slate-400 font-medium italic select-none">
                          (Student Official Signature Space)
                        </span>
                      </div>
                      <div className="border-b-2 border-dotted border-slate-800 w-64 sm:w-80 mx-auto mt-2"></div>
                      <p className="font-black text-slate-900 text-sm sm:text-base mt-2">Student's Signature</p>
                      <p className="text-xs text-slate-500 font-mono">Date: ________________________</p>
                    </div>

                    <div className="text-center space-y-3 flex flex-col items-center justify-end">
                      {/* Generous vertical clearance space for parent/guardian signature */}
                      <div className="h-32 sm:h-44 w-full flex items-end justify-center pb-2 border-b border-dashed border-slate-200">
                        <span className="text-xs text-slate-400 font-medium italic select-none">
                          (Parent / Legal Guardian Signature Space)
                        </span>
                      </div>
                      <div className="border-b-2 border-dotted border-slate-800 w-64 sm:w-80 mx-auto mt-2"></div>
                      <p className="font-black text-slate-900 text-sm sm:text-base mt-2">Parent's / Guardian's Signature</p>
                      <p className="text-xs text-slate-500 font-mono">Date: ________________________</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* ========================================================================= */}
              {/* DOTTED SEPARATOR LINE */}
              {/* ========================================================================= */}
              <div className="py-4 sm:py-6">
                <div className="border-b-2 border-dashed border-slate-600 relative">
                  <span className="hidden sm:inline-block absolute left-1/2 -top-3.5 -translate-x-1/2 bg-white px-4 text-xs font-black uppercase tracking-widest text-slate-500 border border-slate-200 rounded-full">
                    OFFICE PROCESSING SECTION BELOW
                  </span>
                </div>
              </div>

              {/* ========================================================================= */}
              {/* SECTION 4: FOR OFFICE USE ONLY */}
              {/* ========================================================================= */}
              <div className="space-y-4">
                <div className="bg-[#8B0000] text-white px-5 sm:px-6 py-3 rounded-md font-black text-sm sm:text-base uppercase tracking-wider border border-red-900 shadow-xs">
                  4. FOR OFFICE USE ONLY
                </div>

                <div className="border-2 border-slate-400 p-5 sm:p-7 rounded-md bg-slate-50/90 space-y-5 text-sm sm:text-base shadow-xs">
                  {/* Registration & Track Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-slate-900 shrink-0 text-sm sm:text-base">FactFusion Regd. No.:</span>
                      <input
                        type="text"
                        value={regdNo}
                        onChange={(e) => setRegdNo(e.target.value)}
                        placeholder="e.g. REG-2026-001"
                        className="w-full h-11 font-mono font-bold border-b-2 border-slate-400 focus:outline-none focus:border-red-800 bg-transparent px-2 text-sm sm:text-base placeholder:text-slate-400"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-black text-slate-900 shrink-0 text-sm sm:text-base">Date of Submission:</span>
                      <input
                        type="date"
                        value={submissionDate}
                        onChange={(e) => setSubmissionDate(e.target.value)}
                        className="w-full h-11 font-mono font-bold border-b-2 border-slate-400 focus:outline-none focus:border-red-800 bg-transparent px-2 text-sm sm:text-base"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-black text-slate-900 shrink-0 text-sm sm:text-base">Receipt No.:</span>
                      <input
                        type="text"
                        value={receiptNo}
                        onChange={(e) => setReceiptNo(e.target.value)}
                        placeholder="Auto-generated upon submit"
                        className="w-full h-11 font-mono font-bold border-b-2 border-slate-400 focus:outline-none focus:border-red-800 bg-transparent px-2 text-sm sm:text-base placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  {/* Student's Name */}
                  <div className="flex items-center gap-3">
                    <span className="font-black text-slate-900 shrink-0 text-base sm:text-lg">Student's Name:</span>
                    <input
                      type="text"
                      value={officeStudentName || studentName}
                      onChange={(e) => setOfficeStudentName(e.target.value)}
                      placeholder="Student's Full Name"
                      className="w-full h-12 font-black uppercase border-b-2 border-slate-400 focus:outline-none focus:border-red-800 bg-transparent px-2 text-base sm:text-lg placeholder:text-slate-400"
                    />
                  </div>

                  {/* Grid fields: 5 fields responsive */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4 border-2 border-slate-300 p-3.5 sm:p-4 bg-white rounded-md">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-slate-900 shrink-0 text-sm sm:text-base">Class:</span>
                      <input
                        type="text"
                        value={officeClass || selectedGrade}
                        onChange={(e) => setOfficeClass(e.target.value)}
                        placeholder="e.g. Class 11"
                        className="w-full h-11 font-bold border-b-2 border-slate-300 focus:outline-none focus:border-red-800 bg-transparent px-1 text-sm sm:text-base placeholder:text-slate-400"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-black text-slate-900 shrink-0 text-sm sm:text-base">Section:</span>
                      <input
                        type="text"
                        value={officeSection}
                        onChange={(e) => setOfficeSection(e.target.value)}
                        placeholder="A/B"
                        className="w-full h-11 font-bold border-b-2 border-slate-300 focus:outline-none focus:border-red-800 bg-transparent px-1 text-sm sm:text-base placeholder:text-slate-400"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-black text-slate-900 shrink-0 text-sm sm:text-base">Roll No.:</span>
                      <input
                        type="text"
                        value={officeRollNo}
                        onChange={(e) => setOfficeRollNo(e.target.value)}
                        placeholder="Roll #"
                        className="w-full h-11 font-mono font-bold border-b-2 border-slate-300 focus:outline-none focus:border-red-800 bg-transparent px-1 text-sm sm:text-base placeholder:text-slate-400"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-black text-slate-900 shrink-0 text-sm sm:text-base">House:</span>
                      <input
                        type="text"
                        value={officeHouse}
                        onChange={(e) => setOfficeHouse(e.target.value)}
                        placeholder="Red/Blue"
                        className="w-full h-11 font-bold border-b-2 border-slate-300 focus:outline-none focus:border-red-800 bg-transparent px-1 text-sm sm:text-base placeholder:text-slate-400"
                      />
                    </div>

                    <div className="col-span-2 sm:col-span-1 flex items-center gap-2">
                      <span className="font-black text-slate-900 shrink-0 text-sm sm:text-base">Acad. Year:</span>
                      <input
                        type="text"
                        value={officeAcademicYear}
                        onChange={(e) => setOfficeAcademicYear(e.target.value)}
                        placeholder="2026/2027"
                        className="w-full h-11 font-bold border-b-2 border-slate-300 focus:outline-none focus:border-red-800 bg-transparent px-1 text-sm sm:text-base placeholder:text-slate-400"
                      />
                    </div>
                  </div>

                  {/* Approval Signature with generous vertical space for Principal */}
                  <div className="pt-28 sm:pt-44 pb-8 flex justify-end">
                    <div className="text-center space-y-3 w-64 sm:w-80 flex flex-col items-center justify-end">
                      {/* Generous vertical clearance space for Principal official seal and signature */}
                      <div className="h-36 sm:h-48 w-full flex items-end justify-center pb-2 border-b border-dashed border-slate-300">
                        <span className="text-xs text-slate-400 font-medium italic select-none">
                          (Principal Signature & Official Seal Space)
                        </span>
                      </div>
                      <div className="border-b-2 border-dotted border-slate-800 w-full mt-2"></div>
                      <p className="font-black text-slate-900 uppercase tracking-wider text-sm sm:text-base mt-2">
                        Principal's Signature & Seal
                      </p>
                      <p className="text-xs text-slate-500 font-mono">Date: ________________________</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Action Buttons (Sticky & Flush at Bottom Edge of Modal, Full Width) */}
            <div className="no-print sticky bottom-0 z-30 w-full bg-white/95 backdrop-blur-md border-t-2 border-slate-300 py-3.5 sm:py-4 px-4 sm:px-8 md:px-12 lg:px-16 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 shadow-[0_-10px_30px_rgba(0,0,0,0.12)] shrink-0 mt-auto">
              <button
                type="button"
                onClick={handlePrint}
                className="h-12 sm:h-13 px-5 sm:px-7 bg-slate-100 hover:bg-slate-200 active:scale-[0.98] text-slate-800 rounded-xl font-black text-sm sm:text-base flex items-center justify-center gap-2.5 border-2 border-slate-300 transition cursor-pointer shadow-xs"
              >
                <Printer className="w-5 h-5 text-slate-700" />
                <span>Print Blank Form (A4)</span>
              </button>

              <div className="flex items-center gap-3 sm:gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 sm:flex-none h-12 sm:h-13 px-6 sm:px-8 bg-slate-200 hover:bg-slate-300 active:scale-[0.98] text-slate-800 rounded-xl font-black text-sm sm:text-base transition cursor-pointer border border-slate-300 flex items-center justify-center"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 sm:flex-none h-12 sm:h-13 px-7 sm:px-10 bg-[#8B0000] hover:bg-red-900 active:scale-[0.98] text-white rounded-xl font-black text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-xl shadow-red-950/20 transition cursor-pointer disabled:opacity-50 border border-red-950"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                  <span>Save & Generate Receipt</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
