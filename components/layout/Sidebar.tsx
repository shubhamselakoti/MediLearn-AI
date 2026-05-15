"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { xpToNextLevel, getLevelTitle } from "@/lib/utils";
import type { Session } from "next-auth";

interface SidebarProps {
  user: Session["user"];
}

const NAV_ITEMS = [
  { href: "/video-quiz", label: "Video Quiz", icon: "📹", badge: "NEW", badgeColor: "#22d07a" },
  { href: "/dashboard", label: "Dashboard", icon: "⊞" },
  { href: "/categories", label: "Quiz Categories", icon: "🩺" },
  { href: "/analytics", label: "Analytics", icon: "📊" },
  { href: "/leaderboard", label: "Leaderboard", icon: "🏆", badge: "🔥" },
  { href: "/achievements", label: "Achievements", icon: "🎖️" },
  { href: "/profile", label: "Profile", icon: "👤" },
];

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const xp = (user as { xp?: number }).xp ?? 0;
  const level = (user as { level?: number }).level ?? 1;
  const { percent } = xpToNextLevel(xp);

  return (
    <aside
      className="fixed left-0 top-0 bottom-0 flex flex-col z-50"
      style={{ width: 240, background: "var(--bg2)", borderRight: "1px solid var(--border)" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5" style={{ borderBottom: "1px solid var(--border)" }}>
        <div className="float-anim flex items-center justify-center w-9 h-9 rounded-xl text-xl flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #4f7fff, #a78bfa)" }}>
          🧬
        </div>
        <div>
          <div className="font-syne text-sm font-bold" style={{ color: "var(--text)" }}>MediLearn AI</div>
          <div className="text-xs" style={{ color: "var(--text3)" }}>Medical Learning</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto no-scrollbar">
        <div className="text-xs font-semibold uppercase tracking-widest mb-2 px-2" style={{ color: "var(--text3)" }}>
          Featured
        </div>
        <div className="mb-5">
          {NAV_ITEMS.slice(0, 1).map((item) => (
            <NavItem key={item.href} item={item} active={pathname === item.href} />
          ))}
        </div>

        <div className="text-xs font-semibold uppercase tracking-widest mb-2 px-2" style={{ color: "var(--text3)" }}>
          Navigation
        </div>
        <div className="space-y-0.5">
          {NAV_ITEMS.slice(1).map((item) => (
            <NavItem key={item.href} item={item} active={pathname === item.href} />
          ))}
        </div>
      </nav>

      {/* XP + User */}
      <div style={{ borderTop: "1px solid var(--border)", padding: "12px 14px" }}>
        <div className="mb-3 px-1">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-xs font-semibold" style={{ color: "var(--text3)" }}>
              Level {level} · {getLevelTitle(level)}
            </span>
            <span className="text-xs font-bold" style={{ color: "var(--accent)" }}>{percent}%</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden relative" style={{ background: "var(--bg3)" }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full rounded-full relative"
              style={{ background: "linear-gradient(90deg, #4f7fff, #a78bfa)" }}
            />
          </div>
          <div className="text-xs mt-1" style={{ color: "var(--text3)" }}>{xp.toLocaleString()} XP total</div>
        </div>
        <Link href="/profile" className="flex items-center gap-2.5 p-2.5 rounded-xl transition-all"
          style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border2)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border)"; }}
        >
          {user.image ? (
            <img src={user.image} alt={user.name ?? ""} className="w-8 h-8 rounded-full flex-shrink-0" />
          ) : (
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #4f7fff, #a78bfa)", color: "#fff" }}>
              {(user.name ?? "U")[0].toUpperCase()}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold truncate" style={{ color: "var(--text)" }}>{user.name}</div>
            <div className="text-xs truncate" style={{ color: "var(--text3)" }}>{user.email}</div>
          </div>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: "var(--text3)", flexShrink: 0 }}>
            <path d="m9 18 6-6-6-6"/>
          </svg>
        </Link>
      </div>
    </aside>
  );
}

function NavItem({ item, active }: { item: typeof NAV_ITEMS[0]; active: boolean }) {
  return (
    <Link
      href={item.href}
      className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all relative mb-0.5"
      style={{
        color: active ? "var(--accent)" : "var(--text2)",
        background: active ? "rgba(79,127,255,0.12)" : "transparent",
        border: `1px solid ${active ? "rgba(79,127,255,0.25)" : "transparent"}`,
      }}
      onMouseEnter={(e) => { if (!active) { (e.currentTarget as HTMLElement).style.background = "var(--surface)"; (e.currentTarget as HTMLElement).style.color = "var(--text)"; } }}
      onMouseLeave={(e) => { if (!active) { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "var(--text2)"; } }}
    >
      {active && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-3/5 rounded-r"
          style={{ background: "var(--accent)" }} />
      )}
      <span className="text-base w-5 text-center flex-shrink-0">{item.icon}</span>
      <span className="flex-1">{item.label}</span>
      {item.badge && (
        <span className="text-xs font-bold px-1.5 py-0.5 rounded-full"
          style={{
            background: item.badgeColor ? `${item.badgeColor}20` : "rgba(255,91,122,0.15)",
            color: item.badgeColor ?? "var(--red)",
            border: `1px solid ${item.badgeColor ? `${item.badgeColor}40` : "rgba(255,91,122,0.3)"}`,
          }}>
          {item.badge}
        </span>
      )}
    </Link>
  );
}
