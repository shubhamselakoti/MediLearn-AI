import mongoose, { Schema, type Document } from "mongoose";
import type { Question } from "@/types";

export interface IVideoQuizScoreDocument extends Document {
  userId: string;
  videoUrl: string;
  videoTitle: string;
  transcriptSummary: string;
  questions: Question[];
  score: number;
  xpEarned: number;
  totalQuestions: number;
  percentageScore: number;
  attemptedAt: Date;
}

const QuestionSchema = new Schema(
  {
    id: String,
    question: String,
    options: [String],
    correctAnswer: Number,
    explanation: String,
    difficulty: String,
    points: Number,
  },
  { _id: false }
);

const VideoQuizScoreSchema = new Schema<IVideoQuizScoreDocument>(
  {
    userId: { type: String, required: true, index: true },
    videoUrl: { type: String, required: true },
    videoTitle: { type: String, default: "Medical Video Quiz" },
    transcriptSummary: { type: String, default: "" },
    questions: [QuestionSchema],
    score: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    percentageScore: { type: Number, required: true },
    xpEarned: { type: Number, default: 0 },
    attemptedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.VideoQuizScore ||
  mongoose.model<IVideoQuizScoreDocument>("VideoQuizScore", VideoQuizScoreSchema);
