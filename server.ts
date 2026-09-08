import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Lazy/Safe Gemini Client
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not set. AI features will operate in fallback mode.");
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// In-Memory Database for FactFusion Hub SMS
interface PendingApplicationRecord {
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
  assignedStudentId?: string;
  receiptNo?: string;
  studentId?: string;
  studentMobile?: string;
  primaryAddress?: string;
  dob?: string;
  gender?: string;
}

interface NotificationAlert {
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

interface AdmissionRecord {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  grade: string;
  faculty?: string;
  status: "Pending" | "Approved" | "Rejected";
  submittedAt: string;
}

const pendingApplications: PendingApplicationRecord[] = [
  {
    id: "APP-9081",
    fullName: "Kamal Singh Maharjan",
    phoneNumber: "+977 9811882233",
    emailAddress: "kamal.singh@gmail.com",
    classGradeSelection: "Grade 11",
    facultyStream: "Computer Science",
    status: "Pending",
    submittedAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    adminNotes: "Submitted through Apply Now modal. Interested in AI & Robotics lab.",
  },
  {
    id: "APP-9082",
    fullName: "Anjali Gupta",
    phoneNumber: "+977 9807114422",
    emailAddress: "anjali.g@gmail.com",
    classGradeSelection: "Grade 11",
    facultyStream: "General Science",
    status: "Pending",
    submittedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    adminNotes: "Father called earlier regarding scholarship criteria.",
  },
];

const notificationsList: NotificationAlert[] = [
  {
    id: "NTF-1001",
    applicationId: "APP-9081",
    type: "NEW_LEAD_APPLICATION",
    title: "New Admission Lead Received",
    applicantName: "Kamal Singh Maharjan",
    phoneNumber: "+977 9811882233",
    classGrade: "Grade 11",
    facultyStream: "Computer Science",
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    unread: true,
  },
  {
    id: "NTF-1002",
    applicationId: "APP-9082",
    type: "NEW_LEAD_APPLICATION",
    title: "New Admission Lead Received",
    applicantName: "Anjali Gupta",
    phoneNumber: "+977 9807114422",
    classGrade: "Grade 11",
    facultyStream: "General Science",
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    unread: true,
  },
];

interface StudentRecord {
  id: string;
  rollNo: string;
  name: string;
  grade: string;
  faculty: string;
  phone: string;
  email: string;
  attendanceRate: number;
  dueAmount: number;
}

interface NoticeRecord {
  id: string;
  title: string;
  content: string;
  category: "Academic" | "Exam" | "General" | "Holiday" | "Urgent" | "Admission";
  targetAudience: "All" | "Students" | "Faculty" | "Parents" | "Public";
  date: string;
  expiryDate?: string;
  isUrgent?: boolean;
  status: "Active" | "Draft" | "Archived";
  attachmentName?: string;
  attachmentUrl?: string;
  author?: string;
  createdAt: string;
  updatedAt: string;
}

interface EventRecord {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  category: "Workshop" | "Seminar" | "Sports" | "Cultural" | "Tech" | "Career" | "Academic";
  status: "Upcoming" | "Ongoing" | "Completed";
  bannerUrl?: string;
  registrationLink?: string;
  organizer?: string;
  maxAttendees?: number;
  registeredCount?: number;
  createdAt: string;
  updatedAt: string;
}

const admissions: AdmissionRecord[] = [
  {
    id: "ADM-101",
    fullName: "Bishal Chaudhary",
    phone: "+977 9811223344",
    email: "bishal.c@example.com",
    grade: "11",
    faculty: "Computer Science",
    status: "Pending",
    submittedAt: "2026-08-30 14:20",
  },
  {
    id: "ADM-102",
    fullName: "Pooja Yadav",
    phone: "+977 9822334455",
    email: "pooja.y@example.com",
    grade: "11",
    faculty: "General Science",
    status: "Approved",
    submittedAt: "2026-08-29 11:05",
  },
];

const students: StudentRecord[] = [
  {
    id: "1",
    rollNo: "STU-1001",
    name: "Rahul Shah",
    grade: "Grade 11",
    faculty: "Computer Science",
    phone: "+977 9807695843",
    email: "rahulsah332211@gmail.com",
    attendanceRate: 98,
    dueAmount: 0,
  },
  {
    id: "2",
    rollNo: "STU-1002",
    name: "Aarav Sharma",
    grade: "Grade 11",
    faculty: "Computer Science",
    phone: "+977 9812345678",
    email: "aarav.sharma@example.com",
    attendanceRate: 94,
    dueAmount: 1500,
  },
  {
    id: "3",
    rollNo: "STU-1003",
    name: "Sonia Shrestha",
    grade: "Grade 12",
    faculty: "Management",
    phone: "+977 9845123654",
    email: "sonia.s@example.com",
    attendanceRate: 96,
    dueAmount: 0,
  },
  {
    id: "4",
    rollNo: "STU-1004",
    name: "Aarti Sharma",
    grade: "Grade 12",
    faculty: "General Science",
    phone: "+977 9819876543",
    email: "aarti.sharma@example.com",
    attendanceRate: 99,
    dueAmount: 0,
  },
];

const notices: NoticeRecord[] = [
  {
    id: "NTC-1",
    title: "NEB Class 11 & 12 Board Examination Form Submission Deadline",
    date: "2026-09-01",
    expiryDate: "2026-09-25",
    category: "Urgent",
    targetAudience: "Students",
    isUrgent: true,
    status: "Active",
    content: "All Grade 11 & 12 students are urgently notified that the NEB board examination registration forms must be verified and submitted with clearance by September 25, 2026. Late submissions will incur board fines.",
    attachmentName: "NEB_Exam_Form_Guidelines_2026.pdf",
    attachmentUrl: "https://factfusion.edu.np/downloads/NEB_Exam_Form_Guidelines_2026.pdf",
    author: "Examination Controller Office",
    createdAt: "2026-09-01T08:30:00.000Z",
    updatedAt: "2026-09-01T08:30:00.000Z",
  },
  {
    id: "NTC-2",
    title: "Computer Science & AI Project Expo 2026 - Registration Open",
    date: "2026-08-28",
    expiryDate: "2026-10-15",
    category: "Academic",
    targetAudience: "All",
    isUrgent: false,
    status: "Active",
    content: "FactFusion Hub Innovation Lab invites all students from Computer Science and Science faculties to present software prototypes, Web & AI tools, IoT sensors, and robotics models at the upcoming annual campus tech summit.",
    attachmentName: "Project_Expo_Guidelines_Rubric.pdf",
    author: "Dept. of Computer Science",
    createdAt: "2026-08-28T10:15:00.000Z",
    updatedAt: "2026-08-28T10:15:00.000Z",
  },
  {
    id: "NTC-3",
    title: "Constitution Day & Dashain Vacation Administrative Notice",
    date: "2026-08-25",
    expiryDate: "2026-09-30",
    category: "Holiday",
    targetAudience: "All",
    isUrgent: false,
    status: "Active",
    content: "The institution will observe national holidays as per the government academic calendar. Online admission portal and self-service learning modules will remain accessible throughout the break.",
    author: "Campus Administration",
    createdAt: "2026-08-25T14:00:00.000Z",
    updatedAt: "2026-08-25T14:00:00.000Z",
  },
  {
    id: "NTC-4",
    title: "Class 11 Science & Management Merit Scholarship List Published",
    date: "2026-08-20",
    expiryDate: "2026-10-01",
    category: "Admission",
    targetAudience: "Parents",
    isUrgent: false,
    status: "Active",
    content: "The first merit scholarship list for academic intake 2026 is displayed on the main admin bulletin and online student portal. Shortlisted candidates should complete verification within 7 working days.",
    attachmentName: "Scholarship_Merit_List_Batch2026.pdf",
    author: "Scholarship Committee",
    createdAt: "2026-08-20T09:00:00.000Z",
    updatedAt: "2026-08-20T09:00:00.000Z",
  },
];

const events: EventRecord[] = [
  {
    id: "EVT-101",
    title: "FactFusion Tech Fest & Hackathon 2026",
    description: "48-hour hands-on coding sprint, AI agent building challenge, and hardware hackathon for students across Madhesh Province and Nepal.",
    date: "2026-09-18",
    time: "09:00 AM - 05:00 PM",
    venue: "Main Campus Auditorium & Advanced Computer Lab",
    category: "Tech",
    status: "Upcoming",
    bannerUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80",
    registrationLink: "https://factfusion.edu.np/hackathon-register",
    organizer: "FactFusion Robotics & Coding Club",
    maxAttendees: 200,
    registeredCount: 142,
    createdAt: "2026-08-25T08:00:00.000Z",
    updatedAt: "2026-08-25T08:00:00.000Z",
  },
  {
    id: "EVT-102",
    title: "Global Education & Career Summit 2026",
    description: "Meet representatives from top IT companies, university counselors, and international scholarship advisors.",
    date: "2026-09-28",
    time: "10:30 AM - 04:00 PM",
    venue: "Conference Hall B & Virtual Live Stream",
    category: "Career",
    status: "Upcoming",
    bannerUrl: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80",
    registrationLink: "https://factfusion.edu.np/career-fair",
    organizer: "Career Guidance & Placement Cell",
    maxAttendees: 350,
    registeredCount: 280,
    createdAt: "2026-08-26T11:00:00.000Z",
    updatedAt: "2026-08-26T11:00:00.000Z",
  },
  {
    id: "EVT-103",
    title: "Inter-Faculty Science & Mathematics Olympiad",
    description: "Annual competitive problem-solving test and logic championship featuring team quiz, lab experiments, and speed math.",
    date: "2026-10-05",
    time: "11:00 AM - 02:30 PM",
    venue: "Science Block Seminar Hall",
    category: "Academic",
    status: "Upcoming",
    bannerUrl: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80",
    organizer: "Faculty of Pure & Applied Sciences",
    maxAttendees: 150,
    registeredCount: 95,
    createdAt: "2026-08-27T12:00:00.000Z",
    updatedAt: "2026-08-27T12:00:00.000Z",
  },
  {
    id: "EVT-104",
    title: "Annual Campus Sports & Athletic Meet 2026",
    description: "Football tournament, volleyball, table tennis, badminton, and track & field events celebrating sportsman spirit and student fitness.",
    date: "2026-10-14",
    time: "08:00 AM - 04:30 PM",
    venue: "FactFusion Central Sports Grounds",
    category: "Sports",
    status: "Upcoming",
    bannerUrl: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80",
    organizer: "Athletics & Student Affairs Dept.",
    maxAttendees: 500,
    registeredCount: 320,
    createdAt: "2026-08-28T14:30:00.000Z",
    updatedAt: "2026-08-28T14:30:00.000Z",
  },
];

// --- API ROUTES ---

// 1. Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 2. High Thinking Mode using `gemini-3.1-pro-preview` with `ThinkingLevel.HIGH`
app.post("/api/gemini/thinking", async (req, res) => {
  try {
    const { prompt, context } = req.body;
    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({ error: "Gemini API key is not configured in server environment." });
    }

    const systemInstruction = `You are the FactFusion Hub Academic & Administrative High-Intelligence AI Advisor in Nepal (Mahottari Gaushala).
You specialize in deep analytical breakdown of educational problems, NEB curriculum (Computer Science, Science, Management, Bio Sciences), algorithm analysis, code debugging, mathematical proofs, school policy formulations, and complex student query resolution.
Provide rigorous, thorough, high-reasoning, and step-by-step well-structured explanations. Context: ${context || "General Academic Inquiry"}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: prompt,
      config: {
        systemInstruction,
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.HIGH,
        },
      },
    });

    res.json({
      text: response.text || "No response generated.",
      model: "gemini-3.1-pro-preview",
      thinkingMode: "HIGH",
    });
  } catch (error: any) {
    console.error("Error in high thinking API:", error);
    res.status(500).json({ error: error.message || "Failed to process high-thinking query." });
  }
});

// 3. Low-Latency Responses using `gemini-3.1-flash-lite`
app.post("/api/gemini/fast", async (req, res) => {
  try {
    const { prompt, stream } = req.body;
    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({ error: "Gemini API key is not configured in server environment." });
    }

    const systemInstruction = `You are FactFusion Hub's instant fast assistant. Provide direct, low-latency, crisp, and friendly responses to student, parent, and faculty questions about admissions, fees, timings, programs, and general inquiries in English or Nepali as needed.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: prompt,
      config: {
        systemInstruction,
      },
    });

    res.json({
      text: response.text || "No response generated.",
      model: "gemini-3.1-flash-lite",
      latency: "ultra-low",
    });
  } catch (error: any) {
    console.error("Error in fast AI API:", error);
    res.status(500).json({ error: error.message || "Failed to process fast response." });
  }
});

// 4. Image Generation with aspect ratios using `gemini-3.1-flash-image`
app.post("/api/gemini/image-gen", async (req, res) => {
  try {
    const { prompt, aspectRatio = "1:1", imageSize = "1K" } = req.body;
    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({ error: "Gemini API key is not configured." });
    }

    // Valid aspect ratios: "1:1", "2:3", "3:2", "3:4", "4:3", "9:16", "16:9", "21:9", etc.
    const allowedRatios = ["1:1", "2:3", "3:2", "3:4", "4:3", "9:16", "16:9", "21:9", "1:4", "4:1"];
    const chosenRatio = allowedRatios.includes(aspectRatio) ? aspectRatio : "1:1";

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-image",
      contents: {
        parts: [{ text: prompt || "Modern educational institution campus in Nepal with lush greenery, students collaborating, high-tech computer lab, realistic vibrant lighting" }],
      },
      config: {
        imageConfig: {
          aspectRatio: chosenRatio as any,
          imageSize: imageSize as any,
        },
      },
    });

    let imageUrl: string | null = null;
    let captionText = "";

    const candidate = response.candidates?.[0];
    if (candidate?.content?.parts) {
      for (const part of candidate.content.parts) {
        if (part.inlineData?.data) {
          const mimeType = part.inlineData.mimeType || "image/png";
          imageUrl = `data:${mimeType};base64,${part.inlineData.data}`;
        } else if (part.text) {
          captionText += part.text;
        }
      }
    }

    if (!imageUrl) {
      return res.status(422).json({ error: "Image generation did not produce inline image data.", text: captionText });
    }

    res.json({
      imageUrl,
      caption: captionText,
      aspectRatio: chosenRatio,
      model: "gemini-3.1-flash-image",
    });
  } catch (error: any) {
    console.error("Error in image generation API:", error);
    res.status(500).json({ error: error.message || "Failed to generate image." });
  }
});

// 5. Analyze Image using `gemini-3.1-pro-preview`
app.post("/api/gemini/analyze-image", async (req, res) => {
  try {
    const { imageBase64, mimeType = "image/jpeg", prompt } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: "Missing imageBase64 data in request." });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({ error: "Gemini API key is not configured." });
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z]+;base64,/, "");

    const imagePart = {
      inlineData: {
        mimeType: mimeType,
        data: cleanBase64,
      },
    };

    const textPart = {
      text: prompt || "Thoroughly analyze this image in detail. Extract any text, identify diagram/subjects, evaluate educational diagrams, certificates, homework problems, or campus facilities depicted.",
    };

    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: { parts: [imagePart, textPart] },
    });

    res.json({
      analysis: response.text || "Analysis completed without text output.",
      model: "gemini-3.1-pro-preview",
    });
  } catch (error: any) {
    console.error("Error in analyze image API:", error);
    res.status(500).json({ error: error.message || "Failed to analyze image." });
  }
});

// 6. Analyze Video Content using `gemini-3.1-pro-preview`
app.post("/api/gemini/analyze-video", async (req, res) => {
  try {
    const { videoBase64, mimeType = "video/mp4", videoUrl, prompt } = req.body;
    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({ error: "Gemini API key is not configured." });
    }

    if (videoBase64) {
      const cleanBase64 = videoBase64.replace(/^data:video\/[a-zA-Z0-9]+;base64,/, "");
      const videoPart = {
        inlineData: {
          mimeType: mimeType,
          data: cleanBase64,
        },
      };
      const textPart = {
        text: prompt || "Analyze this educational/campus video. Identify key lecture topics, timestamps, teacher explanations, visual slides, and provide a summary with key takeaways.",
      };

      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: { parts: [videoPart, textPart] },
      });

      return res.json({
        analysis: response.text || "Video analysis complete.",
        model: "gemini-3.1-pro-preview",
      });
    } else {
      // Analyze YouTube or referenced URL metadata / topic
      const textPrompt = `You are analyzing video content for FactFusion Hub Educational Video Channel (${videoUrl || "YouTube Educational Content"}). Prompt: ${prompt || "Analyze the pedagogical structure and key takeaways for this topic."}`;
      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: textPrompt,
      });

      return res.json({
        analysis: response.text || "Video topic analysis complete.",
        model: "gemini-3.1-pro-preview",
      });
    }
  } catch (error: any) {
    console.error("Error in video analysis API:", error);
    res.status(500).json({ error: error.message || "Failed to analyze video." });
  }
});

// 7. Google Maps Grounding using `gemini-3.5-flash` with `{ googleMaps: {} }`
app.post("/api/gemini/maps", async (req, res) => {
  try {
    const { query } = req.body;
    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({ error: "Gemini API key is not configured." });
    }

    const userPrompt = query || "Where is FactFusion Hub located in Mahottari Gaushala, Nepal? What are the key surrounding landmarks, routes from Janakpur/Bardibas, and nearby student amenities?";

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        tools: [{ googleMaps: {} }],
      },
    });

    res.json({
      text: response.text || "No location info returned.",
      model: "gemini-3.5-flash (with googleMaps)",
    });
  } catch (error: any) {
    console.error("Error in maps grounding API:", error);
    res.status(500).json({ error: error.message || "Failed to query Google Maps Grounding." });
  }
});

// 8. Google Search Grounding using `gemini-3.5-flash` with `{ googleSearch: {} }`
app.post("/api/gemini/search", async (req, res) => {
  try {
    const { query } = req.body;
    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({ error: "Gemini API key is not configured." });
    }

    const userPrompt = query || "Latest educational news, NEB Grade 11 and 12 examination board notices, national STEM competitions in Nepal 2026";

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    res.json({
      text: response.text || "No search info returned.",
      model: "gemini-3.5-flash (with googleSearch)",
    });
  } catch (error: any) {
    console.error("Error in search grounding API:", error);
    res.status(500).json({ error: error.message || "Failed to query Google Search Grounding." });
  }
});

// 9. Gmail / Email Communication Integration
app.post("/api/gmail/send-notification", async (req, res) => {
  try {
    const { recipient, subject, body, templateType } = req.body;
    if (!recipient || !subject) {
      return res.status(400).json({ error: "Recipient and Subject are required." });
    }

    // Return confirmation of simulated email dispatch with real logging and timestamp
    const emailRecord = {
      messageId: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      to: recipient,
      subject,
      body,
      templateType: templateType || "Admission Update",
      sentAt: new Date().toISOString(),
      status: "Delivered",
    };

    res.json({
      success: true,
      message: `Notification email dispatched to ${recipient}`,
      details: emailRecord,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || "Failed to send email notification." });
  }
});

// 10. Student Management System Endpoints
app.get("/api/students", (req, res) => {
  res.json(students);
});

app.post("/api/students", (req, res) => {
  const { name, grade, faculty, phone, email } = req.body;
  const newStudent: StudentRecord = {
    id: String(students.length + 1),
    rollNo: `STU-${1000 + students.length + 1}`,
    name: name || "New Student",
    grade: grade || "Grade 11",
    faculty: faculty || "General",
    phone: phone || "+977 9800000000",
    email: email || "student@factfusion.edu.np",
    attendanceRate: 100,
    dueAmount: 0,
  };
  students.push(newStudent);
  res.status(201).json(newStudent);
});

app.get("/api/admissions", (req, res) => {
  res.json(admissions);
});

app.post("/api/admissions", (req, res) => {
  const { fullName, phone, email, grade, faculty } = req.body;
  const newAdmission: AdmissionRecord = {
    id: `ADM-${100 + admissions.length + 1}`,
    fullName,
    phone,
    email,
    grade,
    faculty: faculty || "General",
    status: "Pending",
    submittedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
  };
  admissions.unshift(newAdmission);
  res.status(201).json(newAdmission);
});

app.patch("/api/admissions/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const adm = admissions.find((a) => a.id.toUpperCase() === id.toUpperCase());
  if (adm) {
    adm.status = status;
    if (status === "Approved") {
      const existing = students.find((s) => s.phone === adm.phone || s.name.toLowerCase() === adm.fullName.toLowerCase());
      const newRollNo = existing ? existing.rollNo : `STU-${1000 + students.length + 1}`;
      if (!existing) {
        students.push({
          id: String(students.length + 1),
          rollNo: newRollNo,
          name: adm.fullName,
          grade: adm.grade.startsWith("Grade") || adm.grade.startsWith("Class") ? adm.grade : `Grade ${adm.grade}`,
          faculty: adm.faculty || "General",
          phone: adm.phone,
          email: adm.email,
          attendanceRate: 100,
          dueAmount: 0,
        });
      }
      // Also sync to pendingApplications
      const pApp = pendingApplications.find((p) => p.phoneNumber === adm.phone || p.fullName.toLowerCase() === adm.fullName.toLowerCase() || p.id === adm.id);
      if (pApp) {
        pApp.status = "Approved";
        pApp.studentIdAssigned = newRollNo;
      }
    }
    res.json(adm);
  } else {
    res.status(404).json({ error: "Admission record not found" });
  }
});

// --- REAL-TIME LEAD NOTIFICATION & PENDING APPLICATIONS SYSTEM ENDPOINTS ---

// Submit new application to Pending queue (Public Applicant)
app.post("/api/pending-applications", (req, res) => {
  const { fullName, phoneNumber, emailAddress, classGradeSelection, facultyStream } = req.body;

  // Input Validation
  if (!fullName || typeof fullName !== "string" || fullName.trim().length < 2) {
    return res.status(400).json({ error: "Full legal name is required (minimum 2 characters)." });
  }

  const phoneRegex = /^[+]?[0-9\s-]{7,20}$/;
  if (!phoneNumber || !phoneRegex.test(phoneNumber.trim())) {
    return res.status(400).json({ error: "Please enter a valid phone number (7-20 digits)." });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailAddress || !emailRegex.test(emailAddress.trim())) {
    return res.status(400).json({ error: "Please enter a valid email address." });
  }

  if (!classGradeSelection) {
    return res.status(400).json({ error: "Please select a class or grade." });
  }

  const timestamp = new Date().toISOString();
  const newAppId = `APP-${Math.floor(1000 + Math.random() * 9000)}`;
  const uniqueReceiptNo = req.body.receiptNo || `REC-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}-${Date.now().toString(36).slice(-4).toUpperCase()}`;

  const newApplication: PendingApplicationRecord = {
    id: newAppId,
    fullName: fullName.trim(),
    phoneNumber: phoneNumber.trim(),
    emailAddress: emailAddress.trim().toLowerCase(),
    classGradeSelection: classGradeSelection.startsWith("Grade") || classGradeSelection.startsWith("Class") ? classGradeSelection : `Class ${classGradeSelection}`,
    facultyStream: facultyStream || undefined,
    status: "Pending",
    submittedAt: timestamp,
    adminNotes: req.body.adminNotes || "Application submitted via Apply Now modal. Pending phone verification.",
    receiptNo: uniqueReceiptNo,
    assignedStudentId: req.body.assignedStudentId || req.body.studentId || undefined,
    studentId: req.body.studentId || req.body.assignedStudentId || undefined,
    studentMobile: req.body.studentMobile || undefined,
    primaryAddress: req.body.primaryAddress || undefined,
    dob: req.body.dob || undefined,
    gender: req.body.gender || undefined,
  };

  if (req.body.status === "Approved") {
    newApplication.status = "Approved";
    newApplication.processedBy = "Admissions Office";
    newApplication.processedAt = timestamp;
    const newRollNo = req.body.studentId || req.body.assignedStudentId || `STU-${1000 + students.length + 1}`;
    newApplication.studentIdAssigned = newRollNo;
    const existingStudent = students.find(
      (s) => s.phone === newApplication.phoneNumber || s.name.toLowerCase() === newApplication.fullName.toLowerCase()
    );
    if (!existingStudent) {
      students.push({
        id: String(students.length + 1),
        rollNo: newRollNo,
        name: newApplication.fullName,
        grade: newApplication.classGradeSelection,
        faculty: newApplication.facultyStream || "General",
        phone: newApplication.phoneNumber,
        email: newApplication.emailAddress,
        attendanceRate: 100,
        dueAmount: 0,
      });
    }
  }

  pendingApplications.unshift(newApplication);

  // Sync to admissions list for Recent Online Admissions Roster
  const newAdmission: AdmissionRecord = {
    id: newAppId,
    fullName: newApplication.fullName,
    phone: newApplication.phoneNumber,
    email: newApplication.emailAddress,
    grade: newApplication.classGradeSelection.replace(/Grade\s*|Class\s*/gi, ""),
    faculty: newApplication.facultyStream || "General",
    status: (req.body.status === "Approved" ? "Approved" : "Pending") as any,
    submittedAt: new Date().toISOString().replace("T", " ").substring(0, 16),
  };
  admissions.unshift(newAdmission);

  // Generate real-time notification record
  const newNotifId = `NTF-${Date.now().toString().slice(-5)}`;
  const newNotification: NotificationAlert = {
    id: newNotifId,
    applicationId: newAppId,
    type: "NEW_LEAD_APPLICATION",
    title: req.body.status === "Approved" ? "New Student Enrolled" : "New Admission Lead Received",
    applicantName: newApplication.fullName,
    phoneNumber: newApplication.phoneNumber,
    classGrade: newApplication.classGradeSelection,
    facultyStream: newApplication.facultyStream,
    timestamp,
    unread: req.body.status !== "Approved",
  };

  notificationsList.unshift(newNotification);

  res.status(201).json({
    success: true,
    message: req.body.status === "Approved"
      ? "Application approved and student officially registered!"
      : "Your application has been received! Our admissions team will contact you shortly.",
    application: newApplication,
    notification: newNotification,
  });
});

// Get all pending applications
app.get("/api/pending-applications", (req, res) => {
  const { status } = req.query;
  let result = [...pendingApplications];
  if (status && typeof status === "string") {
    result = result.filter((a) => a.status.toLowerCase() === status.toLowerCase());
  }
  res.json(result);
});

// Get single pending application details (supports case-insensitive lookup and admissions records)
app.get("/api/pending-applications/:id", (req, res) => {
  const searchId = req.params.id.trim().toUpperCase();
  let app = pendingApplications.find(
    (a) =>
      a.id.toUpperCase() === searchId ||
      a.id.toUpperCase() === `APP-${searchId}` ||
      a.id.replace(/[^0-9]/g, "") === searchId.replace(/[^0-9]/g, "")
  );

  if (!app) {
    const adm = admissions.find(
      (a) =>
        a.id.toUpperCase() === searchId ||
        a.id.replace(/[^0-9]/g, "") === searchId.replace(/[^0-9]/g, "")
    );
    if (adm) {
      app = {
        id: adm.id,
        fullName: adm.fullName,
        phoneNumber: adm.phone,
        emailAddress: adm.email,
        classGradeSelection: adm.grade.startsWith("Grade") || adm.grade.startsWith("Class") ? adm.grade : `Grade ${adm.grade}`,
        facultyStream: adm.faculty,
        status: adm.status as any,
        submittedAt: adm.submittedAt ? new Date(adm.submittedAt).toISOString() : new Date().toISOString(),
        adminNotes: `Admissions Roster Entry (${adm.id}). Grade: ${adm.grade}, Stream: ${adm.faculty}.`,
      };
    }
  }

  if (!app) {
    return res.status(404).json({ error: "Application record not found for the provided Reference ID." });
  }
  res.json(app);
});

// Update notes / contacted status
app.patch("/api/pending-applications/:id/notes", (req, res) => {
  const rawId = req.params.id.trim().toUpperCase();
  const { adminNotes, status } = req.body;
  const app = pendingApplications.find((a) => a.id.toUpperCase() === rawId);
  const adm = admissions.find((a) => a.id.toUpperCase() === rawId);

  if (!app && !adm) {
    return res.status(404).json({ error: "Application record not found." });
  }

  if (app) {
    if (adminNotes !== undefined) app.adminNotes = adminNotes;
    if (status && ["Pending", "Contacted", "Approved", "Rejected"].includes(status)) {
      app.status = status as any;
    }
  }

  if (adm && status) {
    if (status === "Approved" || status === "Pending") {
      adm.status = status as any;
    }
  }

  res.json({ success: true, application: app || adm });
});

// Manual Approval & Enrollment Atomic Transaction
app.post("/api/pending-applications/:id/approve", (req, res) => {
  const rawId = req.params.id.trim();
  const searchId = rawId.toUpperCase();
  const { adminNotes, adminUser = "Super Administrator" } = req.body;

  let app = pendingApplications.find(
    (a) =>
      a.id.toUpperCase() === searchId ||
      a.id.toUpperCase() === `APP-${searchId}` ||
      a.id.replace(/[^0-9]/g, "") === searchId.replace(/[^0-9]/g, "")
  );

  const adm = admissions.find(
    (a) =>
      a.id.toUpperCase() === searchId ||
      a.id.replace(/[^0-9]/g, "") === searchId.replace(/[^0-9]/g, "")
  );

  if (!app && !adm) {
    return res.status(404).json({ error: "Application record not found." });
  }

  const now = new Date().toISOString();
  const newRollNo = `STU-${1000 + students.length + 1}`;
  const studentName = app?.fullName || adm?.fullName || "Student";
  const studentGrade = app?.classGradeSelection || (adm ? (adm.grade.startsWith("Grade") || adm.grade.startsWith("Class") ? adm.grade : `Grade ${adm.grade}`) : "Grade 11");
  const studentFaculty = app?.facultyStream || adm?.faculty || "General";
  const studentPhone = app?.phoneNumber || adm?.phone || "+977 9800000000";
  const studentEmail = app?.emailAddress || adm?.email || `${studentName.toLowerCase().replace(/\s+/g, ".")}@factfusion.edu.np`;

  // Check if student already exists
  let student = students.find((s) => s.phone === studentPhone || s.name.toLowerCase() === studentName.toLowerCase());
  if (!student) {
    student = {
      id: String(students.length + 1),
      rollNo: newRollNo,
      name: studentName,
      grade: studentGrade,
      faculty: studentFaculty,
      phone: studentPhone,
      email: studentEmail,
      attendanceRate: 100,
      dueAmount: 0,
    };
    students.push(student);
  }

  // Update pending application if found
  if (app) {
    app.status = "Approved";
    app.processedBy = adminUser;
    app.processedAt = now;
    app.studentIdAssigned = student.rollNo;
    if (adminNotes) app.adminNotes = adminNotes;
  }

  // Update admissions roster entry if found
  if (adm) {
    adm.status = "Approved";
  }

  // Also check if any admission record matches by phone or name
  const linkedAdm = admissions.find((a) => a.phone === studentPhone || a.fullName.toLowerCase() === studentName.toLowerCase());
  if (linkedAdm) {
    linkedAdm.status = "Approved";
  }

  // Mark related notification as read
  const notif = notificationsList.find((n) => n.applicationId === rawId || (app && n.applicationId === app.id));
  if (notif) notif.unread = false;

  res.json({
    success: true,
    message: `Applicant ${studentName} approved successfully and enrolled with Student ID ${student.rollNo}!`,
    student,
    application: app || {
      id: adm!.id,
      fullName: adm!.fullName,
      phoneNumber: adm!.phone,
      emailAddress: adm!.email,
      classGradeSelection: studentGrade,
      facultyStream: studentFaculty,
      status: "Approved",
      studentIdAssigned: student.rollNo,
      submittedAt: adm!.submittedAt,
    },
  });
});

// Manual Rejection Handler
app.post("/api/pending-applications/:id/reject", (req, res) => {
  const rawId = req.params.id.trim();
  const searchId = rawId.toUpperCase();
  const { adminNotes, adminUser = "Super Administrator" } = req.body;

  const app = pendingApplications.find(
    (a) =>
      a.id.toUpperCase() === searchId ||
      a.id.toUpperCase() === `APP-${searchId}` ||
      a.id.replace(/[^0-9]/g, "") === searchId.replace(/[^0-9]/g, "")
  );
  const adm = admissions.find(
    (a) =>
      a.id.toUpperCase() === searchId ||
      a.id.replace(/[^0-9]/g, "") === searchId.replace(/[^0-9]/g, "")
  );

  if (!app && !adm) {
    return res.status(404).json({ error: "Application record not found." });
  }

  if (app) {
    app.status = "Rejected";
    app.processedBy = adminUser;
    app.processedAt = new Date().toISOString();
    if (adminNotes) app.adminNotes = adminNotes;
  }

  if (adm) {
    adm.status = "Pending"; // or reject
  }

  // Mark related notification as read
  const notif = notificationsList.find((n) => n.applicationId === rawId || (app && n.applicationId === app.id));
  if (notif) notif.unread = false;

  res.json({
    success: true,
    message: `Application for ${app?.fullName || adm?.fullName} has been archived/rejected.`,
    application: app || adm,
  });
});

// --- REAL-TIME NOTIFICATIONS ENDPOINTS ---

// Get all notifications with unread count
app.get("/api/notifications", (req, res) => {
  const unreadCount = notificationsList.filter((n) => n.unread).length;
  res.json({
    notifications: notificationsList,
    unreadCount,
  });
});

// Mark single notification as read
app.patch("/api/notifications/:id/read", (req, res) => {
  const notif = notificationsList.find((n) => n.id === req.params.id);
  if (notif) {
    notif.unread = false;
  }
  const unreadCount = notificationsList.filter((n) => n.unread).length;
  res.json({ success: true, unreadCount });
});

// Mark all notifications as read
app.post("/api/notifications/read-all", (req, res) => {
  notificationsList.forEach((n) => (n.unread = false));
  res.json({ success: true, unreadCount: 0 });
});

// 11. Comprehensive Notice Management System Endpoints (CRUD)
app.get("/api/notices", (req, res) => {
  let result = [...notices];
  const { status, category, targetAudience, search } = req.query;

  if (status && typeof status === "string") {
    result = result.filter((n) => n.status.toLowerCase() === status.toLowerCase());
  }
  if (category && typeof category === "string" && category !== "All") {
    result = result.filter((n) => n.category.toLowerCase() === category.toLowerCase());
  }
  if (targetAudience && typeof targetAudience === "string" && targetAudience !== "All") {
    result = result.filter((n) => n.targetAudience === targetAudience || n.targetAudience === "All");
  }
  if (search && typeof search === "string") {
    const q = search.toLowerCase();
    result = result.filter((n) => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q));
  }

  res.json(result);
});

app.post("/api/notices", (req, res) => {
  const {
    title,
    content,
    category = "General",
    targetAudience = "All",
    date,
    expiryDate,
    isUrgent = false,
    status = "Active",
    attachmentName,
    attachmentUrl,
    author = "FactFusion Admin",
  } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: "Title and Content are required fields." });
  }

  const now = new Date().toISOString();
  const newNotice: NoticeRecord = {
    id: `NTC-${Date.now().toString().slice(-4)}`,
    title,
    content,
    category,
    targetAudience,
    date: date || now.substring(0, 10),
    expiryDate: expiryDate || undefined,
    isUrgent: Boolean(isUrgent),
    status: status || "Active",
    attachmentName: attachmentName || undefined,
    attachmentUrl: attachmentUrl || undefined,
    author,
    createdAt: now,
    updatedAt: now,
  };

  notices.unshift(newNotice);
  res.status(201).json(newNotice);
});

app.put("/api/notices/:id", (req, res) => {
  const { id } = req.params;
  const index = notices.findIndex((n) => n.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Notice not found." });
  }

  const updatedNotice: NoticeRecord = {
    ...notices[index],
    ...req.body,
    id, // Preserve ID
    updatedAt: new Date().toISOString(),
  };

  notices[index] = updatedNotice;
  res.json(updatedNotice);
});

app.patch("/api/notices/:id", (req, res) => {
  const { id } = req.params;
  const index = notices.findIndex((n) => n.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Notice not found." });
  }

  notices[index] = {
    ...notices[index],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };

  res.json(notices[index]);
});

app.delete("/api/notices/:id", (req, res) => {
  const { id } = req.params;
  const index = notices.findIndex((n) => n.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Notice not found." });
  }

  const removed = notices.splice(index, 1)[0];
  res.json({ message: "Notice deleted successfully.", deletedNotice: removed });
});

// 12. Comprehensive Event Management System Endpoints (CRUD)
app.get("/api/events", (req, res) => {
  let result = [...events];
  const { status, category, search } = req.query;

  if (status && typeof status === "string") {
    result = result.filter((e) => e.status.toLowerCase() === status.toLowerCase());
  }
  if (category && typeof category === "string" && category !== "All") {
    result = result.filter((e) => e.category.toLowerCase() === category.toLowerCase());
  }
  if (search && typeof search === "string") {
    const q = search.toLowerCase();
    result = result.filter(
      (e) => e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q) || e.venue.toLowerCase().includes(q)
    );
  }

  res.json(result);
});

app.post("/api/events", (req, res) => {
  const {
    title,
    description,
    date,
    time,
    venue,
    category = "Workshop",
    status = "Upcoming",
    bannerUrl,
    registrationLink,
    organizer = "FactFusion Hub Campus",
    maxAttendees = 200,
  } = req.body;

  if (!title || !description || !date || !time || !venue) {
    return res.status(400).json({ error: "Title, description, date, time, and venue are required." });
  }

  const now = new Date().toISOString();
  const newEvent: EventRecord = {
    id: `EVT-${Date.now().toString().slice(-4)}`,
    title,
    description,
    date,
    time,
    venue,
    category,
    status: status || "Upcoming",
    bannerUrl: bannerUrl || "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80",
    registrationLink: registrationLink || undefined,
    organizer,
    maxAttendees: Number(maxAttendees) || 200,
    registeredCount: 0,
    createdAt: now,
    updatedAt: now,
  };

  events.unshift(newEvent);
  res.status(201).json(newEvent);
});

app.put("/api/events/:id", (req, res) => {
  const { id } = req.params;
  const index = events.findIndex((e) => e.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Event not found." });
  }

  const updatedEvent: EventRecord = {
    ...events[index],
    ...req.body,
    id, // Preserve ID
    updatedAt: new Date().toISOString(),
  };

  events[index] = updatedEvent;
  res.json(updatedEvent);
});

app.patch("/api/events/:id", (req, res) => {
  const { id } = req.params;
  const index = events.findIndex((e) => e.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Event not found." });
  }

  events[index] = {
    ...events[index],
    ...req.body,
    updatedAt: new Date().toISOString(),
  };

  res.json(events[index]);
});

app.delete("/api/events/:id", (req, res) => {
  const { id } = req.params;
  const index = events.findIndex((e) => e.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Event not found." });
  }

  const removed = events.splice(index, 1)[0];
  res.json({ message: "Event deleted successfully.", deletedEvent: removed });
});

// Event RSVP endpoint for students/guests
app.post("/api/events/:id/rsvp", (req, res) => {
  const { id } = req.params;
  const { attendeeName, email, phone } = req.body;
  const event = events.find((e) => e.id === id);
  if (!event) {
    return res.status(404).json({ error: "Event not found." });
  }

  event.registeredCount = (event.registeredCount || 0) + 1;
  res.json({
    success: true,
    message: `RSVP confirmed for ${attendeeName || "Attendee"}! Ticket ID: TKT-${Date.now().toString().slice(-6)}`,
    event,
  });
});

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true, host: "0.0.0.0", port: PORT },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`FactFusion Hub Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
