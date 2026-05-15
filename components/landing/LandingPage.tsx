"use client";
import Link from "next/link";

const FEATURES = [
  {
    icon: "🎯",
    title: "AI-Generated Quizzes",
    desc: "Groq AI creates personalized questions tailored to your exam prep — USMLE, MBBS, boards, and more.",
    color: "#4f7fff",
  },
  {
    icon: "📹",
    title: "Video Quiz",
    desc: "Paste any medical YouTube video URL and instantly get an AI-generated MCQ quiz from the transcript.",
    color: "#22d07a",
    badge: "NEW",
  },
  {
    icon: "📊",
    title: "Deep Analytics",
    desc: "Track your performance by category, monitor streaks, visualize score trends, and identify weak areas.",
    color: "#a78bfa",
  },
  {
    icon: "🏆",
    title: "Leaderboard",
    desc: "Compete globally with medical students. Earn XP, climb ranks, and stay motivated every day.",
    color: "#ffc93c",
  },
  {
    icon: "🔥",
    title: "Streak System",
    desc: "Daily study streaks, XP progression, and level-up rewards keep you consistent and accountable.",
    color: "#ff5b7a",
  },
  {
    icon: "🎖️",
    title: "Achievements",
    desc: "Unlock badges as you hit milestones — from your first quiz to mastering advanced case-based questions.",
    color: "#38bdf8",
  },
];

const CATEGORIES = [
  { icon: "❤️", name: "Cardiology", count: 45, color: "from-red-600 to-rose-900" },
  { icon: "🧠", name: "Neurology", count: 38, color: "from-violet-600 to-purple-900" },
  { icon: "🔬", name: "Dermatology", count: 32, color: "from-amber-500 to-orange-800" },
  { icon: "👶", name: "Pediatrics", count: 40, color: "from-green-500 to-emerald-800" },
  { icon: "🧬", name: "Oncology", count: 28, color: "from-blue-500 to-indigo-900" },
  { icon: "🦴", name: "Orthopedics", count: 35, color: "from-teal-500 to-cyan-900" },
];

const STATS = [
  { value: "∞", label: "Questions(AI Generated)" },
  { value: "6", label: "Specialties" },
  { value: "YouTube", label: "Video Quiz Generation" },
];

const TESTIMONIALS = [
  {
    name: "Priya Sharma",
    role: "MBBS Final Year, AIIMS Delhi",
    text: "MediLearn AI completely transformed my board prep. The AI-generated questions are spot-on and the analytics helped me find my weak areas fast.",
    avatar: "PS",
    score: "92%",
  },
  {
    name: "Arjun Mehta",
    role: "USMLE Step 1 Aspirant",
    text: "The video quiz feature is incredible — I paste a lecture video and get 5 MCQs instantly. It's like having a personal tutor available 24/7.",
    avatar: "AM",
    score: "89%",
  },
  {
    name: "Dr. Rohan Singh",
    role: "Resident, Internal Medicine",
    text: "Even as a resident, I use MediLearn to stay sharp. The case-based questions in Cardiology are genuinely challenging and educational.",
    avatar: "RS",
    score: "95%",
  },
];

export function LandingPage() {
  return (
    <div style={{ background: "#0a0d14", color: "#e8eaf6", fontFamily: "var(--font-dm-sans, sans-serif)", minHeight: "100vh" }}>

      {/* NAV */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "rgba(10,13,20,0.85)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        padding: "0 24px", height: 64,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        maxWidth: 1200, margin: "0 auto",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "linear-gradient(135deg,#4f7fff,#a78bfa)",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
          }}>🧬</div>
          <span style={{ fontFamily: "var(--font-syne, sans-serif)", fontWeight: 800, fontSize: 17 }}>MediLearn AI</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/sign-in" style={{
            padding: "8px 18px", borderRadius: 10, fontSize: 13, fontWeight: 600,
            color: "#9da4c2", textDecoration: "none",
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.04)",
          }}>Sign In</Link>
          <Link href="/sign-in" style={{
            padding: "8px 20px", borderRadius: 10, fontSize: 13, fontWeight: 700,
            background: "linear-gradient(135deg,#4f7fff,#a78bfa)", color: "#fff",
            textDecoration: "none", boxShadow: "0 4px 16px rgba(79,127,255,0.35)",
          }}>Get Started Free</Link>
        </div>
      </nav>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>

        {/* HERO */}
        <section style={{ textAlign: "center", padding: "96px 0 80px", position: "relative" }}>
          {/* Background glow */}
          <div style={{
            position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)",
            width: 600, height: 400, borderRadius: "50%",
            background: "radial-gradient(ellipse,rgba(79,127,255,0.12),transparent 70%)",
            pointerEvents: "none",
          }} />

          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "6px 16px", borderRadius: 20,
            background: "rgba(79,127,255,0.1)", border: "1px solid rgba(79,127,255,0.25)",
            fontSize: 12, fontWeight: 600, color: "#6b96ff", marginBottom: 28,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22d07a", display: "inline-block" }} />
            AI-Powered Medical Learning Platform
          </div>

          <h1 style={{
            fontFamily: "var(--font-syne, sans-serif)",
            fontSize: "clamp(36px, 6vw, 68px)", fontWeight: 800,
            lineHeight: 1.1, marginBottom: 24,
            background: "linear-gradient(135deg,#ffffff 40%,#9da4c2)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            Master Medicine with<br />
            <span style={{
              background: "linear-gradient(135deg,#4f7fff,#a78bfa)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>AI-Powered Quizzes</span>
          </h1>

          <p style={{
            fontSize: "clamp(15px, 2vw, 18px)", color: "#9da4c2",
            maxWidth: 560, margin: "0 auto 40px", lineHeight: 1.7,
          }}>
            Prepare for USMLE, MBBS, and board exams with personalized AI quizzes,
            video-based learning, deep analytics, and a global leaderboard.
          </p>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/sign-in" style={{
              padding: "14px 32px", borderRadius: 12, fontSize: 15, fontWeight: 700,
              background: "linear-gradient(135deg,#4f7fff,#a78bfa)", color: "#fff",
              textDecoration: "none", boxShadow: "0 8px 32px rgba(79,127,255,0.4)",
              display: "inline-flex", alignItems: "center", gap: 8,
            }}>
              Start Learning Free →
            </Link>
            <a href="#features" style={{
              padding: "14px 28px", borderRadius: 12, fontSize: 15, fontWeight: 600,
              background: "rgba(255,255,255,0.05)", color: "#e8eaf6",
              textDecoration: "none", border: "1px solid rgba(255,255,255,0.1)",
              display: "inline-flex", alignItems: "center", gap: 8,
            }}>
              See Features ↓
            </a>
          </div>

          {/* Hero Preview Card */}
          <div style={{
            marginTop: 64, borderRadius: 20, overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(26,32,53,0.8)", backdropFilter: "blur(20px)",
            boxShadow: "0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)",
            padding: 24,
          }}>
            {/* Mini dashboard preview */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 16 }}>
              {[
                { label: "Total Quizzes", value: "248", icon: "🎯", color: "#4f7fff" },
                { label: "Avg. Score", value: "78%", icon: "⚡", color: "#22d07a" },
                { label: "Total XP", value: "2,450", icon: "🌟", color: "#a78bfa" },
                { label: "Day Streak", value: "7 🔥", icon: "🏆", color: "#ffc93c" },
              ].map((s) => (
                <div key={s.label} style={{
                  background: "rgba(255,255,255,0.04)", borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.06)", padding: "14px 16px",
                }}>
                  <div style={{ fontSize: 20, marginBottom: 8 }}>{s.icon}</div>
                  <div style={{ fontFamily: "var(--font-syne,sans-serif)", fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: "#6b7299", marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
            {/* Mini quiz preview */}
            <div style={{
              background: "rgba(255,255,255,0.03)", borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.05)", padding: "16px 18px", textAlign: "left",
            }}>
              <div style={{ fontSize: 11, color: "#6b7299", marginBottom: 8, fontWeight: 600 }}>SAMPLE QUESTION — CARDIOLOGY</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#e8eaf6", marginBottom: 12 }}>
                Which ECG finding is most characteristic of ST-elevation myocardial infarction (STEMI)?
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {["ST depression in V1-V4","ST elevation ≥2mm in 2 contiguous leads ✓","New LBBB alone","T-wave inversion in V1-V4"].map((opt, i) => (
                  <div key={i} style={{
                    padding: "8px 12px", borderRadius: 8, fontSize: 12,
                    background: i === 1 ? "rgba(34,208,122,0.12)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${i === 1 ? "rgba(34,208,122,0.4)" : "rgba(255,255,255,0.06)"}`,
                    color: i === 1 ? "#22d07a" : "#9da4c2",
                    fontWeight: i === 1 ? 600 : 400,
                  }}>{opt}</div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section style={{
          display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16,
          marginBottom: 96, borderTop: "1px solid rgba(255,255,255,0.06)",
          borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "40px 0",
        }}>
          {STATS.map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{
                fontFamily: "var(--font-syne,sans-serif)", fontSize: 36, fontWeight: 800,
                background: "linear-gradient(135deg,#4f7fff,#a78bfa)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              }}>{s.value}</div>
              <div style={{ fontSize: 13, color: "#6b7299", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </section>

        {/* FEATURES */}
        <section id="features" style={{ marginBottom: 96 }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{
              display: "inline-block", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em",
              color: "#6b96ff", textTransform: "uppercase", marginBottom: 16,
              background: "rgba(79,127,255,0.1)", padding: "4px 14px", borderRadius: 20,
              border: "1px solid rgba(79,127,255,0.2)",
            }}>Platform Features</div>
            <h2 style={{
              fontFamily: "var(--font-syne,sans-serif)", fontSize: "clamp(28px,4vw,42px)",
              fontWeight: 800, marginBottom: 16,
            }}>Everything You Need to Excel</h2>
            <p style={{ fontSize: 15, color: "#9da4c2", maxWidth: 500, margin: "0 auto" }}>
              Built specifically for medical students preparing for competitive exams
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
            {FEATURES.map((f) => (
              <div key={f.title} style={{
                background: "rgba(26,32,53,0.7)", border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 16, padding: "28px 24px",
                transition: "all 0.25s ease",
                position: "relative", overflow: "hidden",
              }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = `${f.color}40`;
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 16px 40px ${f.color}15`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12, fontSize: 22,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: `${f.color}15`, border: `1px solid ${f.color}30`,
                  }}>{f.icon}</div>
                  {f.badge && (
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20,
                      background: "rgba(34,208,122,0.15)", color: "#22d07a",
                      border: "1px solid rgba(34,208,122,0.3)",
                    }}>{f.badge}</span>
                  )}
                </div>
                <div style={{ fontFamily: "var(--font-syne,sans-serif)", fontSize: 16, fontWeight: 700, marginBottom: 10 }}>{f.title}</div>
                <div style={{ fontSize: 13.5, color: "#9da4c2", lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* CATEGORIES */}
        <section style={{ marginBottom: 96 }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{
              display: "inline-block", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em",
              color: "#6b96ff", textTransform: "uppercase", marginBottom: 16,
              background: "rgba(79,127,255,0.1)", padding: "4px 14px", borderRadius: 20,
              border: "1px solid rgba(79,127,255,0.2)",
            }}>Specialties</div>
            <h2 style={{ fontFamily: "var(--font-syne,sans-serif)", fontSize: "clamp(28px,4vw,42px)", fontWeight: 800, marginBottom: 16 }}>
              6 Medical Specialties
            </h2>
            <p style={{ fontSize: 15, color: "#9da4c2" }}>
              Curated question banks with AI-powered generation for every specialty
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
            {CATEGORIES.map((c) => (
              <div key={c.name} style={{
                borderRadius: 16, overflow: "hidden", cursor: "pointer",
                border: "1px solid rgba(255,255,255,0.07)",
                transition: "all 0.3s ease",
              }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-6px)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 20px 48px rgba(0,0,0,0.4)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              >
                <div className={`bg-gradient-to-br ${c.color}`} style={{
                  height: 120, display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 48, position: "relative",
                }}>
                  {c.icon}
                  {/* <div style={{
                    position: "absolute", top: 10, right: 10,
                    background: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.2)", borderRadius: 20,
                    padding: "3px 10px", fontSize: 11, fontWeight: 600, color: "#fff",
                  }}>{c.count} Qs</div> */}
                </div>
                <div style={{ padding: "14px 16px", background: "rgba(26,32,53,0.9)" }}>
                  <div style={{ fontFamily: "var(--font-syne,sans-serif)", fontWeight: 700, marginBottom: 8 }}>{c.name}</div>
                  <Link href="/sign-in" style={{
                    display: "block", textAlign: "center", padding: "8px", borderRadius: 8, fontSize: 12,
                    fontWeight: 600, background: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.12)", color: "#e8eaf6",
                    textDecoration: "none",
                  }}>Start Quiz →</Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* VIDEO QUIZ HIGHLIGHT */}
        <section style={{
          marginBottom: 96, borderRadius: 24,
          background: "linear-gradient(135deg,rgba(79,127,255,0.08),rgba(167,139,250,0.08))",
          border: "1px solid rgba(79,127,255,0.2)", padding: "56px 48px",
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center",
        }}>
          <div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              fontSize: 12, fontWeight: 700, color: "#22d07a",
              background: "rgba(34,208,122,0.1)", padding: "4px 14px", borderRadius: 20,
              border: "1px solid rgba(34,208,122,0.25)", marginBottom: 20,
            }}>
              ✨ NEW FEATURE
            </div>
            <h2 style={{ fontFamily: "var(--font-syne,sans-serif)", fontSize: 34, fontWeight: 800, marginBottom: 16, lineHeight: 1.2 }}>
              Turn Any Medical Video Into a Quiz
            </h2>
            <p style={{ fontSize: 15, color: "#9da4c2", lineHeight: 1.7, marginBottom: 28 }}>
              Paste a YouTube lecture URL — our AI fetches the transcript, summarizes key concepts,
              and generates 5 high-quality MCQs in seconds. Learn actively, not passively.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
              {["Works with any YouTube medical lecture","AI-powered transcript analysis","5 targeted MCQs generated instantly","Full explanations with every answer"].map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "#9da4c2" }}>
                  <span style={{ color: "#22d07a", fontWeight: 700 }}>✓</span> {item}
                </div>
              ))}
            </div>
            <Link href="/sign-in" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "12px 28px", borderRadius: 12, fontSize: 14, fontWeight: 700,
              background: "linear-gradient(135deg,#4f7fff,#a78bfa)", color: "#fff",
              textDecoration: "none", boxShadow: "0 4px 20px rgba(79,127,255,0.35)",
            }}>Try Video Quiz →</Link>
          </div>
          <div style={{
            background: "rgba(10,13,20,0.6)", borderRadius: 16,
            border: "1px solid rgba(255,255,255,0.08)", padding: 20,
          }}>
            <div style={{
              borderRadius: 10, overflow: "hidden", marginBottom: 14,
              background: "#000", aspectRatio: "16/9", display: "flex",
              alignItems: "center", justifyContent: "center", fontSize: 48,
            }}>
              <div style={{
                width: 56, height: 56, borderRadius: "50%",
                background: "linear-gradient(135deg,#ff5b7a,#ff8a5c)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22, boxShadow: "0 8px 24px rgba(255,91,122,0.4)",
              }}>▶</div>
            </div>
            <div style={{ fontSize: 11, color: "#6b7299", marginBottom: 10, fontWeight: 600 }}>AI GENERATING QUIZ FROM VIDEO…</div>
            <div style={{ height: 6, borderRadius: 3, background: "rgba(255,255,255,0.06)", overflow: "hidden", marginBottom: 14 }}>
              <div style={{ height: "100%", width: "75%", borderRadius: 3, background: "linear-gradient(90deg,#38bdf8,#4f7fff)" }} />
            </div>
            {["What is the primary mechanism of action of beta-blockers in heart failure?","Which ECG change is seen earliest in hyperkalemia?"].map((q, i) => (
              <div key={i} style={{
                padding: "10px 12px", borderRadius: 8, marginBottom: 8, fontSize: 12,
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)",
                color: "#9da4c2",
              }}>
                <span style={{ color: "#4f7fff", fontWeight: 700, marginRight: 6 }}>Q{i + 1}.</span>{q}
              </div>
            ))}
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section style={{ marginBottom: 96 }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{
              display: "inline-block", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em",
              color: "#6b96ff", textTransform: "uppercase", marginBottom: 16,
              background: "rgba(79,127,255,0.1)", padding: "4px 14px", borderRadius: 20,
              border: "1px solid rgba(79,127,255,0.2)",
            }}>Testimonials</div>
            <h2 style={{ fontFamily: "var(--font-syne,sans-serif)", fontSize: "clamp(28px,4vw,42px)", fontWeight: 800 }}>
              Loved by Medical Students
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
            {TESTIMONIALS.map((t) => (
              <div key={t.name} style={{
                background: "rgba(26,32,53,0.7)", border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: 16, padding: "24px",
              }}>
                <div style={{ display: "flex", marginBottom: 8 }}>
                  {[1,2,3,4,5].map(s => <span key={s} style={{ color: "#ffc93c", fontSize: 14 }}>★</span>)}
                </div>
                <p style={{ fontSize: 14, color: "#9da4c2", lineHeight: 1.7, marginBottom: 20 }}>
                  &ldquo;{t.text}&rdquo;
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
                    background: "linear-gradient(135deg,#4f7fff,#a78bfa)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 700, fontSize: 13, color: "#fff",
                  }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: "#6b7299" }}>{t.role}</div>
                  </div>
                  <div style={{
                    marginLeft: "auto", fontSize: 13, fontWeight: 700,
                    color: "#22d07a", background: "rgba(34,208,122,0.1)",
                    padding: "4px 10px", borderRadius: 20, border: "1px solid rgba(34,208,122,0.2)",
                  }}>{t.score}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section style={{
          textAlign: "center", marginBottom: 80,
          background: "linear-gradient(135deg,rgba(79,127,255,0.12),rgba(167,139,250,0.12))",
          border: "1px solid rgba(79,127,255,0.2)", borderRadius: 24, padding: "72px 48px",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", top: -60, left: "50%", transform: "translateX(-50%)",
            width: 400, height: 300,
            background: "radial-gradient(ellipse,rgba(79,127,255,0.15),transparent 70%)",
            pointerEvents: "none",
          }} />
          <h2 style={{
            fontFamily: "var(--font-syne,sans-serif)", fontSize: "clamp(28px,4vw,48px)",
            fontWeight: 800, marginBottom: 16, position: "relative",
          }}>
            Ready to Ace Your Medical Exams?
          </h2>
          <p style={{ fontSize: 16, color: "#9da4c2", marginBottom: 36, position: "relative" }}>
            Join 50,000+ medical students already using MediLearn AI
          </p>
          <Link href="/sign-in" style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            padding: "16px 40px", borderRadius: 14, fontSize: 16, fontWeight: 700,
            background: "linear-gradient(135deg,#4f7fff,#a78bfa)", color: "#fff",
            textDecoration: "none", boxShadow: "0 8px 32px rgba(79,127,255,0.45)",
            position: "relative",
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" opacity="0.8"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" opacity="0.6"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" opacity="0.9"/>
            </svg>
            Continue with Google — It&apos;s Free
          </Link>
          <div style={{ marginTop: 20, fontSize: 13, color: "#6b7299" }}>
            No credit card required · Free forever for students
          </div>
        </section>
      </div>

      {/* FOOTER */}
      <footer style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "32px 24px", textAlign: "center",
        background: "rgba(17,21,32,0.5)",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 18 }}>🧬</span>
            <span style={{ fontFamily: "var(--font-syne,sans-serif)", fontWeight: 700, fontSize: 15 }}>MediLearn AI</span>
          </div>
          <div style={{ fontSize: 13, color: "#6b7299" }}>
            © 2025 MediLearn AI · Built for medical excellence
          </div>
          {/* <div style={{ display: "flex", gap: 20 }}>
            {["Privacy", "Terms", "Contact"].map((l) => (
              <span key={l} style={{ fontSize: 13, color: "#6b7299", cursor: "pointer" }}>{l}</span>
            ))}
          </div> */}
        </div>
      </footer>
    </div>
  );
}