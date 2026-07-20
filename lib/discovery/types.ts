export type Program = {
  id: string;
  slug: string;
  name: string;
  credits: number;
  level: string;
  faculty: string;
  summary: string;
};

export type Subject = {
  id: string;
  slug: string;
  name: string;
  credits: number;
  faculty: string;
  summary: string;
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
