"use client";
import { motion } from "framer-motion";
import { signOut } from "next-auth/react";
import { toast } from "sonner";
import type { Session } from "next-auth";
import { getLevelTitle, xpToNextLevel } from "@/lib/utils";

const RECENT_BADGES = ["🎯", "🔥", "💯", "🧠", "❤️", "📹", "📚"];

export function ProfileClient({ user }: { user: Session["user"] }) {
  const xp = (user as { xp?: number }).xp ?? 0;
  const streak = (user as { streak?: number }).streak ?? 0;
  const level = (user as { level?: number }).level ?? 1;
  const { current, needed, percent } = xpToNextLevel(xp);

  const handleSignOut = async () => {
    toast.success("Signed out successfully");
    await signOut({ callbackUrl: "/sign-in" });
  };

  return (
    <div className="page-in max-w-xl">
      <h2 className="font-syne text-2xl font-bold mb-6" style={{ color: "var(--text)" }}>Profile</h2>

      {/* Hero Card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 mb-4" style={{ borderColor: "rgba(167,139,250,0.2)" }}>
        <div className="flex items-start gap-4 mb-5">
          <div className="relative flex-shrink-0">
            {user.image ? (
              <img src={user.image} alt={user.name ?? ""} className="w-20 h-20 rounded-2xl" />
            ) : (
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center font-bold text-2xl"
                style={{ background: "linear-gradient(135deg,#4f7fff,#a78bfa)", color: "#fff" }}>
                {(user.name ?? "U")[0].toUpperCase()}
              </div>
            )}
            <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold"
              style={{ background: "linear-gradient(135deg,#fbbf24,#f59e0b)", color: "#fff", boxShadow: "0 2px 8px rgba(251,191,36,0.4)" }}>
              {level}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-syne text-xl font-bold mb-0.5 truncate" style={{ color: "var(--text)" }}>{user.name}</h3>
            <p className="text-sm mb-3 truncate" style={{ color: "var(--text3)" }}>{user.email}</p>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: "rgba(79,127,255,0.12)", color: "var(--accent)", border: "1px solid rgba(79,127,255,0.2)" }}>
                {getLevelTitle(level)}
              </span>
              {streak > 0 && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: "rgba(255,201,60,0.12)", color: "var(--yellow)", border: "1px solid rgba(255,201,60,0.2)" }}>
                  🔥 {streak} Day Streak
                </span>
              )}
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: "rgba(167,139,250,0.12)", color: "var(--purple)", border: "1px solid rgba(167,139,250,0.2)" }}>
                Level {level}
              </span>
            </div>
          </div>
          <button className="text-xs px-3 py-1.5 rounded-xl flex-shrink-0 transition-all"
            style={{ background: "var(--surface2)", border: "1px solid var(--border2)", color: "var(--text2)" }}
            onClick={() => toast.info("Edit profile coming soon!")}>
            Edit
          </button>
        </div>

        {/* Stats Row */}
        <div className="h-px mb-4" style={{ background: "var(--border)" }} />
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: "Quizzes", value: "248" },
            { label: "Avg Score", value: "78%" },
            { label: "Total XP", value: xp.toLocaleString() || "2,450" },
            { label: "Rank", value: "#14" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-syne text-lg font-bold" style={{ color: "var(--text)" }}>{s.value}</div>
              <div className="text-xs" style={{ color: "var(--text3)" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* XP Progress */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="glass-card p-5 mb-4">
        <div className="font-syne text-base font-bold mb-4" style={{ color: "var(--text)" }}>XP Progression</div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm" style={{ color: "var(--text2)" }}>Level {level} — {getLevelTitle(level)}</span>
          <span className="text-sm font-bold" style={{ color: "var(--accent)" }}>{current} / {needed} XP</span>
        </div>
        <div className="h-3 rounded-full overflow-hidden relative" style={{ background: "var(--bg3)" }}>
          <motion.div initial={{ width: 0 }} animate={{ width: `${percent}%` }}
            transition={{ duration: 1.2, ease: "easeOut" }} className="h-full rounded-full relative"
            style={{ background: "linear-gradient(90deg,#4f7fff,#a78bfa)" }}>
            <div className="absolute inset-0 overflow-hidden">
              <div className="h-full w-1/2 bg-white/10 skew-x-12 translate-x-full animate-pulse" />
            </div>
          </motion.div>
        </div>
        <div className="text-xs mt-2" style={{ color: "var(--text3)" }}>
          {needed - current} XP until Level {level + 1} — "{getLevelTitle(level + 1)}"
        </div>
      </motion.div>

      {/* Recent Badges */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="glass-card p-5 mb-4">
        <div className="flex justify-between items-center mb-4">
          <div className="font-syne text-base font-bold" style={{ color: "var(--text)" }}>Recent Badges</div>
          <a href="/achievements" className="text-xs font-medium" style={{ color: "var(--accent)" }}>View all →</a>
        </div>
        <div className="flex gap-3">
          {RECENT_BADGES.map((badge, i) => (
            <div key={i} className="w-11 h-11 rounded-xl flex items-center justify-center text-xl transition-all hover:scale-110 cursor-pointer"
              style={{ background: "rgba(255,201,60,0.1)", border: "1px solid rgba(255,201,60,0.2)" }}
              title={`Badge ${i + 1}`}>
              {badge}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Settings */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="glass-card p-5">
        <div className="font-syne text-base font-bold mb-4" style={{ color: "var(--text)" }}>Settings</div>
        <div className="space-y-0">
          {[
            { label: "Email Notifications", desc: "Daily reminders and streak alerts", on: true },
            { label: "Dark Mode", desc: "Currently using dark theme", on: true },
            { label: "Sound Effects", desc: "Quiz feedback sounds", on: false },
            { label: "Show on Leaderboard", desc: "Display your profile publicly", on: true },
          ].map((s, i) => (
            <div key={i} className="flex justify-between items-center py-3.5"
              style={{ borderBottom: i < 3 ? "1px solid var(--border)" : "none" }}>
              <div>
                <div className="text-sm font-semibold" style={{ color: "var(--text)" }}>{s.label}</div>
                <div className="text-xs mt-0.5" style={{ color: "var(--text3)" }}>{s.desc}</div>
              </div>
              <Toggle on={s.on} />
            </div>
          ))}
        </div>
        <div className="h-px my-4" style={{ background: "var(--border)" }} />
        <button onClick={handleSignOut}
          className="px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:-translate-y-0.5"
          style={{ background: "rgba(255,91,122,0.12)", border: "1px solid rgba(255,91,122,0.25)", color: "var(--red)" }}>
          Sign Out
        </button>
      </motion.div>
    </div>
  );
}

function Toggle({ on }: { on: boolean }) {
  return (
    <div className="w-11 h-6 rounded-full relative cursor-pointer transition-all"
      style={{ background: on ? "var(--accent)" : "var(--surface3)", border: `1px solid ${on ? "transparent" : "var(--border2)"}` }}>
      <div className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all"
        style={{ left: on ? "calc(100% - 22px)" : 2 }} />
    </div>
  );
}
