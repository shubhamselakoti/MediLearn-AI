import type { Question, QuizCategory, Difficulty } from "@/types";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

async function callGroq(prompt: string): Promise<string> {
  const res = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content:
            "You are a medical education expert. When asked for JSON, return ONLY raw JSON with no markdown, no explanation, and no truncation. Never wrap in ```json blocks.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.4,
      max_tokens: 1800,
    }),
  });

  if (!res.ok) throw new Error(`Groq API error: ${res.status}`);
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "";
}

export async function generateQuizQuestions(
  category: QuizCategory,
  count: number,
  difficulty: Difficulty,
  questionType: string,
  prepFor?: string
): Promise<Question[]> {
  const prompt = `Generate exactly ${count} high-quality medical MCQ questions for ${category}.
Difficulty: ${difficulty}
Question type: ${questionType}
${prepFor ? `Exam preparation context: ${prepFor}` : ""}

Each question must be clinically accurate and educational. Return ONLY this JSON:
{
  "questions": [
    {
      "id": "q1",
      "question": "...",
      "options": ["A option", "B option", "C option", "D option"],
      "correctAnswer": 0,
      "explanation": "Detailed explanation of the correct answer and why others are wrong",
      "difficulty": "${difficulty}",
      "points": ${difficulty === "Beginner" ? 10 : difficulty === "Intermediate" ? 15 : 20}
    }
  ]
}`;

  const raw = await callGroq(prompt);
  const clean = raw.replace(/```json|```/g, "").trim();
  const parsed = JSON.parse(clean);
  return parsed.questions as Question[];
}

export async function generateVideoQuiz(transcript: string): Promise<{
  questions: Question[];
  summary: string;
  title: string;
}> {
  const prompt = `Based on this medical video transcript, generate exactly 5 educational MCQ questions.
Transcript: ${transcript.slice(0, 3000)}

Return ONLY this JSON:
{
  "title": "Descriptive title of the video topic",
  "summary": "2-3 sentence summary of the key medical concepts covered",
  "questions": [
    {
      "id": "q1",
      "question": "...",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": 0,
      "explanation": "Clear explanation referencing the video content",
      "difficulty": "Intermediate",
      "points": 15
    }
  ]
}`;

  const raw = await callGroq(prompt);
  const clean = raw.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}
