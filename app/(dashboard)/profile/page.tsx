"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { motion } from "framer-motion";

import {
  getLevelTitle,
  xpToNextLevel,
} from "@/lib/utils";

type AnalyticsData = {
  totalQuizzes: number;
  totalVideoQuizzes: number;
  avgScore: number;
  totalXP: number;
  streak: number;
  level: number;
  weeklyData: number[];
  categoryStats: {
    category: string;
    avgScore: number;
    totalAttempts: number;
    bestScore: number;
  }[];
  recentActivity: any[];
  videoHistory: any[];
};

export default function ProfilePage() {
  const { data: session } = useSession();

  const user = session?.user;

  const xp =
    (user as { xp?: number })?.xp ?? 0;

  const streak =
    (user as { streak?: number })?.streak ??
    0;

  const level =
    (user as { level?: number })?.level ?? 1;

  const {
    current,
    needed,
    percent,
  } = xpToNextLevel(xp);

  const [analytics, setAnalytics] =
    useState<AnalyticsData | null>(null);

  useEffect(() => {
    fetch("/api/user/analytics")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setAnalytics(d.data);
        }
      })
      .catch(console.error);
  }, []);

  const stats = [
    {
      label: "Quizzes",
      value:
        analytics?.totalQuizzes?.toString() ||
        "0",
    },

    {
      label: "Avg Score",
      value: `${analytics?.avgScore || 0}%`,
    },

    {
      label: "Total XP",
      value:
        analytics?.totalXP?.toLocaleString() ||
        "0",
    },

    {
      label: "Video Quizzes",
      value:
        analytics?.totalVideoQuizzes?.toString() ||
        "0",
    },
  ];

  const strongestCategory =
    analytics?.categoryStats
      ?.sort((a, b) => b.avgScore - a.avgScore)
      ?.at(0);

  return (
    <div className="page-in max-w-2xl">
      {/* Heading */}
      <h2
        className="font-syne text-2xl font-bold mb-6"
        style={{ color: "var(--text)" }}
      >
        Profile
      </h2>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 mb-5"
        style={{
          borderColor:
            "rgba(167,139,250,0.2)",
        }}
      >
        <div className="flex items-center gap-5 mb-5">
          {user?.image ? (
            <img
              src={user.image}
              alt=""
              className="w-20 h-20 rounded-2xl flex-shrink-0 object-cover"
            />
          ) : (
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center font-bold text-2xl flex-shrink-0"
              style={{
                background:
                  "linear-gradient(135deg,#4f7fff,#a78bfa)",
                color: "#fff",
              }}
            >
              {(user?.name ?? "U")[0].toUpperCase()}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div
              className="font-syne text-xl font-bold mb-0.5"
              style={{ color: "var(--text)" }}
            >
              {user?.name ??
                "Medical Student"}
            </div>

            <div
              className="text-sm mb-3"
              style={{
                color: "var(--text3)",
              }}
            >
              {user?.email}
            </div>

            <div className="flex flex-wrap gap-2">
              <span
                className="text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{
                  background:
                    "rgba(79,127,255,0.12)",
                  color: "var(--accent)",
                  border:
                    "1px solid rgba(79,127,255,0.2)",
                }}
              >
                {getLevelTitle(level)}
              </span>

              {streak > 0 && (
                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{
                    background:
                      "rgba(255,201,60,0.12)",
                    color: "var(--yellow)",
                    border:
                      "1px solid rgba(255,201,60,0.2)",
                  }}
                >
                  🔥 {streak} Streak
                </span>
              )}

              <span
                className="text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{
                  background:
                    "rgba(167,139,250,0.12)",
                  color: "var(--purple)",
                  border:
                    "1px solid rgba(167,139,250,0.2)",
                }}
              >
                Level {level}
              </span>

              {strongestCategory && (
                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded-full capitalize"
                  style={{
                    background:
                      "rgba(34,208,122,0.12)",
                    color: "var(--green)",
                    border:
                      "1px solid rgba(34,208,122,0.2)",
                  }}
                >
                  🏆{" "}
                  {
                    strongestCategory.category
                  }
                </span>
              )}
            </div>
          </div>
        </div>

        <div
          className="h-px mb-5"
          style={{
            background: "var(--border)",
          }}
        />

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <div
                className="font-syne text-xl font-bold mb-0.5"
                style={{
                  color: "var(--text)",
                }}
              >
                {s.value}
              </div>

              <div
                className="text-xs"
                style={{
                  color: "var(--text3)",
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* XP Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-5 mb-5"
      >
        <div
          className="font-syne text-base font-bold mb-4"
          style={{ color: "var(--text)" }}
        >
          XP Progression
        </div>

        <div className="flex justify-between mb-2">
          <span
            className="text-sm"
            style={{
              color: "var(--text2)",
            }}
          >
            Level {level} —{" "}
            {getLevelTitle(level)}
          </span>

          <span
            className="text-sm font-bold"
            style={{
              color: "var(--accent)",
            }}
          >
            {current.toLocaleString()} /{" "}
            {needed.toLocaleString()} XP
          </span>
        </div>

        <div
          className="h-3 rounded-full overflow-hidden"
          style={{
            background: "var(--bg3)",
          }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{
              width: `${percent}%`,
            }}
            transition={{
              duration: 1.2,
              ease: "easeOut",
            }}
            className="h-full rounded-full"
            style={{
              background:
                "linear-gradient(90deg,#4f7fff,#a78bfa)",
            }}
          />
        </div>

        <div
          className="flex justify-between mt-2 text-xs"
          style={{
            color: "var(--text3)",
          }}
        >
          <span>
            {percent}% to Level{" "}
            {level + 1}
          </span>

          <span>
            {(
              needed - current
            ).toLocaleString()}{" "}
            XP remaining
          </span>
        </div>
      </motion.div>

      {/* Performance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
        className="glass-card p-5 mb-5"
      >
        <div
          className="font-syne text-base font-bold mb-4"
          style={{ color: "var(--text)" }}
        >
          Performance Overview
        </div>

        <div className="space-y-4">
          {analytics?.categoryStats
            ?.slice(0, 4)
            ?.map((cat) => (
              <div key={cat.category}>
                <div className="flex justify-between mb-1.5">
                  <span
                    className="text-sm capitalize"
                    style={{
                      color: "var(--text2)",
                    }}
                  >
                    {cat.category}
                  </span>

                  <span
                    className="text-sm font-bold"
                    style={{
                      color: "var(--text)",
                    }}
                  >
                    {Math.round(
                      cat.avgScore
                    )}
                    %
                  </span>
                </div>

                <div
                  className="h-2 rounded-full overflow-hidden"
                  style={{
                    background:
                      "var(--bg3)",
                  }}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${cat.avgScore}%`,
                    }}
                    transition={{
                      duration: 1,
                    }}
                    className="h-full rounded-full"
                    style={{
                      background:
                        cat.avgScore >= 80
                          ? "var(--green)"
                          : cat.avgScore >= 60
                          ? "var(--yellow)"
                          : "var(--red)",
                    }}
                  />
                </div>
              </div>
            ))}
        </div>
      </motion.div>

      {/* Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="glass-card p-5"
      >
        <div
          className="font-syne text-base font-bold mb-4"
          style={{ color: "var(--text)" }}
        >
          Settings
        </div>

        

        <div
          className="h-px my-4"
          style={{
            background: "var(--border)",
          }}
        />

        <button
          onClick={() =>
            signOut({
              callbackUrl: "/sign-in",
            })
          }
          className="px-5 py-2.5 rounded-xl text-sm font-semibold"
          style={{
            background:
              "rgba(255,91,122,0.12)",
            color: "var(--red)",
            border:
              "1px solid rgba(255,91,122,0.25)",
          }}
        >
          Sign Out →
        </button>
      </motion.div>
    </div>
  );
}