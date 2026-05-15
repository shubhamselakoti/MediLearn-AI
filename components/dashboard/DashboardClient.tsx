"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import type { Session } from "next-auth";

import {
  getLevelTitle,
  xpToNextLevel,
  getCategoryInfo,
} from "@/lib/utils";

import type { QuizCategory } from "@/types";

interface DashboardClientProps {
  user: Session["user"];
}

const CATEGORIES: QuizCategory[] = [
  "cardiology",
  "neurology",
  "dermatology",
  "pediatrics",
  "oncology",
  "orthopedics",
];

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const STREAK_PATTERN = [
  0, 1, 2, 1, 2, 0, 0,
  2, 1, 2, 2, 1, 2, 1,
  1, 2, 2, 1, 2, 2, 1,
  2, 2, 2, 2, 2, 2, 2,
];

type CategoryStat = {
  category: string;
  avgScore: number;
  totalAttempts: number;
  bestScore: number;
};

type QuizActivity = {
  _id: string;
  category: string;
  quizMode: string;
  difficulty: string;
  percentageScore: number;
  attemptedAt: string;
};

type VideoActivity = {
  _id: string;
  videoTitle: string;
  percentageScore: number;
  attemptedAt: string;
};

type AnalyticsData = {
  totalQuizzes: number;
  totalVideoQuizzes: number;
  avgScore: number;
  totalXP: number;
  streak: number;
  level: number;
  weeklyData: number[];
  categoryStats: CategoryStat[];
  recentActivity: QuizActivity[];
  videoHistory: VideoActivity[];
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const stagger = {
  show: {
    transition: {
      staggerChildren: 0.07,
    },
  },
};

export function DashboardClient({
  user,
}: DashboardClientProps) {
  const xp = (user as { xp?: number }).xp ?? 0;
  const streak =
    (user as { streak?: number }).streak ?? 0;
  const level =
    (user as { level?: number }).level ?? 1;

  const { percent } = xpToNextLevel(xp);

  const [analytics, setAnalytics] =
    useState<AnalyticsData | null>(null);

  const [recentActivity, setRecentActivity] =
    useState<any[]>([]);

  useEffect(() => {
    fetch("/api/user/analytics")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setAnalytics(d.data);

          const merged = [
            ...(d.data.recentActivity || []).map(
              (item: any) => ({
                ...item,
                type: "quiz",
              })
            ),

            ...(d.data.videoHistory || []).map(
              (item: any) => ({
                ...item,
                type: "video",
              })
            ),
          ]
            .sort(
              (a, b) =>
                new Date(b.attemptedAt).getTime() -
                new Date(a.attemptedAt).getTime()
            )
            .slice(0, 5);

          setRecentActivity(merged);
        }
      })
      .catch(console.error);
  }, []);

  const weeklyData =
    analytics?.weeklyData ?? [
      0, 0, 0, 0, 0, 0, 0,
    ];

  const categoryScores =
    analytics?.categoryStats
      ?.sort((a, b) => b.avgScore - a.avgScore)
      .map((c) => ({
        cat: c.category as QuizCategory,
        pct: Math.round(c.avgScore),
      })) ?? [];

  const aiRecs =
    analytics?.categoryStats
      ?.sort((a, b) => a.avgScore - b.avgScore)
      .slice(0, 3)
      .map((c) => ({
        icon: "🧠",
        title: `Improve ${c.category}`,
        desc: `Your average score is ${Math.round(
          c.avgScore
        )}%. Practice more questions in this category.`,
        tag:
          c.avgScore < 60
            ? "Weak Area"
            : "Needs Practice",
        tagColor:
          c.avgScore < 60
            ? "var(--red)"
            : "var(--yellow)",
      })) ?? [];

  const stats = [
    {
      label: "Total Quizzes",
      value:
        analytics?.totalQuizzes?.toString() || "0",
      change: `${
        analytics?.totalVideoQuizzes || 0
      } video quizzes`,
      up: true,
      icon: "🎯",
      color: "var(--accent)",
    },

    {
      label: "Avg. Score",
      value: `${analytics?.avgScore || 0}%`,
      change:
        (analytics?.avgScore || 0) >= 70
          ? "Doing great"
          : "Needs improvement",
      up: (analytics?.avgScore || 0) >= 70,
      icon: "⚡",
      color: "var(--green)",
    },

    {
      label: "Total XP",
      value:
        analytics?.totalXP?.toLocaleString() ||
        "0",
      change: `Level ${
        analytics?.level || 1
      }`,
      up: true,
      icon: "🌟",
      color: "var(--purple)",
    },

    {
      label: "Day Streak",
      value:
        analytics?.streak?.toString() || "0",
      change:
        streak > 0
          ? "Keep going!"
          : "Start today",
      up: streak > 0,
      icon: "🔥",
      color: "var(--yellow)",
    },
  ];

  const getRelativeDate = (
    dateString: string
  ) => {
    const date = new Date(dateString);
    const now = new Date();

    const diff =
      now.getTime() - date.getTime();

    const mins = Math.floor(diff / 60000);
    const hrs = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (mins < 60) return `${mins}m ago`;
    if (hrs < 24) return `${hrs}h ago`;
    if (days === 1) return "Yesterday";

    return `${days}d ago`;
  };

  return (
    <div className="page-in">
      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h2
          className="font-syne text-2xl font-bold mb-1"
          style={{ color: "var(--text)" }}
        >
          Welcome back,{" "}
          {user.name?.split(" ")[0]}! 👋
        </h2>

        <p
          className="text-sm"
          style={{ color: "var(--text2)" }}
        >
          {streak > 0
            ? `You're on a ${streak}-day streak. Keep it up!`
            : "Start your learning journey today!"}{" "}
          Your next quiz awaits.
        </p>
      </motion.div>

      {/* XP Progress */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-4 mb-5"
      >
        <div className="flex justify-between items-center mb-2">
          <div>
            <div
              className="font-semibold"
              style={{ color: "var(--text)" }}
            >
              Level {level} •{" "}
              {getLevelTitle(level)}
            </div>

            <div
              className="text-xs"
              style={{ color: "var(--text3)" }}
            >
              {xp} XP earned
            </div>
          </div>

          <div
            className="text-sm font-bold"
            style={{ color: "var(--accent)" }}
          >
            {percent}%
          </div>
        </div>

        <div
          className="h-2 rounded-full overflow-hidden"
          style={{ background: "var(--bg3)" }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 1 }}
            className="h-full rounded-full"
            style={{
              background:
                "linear-gradient(90deg,#4f7fff,#a78bfa)",
            }}
          />
        </div>
      </motion.div>

      {/* Stat Cards */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5"
      >
        {stats.map((s, i) => (
          <motion.div key={i} variants={fadeUp}>
            <StatCard {...s} />
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Weekly Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-5"
        >
          <div className="flex justify-between items-center mb-5">
            <div>
              <div
                className="font-syne text-base font-bold"
                style={{ color: "var(--text)" }}
              >
                Weekly Performance
              </div>

              <div
                className="text-xs mt-0.5"
                style={{ color: "var(--text3)" }}
              >
                Quiz scores over 7 days
              </div>
            </div>

            <span
              className="text-xs font-bold px-2.5 py-1 rounded-full"
              style={{
                background:
                  "rgba(34,208,122,0.12)",
                color: "var(--green)",
                border:
                  "1px solid rgba(34,208,122,0.2)",
              }}
            >
              {analytics?.avgScore || 0}% avg
            </span>
          </div>

          <div className="flex items-end gap-2 h-28">
            {weeklyData.map((v, i) => (
              <div
                key={i}
                className="flex-1 flex flex-col items-center gap-1"
              >
                <div
                  className="w-full rounded-t-md transition-all hover:opacity-80 cursor-pointer relative group"
                  style={{
                    height: `${v}%`,
                    background:
                      i === 6
                        ? "linear-gradient(to top, #4f7fff, #a78bfa)"
                        : `rgba(79,127,255,${
                            0.4 + i * 0.08
                          })`,
                  }}
                >
                  <div
                    className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap px-1.5 py-0.5 rounded"
                    style={{
                      background:
                        "var(--surface3)",
                      color: "var(--text)",
                    }}
                  >
                    {v}%
                  </div>
                </div>

                <span
                  className="text-xs"
                  style={{
                    color: "var(--text3)",
                  }}
                >
                  {DAYS[i]}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Category Strength */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25 }}
          className="glass-card p-5"
        >
          <div
            className="font-syne text-base font-bold mb-1"
            style={{ color: "var(--text)" }}
          >
            Category Strengths
          </div>

          <div
            className="text-xs mb-4"
            style={{ color: "var(--text3)" }}
          >
            Your performance by specialty
          </div>

          <div className="space-y-3">
            {categoryScores.map(
              ({ cat, pct }) => {
                const info =
                  getCategoryInfo(cat);

                return (
                  <div key={cat}>
                    <div className="flex justify-between items-center mb-1">
                      <span
                        className="text-xs font-medium capitalize"
                        style={{
                          color: "var(--text2)",
                        }}
                      >
                        {info.icon} {cat}
                      </span>

                      <span
                        className="text-xs font-bold"
                        style={{
                          color: "var(--text2)",
                        }}
                      >
                        {pct}%
                      </span>
                    </div>

                    <div
                      className="h-1.5 rounded-full overflow-hidden"
                      style={{
                        background: "var(--bg3)",
                      }}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${pct}%`,
                        }}
                        transition={{
                          duration: 1,
                          delay: 0.3,
                          ease: "easeOut",
                        }}
                        className="h-full rounded-full"
                        style={{
                          background: info.color,
                        }}
                      />
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Study Calendar */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-5"
        >
          <div className="flex justify-between items-center mb-4">
            <div
              className="font-syne text-base font-bold"
              style={{ color: "var(--text)" }}
            >
              Study Calendar
            </div>

            <span
              className="text-xs font-bold px-2.5 py-1 rounded-full"
              style={{
                background:
                  "rgba(255,201,60,0.12)",
                color: "var(--yellow)",
                border:
                  "1px solid rgba(255,201,60,0.2)",
              }}
            >
              🔥 {streak} streak
            </span>
          </div>

          <div className="grid grid-cols-7 gap-0.5 mb-2">
            {["S", "M", "T", "W", "T", "F", "S"].map(
              (d, i) => (
                <div
                  key={i}
                  className="text-center text-xs"
                  style={{
                    color: "var(--text3)",
                  }}
                >
                  {d}
                </div>
              )
            )}
          </div>

          <div className="grid grid-cols-7 gap-0.5">
            {STREAK_PATTERN.map((v, i) => (
              <div
                key={i}
                className="aspect-square rounded cursor-pointer transition-all hover:scale-110"
                style={{
                  background:
                    v === 0
                      ? "var(--bg3)"
                      : v === 1
                      ? "rgba(34,208,122,0.3)"
                      : "var(--green)",

                  border:
                    v === 0
                      ? "1px solid var(--border)"
                      : "none",
                }}
              />
            ))}
          </div>
        </motion.div> */}

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="glass-card p-5"
        >
          <div className="flex justify-between items-center mb-4">
            <div
              className="font-syne text-base font-bold"
              style={{ color: "var(--text)" }}
            >
              Recent Activity
            </div>

            <Link
              href="/analytics"
              className="text-xs font-medium px-2.5 py-1 rounded-lg transition-all"
              style={{
                color: "var(--accent)",
                background:
                  "rgba(79,127,255,0.1)",
                border:
                  "1px solid rgba(79,127,255,0.2)",
              }}
            >
              View all
            </Link>
          </div>

          <div>
            {recentActivity.map((a, i) => {
              const isVideo =
                a.type === "video";

              const score =
                a.percentageScore ||
                a.score ||
                0;

              const color =
                score >= 80
                  ? "var(--green)"
                  : score >= 60
                  ? "var(--yellow)"
                  : "var(--red)";

              return (
                <div
                  key={a._id}
                  className="flex items-center gap-3 py-2.5"
                  style={{
                    borderBottom:
                      i <
                      recentActivity.length - 1
                        ? "1px solid var(--border)"
                        : "none",
                  }}
                >
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{
                      background: color,
                    }}
                  />

                  <div className="flex-1 min-w-0">
                    <div
                      className="text-sm font-medium truncate"
                      style={{
                        color: "var(--text)",
                      }}
                    >
                      {isVideo
                        ? a.videoTitle
                        : `${a.category} Quiz`}
                    </div>

                    <div
                      className="text-xs truncate"
                      style={{
                        color: "var(--text3)",
                      }}
                    >
                      Score: {score}% •{" "}
                      {isVideo
                        ? "Video Quiz"
                        : a.quizMode}
                    </div>
                  </div>

                  <div
                    className="text-xs flex-shrink-0"
                    style={{
                      color: "var(--text3)",
                    }}
                  >
                    {getRelativeDate(
                      a.attemptedAt
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* AI Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-5 mb-4"
        style={{
          borderColor:
            "rgba(167,139,250,0.2)",
        }}
      >
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
            style={{
              background:
                "rgba(167,139,250,0.15)",
              border:
                "1px solid rgba(167,139,250,0.2)",
            }}
          >
            🤖
          </div>

          <div>
            <div
              className="font-syne text-base font-bold"
              style={{ color: "var(--text)" }}
            >
              AI Study Recommendations
            </div>

            <div
              className="text-xs"
              style={{ color: "var(--text3)" }}
            >
              Personalized based on your
              performance
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {aiRecs.map((r, i) => (
            <div
              key={i}
              className="p-4 rounded-xl cursor-pointer transition-all hover:-translate-y-0.5"
              style={{
                background: "var(--bg3)",
                border:
                  "1px solid var(--border)",
              }}
            >
              <div className="text-2xl mb-2">
                {r.icon}
              </div>

              <div
                className="text-sm font-bold mb-1"
                style={{ color: "var(--text)" }}
              >
                {r.title}
              </div>

              <div
                className="text-xs leading-relaxed mb-3"
                style={{
                  color: "var(--text3)",
                }}
              >
                {r.desc}
              </div>

              <span
                className="text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{
                  background: `${r.tagColor}15`,
                  color: r.tagColor,
                  border: `1px solid ${r.tagColor}30`,
                }}
              >
                {r.tag}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Quick Start */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="glass-card p-5"
      >
        <div className="flex justify-between items-center mb-4">
          <div
            className="font-syne text-base font-bold"
            style={{ color: "var(--text)" }}
          >
            Quick Start
          </div>

          <Link
            href="/categories"
            className="text-xs font-semibold px-3 py-1.5 rounded-xl transition-all"
            style={{
              background:
                "linear-gradient(135deg, #4f7fff, #a78bfa)",
              color: "#fff",
            }}
          >
            Browse All →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {CATEGORIES.slice(0, 3).map((cat) => {
            const info =
              getCategoryInfo(cat);

            return (
              <Link
                key={cat}
                href={`/categories?cat=${cat}`}
                className="flex items-center gap-3 p-3.5 rounded-xl transition-all hover:-translate-y-0.5"
                style={{
                  background: "var(--bg3)",
                  border:
                    "1px solid var(--border)",
                }}
              >
                <div className="text-2xl">
                  {info.icon}
                </div>

                <div>
                  <div
                    className="text-sm font-semibold capitalize"
                    style={{
                      color: "var(--text)",
                    }}
                  >
                    {cat}
                  </div>

                  <div
                    className="text-xs"
                    style={{
                      color: "var(--text3)",
                    }}
                  >
                    {info.count} questions
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

function StatCard({
  label,
  value,
  change,
  up,
  icon,
  color,
}: {
  label: string;
  value: string;
  change: string;
  up: boolean;
  icon: string;
  color: string;
}) {
  return (
    <div
      className="glass-card p-4 relative overflow-hidden cursor-pointer group transition-all hover:-translate-y-1"
      onMouseEnter={(e) =>
        (((e.currentTarget as HTMLElement)
          .style.boxShadow = `0 8px 32px ${color}20`))
      }
      onMouseLeave={(e) =>
        (((e.currentTarget as HTMLElement)
          .style.boxShadow = "none"))
      }
    >
      <div
        className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-5 -translate-y-1/2 translate-x-1/2"
        style={{ background: color }}
      />

      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3"
        style={{
          background: `${color}15`,
          border: `1px solid ${color}25`,
        }}
      >
        {icon}
      </div>

      <div
        className="font-syne text-2xl font-bold mb-0.5"
        style={{ color: "var(--text)" }}
      >
        {value}
      </div>

      <div
        className="text-xs mb-1.5"
        style={{ color: "var(--text3)" }}
      >
        {label}
      </div>

      <div
        className="text-xs font-semibold"
        style={{
          color: up
            ? "var(--green)"
            : "var(--red)",
        }}
      >
        {up ? "↑" : "↓"} {change}
      </div>
    </div>
  );
}