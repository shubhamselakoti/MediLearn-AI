"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { getRandomQuestions } from "@/data/questions";
import { getCategoryInfo, getScoreGrade, generateStudyRecommendations, formatTime } from "@/lib/utils";
import type { Question, QuizCategory } from "@/types";

export default function QuizPage() {
  const params = useParams();
  const search = useSearchParams();
  const router = useRouter();
  const category = params.category as QuizCategory;
  const count = parseInt(search.get("count") ?? "10");

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [phase, setPhase] = useState<"quiz" | "results">("quiz");

  // Quiz state
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(90);
  const [totalTime, setTotalTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const info = getCategoryInfo(category);

  // Load questions
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/quiz", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            category,
            count,
            difficulty: search.get("difficulty") ?? "Intermediate",
            questionType: search.get("questionType") ?? "Conceptual",
            prepFor: search.get("prepFor") ?? "",
          }),
        });
        const data = await res.json();
        if (data.success) setQuestions(data.data);
        else throw new Error();
      } catch {
        // Fallback to local questions
        setQuestions(getRandomQuestions(category, count));
        toast.info("Using curated question bank");
      }
      setLoading(false);
    };
    load();
  }, [category, count, search]);

  // Timer
  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeLeft(90);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          handleAutoAnswer();
          return 0;
        }
        setTotalTime((tt) => tt + 1);
        return t - 1;
      });
    }, 1000);
  }, []); // eslint-disable-line

  useEffect(() => {
    if (!loading && questions.length > 0 && phase === "quiz") startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [loading, currentQ, phase]); // eslint-disable-line

  const handleAutoAnswer = () => {
    if (!answered) {
      setAnswered(true);
      setWrong((w) => w + 1);
      toast.error("⏱️ Time's up!");
    }
  };

  const handleAnswer = (idx: number) => {
    if (answered) return;
    clearInterval(timerRef.current!);
    setAnswered(true);
    setSelected(idx);
    const q = questions[currentQ];
    if (idx === q.correctAnswer) {
      setCorrect((c) => c + 1);
      setScore((s) => s + q.points);
      toast.success(`✅ Correct! +${q.points} XP`);
    } else {
      setWrong((w) => w + 1);
      toast.error("❌ Incorrect! Check the explanation.");
    }
  };

  const nextQuestion = () => {
    if (currentQ + 1 >= questions.length) {
      finishQuiz();
    } else {
      setCurrentQ((q) => q + 1);
      setAnswered(false);
      setSelected(null);
    }
  };

  const finishQuiz = async () => {
    setPhase("results");
    const pct = Math.round((correct / questions.length) * 100);
    try {
      await fetch("/api/quiz/attempt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          quizMode: search.get("quizMode") ?? "Multiple Choice",
          questionType: search.get("questionType") ?? "Conceptual",
          difficulty: search.get("difficulty") ?? "Intermediate",
          score,
          totalQuestions: questions.length,
          correctAnswers: correct,
          wrongAnswers: wrong,
          timeTaken: totalTime,
          xpEarned: score,
          percentageScore: pct,
        }),
      });
    } catch { /* silent */ }
  };

  if (loading) return <QuizLoader />;

  if (phase === "results") {
    const pct = Math.round((correct / questions.length) * 100);
    const grade = getScoreGrade(pct);
    const recs = generateStudyRecommendations(category, pct);
    return <ResultsScreen pct={pct} grade={grade} correct={correct} wrong={wrong} score={score} totalTime={totalTime} recs={recs} category={category} onRetry={() => router.push(`/categories`)} />;
  }

  const q = questions[currentQ];
  if (!q) return null;
  const progress = ((currentQ) / questions.length) * 100;

  return (
    <div className="page-in max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <button onClick={() => router.push("/categories")} className="text-sm px-3 py-1.5 rounded-xl transition-all"
          style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text2)" }}>
          ✕ Exit
        </button>
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full capitalize"
            style={{ background: `${info.color}20`, color: info.color, border: `1px solid ${info.color}30` }}>
            {info.icon} {category}
          </span>
          <Timer timeLeft={timeLeft} />
        </div>
      </div>

      {/* Progress */}
      <div className="mb-5">
        <div className="flex justify-between text-xs mb-2" style={{ color: "var(--text2)" }}>
          <span>Question {currentQ + 1} of {questions.length}</span>
          <span>Score: <span className="font-bold" style={{ color: "var(--green)" }}>{score}</span></span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--bg3)" }}>
          <motion.div className="h-full rounded-full" animate={{ width: `${Math.max(progress, 5)}%` }}
            style={{ background: "linear-gradient(90deg, #4f7fff, #a78bfa)" }} transition={{ duration: 0.4 }} />
        </div>
        <div className="flex gap-1 mt-2">
          {questions.map((_, i) => (
            <div key={i} className="flex-1 h-1 rounded-full transition-all"
              style={{ background: i < currentQ ? "var(--green)" : i === currentQ ? "var(--accent)" : "var(--bg3)" }} />
          ))}
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div key={currentQ} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
          <div className="glass-card p-6 mb-4" style={{ borderColor: "rgba(79,127,255,0.15)" }}>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: "rgba(167,139,250,0.12)", color: "var(--purple)", border: "1px solid rgba(167,139,250,0.2)" }}>
                {q.difficulty}
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: "rgba(255,201,60,0.12)", color: "var(--yellow)", border: "1px solid rgba(255,201,60,0.2)" }}>
                +{q.points} XP
              </span>
            </div>
            <p className="text-base font-semibold leading-relaxed" style={{ color: "var(--text)" }}>{q.question}</p>
          </div>

          <div className="space-y-2.5 mb-4">
            {q.options.map((opt, i) => {
              let bg = "var(--surface)";
              let border = "var(--border2)";
              let color = "var(--text)";
              if (answered) {
                if (i === q.correctAnswer) { bg = "rgba(34,208,122,0.12)"; border = "var(--green)"; color = "var(--green)"; }
                else if (i === selected && i !== q.correctAnswer) { bg = "rgba(255,91,122,0.12)"; border = "var(--red)"; color = "var(--red)"; }
              } else if (selected === i) { bg = "rgba(79,127,255,0.12)"; border = "var(--accent)"; color = "var(--accent)"; }

              return (
                <motion.button key={i} onClick={() => handleAnswer(i)} disabled={answered}
                  className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left transition-all font-medium text-sm"
                  style={{ background: bg, border: `1.5px solid ${border}`, color }}
                  whileTap={!answered ? { scale: 0.99 } : {}}
                  onMouseEnter={(e) => { if (!answered) { (e.currentTarget as HTMLElement).style.borderColor = "var(--accent)"; } }}
                  onMouseLeave={(e) => { if (!answered && selected !== i) { (e.currentTarget as HTMLElement).style.borderColor = "var(--border2)"; } }}>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ border: `1.5px solid ${border}` }}>
                    {String.fromCharCode(65 + i)}
                  </div>
                  <span>{opt}</span>
                  {answered && i === q.correctAnswer && <span className="ml-auto">✅</span>}
                  {answered && i === selected && i !== q.correctAnswer && <span className="ml-auto">❌</span>}
                </motion.button>
              );
            })}
          </div>

          {/* Explanation */}
          <AnimatePresence>
            {answered && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                <div className="p-4 rounded-xl mb-3" style={{ background: "rgba(79,127,255,0.08)", border: "1px solid rgba(79,127,255,0.2)" }}>
                  <div className="text-xs font-bold mb-2" style={{ color: "var(--accent)" }}>💡 EXPLANATION</div>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text2)" }}>{q.explanation}</p>
                </div>
                <button onClick={nextQuestion}
                  className="w-full py-3.5 rounded-xl font-bold text-sm transition-all hover:-translate-y-0.5"
                  style={{ background: "linear-gradient(135deg, #4f7fff, #a78bfa)", color: "#fff", boxShadow: "0 4px 20px rgba(79,127,255,0.4)" }}>
                  {currentQ + 1 >= questions.length ? "See Results 🎉" : "Next Question →"}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function Timer({ timeLeft }: { timeLeft: number }) {
  const color = timeLeft <= 10 ? "var(--red)" : timeLeft <= 30 ? "var(--yellow)" : "var(--text2)";
  const m = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const s = String(timeLeft % 60).padStart(2, "0");
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
      <span className="text-sm">⏱️</span>
      <span className="text-sm font-bold font-mono" style={{ color }}>{m}:{s}</span>
    </div>
  );
}

function QuizLoader() {
  return (
    <div className="max-w-2xl mx-auto page-in">
      <div className="h-10 w-32 skeleton mb-6" />
      <div className="h-2 skeleton mb-6" />
      <div className="h-32 skeleton rounded-2xl mb-4" />
      {[1,2,3,4].map(i => <div key={i} className="h-14 skeleton rounded-xl mb-3" />)}
    </div>
  );
}

function ResultsScreen({ pct, grade, correct, wrong, score, totalTime, recs, category, onRetry }:
  { pct: number; grade: ReturnType<typeof getScoreGrade>; correct: number; wrong: number; score: number; totalTime: number; recs: string[]; category: string; onRetry: () => void }) {
  const router = useRouter();
  const circumference = 2 * Math.PI * 66;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="max-w-xl mx-auto text-center page-in">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}>
        <div className="text-6xl mb-4">{grade.emoji}</div>
      </motion.div>
      <h2 className="font-syne text-2xl font-bold mb-2" style={{ color: "var(--text)" }}>{grade.grade === "A+" || grade.grade === "A" ? "Outstanding!" : "Quiz Complete!"}</h2>
      <p className="text-sm mb-8" style={{ color: "var(--text2)" }}>{grade.message}</p>

      {/* Score Ring */}
      <div className="inline-block mb-8 relative">
        <svg width="160" height="160" className="transform -rotate-90">
          <circle cx="80" cy="80" r="66" fill="none" stroke="var(--bg3)" strokeWidth="12" />
          <motion.circle cx="80" cy="80" r="66" fill="none" strokeWidth="12" strokeLinecap="round"
            stroke="url(#sg)" strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }} animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }} />
          <defs>
            <linearGradient id="sg" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#4f7fff" /><stop offset="100%" stopColor="#a78bfa" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.div className="font-syne text-3xl font-bold" style={{ color: "var(--text)" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            {pct}%
          </motion.div>
          <div className="text-xs" style={{ color: "var(--text3)" }}>Score</div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { label: "Correct", value: correct, color: "var(--green)" },
          { label: "Wrong", value: wrong, color: "var(--red)" },
          { label: "XP", value: `+${score}`, color: "var(--accent)" },
          { label: "Time", value: formatTime(totalTime), color: "var(--yellow)" },
        ].map((s) => (
          <div key={s.label} className="glass-card p-3">
            <div className="text-lg font-bold mb-0.5" style={{ color: s.color }}>{s.value}</div>
            <div className="text-xs" style={{ color: "var(--text3)" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* AI Recs */}
      <div className="glass-card p-4 text-left mb-6">
        <div className="font-syne text-sm font-bold mb-3" style={{ color: "var(--text)" }}>🤖 AI Study Recommendations</div>
        {recs.map((r, i) => (
          <div key={i} className="flex items-start gap-2.5 py-2 text-sm" style={{ borderBottom: i < recs.length - 1 ? "1px solid var(--border)" : "none", color: "var(--text2)" }}>
            <span className="mt-0.5">{["📖", "🎯", "🔄"][i] ?? "💡"}</span>
            <span>{r}</span>
          </div>
        ))}
      </div>

      <div className="flex gap-3 justify-center">
        <button onClick={onRetry} className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
          style={{ background: "var(--surface2)", border: "1px solid var(--border2)", color: "var(--text)" }}>
          ← Try Another
        </button>
        <button onClick={() => router.push("/analytics")} className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
          style={{ background: "linear-gradient(135deg, #4f7fff, #a78bfa)", color: "#fff" }}>
          View Analytics 📊
        </button>
      </div>
    </div>
  );
}
