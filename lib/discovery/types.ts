export type SubjectCategory = {
  id: string;
  name: string;
  nameEn?: string;
  subjects: Subject[];
};

export type ScheduleItem = {
  date: string;
  topic: string;
  teacher: string;
  status: "upcoming" | "ongoing" | "completed";
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
  price?: number;
  studyMode?: "online" | "onsite" | "hybrid";
  startDate?: string;
  endDate?: string;
  teachers?: string[];
  seats?: number;
  enrolledCount?: number;
  status?: "open" | "closed";
  duration?: string;
  outcomes?: string[];
  qualification?: string;
  description?: string;
  scheduleItems?: ScheduleItem[];
};

export type Program = {
  id: string;
  slug: string;
  name: string;
  credits: number;
  level: string;
  faculty: string;
  summary: string;
  description?: string;
  seats?: number;
  enrolledCount?: number;
  teachers?: string[];
  status?: "open" | "closed";
  type?: string;
  totalPrice?: number;
  originalPrice?: number;
  duration?: string;
  subjects?: Subject[];
  subjectCategories?: SubjectCategory[];
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
