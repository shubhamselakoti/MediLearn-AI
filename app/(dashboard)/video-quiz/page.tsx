"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { validateYouTubeUrl } from "@/lib/utils";
import type { Question } from "@/types";

type Stage = "input" | "loading" | "quiz" | "results";

const LOAD_STEPS = [
  { label: "Fetching video transcript…", pct: 15 },
  { label: "Processing transcript with AI…", pct: 35 },
  { label: "Summarizing key concepts…", pct: 60 },
  { label: "Generating MCQ questions…", pct: 80 },
  { label: "Finalizing your quiz…", pct: 95 },
];

export default function VideoQuizPage() {
  const router = useRouter();
  const submitAttemptedRef = useRef(false);
  const [url, setUrl] = useState("");
  const [stage, setStage] = useState<Stage>("input");
  const [loadStep, setLoadStep] = useState(0);
  const [loadPct, setLoadPct] = useState(0);
  const [videoId, setVideoId] = useState("");
  const [quizTitle, setQuizTitle] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const [score, setScore] = useState(0);
  const [wrong, setWrong] = useState(0);

  const handleGenerate = async () => {
    const trimmed = url.trim();
    if (!trimmed) { toast.error("Please enter a YouTube URL"); return; }
    const vid = validateYouTubeUrl(trimmed);
    if (!vid) { toast.error("❌ Invalid YouTube URL. Please enter a valid YouTube link."); return; }

    setVideoId(vid);
    setStage("loading");

    // Animate load steps
    for (let i = 0; i < LOAD_STEPS.length; i++) {
      await new Promise((r) => setTimeout(r, 900));
      setLoadStep(i);
      setLoadPct(LOAD_STEPS[i].pct);
    }

    try {
      const res = await fetch("/api/video-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoUrl: trimmed }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error ?? "Failed");
      setLoadPct(100);
      await new Promise((r) => setTimeout(r, 500));
      setQuestions(data.data.questions);
      setQuizTitle(data.data.title ?? "Medical Video Quiz");
      setStage("quiz");
      setCurrentQ(0);
      setAnswered(false);
      setSelected(null);
      setCorrect(0);
      setWrong(0);
      setScore(0);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Generation failed";
      toast.error(msg);
      setStage("input");
    }
  };

  const handleAnswer = (idx: number) => {
    if (answered) return;
    setAnswered(true);
    setSelected(idx);
    const q = questions[currentQ];
    if (idx === q.correctAnswer) {
      setCorrect((c) => c + 1);
      setScore((s) => s + q.points);
      toast.success(`✅ Correct! +${q.points} XP`);
    } else {
      setWrong((w) => w + 1);
      toast.error("❌ Incorrect!");
    }
  };

  const nextQ = () => {
    if (currentQ + 1 >= questions.length) {
      setStage("results");
    } else {
      setCurrentQ((q) => q + 1);
      setAnswered(false);
      setSelected(null);
    }
  };

  const handleSubmitResult = async () => {
    try {
      const res = await fetch("/api/video-quiz", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoUrl: url,
          videoTitle: quizTitle,
          transcriptSummary: "",
          questions,
          score,
          xpEarned: score,
          totalQuestions: questions.length,
          percentageScore: questions.length ? Math.round((correct / questions.length) * 100) : 0,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        console.error("Save error:", data.error);
        toast.error("Failed to save quiz result");
        return;
      }
      toast.success("Quiz result saved!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Save failed";
      console.error("Submit result error:", msg);
      toast.error("Failed to save result");
    }
  };

  // Save results when quiz is completed (only once)
  useEffect(() => {
    if (stage === "results" && !submitAttemptedRef.current && questions.length > 0) {
      submitAttemptedRef.current = true;
      handleSubmitResult();
    }
  }, [stage, questions.length]);

  const reset = () => {
    setStage("input");
    setUrl("");
    setVideoId("");
    setQuestions([]);
    submitAttemptedRef.current = false;
  };

  const pct = questions.length ? Math.round((correct / questions.length) * 100) : 0;

  return (
    <div className="page-in max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <h2 className="font-syne text-2xl font-bold" style={{ color: "var(--text)" }}>Video Quiz</h2>
        <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: "rgba(34,208,122,0.15)", color: "var(--green)", border: "1px solid rgba(34,208,122,0.25)" }}>
          NEW
        </span>
      </div>

      <AnimatePresence mode="wait">
        {/* Input Stage */}
        {stage === "input" && (
          <motion.div key="input" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <div className="glass-card p-6 mb-5" style={{ borderColor: "rgba(79,127,255,0.2)" }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
                style={{ background: "rgba(79,127,255,0.12)", border: "1px solid rgba(79,127,255,0.2)" }}>📹</div>
              <h3 className="font-syne text-lg font-bold mb-1.5" style={{ color: "var(--text)" }}>
                Learn from any Medical Video
              </h3>
              <p className="text-sm mb-5" style={{ color: "var(--text3)" }}>
                Paste a YouTube URL and our AI will generate an interactive MCQ quiz from the video content.
              </p>
              <label className="text-xs font-semibold block mb-2" style={{ color: "var(--text2)" }}>YouTube Video URL</label>
              <div className="flex gap-2">
                <input type="url" value={url} onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                  style={{ background: "var(--surface)", border: "1.5px solid var(--border)", color: "var(--text)" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                  onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                />
                <button onClick={handleGenerate}
                  className="px-4 py-2.5 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5 whitespace-nowrap"
                  style={{ background: "linear-gradient(135deg, #4f7fff, #a78bfa)", color: "#fff", boxShadow: "0 4px 16px rgba(79,127,255,0.35)" }}>
                  Generate Quiz ✨
                </button>
              </div>
              <p className="text-xs mt-2" style={{ color: "var(--text3)" }}>
                Must be a valid YouTube URL with captions/subtitles enabled.
              </p>
            </div>

            {/* Feature list */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: "🔤", title: "Transcript AI", desc: "Automatically extracts video content" },
                { icon: "🧠", title: "Smart Questions", desc: "AI generates 5 targeted MCQs" },
                { icon: "📊", title: "Instant Analytics", desc: "Track your video quiz scores" },
              ].map((f) => (
                <div key={f.title} className="glass-card p-4 text-center">
                  <div className="text-2xl mb-2">{f.icon}</div>
                  <div className="text-sm font-semibold mb-1" style={{ color: "var(--text)" }}>{f.title}</div>
                  <div className="text-xs leading-relaxed" style={{ color: "var(--text3)" }}>{f.desc}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Loading Stage */}
        {stage === "loading" && (
          <motion.div key="loading" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
            <div className="glass-card p-8 text-center">
              <motion.div className="text-5xl mb-4 inline-block float-anim">🧠</motion.div>
              <h3 className="font-syne text-xl font-bold mb-2" style={{ color: "var(--text)" }}>Analyzing Video…</h3>
              <p className="text-sm mb-6" style={{ color: "var(--text3)" }}>{LOAD_STEPS[loadStep]?.label ?? "Processing…"}</p>

              {/* YouTube preview */}
              {videoId && (
                <div className="rounded-xl overflow-hidden mb-6 aspect-video"
                  style={{ background: "var(--bg3)", border: "1px solid var(--border)" }}>
                  <img src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`} alt="Video thumbnail"
                    className="w-full h-full object-cover opacity-60" />
                </div>
              )}

              <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--bg3)" }}>
                <motion.div className="h-full rounded-full"
                  animate={{ width: `${loadPct}%` }} transition={{ duration: 0.6, ease: "easeOut" }}
                  style={{ background: "linear-gradient(90deg, #38bdf8, #4f7fff)" }} />
              </div>
              <p className="text-xs mt-2" style={{ color: "var(--text3)" }}>{loadPct}% complete</p>
            </div>
          </motion.div>
        )}

        {/* Quiz Stage */}
        {stage === "quiz" && questions.length > 0 && (
          <motion.div key="quiz" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            {/* Video preview strip */}
            {videoId && (
              <div className="glass-card p-3 flex items-center gap-3 mb-5">
                <img src={`https://img.youtube.com/vi/${videoId}/default.jpg`} alt="Thumb"
                  className="w-16 h-12 rounded-lg object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate" style={{ color: "var(--text)" }}>{quizTitle}</div>
                  <div className="text-xs" style={{ color: "var(--text3)" }}>Video Quiz · 5 Questions</div>
                </div>
                <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ background: "rgba(56,189,248,0.12)", color: "var(--cyan)", border: "1px solid rgba(56,189,248,0.2)" }}>
                  📹 Video
                </span>
              </div>
            )}

            {/* Progress */}
            <div className="mb-5">
              <div className="flex justify-between text-xs mb-2" style={{ color: "var(--text2)" }}>
                <span>Question {currentQ + 1} of {questions.length}</span>
                <span>Score: <span className="font-bold" style={{ color: "var(--green)" }}>{score}</span></span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--bg3)" }}>
                <motion.div className="h-full rounded-full" animate={{ width: `${((currentQ) / questions.length) * 100}%` }}
                  style={{ background: "linear-gradient(90deg, #38bdf8, #4f7fff)" }} transition={{ duration: 0.4 }} />
              </div>
            </div>

            {/* Question */}
            <AnimatePresence mode="wait">
              <motion.div key={currentQ} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="glass-card p-6 mb-4" style={{ borderColor: "rgba(56,189,248,0.15)" }}>
                  <div className="flex gap-2 mb-4">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: "rgba(56,189,248,0.12)", color: "var(--cyan)", border: "1px solid rgba(56,189,248,0.2)" }}>
                      {questions[currentQ].difficulty}
                    </span>
                  </div>
                  <p className="text-base font-semibold leading-relaxed" style={{ color: "var(--text)" }}>
                    {questions[currentQ].question}
                  </p>
                </div>

                <div className="space-y-2.5 mb-4">
                  {questions[currentQ].options.map((opt, i) => {
                    let bg = "var(--surface)"; let border = "var(--border2)"; let color = "var(--text)";
                    if (answered) {
                      if (i === questions[currentQ].correctAnswer) { bg = "rgba(34,208,122,0.12)"; border = "var(--green)"; color = "var(--green)"; }
                      else if (i === selected) { bg = "rgba(255,91,122,0.12)"; border = "var(--red)"; color = "var(--red)"; }
                    }
                    return (
                      <button key={i} onClick={() => handleAnswer(i)} disabled={answered}
                        className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-left text-sm font-medium transition-all"
                        style={{ background: bg, border: `1.5px solid ${border}`, color }}>
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ border: `1.5px solid ${border}` }}>
                          {String.fromCharCode(65 + i)}
                        </div>
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>

                <AnimatePresence>
                  {answered && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                      <div className="p-4 rounded-xl mb-3" style={{ background: "rgba(79,127,255,0.08)", border: "1px solid rgba(79,127,255,0.2)" }}>
                        <div className="text-xs font-bold mb-2" style={{ color: "var(--accent)" }}>💡 EXPLANATION</div>
                        <p className="text-sm leading-relaxed" style={{ color: "var(--text2)" }}>{questions[currentQ].explanation}</p>
                      </div>
                      <button onClick={nextQ}
                        className="w-full py-3.5 rounded-xl font-bold text-sm"
                        style={{ background: "linear-gradient(135deg, #4f7fff, #a78bfa)", color: "#fff" }}>
                        {currentQ + 1 >= questions.length ? "See Results 🎉" : "Next →"}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}

        {/* Results Stage */}
        {stage === "results" && (
          <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <div className="text-5xl mb-4">{pct >= 80 ? "🎉" : pct >= 60 ? "👍" : "📖"}</div>
            <h3 className="font-syne text-2xl font-bold mb-2" style={{ color: "var(--text)" }}>Video Quiz Complete!</h3>
            <p className="text-sm mb-6" style={{ color: "var(--text2)" }}>{quizTitle}</p>

            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="glass-card p-4">
                <div className="text-2xl font-bold mb-1" style={{ color: "var(--green)" }}>{correct}</div>
                <div className="text-xs" style={{ color: "var(--text3)" }}>Correct</div>
              </div>
              <div className="glass-card p-4">
                <div className="text-2xl font-bold mb-1" style={{ color: "var(--accent)" }}>{pct}%</div>
                <div className="text-xs" style={{ color: "var(--text3)" }}>Score</div>
              </div>
              <div className="glass-card p-4">
                <div className="text-2xl font-bold mb-1" style={{ color: "var(--yellow)" }}>+{score}</div>
                <div className="text-xs" style={{ color: "var(--text3)" }}>XP</div>
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <button onClick={reset} className="px-5 py-2.5 rounded-xl text-sm font-semibold"
                style={{ background: "var(--surface2)", border: "1px solid var(--border2)", color: "var(--text)" }}>
                Try Another Video
              </button>
              <button onClick={() => router.push("/analytics")} className="px-5 py-2.5 rounded-xl text-sm font-semibold"
                style={{ background: "linear-gradient(135deg, #4f7fff, #a78bfa)", color: "#fff" }}>
                View Analytics 📊
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
