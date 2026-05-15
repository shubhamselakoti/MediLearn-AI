"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { getCategoryInfo } from "@/lib/utils";
import type { QuizCategory } from "@/types";

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
  questionType: string;
  difficulty: string;
  score: number;
  percentageScore: number;
  attemptedAt: string;
  xpEarned: number;
};

type VideoActivity = {
  _id: string;
  videoTitle: string;
  videoUrl: string;
  score: number;
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

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/user/analytics")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setData(d.data);

          // merge history
          const merged = [
            ...(d.data.recentActivity || []).map((item: any) => ({
              ...item,
              type: "quiz",
            })),

            ...(d.data.videoHistory || []).map((item: any) => ({
              ...item,
              type: "video",
            })),
          ]
            .sort(
              (a, b) =>
                new Date(b.attemptedAt).getTime() -
                new Date(a.attemptedAt).getTime()
            )
            .slice(0, 5);

          setHistory(merged);
        }
      })
      .catch(console.error);
  }, []);

  const totalQuizzes = data?.totalQuizzes ?? 0;
  const totalVideoQuizzes = data?.totalVideoQuizzes ?? 0;
  const avgScore = data?.avgScore ?? 0;
  const totalXP = data?.totalXP ?? 0;
  const weeklyData = data?.weeklyData ?? [0, 0, 0, 0, 0, 0, 0];

  // strongest categories
  const strong = useMemo(() => {
    return [...(data?.categoryStats || [])]
      .sort((a, b) => b.avgScore - a.avgScore)
      .slice(0, 3)
      .map((c) => ({
        cat: c.category as QuizCategory,
        pct: Math.round(c.avgScore),
      }));
  }, [data]);

  // weakest categories
  const weak = useMemo(() => {
    return [...(data?.categoryStats || [])]
      .sort((a, b) => a.avgScore - b.avgScore)
      .slice(0, 3)
      .map((c) => ({
        cat: c.category as QuizCategory,
        pct: Math.round(c.avgScore),
      }));
  }, [data]);

  // score distribution from category averages
  const DIST_DATA =
    data?.categoryStats?.map((c) => Math.round(c.avgScore)) || [];

  const maxDist = Math.max(...DIST_DATA, 1);

  const getRelativeDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();

    const diff = now.getTime() - date.getTime();

    const mins = Math.floor(diff / 60000);
    const hrs = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (mins < 60) return `${mins} min ago`;
    if (hrs < 24) return `${hrs} hr ago`;
    if (days === 1) return "Yesterday";

    return `${days} days ago`;
  };

  return (
    <div className="page-in">
      {/* Header */}
      <div className="mb-6">
        <h2
          className="font-syne text-2xl font-bold mb-1"
          style={{ color: "var(--text)" }}
        >
          Analytics
        </h2>

        <p className="text-sm" style={{ color: "var(--text2)" }}>
          Deep dive into your learning performance
        </p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {[
          {
            label: "Total Quizzes",
            value: totalQuizzes,
            icon: "📝",
            color: "var(--accent)",
          },
          {
            label: "Video Quizzes",
            value: totalVideoQuizzes,
            icon: "📹",
            color: "var(--green)",
          },
          {
            label: "Accuracy",
            value: `${avgScore}%`,
            icon: "🎯",
            color: "var(--yellow)",
          },
          {
            label: "XP Earned",
            value: totalXP,
            icon: "⚡",
            color: "var(--purple)",
          },
        ].map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="glass-card p-4 relative overflow-hidden hover:-translate-y-1 transition-all"
          >
            <div
              className="absolute top-0 right-0 w-16 h-16 rounded-full -translate-y-1/2 translate-x-1/2 opacity-5"
              style={{ background: s.color }}
            />

            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-lg mb-3"
              style={{ background: `${s.color}15` }}
            >
              {s.icon}
            </div>

            <div
              className="font-syne text-2xl font-bold mb-0.5"
              style={{ color: "var(--text)" }}
            >
              {s.value}
            </div>

            <div className="text-xs" style={{ color: "var(--text3)" }}>
              {s.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Strong & Weak */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Strong */}
        <div className="glass-card p-5">
          <div
            className="font-syne text-base font-bold mb-1"
            style={{ color: "var(--text)" }}
          >
            Strongest Categories
          </div>

          <div
            className="text-xs mb-4"
            style={{ color: "var(--text3)" }}
          >
            Your best performing specialties
          </div>

          <div className="space-y-3.5">
            {strong.map(({ cat, pct }) => {
              const info = getCategoryInfo(cat);

              return (
                <div key={cat}>
                  <div className="flex justify-between mb-1.5">
                    <span
                      className="text-sm font-medium"
                      style={{ color: "var(--text2)" }}
                    >
                      {info.icon}{" "}
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </span>

                    <span
                      className="text-sm font-bold"
                      style={{ color: "var(--green)" }}
                    >
                      {pct}%
                    </span>
                  </div>

                  <div
                    className="h-2 rounded-full overflow-hidden"
                    style={{ background: "var(--bg3)" }}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 1 }}
                      className="h-full rounded-full"
                      style={{ background: info.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Weak */}
        <div className="glass-card p-5">
          <div
            className="font-syne text-base font-bold mb-1"
            style={{ color: "var(--text)" }}
          >
            Weakest Categories
          </div>

          <div
            className="text-xs mb-4"
            style={{ color: "var(--text3)" }}
          >
            Areas needing more practice
          </div>

          <div className="space-y-3.5">
            {weak.map(({ cat, pct }) => {
              const info = getCategoryInfo(cat);

              return (
                <div key={cat}>
                  <div className="flex justify-between mb-1.5">
                    <span
                      className="text-sm font-medium"
                      style={{ color: "var(--text2)" }}
                    >
                      {info.icon}{" "}
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </span>

                    <span
                      className="text-sm font-bold"
                      style={{ color: "var(--red)" }}
                    >
                      {pct}%
                    </span>
                  </div>

                  <div
                    className="h-2 rounded-full overflow-hidden"
                    style={{ background: "var(--bg3)" }}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 1 }}
                      className="h-full rounded-full"
                      style={{ background: "var(--red)" }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quiz History */}
      <div className="glass-card p-5 mb-4">
        <div
          className="font-syne text-base font-bold mb-4"
          style={{ color: "var(--text)" }}
        >
          Recent Activity
        </div>

        <div>
          {history.map((h, i) => {
            const score =
              h.percentageScore || h.score || 0;

            const scoreColor =
              score >= 80
                ? "var(--green)"
                : score >= 60
                ? "var(--yellow)"
                : "var(--red)";

            const tagLabel =
              score >= 80
                ? "Great"
                : score >= 60
                ? "Okay"
                : "Review";

            const isVideo = h.type === "video";

            const category = isVideo
              ? "Video Quiz"
              : h.category;

            const info = !isVideo
              ? getCategoryInfo(h.category as QuizCategory)
              : null;

            return (
              <div
                key={h._id}
                className="flex items-center gap-3 py-3"
                style={{
                  borderBottom:
                    i < history.length - 1
                      ? "1px solid var(--border)"
                      : "none",
                }}
              >
                <div className="text-xl flex-shrink-0">
                  {isVideo ? "📹" : info?.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div
                    className="text-sm font-semibold"
                    style={{ color: "var(--text)" }}
                  >
                    {isVideo
                      ? h.videoTitle
                      : category.charAt(0).toUpperCase() +
                        category.slice(1)}
                  </div>

                  <div
                    className="text-xs"
                    style={{ color: "var(--text3)" }}
                  >
                    {getRelativeDate(h.attemptedAt)} ·{" "}
                    {isVideo ? "Video Quiz" : h.quizMode} ·{" "}
                    {h.difficulty || "Intermediate"}
                  </div>
                </div>

                <div
                  className="text-lg font-bold"
                  style={{ color: scoreColor }}
                >
                  {score}%
                </div>

                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{
                    background: `${scoreColor}15`,
                    color: scoreColor,
                    border: `1px solid ${scoreColor}30`,
                  }}
                >
                  {tagLabel}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Distribution */}
      <div className="glass-card p-5">
        <div
          className="font-syne text-base font-bold mb-1"
          style={{ color: "var(--text)" }}
        >
          Category Performance
        </div>

        <div
          className="text-xs mb-5"
          style={{ color: "var(--text3)" }}
        >
          Average score across categories
        </div>

        <div className="flex items-end gap-2 h-32">
          {DIST_DATA.map((v, i) => {
            const hue = Math.round((i / DIST_DATA.length) * 120);

            return (
              <div
                key={i}
                className="flex-1 group relative cursor-pointer"
              >
                <motion.div
                  initial={{ height: 0 }}
                  animate={{
                    height: `${(v / maxDist) * 100}%`,
                  }}
                  transition={{
                    duration: 0.8,
                    delay: i * 0.06,
                  }}
                  className="w-full rounded-t-md"
                  style={{
                    background: `hsl(${hue},70%,50%)`,
                    opacity: 0.8,
                  }}
                />

                <div
                  className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap px-1.5 py-0.5 rounded"
                  style={{
                    background: "var(--surface3)",
                    color: "var(--text)",
                  }}
                >
                  {v}%
                </div>
              </div>
            );
          })}
        </div>

        <div
          className="grid gap-2 mt-3"
          style={{
            gridTemplateColumns: `repeat(${DIST_DATA.length}, minmax(0, 1fr))`,
          }}
        >
          {(data?.categoryStats || []).map((c) => (
            <div
              key={c.category}
              className="text-center text-[10px] capitalize"
              style={{ color: "var(--text3)" }}
            >
              {c.category}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}