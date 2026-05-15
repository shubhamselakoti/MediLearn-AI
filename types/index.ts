import type { DefaultSession } from "next-auth";

// ─── Auth ───────────────────────────────────────────────────────────────────
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      xp: number;
      streak: number;
      level: number;
    } & DefaultSession["user"];
  }
}

// ─── User ────────────────────────────────────────────────────────────────────
export interface IUser {
  _id: string;
  name: string;
  email: string;
  image?: string;
  xp: number;
  streak: number;
  lastActive: Date;
  level: number;
  achievements: string[];
  quizHistory: string[];
  createdAt: Date;
}

// ─── Quiz ────────────────────────────────────────────────────────────────────
export type QuizCategory =
  | "cardiology"
  | "neurology"
  | "dermatology"
  | "pediatrics"
  | "oncology"
  | "orthopedics";

export type QuestionType = "Conceptual" | "Factual Recall" | "Case-based";
export type QuizMode = "Multiple Choice" | "Open-Ended";
export type Difficulty = "Beginner" | "Intermediate" | "Advanced" | "Mixed";

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: Difficulty;
  points: number;
  category?: QuizCategory;
}

export interface QuizSettings {
  category: QuizCategory;
  prepFor?: string;
  questionType: QuestionType;
  quizMode: QuizMode;
  count: number;
  difficulty: Difficulty;
}

export interface QuizAttempt {
  _id?: string;
  userId: string;
  category: QuizCategory;
  quizMode: QuizMode;
  questionType: QuestionType;
  difficulty: Difficulty;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  timeTaken: number;
  xpEarned: number;
  percentageScore: number;
  attemptedAt: Date;
}

// ─── Video Quiz ──────────────────────────────────────────────────────────────
export interface VideoQuizScore {
  _id?: string;
  userId: string;
  videoUrl: string;
  videoTitle: string;
  transcriptSummary: string;
  questions: Question[];
  score: number;
  totalQuestions: number;
  percentageScore: number;
  attemptedAt: Date;
}

// ─── Analytics ───────────────────────────────────────────────────────────────
export interface CategoryStat {
  category: QuizCategory;
  avgScore: number;
  totalAttempts: number;
  bestScore: number;
}

export interface AnalyticsData {
  totalQuizzes: number;
  totalVideoQuizzes: number;
  avgScore: number;
  totalXP: number;
  streak: number;
  categoryStats: CategoryStat[];
  recentActivity: QuizAttempt[];
  weeklyData: number[];
}

// ─── Achievement ─────────────────────────────────────────────────────────────
export interface Achievement {
  id: string;
  icon: string;
  name: string;
  description: string;
  xpReward: number;
  condition: (stats: UserStats) => boolean;
}

export interface UserStats {
  totalQuizzes: number;
  streak: number;
  maxScore: number;
  xp: number;
  level: number;
  categoriesCompleted: string[];
  videoQuizzes: number;
}

// ─── Leaderboard ─────────────────────────────────────────────────────────────
export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  image?: string;
  xp: number;
  streak: number;
  level: number;
  isCurrentUser?: boolean;
}

// ─── API Response ─────────────────────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
