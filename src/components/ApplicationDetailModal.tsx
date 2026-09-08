import React, { useState, useEffect } from "react";
import {
  X,
  Phone,
  Mail,
  GraduationCap,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  UserCheck,
  FileText,
  Save,
  Loader2,
  AlertCircle,
  ShieldCheck,
  Building,
} from "lucide-react";

export interface PendingApplicationDetail {
  id: string;
  fullName: string;
  phoneNumber: string;
  emailAddress: string;
  classGradeSelection: string;
  facultyStream?: string;
  status: "Pending" | "Contacted" | "Approved" | "Rejected";
  submittedAt: string;
  adminNotes?: string;
  processedBy?: string;
  processedAt?: string;
  studentIdAssigned?: string;
}

interface ApplicationDetailModalProps {
  applicationId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onApplicationUpdated?: () => void;
}

export const ApplicationDetailModal: React.FC<ApplicationDetailModalProps> = ({
  applicationId,
  isOpen,
  onClose,
  onApplicationUpdated,
}) => {
  const [appDetail, setAppDetail] = useState<PendingApplicationDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [adminNotes, setAdminNotes] = useState<string>("");
  const [savingNotes, setSavingNotes] = useState<boolean>(false);
  const [processingAction, setProcessingAction] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (applicationId && isOpen) {
      fetchApplicationDetail(applicationId);
    } else {
      setAppDetail(null);
      setErrorMsg(null);
      setSuccessMsg(null);
    }
  }, [applicationId, isOpen]);

  const fetchApplicationDetail = async (id: string) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/pending-applications/${id}`);
      if (res.ok) {
        const data: PendingApplicationDetail = await res.json();
        setAppDetail(data);
        setAdminNotes(data.adminNotes || "");
      } else {
        setErrorMsg("Failed to load application details.");
      }
    } catch (err) {
      setErrorMsg("Network error loading application data.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !applicationId) return null;

  const handleSaveNotes = async () => {
    setSavingNotes(true);
    try {
      const res = await fetch(`/api/pending-applications/${applicationId}/notes`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminNotes }),
      });
      if (res.ok) {
        setSuccessMsg("Call notes saved successfully!");
        setTimeout(() => setSuccessMsg(null), 3000);
        if (onApplicationUpdated) onApplicationUpdated();
      }
    } catch (err) {
      setErrorMsg("Failed to save notes.");
    } finally {
      setSavingNotes(false);
    }
  };

  const handleMarkContacted = async () => {
    setProcessingAction("contacted");
    try {
      const res = await fetch(`/api/pending-applications/${applicationId}/notes`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Contacted", adminNotes }),
      });
      if (res.ok) {
        const data = await res.json();
        setAppDetail(data.application);
        setSuccessMsg("Application status updated to 'Contacted'.");
        setTimeout(() => setSuccessMsg(null), 3000);
        if (onApplicationUpdated) onApplicationUpdated();
      }
    } catch (err) {
      setErrorMsg("Failed to update status.");
    } finally {
      setProcessingAction(null);
    }
  };

  const handleApproveAndEnroll = async () => {
    setProcessingAction("approve");
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/pending-applications/${applicationId}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminNotes,
          adminUser: "Super Administrator",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setAppDetail(data.application);
        setSuccessMsg(data.message || "Student approved and officially enrolled!");
        window.dispatchEvent(new CustomEvent("factfusion_sync_update"));
        if (onApplicationUpdated) onApplicationUpdated();
      } else {
        const errData = await res.json();
        setErrorMsg(errData.error || "Failed to process enrollment.");
      }
    } catch (err) {
      setErrorMsg("Error executing approval transaction.");
    } finally {
      setProcessingAction(null);
    }
  };

  const handleReject = async () => {
    setProcessingAction("reject");
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/pending-applications/${applicationId}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminNotes,
          adminUser: "Super Administrator",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setAppDetail(data.application);
        setSuccessMsg("Application marked as rejected/archived.");
        window.dispatchEvent(new CustomEvent("factfusion_sync_update"));
        if (onApplicationUpdated) onApplicationUpdated();
      } else {
        setErrorMsg("Failed to reject application.");
      }
    } catch (err) {
      setErrorMsg("Error processing rejection.");
    } finally {
      setProcessingAction(null);
    }
  };

  const formatDate = (isoStr?: string) => {
    if (!isoStr) return "N/A";
    try {
      return new Date(isoStr).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return isoStr;
    }
  };

  return (
    <div className="fixed inset-0 z-[6000] flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#0B4632] text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-black border border-emerald-500/30">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight">Pending Lead Verification</h3>
              <p className="text-xs text-[#A3B8B0]">Reference ID: {applicationId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-[#134537] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 custom-scrollbar flex-1">
          {loading ? (
            <div className="py-16 text-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#0B4632]" />
              <p className="text-xs font-bold text-slate-500">Retrieving applicant details...</p>
            </div>
          ) : appDetail ? (
            <>
              {/* Feedback Banners */}
              {successMsg && (
                <div className="p-3.5 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{successMsg}</span>
                </div>
              )}

              {errorMsg && (
                <div className="p-3.5 bg-rose-50 text-rose-800 rounded-xl border border-rose-200 text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Status Header Pill */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500">Current Status:</span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                      appDetail.status === "Approved"
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                        : appDetail.status === "Contacted"
                        ? "bg-blue-100 text-blue-800 border border-blue-300"
                        : appDetail.status === "Rejected"
                        ? "bg-rose-100 text-rose-800 border border-rose-300"
                        : "bg-amber-100 text-amber-900 border border-amber-300 animate-pulse"
                    }`}
                  >
                    {appDetail.status}
                  </span>
                </div>

                {appDetail.studentIdAssigned && (
                  <div className="flex items-center gap-1.5 text-xs font-black text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Enrolled ID: {appDetail.studentIdAssigned}</span>
                  </div>
                )}
              </div>

              {/* Applicant Metadata Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-1">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Full Legal Name</p>
                  <p className="text-sm font-black text-slate-900">{appDetail.fullName}</p>
                </div>

                {/* Phone Number with 1-Click Call */}
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs flex items-center justify-between gap-2">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase text-slate-400">Phone Number</p>
                    <p className="text-sm font-black text-slate-900">{appDetail.phoneNumber}</p>
                  </div>
                  <a
                    href={`tel:${appDetail.phoneNumber}`}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer shrink-0"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Now</span>
                  </a>
                </div>

                {/* Email Address */}
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-1">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Email Address</p>
                  <p className="text-sm font-bold text-slate-800 truncate">{appDetail.emailAddress}</p>
                </div>

                {/* Grade & Faculty */}
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-1">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Class & Stream</p>
                  <p className="text-sm font-black text-slate-900">
                    {appDetail.classGradeSelection}
                    {appDetail.facultyStream ? ` (${appDetail.facultyStream})` : ""}
                  </p>
                </div>

                {/* Submission Date */}
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-1">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Submission Timestamp</p>
                  <p className="text-xs font-bold text-slate-700">{formatDate(appDetail.submittedAt)}</p>
                </div>

                {/* Audit Information */}
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-1">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Processed Audit Log</p>
                  <p className="text-xs font-bold text-slate-700">
                    {appDetail.processedBy
                      ? `${appDetail.processedBy} on ${formatDate(appDetail.processedAt)}`
                      : "Pending Admin Audit"}
                  </p>
                </div>
              </div>

              {/* Administrative Call Notes Editable Textarea */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-[#0B4632]" />
                    <span>Administrative Verification Notes</span>
                  </label>
                  <button
                    onClick={handleSaveNotes}
                    disabled={savingNotes}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 transition disabled:opacity-50 cursor-pointer"
                  >
                    {savingNotes ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                    <span>Save Notes</span>
                  </button>
                </div>
                <textarea
                  rows={3}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Record call verification details, e.g.: 'Contacted parent. Student interested in CS & robotics. Verified SEE GPA standard.'"
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-slate-50/50"
                ></textarea>
              </div>

              {/* Action Buttons Toolbar */}
              <div className="pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* 1. Mark as Contacted */}
                <button
                  onClick={handleMarkContacted}
                  disabled={processingAction !== null || appDetail.status === "Approved"}
                  className="py-2.5 px-3 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-1.5 border border-blue-200 disabled:opacity-50 cursor-pointer"
                >
                  {processingAction === "contacted" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Clock className="w-4 h-4 text-blue-600" />
                  )}
                  <span>Mark as Contacted</span>
                </button>

                {/* 2. Reject / Archive */}
                <button
                  onClick={handleReject}
                  disabled={processingAction !== null || appDetail.status === "Approved" || appDetail.status === "Rejected"}
                  className="py-2.5 px-3 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-1.5 border border-rose-200 disabled:opacity-50 cursor-pointer"
                >
                  {processingAction === "reject" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-600" />
                  )}
                  <span>Reject / Archive</span>
                </button>

                {/* 3. Approve & Enroll */}
                {appDetail.status === "Approved" ? (
                  <div className="py-2.5 px-3 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-2xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    <span>Approved & Enrolled ✓</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleApproveAndEnroll}
                    disabled={processingAction !== null}
                    className="py-2.5 px-3 bg-[#0B4632] hover:bg-[#072e21] active:scale-[0.98] text-white rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50 cursor-pointer"
                  >
                    {processingAction === "approve" ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-amber-300" />
                    )}
                    <span>Approve & Enroll</span>
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="py-12 text-center text-slate-400">
              <AlertCircle className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              <p className="text-xs font-bold">Could not locate application details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
