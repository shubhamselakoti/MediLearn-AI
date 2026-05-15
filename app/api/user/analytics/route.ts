import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import QuizAttempt from "@/models/QuizAttempt";
import VideoQuizScore from "@/models/VideoQuizScore";
import User from "@/models/User";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const uid = session.user.id;

    const [attempts, videoAttempts, user] = await Promise.all([
      QuizAttempt.find({ userId: uid }).sort({ attemptedAt: -1 }).lean(),
      VideoQuizScore.find({ userId: uid }).sort({ attemptedAt: -1 }).lean(),
      User.findById(uid).lean(),
    ]);

    // Category breakdown
    const categoryMap: Record<string, { total: number; sumPct: number; best: number }> = {};
    for (const a of attempts) {
      const cat = a.category;
      if (!categoryMap[cat]) categoryMap[cat] = { total: 0, sumPct: 0, best: 0 };
      categoryMap[cat].total++;
      categoryMap[cat].sumPct += a.percentageScore;
      categoryMap[cat].best = Math.max(categoryMap[cat].best, a.percentageScore);
    }
    const categoryStats = Object.entries(categoryMap).map(([category, s]) => ({
      category,
      avgScore: Math.round(s.sumPct / s.total),
      totalAttempts: s.total,
      bestScore: s.best,
    }));

    // Weekly data (last 7 days avg scores)
    const now = Date.now();
    const weeklyData = Array.from({ length: 7 }, (_, i) => {
      const dayStart = now - (6 - i) * 86400000;
      const dayEnd = dayStart + 86400000;
      const dayAttempts = attempts.filter((a) => {
        const t = new Date(a.attemptedAt).getTime();
        return t >= dayStart && t < dayEnd;
      });
      if (!dayAttempts.length) return 0;
      return Math.round(dayAttempts.reduce((s, a) => s + a.percentageScore, 0) / dayAttempts.length);
    });

    const avgScore =
      attempts.length
        ? Math.round(attempts.reduce((s, a) => s + a.percentageScore, 0) / attempts.length)
        : 0;

    return NextResponse.json({
      success: true,
      data: {
        totalQuizzes: attempts.length,
        totalVideoQuizzes: videoAttempts.length,
        avgScore,
        totalXP: user?.xp ?? 0,
        streak: user?.streak ?? 0,
        level: user?.level ?? 1,
        categoryStats,
        recentActivity: attempts.slice(0, 10),
        videoHistory: videoAttempts.slice(0, 5),
        weeklyData,
      }
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json({ success: false, error: "Failed to load analytics" }, { status: 500 });
  }
}
