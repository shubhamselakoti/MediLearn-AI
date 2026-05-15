import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import QuizAttempt from "@/models/QuizAttempt";
import User from "@/models/User";
import { calculateLevel } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();

    const attempt = await QuizAttempt.create({
      userId: session.user.id,
      ...body,
      attemptedAt: new Date(),
    });

    // Update user XP and level
    const xpEarned = body.xpEarned ?? body.score ?? 0;
    const user = await User.findById(session.user.id);
    if (user) {
      user.xp += xpEarned;
      user.level = calculateLevel(user.xp);
      user.lastActive = new Date();
      await user.save();
    }

    return NextResponse.json({ success: true, data: attempt });
  } catch (error) {
    console.error("Save attempt error:", error);
    return NextResponse.json({ success: false, error: "Failed to save attempt" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const attempts = await QuizAttempt.find({ userId: session.user.id })
      .sort({ attemptedAt: -1 })
      .limit(20)
      .lean();

    return NextResponse.json({ success: true, data: attempts });
  } catch (error) {
    console.error("Get attempts error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch history" }, { status: 500 });
  }
}
