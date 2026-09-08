export interface Student {
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

export interface Admission {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  grade: string;
  faculty?: string;
  status: "Pending" | "Approved" | "Rejected";
  submittedAt: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  category: "Academic" | "Exam" | "General" | "Holiday" | "Urgent" | "Admission";
  targetAudience: "All" | "Students" | "Faculty" | "Parents" | "Public";
  date: string; // Published date (YYYY-MM-DD or formatted)
  expiryDate?: string; // Optional expiry date (YYYY-MM-DD)
  isUrgent?: boolean;
  status: "Active" | "Draft" | "Archived";
  attachmentName?: string;
  attachmentUrl?: string;
  author?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CampusEvent {
  id: string;
  title: string;
  description: string;
  date: string; // Event date (YYYY-MM-DD)
  time: string; // e.g. "10:00 AM - 02:00 PM"
  venue: string; // Location / Hall
  category: "Workshop" | "Seminar" | "Sports" | "Cultural" | "Tech" | "Career" | "Academic";
  status: "Upcoming" | "Ongoing" | "Completed";
  bannerUrl?: string;
  registrationLink?: string;
  organizer?: string;
  maxAttendees?: number;
  registeredCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export type AspectRatioType = "1:1" | "2:3" | "3:2" | "3:4" | "4:3" | "9:16" | "16:9" | "21:9";

export interface GeneratedImageRecord {
  imageUrl: string;
  caption?: string;
  aspectRatio: string;
  prompt: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  modelUsed?: string;
  timestamp: string;
  thinkingMode?: boolean;
}
