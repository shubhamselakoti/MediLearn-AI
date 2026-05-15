import mongoose, { Schema, type Document } from "mongoose";
import type { QuizCategory, QuizMode, QuestionType, Difficulty } from "@/types";

export interface IQuizAttemptDocument extends Document {
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

const QuizAttemptSchema = new Schema<IQuizAttemptDocument>(
  {
    userId: { type: String, required: true, index: true },
    category: { type: String, required: true },
    quizMode: { type: String, required: true },
    questionType: { type: String, required: true },
    difficulty: { type: String, required: true },
    score: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    correctAnswers: { type: Number, required: true },
    wrongAnswers: { type: Number, required: true },
    timeTaken: { type: Number, default: 0 },
    xpEarned: { type: Number, default: 0 },
    percentageScore: { type: Number, required: true },
    attemptedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.QuizAttempt ||
  mongoose.model<IQuizAttemptDocument>("QuizAttempt", QuizAttemptSchema);
