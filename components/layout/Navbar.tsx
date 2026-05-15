"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import type { Session } from "next-auth";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/categories": "Quiz Categories",
  "/analytics": "Analytics",
  "/leaderboard": "Leaderboard 🏆",
  "/achievements": "Achievements",
  "/profile": "Profile",
  "/video-quiz": "Video Quiz",
};

export function Navbar({ user }: { user: Session["user"] }) {
  const pathname = usePathname();
  const title = PAGE_TITLES[pathname] ?? "MediLearn AI";
  const streak = (user as { streak?: number }).streak ?? 0;

  return (
    <header
      className="sticky top-0 z-40 flex items-center justify-between px-6"
      style={{
        height: 60,
        background: "rgba(17,21,32,0.9)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <h1 className="font-syne text-base font-semibold" style={{ color: "var(--text)" }}>{title}</h1>

      <div className="flex items-center gap-3">
        {/* Search */}
        {/* <div className="relative hidden sm:block">
          <input
            type="text"
            placeholder="Search topics..."
            className="h-9 pl-9 pr-4 rounded-xl text-sm outline-none"
            style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text)", width: 200 }}
          />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--text3)" }}>
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
        </div> */}

        {/* Streak */}
        {streak > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl"
            style={{ background: "rgba(255,201,60,0.12)", border: "1px solid rgba(255,201,60,0.2)" }}>
            <span className="text-sm">🔥</span>
            <span className="text-sm font-bold" style={{ color: "var(--yellow)" }}>{streak}</span>
          </div>
        )}

        {/* Notifications placeholder */}
        {/* <button className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-all"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--border2)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--border)")}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--text2)" }}>
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: "var(--red)", border: "1.5px solid var(--bg2)" }} />
        </button> */}

        {/* Avatar */}
        <Link href="/profile" className="flex-shrink-0">
          {user.image ? (
            <img src={user.image} alt={user.name ?? ""} className="w-9 h-9 rounded-full ring-2 ring-transparent hover:ring-blue-500/50 transition-all" />
          ) : (
            <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm"
              style={{ background: "linear-gradient(135deg, #4f7fff, #a78bfa)", color: "#fff" }}>
              {(user.name ?? "U")[0].toUpperCase()}
            </div>
          )}
        </Link>
      </div>
    </header>
  );
}
