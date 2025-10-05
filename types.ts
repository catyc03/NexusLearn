export interface Goal {
  id: string;
  text: string;
  completed: boolean;
}

export interface Subject {
  id: string;
  title: string;
  description: string;
  color: string;
  progress: number;
  goals: Goal[];
}

export interface StudyPlan {
  plan: string;
  sources: { uri: string; title: string }[];
}

export interface HistoricalStudyPlan {
  id: string;
  subjectTitle: string;
  date: string; // ISO string
  plan: StudyPlan;
}

export interface BudgetPlan {
  summary: string;
  breakdown: {
    category: string;
    percentage: number;
    amount: number;
  }[];
  tips: string[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string; // ISO string
  end: string; // ISO string
  planId?: string;
  color?: string;
}

export interface Reminder {
  id: string;
  subjectTitle: string;
  remindAt: string; // ISO string
  planId?: string;
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'model';
    text: string;
}

export interface User {
    id: string;
    email: string;
    name?: string;
    password?: string; // Stored hashed in a real app
}