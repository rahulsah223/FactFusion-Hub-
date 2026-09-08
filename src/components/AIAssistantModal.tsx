import React, { useState } from "react";
import {
  Sparkles,
  Zap,
  Brain,
  Image as ImageIcon,
  ScanEye,
  Video,
  MapPin,
  Search,
  Mail,
  Send,
  Loader2,
  Download,
  Upload,
  X,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { AspectRatioType, GeneratedImageRecord } from "../types";

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "thinking" | "fast" | "image" | "analyze-img" | "analyze-vid" | "maps" | "search" | "gmail";
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({ isOpen, onClose, defaultTab = "fast" }) => {
  const [activeTab, setActiveTab] = useState<
    "fast" | "thinking" | "image" | "analyze-img" | "analyze-vid" | "maps" | "search" | "gmail"
  >(defaultTab);

  // Fast & Thinking State
  const [prompt, setPrompt] = useState("");
  const [chatLog, setChatLog] = useState<{ role: "user" | "assistant"; text: string; model: string }[]>([]);
  const [loading, setLoading] = useState(false);

  // Image Gen State
  const [imagePrompt, setImagePrompt] = useState(
    "Modern digital learning classroom in Nepal with students studying coding and robotics, warm aesthetic lighting, hyper-realistic"
  );
  const [aspectRatio, setAspectRatio] = useState<AspectRatioType>("16:9");
  const [generatedImages, setGeneratedImages] = useState<GeneratedImageRecord[]>([]);

  // Analyze Image State
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageAnalysisPrompt, setImageAnalysisPrompt] = useState(
    "Identify any text, academic equations, lab diagram concepts, and summarize key insights."
  );
  const [imageAnalysisResult, setImageAnalysisResult] = useState<string | null>(null);

  // Video Analysis State
  const [videoUrl, setVideoUrl] = useState("https://www.youtube.com/@FactFusion-Hub2");
  const [videoPrompt, setVideoPrompt] = useState(
    "Analyze the educational topics covered, provide timestamp breakdowns and pedagogical insights."
  );
  const [videoAnalysisResult, setVideoAnalysisResult] = useState<string | null>(null);

  // Grounding State
  const [mapsQuery, setMapsQuery] = useState("FactFusion Hub campus location in Mahottari Gaushala, routes from Janakpur and surrounding transit hubs.");
  const [mapsResult, setMapsResult] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("NEB Grade 11 & 12 Computer Science board syllabus updates 2026 Nepal");
  const [searchResult, setSearchResult] = useState<string | null>(null);

  // Gmail State
  const [emailTo, setEmailTo] = useState("rahulsah332211@gmail.com");
  const [emailSubject, setEmailSubject] = useState("FactFusion Hub: Admission Confirmation & Class Schedule");
  const [emailBody, setEmailBody] = useState(
    "Dear Student,\n\nWe are pleased to inform you that your application to FactFusion Hub has been received and approved.\n\nPlease find your orientation schedule and curriculum overview attached.\n\nBest regards,\nFactFusion Hub Administration"
  );
  const [emailSentStatus, setEmailSentStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  // 1. Fast AI handler (gemini-3.1-flash-lite)
  const handleFastQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    const userText = prompt;
    setPrompt("");
    setChatLog((prev) => [...prev, { role: "user", text: userText, model: "User" }]);
    setLoading(true);

    try {
      const res = await fetch("/api/gemini/fast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userText }),
      });
      const data = await res.json();
      setChatLog((prev) => [
        ...prev,
        {
          role: "assistant",
          text: data.text || data.error || "No response received.",
          model: "gemini-3.1-flash-lite",
        },
      ]);
    } catch (err: any) {
      setChatLog((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Connection error: Unable to contact fast response engine.",
          model: "System",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // 2. High Thinking AI handler (gemini-3.1-pro-preview with ThinkingLevel.HIGH)
  const handleThinkingQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    const userText = prompt;
    setPrompt("");
    setChatLog((prev) => [...prev, { role: "user", text: userText, model: "User" }]);
    setLoading(true);

    try {
      const res = await fetch("/api/gemini/thinking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userText }),
      });
      const data = await res.json();
      setChatLog((prev) => [
        ...prev,
        {
          role: "assistant",
          text: data.text || data.error || "No response received.",
          model: "gemini-3.1-pro-preview (Thinking: HIGH)",
        },
      ]);
    } catch (err: any) {
      setChatLog((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Connection error: High thinking engine failed to respond.",
          model: "System",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // 3. Image Generation handler (gemini-3.1-flash-image with aspect ratios)
  const handleGenerateImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagePrompt.trim() || loading) return;
    setLoading(true);

    try {
      const res = await fetch("/api/gemini/image-gen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: imagePrompt, aspectRatio }),
      });
      const data = await res.json();
      if (data.imageUrl) {
        setGeneratedImages((prev) => [
          {
            imageUrl: data.imageUrl,
            caption: data.caption,
            aspectRatio: data.aspectRatio || aspectRatio,
            prompt: imagePrompt,
            createdAt: new Date().toLocaleTimeString(),
          },
          ...prev,
        ]);
      } else {
        alert(data.error || "Image generation failed.");
      }
    } catch (err: any) {
      alert("Error generating image: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // 4. Image Upload & Analysis handler (gemini-3.1-pro-preview)
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyzeImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedImage || loading) return;
    setLoading(true);
    setImageAnalysisResult(null);

    try {
      const res = await fetch("/api/gemini/analyze-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: selectedImage,
          prompt: imageAnalysisPrompt,
        }),
      });
      const data = await res.json();
      setImageAnalysisResult(data.analysis || data.error || "Analysis completed.");
    } catch (err: any) {
      setImageAnalysisResult("Error analyzing image: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // 5. Video Analysis handler (gemini-3.1-pro-preview)
  const handleAnalyzeVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setVideoAnalysisResult(null);

    try {
      const res = await fetch("/api/gemini/analyze-video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoUrl,
          prompt: videoPrompt,
        }),
      });
      const data = await res.json();
      setVideoAnalysisResult(data.analysis || data.error || "Video analysis finished.");
    } catch (err: any) {
      setVideoAnalysisResult("Error analyzing video: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // 6. Google Maps Grounding handler (gemini-3.5-flash with googleMaps)
  const handleMapsGrounding = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mapsQuery.trim() || loading) return;
    setLoading(true);
    setMapsResult(null);

    try {
      const res = await fetch("/api/gemini/maps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: mapsQuery }),
      });
      const data = await res.json();
      setMapsResult(data.text || data.error || "No location results.");
    } catch (err: any) {
      setMapsResult("Maps Grounding Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // 7. Google Search Grounding handler (gemini-3.5-flash with googleSearch)
  const handleSearchGrounding = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || loading) return;
    setLoading(true);
    setSearchResult(null);

    try {
      const res = await fetch("/api/gemini/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery }),
      });
      const data = await res.json();
      setSearchResult(data.text || data.error || "No search results.");
    } catch (err: any) {
      setSearchResult("Search Grounding Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // 8. Gmail Disptach Handler
  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailTo.trim() || loading) return;
    setLoading(true);
    setEmailSentStatus(null);

    try {
      const res = await fetch("/api/gmail/send-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipient: emailTo,
          subject: emailSubject,
          body: emailBody,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setEmailSentStatus(`Dispatched successfully! Message ID: ${data.details.messageId}`);
      } else {
        setEmailSentStatus(`Failed: ${data.error}`);
      }
    } catch (err: any) {
      setEmailSentStatus("Dispatch error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const aspectRatiosList: AspectRatioType[] = ["1:1", "2:3", "3:2", "3:4", "4:3", "9:16", "16:9", "21:9"];

  return (
    <div className="fixed inset-0 z-[6000] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#002B1D] text-white px-6 py-4 flex items-center justify-between border-b border-emerald-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center font-bold text-lg border border-amber-300/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                FactFusion AI Intelligence Hub
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-700/80 text-amber-200 font-semibold">
                  Gemini & Workspace Suite
                </span>
              </h2>
              <p className="text-xs text-emerald-200/80">
                Multimodal reasoning, image generation, visual video analytics & grounding for Mahottari Nepal
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-white p-2 rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Feature Navigation Tabs */}
        <div className="flex overflow-x-auto bg-slate-100 border-b border-slate-200 px-4 py-2 gap-2 text-xs font-bold scrollbar-thin">
          <button
            onClick={() => setActiveTab("fast")}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition whitespace-nowrap ${
              activeTab === "fast" ? "bg-[#002B1D] text-white shadow-sm" : "bg-white text-slate-700 hover:bg-slate-200"
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Low-Latency Assistant (Flash-Lite)
          </button>

          <button
            onClick={() => setActiveTab("thinking")}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition whitespace-nowrap ${
              activeTab === "thinking"
                ? "bg-[#002B1D] text-white shadow-sm"
                : "bg-white text-slate-700 hover:bg-slate-200"
            }`}
          >
            <Brain className="w-3.5 h-3.5 text-indigo-400" />
            Deep High Thinking (Pro Preview)
          </button>

          <button
            onClick={() => setActiveTab("image")}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition whitespace-nowrap ${
              activeTab === "image" ? "bg-[#002B1D] text-white shadow-sm" : "bg-white text-slate-700 hover:bg-slate-200"
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 text-pink-400" />
            Image Generation & Aspect Ratios
          </button>

          <button
            onClick={() => setActiveTab("analyze-img")}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition whitespace-nowrap ${
              activeTab === "analyze-img"
                ? "bg-[#002B1D] text-white shadow-sm"
                : "bg-white text-slate-700 hover:bg-slate-200"
            }`}
          >
            <ScanEye className="w-3.5 h-3.5 text-cyan-500" />
            Analyze Images
          </button>

          <button
            onClick={() => setActiveTab("analyze-vid")}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition whitespace-nowrap ${
              activeTab === "analyze-vid"
                ? "bg-[#002B1D] text-white shadow-sm"
                : "bg-white text-slate-700 hover:bg-slate-200"
            }`}
          >
            <Video className="w-3.5 h-3.5 text-red-500" />
            Analyze Video Content
          </button>

          <button
            onClick={() => setActiveTab("maps")}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition whitespace-nowrap ${
              activeTab === "maps" ? "bg-[#002B1D] text-white shadow-sm" : "bg-white text-slate-700 hover:bg-slate-200"
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-500" />
            Maps Grounding
          </button>

          <button
            onClick={() => setActiveTab("search")}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition whitespace-nowrap ${
              activeTab === "search"
                ? "bg-[#002B1D] text-white shadow-sm"
                : "bg-white text-slate-700 hover:bg-slate-200"
            }`}
          >
            <Search className="w-3.5 h-3.5 text-blue-500" />
            Search Grounding
          </button>

          <button
            onClick={() => setActiveTab("gmail")}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition whitespace-nowrap ${
              activeTab === "gmail"
                ? "bg-[#002B1D] text-white shadow-sm"
                : "bg-white text-slate-700 hover:bg-slate-200"
            }`}
          >
            <Mail className="w-3.5 h-3.5 text-red-500" />
            Gmail Integration
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-y-auto bg-slate-50">
          {/* TAB 1: LOW-LATENCY CHAT (gemini-3.1-flash-lite) */}
          {activeTab === "fast" && (
            <div className="flex flex-col h-full space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl flex items-start gap-3">
                <Zap className="w-5 h-5 text-emerald-700 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wide">
                    Ultra Low-Latency Model: gemini-3.1-flash-lite
                  </h4>
                  <p className="text-xs text-emerald-800">
                    Instant responses for admission inquiries, course details, campus schedules, and bilingual
                    English/Nepali queries with minimal delay.
                  </p>
                </div>
              </div>

              <div className="flex-1 min-h-[220px] max-h-[350px] overflow-y-auto space-y-3 p-3 bg-white rounded-xl border border-slate-200">
                {chatLog.length === 0 && (
                  <div className="text-center py-8 text-slate-400 text-sm">
                    Ask any question about FactFusion Hub programs, admission rules, or fee structures.
                  </div>
                )}
                {chatLog.map((c, i) => (
                  <div
                    key={i}
                    className={`flex flex-col ${c.role === "user" ? "items-end" : "items-start"}`}
                  >
                    <span className="text-[10px] text-slate-400 px-1 mb-1">{c.model}</span>
                    <div
                      className={`p-3 rounded-2xl max-w-[85%] text-sm leading-relaxed whitespace-pre-wrap ${
                        c.role === "user"
                          ? "bg-[#002B1D] text-white rounded-tr-none"
                          : "bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200"
                      }`}
                    >
                      {c.text}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex items-center gap-2 text-xs text-emerald-700 font-semibold">
                    <Loader2 className="w-4 h-4 animate-spin" /> Generating low-latency response...
                  </div>
                )}
              </div>

              <form onSubmit={handleFastQuery} className="flex gap-2">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Ask quick question (e.g. What are Class 11 CS subjects in NEB?)..."
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600 text-sm bg-white"
                />
                <button
                  type="submit"
                  disabled={loading || !prompt.trim()}
                  className="px-5 py-2.5 bg-[#002B1D] text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-emerald-900 disabled:opacity-50 transition"
                >
                  <Send className="w-4 h-4" /> Send
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: HIGH THINKING MODE (gemini-3.1-pro-preview) */}
          {activeTab === "thinking" && (
            <div className="flex flex-col h-full space-y-4">
              <div className="bg-indigo-50 border border-indigo-200 p-3.5 rounded-xl flex items-start gap-3">
                <Brain className="w-5 h-5 text-indigo-700 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wide">
                    High Reasoning Model: gemini-3.1-pro-preview (ThinkingLevel: HIGH)
                  </h4>
                  <p className="text-xs text-indigo-800">
                    Engages deep analytical reasoning for intricate STEM solutions, NEB algorithm designs, complex
                    mathematical derivations, curriculum restructuring, and advanced school problem solving.
                  </p>
                </div>
              </div>

              <div className="flex-1 min-h-[220px] max-h-[350px] overflow-y-auto space-y-3 p-3 bg-white rounded-xl border border-slate-200">
                {chatLog.length === 0 && (
                  <div className="text-center py-8 text-slate-400 text-sm">
                    Enter a complex academic query, C program debugging task, or NEB curriculum inquiry.
                  </div>
                )}
                {chatLog.map((c, i) => (
                  <div
                    key={i}
                    className={`flex flex-col ${c.role === "user" ? "items-end" : "items-start"}`}
                  >
                    <span className="text-[10px] text-slate-400 px-1 mb-1">{c.model}</span>
                    <div
                      className={`p-3 rounded-2xl max-w-[85%] text-sm leading-relaxed whitespace-pre-wrap ${
                        c.role === "user"
                          ? "bg-[#002B1D] text-white rounded-tr-none"
                          : "bg-indigo-50/70 text-slate-900 rounded-tl-none border border-indigo-200"
                      }`}
                    >
                      {c.text}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex items-center gap-2 text-xs text-indigo-700 font-semibold">
                    <Loader2 className="w-4 h-4 animate-spin" /> Deep thinking in progress (ThinkingLevel.HIGH)...
                  </div>
                )}
              </div>

              <form onSubmit={handleThinkingQuery} className="flex gap-2">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Provide complex problem (e.g. Write a C program for binary search tree and analyze its time complexity)..."
                  className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 text-sm bg-white"
                />
                <button
                  type="submit"
                  disabled={loading || !prompt.trim()}
                  className="px-5 py-2.5 bg-indigo-900 text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-indigo-950 disabled:opacity-50 transition"
                >
                  <Brain className="w-4 h-4" /> Reason
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: IMAGE GENERATION & ASPECT RATIOS (gemini-3.1-flash-image) */}
          {activeTab === "image" && (
            <div className="space-y-4">
              <div className="bg-pink-50 border border-pink-200 p-3.5 rounded-xl flex items-start gap-3">
                <ImageIcon className="w-5 h-5 text-pink-700 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-pink-900 uppercase tracking-wide">
                    Image Generator: gemini-3.1-flash-image
                  </h4>
                  <p className="text-xs text-pink-800">
                    Generate campus promotional artwork, event banners, lab illustrations, and certificates with
                    custom aspect ratios.
                  </p>
                </div>
              </div>

              <form onSubmit={handleGenerateImage} className="space-y-3 bg-white p-4 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Creative Image Prompt</label>
                  <textarea
                    rows={2}
                    value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                    placeholder="Describe the campus visual to create..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-pink-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Select Aspect Ratio (affordance for 1:1, 2:3, 3:2, 3:4, 4:3, 9:16, 16:9, 21:9)
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {aspectRatiosList.map((ratio) => (
                      <button
                        key={ratio}
                        type="button"
                        onClick={() => setAspectRatio(ratio)}
                        className={`py-2 px-1 text-center rounded-lg text-xs font-bold transition border ${
                          aspectRatio === ratio
                            ? "bg-pink-700 text-white border-pink-700 shadow-sm"
                            : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {ratio}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !imagePrompt.trim()}
                  className="w-full py-2.5 bg-pink-700 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-pink-800 transition disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  Generate Image ({aspectRatio})
                </button>
              </form>

              {/* Gallery */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {generatedImages.map((img, i) => (
                  <div key={i} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                    <img
                      src={img.imageUrl}
                      alt={img.prompt}
                      className="w-full object-cover rounded-lg border border-slate-100"
                    />
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-pink-700 bg-pink-50 px-2 py-0.5 rounded">
                        Ratio: {img.aspectRatio}
                      </span>
                      <a
                        href={img.imageUrl}
                        download={`factfusion_${Date.now()}.png`}
                        className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1"
                      >
                        <Download className="w-3.5 h-3.5" /> Download
                      </a>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2">{img.prompt}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: ANALYZE IMAGES (gemini-3.1-pro-preview) */}
          {activeTab === "analyze-img" && (
            <div className="space-y-4">
              <div className="bg-cyan-50 border border-cyan-200 p-3.5 rounded-xl flex items-start gap-3">
                <ScanEye className="w-5 h-5 text-cyan-700 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-cyan-900 uppercase tracking-wide">
                    Image Understanding: gemini-3.1-pro-preview
                  </h4>
                  <p className="text-xs text-cyan-800">
                    Upload handwritten notes, student certificates, science lab diagrams, or campus documents for
                    detailed multimodal analysis.
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center hover:bg-slate-50 transition cursor-pointer relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <Upload className="w-8 h-8 text-cyan-600 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-700">Click or drag & drop a photo/document</p>
                  <p className="text-[11px] text-slate-500">Supports PNG, JPG, WEBP</p>
                </div>

                {selectedImage && (
                  <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-lg border border-slate-200">
                    <img src={selectedImage} alt="Preview" className="w-16 h-16 object-cover rounded-md" />
                    <div className="text-xs text-slate-600 flex-1">
                      <p className="font-bold text-slate-800">Photo attached ready for Gemini analysis</p>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Analysis Instructions</label>
                  <input
                    type="text"
                    value={imageAnalysisPrompt}
                    onChange={(e) => setImageAnalysisPrompt(e.target.value)}
                    placeholder="Instructions for Gemini Pro..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>

                <button
                  onClick={handleAnalyzeImage}
                  disabled={loading || !selectedImage}
                  className="w-full py-2.5 bg-cyan-700 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-cyan-800 disabled:opacity-50 transition"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ScanEye className="w-4 h-4" />}
                  Analyze Photo with Gemini Pro
                </button>
              </div>

              {imageAnalysisResult && (
                <div className="bg-white p-4 rounded-xl border border-cyan-200 shadow-sm">
                  <h4 className="text-xs font-extrabold text-cyan-900 mb-2 uppercase tracking-wide">
                    Gemini Pro Image Analysis Result
                  </h4>
                  <div className="text-xs text-slate-800 whitespace-pre-wrap leading-relaxed">
                    {imageAnalysisResult}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: ANALYZE VIDEO CONTENT (gemini-3.1-pro-preview) */}
          {activeTab === "analyze-vid" && (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 p-3.5 rounded-xl flex items-start gap-3">
                <Video className="w-5 h-5 text-red-700 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-red-900 uppercase tracking-wide">
                    Video Understanding: gemini-3.1-pro-preview
                  </h4>
                  <p className="text-xs text-red-800">
                    Analyze campus virtual tours, lecture recordings, YouTube video lessons, and educational broadcasts
                    for key concepts and timestamps.
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Educational Video / Channel URL</label>
                  <input
                    type="text"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="e.g. https://www.youtube.com/@FactFusion-Hub2"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Analysis Focus</label>
                  <input
                    type="text"
                    value={videoPrompt}
                    onChange={(e) => setVideoPrompt(e.target.value)}
                    placeholder="e.g. Extract key lecture timestamps and educational summary"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>

                <button
                  onClick={handleAnalyzeVideo}
                  disabled={loading}
                  className="w-full py-2.5 bg-red-700 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-red-800 disabled:opacity-50 transition"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Video className="w-4 h-4" />}
                  Analyze Video Content
                </button>
              </div>

              {videoAnalysisResult && (
                <div className="bg-white p-4 rounded-xl border border-red-200 shadow-sm">
                  <h4 className="text-xs font-extrabold text-red-900 mb-2 uppercase tracking-wide">
                    Gemini Pro Video Intelligence Breakdown
                  </h4>
                  <div className="text-xs text-slate-800 whitespace-pre-wrap leading-relaxed">
                    {videoAnalysisResult}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 6: GOOGLE MAPS GROUNDING (gemini-3.5-flash) */}
          {activeTab === "maps" && (
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl flex items-start gap-3">
                <MapPin className="w-5 h-5 text-emerald-700 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wide">
                    Google Maps Grounding: gemini-3.5-flash
                  </h4>
                  <p className="text-xs text-emerald-800">
                    Get up-to-date real-world location intelligence, campus routes, transportation links, and Mahottari
                    Nepal regional navigation.
                  </p>
                </div>
              </div>

              <form onSubmit={handleMapsGrounding} className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Location / Route Query</label>
                  <input
                    type="text"
                    value={mapsQuery}
                    onChange={(e) => setMapsQuery(e.target.value)}
                    placeholder="Enter location inquiry..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !mapsQuery.trim()}
                  className="w-full py-2.5 bg-emerald-800 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-emerald-900 disabled:opacity-50 transition"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
                  Query Google Maps Grounding
                </button>
              </form>

              {mapsResult && (
                <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-sm">
                  <h4 className="text-xs font-extrabold text-emerald-900 mb-2 uppercase tracking-wide">
                    Maps Grounded Output
                  </h4>
                  <div className="text-xs text-slate-800 whitespace-pre-wrap leading-relaxed">{mapsResult}</div>
                </div>
              )}
            </div>
          )}

          {/* TAB 7: GOOGLE SEARCH GROUNDING (gemini-3.5-flash) */}
          {activeTab === "search" && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 p-3.5 rounded-xl flex items-start gap-3">
                <Search className="w-5 h-5 text-blue-700 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wide">
                    Google Search Grounding: gemini-3.5-flash
                  </h4>
                  <p className="text-xs text-blue-800">
                    Query real-time web facts, latest National Examination Board (NEB) announcements, scholarship
                    updates, and STEM education news.
                  </p>
                </div>
              </div>

              <form
                onSubmit={handleSearchGrounding}
                className="bg-white p-4 rounded-xl border border-slate-200 space-y-3"
              >
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Search Query</label>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter search topic..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !searchQuery.trim()}
                  className="w-full py-2.5 bg-blue-700 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-800 disabled:opacity-50 transition"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  Query Google Search Grounding
                </button>
              </form>

              {searchResult && (
                <div className="bg-white p-4 rounded-xl border border-blue-200 shadow-sm">
                  <h4 className="text-xs font-extrabold text-blue-900 mb-2 uppercase tracking-wide">
                    Live Search Grounded Results
                  </h4>
                  <div className="text-xs text-slate-800 whitespace-pre-wrap leading-relaxed">{searchResult}</div>
                </div>
              )}
            </div>
          )}

          {/* TAB 8: GMAIL / WORKSPACE INTEGRATION */}
          {activeTab === "gmail" && (
            <div className="space-y-4">
              <div className="bg-rose-50 border border-rose-200 p-3.5 rounded-xl flex items-start gap-3">
                <Mail className="w-5 h-5 text-rose-700 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-rose-900 uppercase tracking-wide">
                    Google Workspace & Gmail Dispatch Station
                  </h4>
                  <p className="text-xs text-rose-800">
                    Draft, preview, and dispatch official admission letters, fee notices, and academic bulletins
                    directly to students and parents.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSendEmail} className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Recipient Email</label>
                    <input
                      type="email"
                      value={emailTo}
                      onChange={(e) => setEmailTo(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
                    <input
                      type="text"
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Body</label>
                  <textarea
                    rows={4}
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-rose-700 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-rose-800 disabled:opacity-50 transition"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  Dispatch Notification via Gmail
                </button>
              </form>

              {emailSentStatus && (
                <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex items-center gap-2 text-xs font-bold text-emerald-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  {emailSentStatus}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
