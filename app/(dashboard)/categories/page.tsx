"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { getCategoryInfo } from "@/lib/utils";
import type { QuizCategory, Difficulty, QuestionType, QuizMode } from "@/types";

const CATEGORIES: QuizCategory[] = ["cardiology", "neurology", "dermatology", "pediatrics", "oncology", "orthopedics"];

const PREP_SUGGESTIONS = ["USMLE Step 1", "USMLE Step 2 CK", "Final Exams", "Board Certification", "Clinical Rotations", "MBBS Theory", "General Knowledge"];

export default function CategoriesPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<QuizCategory | null>(null);
  const [settings, setSettings] = useState({
    prepFor: "",
    questionType: "Conceptual" as QuestionType,
    quizMode: "Multiple Choice" as QuizMode,
    count: 10,
    difficulty: "Intermediate" as Difficulty,
  });

  const openSettings = (cat: QuizCategory) => setSelected(cat);
  const closeSettings = () => setSelected(null);

  const handleStart = () => {
    if (!selected) return;
    const params = new URLSearchParams({
      category: selected,
      questionType: settings.questionType,
      quizMode: settings.quizMode,
      count: settings.count.toString(),
      difficulty: settings.difficulty,
      ...(settings.prepFor && { prepFor: settings.prepFor }),
    });
    toast.success(`Starting ${selected} quiz — ${settings.count} questions!`);
    router.push(`/quiz/${selected}?${params}`);
  };

  return (
    <div className="page-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="font-syne text-2xl font-bold mb-1" style={{ color: "var(--text)" }}>Medical Categories</h2>
          <p className="text-sm" style={{ color: "var(--text2)" }}>Choose a specialty and test your knowledge</p>
        </div>
      </div>

      <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.08 } } }}>
        {CATEGORIES.map((cat) => {
          const info = getCategoryInfo(cat);
          return (
            <motion.div key={cat} variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
              <CategoryCard cat={cat} info={info} onStart={() => openSettings(cat)} />
            </motion.div>
          );
        })}
      </motion.div>

      {/* Quiz Settings Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
            onClick={(e) => e.target === e.currentTarget && closeSettings()}>
            <motion.div initial={{ scale: 0.9, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }} transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="w-full max-w-lg max-h-[90vh] overflow-y-auto"
              style={{ background: "var(--bg3)", border: "1px solid var(--border2)", borderRadius: 20, boxShadow: "0 24px 64px #00000080" }}>

              {/* Modal Header */}
              <div className="p-6 pb-0">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{getCategoryInfo(selected).icon}</span>
                    <div>
                      <h3 className="font-syne text-lg font-bold" style={{ color: "var(--text)" }}>
                        Quiz Settings
                      </h3>
                      <p className="text-xs capitalize" style={{ color: "var(--text3)" }}>{selected}</p>
                    </div>
                  </div>
                  <button onClick={closeSettings} className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
                    style={{ background: "var(--surface2)", color: "var(--text3)" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text)")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "var(--text3)")}>✕</button>
                </div>
                <div className="h-px mt-4" style={{ background: "var(--border)" }} />
              </div>

              <div className="p-6 space-y-5">
                {/* Prep For */}
                <div>
                  <label className="text-xs font-semibold block mb-2" style={{ color: "var(--text2)" }}>
                    What are you preparing for? <span style={{ color: "var(--text3)" }}>(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={settings.prepFor}
                    onChange={(e) => setSettings((s) => ({ ...s, prepFor: e.target.value }))}
                    placeholder="e.g. USMLE Step 1, Final Exams..."
                    className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
                    style={{ background: "var(--surface)", border: "1.5px solid var(--border)", color: "var(--text)" }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                  />
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {PREP_SUGGESTIONS.map((s) => (
                      <button key={s} onClick={() => setSettings((prev) => ({ ...prev, prepFor: s }))}
                        className="text-xs px-2.5 py-1 rounded-full transition-all"
                        style={{ background: "var(--surface2)", color: "var(--text3)", border: "1px solid var(--border)" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--accent)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(79,127,255,0.3)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text3)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; }}>
                        {s}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs mt-1.5" style={{ color: "var(--text3)" }}>
                    Providing context helps us tailor difficulty and question style.
                  </p>
                </div>

                {/* Question Type */}
                <div>
                  <label className="text-xs font-semibold block mb-2" style={{ color: "var(--text2)" }}>Preferred Question Type</label>
                  <div className="flex gap-2 flex-wrap">
                    {(["Conceptual", "Factual Recall", "Case-based"] as QuestionType[]).map((t) => (
                      <RadioBtn key={t} label={t} selected={settings.questionType === t}
                        onClick={() => setSettings((s) => ({ ...s, questionType: t }))} />
                    ))}
                  </div>
                </div>

                {/* Quiz Mode */}
                <div>
                  <label className="text-xs font-semibold block mb-2" style={{ color: "var(--text2)" }}>Quiz Mode</label>
                  <div className="flex gap-2">
                    {(["Multiple Choice", "Open-Ended"] as QuizMode[]).map((m) => (
                      <RadioBtn key={m} label={m} selected={settings.quizMode === m}
                        onClick={() => setSettings((s) => ({ ...s, quizMode: m }))} />
                    ))}
                  </div>
                </div>

                {/* Question Count */}
                <div>
                  <label className="text-xs font-semibold block mb-2" style={{ color: "var(--text2)" }}>Number of Questions</label>
                  <div className="flex gap-2">
                    {[5, 10, 15, 20].map((n) => (
                      <RadioBtn key={n} label={n.toString()} selected={settings.count === n}
                        onClick={() => setSettings((s) => ({ ...s, count: n }))} />
                    ))}
                  </div>
                  <p className="text-xs mt-1.5" style={{ color: "var(--text3)" }}>Choose how many questions you want in your quiz.</p>
                </div>

                {/* Difficulty */}
                <div>
                  <label className="text-xs font-semibold block mb-2" style={{ color: "var(--text2)" }}>Difficulty Level</label>
                  <div className="flex gap-2 flex-wrap">
                    {(["Beginner", "Intermediate", "Advanced", "Mixed"] as Difficulty[]).map((d) => (
                      <RadioBtn key={d} label={d} selected={settings.difficulty === d}
                        onClick={() => setSettings((s) => ({ ...s, difficulty: d }))} />
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <button onClick={handleStart}
                  className="w-full py-3.5 rounded-xl font-bold text-sm transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
                  style={{ background: "linear-gradient(135deg, #4f7fff, #a78bfa)", color: "#fff", boxShadow: "0 4px 20px rgba(79,127,255,0.4)" }}>
                  <span>✨</span> Generate My Quiz
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CategoryCard({ cat, info, onStart }: { cat: QuizCategory; info: ReturnType<typeof getCategoryInfo>; onStart: () => void }) {
  return (
    <div className="relative overflow-hidden rounded-2xl cursor-pointer group transition-all duration-300 hover:-translate-y-2"
      style={{ border: "1px solid var(--border)" }}
      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.boxShadow = `0 16px 48px ${info.color}30`)}
      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.boxShadow = "none")}>
      {/* Gradient bg */}
      <div className={`h-44 bg-gradient-to-br ${info.gradient} flex items-center justify-center relative`}>
        <div className="text-6xl group-hover:scale-110 transition-transform duration-300 filter drop-shadow-lg">{info.icon}</div>
        {/* Quiz count badge */}
        {/* <div className="absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full backdrop-blur-md"
          style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)", color: "#fff" }}>
          📝 {info.count} Questions
        </div> */}
      </div>
      {/* Gradient overlay */}
      <div className="absolute bottom-0 left-0 right-0" style={{ height: "60%", background: "linear-gradient(to top, rgba(10,13,20,0.95), transparent)" }} />
      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="font-syne text-base font-bold text-white mb-1 capitalize">{cat}</div>
        <div className="text-xs text-white/70 mb-3 leading-relaxed line-clamp-2">{info.description}</div>
        <button onClick={onStart}
          className="w-full py-2 rounded-xl text-xs font-bold transition-all backdrop-blur-md"
          style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)", color: "#fff" }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.25)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.15)")}>
          Start Quiz →
        </button>
      </div>
    </div>
  );
}

function RadioBtn({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className="px-3.5 py-2 rounded-xl text-xs font-semibold transition-all"
      style={{
        background: selected ? "rgba(79,127,255,0.15)" : "var(--surface)",
        border: `1.5px solid ${selected ? "rgba(79,127,255,0.5)" : "var(--border)"}`,
        color: selected ? "var(--accent)" : "var(--text2)",
      }}>
      {label}
    </button>
  );
}
