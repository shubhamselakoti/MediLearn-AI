import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateQuizQuestions } from "@/lib/groq";
import { getRandomQuestions } from "@/data/questions";
import type { QuizCategory, Difficulty, QuestionType } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      category,
      count = 10,
      difficulty = "Intermediate",
      questionType = "Conceptual",
      prepFor,
    } = body as {
      category: QuizCategory;
      count: number;
      difficulty: Difficulty;
      questionType: QuestionType;
      prepFor?: string;
    };

    if (!category) {
      return NextResponse.json({ success: false, error: "Category is required" }, { status: 400 });
    }

    // Try AI generation first, fall back to static questions
    let questions;
    try {
      questions = await generateQuizQuestions(category, count, difficulty, questionType, prepFor);
    } catch (aiError) {
      console.warn("AI generation failed, using fallback questions:", aiError);
      questions = getRandomQuestions(category, count);
    }

    return NextResponse.json({ success: true, data: questions });
  } catch (error) {
    console.error("Quiz API error:", error);
    return NextResponse.json({ success: false, error: "Failed to generate quiz" }, { status: 500 });
  }
}
