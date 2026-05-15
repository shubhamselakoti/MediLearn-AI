import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Difficulty, QuizCategory } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateLevel(xp: number): number {
  // Every 500 XP = 1 level
  return Math.floor(xp / 500) + 1;
}

export function xpToNextLevel(xp: number): { current: number; needed: number; percent: number } {
  const currentLevelXP = (calculateLevel(xp) - 1) * 500;
  const nextLevelXP = calculateLevel(xp) * 500;
  const current = xp - currentLevelXP;
  const needed = nextLevelXP - currentLevelXP;
  return { current, needed, percent: Math.round((current / needed) * 100) };
}

export function getLevelTitle(level: number): string {
  const titles: Record<number, string> = {
    1: "Medical Intern",
    2: "Junior Resident",
    3: "Resident",
    4: "Senior Resident",
    5: "Fellow",
    6: "Attending Physician",
    7: "Senior Physician",
    8: "Consultant",
    9: "Senior Consultant",
    10: "Professor",
  };
  return titles[Math.min(level, 10)] ?? "Chief of Medicine";
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

export function getScoreGrade(pct: number): {
  grade: string;
  emoji: string;
  color: string;
  message: string;
} {
  if (pct >= 90) return { grade: "A+", emoji: "🏆", color: "text-emerald-400", message: "Outstanding! Board-ready performance." };
  if (pct >= 80) return { grade: "A", emoji: "⭐", color: "text-green-400", message: "Excellent work! Keep it up." };
  if (pct >= 70) return { grade: "B", emoji: "👍", color: "text-blue-400", message: "Good job! A little more practice." };
  if (pct >= 60) return { grade: "C", emoji: "📖", color: "text-yellow-400", message: "Passing. Focus on weak areas." };
  return { grade: "D", emoji: "💪", color: "text-red-400", message: "Keep studying — you'll get there!" };
}

export function getCategoryInfo(cat: QuizCategory) {
  const info: Record<QuizCategory, { icon: string; color: string; gradient: string; description: string; count: number }> = {
    cardiology: {
      icon: "❤️",
      color: "#ef4444",
      gradient: "from-red-600 to-rose-800",
      description: "Heart diseases, ECG interpretation, hemodynamics & cardiac physiology",
      count: 45,
    },
    neurology: {
      icon: "🧠",
      color: "#8b5cf6",
      gradient: "from-violet-600 to-purple-900",
      description: "Brain, spinal cord, nervous system disorders & neuroanatomy",
      count: 38,
    },
    dermatology: {
      icon: "🔬",
      color: "#f59e0b",
      gradient: "from-amber-500 to-orange-700",
      description: "Skin conditions, lesions, dermatitis & dermatopathology",
      count: 32,
    },
    pediatrics: {
      icon: "👶",
      color: "#22c55e",
      gradient: "from-green-500 to-emerald-800",
      description: "Child development, growth milestones, pediatric diseases & vaccines",
      count: 40,
    },
    oncology: {
      icon: "🧬",
      color: "#3b82f6",
      gradient: "from-blue-500 to-indigo-800",
      description: "Cancer biology, staging, chemotherapy & oncology management",
      count: 28,
    },
    orthopedics: {
      icon: "🦴",
      color: "#14b8a6",
      gradient: "from-teal-500 to-cyan-800",
      description: "Bone fractures, joint disorders & musculoskeletal system",
      count: 35,
    },
  };
  return info[cat];
}

export function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function validateYouTubeUrl(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

export function getDifficultyColor(diff: Difficulty) {
  const map: Record<Difficulty, string> = {
    Beginner: "text-green-400 bg-green-400/10 border-green-400/20",
    Intermediate: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
    Advanced: "text-red-400 bg-red-400/10 border-red-400/20",
    Mixed: "text-purple-400 bg-purple-400/10 border-purple-400/20",
  };
  return map[diff] ?? map.Beginner;
}

export function generateStudyRecommendations(category: string, score: number): string[] {
  const base = [
    `Review the core ${category} concepts you missed in this quiz`,
    `Create flashcards for high-yield ${category} facts`,
    "Practice with timed questions to improve speed and accuracy",
  ];
  if (score < 60) return [
    `Start with foundational ${category} textbook chapters`,
    "Watch medical education videos on key concepts",
    ...base.slice(0, 2),
  ];
  if (score < 80) return base;
  return [
    `Advance to case-based ${category} scenarios`,
    "Attempt USMLE-style practice questions",
    "Teach concepts to peers for deeper retention",
  ];
}
