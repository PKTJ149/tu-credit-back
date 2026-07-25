export type ScheduleLocation = {
  venue: string;
  building: string;
  room: string;
};

export type ScheduleItem = {
  date: string;
  time?: string;
  topic: string;
  teacher: string;
  status: "upcoming" | "ongoing" | "completed";
  mode?: "online" | "onsite";
  studyLink?: string;
  location?: ScheduleLocation;
};

export type SubjectDocument = {
  name: string;
  fileType: "pdf" | "pptx" | "xlsx" | "docx";
  size: string;
  url: string;
};

export type Subject = {
  id: string;
  slug: string;
  name: string;
  nameEn?: string;
  code?: string;
  category?: string;
  credits: number;
  faculty: string;
  summary: string;
  image?: string;
  price?: number;
  studyMode?: "online" | "onsite" | "hybrid";
  startDate?: string;
  endDate?: string;
  teacherIds?: string[];
  seats?: number;
  enrolledCount?: number;
  status?: "open" | "closed";
  duration?: string;
  outcomes?: string[];
  qualification?: string;
  description?: string;
  scheduleItems?: ScheduleItem[];
  documents?: SubjectDocument[];
};

export type Teacher = {
  id: string;
  name: string;
  title?: string;
  educationHistory?: string[];
  workingHistory?: string[];
};

export type Program = {
  id: string;
  slug: string;
  name: string;
  credits: number;
  level: string;
  faculty: string;
  summary: string;
  image?: string;
  description?: string;
  seats?: number;
  enrolledCount?: number;
  teacherIds?: string[];
  status?: "open" | "closed";
  type?: string;
  totalPrice?: number;
  originalPrice?: number;
  duration?: string;
  subjectIds?: string[];
  qualification?: string;
  careerPaths?: string[];
  outcomes?: string[];
};

export type NewsItem = {
  id: string;
  slug: string;
  title: string;
  date: string;
  summary: string;
};

export type HelpCategory = {
  id: string;
  title: string;
  description: string;
  articleCount: number;
};
