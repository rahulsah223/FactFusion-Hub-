import React, { useState, useEffect } from "react";
import {
  X,
  Search,
  Copy,
  Check,
  Download,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Printer,
  RefreshCw,
  HelpCircle,
} from "lucide-react";

interface PendingApplication {
  id: string;
  fullName: string;
  phoneNumber: string;
  emailAddress: string;
  classGradeSelection: string;
  facultyStream?: string;
  status: "Pending" | "Contacted" | "Approved" | "Rejected";
  submittedAt: string;
  adminNotes?: string;
  assignedStudentId?: string;
}

interface AdmitApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenOfficialForm?: (initialData?: {
    fullName?: string;
    phone?: string;
    email?: string;
    grade?: string;
    faculty?: string;
  }) => void;
  initialRefId?: string;
}

export const AdmitApplicationModal: React.FC<AdmitApplicationModalProps> = ({
  isOpen,
  onClose,
  onOpenOfficialForm,
  initialRefId = "",
}) => {
  // Modal View State: 'FORM' | 'CONFIRMATION' | 'STATUS'
  const [viewMode, setViewMode] = useState<"FORM" | "CONFIRMATION" | "STATUS">("FORM");

  // Form Field State
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [classGrade, setClassGrade] = useState("");
  const [facultyStream, setFacultyStream] = useState("");

  // Search & Status Lookup State
  const [searchRefId, setSearchRefId] = useState(initialRefId);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searchedApplication, setSearchedApplication] = useState<PendingApplication | null>(null);

  // Submission Result State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [submittedApp, setSubmittedApp] = useState<PendingApplication | null>(null);

  // Copy Feedback State
  const [copied, setCopied] = useState(false);

  // Sync initial ref id when modal opens
  useEffect(() => {
    if (isOpen && initialRefId) {
      setSearchRefId(initialRefId);
      handlePerformSearch(initialRefId);
    }
  }, [isOpen, initialRefId]);

  if (!isOpen) return null;

  // Handle Form Submission
  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validation
    if (!fullName.trim() || fullName.trim().length < 2) {
      setFormError("Please enter your full legal name.");
      return;
    }

    const digitsOnly = phoneNumber.replace(/[^0-9]/g, "");
    if (digitsOnly.length < 7) {
      setFormError("Please enter a valid phone number (at least 7 digits).");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailAddress.trim())) {
      setFormError("Please enter a valid email address.");
      return;
    }

    if (!classGrade) {
      setFormError("Please select a class or grade.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/pending-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          phoneNumber: phoneNumber.trim(),
          emailAddress: emailAddress.trim().toLowerCase(),
          classGradeSelection: classGrade,
          facultyStream: facultyStream || undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSubmittedApp(data.application);
        setViewMode("CONFIRMATION");
        
        // Trigger real-time sync event across system
        window.dispatchEvent(new CustomEvent("factfusion_sync_update"));
      } else {
        const errData = await res.json();
        setFormError(errData.error || "Failed to submit application.");
      }
    } catch (err) {
      setFormError("Network error while submitting application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Reference ID Search Lookup
  const handlePerformSearch = async (refToSearch?: string) => {
    const query = (refToSearch !== undefined ? refToSearch : searchRefId).trim();
    if (!query) {
      setSearchError("Please enter a Reference ID to search (e.g. APP-9082).");
      setViewMode("STATUS");
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    try {
      const res = await fetch(`/api/pending-applications/${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        setSearchedApplication(data);
        setViewMode("STATUS");
      } else {
        const errData = await res.json();
        setSearchedApplication(null);
        setSearchError(errData.error || `No record found for Reference ID "${query}".`);
        setViewMode("STATUS");
      }
    } catch (err) {
      setSearchError("Unable to connect to server. Please check your network.");
      setSearchedApplication(null);
      setViewMode("STATUS");
    } finally {
      setIsSearching(false);
    }
  };

  // Copy Reference ID helper
  const handleCopyRefId = (idToCopy: string) => {
    navigator.clipboard.writeText(idToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Generate & Download Application Summary PDF / Printable Document
  const handleDownloadSummaryPDF = (app: PendingApplication) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow popups to download/print your Application Summary.");
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Admission Summary - ${app.id}</title>
        <style>
          body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; color: #0f172a; max-width: 800px; margin: 0 auto; line-height: 1.5; }
          .header { border-bottom: 3px solid #8B0000; padding-bottom: 15px; margin-bottom: 25px; display: flex; justify-content: space-between; align-items: center; }
          .school-title { font-size: 22px; font-weight: 900; color: #8B0000; text-transform: uppercase; margin: 0; }
          .sub-title { font-size: 12px; font-weight: 700; color: #475569; margin-top: 4px; text-transform: uppercase; letter-spacing: 1px; }
          .badge { background-color: #fef3c7; color: #92400e; border: 1px solid #f59e0b; padding: 6px 14px; border-radius: 8px; font-weight: 800; font-family: monospace; font-size: 16px; }
          .ref-box { background: #f8fafc; border: 2px dashed #cbd5e1; padding: 20px; border-radius: 12px; margin-bottom: 25px; text-align: center; }
          .ref-title { font-size: 11px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 1px; }
          .ref-id { font-size: 28px; font-weight: 900; color: #0f172a; font-family: monospace; letter-spacing: 2px; margin: 5px 0; }
          .section-title { font-size: 14px; font-weight: 800; color: #8B0000; text-transform: uppercase; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin-top: 25px; margin-bottom: 15px; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
          .label { font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; }
          .value { font-size: 14px; font-weight: 800; color: #0f172a; }
          .status-pill { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 800; text-transform: uppercase; }
          .status-pending { background: #fef3c7; color: #92400e; }
          .status-approved { background: #dcfce7; color: #166534; }
          .instructions { background: #f1f5f9; padding: 15px; border-radius: 8px; margin-top: 25px; font-size: 12px; color: #334155; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; font-size: 11px; color: #94a3b8; }
          @media print {
            body { padding: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1 class="school-title">FactFusion Hub</h1>
            <div class="sub-title">Official Student Admission Summary & Receipt</div>
          </div>
          <div class="badge">${app.id}</div>
        </div>

        <div class="ref-box">
          <div class="ref-title">Application Reference Number</div>
          <div class="ref-id">${app.id}</div>
          <div style="font-size: 11px; color: #64748b;">Submitted on: ${new Date(app.submittedAt).toLocaleString()}</div>
        </div>

        <div class="section-title">1. Applicant Details</div>
        <div class="grid">
          <div>
            <div class="label">Full Name</div>
            <div class="value">${app.fullName}</div>
          </div>
          <div>
            <div class="label">Phone Number</div>
            <div class="value">${app.phoneNumber}</div>
          </div>
          <div>
            <div class="label">Email Address</div>
            <div class="value">${app.emailAddress}</div>
          </div>
          <div>
            <div class="label">Class / Grade</div>
            <div class="value">${app.classGradeSelection} ${app.facultyStream ? `(${app.facultyStream})` : ""}</div>
          </div>
        </div>

        <div class="section-title">2. Processing Status</div>
        <div class="grid">
          <div>
            <div class="label">Current Status</div>
            <div class="value">
              <span class="status-pill status-${app.status.toLowerCase()}">${app.status}</span>
            </div>
          </div>
          <div>
            <div class="label">Assigned Student Roll ID</div>
            <div class="value">${app.assignedStudentId || "Pending Verification"}</div>
          </div>
        </div>

        <div class="instructions">
          <strong>Instructions for Applicant:</strong>
          <ol style="margin-top: 8px; padding-left: 20px;">
            <li>Keep this document and Reference ID (<strong>${app.id}</strong>) safe.</li>
            <li>Our Admissions Team will contact you at <strong>${app.phoneNumber}</strong> for phone verification.</li>
            <li>To check application status online, visit our website, click "Admit / Apply Now", and type <strong>${app.id}</strong> into the status search bar.</li>
          </ol>
        </div>

        <div class="footer">
          FactFusion Hub • Admissions Office • Phone: +977 1-4400000 • Web: https://factfusionhub.edu.np
        </div>

        <div class="no-print" style="margin-top: 20px; text-align: center;">
          <button onclick="window.print()" style="background: #8B0000; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: bold; cursor: pointer;">
            Print / Save as PDF
          </button>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  // Reset Form
  const handleResetForm = () => {
    setFullName("");
    setPhoneNumber("");
    setEmailAddress("");
    setClassGrade("");
    setFacultyStream("");
    setFormError(null);
    setSubmittedApp(null);
    setViewMode("FORM");
  };

  return (
    <div
      className="modal-overlay show"
      id="admitModal"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}
    >
      <div
        className="login-card w-[95%] max-w-[820px] max-h-[92vh] md:max-h-[94vh] p-6 sm:p-8 md:p-9 shadow-2xl rounded-2xl overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.28)",
        }}
      >
        {/* Close Modal X Button */}
        <button className="close-modal" onClick={onClose} type="button">
          <i className="fa-solid fa-xmark"></i>
        </button>

        {/* Modal Header: Title */}
        <h2 style={{ margin: "0 0 10px 0", fontSize: "1.35rem", fontWeight: "bold" }}>Admit / Apply Now</h2>

        {/* Search Field & Track Button directly below Admit / Apply Now text */}
        <div className="flex items-center gap-2.5 mb-3">
          <div style={{ position: "relative", flex: 1, maxWidth: "340px" }}>
            <input
              type="text"
              value={searchRefId}
              onChange={(e) => setSearchRefId(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handlePerformSearch();
                }
              }}
              placeholder="Search Your Reference ID... (e.g. APP-9082)"
              style={{
                padding: "7px 28px 7px 32px",
                fontSize: "0.82rem",
                border: "1px solid #cbd5e1",
                borderRadius: "20px",
                outline: "none",
                width: "100%",
                background: "#f8fafc",
              }}
            />
            <Search style={{ position: "absolute", left: "10px", top: "8px", width: "15px", height: "15px", color: "#64748b" }} />
            {searchRefId && (
              <button
                type="button"
                onClick={() => setSearchRefId("")}
                style={{ position: "absolute", right: "10px", top: "7px", background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}
              >
                <X style={{ width: "14px", height: "14px" }} />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => handlePerformSearch()}
            disabled={isSearching}
            style={{
              background: "#0B4632",
              color: "white",
              border: "none",
              borderRadius: "20px",
              padding: "7px 18px",
              fontSize: "0.82rem",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            {isSearching ? (
              <RefreshCw className="animate-spin" style={{ width: "14px", height: "14px" }} />
            ) : (
              <Search style={{ width: "14px", height: "14px" }} />
            )}
            <span>Track</span>
          </button>
        </div>

        <p style={{ margin: "0 0 16px 0", fontSize: "0.83rem", color: "#64748b" }}>
          Submit registration details for new academic enrollment verification or track application status.
        </p>

        {/* Navigation Tabs Bar if searching or submitted */}
        {(submittedApp || viewMode === "STATUS") && (
          <div className="flex gap-2 sm:gap-4 mb-4">
            <button
              type="button"
              onClick={() => setViewMode("FORM")}
              style={{
                padding: "5px 12px",
                fontSize: "0.78rem",
                fontWeight: 700,
                borderRadius: "6px",
                border: "1px solid #cbd5e1",
                background: viewMode === "FORM" ? "#002B1D" : "white",
                color: viewMode === "FORM" ? "white" : "#334155",
                cursor: "pointer",
              }}
            >
              Application Form
            </button>

            {submittedApp && (
              <button
                type="button"
                onClick={() => setViewMode("CONFIRMATION")}
                style={{
                  padding: "5px 12px",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  borderRadius: "6px",
                  border: "1px solid #10b981",
                  background: viewMode === "CONFIRMATION" ? "#047857" : "#ecfdf5",
                  color: viewMode === "CONFIRMATION" ? "white" : "#047857",
                  cursor: "pointer",
                }}
              >
                Submission Receipt ({submittedApp.id})
              </button>
            )}

            {viewMode === "STATUS" && (
              <button
                type="button"
                style={{
                  padding: "5px 12px",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  borderRadius: "6px",
                  border: "1px solid #f59e0b",
                  background: "#fef3c7",
                  color: "#92400e",
                }}
              >
                Status Lookup
              </button>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 1: CLASSIC APPLY BUTTON FORM SCREEN */}
        {/* ========================================================================= */}
        {viewMode === "FORM" && (
          <>
            {onOpenOfficialForm && (
              <div style={{ marginBottom: "16px" }}>
                <button
                  type="button"
                  id="open-formal-a4-form-btn"
                  onClick={() => {
                    onClose();
                    onOpenOfficialForm({
                      fullName: fullName.trim(),
                      phone: phoneNumber.trim(),
                      email: emailAddress.trim(),
                      grade: classGrade,
                      faculty: facultyStream,
                    });
                  }}
                  className="w-full py-3 px-4 bg-[#8B0000] hover:bg-red-900 text-white rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2.5 border border-red-950 shadow-md hover:shadow-lg active:scale-[0.99] transition cursor-pointer"
                >
                  <i className="fa-solid fa-file-invoice text-amber-300 text-sm"></i>
                  <span>Open Formal A4 Printable Application Form</span>
                </button>
              </div>
            )}

            {formError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-bold mb-3">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmitApplication}>
              <div className="form-group">
                <label>
                  Full Name <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Rahul Shah"
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  Phone Number <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+977 9807695843"
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  Email Address <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  type="email"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  placeholder="student@example.com"
                  required
                />
              </div>

              <div className="form-group">
                <label>
                  Class / Grade Selection <span style={{ color: "red" }}>*</span>
                </label>
                <select
                  value={classGrade}
                  onChange={(e) => {
                    setClassGrade(e.target.value);
                    if (Number(e.target.value) <= 10) setFacultyStream("");
                  }}
                  required
                >
                  <option value="">-- Select Class --</option>
                  <option value="1">Grade 1</option>
                  <option value="2">Grade 2</option>
                  <option value="3">Grade 3</option>
                  <option value="4">Grade 4</option>
                  <option value="5">Grade 5</option>
                  <option value="6">Grade 6</option>
                  <option value="7">Grade 7</option>
                  <option value="8">Grade 8</option>
                  <option value="9">Grade 9</option>
                  <option value="10">Grade 10 (SEE)</option>
                  <option value="11">Grade 11</option>
                  <option value="12">Grade 12</option>
                </select>
              </div>

              {/* CONDITIONAL FACULTY FIELD (For Grade 11 & 12) */}
              {Number(classGrade) > 10 && (
                <div className="form-group">
                  <label>
                    Select Faculty / Stream <span style={{ color: "red" }}>*</span>
                  </label>
                  <select
                    value={facultyStream}
                    onChange={(e) => setFacultyStream(e.target.value)}
                    required
                  >
                    <option value="">-- Choose Faculty Stream --</option>
                    <option value="Science (Computer Science)">Science (Computer Science)</option>
                    <option value="Science (Bioscience / Biology)">Science (Bioscience / Biology)</option>
                    <option value="Management">Management</option>
                    <option value="Hotel Management">Hotel Management</option>
                    <option value="Commerce">Commerce</option>
                    <option value="Education">Education</option>
                  </select>
                </div>
              )}

              <button type="submit" className="submit-login-btn" disabled={isSubmitting}>
                {isSubmitting ? "Submitting Lead..." : "Submit Application"}
              </button>
            </form>
          </>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: CONFIRMATION SCREEN (IMMEDIATELY DISPLAYED UPON SUCCESSFUL SUBMISSION) */}
        {/* ========================================================================= */}
        {viewMode === "CONFIRMATION" && submittedApp && (
          <div className="space-y-4 animate-fadeIn">
            {/* Success Banner */}
            <div className="text-center p-5 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-black text-emerald-950">
                Application Submitted Successfully!
              </h3>
              <p className="text-xs text-emerald-800 font-medium">
                Your application has been logged into our admissions database.
              </p>

              {/* PROMINENT ASSIGNED REFERENCE ID BOX */}
              <div className="bg-white border-2 border-emerald-500 p-3.5 rounded-xl max-w-xs mx-auto shadow-sm space-y-1 mt-2">
                <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider block">
                  Your Reference ID
                </span>
                <div className="text-2xl font-black font-mono text-emerald-800 tracking-wider">
                  {submittedApp.id}
                </div>
                
                {/* Copy Button */}
                <div>
                  <button
                    type="button"
                    onClick={() => handleCopyRefId(submittedApp.id)}
                    className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-md inline-flex items-center gap-1.5 transition cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-300">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-amber-400" />
                        <span>Copy Reference ID</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* STRUCTURED NEXT STEPS INSTRUCTIONS */}
            <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-2.5">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Instructions for Applicant</span>
              </h4>

              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2 p-2 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="w-5 h-5 rounded bg-amber-100 text-amber-900 font-bold flex items-center justify-center shrink-0 text-[11px]">1</span>
                  <p className="text-slate-700 font-medium">
                    Save, copy, or take a screenshot of your Reference ID (<strong>{submittedApp.id}</strong>) for tracking.
                  </p>
                </div>

                <div className="flex items-start gap-2 p-2 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="w-5 h-5 rounded bg-emerald-100 text-emerald-900 font-bold flex items-center justify-center shrink-0 text-[11px]">2</span>
                  <p className="text-slate-700 font-medium">
                    Our Admissions Team will call <strong>{submittedApp.phoneNumber}</strong> within 24-48 business hours.
                  </p>
                </div>

                <div className="flex items-start gap-2 p-2 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="w-5 h-5 rounded bg-blue-100 text-blue-900 font-bold flex items-center justify-center shrink-0 text-[11px]">3</span>
                  <p className="text-slate-700 font-medium">
                    You can track your status anytime by clicking <strong>"Admit / Apply Now"</strong> on our website and searching your ID in the search bar.
                  </p>
                </div>
              </div>
            </div>

            {/* CONCISE GUIDANCE NOTE ON FUTURE STATUS TRACKING */}
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2 text-xs text-amber-900">
              <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-extrabold block">How to check your status in the future:</span>
                <p className="text-amber-900 font-medium mt-0.5">
                  Returning users can simply click the <strong>"Admit / Apply Now"</strong> button again on the website and locate the status search feature to track their application with <strong>{submittedApp.id}</strong>.
                </p>
              </div>
            </div>

            {/* DEDICATED BUTTONS: DOWNLOAD SUMMARY & TRACK NOW */}
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 pt-1">
              <button
                type="button"
                onClick={() => handleDownloadSummaryPDF(submittedApp)}
                className="w-full sm:flex-1 py-2.5 px-3 bg-[#8B0000] hover:bg-red-900 text-white font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition cursor-pointer"
              >
                <Download className="w-4 h-4 text-amber-300" />
                <span>Download Application Summary</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSearchRefId(submittedApp.id);
                  handlePerformSearch(submittedApp.id);
                }}
                className="w-full sm:w-auto py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <Search className="w-4 h-4 text-amber-400" />
                <span>Track Status Now</span>
              </button>
            </div>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={handleResetForm}
                className="text-xs text-slate-500 hover:text-slate-900 font-bold underline cursor-pointer"
              >
                Submit Another Application
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 3: STATUS LOOKUP RESULT DISPLAY */}
        {/* ========================================================================= */}
        {viewMode === "STATUS" && (
          <div className="space-y-4 animate-fadeIn">
            {searchError ? (
              <div className="p-5 bg-rose-50 border border-rose-200 rounded-2xl text-center space-y-2">
                <div className="w-10 h-10 mx-auto rounded-full bg-rose-100 text-rose-700 flex items-center justify-center">
                  <XCircle className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-black text-rose-950">Application Record Not Found</h4>
                <p className="text-xs text-rose-800 font-medium">
                  {searchError}
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setViewMode("FORM")}
                    className="px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg transition"
                  >
                    Return to Application Form
                  </button>
                </div>
              </div>
            ) : searchedApplication ? (
              <div className="space-y-4">
                {/* ID & Status Summary Card */}
                <div className="p-4 bg-slate-900 text-white rounded-2xl flex items-center justify-between gap-3 shadow-xs">
                  <div>
                    <span className="text-[10px] font-black uppercase text-amber-400 block">
                      Application Reference ID
                    </span>
                    <h3 className="text-xl font-black font-mono text-white tracking-wider">
                      {searchedApplication.id}
                    </h3>
                    <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                      Submitted: {new Date(searchedApplication.submittedAt).toLocaleString()}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDownloadSummaryPDF(searchedApplication)}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-lg flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Summary</span>
                  </button>
                </div>

                {/* Progression Stepper */}
                <div className="border border-slate-200 p-4 rounded-2xl bg-white space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                      Progression Stage
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase ${
                      searchedApplication.status === "Approved"
                        ? "bg-emerald-100 text-emerald-800"
                        : searchedApplication.status === "Contacted"
                        ? "bg-blue-100 text-blue-800"
                        : searchedApplication.status === "Rejected"
                        ? "bg-rose-100 text-rose-800"
                        : "bg-amber-100 text-amber-800"
                    }`}>
                      {searchedApplication.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
                    <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-xl space-y-0.5">
                      <div className="flex items-center justify-between text-emerald-700 font-bold text-[10px]">
                        <span>1. Logged</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      </div>
                      <p className="font-extrabold text-slate-900 text-[11px]">Submitted</p>
                    </div>

                    <div className={`p-2 border rounded-xl space-y-0.5 ${
                      ["Contacted", "Approved"].includes(searchedApplication.status)
                        ? "bg-emerald-50 border-emerald-200"
                        : "bg-slate-50 border-slate-200"
                    }`}>
                      <div className="flex items-center justify-between font-bold text-[10px] text-slate-600">
                        <span>2. Phone</span>
                        {["Contacted", "Approved"].includes(searchedApplication.status) ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Clock className="w-3.5 h-3.5 text-amber-500" />
                        )}
                      </div>
                      <p className="font-extrabold text-slate-900 text-[11px]">Verification</p>
                    </div>

                    <div className={`p-2 border rounded-xl space-y-0.5 ${
                      searchedApplication.status === "Approved"
                        ? "bg-emerald-50 border-emerald-200"
                        : "bg-slate-50 border-slate-200"
                    }`}>
                      <div className="flex items-center justify-between font-bold text-[10px] text-slate-600">
                        <span>3. Academic</span>
                        {searchedApplication.status === "Approved" ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                        )}
                      </div>
                      <p className="font-extrabold text-slate-900 text-[11px]">Review</p>
                    </div>

                    <div className={`p-2 border rounded-xl space-y-0.5 ${
                      searchedApplication.status === "Approved"
                        ? "bg-emerald-100 border-emerald-300"
                        : "bg-slate-50 border-slate-200"
                    }`}>
                      <div className="flex items-center justify-between font-bold text-[10px] text-slate-600">
                        <span>4. Outcome</span>
                        {searchedApplication.status === "Approved" && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                        )}
                      </div>
                      <p className="font-extrabold text-slate-900 text-[11px]">
                        {searchedApplication.status === "Approved" ? "Enrolled" : "Pending"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Applicant Name</span>
                    <p className="font-extrabold text-slate-900 mt-0.5">{searchedApplication.fullName}</p>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Applied Class / Stream</span>
                    <p className="font-extrabold text-slate-900 mt-0.5">
                      Grade {searchedApplication.classGradeSelection} {searchedApplication.facultyStream ? `(${searchedApplication.facultyStream})` : ""}
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Phone</span>
                    <p className="font-extrabold text-slate-900 mt-0.5">{searchedApplication.phoneNumber}</p>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">Email</span>
                    <p className="font-extrabold text-slate-900 mt-0.5">{searchedApplication.emailAddress}</p>
                  </div>
                </div>

                {searchedApplication.assignedStudentId && (
                  <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-emerald-800 block">Assigned Roll ID</span>
                      <p className="text-base font-black font-mono text-emerald-950">{searchedApplication.assignedStudentId}</p>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-600 text-white text-[11px] font-black rounded-md">
                      Official Roll Issued
                    </span>
                  </div>
                )}

                {searchedApplication.adminNotes && (
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-0.5">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Admissions Remarks</span>
                    <p className="text-slate-800 font-medium">"{searchedApplication.adminNotes}"</p>
                  </div>
                )}

                <div className="text-center pt-1">
                  <button
                    type="button"
                    onClick={() => setViewMode("FORM")}
                    className="px-3 py-1.5 bg-slate-100 text-slate-800 text-xs font-bold rounded-lg transition"
                  >
                    Back to Application Form
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        )}

      </div>
    </div>
  );
};
